# inform-note-front

`inform-note` 백엔드 서비스(Spring Boot)와 연동되는 **설비 정비 이력(Down Event) 관리** 프론트엔드 애플리케이션입니다.
**FSD(Feature-Sliced Design)** 아키텍처를 기준으로 구성되어 있으며, 패키지 매니저는 **pnpm** 을 표준으로 사용합니다.

- 저장소: https://github.com/reboot0501/inform-note-front.git
- 참고 문서: 워크스페이스 루트 `doc/1. inform-note-front ui 프론트 엔드 프로젝트 구성.md`, `doc/3. Shadcn ui 를 FSD 아키텍처에 적용방안과 사용방법 정리.md`

---

## 1. 기술 스택

`package.json` 에 설치된 라이브러리를 분석한 결과입니다. (버전은 `package.json` 명세 기준)

### 1) 런타임 / 빌드 환경

| 구분 | 항목 | 버전 | 비고 |
|---|---|---|---|
| Language | TypeScript | `~6.0.2` | `verbatimModuleSyntax`, `erasableSyntaxOnly` 적용 |
| Framework | React / React DOM | `^19.2.8` | React 19 |
| Build Tool | Vite | `^8.2.0` | `@vitejs/plugin-react` |
| Package Manager | pnpm | `11.x` (권장) | `pnpm-lock.yaml` (lockfileVersion 9.0) |
| Node.js | Node | `>= 22` (권장 24.x) | `@types/node ^24` 기준 |

### 2) 핵심 애플리케이션 라이브러리

| 카테고리 | 라이브러리 | 버전 | 용도 |
|---|---|---|---|
| 라우팅 | `react-router-dom` | `^7.18.2` | `createBrowserRouter` 기반 라우팅 (`src/app/routes`) |
| 서버 상태 | `@tanstack/react-query` | `^5.102.1` | API 캐싱 / 비동기 상태 관리 |
| 서버 상태(개발) | `@tanstack/react-query-devtools` | `^5.102.1` | Query Devtools |
| 가상 스크롤 | `@tanstack/react-virtual` | `^3.14.10` | Down Event Card 대용량 목록 Virtualization |
| 전역 클라이언트 상태 | `jotai` | `^2.20.2` | 전역 에러 Atom 등 (`src/shared/model`, `src/app/providers/jotai-provider.tsx`) |
| HTTP | `axios` | `^1.19.0` | HTTP 클라이언트 (`src/shared/api`) |
| 날짜/시간 | `dayjs` | `^1.11.23` | 날짜 포맷/연산 유틸 |

### 3) UI / 스타일 (Tailwind CSS v4 + shadcn/ui)

| 카테고리 | 라이브러리 | 버전 | 용도 |
|---|---|---|---|
| CSS 엔진 | `tailwindcss` | `^4.3.3` | Tailwind CSS v4 (CSS-first 설정) |
| Vite 통합 | `@tailwindcss/vite` | `^4.3.3` | Tailwind v4 Vite 플러그인 |
| 애니메이션 | `tw-animate-css` | `^1.4.0` | v4용 애니메이션 유틸 (`@import "tw-animate-css"`) |
| 애니메이션(레거시) | `tailwindcss-animate` | `^1.0.7` | `tailwind.config.js` (v3 스타일) 참조용 |
| shadcn CLI | `shadcn` | `^4.19.0` | 컴포넌트 소스 생성 CLI |
| Headless Primitives | `radix-ui` / `@radix-ui/react-*` | `^1.x` | dialog, select, slot, tabs, tooltip |
| 클래스 병합 | `clsx`, `tailwind-merge` | `^2.1.1` / `^3.6.0` | `cn()` 유틸 (`src/shared/lib/css-utils.ts`) |
| Variants | `class-variance-authority` | `^0.7.1` | 컴포넌트 variant 정의 |
| 아이콘 | `lucide-react` | `^1.33.0` | 기본 아이콘 세트 |
| 폰트 | `@fontsource-variable/geist` | `^5.3.0` | Geist Variable 본문 폰트 |

### 4) Rich Text Editor

| 라이브러리 | 버전 | 용도 |
|---|---|---|
| `froala-editor` | `^5.4.0` | WYSIWYG 에디터 코어 (현상/조치 상세 HTML 작성) |
| `react-froala-wysiwyg` | `^5.4.0` | Froala React 래퍼 |
| `font-awesome` | `^4.7.0` | Froala 툴바 아이콘 |

