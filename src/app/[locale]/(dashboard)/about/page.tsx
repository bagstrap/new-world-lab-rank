import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('gpa_calculator.title'),
        description: t('gpa_calculator.description'),
    };
}

export default async function GPACalculatorPage() {
    return (
        <div>
            <h1>About</h1>
        </div>
    )
}
