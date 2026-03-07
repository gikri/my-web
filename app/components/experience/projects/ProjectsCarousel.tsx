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
    // PC 2x2 Grid Layout
    const PC_GRID_LAYOUT = [
      { position: [-4.5, -8.5, 2] as [number, number, number], rotation: [0, Math.PI / 12, 0] as [number, number, number] },
      { position: [-4.5, -5, 2] as [number, number, number],  rotation: [0, Math.PI / 12, 0] as [number, number, number] },
      { position: [4.5, -8.5, 2] as [number, number, number],  rotation: [0, -Math.PI / 12, 0] as [number, number, number] },
      { position: [4.5, -5, 2] as [number, number, number],   rotation: [0, -Math.PI / 12, 0] as [number, number, number] },
    ];

    // Mobile 2x2 Grid Layout (좀 더 오밀조밀하게 모으고, 각도도 조절 가능)
    const MOBILE_GRID_LAYOUT = [
      { position: [-2.5, -3, 2] as [number, number, number], rotation: [0, Math.PI / 16, 0] as [number, number, number] },
      { position: [-2.5, .5, 2] as [number, number, number],  rotation: [0, Math.PI / 16, 0] as [number, number, number] },
      { position: [2.5, -3, 2] as [number, number, number],  rotation: [0, -Math.PI / 16, 0] as [number, number, number] },
      { position: [2.5, .5, 2] as [number, number, number],   rotation: [0, -Math.PI / 16, 0] as [number, number, number] },
    ];

    const GRID_LAYOUT = isMobile ? MOBILE_GRID_LAYOUT : PC_GRID_LAYOUT;

    const middleIndex = 1; // Arbitrary center for animation delay calculation

    return PROJECTS.map((project, i) => {
      // Fallback just in case there are fewer or more than 4 items
      const layout = GRID_LAYOUT[i] || { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] };

      return (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          middleIndex={middleIndex}
          position={layout.position}
          rotation={layout.rotation}
          activeId={activeId}
          onClick={() => onClick(i)}
          expandDirection={i === 1 || i === 3 ? "down" : "up"}
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