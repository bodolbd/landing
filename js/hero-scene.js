/**
 * Hero order-flow scene (Three.js) — colorful step cards + path
 */
import * as THREE from "three";

const STEPS = [
  { label: "বায়ার অর্ডার করল", color: "#38bdf8" },
  { label: "সেলার ক্রেডেনশিয়াল দিল", color: "#818cf8" },
  { label: "বায়ার লগ ইন করল", color: "#a78bfa" },
  { label: "বায়ার কমপ্লিট মার্ক করল", color: "#34d399" },
  { label: "সেলার কমপ্লিট মার্ক করল", color: "#2dd4bf" },
  { label: "অ্যাডমিন কমপ্লিট মার্ক করল", color: "#22d3ee" },
  { label: "সেলার টাকা পেল", color: "#fbbf24" },
  { label: "সেলার উইথড্র করল", color: "#fb923c" },
  { label: "সেলারের কাছে টাকা এল", color: "#f472b6" },
  { label: "অর্ডার কমপ্লিট", color: "#4ade80" },
  { label: "৫-স্টার রেটিং", color: "#facc15" },
];

const bnNums = ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "১০", "১১"];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function createCardTexture(index, state) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const { r, g, b } = hexToRgb(STEPS[index].color);
  const active = state === "active";
  const done = state === "done";

  const bg = active
    ? `rgba(${r},${g},${b},0.28)`
    : done
      ? `rgba(${r},${g},${b},0.14)`
      : "rgba(18,18,18,0.95)";

  const grad = ctx.createLinearGradient(0, 0, size, size);
  if (active) {
    grad.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
    grad.addColorStop(0.55, `rgba(12,12,16,0.92)`);
    grad.addColorStop(1, `rgba(${Math.min(255, r + 40)},${g},${Math.min(255, b + 30)},0.35)`);
  } else if (done) {
    grad.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
    grad.addColorStop(1, "rgba(10,10,12,0.95)");
  } else {
    grad.addColorStop(0, "rgba(22,22,26,1)");
    grad.addColorStop(1, "rgba(10,10,12,1)");
  }

  roundRect(ctx, 8, 8, size - 16, size - 16, 28);
  ctx.fillStyle = grad;
  ctx.fill();

  // inner glow wash
  if (active || done) {
    const radial = ctx.createRadialGradient(size * 0.3, size * 0.25, 10, size * 0.5, size * 0.5, size * 0.65);
    radial.addColorStop(0, `rgba(${r},${g},${b},${active ? 0.35 : 0.12})`);
    radial.addColorStop(1, "rgba(0,0,0,0)");
    roundRect(ctx, 8, 8, size - 16, size - 16, 28);
    ctx.fillStyle = radial;
    ctx.fill();
  }

  ctx.strokeStyle = active
    ? `rgba(${r},${g},${b},0.95)`
    : done
      ? `rgba(${r},${g},${b},0.55)`
      : `rgba(${r},${g},${b},0.22)`;
  ctx.lineWidth = active ? 5 : 3;
  roundRect(ctx, 8, 8, size - 16, size - 16, 28);
  ctx.stroke();

  // accent pill
  ctx.fillStyle = `rgba(${r},${g},${b},${active ? 0.95 : done ? 0.7 : 0.35})`;
  roundRect(ctx, size / 2 - 28, 28, 56, 10, 6);
  ctx.fill();

  ctx.fillStyle = active ? "#ffffff" : done ? `rgb(${r},${g},${b})` : "rgba(255,255,255,0.4)";
  ctx.font = "700 78px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = active ? `rgba(${r},${g},${b},0.8)` : "transparent";
  ctx.shadowBlur = active ? 18 : 0;
  ctx.fillText(String(index + 1), size / 2, size / 2 + 6);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function createStarMesh(colorHex) {
  const shape = new THREE.Shape();
  const spikes = 5;
  const outer = 0.22;
  const inner = 0.1;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  geo.center();
  const color = new THREE.Color(colorHex);
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.45,
    roughness: 0.28,
    emissive: color,
    emissiveIntensity: 0.45,
  });
  return new THREE.Mesh(geo, mat);
}

