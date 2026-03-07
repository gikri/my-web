import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

const cafe24Font = localFont({
  src: "../public/Cafe24Oneprettynight-v2.0.woff2",
  variable: "--font-cafe24",
});

export const metadata: Metadata = {
  title: "Gikri Web",
  description: "frontend asome website .",
  keywords: "Gikri, Frontend Engineer, React Developer, Three.js",
  authors: [{ name: "Gikri" }],
  creator: "Gikri",
  publisher: "Gikri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Gikri Web - Frontend Engineer",
    description: "웹의 생동감을 코드로 빚어내는 프론트엔드 개발자입니다.",
    url: "https://gikri.show", // 나중에 실제 도메인으로 변경
    siteName: "Gikri's Portfolio",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: 'https://gikri.show/og-image.png', // 권장 사이즈: 1200x630px
        width: 1200,
        height: 630,
        alt: "Gikri's Portfolio Preview Image",
      },
    ],
  },
  /* verification: {
    google: "구글 검색엔진 고유 인증 코드",
  }, */
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} ${cafe24Font.variable} font-sans antialiased`}
      >
        {children}
      </body>
      {/* <GoogleAnalytics gaId={'본인의 Google Analytics 추적 ID'}/> */}
    </html>
  );
}
