'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSelector } from './LanguageSelector'
import Image from 'next/image'

export function Navbar() {
    const t = useTranslations('Navigation')
    const pathname = usePathname()

    const navigation = [
        { name: t('conferenceRanking'), href: '/conference-ranking' },
        { name: t('labRanking'), href: '/lab-ranking' },
    ]

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </nav>
    )
} 