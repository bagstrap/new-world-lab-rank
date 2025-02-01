## SpecStory

## Next.js Layout Issue Investigation (2025. 2. 1. 오후 7:24:41)

_**User**_

@app 이상하게 각 페이지로 이동해도, 그 가장 위에있는 layout 페이지의 값이 떠. 이유가 뭐임?

---

_**Assistant**_

Next.js의 레이아웃 시스템을 확인해보겠습니다. 먼저 현재 레이아웃 구조를 살펴보겠습니다.

---

_**Assistant**_



---

_**Assistant**_



---

_**Assistant**_



문제를 파악했습니다. 현재 레이아웃 구조에서 다음과 같은 이슈가 있습니다:

1. `src/app/[locale]/layout.tsx`가 전체 HTML 구조(`<html>`, `<body>`)를 포함하고 있습니다. 이는 루트 레이아웃(`src/app/layout.tsx`)에 있어야 할 내용입니다.

2. 이로 인해 페이지를 이동할 때마다 `[locale]/layout.tsx`의 내용이 중복되어 나타나는 것입니다.

이를 수정하기 위해 레이아웃 구조를 다음과 같이 변경하겠습니다:

1. 먼저 루트 레이아웃을 수정하겠습니다:

---

_**Assistant**_

```
import { Inter } from "next/font/google";
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

---

_**Assistant**_



2. 이제 [locale] 레이아웃을 수정하겠습니다:

---

_**Assistant**_

```
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <Navbar />
            {children}
        </NextIntlClientProvider>
    );
}
```

---

_**Assistant**_



이렇게 수정하면 문제가 해결될 것입니다. 변경된 구조는 다음과 같습니다:

1. `app/layout.tsx`: 기본 HTML 구조를 담당
2. `app/[locale]/layout.tsx`: 국제화(i18n) 및 네비게이션 바 담당

이제 페이지를 이동할 때마다 HTML 구조가 중복되지 않고, 올바르게 작동할 것입니다. 각 레이아웃이 자신의 역할에 맞는 책임만 가지도록 분리되었습니다.

---



---

