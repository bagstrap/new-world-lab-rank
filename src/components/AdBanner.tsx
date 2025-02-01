'use client';

import { useEffect } from 'react';

interface AdBannerProps {
    className?: string;
    style?: React.CSSProperties;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    slot: string;
}

export default function AdBanner({ className, style, format = 'auto', slot }: AdBannerProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Ad Error:', err);
        }
    }, []);

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={style || { display: 'block' }}
                data-ad-client="YOUR-CLIENT-ID"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
} 