import * as THREE from 'three';

const experienceGroup = new THREE.Group();
experienceGroup.position.set(0, -41.5, 12);
experienceGroup.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);

const innerGroup = new THREE.Group();
innerGroup.rotation.set(0, 0, Math.PI / 2);
experienceGroup.add(innerGroup);

const groupRef = new THREE.Group();
groupRef.position.set(0, -1, 0);
innerGroup.add(groupRef);

const gridTile = new THREE.Group();
gridTile.position.set(2, 0, 0); // isMobile ? 1 : 2
groupRef.add(gridTile);

const projectsCarousel = new THREE.Group();
// Let's test a new position: [0, 6, 0] instead of [0, 8.5, 0]
projectsCarousel.position.set(0, 6, 0);
gridTile.add(projectsCarousel);

const fov = Math.PI;
// Let's test a smaller distance: 8 instead of 13
const distance = 8;
const count = 5;

for(let i=0; i<count; i++) {
  const angle = (fov / (count - 1 || 1)) * i;
  const y = -distance * Math.sin(angle);
  const x = -distance * Math.cos(angle);
  const z = 0;
  
  const tile = new THREE.Group();
  tile.position.set(x, y, z);
  projectsCarousel.add(tile);
  
  experienceGroup.updateMatrixWorld(true);
  const tileTarget = new THREE.Vector3();
  tile.getWorldPosition(tileTarget);
  console.log(`Tile ${i} World Pos: X=${tileTarget.x.toFixed(2)}, Z=${tileTarget.z.toFixed(2)}`);
}
