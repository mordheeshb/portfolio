// ============================================================
// THREE.JS 3D PARTICLE SPHERE — Hero Background
// Mordheeshvara Portfolio — Fire Mode
// ============================================================

(function () {
    'use strict';

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // ── Scene Setup ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 320);

    // ── Mouse ──────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Sphere Particle Cloud ─────────────────────────────
    const PARTICLE_COUNT = 2500;
    const SPHERE_RADIUS = 140;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    // Bleu de France: #318CE7   Rouge: #ED2939
    const colorBlue = new THREE.Color('#318CE7');
    const colorRed = new THREE.Color('#ED2939');
    const colorWhite = new THREE.Color('#f8f9fa');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Fibonacci sphere distribution — uniform, no polar clustering
        const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = SPHERE_RADIUS * Math.cos(phi);

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color blend: blue equator, red poles, white accents
        const t = Math.abs(Math.cos(phi));   // 0 = equator, 1 = poles
        const r = Math.random();
        let c;
        if (r < 0.05) {
            c = colorWhite;
        } else if (t > 0.6) {
            c = colorRed;
        } else {
            c = colorBlue;
        }

        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for glowing round particles
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float uTime;

            void main() {
                vColor = color;
                vec3 pos = position;
                // Subtle breathing pulse
                float pulse = 1.0 + 0.04 * sin(uTime * 0.8 + pos.x * 0.05 + pos.y * 0.05);
                pos *= pulse;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;

            void main() {
                // Circular smooth dot with glow falloff
                vec2 uv = gl_PointCoord - vec2(0.5);
                float dist = length(uv);
                if (dist > 0.5) discard;
                float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Orbiting Ring Lines (wireframe equator) ──────────
    const ringGeo = new THREE.TorusGeometry(SPHERE_RADIUS + 5, 0.5, 3, 120);
    const ringMat = new THREE.MeshBasicMaterial({
        color: '#318CE7',
        transparent: true,
        opacity: 0.15,
        wireframe: false,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI * 0.3;
    scene.add(ring1);

    const ring2Mat = new THREE.MeshBasicMaterial({
        color: '#ED2939',
        transparent: true,
        opacity: 0.1,
        wireframe: false,
    });
    const ring2 = new THREE.Mesh(ringGeo.clone(), ring2Mat);
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.y = Math.PI * 0.2;
    scene.add(ring2);

    // ── Inner Wireframe Icosahedron ──────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(55, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: '#318CE7',
        wireframe: true,
        transparent: true,
        opacity: 0.08,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Resize handler ────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // ── Clock ─────────────────────────────────────────────
    const clock = new THREE.Clock();

    // ── Animation Loop (synced with GSAP ticker) ─────────
    function animate() {
        const elapsed = clock.getElapsedTime();

        // Update shader time
        mat.uniforms.uTime.value = elapsed;

        // Smooth mouse follow (lerp)
        targetRotation.x += (mouse.y * 0.3 - targetRotation.x) * 0.04;
        targetRotation.y += (mouse.x * 0.3 - targetRotation.y) * 0.04;

        // Base auto-rotation + mouse influence
        particles.rotation.y = elapsed * 0.06 + targetRotation.y;
        particles.rotation.x = elapsed * 0.02 + targetRotation.x;

        ring1.rotation.z = elapsed * 0.05;
        ring1.rotation.x = Math.PI * 0.3 + targetRotation.x * 0.5;

        ring2.rotation.z = -elapsed * 0.04;
        ring2.rotation.y = elapsed * 0.03 + targetRotation.y * 0.5;

        ico.rotation.y = elapsed * 0.07;
        ico.rotation.x = elapsed * 0.04;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
})();
