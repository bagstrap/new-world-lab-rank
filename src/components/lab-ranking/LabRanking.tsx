"use client";

import { useState, useMemo } from "react";
import { LabData, FilterOptions, SortOptions, Lab, University } from "@/types/lab";
import { LabFilters } from "./LabFilters";
import { LabCard } from "./LabCard";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

interface LabRankingProps {
    initialData: LabData;
}

export function LabRanking({ initialData }: LabRankingProps) {
    const t = useTranslations("lab_ranking");
    const [filters, setFilters] = useState<FilterOptions>({});
    const [sortOption] = useState<SortOptions>({
        field: "totalScore",
        direction: "desc",
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique countries with their continents from the data
    const availableCountries = useMemo(() => {
        const countrySet = new Set<string>();
        const countries: Array<{ name: string; continent: string }> = [];

        initialData.forEach((university) => {
            const countryName = university.location.country;
            if (!countrySet.has(countryName)) {
                countrySet.add(countryName);
                countries.push({
                    name: countryName,
                    continent: university.location.continent
                });
            }
        });

        return countries;
    }, [initialData]);

    // Function to filter and sort labs
    const getFilteredAndSortedLabs = () => {
        let flattenedLabs: { lab: Lab; university: University; rank: number }[] = [];

        // Flatten the data structure
        initialData.forEach((university) => {
            university.labs.forEach((lab) => {
                flattenedLabs.push({ lab, university, rank: 0 });
            });
        });

        // Apply filters
        let filteredLabs = flattenedLabs.filter(({ lab, university }) => {
            if (filters.continent && university.location.continent !== filters.continent) return false;
            if (filters.country && university.location.country !== filters.country) return false;

            // For field filter, check if the lab has any score in that field
            if (filters.field) {
                const fieldScore = lab.fields.find(f => f.name === filters.field)?.totalScore || 0;
                if (fieldScore === 0) return false;
            }

            // For conference filter, check if the lab has any score in that conference
            if (filters.conference && !lab.fields.some(f =>
                f.conferences.some(c => c.name === filters.conference && c.score > 0)
            )) return false;

            // Search query
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    lab.name.toLowerCase().includes(searchLower) ||
                    university.university.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });

        // Sort labs by appropriate score
        filteredLabs.sort((a, b) => {
            if (filters.field) {
                const aScore = a.lab.fields.find(f => f.name === filters.field)?.totalScore || 0;
                const bScore = b.lab.fields.find(f => f.name === filters.field)?.totalScore || 0;
                return bScore - aScore;
            }
            return b.lab.totalScore - a.lab.totalScore;
        });

        // Assign ranks
        return filteredLabs.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    };

    const filteredAndSortedLabs = getFilteredAndSortedLabs();

    return (
        <div className="space-y-8">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-6 border-b">
                <div className="max-w-5xl mx-auto px-4">
                    <LabFilters
                        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
                        currentFilters={filters}
                        availableCountries={availableCountries}
                    />
                    <div className="mt-4">
                        <Input
                            type="text"
                            placeholder={t("search_placeholder")}
                            className="max-w-md w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 space-y-4">
                {filteredAndSortedLabs.map(({ lab, university, rank }) => (
                    <LabCard
                        key={`${university.university}-${lab.name}`}
                        lab={lab}
                        university={university}
                        rank={rank}
                        selectedField={filters.field}
                    />
                ))}

                {filteredAndSortedLabs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t("no_results")}</p>
                    </div>
                )}
            </div>
        </div>
    );
} 
