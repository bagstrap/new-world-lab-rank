import { getTranslations } from "next-intl/server"
import { ConferenceRanking } from "@/components/conference-ranking/ConferenceRanking"
import { Conference } from "@/types/conference"

async function getConferenceData(): Promise<Conference[]> {
    const data = await import("@/data/conference_rank.json")
    return data.default as Conference[]
}

export default async function ConferenceRankingPage() {
    const t = await getTranslations("conference_ranking")
    const conferenceData = await getConferenceData()

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
                <ConferenceRanking initialData={conferenceData} />
            </div>
        </div>
    )
}