### 5) 개발 도구 (Lint / Types)

| 라이브러리 | 버전 | 용도 |
|---|---|---|
| `eslint` | `^10.8.0` | Flat Config (`eslint.config.js`) |
| `typescript-eslint` | `^8.65.0` | TS 린트 규칙 |
| `eslint-plugin-react-hooks` | `^7.1.1` | Hooks 규칙 |
| `eslint-plugin-react-refresh` | `^0.5.3` | Vite Fast Refresh 규칙 |
| `@eslint/js`, `globals` | `^10.0.1` / `^17.7.0` | 기본 린트 프리셋 |
| `postcss`, `autoprefixer` | `^8.5.26` / `^10.5.4` | PostCSS 파이프라인 |
| `@types/node`, `@types/react`, `@types/react-dom` | `^24` / `^19` | 타입 정의 |

> [!NOTE]
> **Tailwind 버전 정리**: 본 프로젝트는 **Tailwind CSS v4** 를 사용합니다.
> 테마 토큰은 `src/app/styles/index.css` 의 `@import "tailwindcss"` + `@theme inline` 블록에서 CSS 변수로 관리합니다.
> 루트의 `tailwind.config.js` 는 v3 스타일(`module.exports` / `require`)로 남아 있으며, 툴링 호환 및 `components.json` 참조 용도로만 유지됩니다.

---

## 2. 사전 요구사항

| 항목 | 권장 버전 |
|---|---|
| Node.js | `20.19+` 또는 `22.12+` (Vite 8 요구사항, 24.x 검증됨) |
| pnpm | `11.x` (`corepack enable` 또는 `npm i -g pnpm`) |

```bash
# corepack 으로 pnpm 활성화 (권장)
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

---

## 3. 빠른 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 개발 서버 실행 (http://localhost:7080)
pnpm dev

# 3. 프로덕션 빌드 ( 타입체크 tsc -b 후 vite build )
pnpm build

# 4. 빌드 결과 로컬 프리뷰
pnpm preview

# 5. 린트
pnpm lint
```

`package.json` 스크립트:

| 스크립트 | 명령 | 설명 |
|---|---|---|
| `pnpm dev` | `vite` | 개발 서버 (포트 7080, 백엔드 프록시 활성) |
| `pnpm build` | `tsc -b && vite build` | 프로젝트 레퍼런스 타입체크 후 번들 |
| `pnpm lint` | `eslint .` | 전체 소스 린트 |
| `pnpm preview` | `vite preview` | `dist/` 정적 프리뷰 |

---

## 4. FSD (Feature-Sliced Design) 아키텍처

### 1) 레이어와 의존성 규칙

의존 방향은 **상위 → 하위 단방향**이며, 하위 레이어는 상위 레이어를 참조할 수 없습니다.

```
app  →  pages  →  widgets  →  features  →  entities  →  shared
```

| 레이어 | 역할 | 백엔드 대응 |
|---|---|---|
| `app` | 앱 진입점, 전역 Provider(QueryClient/Jotai), Layout(LNB·Header·Tab), Router | - |
| `pages` | 라우트 단위 화면 조립 (features/widgets 조합) | - |
| `widgets` | 여러 feature/entity를 조합한 독립 UI 블록 (Down Event Card 등) | - |
| `features` | `facade` 모듈 API 호출, `*Fetch`/`*Command` 요청, `*Response` 응답, TanStack Query 훅, 인터랙션 UI | `inform_note-facade` |
| `entities` | 순수 도메인 모델 — Entity / VO / Enum / 검색 조건 타입 | 코어 도메인 Entity |
| `shared` | HTTP Client(Axios 래퍼·인터셉터·에러 핸들러), 공통 응답 규격, 공통 훅, shadcn/ui 공통 컴포넌트 | Base Response 규격 |

> shadcn/ui 컴포넌트는 비즈니스 로직이 없는 순수 재사용 UI 이므로 최하위 `shared/ui` 에 소스로 생성됩니다.
> `shared/ui` 는 `entities`·`features` 를 참조할 수 없으며, 도메인이 결합된 컴포넌트는 `widgets` / `features` 로 승격합니다.

### 2) 전체 디렉터리 구성도

