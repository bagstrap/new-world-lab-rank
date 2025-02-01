import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleAdsense from '@/components/GoogleAdsense';

const locales = routing.locales
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