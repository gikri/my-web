import { Edges, Text, TextProps } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { usePortalStore } from "@stores";
import { Project } from "@types";

interface ProjectTileProps {
  project: Project;
  index: number;
  middleIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
  activeId: number | null;
  onClick: () => void;
  expandDirection?: 'up' | 'down';
}

const ProjectTile = ({ project, index, middleIndex, position, rotation, activeId, onClick, expandDirection = 'up' }: ProjectTileProps) => {
  const projectRef = useRef<THREE.Group>(null);
  const hoverAnimRef = useRef<gsap.core.Timeline | null>(null);
  const [hovered, setHovered] = useState(false);
  const isProjectSectionActive = usePortalStore((state) => state.activePortalId === "projects");

  const titleProps = useMemo(() => ({
    font: "./soria-font.ttf",
    color: "black",
  }), []);

  const subtitleProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "black",
    anchorX: "left",
    anchorY: "top",
  }), []);

  const koreanFontProps: Partial<TextProps> = useMemo(() => ({
    font: "./Cafe24Oneprettynight-v2.0.woff",
    color: "black",
    anchorX: "left",
    anchorY: "top",
  }), []);

  useEffect(() => {
    if (!projectRef.current) return;
    hoverAnimRef.current?.kill();

    const [mesh, title, dateGroup, textBox, button] = projectRef.current.children;

    const isUp = expandDirection === 'up';

    // 모바일에서 활성화 시, 자신의 초기 위치(position prop)를 상쇄(-position)하여
    // parent group 기준 중앙(0, 0)으로 이동하게 만듭니다.
    const targetX = hovered && isMobile ? -position[0] : 0;
    // Y축 센터는 조금 위쪽(-position[1]보다 살짝 더 올리거나 내릴 수 있음, 일단 정중앙으로 상쇄)
    // 아래 타일이 너무 위로 올라간다고 하셔서 상쇄값 그대로(-position[1]) 사용 혹은 약간만 보정
    const targetY = hovered && isMobile ? -position[1] - 1.5 : (hovered ? 1.0 : 0);
    // 모바일에서 활성화 시 정면을 바라보게(기존 기울기 풂)
    const targetRotY = hovered && isMobile ? -rotation[1] : 0;
    // 80vw 차지할 정도로 매우 크게 스케일업 (대략 2.6 ~ 2.8배 크기)
    const targetScale = hovered ? (isMobile ? 1.8 : 1.3) : 1;

    hoverAnimRef.current = gsap.timeline();
    hoverAnimRef.current
      .to(projectRef.current.position, { 
        x: targetX,
        y: targetY,
        z: hovered ? (isMobile ? 3.5 : 0.8) : 0, // Z축으로 최대한 튀어나오게 (화면 꽉 차게)
        duration: 0.4,
        ease: "power2.out"
      }, 0)
      .to(projectRef.current.rotation, {
        y: targetRotY,
        duration: 0.4,
        ease: "power2.out"
      }, 0)
      .to(projectRef.current.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.4,
        ease: "power2.out"
      }, 0)
      .to(title.position, { y: hovered ? (isUp ? 0.7 : -1.3) : -0.8 }, 0)
      .to(textBox.position, { y: hovered ? (isUp ? 0.7 : -1.3) : 0 }, 0)
      .to(textBox, { fillOpacity: hovered ? 1 : 0, duration: 0.4 }, 0)
      .to(dateGroup.position, { y: hovered ? (isUp ? 2.6 : 1.4) : 1.4 }, 0)
      .to(mesh.scale, { y: hovered ? 2 : 1 }, 0)
      .to((mesh as THREE.Mesh).material, { opacity: hovered ? 1 : 0.3 }, 0)
      .to(mesh.position, { y: hovered ? (isUp ? 1 : -1) : 0 }, 0);

    if (project.url) {
      hoverAnimRef.current
        .to(button.scale, { y: hovered ? 1 : 0, x: hovered ? 1 : 0 }, 0)
        .to(button.position, { z: hovered ? 0.3 : -1, y: hovered ? (isUp ? -0.6 : -2.6) : -0.6 }, 0);
    }
  }, [hovered]);

  useEffect(() => {
    if (isMobile) {
      setHovered(activeId === index);
    }
  }, [isMobile, activeId]);

  useEffect(() => {
    if (projectRef.current) {
      if (isProjectSectionActive) {
        // 중앙에서부터의 거리를 계산하여 딜레이 설정
        const distanceToMiddle = Math.abs(index - middleIndex);
        
        // 초기 상태 설정
        gsap.set(projectRef.current.position, { z: -10 }); // 아래(Z)에서 등장
        gsap.set(projectRef.current.scale, { x: 0, y: 0, z: 0 });

        // 등장 애니메이션
        gsap.to(projectRef.current.position, {
          z: 0,
          duration: 1.2,
          delay: distanceToMiddle * 0.15,
          ease: "power3.out",
        });
        
        gsap.to(projectRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          delay: distanceToMiddle * 0.15,
          ease: "back.out(1.7)",
        });
      } else {
        // 나갈 때의 애니메이션
        gsap.to(projectRef.current.position, {
          z: -10, // 아래(Z)로 퇴장
          duration: 0.5,
          ease: "power2.in",
        });
        gsap.to(projectRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }
    }
  }, [isProjectSectionActive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!project.url) return;
    const button = e.eventObject;
    gsap.to(button.position, { z: 0, duration: 0.1 })
      .then(() => gsap.to(button.position, { z: 0.3, duration: 0.3 }));
    setTimeout(() => window.open(project.url, '_blank'), 50);
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isMobile && isProjectSectionActive) setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!isMobile && isProjectSectionActive) setHovered(false);
      }}>
      <group ref={projectRef}>
        <mesh>
          <planeGeometry args={[4.2, 2, 1]} />
          <meshBasicMaterial color="#FFF" transparent opacity={0.3}/>
          {/* <meshPhysicalMaterial transmission={1} roughness={0.3} /> */}
          <Edges color="black" lineWidth={1.5} />
        </mesh>
        <Text
          {...titleProps}
          position={[-1.9, -0.8, 0.101]}
          anchorX="left"
          anchorY="bottom"
          maxWidth={4}
          fontSize={0.8}>
          {project.title}
        </Text>
        <group position={[-1.25, 1.4, 0.01]}>
          <mesh>
            <planeGeometry args={[1.7, 0.4, 1]} />
            <meshBasicMaterial color="#777" opacity={0} wireframe />
            <Edges color="black" lineWidth={1} />
          </mesh>
          <Text
            {...subtitleProps}
            position={[-0.7, 0.2, 0]}
            fontSize={0.3}>
            {project.date.toUpperCase()}
          </Text>
        </group>
        <Text
          {...koreanFontProps}
          maxWidth={3.8}
          position={[-1.9, 2.3, 0.1]}
          // scale={[0, 0, 1]}
          fontSize={0.2}>
          {project.subtext}
        </Text>
        {project.url && (
          <group
            position={[1.3, -0.6, -1]}
            scale={[0, 0, 1]}
            onClick={handleClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <mesh>
              <boxGeometry args={[1.1, 0.4, 0.2]} />
              <meshBasicMaterial color="#222" />
              <Edges color="white" lineWidth={1} />
            </mesh>
            <Text
              {...subtitleProps}
              color="white"
              position={[-0.4, 0.15, 0.2]}
              fontSize={0.25}>
              VIEW ↗
            </Text>
          </group>
        )}
      </group>
    </group>
  );
};

export default ProjectTile;