'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
    const t = useTranslations('Footer')

    return (
        <footer className="w-full border-t">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
                    <div className="flex space-x-4">
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {t('privacy')}
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {t('terms')}
                        </Link>
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('copyright')}
                    </div>
                </div>
            </div>
        </footer>
    )
}