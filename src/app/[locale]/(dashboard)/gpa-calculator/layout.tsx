import { getTranslations } from "next-intl/server";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('conference_ranking.title'),
        description: t('conference_ranking.description'),
    };
}

export default async function GPACalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const t = await getTranslations('gpa_calculator');
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-8 py-10 sm:px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        {t('description')}
                    </p>
                </div>
            </div>
            <div className="px-8 sm:px-6">
                {children}
            </div>
        </div>
    )
} 