// Huacachina Oasis - Peru 3D Scene
// Educational visualization of a desert oasis surrounded by towering sand dunes

export function initHuacachinaScene() {
  const THREE = window.THREE;
  if (!THREE) {
    console.error('THREE.js not loaded');
    return;
  }

  const canvas = document.getElementById('t3dCanvas');
  const statusEl = document.getElementById('t3dStatus');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x87ceeb, 1);
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
  camera.position.set(0, 35, 55);
  camera.lookAt(0, 8, 0);

  // Lighting
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.1);
  sunLight.position.set(50, 60, 40);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // === HELPER FUNCTIONS ===
  function hash2(p) {
    const x = Math.sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
    const y = Math.sin(p.y * 94.673 + p.x * 39.814) * 43758.5453;
    return { x: x - Math.floor(x), y: y - Math.floor(y) };
  }

  function valueNoise(p) {
    const pi = { x: Math.floor(p.x), y: Math.floor(p.y) };
    const pf = { x: p.x - pi.x, y: p.y - pi.y };

    const h0 = hash2(pi).x;
    const h1 = hash2({ x: pi.x + 1, y: pi.y }).x;
    const h2 = hash2({ x: pi.x, y: pi.y + 1 }).x;
    const h3 = hash2({ x: pi.x + 1, y: pi.y + 1 }).x;

    const u = pf.x * pf.x * (3 - 2 * pf.x);
    const v = pf.y * pf.y * (3 - 2 * pf.y);

    return h0 * (1 - u) * (1 - v) + h1 * u * (1 - v) + h2 * (1 - u) * v + h3 * u * v;
  }

  function fbm(p, octaves = 4) {
    let val = 0, amp = 1, freq = 1, maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      val += valueNoise({ x: p.x * freq, y: p.y * freq }) * amp;
      maxAmp += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / maxAmp;
  }

  // === DUNE HEIGHTFIELD ===
  const duneCount = 100;
  const duneScale = 100;
  const maxHeight = 45;

  const duneGeom = new THREE.PlaneGeometry(duneScale * 2, duneScale * 2, duneCount, duneCount);
  const dunePositions = duneGeom.getAttribute('position');
  const posArray = dunePositions.array;
  const colorArray = new Uint8Array(duneGeom.getAttribute('position').count * 3);

  for (let i = 0; i <= duneCount; i++) {
    for (let j = 0; j <= duneCount; j++) {
      const idx = (i * (duneCount + 1) + j) * 3;
      const x = (i / duneCount - 0.5) * duneScale * 2;
      const z = (j / duneCount - 0.5) * duneScale * 2;
      const distFromCenter = Math.sqrt(x * x + z * z);

      let h = fbm({ x: x / 30, y: z / 30 }, 5) * maxHeight;
      const edgeFade = Math.max(0, 1 - distFromCenter / (duneScale * 0.95));
      h = h * edgeFade * edgeFade + 2;

      posArray[idx + 2] = Math.max(2, h);

      const hNorm = Math.min(1, Math.max(0, (h - 2) / maxHeight));
      const r = Math.floor(220 + hNorm * 25);
      const g = Math.floor(190 + hNorm * 35);
      const b = Math.floor(120 + hNorm * 25);

      colorArray[idx] = r;
      colorArray[idx + 1] = g;
      colorArray[idx + 2] = b;
    }
  }

  dunePositions.needsUpdate = true;
  duneGeom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3, true));
  duneGeom.computeVertexNormals();

  const duneMat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    shininess: 30,
    flatShading: false
  });

  const dunes = new THREE.Mesh(duneGeom, duneMat);
  dunes.rotation.x = -Math.PI / 2;
  scene.add(dunes);

  // === WATER PLANE ===
  const waterGeom = new THREE.CircleGeometry(18, 64);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x2d8a3d,
    emissive: 0x1a5a2a,
    shininess: 60
  });
  const water = new THREE.Mesh(waterGeom, waterMat);
  water.position.y = 2.1;
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // === MIRAGE SHIMMER (toggle) ===
  const mirageGeom = new THREE.CircleGeometry(30, 64);
  const mirageMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0,
    transparent: true
  });
  const mirage = new THREE.Mesh(mirageGeom, mirageMat);
  mirage.position.set(0, 3, 25);
  mirage.rotation.x = -Math.PI / 3;
  mirage.userData.enabled = false;
  scene.add(mirage);

  const mirageToggle = document.getElementById('t3dP01Toggle');
  if (mirageToggle) {
    mirageToggle.addEventListener('change', () => {
      mirage.userData.enabled = mirageToggle.checked;
      localStorage.setItem('ftol-game-huacachina-mirage', mirageToggle.checked ? '1' : '0');
    });
    const saved = localStorage.getItem('ftol-game-huacachina-mirage');
    if (saved === '1') {
      mirageToggle.checked = true;
      mirage.userData.enabled = true;
    }
  }

  // === SAND BANDS TOGGLE ===
  let bandsVisible = true;
  const bandsToggle = document.getElementById('t3dP02Toggle');
  if (bandsToggle) {
    bandsToggle.checked = true;
    bandsToggle.addEventListener('change', () => {
      bandsVisible = bandsToggle.checked;
      duneMat.wireframe = !bandsVisible;
      localStorage.setItem('ftol-game-huacachina-bands', bandsVisible ? '1' : '0');
    });
    const saved = localStorage.getItem('ftol-game-huacachina-bands');
    if (saved === '0') {
      bandsVisible = false;
      duneMat.wireframe = true;
      bandsToggle.checked = false;
    }
  }

  // === FULLSCREEN ===
  const fsBtn = document.getElementById('t3dFullscreenBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      const container = document.getElementById('t3dCanvasHost');
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    });
  }

  // === RESIZE OBSERVER ===
  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas);

  // === ANIMATION LOOP ===
  function animate() {
    requestAnimationFrame(animate);

    const t = Date.now() * 0.00003;
    const r = 65, phi = 0.5, theta = 0.6 + t;
    camera.position.x = r * Math.sin(phi) * Math.cos(theta);
    camera.position.y = r * Math.cos(phi) + 15;
    camera.position.z = r * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 8, 0);

    if (mirage.userData.enabled) {
      mirage.material.opacity = 0.15 + Math.sin(t * 3) * 0.05;
    }

    renderer.render(scene, camera);
  }

  animate();

  if (statusEl) {
    statusEl.textContent = 'Huacachina Oasis loaded - rotate to explore';
  }
}
