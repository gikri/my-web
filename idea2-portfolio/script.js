import * as THREE from 'three';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030014, 0.02);

const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xc084fc, 2, 50);
pointLight.position.set(0, 0, 0); // Light source at center (sun)
scene.add(pointLight);

// --- Starfield ---
const starsParams = { count: 3000, size: 0.05 };
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsParams.count * 3);

for(let i = 0; i < starsParams.count * 3; i++) {
    starsPositions[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: starsParams.size,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// --- Planets (Projects) ---
const projects = [
    { name: "Nebula E-commerce", desc: "A next-gen headless commerce platform built with Next.js and Shopify.", color: 0x38bdf8, dist: 10, speed: 0.2, size: 1.5 },
    { name: "Aero Dashboards", desc: "Real-time aviation data visualization tools using WebGL.", color: 0xf472b6, dist: 20, speed: 0.15, size: 2.2 },
    { name: "Nova Social", desc: "A decentralized social network connecting creators globally.", color: 0xa78bfa, dist: 30, speed: 0.1, size: 1.8 },
    { name: "Zenith AI", desc: "Conversational AI interfaces for enterprise clients.", color: 0x34d399, dist: 40, speed: 0.08, size: 2.5 }
];

const planets = [];
const planetGroup = new THREE.Group();
scene.add(planetGroup);

const sphereGeo = new THREE.SphereGeometry(1, 64, 64);

projects.forEach((proj, index) => {
    // Planet mesh
    const mat = new THREE.MeshStandardMaterial({
        color: proj.color,
        roughness: 0.4,
        metalness: 0.1,
    });
    
    // Add some noise/texture visually by adding rings or secondary grouped meshes
    const planet = new THREE.Mesh(sphereGeo, mat);
    planet.scale.setScalar(proj.size);
    
    // Position on a circle
    const angle = (index / projects.length) * Math.PI * 2;
    planet.position.x = Math.cos(angle) * proj.dist;
    planet.position.z = Math.sin(angle) * proj.dist;
    
    // Store data for animation and interaction
    planet.userData = {
        name: proj.name,
        desc: proj.desc,
        angle: angle,
        dist: proj.dist,
        speed: proj.speed,
        baseColor: new THREE.Color(proj.color),
        targetScale: proj.size
    };
    
    planets.push(planet);
    planetGroup.add(planet);

    // Orbit path visualization
    const orbitGeo = new THREE.RingGeometry(proj.dist - 0.05, proj.dist + 0.05, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2;
    planetGroup.add(orbit);
});


// --- Raycasting & Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const projectInfoOverlay = document.getElementById('project-info');
const projectTitle = document.getElementById('project-title');
const projectDesc = document.getElementById('project-desc');
const cursorLight = document.querySelector('.cursor-light');
const hero = document.querySelector('.hero');

let hoveredPlanet = null;
let currentScroll = 0;

window.addEventListener('mousemove', (e) => {
    // UI Cursor light
    cursorLight.style.left = e.clientX + 'px';
    cursorLight.style.top = e.clientY + 'px';

    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;

    // Raycast
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const object = intersects[0].object;
        
        if (hoveredPlanet !== object) {
            // Reset previous
            if (hoveredPlanet) {
                gsap.to(hoveredPlanet.material.color, {
                    r: hoveredPlanet.userData.baseColor.r,
                    g: hoveredPlanet.userData.baseColor.g,
                    b: hoveredPlanet.userData.baseColor.b,
                    duration: 0.3
                });
                hoveredPlanet.userData.targetScale = hoveredPlanet.scale.x / 1.2; // scale back
            }
            
            // Set new
            hoveredPlanet = object;
            hoveredPlanet.userData.targetScale = hoveredPlanet.scale.x * 1.2; // scale up
            gsap.to(hoveredPlanet.material.color, { r: 1, g: 1, b: 1, duration: 0.3 }); // highlight
            
            // Update UI
            projectTitle.textContent = hoveredPlanet.userData.name;
            projectDesc.textContent = hoveredPlanet.userData.desc;
            projectInfoOverlay.classList.add('active');
        }
    } else {
        document.body.style.cursor = 'default';
        if (hoveredPlanet) {
            gsap.to(hoveredPlanet.material.color, {
                r: hoveredPlanet.userData.baseColor.r,
                g: hoveredPlanet.userData.baseColor.g,
                b: hoveredPlanet.userData.baseColor.b,
                duration: 0.3
            });
            hoveredPlanet.userData.targetScale = hoveredPlanet.scale.x / 1.2;
            hoveredPlanet = null;
            projectInfoOverlay.classList.remove('active');
        }
    }
});

// Scroll to move camera forward through space
window.addEventListener('scroll', () => {
    currentScroll = window.scrollY;
    
    // Hide hero if scrolled past
    if(currentScroll > 100) {
        hero.style.opacity = 0;
    } else {
        hero.style.opacity = 1;
    }
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate starfield slowly
    stars.rotation.y = elapsedTime * 0.02;

    // Update planets Orbits
    planets.forEach(planet => {
        const data = planet.userData;
        data.angle += data.speed * 0.01;
        
        planet.position.x = Math.cos(data.angle) * data.dist;
        planet.position.z = Math.sin(data.angle) * data.dist;
        
        // Self rotation
        planet.rotation.y += 0.01;

        // Smooth scaling on hover
        planet.scale.lerpScalar(data.targetScale, 0.1);
    });

    // Camera movement based on scroll - move into the solar system
    const targetZ = 20 - (currentScroll * 0.015);
    camera.position.z += (targetZ - camera.position.z) * 0.1;
    
    // Parallax on mouse move
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
