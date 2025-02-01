"use client";

import { Conference } from "@/types/conference";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";

interface ConferenceCardProps {
    conference: Conference;
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
    const t = useTranslations("conference_ranking");

    // Parse dates from DD-MM-YYYY format
    const parseDate = (dateStr: string) => {
        try {
            return parse(dateStr, "dd-MM-yyyy", new Date());
        } catch (error) {
            console.error("Error parsing date:", error);
            return null;
        }
    };

    const startDate = parseDate(conference["Start Date"]);
    const endDate = parseDate(conference["End Date"]);

    const formatDate = (date: Date | null) => {
        return date ? format(date, "MMM d, yyyy") : "";
    };

    const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-gray-100 hover:border-blue-100 bg-white">
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">#{conference.Rank}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {conference["Conference Name"]}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                    <span>{dateRange}</span>
                                </p>
                                {conference.Location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{conference.Location}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <div className="text-sm font-medium text-gray-500">{t("score")}</div>
                            <div className="text-2xl font-bold text-blue-600">{conference.Score.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
} 