```text
inform-note-front/
├── index.html                              # Vite 진입 HTML ( /src/app/main.tsx 로드 )
├── package.json
├── pnpm-lock.yaml                          # pnpm lockfile (v9)
├── vite.config.ts                          # React + Tailwind v4 플러그인, @ alias, 7080 포트, 백엔드 프록시
├── tsconfig.json                           # 프로젝트 레퍼런스 + 경로 별칭(@/*, @/app/* ...)
├── tsconfig.app.json                       # 앱 소스 컴파일 옵션 (bundler, react-jsx, strict lint)
├── tsconfig.node.json                      # vite.config.ts 용 Node 설정
├── components.json                         # shadcn/ui 설정 ( style: radix-nova / FSD alias 바인딩 )
├── eslint.config.js                        # ESLint Flat Config
├── tailwind.config.js                      # (레거시 v3 스타일) 툴링 호환용
├── .env.localhost                          # VITE_API_URL= (빈 값 → Vite 프록시 사용)
├── .env.development                        # VITE_API_URL= (빈 값 → Vite 프록시 사용)
├── .env.production                         # 운영 API URL (배포 시 설정)
├── public/                                 # 정적 파일
└── src/
    ├── app/                                # ── [Layer] 앱 초기화 · 전역 설정
    │   ├── main.tsx                        # createRoot 진입점, index.css / froala 스타일 import
    │   ├── App.tsx                         # QueryProvider > AppRouter 조합 최상위 컴포넌트
    │   ├── providers/
    │   │   ├── query-client-provider.tsx   # TanStack Query ( staleTime 5분, retry 1, focus refetch off )
    │   │   └── jotai-provider.tsx          # Jotai Provider (격리 store 필요 시 App 래핑용)
    │   ├── routes/
    │   │   ├── routes.tsx                  # createBrowserRouter 라우트 테이블 ( AppLayout + 9개 라우트 )
    │   │   └── app-router.tsx              # RouterProvider 래퍼
    │   ├── layout/                         # 전체 화면 쉘
    │   │   ├── index.ts                    # layout public API
    │   │   ├── model/
    │   │   │   ├── tab-context.tsx         # 탭 열기/닫기 Context (최대 5개)
    │   │   │   └── tab.types.ts            # TabItem / TabContextType
    │   │   └── ui/
    │   │       ├── app-layout.tsx          # TabProvider + LNB + MainLayout
    │   │       ├── lnb.tsx                 # 좌측 사이드바 메뉴 (그룹/접기/툴팁)
    │   │       ├── header.tsx              # 상단 헤더
    │   │       ├── tab-bar.tsx             # 상단 탭 바
    │   │       ├── main-layout.tsx         # Header + TabBar + MainContent
    │   │       └── main-content.tsx        # <Outlet /> 렌더 영역
    │   └── styles/
    │       ├── index.css                   # Tailwind v4 진입 CSS ( @theme inline, 디자인 토큰, .fr-view 보정 )
    │       └── App.css
    │
    ├── assets/                             # 이미지 등 번들 에셋
    │
    ├── pages/                              # ── [Layer] 라우트별 페이지 조립
    │   ├── dashboard/
    │   │   ├── index.ts
    │   │   └── ui/dashboard.page.tsx       # 대시보드 (KPI 카드)
    │   └── down-event/
    │       ├── index.ts
    │       └── ui/
    │           ├── down-Event-page.container.tsx   # 검색 + Virtualizer + 목록 컨테이너
    │           ├── search-filter-panel.tsx         # 검색 필터 패널
    │           └── down-event-popup.tsx            # 현상/조치 상세 입력 팝업 (Froala 연동)
    │
    ├── widgets/                            # ── [Layer] 독립 UI 블록
    │   └── down-event-card/
    │       ├── index.ts
    │       └── ui/
    │           ├── down-event-card-widget.container.tsx
    │           ├── down-event-card-widget.header.tsx
    │           ├── down-event-card-widget.summary.tsx
    │           └── down-event-card-widget.detail.tsx   # contentHtml(.fr-view) 렌더
    │
    ├── features/                           # ── [Layer] facade API · *Fetch/*Command/*Response · 인터랙션
    │   ├── down-event-card-search/         # 장비 Down 이벤트 검색
    │   │   ├── index.ts
    │   │   ├── api/find-down-event-cards.api.ts   # POST /feature/maintenance/find-down-event-cards/fetch
    │   │   └── model/find-down-event-cards.fetch.ts
    │   ├── action-popup-seach/             # 현상·조치 상세 팝업 조회
    │   │   ├── index.ts
    │   │   ├── api/
    │   │   │   ├── find-action-popup.api.ts       # POST /feature/maintenance/find-action-popup/fetch
    │   │   │   └── use-action-popup-query.ts      # TanStack Query 훅
    │   │   └── model/
    │   │       ├── find-action-popup.fetch.ts
    │   │       └── action-popup.response.ts
    │   ├── technician-select/              # 작업자 검색/배정
    │   │   ├── index.ts
    │   │   ├── api/find-technicians.api.ts        # POST /feature/maintenance/find-technicians/fetch
    │   │   ├── model/find-technicians.fetch.ts
    │   │   └── ui/technician-select.drawer.tsx
    │   ├── replace-part/                   # 교체 부품 입력
    │   │   ├── index.ts
    │   │   └── ui/replace-part.drawer.tsx
    │   ├── corrective-action-save/         # 정비/조치 저장
    │   │   ├── index.ts
    │   │   ├── api/corrective-action.api.ts       # POST /feature/maintenance/corrective-action/command
    │   │   └── model/corrective-action.command.ts
    │   └── editor-file-upload/             # 에디터 임시 파일 업로드 / 이미지 조회
    │       ├── index.ts
    │       ├── api/
    │       │   ├── register-temp-file.api.ts      # POST /feature/file-handler/register-temp-file/command
    │       │   └── view-file.api.ts               # GET  /feature/file-handler/view/:fileId
    │       └── model/
    │           ├── register-temp-file.command.ts
    │           └── temp-file-registered.response.ts
    │
    ├── entities/                           # ── [Layer] 순수 도메인 모델 (Entity / VO / Enum)
    │   ├── index.ts                        # entities 통합 public API
    │   ├── down-event-card/
    │   │   ├── index.ts
    │   │   └── model/
    │   │       ├── index.ts
    │   │       ├── down-event-card.entity.ts
    │   │       └── vo/                     # FabricationPlant / ProcessModule / EquipmentModel / DownType /
    │   │           │                       # WorkStatus / Shift / ReplacementType enum,
    │   │           │                       # AssignedTechnician / Approver / PartReplacement VO,
    │   │           └── down-event-card-search-criteria.vo.ts
    │   ├── down-event-content/             # 현상/조치 HTML 본문 엔티티
    │   │   └── model/down-event-content.entity.ts
    │   ├── employees/                      # 사원/작업자 엔티티
    │   │   └── model/
    │   │       ├── employees.entity.ts
    │   │       └── vo/{ extract-employee.vo.ts, employee-search-criteria.vo.ts }
    │   ├── file/                           # 첨부 파일 엔티티
    │   │   └── model/
    │   │       ├── atatched-file.entity.ts
    │   │       └── vo/{ file-ref-type.enum.ts, file-status.enum.ts }
    │   └── jobs/                           # 직무 코드 엔티티
    │       └── model/jobs.entity.ts
    │
    └── shared/                             # ── [Layer] 전역 공통 모듈
        ├── api/
        │   ├── axios-instance.ts           # Axios 인스턴스 ( baseURL: VITE_API_URL, timeout 15s )
        │   ├── auth-interceptor.ts         # JWT 토큰 자동 첨부 + 응답 에러 핸들러 바인딩 (순환참조 방지)
        │   ├── error-handler.ts            # 공통 에러 처리 ( 401 → /login 리다이렉트 )
        │   ├── http-client.ts              # get/post/put/del/patch 래퍼
        │   ├── api-response.type.ts        # OffsetElementList<T>, ApiResponse<T>, ApiError
        │   └── index.ts
        ├── lib/
        │   ├── css-utils.ts                # cn() = twMerge(clsx(...))
        │   ├── image-viewer-popup.ts       # 이미지 확대 팝업 윈도우 헬퍼
        │   ├── hooks/use-debounce.ts       # 입력 디바운스 훅
        │   └── index.ts
        ├── model/
        │   ├── error.atom.ts               # 전역 에러 상태 Atom (jotai)
        │   └── index.ts
        └── ui/                             # shadcn/ui 공통 컴포넌트 (소스 생성)
            ├── badge.tsx  button.tsx  card.tsx  dialog.tsx  input.tsx
            ├── select.tsx  table.tsx  tabs.tsx  tooltip.tsx
            ├── pagination/
            │   ├── floating-pagination.tsx # 플로팅 페이지네이션 컴포넌트
            │   └── use-pagination.ts       # 페이지 범위 계산 훅 ( DOTS )
            └── index.ts                    # shared/ui public API (배럴)
```

