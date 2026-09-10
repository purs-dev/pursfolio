// JERICHO PURI — 3D CANDY BLUE STARDUST & ATMOSPHERIC ENGINE
// Theme: Onyx (#020202) & Candy Blue (#B2D5E5)

(function () {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.016);

    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Stardust
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2800;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 105;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Procedural Candy Blue Star Texture
    function createCandyStarTexture() {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        const center = 32;
        const radius = 28;

        const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(178, 213, 229, 0.95)');
        gradient.addColorStop(0.55, 'rgba(178, 213, 229, 0.35)');
        gradient.addColorStop(1, 'rgba(2, 2, 2, 0)');

        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return new THREE.CanvasTexture(c);
    }

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.24,
        map: createCandyStarTexture(),
        color: 0xB2D5E5,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const starMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starMesh);

    // Mouse Trajectory & Inertia Smoothing
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - windowHalfX) * 0.00015;
        targetMouseY = (e.clientY - windowHalfY) * 0.00015;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetMouseX = (e.touches[0].clientX - windowHalfX) * 0.00025;
            targetMouseY = (e.touches[0].clientY - windowHalfY) * 0.00025;
        }
    }, { passive: true });

    // 60fps Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        clock.getElapsedTime();

        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        starMesh.rotation.y += 0.00015 + currentMouseX * 0.6;
        starMesh.rotation.x += 0.00008 + currentMouseY * 0.6;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Dynamic Viewport Resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
