import { getTranslations } from 'next-intl/server';
import AboutContent from '@/components/AboutContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('landing.title'),
        description: t('landing.description'),
    };
}

export default async function HomePage() {
    return <AboutContent />;
} 