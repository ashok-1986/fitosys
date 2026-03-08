import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * FITOSYS HERO SECTION
 *
 * Brand Identity Reference:
 * - Background: #0A0A0A (Black Core) — Fitosys lives in the dark
 * - Accent: #F20000 (Fitosys Red) — signal colour, use sparingly
 * - Surface: #111111 — cards, panels, secondary layer
 * - Text Primary: #FFFFFF
 * - Text Secondary: #A0A0A0 (Steel Grey)
 *
 * Fonts:
 * - Display / Hero: "Barlow Condensed" — uppercase, weight 800–900
 * - Body / UI: "Urbanist" — weights 300, 400, 600, 700
 *
 * Three.js visual direction:
 * - Replace space/nebula with a dark performance environment:
 *   geometric grid planes, flowing data lines in red (#F20000),
 *   and sparse white particle field suggesting precision and
 *   structure — not chaos. Think: a coach's system visualised
 *   as light and geometry, not stars and galaxies.
 * - Camera moves on scroll from wide overview (the chaos before
 *   Fitosys) → focused close-up (the system in control)
 * - No blues or purples — palette is strictly black, white, red,
 *   and steel grey only
 *
 * Copy (do not change these strings):
 * - Section 1 title: "THE SYSTEM BEHIND THE RESULT"
 * - Section 1 subtitle line 1: "Stop losing clients to missed follow-ups."
 * - Section 1 subtitle line 2: "Fitosys runs your coaching business. You just coach."
 * - Section 2 title: "2–3 HOURS BACK. EVERY WEEK."
 * - Section 2 subtitle line 1: "Every client checked in. Every renewal caught."
 * - Section 2 subtitle line 2: "Every payment collected. Without lifting a finger."
 * - Section 3 title: "BUILT FOR INDIA. RUNS ON WHATSAPP."
 * - Section 3 subtitle line 1: "No app for your clients. No complex setup for you."
 * - Section 3 subtitle line 2: "30 minutes to set up. Runs automatically after that."
 * - Side label (replaces "SPACE"): "FITOSYS"
 * - Scroll indicator label: "SCROLL"
 * - Section counter format: "01 / 03", "02 / 03", "03 / 03"
 *
 * CTA button (add below subtitle in Section 1):
 * - Label: "Start Free Trial"
 * - Style: bg-[#F20000] text-white font-urbanist font-semibold
 *   px-8 py-4 uppercase tracking-widest hover:bg-white
 *   hover:text-[#F20000] transition-all duration-300
 *
 * Visual atmosphere per section:
 * - Section 1 (THE SYSTEM): Camera far back. Full grid visible.
 *   Red data lines pulse slowly across the plane. Feels like
 *   seeing the problem from above — scattered, manual, broken.
 * - Section 2 (2–3 HOURS BACK): Camera moves in. Grid tightens.
 *   Particles converge toward a central point. System organising.
 *   Red lines become clean, straight, structured.
 * - Section 3 (BUILT FOR INDIA): Camera close. The grid is now
 *   a perfect lattice. Everything ordered. Red signal pulses once
 *   at the centre like a heartbeat. This is the Fitosys state.
 *
 * Replace "mountains" layer with:
 *   Three stacked horizontal grid planes at different depths,
 *   each with a red wireframe edge. They recede into the dark
 *   background as the camera advances on scroll.
 *
 * Replace "nebula" with:
 *   A single large red (#F20000) grid plane at z = -1050,
 *   opacity 0.08. Flat. No colour mixing. No gradients.
 *   It is the horizon the coach is building toward.
 *
 * Replace "atmosphere sphere" with:
 *   A wireframe icosahedron, #F20000, opacity 0.04, scale 400.
 *   Rotates very slowly (0.001 radians per frame). Suggests
 *   the system sphere — contained, precise, structural.
 *
 * Replace "star field" with:
 *   White (#FFFFFF) point cloud — 3,000 points maximum.
 *   No colour variation. No warmth tones. Pure white only.
 *   Size range: 0.3 to 1.2. These are data points, not stars.
 *   Slow uniform rotation (no depth-based speed variation).
 *
 * Font loading (add to component or parent layout):
 *   <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Urbanist:wght@300;400;600;700&display=swap" rel="stylesheet" />
 */

export const Component = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const menuRef = useRef(null);
  const ctaRef = useRef(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    points: THREE.Points[];
    gridHorizon: THREE.Mesh | null;
    gridPlanes: THREE.Mesh[];
    systemSphere: THREE.Mesh | null;
    dataLines: THREE.Line[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    points: [],        // replaces stars — white data point cloud
    gridHorizon: null, // replaces nebula — flat red grid plane
    gridPlanes: [],    // replaces mountains — stacked depth planes
    systemSphere: null,// replaces atmosphere — wireframe icosahedron
    dataLines: [],     // red flowing lines across the grid
    animationId: null
  });

  // ─── THREE.JS INIT ────────────────────────────────────────────────────────
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      const canvas = canvasRef.current;
      if (!canvas) return;

      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x0A0A0A, 0.00025);

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;
      // Background must always be #0A0A0A — Fitosys lives in the dark
      refs.renderer.setClearColor(0x0A0A0A, 1);

      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      // Bloom: tighter and more restrained than the original
      // Red signal lines should glow slightly — everything else stays flat
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.4,  // strength — lower than original, red stays precise
        0.2,  // radius
        0.95  // threshold — only brightest reds bloom
      );
      refs.composer.addPass(bloomPass);

      createDataPointCloud();
      createGridHorizon();
      createGridPlanes();
      createSystemSphere();
      createDataLines();
      getPlaneLocations();

      animate();
      setIsReady(true);
    };

    /**
     * WHITE DATA POINT CLOUD
     * Replaces the star field.
     * 3,000 white points. Pure #FFFFFF. No colour variation.
     * These are data points — client check-ins, renewal signals,
     * payment events — visualised as precision light in the dark.
     */
    const createDataPointCloud = () => {
      const { current: refs } = threeRefs;
      const pointCount = 3000;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      const sizes = new Float32Array(pointCount);

      for (let i = 0; i < pointCount; i++) {
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Size range: 0.3–1.2. Precise. Not decorative.
        sizes[i] = 0.3 + Math.random() * 0.9;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          uniform float time;
          void main() {
            vec3 pos = position;
            // Uniform slow rotation — no depth variation
            float angle = time * 0.03;
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xz = rot * pos.xz;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            // Pure white — #FFFFFF — no colour mixing
            gl_FragColor = vec4(1.0, 1.0, 1.0, opacity * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const points = new THREE.Points(geometry, material);
      refs.scene.add(points);
      refs.points.push(points);
    };

    /**
     * RED GRID HORIZON PLANE
     * Replaces the nebula.
     * Flat #F20000 grid at z = -1050. Opacity 0.08.
     * This is the horizon the coach is building toward.
     * No animation. No colour mixing. No gradients.
     */
    const createGridHorizon = () => {
      const { current: refs } = threeRefs;

      const geometry = new THREE.PlaneGeometry(8000, 4000, 80, 40);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          // Fitosys Red — do not change this value
          redColor: { value: new THREE.Color(0xF20000) }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 redColor;
          uniform float time;
          varying vec2 vUv;
          void main() {
            // Grid line pattern — structural, not organic
            float gridX = step(0.98, fract(vUv.x * 80.0));
            float gridY = step(0.98, fract(vUv.y * 40.0));
            float grid = max(gridX, gridY);
            // Edge fade so grid recedes naturally
            float edgeFade = 1.0 - length(vUv - 0.5) * 1.8;
            edgeFade = max(edgeFade, 0.0);
            gl_FragColor = vec4(redColor, grid * 0.08 * edgeFade);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const gridHorizon = new THREE.Mesh(geometry, material);
      gridHorizon.position.z = -1050;
      gridHorizon.rotation.x = -0.1;
      refs.scene.add(gridHorizon);
      refs.gridHorizon = gridHorizon;
    };

    /**
     * STACKED GRID PLANES
     * Replaces the mountain layers.
     * Three horizontal planes at different depths.
     * Each has a red wireframe edge — suggesting the layers of a
     * coaching system: onboarding → check-ins → renewals.
     * They recede into the dark as the camera advances.
     */
    const createGridPlanes = () => {
      const { current: refs } = threeRefs;

      const layers = [
        { distance: -50,  color: 0x1a1a1a, edgeColor: 0xF20000, opacity: 0.9 },
        { distance: -100, color: 0x141414, edgeColor: 0xF20000, opacity: 0.7 },
        { distance: -150, color: 0x0f0f0f, edgeColor: 0xF20000, opacity: 0.5 },
      ];

      layers.forEach((layer, index) => {
        // Surface plane
        const planeGeo = new THREE.PlaneGeometry(1200, 300, 60, 15);
        const planeMat = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.position.z = layer.distance;
        plane.position.y = layer.distance * 0.5;
        plane.userData = { baseZ: layer.distance, index };
        refs.scene.add(plane);
        refs.gridPlanes.push(plane);

        // Red wireframe edge overlay — signal colour
        const wireGeo = new THREE.PlaneGeometry(1200, 300, 12, 3);
        const wireMat = new THREE.MeshBasicMaterial({
          color: layer.edgeColor,  // #F20000
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.position.z = layer.distance + 0.5;
        wire.position.y = layer.distance * 0.5;
        refs.scene.add(wire);
      });
    };

    /**
     * WIREFRAME SYSTEM SPHERE
     * Replaces the atmosphere.
     * Icosahedron wireframe in #F20000 at opacity 0.04.
     * Scale 400. Rotates at 0.001 radians per frame.
     * Suggests the Fitosys operating system — contained, structural.
     */
    const createSystemSphere = () => {
      const { current: refs } = threeRefs;

      const geometry = new THREE.IcosahedronGeometry(400, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0xF20000,  // Fitosys Red
        wireframe: true,
        transparent: true,
        opacity: 0.04
      });

      const sphere = new THREE.Mesh(geometry, material);
      refs.scene.add(sphere);
      refs.systemSphere = sphere;
    };

    /**
     * RED DATA LINES
     * New element — no equivalent in original.
     * Flowing lines in #F20000 across the grid planes.
     * They pulse slowly in Section 1, become straight and ordered
     * by Section 3. Represents the coaching workflows automating.
     */
    const createDataLines = () => {
      const { current: refs } = threeRefs;

      for (let i = 0; i < 8; i++) {
        const points = [];
        const startX = -500 + Math.random() * 1000;
        const y = -80 + Math.random() * 160;
        const z = -30 - Math.random() * 120;

        for (let j = 0; j <= 20; j++) {
          points.push(new THREE.Vector3(
            startX + (j / 20) * 600,
            y + Math.sin(j * 0.5) * 20,
            z
          ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0xF20000,  // Fitosys Red — signal colour
          transparent: true,
          opacity: 0.3
        });

        const line = new THREE.Line(geometry, material);
        refs.scene.add(line);
        refs.dataLines.push(line);
      }
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update data point cloud
      refs.points.forEach(pointCloud => {
        if (pointCloud.material.uniforms) {
          pointCloud.material.uniforms.time.value = time;
        }
      });

      // System sphere — slow structural rotation
      if (refs.systemSphere) {
        refs.systemSphere.rotation.y += 0.001;
        refs.systemSphere.rotation.x += 0.0005;
      }

      // Data lines — slow pulse on opacity
      refs.dataLines.forEach((line, i) => {
        const phase = (time * 0.3 + i * 0.4) % (Math.PI * 2);
        line.material.opacity = 0.15 + Math.sin(phase) * 0.15;
      });

      // Smooth camera
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        // Subtle float — minimal, precise
        const floatX = Math.sin(time * 0.08) * 1.5;
        const floatY = Math.cos(time * 0.10) * 0.8;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Subtle grid plane movement
      refs.gridPlanes.forEach((plane, i) => {
        const parallaxFactor = 1 + i * 0.5;
        plane.position.x = Math.sin(time * 0.08) * 1.5 * parallaxFactor;
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    const getPlaneLocations = () => {
      const { current: refs } = threeRefs;
      const locations = [];
      refs.gridPlanes.forEach((plane, i) => {
        locations[i] = plane.position.z;
      });
      refs.locations = locations;
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);

      refs.points.forEach(p => { p.geometry.dispose(); p.material.dispose(); });
      refs.gridPlanes.forEach(p => { p.geometry.dispose(); p.material.dispose(); });
      refs.dataLines.forEach(l => { l.geometry.dispose(); l.material.dispose(); });
      if (refs.gridHorizon) { refs.gridHorizon.geometry.dispose(); refs.gridHorizon.material.dispose(); }
      if (refs.systemSphere) { refs.systemSphere.geometry.dispose(); refs.systemSphere.material.dispose(); }
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // ─── GSAP ENTRANCE ANIMATIONS ─────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    gsap.set(
      [menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current, ctaRef.current],
      { visibility: 'visible' }
    );

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    }

    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      tl.from(titleChars, {
        y: 200, opacity: 0, duration: 1.5, stagger: 0.04, ease: "power4.out"
      }, "-=0.5");
    }

    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
      }, "-=0.8");
    }

    // CTA button entrance — delayed, after title settles
    if (ctaRef.current) {
      tl.from(ctaRef.current, {
        y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
      }, "-=0.4");
    }

    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0, y: 50, duration: 1, ease: "power2.out"
      }, "-=0.5");
    }

    return () => { tl.kill(); };
  }, [isReady]);

  // ─── SCROLL HANDLER ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      setScrollProgress(progress);
      const newSection = Math.floor(progress * totalSections);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;

      /**
       * Camera journey — three stages matching brand narrative:
       * Section 0: Far back. See the full broken system. The chaos.
       * Section 1: Moving in. System organising. Structure emerging.
       * Section 2: Close. The Fitosys state. Perfect lattice. One red pulse.
       */
      const cameraPositions = [
        { x: 0, y: 30,  z: 300  },  // Section 0 — THE SYSTEM (wide, above)
        { x: 0, y: 40,  z: -50  },  // Section 1 — 2–3 HOURS BACK (converging)
        { x: 0, y: 50,  z: -700 }   // Section 2 — BUILT FOR INDIA (inside system)
      ];

      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      // Data lines straighten as scroll progresses — chaos → order
      refs.dataLines.forEach((line, i) => {
        const straightness = Math.min(progress * 2, 1);
        line.material.opacity = (0.15 + straightness * 0.25);
      });

      // Grid planes recede on deep scroll — system sphere takes over
      refs.gridPlanes.forEach((plane, i) => {
        const speed = 1 + i * 0.9;
        if (progress > 0.7) {
          plane.position.z = 600000; // push out of view
        } else {
          plane.position.z = refs.locations ? refs.locations[i] : plane.userData.baseZ;
        }
      });

      // Grid horizon follows scroll depth
      if (refs.gridHorizon) {
        refs.gridHorizon.material.uniforms.time.value = progress * 10;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="title-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  // ─── SECTION CONTENT ───────────────────────────────────────────────────────
  // Brand copy — do not change. Sourced from Fitosys Key Messaging section.
  const sections = [
    {
      title: 'THE SYSTEM\nBEHIND THE RESULT',
      line1: 'Stop losing clients to missed follow-ups.',
      line2: 'Fitosys runs your coaching business. You just coach.',
      showCTA: true,
    },
    {
      title: '2–3 HOURS BACK.\nEVERY WEEK.',
      line1: 'Every client checked in. Every renewal caught.',
      line2: 'Every payment collected. Without lifting a finger.',
      showCTA: false,
    },
    {
      title: 'BUILT FOR INDIA.\nRUNS ON WHATSAPP.',
      line1: 'No app for your clients. No complex setup for you.',
      line2: '30 minutes to set up. Runs automatically after that.',
      showCTA: false,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fitosys-hero"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Three.js canvas — always #0A0A0A background */}
      <canvas ref={canvasRef} className="fitosys-canvas" />

      {/* Side label — "FITOSYS" vertical */}
      <div
        ref={menuRef}
        className="fitosys-side-menu"
        style={{ visibility: 'hidden' }}
      >
        <div className="fitosys-menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {/* Vertical brand label — Barlow Condensed, red */}
        <div
          className="fitosys-vertical-label"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: '#F20000',  // Fitosys Red
            textTransform: 'uppercase',
            fontSize: '11px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          FITOSYS
        </div>
      </div>

      {/* Section 0 — hero content */}
      <div className="fitosys-hero-content">
        {/* Title — Barlow Condensed, uppercase, white */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            visibility: 'hidden',
          }}
        >
          {splitTitle(sections[0].title)}
        </h1>

        {/* Subtitle — Urbanist, steel grey */}
        <div
          ref={subtitleRef}
          style={{ visibility: 'hidden' }}
        >
          <p
            className="subtitle-line"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              color: '#A0A0A0',  // Steel Grey
            }}
          >
            {sections[0].line1}
          </p>
          <p
            className="subtitle-line"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              color: '#A0A0A0',
            }}
          >
            {sections[0].line2}
          </p>
        </div>

        {/*
          CTA Button
          bg-[#F20000] — Fitosys Red. The only red element in the hero UI.
          Used here because it is the primary action. High signal value.
          On hover: inverts to white background, red text.
        */}
        <div ref={ctaRef} style={{ visibility: 'hidden', marginTop: '48px' }}>
          <button
            style={{
              backgroundColor: '#F20000',
              color: '#FFFFFF',
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '18px 48px',
              border: '2px solid #F20000',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
              (e.target as HTMLButtonElement).style.color = '#F20000';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#F20000';
              (e.target as HTMLButtonElement).style.color = '#FFFFFF';
            }}
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div
        ref={scrollProgressRef}
        className="fitosys-scroll-progress"
        style={{ visibility: 'hidden' }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#A0A0A0',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          SCROLL
        </div>
        <div className="fitosys-progress-track">
          <div
            className="fitosys-progress-fill"
            style={{
              width: `${scrollProgress * 100}%`,
              backgroundColor: '#F20000',  // Red fill — signal colour
              height: '2px',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        {/* Section counter — "01 / 03" format */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.15em',
            color: '#A0A0A0',
            marginTop: '8px',
          }}
        >
          {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll sections — Sections 1 and 2 */}
      <div className="fitosys-scroll-sections">
        {sections.slice(1).map((section, i) => (
          <section key={i} className="fitosys-content-section">
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                color: '#FFFFFF',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                whiteSpace: 'pre-line',
              }}
            >
              {section.title}
            </h2>
            <div style={{ marginTop: '24px' }}>
              <p
                className="subtitle-line"
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  color: '#A0A0A0',
                  fontWeight: 400,
                }}
              >
                {section.line1}
              </p>
              <p
                className="subtitle-line"
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  color: '#A0A0A0',
                  fontWeight: 400,
                }}
              >
                {section.line2}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
