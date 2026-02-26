import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const bgColor = isDarkMode ? 0x020617 : 0xf8fafc;
scene.background = new THREE.Color(bgColor);
scene.fog = new THREE.FogExp2(bgColor, 0.05);

const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 15);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Nodes and Lines Network ---
const nodeCount = 150;
const nodesGeometry = new THREE.BufferGeometry();
const nodesPositions = new Float32Array(nodeCount * 3);
// Provide a unique id/color basis for each node
const nodesColors = new Float32Array(nodeCount * 3);

const networkGroup = new THREE.Group();
scene.add(networkGroup);

const colorPrimary = new THREE.Color(isDarkMode ? 0x3b82f6 : 0x2563eb); // Blue
const colorSecondary = new THREE.Color(isDarkMode ? 0x60a5fa : 0x60a5fa); // Lighter blue
const colorHighlight = new THREE.Color(isDarkMode ? 0xf43f5e : 0xe11d48); // Red-ish for connection emphasis

for (let i = 0; i < nodeCount * 3; i += 3) {
    // Distribute points spherically
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 5 + Math.random() * 4;

    nodesPositions[i] = radius * Math.sin(phi) * Math.cos(theta); // x
    nodesPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    nodesPositions[i + 2] = radius * Math.cos(phi); // z

    // Randomize initial colors slightly
    const mixRatio = Math.random();
    const mixedColor = colorPrimary.clone().lerp(colorSecondary, mixRatio);
    nodesColors[i] = mixedColor.r;
    nodesColors[i + 1] = mixedColor.g;
    nodesColors[i + 2] = mixedColor.b;
}

nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodesPositions, 3));
nodesGeometry.setAttribute('color', new THREE.BufferAttribute(nodesColors, 3));

// Custom shader material to make nodes look like glowing points
const nodesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});

const nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);
networkGroup.add(nodesMesh);

// Create Lines (Edges)
// We'll dynamically draw lines between nodes that are close to each other
const maxConnections = nodeCount * 10;
const linesPositions = new Float32Array(maxConnections * 3);
const linesColors = new Float32Array(maxConnections * 3);

const linesGeometry = new THREE.BufferGeometry();
linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3).setUsage(THREE.DynamicDrawUsage));
linesGeometry.setAttribute('color', new THREE.BufferAttribute(linesColors, 3).setUsage(THREE.DynamicDrawUsage));

const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.15
});

const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
networkGroup.add(linesMesh);

// Generate initial connections
function updateConnections(connectionDistance) {
    let vertexPos = 0;
    let colorPos = 0;
    const positions = nodesMesh.geometry.attributes.position.array;
    const colors = nodesMesh.geometry.attributes.color.array;
    let currentConnections = 0;

    for (let i = 0; i < nodeCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < nodeCount; j++) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];

            const dx = x1 - x2;
            const dy = y1 - y2;
            const dz = z1 - z2;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDistance) {
                // Add line position
                linesPositions[vertexPos++] = x1;
                linesPositions[vertexPos++] = y1;
                linesPositions[vertexPos++] = z1;

                linesPositions[vertexPos++] = x2;
                linesPositions[vertexPos++] = y2;
                linesPositions[vertexPos++] = z2;

                // Basic color matching the nodes
                const alpha = 1.0 - (dist / connectionDistance);
                
                // Color for point 1
                linesColors[colorPos++] = colors[i*3]*alpha;
                linesColors[colorPos++] = colors[i*3+1]*alpha;
                linesColors[colorPos++] = colors[i*3+2]*alpha;

                // Color for point 2
                linesColors[colorPos++] = colors[j*3]*alpha;
                linesColors[colorPos++] = colors[j*3+1]*alpha;
                linesColors[colorPos++] = colors[j*3+2]*alpha;

                currentConnections++;
            }
        }
    }

    linesMesh.geometry.setDrawRange(0, currentConnections * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
}

// Initial connection build
updateConnections(2.5);

// --- GSAP Scroll Animations ---
// UI
const uiPanels = document.querySelectorAll('.content');
uiPanels.forEach(panel => {
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

// 3D Scene transitions
let connectionDistObj = { value: 2.5 };

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// Rotate network
tl.to(networkGroup.rotation, { x: 0, y: Math.PI, duration: 1 }, 0);
// Pull camera closer
tl.to(camera.position, { z: 8, x: -3, duration: 1 }, 0);
// Increase connection density to represent "filtering noise"
tl.to(connectionDistObj, { value: 3.5, duration: 1 }, 0);


// --- Raycasting for interaction ---
const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.5; // Larger threshold for points
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

const serviceNames = [
    "Data Ingestion", "Stream Processing", "ML Inference", "Load Balancing", 
    "Edge Compute", "Secure Store", "Analytics Pipeline", "Route Optimizer"
];

let hoveredNodeIndex = null;
let originalColor = new THREE.Color();

window.addEventListener('mousemove', (event) => {
    // Parallax
    const x = (event.clientX / sizes.width - 0.5) * 2;
    const y = -(event.clientY / sizes.height - 0.5) * 2;
    
    gsap.to(scene.rotation, { x: y * 0.05, y: x * 0.05, duration: 1 });

    // Tooltip position
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = event.clientY + 'px';

    // Raycast
    mouse.x = x;
    mouse.y = -y;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(nodesMesh);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const index = intersects[0].index;
        
        if (hoveredNodeIndex !== index) {
            const colors = nodesMesh.geometry.attributes.color.array;
            
            // Restore previous
            if (hoveredNodeIndex !== null) {
                colors[hoveredNodeIndex * 3] = originalColor.r;
                colors[hoveredNodeIndex * 3 + 1] = originalColor.g;
                colors[hoveredNodeIndex * 3 + 2] = originalColor.b;
            }

            hoveredNodeIndex = index;
            // Save current color
            originalColor.setRGB(
                colors[index * 3],
                colors[index * 3 + 1],
                colors[index * 3 + 2]
            );

            // Set to highlight color
            colors[index * 3] = colorHighlight.r;
            colors[index * 3 + 1] = colorHighlight.g;
            colors[index * 3 + 2] = colorHighlight.b;

            nodesMesh.geometry.attributes.color.needsUpdate = true;

            // Show tooltip
            tooltip.innerText = "Node: " + serviceNames[index % serviceNames.length] + `\nStatus: Active\nLatency: ${Math.floor(Math.random()*15+1)}ms`;
            tooltip.style.opacity = 1;
        }
    } else {
        document.body.style.cursor = 'default';
        if (hoveredNodeIndex !== null) {
            const colors = nodesMesh.geometry.attributes.color.array;
            colors[hoveredNodeIndex * 3] = originalColor.r;
            colors[hoveredNodeIndex * 3 + 1] = originalColor.g;
            colors[hoveredNodeIndex * 3 + 2] = originalColor.b;
            nodesMesh.geometry.attributes.color.needsUpdate = true;
            hoveredNodeIndex = null;
            tooltip.style.opacity = 0;
        }
    }
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rebuild connections based on current GSAP animated distance
    // We add slight wobble to the points to make it feel alive
    const positions = nodesMesh.geometry.attributes.position.array;
    for(let i = 0; i < nodeCount; i++) {
        // We could move points here, but for performance we'll just rotate the group
    }
    
    // Slow rotation
    networkGroup.rotation.y += 0.002;
    networkGroup.rotation.z += 0.001;

    // Update lines every frame so they track the rotated points correctly and use the animated connectionDistObj
    updateConnections(connectionDistObj.value);

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
