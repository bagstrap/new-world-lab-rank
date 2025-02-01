## SpecStory

## Next.js Locale Layout Troubleshooting (2025. 2. 1. 오후 7:26:44)

_**User**_

@layout.tsx @layout.tsx @layout.tsx 이거 지금 이상하게 어떤 페이지로 가도 그 locale 의 레이아웃이 떠 이유가 뭐임?

---

_**Assistant**_

현재 레이아웃 구조를 살펴보겠습니다. Next.js에서 레이아웃이 중첩되어 있는 상황인데, 문제의 원인을 파악해보겠습니다.

현재 레이아웃 구조는 다음과 같습니다:

1. `src/app/layout.tsx` (루트 레이아웃)
2. `src/app/[locale]/layout.tsx` (locale 레이아웃)
3. `src/app/[locale]/(dashboard)/layout.tsx` (대시보드 레이아웃)

문제는 `src/app/layout.tsx`가 최상위 루트 레이아웃인데, 여기에 `html`과 `body` 태그가 정의되어 있고, 그 아래 `[locale]` 레이아웃에서 `NextIntlClientProvider`와 `Navbar`가 정의되어 있기 때문입니다.

이 구조에서는 모든 페이지 접근 시 다음과 같은 순서로 레이아웃이 적용됩니다:
1. 루트 레이아웃 (`layout.tsx`)
2. locale 레이아웃 (`[locale]/layout.tsx`)
3. 대시보드 레이아웃 (`(dashboard)/layout.tsx`)

이게 의도한 동작이 맞습니다! Next.js의 레이아웃 시스템은 계층적으로 작동하도록 설계되어 있어서, 상위 레이아웃이 하위 레이아웃을 감싸는 구조가 됩니다.

만약 특정 locale의 레이아웃만 보이게 하고 싶다면, 레이아웃 구조를 다르게 가져가야 할 것 같습니다. 예를 들어:

1. `NextIntlClientProvider`를 루트 레이아웃으로 이동
2. `Navbar`를 조건부로 렌더링
3. 또는 라우팅 구조 자체를 변경

어떤 방식으로 수정하기를 원하시나요? 의도하신 동작이 어떤 것인지 알려주시면 그에 맞게 수정해드리겠습니다.

---



---

