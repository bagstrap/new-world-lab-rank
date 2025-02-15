export interface ScaleData {
    letter_grade: string | null;
    scale_from: number | null;
    scale_to: number | null;
    description: string | null;
    grade_points: string | null;
    notes: string | null;
}

export interface GradingScale {
    GradingScaleID: number;
    CountryID: number;
    GradingScaleName: string;
    GradingScaleDescription?: string;
    SortOrder?: number;
    WebEnabled: boolean;
    Uncommon: boolean;
    ReportsEnabled?: boolean;
    CreationDateTime: string;
    LastChangeDateTime: string;
    EducationStageID?: number;
    scale_data: ScaleData[];
}

export interface CountryScales {
    country_id: number;
    common_scales: GradingScale[];
    all_scales?: GradingScale[];
}

export interface ScaleDataJson {
    [country: string]: CountryScales;
}
