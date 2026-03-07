import { Svg, Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { FOOTER_LINKS } from "../../constants";
import { FooterLink } from "../../types";

const FooterLinkItem = ({ link }: { link: FooterLink }) => {
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  const onClick = () => {
    if (link.url.startsWith('tel:') || link.url.startsWith('mailto:')) {
      window.location.href = link.url;
    } else {
      window.open(link.url, '_blank');
    }
  };
  const onPointerMove = (e: MouseEvent) => {
    if (isMobile) return;
    const hoverDiv = document.getElementById(`footer-link-${link.name}`);
    gsap.to(hoverDiv, {
      top: `${e.clientY + 14}px`,
      left: `${e.clientX}px`,
      duration: 0.6,
    });
  };

  const fontProps = {
    font: "./Vercetti-Regular.woff",
    fontSize: 0.2,
    color: 'white',
    onPointerOver,
    onPointerMove,
    onPointerOut,
    onClick,
  };

  useEffect(() => {
    if (!document.getElementById(`footer-link-${link.name}`)) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = `footer-link-${link.name}`;
      hoverDiv.textContent = link.hoverText ?? link.name.toUpperCase();
      hoverDiv.style.position = 'fixed';
      hoverDiv.style.zIndex = '2';
      hoverDiv.style.bottom = '0';
      hoverDiv.style.opacity = '0';
      hoverDiv.style.left = window.innerWidth / 2 + 'px';
      hoverDiv.style.fontSize = '0.8rem';
      hoverDiv.style.pointerEvents = 'none';
      document.body.appendChild(hoverDiv);
    }
  }, [])

  useEffect(() => {
    if (isMobile) return

    const hoverDiv = document.getElementById(`footer-link-${link.name}`);

    if (hovered) {
      document.body.style.cursor = 'pointer';
      gsap.fromTo(hoverDiv, { opacity: 0 }, { opacity: 0.5, delay: 0.2 });
    } else {
      document.body.style.cursor = 'auto';
      gsap.to(hoverDiv, { opacity: 0 });
    }

    gsap.to(textRef.current, {
      letterSpacing: hovered ? 0.3 : 0,
      duration: 0.3,
    });

    return () => {
      document.body.style.cursor = 'auto';
      gsap.killTweensOf(hoverDiv);
      gsap.killTweensOf(textRef.current);
    }
  }, [hovered]);

  if (isMobile) {
    return (
      <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        {/* 실제 보이는 아이콘 (터치 이벤트는 그룹 모델로 넘김) */}
        <Svg scale={0.0015} position={[0.1, 0.25, 0]} src={link.icon} />
        {/* 투명한 히트박스 (터치 영역을 넓게 확보) */}
        <mesh position={[0.4, 0.4, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    );
  }

  return (
    <Text ref={textRef} {...fontProps} >
      {link.name.toUpperCase()}
    </Text>
  )
}

const Footer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame(() => {
    const d = data.range(0.8, 0.2);
    if (groupRef.current) {
      groupRef.current.visible = d > 0;
    }
  });

  const spacing = isMobile ? 1.1 : 2;
  const getLinks = () => {
    return FOOTER_LINKS.map((link, i) => {
      return (
        <group key={i} position={[i * spacing, 0, 0]}>
          <FooterLinkItem link={link}/>
        </group>
      );
    });
  };

  const totalWidth = (FOOTER_LINKS.length - 1) * spacing;
  const offsetX = -totalWidth / 2;

  return (
    <group position={[0, -44, 18]} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>
      <group position={[offsetX, 0, 0]}>
        { getLinks() }
      </group>
    </group>
  );
};

export default Footer;