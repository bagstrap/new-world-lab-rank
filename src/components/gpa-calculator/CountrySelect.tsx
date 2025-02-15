"use client"

import { Input } from "@/components/ui/input"
import { ScaleDataJson, GradingScale } from "@/types/scale"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface GradingSystemSelectProps {
    scaleData: ScaleDataJson
    selectedCountry: string
    selectedScaleId: number | null
    onCountryChange: (country: string) => void
    onScaleChange: (scaleId: number) => void
}

export function GradingSystemSelect({
    scaleData,
    selectedCountry,
    selectedScaleId,
    onCountryChange,
    onScaleChange,
}: GradingSystemSelectProps) {
    const t = useTranslations("gpa_calculator")
    const [countrySearch, setCountrySearch] = useState(selectedCountry)
    const [scaleSearch, setScaleSearch] = useState("")
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [showScaleDropdown, setShowScaleDropdown] = useState(false)

    // Filter countries based on search
    const filteredCountries = Object.keys(scaleData)
        .filter(country => country.toLowerCase().includes(countrySearch.toLowerCase()))
        .sort()

    // Get available scales for the selected country and ensure uniqueness
    const availableScales = selectedCountry
        ? [
            ...(scaleData[selectedCountry]?.common_scales || []).map(scale => ({
                ...scale,
                isCommon: true as const
            })),
            ...(scaleData[selectedCountry]?.all_scales || []).map(scale => ({
                ...scale,
                isCommon: false as const
            }))
        ]
        : []

    // Find selected scale
    const selectedScale = availableScales.find(scale => scale.GradingScaleID === selectedScaleId)

    // Remove duplicates based on GradingScaleID and filter based on search
    const uniqueScales = availableScales
        .reduce((acc, current) => {
            const x = acc.find(item => item.GradingScaleID === current.GradingScaleID);
            if (!x) {
                return acc.concat([current]);
            } else {
                if (current.isCommon && !x.isCommon) {
                    return acc.map(item =>
                        item.GradingScaleID === current.GradingScaleID ? current : item
                    );
                }
                return acc;
            }
        }, [] as (GradingScale & { isCommon: boolean })[])
        .filter(scale =>
            scale.GradingScaleName.toLowerCase().includes(scaleSearch.toLowerCase()) ||
            (scale.GradingScaleDescription || "").toLowerCase().includes(scaleSearch.toLowerCase())
        )
        .sort((a, b) => {
            if (a.isCommon !== b.isCommon) return a.isCommon ? -1 : 1
            return a.GradingScaleName.localeCompare(b.GradingScaleName)
        })

    return (
        <div className="space-y-6">
            {/* Country Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("select_country")}
                </label>
                <Input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => {
                        setCountrySearch(e.target.value)
                        setShowCountryDropdown(true)
                    }}
                    onFocus={() => setShowCountryDropdown(true)}
                    placeholder={t("select_country_placeholder")}
                    className="w-full"
                />
                {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className="mt-2 p-2 max-h-60 overflow-y-auto border rounded-lg bg-white">
                        {filteredCountries.map((country) => (
                            <button
                                key={country}
                                onClick={() => {
                                    onCountryChange(country)
                                    setCountrySearch(country)
                                    setShowCountryDropdown(false)
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md ${selectedCountry === country ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                    }`}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grading System Selection */}
            {selectedCountry && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        {t("select_grading_system")}
                    </label>
                    <Input
                        type="text"
                        value={scaleSearch}
                        onChange={(e) => {
                            setScaleSearch(e.target.value)
                            setShowScaleDropdown(true)
                        }}
                        onFocus={() => setShowScaleDropdown(true)}
                        placeholder={selectedScale ? selectedScale.GradingScaleName : t("select_grading_system_placeholder")}
                        className="w-full"
                    />
                    {showScaleDropdown && uniqueScales.length > 0 && (
                        <div className="mt-2 p-2 max-h-[400px] overflow-y-auto border rounded-lg bg-white">
                            {uniqueScales.map((scale) => (
                                <button
                                    key={`${scale.GradingScaleID}-${scale.isCommon ? 'common' : 'all'}`}
                                    onClick={() => {
                                        onScaleChange(scale.GradingScaleID)
                                        setScaleSearch(scale.GradingScaleName)
                                        setShowScaleDropdown(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md ${selectedScaleId === scale.GradingScaleID ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2">
                                            {scale.GradingScaleName}
                                            {scale.isCommon && (
                                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                                                    {t("common_scale")}
                                                </span>
                                            )}
                                        </span>
                                        {scale.GradingScaleDescription && (
                                            <span className="text-xs text-gray-500">
                                                {scale.GradingScaleDescription}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 