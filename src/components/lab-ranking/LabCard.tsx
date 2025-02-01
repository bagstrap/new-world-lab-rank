"use client";

import { Lab, University } from "@/types/lab";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface LabCardProps {
    lab: Lab;
    university: University;
    rank: number;
    selectedField?: string;
}

export function LabCard({ lab, university, rank, selectedField }: LabCardProps) {
    const t = useTranslations("lab_ranking");
    const [showDetails, setShowDetails] = useState(false);

    // Get the fields to display based on selection
    const fieldsToDisplay = selectedField
        ? lab.fields.filter(f => f.name === selectedField)
        : lab.fields;

    // Calculate total score for selected field if any
    const selectedFieldScore = selectedField
        ? lab.fields.find(f => f.name === selectedField)?.totalScore || 0
        : lab.totalScore;

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-gray-100 hover:border-blue-100 bg-white">
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">#{rank}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="truncate">{lab.name}</span>
                                <span className="text-xs text-gray-500 font-normal whitespace-nowrap">
                                    {t("lab")}
                                </span>
                            </h3>
                            <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-600 font-medium">{university.university}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></span>
                                    {university.location.country}
                                </p>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            {selectedField ? (
                                <>
                                    <div className="text-sm font-medium text-gray-500">{t("field_score")}</div>
                                    <div className="text-2xl font-bold text-blue-600">{selectedFieldScore.toFixed(1)}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {t("total")}: {lab.totalScore.toFixed(1)}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm font-medium text-gray-500">{t("total_score")}</div>
                                    <div className="text-2xl font-bold text-blue-600">{lab.totalScore.toFixed(1)}</div>
                                </>
                            )}
                        </div>
                    </div>

                    {fieldsToDisplay.length > 0 && (
                        <div
                            className="mt-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {selectedField ? t("conference_details") : t("field_details")}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({selectedField
                                            ? fieldsToDisplay[0]?.conferences.length + " " + t("conferences")
                                            : fieldsToDisplay.length + " " + t("fields_name")})
                                    </span>
                                </div>
                                <span className="text-gray-400">
                                    {showDetails ? "↑" : "↓"}
                                </span>
                            </div>

                            {showDetails && (
                                <div className="mt-3 space-y-2 pt-3 border-t border-gray-200">
                                    {selectedField ? (
                                        // Show conferences for selected field
                                        fieldsToDisplay[0]?.conferences.map((conference) => (
                                            <div
                                                key={conference.name}
                                                className="flex items-center justify-between text-sm p-2"
                                            >
                                                <span className="text-gray-600">{conference.name}</span>
                                                <span className="font-medium text-gray-900">
                                                    {conference.score.toFixed(1)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        // Show all fields
                                        fieldsToDisplay.map((field) => (
                                            <div
                                                key={field.name}
                                                className="flex items-center justify-between text-sm p-2"
                                            >
                                                <span className="text-gray-600">{field.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${(field.totalScore / lab.totalScore) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-medium text-gray-900">
                                                        {field.totalScore.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
} 
