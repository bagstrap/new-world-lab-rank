import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleAdsense from '@/components/GoogleAdsense';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const locales = routing.locales

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Metadata')
    const locale = await getLocale()

    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('og.title'),
            description: t('og.description'),
            images: [
                {
                    url: `/og-image-${locale}.png`, // Localized OG images like og-image-ko.png, og-image-en.png
                    width: 1200,
                    height: 630,
                    alt: t('og.alt')
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: t('twitter.title'),
            description: t('twitter.description'),
            images: [`/og-image-${locale}.png`]
        }
    }
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {

    const locale = await getLocale()
    if (!locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="min-h-screen flex flex-col">
                <GoogleAdsense />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
} 