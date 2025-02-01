"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConferenceFilterOptions, AVAILABLE_YEARS } from "@/types/conference";
import { useTranslations } from "next-intl";

interface ConferenceFiltersProps {
    onFilterChange: (filters: Partial<ConferenceFilterOptions>) => void;
    currentFilters: ConferenceFilterOptions;
    availableLocations: string[];
}

export function ConferenceFilters({
    onFilterChange,
    currentFilters,
    availableLocations,
}: ConferenceFiltersProps) {
    const t = useTranslations("conference_ranking");

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">📅</span>
                <Select
                    value={currentFilters.year || "all"}
                    onValueChange={(value) =>
                        onFilterChange({ year: value === "all" ? undefined : value })
                    }
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_year")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("filters.all_years")}</SelectItem>
                        {AVAILABLE_YEARS.map((year) => (
                            <SelectItem
                                key={year}
                                value={year}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">📍</span>
                <Select
                    value={currentFilters.location || "all"}
                    onValueChange={(value) =>
                        onFilterChange({ location: value === "all" ? undefined : value })
                    }
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_location")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("filters.all_locations")}</SelectItem>
                        {availableLocations.map((location) => (
                            <SelectItem
                                key={location}
                                value={location}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">🏆</span>
                <Select
                    value={currentFilters.scoreRange ? "top" : "all"}
                    onValueChange={(value) =>
                        onFilterChange({
                            scoreRange:
                                value === "all"
                                    ? undefined
                                    : value === "top10"
                                        ? { min: 30, max: 100 }
                                        : value === "top20"
                                            ? { min: 20, max: 100 }
                                            : { min: 10, max: 100 },
                        })
                    }
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_tier")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("filters.all_tiers")}</SelectItem>
                        <SelectItem value="top10">{t("filters.top_tier")}</SelectItem>
                        <SelectItem value="top20">{t("filters.mid_tier")}</SelectItem>
                        <SelectItem value="top30">{t("filters.entry_tier")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 