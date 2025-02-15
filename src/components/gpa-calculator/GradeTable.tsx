"use client"

import { GradingScale } from "@/types/scale"
import { useTranslations } from "next-intl"

interface GradeTableProps {
    scale: GradingScale
}

export function GradeTable({ scale }: GradeTableProps) {
    const t = useTranslations("gpa_calculator")

    // Filter out entries without letter grades and sort by grade points in descending order
    const sortedGrades = [...scale.scale_data]
        .filter(grade => grade.letter_grade && grade.grade_points)
        .sort((a, b) => {
            const pointsA = parseFloat(a.grade_points || "0")
            const pointsB = parseFloat(b.grade_points || "0")
            return pointsB - pointsA
        })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
                {t("grade_conversion_table")}
            </h3>

            {/* Notes section */}
            {scale.scale_data.some(grade => grade.notes) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                        {t("important_notes")}
                    </h4>
                    <ul className="space-y-2">
                        {scale.scale_data
                            .filter(grade => grade.notes)
                            .map((grade, index) => (
                                <li key={index} className="text-sm text-yellow-700">
                                    {grade.letter_grade ? (
                                        <span className="font-medium">{grade.letter_grade}: </span>
                                    ) : null}
                                    {grade.notes}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {/* Conversion table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {t("letter_grade")}
                            </th>
                            {sortedGrades.some(grade => grade.scale_from || grade.scale_to) && (
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("score_range")}
                                </th>
                            )}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {t("grade_description")}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {t("us_grade")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedGrades.map((grade, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {grade.letter_grade}
                                </td>
                                {sortedGrades.some(grade => grade.scale_from || grade.scale_to) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {grade.scale_from || grade.scale_to ? (
                                            `${grade.scale_from || ''} - ${grade.scale_to || ''}`
                                        ) : '-'}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {grade.description || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {grade.grade_points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 