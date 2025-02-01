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
        { name: t('about'), href: '/about' },
        { name: t('labRanking'), href: '/lab-ranking' },
        { name: t('conferenceRanking'), href: '/conference-ranking' },
    ]

    // 현재 경로에서 언어 prefix를 제거한 실제 경로 확인
    const getIsActive = (href: string) => {
        // /en/about -> /about 형태로 변환하여 비교
        const currentPath = pathname.split('/').slice(2).join('/')
        return currentPath === href.slice(1) || currentPath.startsWith(href.slice(1) + '/')
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-12">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={80}
                                    height={24}
                                    className="h-6 w-auto object-contain"
                                    priority
                                    quality={100}
                                />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:flex sm:space-x-2">
                            {navigation.map((item) => {
                                const isActive = getIsActive(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-4">
                        {/* Newsletter Button */}
                        <button
                            onClick={() => {
                                // TODO: Implement newsletter subscription modal or redirect
                                console.log('Newsletter subscription clicked')
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {t('newsletter')}
                        </button>

                        {/* Language Selector */}
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </nav>
    )
} 