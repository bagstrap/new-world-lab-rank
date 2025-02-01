
import { getTranslations } from "next-intl/server";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('conference_ranking.title'),
        description: t('conference_ranking.description'),
    };
}

export default function ConferenceRankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
    )
} 