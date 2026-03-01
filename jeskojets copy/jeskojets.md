# 로담 한의원 랜딩 페이지 기획서 (Jeskojets 스타일 반영)

## 📌 프로젝트 개요

[Jeskojets.com](https://jeskojets.com)의 혁신적이고 동적인 랜딩 페이지 스크롤 경험을 '로담 한의원'에 접목시킨 프리미엄 웹 페이지를 구축합니다.

## 🛠 기술 스택 (Tech Stack)

- **Markup / Style**: HTML5, Vanilla CSS
  - **CSS 변수(Custom Properties)** 기반의 철저한 테마 관리로 확장성과 유지보수성 확보
  - **CSS Flexbox/Grid**를 활용한 반응형 레이아웃
- **Logic / Interaction**: Vanilla JavaScript (ES6+)
- **Motion / Animation**: GSAP (ScrollTrigger, SplitText, ScrollToPlugin)
- **3D WebGL**: Three.js (수묵화, 한약재, 연기/기운(氣) 등 전통적 오브젝트 및 파티클)

## 🎨 무드 & 디자인 템플릿 (Design Mood & Color Palette)

전통적이면서도 신뢰감을 주는 모던한 분위기를 연출합니다. 컬러 시스템은 CSS 변수(`:root`)에 지정하여 유지보수성을 극대화합니다.

- **Primary Color (포인트 컬러)**: `#ff8a3d` (따뜻한 주황/번트 오렌지 계열 - 활력, 기운, 치유를 상징)
- **Background (주 배경)**: `#1a1a1a` (깊이감 있는 먹색/Charcoal - 고급스러운 통 이미지 여백에 활용)
- **Surface (서브 배경)**: `#2a2a2a` (다크 그레이 - 섹션 전환 시 부드러운 대비)
- **Text (기본 텍스트)**: `#fcf9f2` (따뜻한 미색/Ivory - 한지 질감의 차분한 느낌)
- **Accent (보조 컬러)**: `#3e5c4d` (진녹색 - 청정 한약재, 소나무, 신뢰 상징)

**CSS 변수 예시:**

```css
:root {
  --color-primary: #ff8a3d;
  --color-bg-main: #1a1a1a;
  --color-bg-surface: #2a2a2a;
  --color-text-main: #fcf9f2;
  --color-accent: #3e5c4d;
}
```

## 🚀 최적화 포인트 (Optimization)

- 통 이미지(Full-screen Background)가 많이 사용되므로, 고해상도 WebP 포맷 변환 및 미디어 파편화 대응 필수.
- 스무스 스크롤(Lenis)을 적용해 묵직하고 신뢰감 있는 마우스 휠 경험을 디자인.

## 📑 섹션 구성 (Section Structure)

### 1. Hero Section

- **Visual**: 전체 화면 배경(통 이미지)에 집중. Three.js 파티클을 활용해 공기 중의 신비로운 '기운(氣)'이나 연기(향) 등을 Subtle하게 표현.
- **Content**: 로담 한의원의 철학을 담은 메인 카피.
- **Interaction**: GSAP SplitText를 활용한 우아한 텍스트 등장, 마우스 움직임이나 스크롤에 반응하는 패럴랙스와 3D 파티클.

### 2. Core Title Section

- **Visual**: 스크롤에 따라 텍스트가 서서히 가시화되는 임팩트 있는 타이포그래피 뷰. (Jeskojets 텍스트 인터랙션 스타일)
- **Content**: 병원의 핵심 가치관과 비전 강조.
- **Interaction**: ScrollTrigger를 이용한 스크러빙(Scrub) 텍스트 애니메이션, 배경 컬러의 자연스러운 전환(`--color-bg-main` -> `--color-bg-surface`).

### 3. History & Expertise Section

- **Visual**: 원장님 이력, 한의원의 발자취. 배경에 수묵화 붓터치 느낌이나 3D 청정 한약재 오브젝트가 서서히 나타남.
- **Content**: 주요 약력, 전문 진료 분야 요약.
- **Interaction**: GSAP 핀(Pin) 기능을 활용한 가로 스크롤(Horizontal Scroll)로 연혁이나 여러 전문 분야 카드를 와이드하게 탐색.

### 4. Gallery Section

- **Visual**: 프리미엄 호텔 느낌의 대기실, 진료실, 탕전실 등의 고해상도 갤러리(WebP 포맷 사용).
- **Interaction**: 스크롤 진입 시 이미지에 뷰포트 대비 패럴랙스(Parallax) 왜곡 효과 적용, 마우스 호버 시 마그네틱 커서 반응이나 이미지 스케일 업 애니메이션.

### 5. Therapy / Weekly Video Section

- **Visual**: 텍스트를 최소화하고, 주간 진료 사례나 치료 과정을 담은 고화질 백그라운드 비디오 재생 영역.
- **Content**: 시각적인 치료 프로그램 하이라이트.
- **Interaction**: 스크롤로 섹션 중앙 도달 시 영상 스케일 확대 및 자동 재생. 커스텀 마우스 오버레이(ex. 'PLAY', 'VIEW MORE') 표시.

### 6. Outro & Footer

- **Visual**: 부드러운 곡선이나 페이드로 마무리되는 다크 & 차콜 그레이 톤의 고급스러운 푸터.
- **Content**: 약도(지도), 진료 및 예약 안내 상담 센터, SNS 링크, 카피라이트.
- **Interaction**: 스크롤 시 아래에서 위로 밀려 올라오는 Reveal 모션. GSAP ScrollToPlugin을 사용한 부드러운 '최상단으로 가기(Back to Top)' 버튼.
