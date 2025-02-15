import { getTranslations } from "next-intl/server"
import { ScaleDataJson } from "@/types/scale"
import { GPACalculator } from "@/components/gpa-calculator/GPACalculator"
import { GPAExplanation } from "@/components/gpa-calculator/GPAExplanation"

async function getScaleData(): Promise<ScaleDataJson> {
    const data = await import("@/data/scale_data.json")
    return data.default as ScaleDataJson
}

export default async function GPACalculatorPage() {
    const t = await getTranslations("gpa_calculator")
    const scaleData = await getScaleData()

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left column - Calculator */}
                <div className="lg:col-span-7">
                    <GPACalculator scaleData={scaleData} />
                </div>

                {/* Right column - Explanation (will be sticky on desktop) */}
                <div className="lg:col-span-5">
                    <GPAExplanation />
                </div>
            </div>
        </div>
    )
}
