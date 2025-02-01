"use client";

import { useState, useMemo } from "react";
import { Conference, ConferenceFilterOptions } from "@/types/conference";
import { ConferenceFilters } from "./ConferenceFilters";
import { ConferenceCard } from "./ConferenceCard";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

interface ConferenceRankingProps {
    initialData: Conference[];
}

export function ConferenceRanking({ initialData }: ConferenceRankingProps) {
    const t = useTranslations("conference_ranking");
    const [filters, setFilters] = useState<ConferenceFilterOptions>({});
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique locations from the data
    const availableLocations = useMemo(() => {
        const locations = new Set<string>();
        initialData.forEach((conference) => {
            if (conference.Location) {
                locations.add(conference.Location);
            }
        });
        return Array.from(locations).sort();
    }, [initialData]);

    // Function to filter conferences
    const getFilteredConferences = () => {
        let filteredConferences = initialData;

        // Apply filters
        if (filters.year) {
            filteredConferences = filteredConferences.filter((conference) =>
                conference["Start Date"].includes(filters.year!)
            );
        }

        if (filters.location) {
            filteredConferences = filteredConferences.filter(
                (conference) => conference.Location === filters.location
            );
        }

        if (filters.scoreRange) {
            filteredConferences = filteredConferences.filter(
                (conference) =>
                    conference.Score >= filters.scoreRange!.min &&
                    conference.Score <= filters.scoreRange!.max
            );
        }

        // Apply search query
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filteredConferences = filteredConferences.filter((conference) =>
                conference["Conference Name"].toLowerCase().includes(searchLower)
            );
        }

        return filteredConferences;
    };

    const filteredConferences = getFilteredConferences();

    return (
        <div className="space-y-8">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-6 border-b">
                <div className="max-w-5xl mx-auto px-4">
                    <ConferenceFilters
                        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
                        currentFilters={filters}
                        availableLocations={availableLocations}
                    />
                    <div className="mt-4">
                        <Input
                            type="text"
                            placeholder={t("search_placeholder")}
                            className="max-w-md w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchQuery(e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 space-y-4">
                {filteredConferences.map((conference) => (
                    <ConferenceCard
                        key={`${conference["Conference Name"]}-${conference.Rank}`}
                        conference={conference}
                    />
                ))}

                {filteredConferences.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t("no_results")}</p>
                    </div>
                )}
            </div>
        </div>
    );
} 