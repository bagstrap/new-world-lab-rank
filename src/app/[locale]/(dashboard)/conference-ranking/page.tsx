import { getTranslations } from "next-intl/server"

export default async function ConferenceRankingPage() {
    const t = await getTranslations("conference_ranking")
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Conference Ranking</h1>
            <div className="space-y-4">
                {t("title")}
            </div>
        </div>
    )
}
