"use client"

import { ScaleDataJson, GradingScale } from "@/types/scale"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { GradingSystemSelect } from "./CountrySelect"
import { CourseInput } from "./CourseInput"
import { GradeTable } from "./GradeTable"

interface Course {
    courseName: string
    grade: string
    credits: string
}

interface GPACalculatorProps {
    scaleData: ScaleDataJson
}

export function GPACalculator({ scaleData }: GPACalculatorProps) {
    const t = useTranslations("gpa_calculator")
    const [selectedCountry, setSelectedCountry] = useState<string>("")
    const [selectedScaleId, setSelectedScaleId] = useState<number | null>(null)
    const [courses, setCourses] = useState<Course[]>([{ courseName: "", grade: "", credits: "" }])
    const [calculatedGPA, setCalculatedGPA] = useState<number | null>(null)

    // Find the selected scale from the available scales
    const selectedScale: GradingScale | undefined = selectedCountry && selectedScaleId
        ? [...(scaleData[selectedCountry]?.common_scales || []), ...(scaleData[selectedCountry]?.all_scales || [])]
            .find(scale => scale.GradingScaleID === selectedScaleId)
        : undefined

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country)
        setSelectedScaleId(null) // Reset scale selection when country changes
        setCalculatedGPA(null)
    }

    const handleScaleChange = (scaleId: number) => {
        setSelectedScaleId(scaleId)
        setCalculatedGPA(null)
        // Reset grades if they don't exist in the new scale
        setCourses(courses.map(course => ({
            ...course,
            grade: "" // Reset grade when scale changes
        })))
    }

    const handleCourseChange = (index: number, field: keyof Course, value: string) => {
        const newCourses = [...courses]
        newCourses[index] = { ...newCourses[index], [field]: value }
        setCourses(newCourses)
        setCalculatedGPA(null)
    }

    const handleAddCourse = () => {
        setCourses([...courses, { courseName: "", grade: "", credits: "" }])
    }

    const handleRemoveCourse = (index: number) => {
        setCourses(courses.filter((_, i) => i !== index))
        setCalculatedGPA(null)
    }

    const calculateGPA = () => {
        if (!selectedScale) return

        let totalPoints = 0
        let totalCredits = 0

        courses.forEach((course) => {
            if (!course.grade || !course.credits) return

            const gradeData = selectedScale.scale_data.find(
                (data) => data.letter_grade === course.grade
            )
            if (!gradeData?.grade_points) return

            const credits = parseFloat(course.credits)
            const points = parseFloat(gradeData.grade_points)

            totalPoints += points * credits
            totalCredits += credits
        })

        if (totalCredits === 0) return

        setCalculatedGPA(Number((totalPoints / totalCredits).toFixed(2)))
    }

    const isCalculateDisabled = !selectedCountry ||
        !selectedScaleId ||
        courses.length === 0 ||
        !courses.some(course => {
            const creditsNum = parseFloat(course.credits);
            return course.grade && !isNaN(creditsNum) && creditsNum > 0;
        });

    // Add debug logging
    console.log("Calculate button state:", {
        selectedCountry,
        selectedScaleId,
        coursesLength: courses.length,
        courses,
        isDisabled: isCalculateDisabled
    });

    return (
        <div className="space-y-8">
            {/* Country and Scale Selection */}
            <GradingSystemSelect
                scaleData={scaleData}
                selectedCountry={selectedCountry}
                selectedScaleId={selectedScaleId}
                onCountryChange={handleCountryChange}
                onScaleChange={handleScaleChange}
            />

            {selectedScale && (
                <div className="space-y-6">
                    {selectedScale.GradingScaleDescription && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            {selectedScale.GradingScaleDescription}
                        </div>
                    )}

                    {/* Grade Conversion Table */}
                    <GradeTable scale={selectedScale} />

                    <div className="space-y-4">
                        {courses.map((course, index) => (
                            <CourseInput
                                key={index}
                                index={index}
                                courseName={course.courseName}
                                grade={course.grade}
                                credits={course.credits}
                                scale={selectedScale}
                                onCourseChange={handleCourseChange}
                                onRemoveCourse={handleRemoveCourse}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleAddCourse}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {t("add_course")}
                        </button>

                        <button
                            onClick={calculateGPA}
                            disabled={isCalculateDisabled}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                                     transition-colors"
                        >
                            {t("calculate_gpa")}
                        </button>
                    </div>

                    {calculatedGPA !== null && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-lg font-medium text-gray-900">
                                {t("your_gpa")}: <span className="text-blue-600">{calculatedGPA}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{t("gpa_scale_note")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 