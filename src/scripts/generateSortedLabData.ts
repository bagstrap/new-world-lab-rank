import fs from 'fs';
import path from 'path';

// 타입 정의
type ConferenceMapping = {
    [key: string]: string;
};

type LabScore = {
    [university: string]: {
        [lab: string]: {
            [conference: string]: number;
        };
    };
};

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

// 파일 읽기
const labScoreData: LabScore = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/lab_score.json'), 'utf-8')
);

const conferenceMappingData: ConferenceMapping = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/conference_mapping.json'), 'utf-8')
);

// 데이터 변환 및 정렬
const transformData = () => {
    const result: SortedLabData = [];

    // 대학별로 순회
    Object.entries(labScoreData).forEach(([university, labs]) => {
        // 랩실별로 순회
        Object.entries(labs).forEach(([lab, conferences]) => {
            if (lab === 'Total') return; // Total 항목 제외

            // 분야별로 컨퍼런스 그룹화
            const conferencesByField: { [field: string]: { name: string; score: number }[] } = {};

            Object.entries(conferences).forEach(([conference, score]) => {
                if (conference === 'Total') return; // Total 항목 제외

                const field = conferenceMappingData[conference] || 'Other';
                if (!conferencesByField[field]) {
                    conferencesByField[field] = [];
                }
                conferencesByField[field].push({
                    name: conference,
                    score,
                });
            });

            // 각 분야별로 데이터 추가
            Object.entries(conferencesByField).forEach(([field, confList]) => {
                const totalScore = confList.reduce((sum, conf) => sum + conf.score, 0);
                result.push({
                    university,
                    lab,
                    field,
                    conferences: confList.sort((a, b) => b.score - a.score), // 점수 기준 내림차순 정렬
                    totalScore,
                });
            });
        });
    });

    // 최종 정렬: 대학 > 랩실 > 분야 > 총점 순
    return result.sort((a, b) => {
        if (a.university !== b.university) return a.university.localeCompare(b.university);
        if (a.lab !== b.lab) return a.lab.localeCompare(b.lab);
        if (a.field !== b.field) return a.field.localeCompare(b.field);
        return b.totalScore - a.totalScore;
    });
};

// 데이터 변환 실행 및 파일 저장
const sortedData = transformData();
fs.writeFileSync(
    path.join(process.cwd(), 'src/data/sorted_lab_data.json'),
    JSON.stringify(sortedData, null, 2),
    'utf-8'
);

console.log('Data has been successfully transformed and saved to sorted_lab_data.json');