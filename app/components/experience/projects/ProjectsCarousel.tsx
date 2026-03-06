import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

interface CarouselProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const ProjectsCarousel = ({ position = [0, 0, 0], rotation = [0, 0, 0] }: CarouselProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");

  useEffect(() => {
    if (!isActive) setActiveId(null);
  }, [isActive]);

  const onClick = (id: number) => {
    if (!isMobile) return;
    setActiveId(id === activeId ? null : id);
  };

  const tiles = useMemo(() => {
    const fov = Math.PI;
    const distance = 13;
    const count = PROJECTS.length;
    const middleIndex = Math.floor(count / 2);

    return PROJECTS.map((project, i) => {
      const angle = (fov / (count - 1 || 1)) * i;
      const y = -distance * Math.sin(angle); // 기존 z가 여기서는 y(깊이)
      const x = -distance * Math.cos(angle); // x는 그대로
      const rotY = Math.PI / 2 - angle;

      return (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          middleIndex={middleIndex}
          position={[x, y, 0]} // Z축(높이)은 0으로 고정
          rotation={[0, rotY, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId, isActive]);

  return (
    <group position={position} rotation={rotation}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;