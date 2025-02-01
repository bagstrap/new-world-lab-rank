'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FAQAccordionProps {
    faqs: string[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = useTranslations('Landing');

    return (
        <div className="space-y-4">
            {faqs.map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                        <span className="text-lg font-medium text-gray-900">
                            {t(`faqs.q${index + 1}`)}
                        </span>
                        {openIndex === index ? (
                            <Minus className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Plus className="w-5 h-5 text-blue-600" />
                        )}
                    </button>
                    <div
                        className={`px-6 transition-all duration-200 ease-in-out ${openIndex === index ? 'max-h-48 pb-5' : 'max-h-0'
                            } overflow-hidden`}
                    >
                        <p className="text-gray-600">
                            {t(`faqs.a${index + 1}`)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
