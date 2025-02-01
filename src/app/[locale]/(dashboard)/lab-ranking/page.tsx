import { getTranslations } from "next-intl/server"
import { LabRanking } from "@/components/lab-ranking/LabRanking"
import { LabData } from "@/types/lab"

async function getLabData(): Promise<LabData> {
    const data = await import("@/data/final_lab_data.json")
    return data.default as LabData
}

export default async function LabRankingPage() {
    const t = await getTranslations("lab_ranking")
    const labData = await getLabData()

    return (
        <div>
            <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        {t("description")}
                    </p>
                </div>
            </div>

            <div className="min-h-screen bg-gray-50/50">
                <LabRanking initialData={labData} />
            </div>
        </div>
    )
}
