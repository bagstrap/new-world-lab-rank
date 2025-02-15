"use client"

import { Input } from "@/components/ui/input"
import { GradingScale } from "@/types/scale"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { useState } from "react"

interface CourseInputProps {
    index: number
    courseName: string
    grade: string
    credits: string
    scale: GradingScale
    onCourseChange: (index: number, field: "courseName" | "grade" | "credits", value: string) => void
    onRemoveCourse: (index: number) => void
}

export function CourseInput({
    index,
    courseName,
    grade,
    credits,
    scale,
    onCourseChange,
    onRemoveCourse,
}: CourseInputProps) {
    const t = useTranslations("gpa_calculator")
    const [gradeSearch, setGradeSearch] = useState("")
    const [showGradeDropdown, setShowGradeDropdown] = useState(false)

    // Find selected grade
    const selectedGrade = scale.scale_data.find(data => data.letter_grade === grade)

    // Filter and sort grades
    const filteredGrades = scale.scale_data
        .filter((data) => data.letter_grade)
        .filter(data =>
            data.letter_grade?.toLowerCase().includes(gradeSearch.toLowerCase()) ||
            data.description?.toLowerCase().includes(gradeSearch.toLowerCase())
        )
        .sort((a, b) => {
            const pointsA = parseFloat(a.grade_points || "0")
            const pointsB = parseFloat(b.grade_points || "0")
            return pointsB - pointsA
        })

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-white group hover:border-blue-200 transition-colors">
            <div className="flex items-start gap-4">
                {/* Course Name Input */}
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-700">
                        {t("course_name")}
                    </label>
                    <Input
                        type="text"
                        value={courseName}
                        onChange={(e) => onCourseChange(index, "courseName", e.target.value)}
                        placeholder={t("course_name_placeholder")}
                    />
                </div>

                {/* Credits Input */}
                <div className="space-y-2 w-24">
                    <label className="text-sm font-medium text-gray-700">
                        {t("credits")}
                    </label>
                    <Input
                        type="number"
                        min="0"
                        max="20"
                        value={credits}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Ensure the value is a valid number or empty string
                            if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 20)) {
                                onCourseChange(index, "credits", value);
                            }
                        }}
                        className="w-full"
                    />
                </div>

                {/* Remove Course Button */}
                <button
                    onClick={() => onRemoveCourse(index)}
                    className="mt-8 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={t("remove_course")}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Grade Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("grade")}
                </label>
                <Input
                    type="text"
                    value={gradeSearch}
                    onChange={(e) => {
                        setGradeSearch(e.target.value)
                        setShowGradeDropdown(true)
                    }}
                    onFocus={() => setShowGradeDropdown(true)}
                    placeholder={selectedGrade ? `${selectedGrade.letter_grade} (${selectedGrade.grade_points})` : t("select_grade")}
                />
                {showGradeDropdown && filteredGrades.length > 0 && (
                    <div className="mt-2 p-2 max-h-48 overflow-y-auto border rounded-lg bg-white">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {filteredGrades.map((data) => (
                                <button
                                    key={data.letter_grade}
                                    onClick={() => {
                                        onCourseChange(index, "grade", data.letter_grade || "")
                                        setGradeSearch("")
                                        setShowGradeDropdown(false)
                                    }}
                                    className={`px-3 py-2 text-left rounded-md hover:bg-gray-50 ${grade === data.letter_grade ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{data.letter_grade}</span>
                                        {data.grade_points && (
                                            <span className="text-xs text-gray-500">
                                                {t("us_grade")}: {data.grade_points}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 