---

## 5. pnpm 기준 프로젝트 환경 설정 및 패키지 구성 (순서)

아래 순서대로 진행하면 현재 `inform-note-front` 와 동일한 환경을 재현할 수 있습니다.
(각 패키지의 실제 고정 버전은 `package.json` / `pnpm-lock.yaml` 참조)

### Step 1. 프로젝트 생성 (Vite + React 19 + TypeScript)

```bash
pnpm create vite inform-note-front --template react-ts
cd inform-note-front
pnpm install
```

### Step 2. 핵심 애플리케이션 라이브러리 설치 (Routing / Query / State / HTTP)

```bash
# 라우팅
pnpm add react-router-dom

# 서버 상태(TanStack Query) + Devtools + 전역 클라이언트 상태(Jotai)
pnpm add @tanstack/react-query @tanstack/react-query-devtools jotai

# HTTP 통신 + 날짜 유틸
pnpm add axios dayjs

# 대용량 목록 가상 스크롤
pnpm add @tanstack/react-virtual
```

### Step 3. Tailwind CSS v4 + Path Alias 설정

```bash
# Tailwind v4 및 Vite 플러그인
pnpm add tailwindcss @tailwindcss/vite
pnpm add tw-animate-css
```

**`vite.config.ts`** — React / Tailwind 플러그인, `@` alias, 개발 포트 및 백엔드 프록시:

