// 3D Background — subtle particle field

(function () {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.018);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 600);
    camera.position.z = 26;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const count = 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 90;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Star texture
    const c = document.createElement('canvas');
    c.width = 48; c.height = 48;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(24, 24, 0, 24, 24, 20);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(178,213,229,0.85)');
    g.addColorStop(0.6, 'rgba(178,213,229,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(24, 24, 20, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    const material = new THREE.PointsMaterial({
        size: 0.2,
        map: new THREE.CanvasTexture(c),
        color: 0xB2D5E5,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // Mouse
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const hx = window.innerWidth / 2;
    const hy = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        tx = (e.clientX - hx) * 0.00015;
        ty = (e.clientY - hy) * 0.00015;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            tx = (e.touches[0].clientX - hx) * 0.00025;
            ty = (e.touches[0].clientY - hy) * 0.00025;
        }
    }, { passive: true });

    function animate() {
        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;
        mesh.rotation.y += 0.00012 + cx * 0.5;
        mesh.rotation.x += 0.00006 + cy * 0.5;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
