## 기술 스택 및 구현 상세 (Technical Details)

이 포트폴리오는 현대적인 웹 기술과 3D 그래픽을 결합하여 몰입감 있는 사용자 경험을 제공합니다.

### 1. 핵심 기술 및 사용 이유

| 기술                 | 사용 이유                       | 효과                                       |
| :------------------- | :------------------------------ | :----------------------------------------- |
| **Next.js 15**       | 최신 App Router 기반 프레임워크 | 빠른 로딩, SEO 최적화, 이미지 최적화       |
| **Three.js (R3F)**   | 웹브라우저 내 3D 구현           | 정적인 웹을 3D 입체 공간으로 확장          |
| **React Three Drei** | R3F 유틸리티 라이브러리         | 스크롤 제어, 3D 텍스트 등 복잡한 기능 구현 |
| **GSAP**             | 정교한 애니메이션 엔진          | 부드러운 화면 전환 및 오차 없는 인터랙션   |
| **Zustand**          | 가벼운 상태 관리                | 테마 변경 등 전역 상태의 효율적 관리       |
| **Tailwind CSS**     | 유연한 스타일링                 | UI 요소의 빠른 디자인 및 반응형 대응       |

### 2. 시작하기 (Getting Started)

#### 필수 조건 (Prerequisites)

- Node.js 20.x 이상
- npm 또는 yarn

#### 설치 및 실행 (Installation & Setup)

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

### 3. 프로젝트 구조 (Project Structure)

```text
my-website/
├── app/                  # Next.js App Router
│   ├── components/       # UI 컴포넌트 (UI Components)
│   │   ├── common/       # 공용 컴포넌트 (Common Components)
│   │   ├── experience/   # 3D 환경 구성 (3D Experience)
│   │   ├── models/       # 3D 모델들 (3D Models)
│   │   └── hero/         # 메인 히어로 섹션 (Hero Section)
│   ├── constants/        # 상수 (Constants)
│   ├── stores/           # Zustand 상태 관리 (State Management)
│   └── globals.css       # 전역 스타일 (Global Styles)
├── public/               # 정적 자산 (Static Assets)
└── tailwind.config.ts    # Tailwind 설정 (Tailwind Config)
```

### 4. 3D 구현의 3요소 (Pipeline)

이 프로젝트의 3D 환경은 다음 세 단계를 통해 유기적으로 작동합니다.

1.  **Canvas (도화지)**: `CanvasLoader.tsx`를 통해 3D 렌더링 환경을 설정합니다. `ScrollControls`를 사용하여 사용자의 스크롤 동작과 3D 장면의 변화를 동기화했습니다.
2.  **Models (오브젝트)**: `Cloud`, `Stars`, `WindowModel` 등 다양한 3D 모델을 배치하여 깊이 있는 공간감을 형성합니다. 각 모델은 빛(Lighting)과 그림자(Shadow) 설정이 적용되어 실제 같은 입체감을 줍니다.
3.  **Animation (생동감)**: GSAP와 `useGSAP`을 활용하여 정적인 모델에 움직임을 부여합니다. 로딩 완료 후의 등장 효과와 스크롤에 따른 모델의 물리적인 이동을 제어합니다.

---

## Preview

Some of the sample images from the app. Better to check it out live!
