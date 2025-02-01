// 컨퍼런스 정보
export type Conference = {
    name: string;
    score: number;
};

// 연구 분야 정보
export type ResearchField = {
    name: string;
    conferences: Conference[];
    totalScore: number;
};

// 연구실 정보
export type Lab = {
    name: string;
    fields: ResearchField[];
    totalScore: number;
};

// 위치 정보
export type Location = {
    lat: number;
    lng: number;
    country: string;
    continent: string;
    formatted_address: string;
};

// 대학교 정보
export type University = {
    university: string;
    location: Location;
    labs: Lab[];
    totalScore: number;
};

// 전체 데이터 타입
export type LabData = University[];

// 대륙 타입
export const ContinentType = {
    NORTH_AMERICA: 'North America',
    SOUTH_AMERICA: 'South America',
    EUROPE: 'Europe',
    ASIA: 'Asia',
    OCEANIA: 'Oceania',
    AFRICA: 'Africa',
} as const;

export type Continent = typeof ContinentType[keyof typeof ContinentType];

// 연구 분야 타입
export const FieldType = {
    COMPUTER_VISION: 'Computer Vision',
    MACHINE_LEARNING: 'Machine Learning',
    GENERAL_AI: 'General AI',
    NLP: 'NLP',
} as const;

export type Field = typeof FieldType[keyof typeof FieldType];

// 컨퍼런스 타입
export const ConferenceType = {
    CVPR: 'CVPR',
    ICCV: 'ICCV',
    ECCV: 'ECCV',
    WACV: 'WACV',
    NIPS: 'NIPS',
    ICML: 'ICML',
    ICLR: 'ICLR',
    ACL: 'ACL',
    NAACL: 'NAACL',
    ACL_EMNLP: 'ACL_EMNLP',
    AAAI_CAI: 'AAAI_CAI',
    EACL: 'EACL',
} as const;

export type ConferenceName = typeof ConferenceType[keyof typeof ConferenceType];

// 필터 옵션 타입
export type FilterOptions = {
    continent?: Continent;
    country?: string;
    field?: Field;
    conference?: ConferenceName;
    minScore?: number;
    maxScore?: number;
};

// 정렬 옵션 타입
export type SortOptions = {
    field: 'totalScore' | 'university' | 'country' | 'continent';
    direction: 'asc' | 'desc';
};

// 검색 옵션 타입
export type SearchOptions = {
    query: string;
    searchIn: ('university' | 'lab' | 'field')[];
}; 