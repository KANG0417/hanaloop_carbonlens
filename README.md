# CarbonLens — 탄소 배출량 관리 시스템

> Hanaloop의 공급망 온실가스(GHG) 배출량을 추적·분석·관리하는 대시보드입니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | CarbonLens |
| **개발 기간** | 2025.05 ~ 진행 중 |
| **목적** | ISO 14067 기준 제품 탄소발자국(PCF) 산정 및 온실가스 배출량 가시화 |
| **대상** | 공급망 협력사 및 내부 탄소 관리 담당자 |

---

## 주요 기능

- **배출 현황 대시보드** — 월별 온실가스 배출량 추이 차트, 전과정(PCF) 5단계 배출 상세
- **데이터 관리** — 엑셀 업로드(xlsx) 및 수동 입력, Zod 유효성 검사, CO₂e 자동 환산
- **배출계수 관리** — 항목·단위·계수 버전별 등록·수정·삭제, Supabase DB 연동
- **다국가·다회사 필터** — 국가(🇰🇷🇨🇳🇯🇵🇩🇪🇺🇸) 및 회사별 필터링, 연도별 필터

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| 상태·폼 | React Hook Form + Zod |
| 차트 | Recharts |
| DB | Supabase (PostgreSQL) |
| 패키지 관리 | Yarn Berry 4 |
| 아키텍처 | Feature-Sliced Design (FSD) |

---

## 실행 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd hanaloop_carbonlens
```

### 2. 패키지 설치 (Yarn Berry)

```bash
yarn install
```

> **Yarn이 없는 경우** 먼저 설치하세요.
> ```bash
> npm install -g yarn
> yarn set version berry
> ```

### 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Supabase 프로젝트 정보를 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Supabase URL과 Key는 [supabase.com](https://supabase.com) → 프로젝트 선택 → **Settings → API**에서 확인할 수 있습니다.

### 4. Supabase 테이블 생성

Supabase 대시보드 → **SQL Editor**에서 아래 쿼리를 실행합니다.

```sql
CREATE TABLE emission_factors (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  unit        TEXT        NOT NULL,
  factor      NUMERIC     NOT NULL,
  version     TEXT        NOT NULL DEFAULT '1.0',
  source      TEXT        DEFAULT '',
  note        TEXT        DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE emission_factors DISABLE ROW LEVEL SECURITY;
```

### 5. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 배출 현황 대시보드 |
| `/input` | 데이터 관리 (엑셀 업로드 / 수동 입력) |
| `/factors` | 배출계수 버전 관리 |

---

## 디렉토리 구조 (FSD)

```
src/
├── app/          # Next.js App Router 페이지
├── pages/        # 페이지 컴포넌트 (FSD)
├── widgets/      # 대형 독립 UI 블록
├── features/     # 사용자 시나리오 기능
├── entities/     # 비즈니스 엔티티 (company, emission, activity)
└── shared/       # 공용 UI, 유틸, 훅
```
