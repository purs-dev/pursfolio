// 3D Background — subtle particle field

(function () {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 80;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Simple dot texture
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(178,213,229,0.6)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    const material = new THREE.PointsMaterial({
        size: 0.18,
        map: new THREE.CanvasTexture(c),
        color: 0xB2D5E5,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const hx = window.innerWidth / 2;
    const hy = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        tx = (e.clientX - hx) * 0.0001;
        ty = (e.clientY - hy) * 0.0001;
    }, { passive: true });

    function animate() {
        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;
        mesh.rotation.y += 0.0001 + cx * 0.4;
        mesh.rotation.x += 0.00005 + cy * 0.4;
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
