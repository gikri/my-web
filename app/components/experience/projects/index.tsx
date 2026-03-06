import { useHelper, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import ProjectsCarousel from "./ProjectsCarousel";
import { TouchPanControls } from "./TouchPanControls";

const Projects = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const data = useScroll();
  
  // 도움말: 특정 메쉬나 조명에 useHelper를 쓰고 싶다면 아래와 같이 ref를 연결하세요.
  const meshRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper(meshRef as any, THREE.BoxHelper, 'cyan');

  useEffect(() => {
    // Hide scrollbar when active.
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 0, y: 0, x: 1, duration: 1 });
      } else {
        gsap.to(camera.position, { z: 11.76, y: -33, x: 2, duration: 1 });
      }
    }
  }, [isActive]);

  useFrame((state, delta) => {
    // [DEBUG] 실시간 카메라 좌표 확인 (필요할 때 주석 해제하여 사용하세요)
    console.log(`Camera Pos - x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}`);

    if (isActive) {
      if (!isMobile) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 4, 0.03);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.76 - state.pointer.y, 7, delta);
      }
    }
  });

  return (
    <group>
      {/* [DEBUG] 좌표축 표시 (빨강:x, 초록:y, 파랑:z) - 위치 잡기가 끝나면 삭제하세요 */}
      
      <SpaceBoi rotation={new THREE.Euler(0, 0, 0)} scale={new THREE.Vector3(1, 1, 1)} position={new THREE.Vector3(0, -1, 0)}/>
      <ProjectsCarousel position={[0, 8.5, 0]} />
      { isActive && isMobile && <TouchPanControls /> }
    </group>
  );
};

export default Projects;
