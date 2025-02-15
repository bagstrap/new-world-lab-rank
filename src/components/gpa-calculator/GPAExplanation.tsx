"use client"

import { useTranslations } from "next-intl"

export function GPAExplanation() {
    const t = useTranslations("gpa_calculator.explanation")

    return (
        <div className="bg-white border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
                {t("title")}
            </h3>

            <div className="prose prose-blue max-w-none">
                <p className="text-gray-600">
                    {t("intro")}
                </p>

                <h4 className="text-base font-medium text-gray-900 mt-6">
                    {t("calculation_title")}
                </h4>
                <ol className="list-decimal pl-5 space-y-4 text-gray-600">
                    <li>
                        {t("step1")}
                        <div className="mt-2 overflow-x-auto">
                            <table className="min-w-[300px] divide-y divide-gray-200 border rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            {t("us_grade")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            {t("gpa_points")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[
                                        { grade: "A+/A", points: "4.0" },
                                        { grade: "A-", points: "3.7" },
                                        { grade: "B+", points: "3.3" },
                                        { grade: "B", points: "3.0" },
                                        { grade: "B-", points: "2.7" },
                                        { grade: "C+", points: "2.3" },
                                        { grade: "C", points: "2.0" },
                                        { grade: "C-", points: "1.7" },
                                        { grade: "D+", points: "1.3" },
                                        { grade: "D", points: "1.0" },
                                        { grade: "F", points: "0.0" },
                                    ].map((row, index) => (
                                        <tr key={row.grade} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.grade}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </li>
                    <li>
                        {t("step2")}
                        <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                {t("step2_example")}
                            </p>
                        </div>
                    </li>
                    <li>{t("step3")}</li>
                </ol>

                <h4 className="text-base font-medium text-gray-900 mt-6">
                    {t("important_notes_title")}
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>{t("note1")}</li>
                    <li>{t("note2")}</li>
                    <li>{t("note3")}</li>
                </ul>
            </div>
        </div>
    )
} 