import fs from 'fs';
import path from 'path';

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

type UniversityLocations = {
    [key: string]: {
        lat: number;
        lng: number;
        country: string;
        continent: string;
        formatted_address: string;
    };
};

type FinalLabData = {
    university: string;
    location: {
        lat: number;
        lng: number;
        country: string;
        continent: string;
        formatted_address: string;
    };
    labs: {
        name: string;
        fields: {
            name: string;
            conferences: {
                name: string;
                score: number;
            }[];
            totalScore: number;
        }[];
        totalScore: number;
    }[];
    totalScore: number;
}[];

// 파일 읽기
const sortedLabData: SortedLabData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/sorted_lab_data.json'), 'utf-8')
);

const universityLocations: UniversityLocations = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/university_locations.json'), 'utf-8')
);

// 데이터 변환
const transformData = (): FinalLabData => {
    // 대학별로 데이터 그룹화
    const universityMap = new Map<string, {
        labs: Map<string, {
            fields: Map<string, {
                conferences: { name: string; score: number; }[];
                totalScore: number;
            }>;
            totalScore: number;
        }>;
        totalScore: number;
    }>();

    // 데이터 그룹화
    sortedLabData.forEach(item => {
        if (!universityMap.has(item.university)) {
            universityMap.set(item.university, {
                labs: new Map(),
                totalScore: 0
            });
        }
        const universityData = universityMap.get(item.university)!;

        if (!universityData.labs.has(item.lab)) {
            universityData.labs.set(item.lab, {
                fields: new Map(),
                totalScore: 0
            });
        }
        const labData = universityData.labs.get(item.lab)!;

        if (!labData.fields.has(item.field)) {
            labData.fields.set(item.field, {
                conferences: item.conferences,
                totalScore: item.totalScore
            });
        }

        // 점수 업데이트
        labData.totalScore += item.totalScore;
        universityData.totalScore += item.totalScore;
    });

    // Map을 배열로 변환
    const result: FinalLabData = Array.from(universityMap.entries()).map(([university, data]) => ({
        university,
        location: universityLocations[university],
        labs: Array.from(data.labs.entries()).map(([name, lab]) => ({
            name,
            fields: Array.from(lab.fields.entries()).map(([name, field]) => ({
                name,
                conferences: field.conferences,
                totalScore: field.totalScore
            })),
            totalScore: lab.totalScore
        })),
        totalScore: data.totalScore
    }));

    // 총점 기준으로 정렬
    return result.sort((a, b) => b.totalScore - a.totalScore);
};

// 메인 함수
const main = () => {
    try {
        const finalData = transformData();

        // 결과 저장
        fs.writeFileSync(
            path.join(process.cwd(), 'src/data/final_lab_data.json'),
            JSON.stringify(finalData, null, 2),
            'utf-8'
        );

        console.log('Final data has been successfully saved to final_lab_data.json');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

main(); 