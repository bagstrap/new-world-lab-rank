"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContinentType, FieldType, ConferenceType, FilterOptions } from "@/types/lab";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface LabFiltersProps {
    onFilterChange: (filters: Partial<FilterOptions>) => void;
    currentFilters: FilterOptions;
    availableCountries: Array<{
        name: string;
        continent: string;
    }>;
}

export function LabFilters({ onFilterChange, currentFilters, availableCountries }: LabFiltersProps) {
    const t = useTranslations("lab_ranking");

    // Filter countries based on selected continent
    const filteredCountries = useMemo(() => {
        let countries = availableCountries;

        if (currentFilters.continent) {
            countries = countries.filter(country =>
                country.continent === currentFilters.continent
            );
        }

        return countries
            .map(country => country.name)
            .sort((a, b) => a.localeCompare(b));
    }, [availableCountries, currentFilters.continent]);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">🌎</span>
                <Select
                    value={currentFilters.continent || "all"}
                    onValueChange={(value) => {
                        onFilterChange({
                            continent: value === "all" ? undefined : value as any,
                            country: undefined // Reset country when continent changes
                        });
                    }}
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_continent")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t("filters.all_continents")}
                        </SelectItem>
                        {Object.values(ContinentType).map((continent) => (
                            <SelectItem
                                key={continent}
                                value={continent}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {t(`continents.${continent.toLowerCase()}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">🏳️</span>
                <Select
                    value={currentFilters.country || "all"}
                    onValueChange={(value) => onFilterChange({ country: value === "all" ? undefined : value })}
                >
                    <SelectTrigger
                        className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                        disabled={filteredCountries.length === 0}
                    >
                        <SelectValue placeholder={t("filters.select_country")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t("filters.all_countries")}
                        </SelectItem>
                        {filteredCountries.map((country) => (
                            <SelectItem
                                key={country}
                                value={country}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">🔬</span>
                <Select
                    value={currentFilters.field || "all"}
                    onValueChange={(value) => onFilterChange({ field: value === "all" ? undefined : value as any })}
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_field")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t("filters.all_fields")}
                        </SelectItem>
                        {Object.values(FieldType).map((field) => (
                            <SelectItem
                                key={field}
                                value={field}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {t(`fields.${field.toLowerCase()}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">📊</span>
                <Select
                    value={currentFilters.conference || "all"}
                    onValueChange={(value) => onFilterChange({ conference: value === "all" ? undefined : value as any })}
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder={t("filters.select_conference")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t("filters.all_conferences")}
                        </SelectItem>
                        {Object.values(ConferenceType).map((conference) => (
                            <SelectItem
                                key={conference}
                                value={conference}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                {conference}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 
