
import { getTranslations } from 'next-intl/server';

export default async function LandingPage() {
    const t = await getTranslations('Landing');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Welcome</h1>
            <p className="text-lg">{t('welcome')}</p>
        </div>
    );
}
