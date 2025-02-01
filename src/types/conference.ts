export interface Conference {
    Rank: number;
    "Conference Name": string;
    "Start Date": string;
    "End Date": string;
    Location: string;
    Score: number;
}

export type ConferenceData = Conference[];

// Filter options for conferences
export interface ConferenceFilterOptions {
    year?: string;
    location?: string;
    scoreRange?: {
        min: number;
        max: number;
    };
    searchQuery?: string;
}

// Available years for filtering (2021-2024)
export const AVAILABLE_YEARS = ["2021", "2022", "2023", "2024"] as const;
export type Year = typeof AVAILABLE_YEARS[number]; 