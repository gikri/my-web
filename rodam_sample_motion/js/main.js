/* js/main.js */

// ==========================================
// 1. Lenis Smooth Scroll Setup
// ==========================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// 2. Custom Cursor
// ==========================================
const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out",
  });
});

// Example hover effect for links/buttons
const hoverElements = document.querySelectorAll(
  "a, button, .gallery-item, .video-thumb",
);
hoverElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(cursor, {
      scale: 2,
      backgroundColor: "#fcf9f2",
      mixBlendMode: "difference",
      duration: 0.3,
    });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(cursor, {
      scale: 1,
      backgroundColor: "var(--color-primary)",
      duration: 0.3,
    });
  });
});

// ==========================================
// 3. Three.js Background Setup (Skeleton)
// ==========================================
/*
  This will serve as the misty/particle background 
  representing the "energy (氣)" of traditional medicine.
*/
const canvas = document.querySelector("#webgl-canvas");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2("#1a1a1a", 0.001); // MATCH --color-bg-dark

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Simple Particle System Placeholder
const geometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  // Spread particles over a large area
  posArray[i] = (Math.random() - 0.5) * 20;
}

geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

// Material: Warm primary color hints
const material = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xff8a3d, // --color-primary
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Handle Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Three.js Animation Loop connected to Lenis
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX / window.innerWidth - 0.5;
  mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animateThree() {
  requestAnimationFrame(animateThree);

  const elapsedTime = clock.getElapsedTime();

  // Gentle rotation
  particlesMesh.rotation.y = -0.05 * elapsedTime;
  particlesMesh.rotation.x = -0.05 * elapsedTime;

  // Mouse parallax effect
  particlesMesh.position.x += (mouseX * 2 - particlesMesh.position.x) * 0.05;
  particlesMesh.position.y += (-mouseY * 2 - particlesMesh.position.y) * 0.05;

  // React to scroll (link Lenis scroll value to Y position or camera)
  const scrollY = window.scrollY;
  particlesMesh.position.y = -scrollY * 0.001; // subtle movement

  renderer.render(scene, camera);
}
animateThree();

// ==========================================
// 4. GSAP Animations (Hero Section)
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
window.addEventListener("load", () => {
  const tl = gsap.timeline();

  tl.to(".hero-title", {
    y: 0,
    opacity: 1,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.2,
  })
    .to(
      ".hero-desc",
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=1",
    )
    .to(
      ".scroll-indicator",
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5",
    );
});

// Fade out hero text on scroll
gsap.to(".hero-content", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
  opacity: 0,
  y: -100,
});

// ==========================================
// 5. GSAP Animations (Core Title & History)
// ==========================================

// --- Core Title (Simple manual split text for demo since SplitText is paid) ---
const splitTextTarget = document.querySelector('.split-text');
if(splitTextTarget) {
    const text = splitTextTarget.innerText;
    splitTextTarget.innerHTML = '';
    text.split('<br>').forEach((line, i, arr) => {
        let lineHtml = '';
        const chars = line.split('');
        chars.forEach(char => {
            lineHtml += `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`;
        });
        
        splitTextTarget.innerHTML += `<div>${lineHtml}</div>`;
        if (i < arr.length - 1) splitTextTarget.innerHTML += '<br>';
    });

    gsap.to('.split-text .char', {
        scrollTrigger: {
            trigger: '.core-title',
            start: 'top 70%',
            end: 'bottom bottom',
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
}

// --- History Horizontal Scroll ---
const historySection = document.querySelector('.history');
const historyWrapper = document.querySelector('.history-wrapper');

if(historySection && historyWrapper) {
    let scrollWidth = historyWrapper.offsetWidth - window.innerWidth;

    gsap.to(historyWrapper, {
        x: () => -scrollWidth,
        ease: "none",
        scrollTrigger: {
            trigger: historySection,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Determine active item based on progress
                const items = document.querySelectorAll('.history-item');
                const progress = self.progress;
                const activeIndex = Math.min(
                    items.length - 1,
                    Math.floor(progress * items.length * 1.5) // Multiplier to keep last item active longer
                );
                
                items.forEach((item, i) => {
                    item.classList.toggle('is-active', i === activeIndex);
                });
            }
        }
    });
}

// Fade up for gallery items
gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1
    });
});

// ==========================================
// 6. Video Section (Modal & Hover)
// ==========================================
const videoThumb = document.querySelector('.video-thumb');
if(videoThumb) {
    videoThumb.addEventListener('mouseenter', () => {
        gsap.to(cursor, { 
            scale: 4, 
            backgroundColor: '#ff8a3d', 
            innerText: 'PLAY',
            color: '#1a1a1a',
            fontSize: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            duration: 0.3 
        });
    });
    
    videoThumb.addEventListener('mouseleave', () => {
        gsap.to(cursor, { 
            scale: 1, 
            backgroundColor: 'var(--color-primary)', 
            innerText: '',
            duration: 0.3 
        });
    });
}

// ==========================================
// 7. Footer Animations
// ==========================================
gsap.from('.footer h2', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1
});

gsap.to('.cta-btn', {
    y: -10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    duration: 1.5
});
