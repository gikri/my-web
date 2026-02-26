import * as THREE from 'three';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Scene Setup ---
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.05);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 8);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x64ffda, 2, 20);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff00ff, 1, 20);
pointLight2.position.set(-2, -3, -4);
scene.add(pointLight2);

// --- Objects ---

// 1. The Outer Shell (Cube that opens)
const shellGroup = new THREE.Group();
scene.add(shellGroup);

const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1,
    wireframe: true,
    transparent: true,
    opacity: 0.5
});

// We create 6 planes to make a cube so we can animate them opening
const planeGeo = new THREE.PlaneGeometry(3, 3);
const panels = [];

const panelConfigs = [
    { pos: [0, 0, 1.5], rot: [0, 0, 0] },         // Front
    { pos: [0, 0, -1.5], rot: [0, Math.PI, 0] },  // Back
    { pos: [0, 1.5, 0], rot: [-Math.PI/2, 0, 0] },// Top
    { pos: [0, -1.5, 0], rot: [Math.PI/2, 0, 0] },// Bottom
    { pos: [1.5, 0, 0], rot: [0, Math.PI/2, 0] }, // Right
    { pos: [-1.5, 0, 0], rot: [0, -Math.PI/2, 0] }// Left
];

panelConfigs.forEach(config => {
    const mesh = new THREE.Mesh(planeGeo, shellMaterial);
    mesh.position.set(...config.pos);
    mesh.rotation.set(...config.rot);
    
    // Store original transform for animations
    mesh.userData.origPos = new THREE.Vector3(...config.pos);
    
    shellGroup.add(mesh);
    panels.push(mesh);
});

// 2. The Core Product (Inner complex shape)
const coreGroup = new THREE.Group();
scene.add(coreGroup);

const coreGeo = new THREE.IcosahedronGeometry(1, 1);
const coreMat = new THREE.MeshStandardMaterial({
    color: 0x64ffda,
    metalness: 0.3,
    roughness: 0.2,
    emissive: 0x64ffda,
    emissiveIntensity: 0.2,
    wireframe: true
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
coreMesh.userData.isCore = true; // For raycaster
coreGroup.add(coreMesh);

// Inner solid core
const innerCoreGeo = new THREE.OctahedronGeometry(0.6);
const innerCoreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0
});
const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
coreGroup.add(innerCoreMesh);

// Hide core initially (scaled down)
coreGroup.scale.set(0, 0, 0);

// --- GSAP Scroll Animations ---

// Setup UI Panels Animations
const uiPanels = document.querySelectorAll('.content');
uiPanels.forEach((panel, i) => {
    gsap.to(panel, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: panel.parentElement,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// 3D Sequence Timeline tied to scroll
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // smooth scrubbing
    }
});

// Step 1: Rotate and push cube back
tl.to(shellGroup.rotation, { x: Math.PI, y: Math.PI, z: Math.PI / 4, duration: 2 }, 0);
tl.to(camera.position, { z: 5 }, 0);

// Step 2: Open the cube (explode panels outwards)
panels.forEach((panel, i) => {
    tl.to(panel.position, {
        x: panel.userData.origPos.x * 2.5,
        y: panel.userData.origPos.y * 2.5,
        z: panel.userData.origPos.z * 2.5,
        duration: 2
    }, 1);
    tl.to(panel.material, { opacity: 0.1, duration: 2 }, 1);
});

// Step 3: Reveal Core
tl.to(coreGroup.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.7)" }, 1.5);
tl.to(coreGroup.rotation, { x: Math.PI * 2, y: Math.PI * 2, duration: 4 }, 1.5);

// Step 4: Move camera around the core for Panel 3
tl.to(camera.position, { x: 3, z: 3, duration: 2 }, 3);
tl.to(coreGroup.position, { x: -1, duration: 2 }, 3); // shift core to the left


// --- Raycaster & Mouse Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');
let isHoveringCore = false;

window.addEventListener('mousemove', (event) => {
    // Parallax effect on entire scene
    const x = (event.clientX / sizes.width - 0.5) * 2;
    const y = -(event.clientY / sizes.height - 0.5) * 2;
    
    gsap.to(scene.rotation, {
        x: y * 0.1,
        y: x * 0.1,
        duration: 1
    });

    // Update tooltip position
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = event.clientY + 'px';

    // Raycasting for hover effects
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(coreGroup.children);

    if (intersects.length > 0) {
        if (!isHoveringCore) {
            isHoveringCore = true;
            document.body.style.cursor = 'pointer';
            tooltip.style.opacity = 1;
            // Pulse the core
            gsap.to(coreMesh.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
            gsap.to(coreMat, { emissiveIntensity: 0.8, duration: 0.3 });
        }
    } else {
        if (isHoveringCore) {
            isHoveringCore = false;
            document.body.style.cursor = 'default';
            tooltip.style.opacity = 0;
            gsap.to(coreMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            gsap.to(coreMat, { emissiveIntensity: 0.2, duration: 0.3 });
        }
    }
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Idle rotation for core
    if (coreGroup.scale.x > 0) {
        innerCoreMesh.rotation.y = elapsedTime * 0.5;
        innerCoreMesh.rotation.x = elapsedTime * 0.2;
    }

    // Slowly rotate outer shell
    shellGroup.rotation.y += 0.001;
    shellGroup.rotation.x += 0.001;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

// --- Resize Handler ---
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
