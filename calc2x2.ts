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
// Let's use the old position from index.tsx: [0, 8.5, 0]
projectsCarousel.position.set(0, 8.5, 0);
gridTile.add(projectsCarousel);

experienceGroup.updateMatrixWorld(true);

const cameraParams = { z: 10.8, y: -33, x: 2, fovZ: [5, 15] };

// Function to test mapping local (x, y) to World pos
function testLocalPos(name, localX, localY, rotY) {
  const tile = new THREE.Group();
  tile.rotation.y = rotY;
  tile.position.set(localX, localY, 0);
  projectsCarousel.add(tile);
  experienceGroup.updateMatrixWorld(true);
  
  const tileTarget = new THREE.Vector3();
  tile.getWorldPosition(tileTarget);
  console.log(`${name} local(${localX.toFixed(2)}, ${localY.toFixed(2)}) -> World X=${tileTarget.x.toFixed(2)}, Z=${tileTarget.z.toFixed(2)}`);
}

// Old positions of React and Three
testLocalPos('React (Old)', -9.19, -9.19, Math.PI/4);
testLocalPos('Three (Old)', 9.19, -9.19, -Math.PI/4);

console.log("-------------------");
// Try some grid positions!
const dx = 9.19;
// Let's see what happens if we change local Y to move "Above" on screen (Z higher)
testLocalPos('Grid Bottom Left (React?)', -dx, -4, Math.PI/6);
testLocalPos('Grid Top Left', -dx, -10, Math.PI/6);
testLocalPos('Grid Bottom Right (Three?)', dx, -4, -Math.PI/6);
testLocalPos('Grid Top Right', dx, -10, -Math.PI/6);