```ts
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 7080,
      proxy: {
        '/feature': { target: 'http://127.0.0.1:8080', changeOrigin: true, secure: false },
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  }
})
```

**`tsconfig.json`** — 프로젝트 레퍼런스 + FSD 경로 별칭:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

> `tsconfig.app.json` 의 `compilerOptions.paths` 에도 동일한 별칭을 추가합니다.

**`src/app/styles/index.css`** — 기존 내용을 지우고 Tailwind v4 진입부로 교체:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

:root { /* --background, --foreground ... 디자인 토큰 (oklch) */ }
.dark { /* 다크 모드 토큰 */ }

@theme inline { /* --color-*, --radius-*, --font-sans 매핑 */ }

@layer base {
  * { @apply border-border outline-ring/50; box-sizing: border-box; }
  body { @apply bg-background text-foreground font-sans; }
}
```

### Step 4. shadcn/ui 초기화 및 FSD 경로 바인딩

```bash
# shadcn/ui 유틸 및 아이콘
pnpm add clsx tailwind-merge class-variance-authority lucide-react

# shadcn CLI 초기화
pnpm dlx shadcn@latest init
#  - Select a component library » Radix UI
#  - Which preset would you like to use? » Nova - Lucide / Geist
```

**`components.json`** — 컴포넌트/유틸 경로를 FSD `shared` 계층으로 매핑:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/lib/hooks"
  }
}
```

**`cn()` 유틸** — `src/shared/lib/css-utils.ts` (본 프로젝트는 `utils.ts` 대신 `css-utils.ts` 로 관리):

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 5. shadcn/ui 공통 컴포넌트 추가

`components.json` alias 에 따라 `src/shared/ui/` 로 소스가 생성됩니다.

```bash
pnpm dlx shadcn@latest add button dialog table badge card input select tooltip tabs
```

`src/shared/ui/index.ts` 배럴 파일로 상위 계층에서 `@/shared/ui` 단일 경로로 임포트하도록 노출합니다.

```ts
export * from "./badge"
export * from "./button"
export * from "./card"
export * from "./dialog"
export * from "./input"
export * from "./select"
export * from "./table"
export * from "./tabs"
export * from "./tooltip"
export * from "./pagination"
```

### Step 6. Froala WYSIWYG Editor 설치

```bash
pnpm add react-froala-wysiwyg froala-editor
pnpm add font-awesome
```

에디터 스타일은 사용 지점(`src/app/main.tsx`, 팝업/위젯 컴포넌트)에서 import 합니다.