function createSparkles(colorHex) {
  const count = 18;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.4 + Math.random() * 0.55;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
    positions[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(colorHex),
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

function buildColoredTube(curve, tubularSegments = 140) {
  const geo = new THREE.TubeGeometry(curve, tubularSegments, 0.028, 10, false);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const t = i / (pos.count - 1);
    const idx = Math.min(STEPS.length - 1, Math.floor(t * (STEPS.length - 1)));
    const next = Math.min(STEPS.length - 1, idx + 1);
    const local = t * (STEPS.length - 1) - idx;
    c.set(STEPS[idx].color).lerp(new THREE.Color(STEPS[next].color), local);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
  });
  return new THREE.Mesh(geo, mat);
}

function initHeroScene() {
  const mount = document.querySelector("[data-hero-canvas]");
  const labelEl = document.querySelector("[data-hero-step-label]");
  const numEl = document.querySelector("[data-hero-step-num]");
  const caption = document.querySelector(".hero-step-caption");
  if (!mount) return;

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.045);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
  camera.position.set(4.2, 2.4, 7.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(4, 8, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa5b4fc, 0.35);
  fill.position.set(-5, 3, -2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfda4af, 0.2);
  rim.position.set(0, -2, 5);
  scene.add(rim);

  const followLight = new THREE.PointLight(0x38bdf8, 1.4, 5.5, 2);
  scene.add(followLight);

  // colorful ground discs
  const discColors = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"];
  discColors.forEach((hex, i) => {
    const disc = new THREE.Mesh(
      new THREE.RingGeometry(1.7 + i * 0.28, 1.78 + i * 0.28, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex),
        transparent: true,
        opacity: 0.12 - i * 0.015,
        side: THREE.DoubleSide,
      })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -1.62;
    scene.add(disc);
  });

  const root = new THREE.Group();
  scene.add(root);

  const nodes = [];
  const count = STEPS.length;
  const radius = 2.35;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = t * Math.PI * 1.55 - 0.35;
    const y = -1.35 + t * 3.1;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.85;
    const color = new THREE.Color(STEPS[i].color);

    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = -angle + Math.PI * 0.5;

    const geo = new THREE.BoxGeometry(0.95, 0.95, 0.14);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0.4,
      map: createCardTexture(i, "idle"),
      emissive: color,
      emissiveIntensity: 0.04,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
      })
    );
    group.add(edges);

    // soft halo plane behind card
    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 32),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    halo.position.z = -0.12;
    group.add(halo);

    root.add(group);
    nodes.push({ group, mesh, mat, edges, halo, baseY: y, color });
  }

  const curvePoints = nodes.map((n) => n.group.position.clone());
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const pathMesh = buildColoredTube(curve);
  scene.add(pathMesh);

  // outer glow tube
  const glowTube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 100, 0.055, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(glowTube);

  const tokenMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.55,
    roughness: 0.2,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.65,
  });
  const token = new THREE.Mesh(new THREE.SphereGeometry(0.14, 28, 28), tokenMat);
  scene.add(token);

  const tokenRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.025, 12, 48),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    })
  );
  scene.add(tokenRing);

  let sparkles = createSparkles(STEPS[0].color);
  token.add(sparkles);

  const stars = new THREE.Group();
  stars.visible = false;
  const starPalette = ["#facc15", "#fbbf24", "#fde68a", "#f59e0b", "#fcd34d"];
  for (let i = 0; i < 5; i++) {
    const star = createStarMesh(starPalette[i]);
    star.position.set((i - 2) * 0.55, 2.05, 0);
    star.rotation.x = -0.4;
    stars.add(star);
  }
  scene.add(stars);

  let step = 0;
  let stepTime = 0;
  const stepDuration = 1.55;
  let last = performance.now();
  let running = !reduced;

  function applyCaptionColor(hex) {
    if (!caption) return;
    caption.style.borderColor = hex + "66";
    caption.style.boxShadow = `0 0 24px ${hex}22`;
    if (numEl) numEl.style.color = hex;
  }

  function setStep(next) {
    step = next;
    const activeColor = STEPS[step].color;

    nodes.forEach((n, i) => {
      const done = i < step;
      const active = i === step;
      const state = active ? "active" : done ? "done" : "idle";
      n.mat.map?.dispose();
      n.mat.map = createCardTexture(i, state);
      n.mat.emissive.copy(n.color);
      n.mat.emissiveIntensity = active ? 0.22 : done ? 0.1 : 0.03;
      n.mat.needsUpdate = true;
      n.edges.material.opacity = active ? 0.95 : done ? 0.55 : 0.28;
      n.halo.material.opacity = active ? 0.28 : done ? 0.12 : 0.05;
      n.group.scale.setScalar(active ? 1.2 : done ? 1.04 : 0.9);
    });

    tokenMat.color.set(activeColor);
    tokenMat.emissive.set(activeColor);
    tokenRing.material.color.set(activeColor);
    followLight.color.set(activeColor);

    token.remove(sparkles);
    sparkles.geometry.dispose();
    sparkles.material.dispose();
    sparkles = createSparkles(activeColor);
    token.add(sparkles);

    const p = curve.getPoint(step / (count - 1));
    token.position.copy(p);
    tokenRing.position.copy(p);
    followLight.position.copy(p).add(new THREE.Vector3(0.2, 0.4, 0.3));

    stars.visible = step === count - 1;
    applyCaptionColor(activeColor);

    if (labelEl) labelEl.textContent = STEPS[step].label;
    if (numEl) numEl.textContent = `${bnNums[step]} / ১১`;
  }

  setStep(reduced ? count - 1 : 0);

  function resize() {
    const w = mount.clientWidth || 1;
    const h = mount.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  new ResizeObserver(resize).observe(mount);

  const look = new THREE.Vector3(0, 0.35, 0);

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (running) {
      stepTime += dt;
      if (stepTime >= stepDuration) {
        stepTime = 0;
        setStep((step + 1) % count);
      }

      nodes.forEach((n, i) => {
        const active = i === step;
        const bob = active ? Math.sin(now * 0.004) * 0.07 : Math.sin(now * 0.0015 + i) * 0.015;
        n.group.position.y = n.baseY + bob;
        if (active) n.halo.rotation.z = now * 0.001;
      });

      const from = step / (count - 1);
      const to = Math.min(1, (step + 1) / (count - 1));
      const local = Math.min(1, stepTime / stepDuration);
      const eased = local * local * (3 - 2 * local);
      const t = THREE.MathUtils.lerp(from, to, eased * 0.4);
      const pos = curve.getPoint(Math.min(0.999, t));
      token.position.copy(pos);
      tokenRing.position.copy(pos);
      tokenRing.rotation.x = now * 0.002;
      tokenRing.rotation.y = now * 0.003;
      followLight.position.copy(pos).add(new THREE.Vector3(0.15, 0.45, 0.25));
      followLight.intensity = 1.2 + Math.sin(now * 0.006) * 0.25;

      sparkles.rotation.y = now * 0.0015;

      root.rotation.y = Math.sin(now * 0.00025) * 0.18;
      camera.position.x = 4.2 + Math.sin(now * 0.0002) * 0.25;
      camera.lookAt(look);

      if (stars.visible) {
        stars.children.forEach((s, i) => {
          s.rotation.z = now * 0.0012 + i * 0.25;
          s.position.y = 2.05 + Math.sin(now * 0.0035 + i) * 0.06;
        });
      }
    } else {
      camera.lookAt(look);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden && !reduced;
  });
}

initHeroScene();
