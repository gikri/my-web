# GSAP & Three.js 한의원 스토리텔링 랜딩페이지 기획안

본 문서는 HTML, CSS, Vanilla JavaScript와 웹 모션 기술(GSAP, Three.js)을 활용하여 "한의원(Korean Medicine Clinic)"을 주제로 제작될 프리미엄 웹페이지의 전반적인 구조와 핵심 모션 기획을 담고 있습니다. 통 이미지 배경과 고급스러운 분위기 연출에 집중합니다.

## 🛠 기술 스택 (Tech Stack)

## 🛠 기술 스택 (Tech Stack)

- **Markup / Style**: HTML5, Vanilla CSS
  - **CSS 변수(Custom Properties)** 기반의 철저한 테마 관리로 확장성과 유지보수성 확보
  - **CSS Flexbox/Grid**를 활용한 반응형 레이아웃
- **Logic / Interaction**: Vanilla JavaScript (ES6+)
- **Motion / Animation**: GSAP (ScrollTrigger, SplitText, ScrollToPlugin)
- **3D WebGL**: Three.js (수묵화, 한약재, 연기/기운(氣) 등 전통적 오브젝트 및 파티클)
- **Logic / Interaction**: Vanilla JavaScript (ES6+)
- **Motion / Animation**: GSAP (ScrollTrigger, SplitText, ScrollToPlugin)
- **3D WebGL**: Three.js (수묵화, 한약재, 연기/기운(氣) 등 전통적 오브젝트 및 파티클)

---

## 📑 핵심 섹션 구성 (Core Sections)

스크롤 흐름에 따라 한의원의 신뢰감, 치료 철학, 진료 과정을 자연스럽게 경험(Scrollytelling)할 수 있는 원페이지(One-Page) 레이아웃입니다.

### 1. Hero Section (도입부: 기운의 융합)

- **목적**: 한의원의 전통적이면서도 현대적인 치유의 느낌을 압도적인 배경과 함께 전달.
- **핵심 요소 (통 이미지 배경 활용)**:
  - **Three.js**: 풀스크린 배경에 은은하게 퍼지는 향, 혹은 '기(氣)'를 형상화한 입자(Particle) 효과. 동양적인 수묵화 스타일 텍스처를 3D 평면에 입혀 마우스에 따라 흔들리는 모션 구현.
  - **GSAP**: "자연의 이치로 몸을 바라보다" 등의 메인 캘리그라피 스타일 타이포그래피. 스크롤 전 천천히 나타나고, 스크롤 시작 시 연기처럼 흩어짐(Blur & TranslateY 파라미터).
  - **이미지 연출**: 고급스러운 원내 전경이나 자연물(약재, 은은한 조명) 통 이미지를 화면 꽉 차게 렌더링.

### 2. Core Title Section (핵심 진료 철학)

- **목적**: 한의원의 진료 철학(예: 근본 치료, 체질 개선)을 깊이 있게 전달.
- **핵심 요소**:
  - **배경 트랜지션**: 통 이미지에서 여백이 많은 차분한 배경 컬러(아이보리, 먹색 등)로 크로스페이드.
  - **GSAP ScrollTrigger**: 원장님의 철학이 담긴 문장들이 스크롤에 맞추어 마스킹(Masking) 해제되며 단어 단위(SplitText)로 묵직하게 나타나는 효과.

### 3. History & Expertise Section (연혁 및 전문성)

- **목적**: 굳건히 지켜온 진료 노하우와 원장님의 이력 소개.
- **핵심 요소**:
  - **레이아웃**: 가로 스크롤(Horizontal Scroll) 기법 적용. 수직 스크롤 시 화면은 멈추되 콘텐츠는 좌에서 우로 흘러감.
  - **배경**: 오래된 한의서나 약재함의 질감을 살린 패럴랙스(Parallax) 배경 이미지.
  - **GSAP & Three**: 연도/업적을 지날 때마다 배경의 Three.js 라이팅이 부드럽게 변하며 시선을 유도.

### 4. Gallery Section (원내 공간 & 약재 갤러리)

