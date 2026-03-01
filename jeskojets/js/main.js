document.addEventListener("DOMContentLoaded", () => {
    // 1. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Three.js Particle Background
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a1a, 0.03);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles (Smoke/Qi feeling)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Creating a circular texture for particles programmatically to avoid external requests failing
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 64;
    canvasTexture.height = 64;
    const ctx = canvasTexture.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,138,61,1)');
    gradient.addColorStop(0.2, 'rgba(255,138,61,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvasTexture);

    const material = new THREE.PointsMaterial({
        size: 0.15,
        map: texture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);
    camera.position.z = 4;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();

    function animateThree() {
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05 + mouseX * 0.15;
        particlesMesh.rotation.x = elapsedTime * 0.02 + mouseY * 0.15;
        
        // Gentle vertical wave
        particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2 - window.scrollY * 0.001;

        renderer.render(scene, camera);
        requestAnimationFrame(animateThree);
    }
    animateThree();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 3. GSAP Animations

    // Hero Init & Dive-in effect
    gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=200%", // Longer distance to give feeling of depth
            pin: true,
            scrub: 1
        }
    })
    .to(".hero-bg img", {
        scale: 15, // Zoom deep into the background image's center hole
        opacity: 0, // Optionally fade it to reveal the next section smoothly at the very end
        duration: 1,
        ease: "power2.inOut"
    }, 0)
    .to(".content-top, .content-bottom", {
        scale: 4,     // Text also scales up/forward
        opacity: 0,   // and fades out
        duration: 0.3, // Make text disappear much faster
        ease: "power2.in"
    }, 0);

    // Move 3D camera forward on scroll to enhance the "dive-in" feel
    gsap.to(camera.position, {
        z: -5, // Move camera from 4 to -5 (through the particles)
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top", 
            scrub: 1
        }
    });

    gsap.to(".hero-title", { y: 0, opacity: 1, duration: 2, ease: "power4.out", delay: 0.2 });
    gsap.to(".hero-subtitle", { opacity: 1, duration: 2, ease: "power2.out", delay: 0.8 });

    // Core Title Reveal (Scrub)
    gsap.to(".reveal-text", {
        backgroundPositionX: "0%",
        ease: "none",
        scrollTrigger: {
            trigger: ".core-title",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
        }
    });

    // Body bg transition
    ScrollTrigger.create({
        trigger: ".core-title",
        start: "top 50%",
        end: "bottom top",
        onEnter: () => gsap.to("body", { backgroundColor: "var(--color-bg-surface)", duration: 1.5 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "var(--color-bg-main)", duration: 1.5 }),
        onEnterBack: () => gsap.to("body", { backgroundColor: "var(--color-bg-surface)", duration: 1.5 }),
        onLeave: () => gsap.to("body", { backgroundColor: "var(--color-bg-main)", duration: 1.5 })
    });

    // Horizontal Scroll for History
    const historyContainer = document.querySelector(".history-container");
    gsap.to(historyContainer, {
        x: () => -(historyContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".history",
            start: "top top",
            end: () => "+=" + historyContainer.scrollWidth,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Gallery Parallax
    gsap.utils.toArray(".parallax-img").forEach(img => {
        gsap.to(img, {
            y: "15%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Video Section Scale Up
    gsap.to(".video-container", {
        scale: 1,
        width: "100%",
        borderRadius: "0px",
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".video-section",
            start: "top bottom",
            end: "center center",
            scrub: 1
        }
    });

    // Back to Top
    document.querySelector("#backToTop").addEventListener("click", () => {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });
});