```ts
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'
```

### Step 7. 본문 폰트 설치

```bash
pnpm add @fontsource-variable/geist
```

### Step 8. 환경 변수 파일 구성

| 파일 | 내용 | 설명 |
|---|---|---|
| `.env.localhost` | `VITE_API_URL=` | 빈 값 → Axios `baseURL` 비움 → Vite 프록시(`/feature`, `/api`) 경유 |
| `.env.development` | `VITE_API_URL=` | 개발 서버에서도 프록시 사용 |
| `.env.production` | `VITE_API_URL=https://<운영 API 도메인>` | 배포 시 실제 API 오리진 지정 |

Axios 인스턴스는 `import.meta.env.VITE_API_URL || ''` 를 `baseURL` 로 사용하므로,
로컬에서는 빈 값으로 두어 `vite.config.ts` 의 프록시가 `http://127.0.0.1:8080` (백엔드)로 요청을 전달합니다.

### Step 9. FSD 레이어 스캐폴딩

```bash
mkdir -p src/app/{providers,routes,layout/{model,ui},styles}
mkdir -p src/pages src/widgets src/features src/entities
mkdir -p src/shared/{api,lib/hooks,model,ui/pagination}
```

- `src/app` : `main.tsx`(진입점), `App.tsx`(`QueryProvider` > `AppRouter`), `providers/`, `routes/`, `layout/`, `styles/`
- `src/shared/api` : `axios-instance.ts` → `auth-interceptor.ts` → `error-handler.ts` → `http-client.ts` → `api-response.type.ts` 순으로 구성 후 `index.ts` 배럴
- 각 `features/*`, `entities/*` 슬라이스는 `api/` · `model/` · `ui/` 세그먼트와 `index.ts`(public API)로 구성

### Step 10. ESLint (Flat Config)

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

`eslint.config.js` 는 `dist` 무시 + `js.recommended` + `typescript-eslint.recommended` + react-hooks / react-refresh 프리셋으로 구성합니다.

### Step 11. 검증

```bash
pnpm lint      # 린트 통과 확인
pnpm build     # tsc -b 타입체크 + vite build
pnpm dev       # http://localhost:7080 구동 확인
```

---

## 6. 백엔드 연동

- 개발 시 모든 API 요청은 Vite Dev Server(`:7080`)의 프록시를 통해 백엔드(`:8080`)로 전달됩니다.
  - `/feature/**` → `http://127.0.0.1:8080/feature/**`
  - `/api/**` → `http://127.0.0.1:8080/**` (`/api` prefix 제거)
- 연동 대상: `inform_note-facade` 모듈의 `feature` 패키지 RestController

| Feature 슬라이스 | Method | Endpoint |
|---|---|---|
| `down-event-card-search` | POST | `/feature/maintenance/find-down-event-cards/fetch` |
| `technician-select` | POST | `/feature/maintenance/find-technicians/fetch` |
| `action-popup-seach` | POST | `/feature/maintenance/find-action-popup/fetch` |
| `corrective-action-save` | POST | `/feature/maintenance/corrective-action/command` |
| `editor-file-upload` | POST | `/feature/file-handler/register-temp-file/command` |
| `editor-file-upload` | GET | `/feature/file-handler/view/{fileId}` |

---

## 7. 설정 파일 요약

| 파일 | 역할 |
|---|---|
| `vite.config.ts` | React·Tailwind v4 플러그인, `@` alias, 포트 7080, 백엔드 프록시 |
| `tsconfig.json` | 프로젝트 레퍼런스 + FSD 경로 별칭 |
| `tsconfig.app.json` | 앱 소스 컴파일 옵션 (bundler resolution, `react-jsx`, strict lint 규칙) |
| `tsconfig.node.json` | `vite.config.ts` 전용 Node 컴파일 설정 |
| `components.json` | shadcn/ui 스타일(`radix-nova`)·baseColor(`neutral`)·아이콘(`lucide`) 및 FSD alias 바인딩 |
| `eslint.config.js` | ESLint Flat Config |
| `tailwind.config.js` | (레거시 v3 스타일) 툴링 호환용 — 실제 테마 토큰은 `src/app/styles/index.css` |
| `src/app/styles/index.css` | Tailwind v4 진입 CSS, 디자인 토큰(`@theme inline`), Froala `.fr-view` 렌더 보정 |
