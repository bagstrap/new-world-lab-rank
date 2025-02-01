import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('landing.title'),
        description: t('landing.description'),
    };
}

export default async function LandingPage() {
    const t = await getTranslations('Landing');

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        {t('description')}
                    </p>
                    <Link
                        href="/lab-ranking"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        {t('explore_labs')}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Current Features */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100">
                        <div className="text-blue-600 font-medium mb-4">{t('current_features')}</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cs_ranking_title')}</h2>
                        <p className="text-gray-600 mb-6">{t('cs_ranking_description')}</p>
                        <ul className="space-y-3">
                            {['feature1', 'feature2', 'feature3'].map((key) => (
                                <li key={key} className="flex items-center gap-3 text-gray-600">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                    {t(`features.${key}`)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="text-blue-600/80 font-medium mb-4">{t('coming_soon')}</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('future_fields_title')}</h2>
                        <p className="text-gray-600 mb-6">{t('future_fields_description')}</p>
                        <ul className="space-y-3">
                            {['future1', 'future2', 'future3'].map((key) => (
                                <li key={key} className="flex items-center gap-3 text-gray-600">
                                    <span className="w-1.5 h-1.5 bg-blue-600/60 rounded-full" />
                                    {t(`future_features.${key}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
