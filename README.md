# GHOST Book: 졸업생(OB) 네트워킹 웹 애플리케이션

동아리 선후배 간의 네트워킹을 돕는 '인터넷 명함 지갑' 웹사이트입니다. "미니멀리즘", "개인정보 보호", "모바일 퍼스트"를 핵심 가치로 합니다.

## 1. 기술 스택 (Tech Stack)

- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS
- **UI Library:** Shadcn/ui, Lucide React (Icons), Framer Motion (Animations)
- **Backend:** Next.js Server Actions
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## 2. 주요 기능 및 개발 현황 (Features & Progress)

### 메인 페이지 (Main Page)

- [x] **반응형 디자인**: 모바일 중심의 카드 리스트 UI 및 데스크탑 4단 그리드 레이아웃.
- [x] **애니메이션 헤더 (Animated Header)**: 스크롤 시 부드럽게 사라지고 나타나는 인터랙티브 헤더.
- [x] **검색 및 필터**:
  - 이름, 회사명, 직무 실시간 검색 (페이지 새로고침 없는 Client-Side Routing).
  - 태그 필터 (Frontend, Backend, AI 등) 적용 시 스크롤 위치 유지.
- [x] **부드러운 스크롤**: 'Scroll Down' 화살표 및 'Top' 버튼을 통한 부드러운 네비게이션.

### 상세 정보 (Detail View)

- [x] **모달/드로어 (Modal/Drawer)**: 데스크탑에서는 다이얼로그, 모바일에서는 드로어(Drawer) 형태로 상세 정보 제공.
- [x] **스크롤 위치 유지**: 상세 정보 확인 후 닫을 때 목록의 원래 위치 유지.
- [x] **보안 강화 (Security)**:
  - 외부 링크(LinkedIn, Blog) 안전하게 열기 (`rel="noopener noreferrer"`).
  - 이메일 복사 기능.

### 마이페이지 (My Page)

- [x] **프로필 관리**: 본인의 정보(회사, 직무, 소개 등) 수정 기능.
- [x] **UX 개선**: 자기소개 작성 시 실시간 글자수 카운터 표시.
- [x] **데이터 검증**:
  - URL 유효성 검사 (악성 스크립트 방지).
  - 서버 액션 타입 안정성 강화 (`useActionState`).

### 인증 (Authentication)

- [x] **Google OAuth**: 구글 계정을 통한 간편 로그인.
- [x] **배포 환경 최적화**: 운영 환경(`ghostbook-sigma.vercel.app`)에 맞춘 리다이렉트 설정 완료.

## 3. 데이터베이스 스키마 (Supabase PostgreSQL)

기존 Oracle SQL 설계안을 바탕으로 Supabase PostgreSQL에 맞춰 구현되었습니다.

```sql
-- 선배 정보 테이블 (tb_alumni)
-- 태그 테이블 (tb_tags)
-- 매핑 테이블 (tb_alumni_tags)
```

(상세 스키마는 마이그레이션 파일 참고)

## 4. UI/UX 디자인 철학 (Design Philosophy)

1.  **Immersive Intro**: 첫 진입 시 블랙 배경의 미니멀한 인트로로 몰입감 조성.
2.  **Seamless Navigation**: 검색, 필터링, 상세 보기 시 문맥이 끊기지 않는 부드러운 경험 제공.
3.  **Privacy First**: 민감한 정보(전화번호)는 배제하고 필요한 정보(링크, 이메일)만 안전하게 제공.