- **목적**: 청결하고 프리미엄한 원내 인테리어 및 정성을 다해 고른 한약재 통 이미지 전시.
- **핵심 요소**:
  - **Three.js WebGL 텍스처**: 통 이미지 갤러리 아이템들에 마우스를 올렸을 때(Hover) 물방울이 맺히는 것 같은 액체 셰이더(Distortion Shader) 효과나 안개가 걷히는 효과 스크립팅.
  - **GSAP**: 이미지가 격자 배열 상태에서 스크롤 진입 시 퍼즐 맞춰지듯 등장하는 스태거(Stagger) 모션.

### 5. Therapy / Weekly Video Section (치료 과정 & 주간 건강 정보 영상)

- **목적**: 침술, 추나, 뜸 등의 치료 영상이나 매주 업데이트 되는 건강 정보 비디오 제공.
- **핵심 요소**:
  - **영상 배경**: 통 영상 비율(16:9 이상 꽉 찬 화면)을 배경으로 활용해 치료의 디테일 전달.
  - **Custom Cursor**: 영상 영역 진입 시 마우스 커서가 한자로 된 원 디자인 형태의 '재생(PLAY)' 커서로 변경되는 기능.
  - **모달(Modal) 트랜지션**: 클릭 시 GSAP를 이용해 썸네일 이미지가 전체 화면으로 끊김 없이 확대(FLIP 기법)된 후 영상 재생.

### 6. Outro & Footer (오시는 길 및 예약 예약안내)

- **목적**: 방문 전 위치 확인 및 진료 예약(CTA) 액션 극대화.
- **핵심 요소**:
  - **이미지**: 따뜻하게 환대하는 접수처 통 이미지 배경 위 반투명 유리 질감(Glassmorphism) 카드 UI 형태의 텍스트 상자 배치.
  - **Three.js 무한 루프**: 약전(약탕기) 주위를 도는 부드러운 오라(Aura)나 따뜻한 빛 입자를 작게 표현하여 퀄리티 상승.
  - **GSAP**: 매끄러운 스크롤 탑 버튼과 하단 전화번호/예약 버튼의 심장 박동(Pulse) 플로팅 모션.

---

## 🎨 무드 & 디자인 템플릿(Design Mood & Color Palette)

CSS 변수(`:root`)에 지정하여 유지보수성을 극대화할 컬러 시스템입니다. 전통적이면서도 신뢰감을 주는 모던한 분위기를 연출합니다.

- **Primary Color (포인트 컬러)**: `#ff8a3d` (따뜻한 주황/번트 오렌지 계열 - 활력, 기운, 치유를 상징)
- **Background (주 배경)**: `#1a1a1a` (깊이감 있는 먹색/Charcoal - 고급스러운 통 이미지 여백에 활용)
- **Surface (서브 배경)**: `#2a2a2a` (다크 그레이 - 섹션 전환 시 부드러운 대비)
- **Text (기본 텍스트)**: `#fcf9f2` (따뜻한 미색/Ivory - 한지 질감의 차분한 느낌)
- **Accent (보조 컬러)**: `#3e5c4d` (진녹색 - 청정 한약재, 소나무, 신뢰 상징)

**CSS 변수 예시:**

```css
:root {
  --color-primary: #ff8a3d; /* 메인 주황색 */
  --color-bg-dark: #1a1a1a; /* 먹색 배경 */
  --color-bg-surface: #2a2a2a;
  --color-text-light: #fcf9f2; /* 미색 텍스트 */
  --color-accent: #3e5c4d; /* 진녹색 포인트 */
}
```

- **Typography**: 명조체 / 세리프 기반의 웹폰트(예: 본명조, 순명조 등)를 활용하여 전통적이면서도 세련된 느낌을 강조.

## 🚀 최적화 포인트(Optimization)

- 통 이미지(Full-screen Background)가 많이 사용되므로, 고해상도 WebP 포맷 변환 및 미디어 파편화 대응 필수.
- 스무스 스크롤(Lenis)을 적용해 묵직하고 신뢰감 있는 마우스 휠 경험을 디자인.
