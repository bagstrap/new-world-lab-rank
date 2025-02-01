'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function LanguageSelector() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const handleLanguageChange = (newLocale: string) => {
        // Remove the current locale from the pathname
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPathname)
    }

    return (
        <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
            </SelectContent>
        </Select>
    )
} 