import fs from 'fs';
import path from 'path';
import { Client, AddressType } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// 타입 정의
type SortedLabData = {
    university: string;
    lab: string;
    field: string;
    conferences: {
        name: string;
        score: number;
    }[];
    totalScore: number;
}[];

type UniversityLocation = {
    university: string;
    location: {
        lat: number;
        lng: number;
        country: string;
        continent: string;
        formatted_address: string;
    };
};

type UniversityLocations = {
    [key: string]: {
        lat: number;
        lng: number;
        country: string;
        continent: string;
        formatted_address: string;
    };
};

// 국가별 대륙 매핑
const countryToContinentMap: { [key: string]: string } = {
    // North America
    'US': 'North America',
    'CA': 'North America',
    'MX': 'North America',

    // South America
    'CL': 'South America',
    'BR': 'South America',
    'AR': 'South America',

    // Europe
    'GB': 'Europe',
    'FR': 'Europe',
    'DE': 'Europe',
    'IT': 'Europe',
    'ES': 'Europe',
    'CH': 'Europe',
    'NO': 'Europe',

    // Asia
    'CN': 'Asia',
    'JP': 'Asia',
    'KR': 'Asia',
    'IN': 'Asia',
    'SG': 'Asia',
    'HK': 'Asia',
    'TW': 'Asia',
    'SA': 'Asia',

    // Oceania
    'AU': 'Oceania',
    'NZ': 'Oceania',

    // Africa
    'ZA': 'Africa',
    'EG': 'Africa',
    'NG': 'Africa'
};

// 대륙 매핑 함수 수정
const getContinentFromCountry = (countryCode: string): string => {
    return countryToContinentMap[countryCode] || 'Unknown';
};

// 파일 읽기
const sortedLabData: SortedLabData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/sorted_lab_data.json'), 'utf-8')
);

// Google Maps 클라이언트 초기화
const client = new Client({});

// 중복 제거된 대학교 목록 생성
const universities = [...new Set(sortedLabData.map(item => item.university))];

// 대학교 위치 정보 가져오기
const getUniversityLocations = async (): Promise<UniversityLocations> => {
    const locations: UniversityLocations = {};

    for (const university of universities) {
        try {
            console.log(`Fetching location for: ${university}`);

            const response = await client.geocode({
                params: {
                    address: `${university}`,
                    key: process.env.GOOGLE_MAPS_API_KEY || '',
                },
            });

            if (response.data.results && response.data.results.length > 0) {
                const result = response.data.results[0];
                const country = result.address_components.find(
                    component => component.types.includes(AddressType.country)
                );

                locations[university] = {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                    country: country?.long_name || 'Unknown',
                    continent: getContinentFromCountry(country?.short_name || ''),
                    formatted_address: result.formatted_address,
                };
            }

            // API 속도 제한을 피하기 위한 지연
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`Error fetching location for ${university}:`, error);
        }
    }

    return locations;
};

// 메인 함수
const main = async () => {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.error('Please set GOOGLE_MAPS_API_KEY environment variable');
        process.exit(1);
    }

    try {
        const locations = await getUniversityLocations();

        // 결과 저장
        fs.writeFileSync(
            path.join(process.cwd(), 'src/data/university_locations.json'),
            JSON.stringify(locations, null, 2),
            'utf-8'
        );

        console.log('University locations have been successfully saved to university_locations.json');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

main(); 
