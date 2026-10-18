/**
 * Nexus Write — Vibrant Colorful Holographic 3D Environment
 * Three.js r160+ PBR scene with chromatic crystal core, multi-colored glowing orbital rings,
 * rainbow-tinted particle field, and studio lighting.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface HologramSceneProps {
  qualityScore?: number;
  vocabDiversity?: number;
  similarityPercentage?: number;
  performanceMode?: 'CINEMATIC' | 'BALANCED' | 'PERFORMANCE';
  reducedMotion?: boolean;
}

const _mouse = new THREE.Vector2(0, 0);
const _targetMouse = new THREE.Vector2(0, 0);

export const HologramScene: React.FC<HologramSceneProps> = ({
  qualityScore = 75,
  vocabDiversity = 65,
  similarityPercentage = 0,
  performanceMode = 'CINEMATIC',
  reducedMotion = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const metricsRef = useRef({
    quality: qualityScore,
    diversity: vocabDiversity,
    similarity: similarityPercentage,
    performance: performanceMode,
    reducedMotion
  });

  useEffect(() => {
    metricsRef.current = {
      quality: qualityScore,
      diversity: vocabDiversity,
      similarity: similarityPercentage,
      performance: performanceMode,
      reducedMotion
    };
  }, [qualityScore, vocabDiversity, similarityPercentage, performanceMode, reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Fog with deep violet tint
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080614, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(0, 1.2, 16);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: metricsRef.current.performance !== 'PERFORMANCE' && !isHeadless,
      alpha: true
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(
      metricsRef.current.performance === 'PERFORMANCE' || isHeadless
        ? 1
        : Math.min(window.devicePixelRatio, 1.75)
    );
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.05).texture;
    pmremGenerator.dispose();

    // 3. Multi-Color Studio Lighting Rig (Pink, Cyan, Amber, Indigo)
    const hemiLight = new THREE.HemisphereLight(0xc084fc, 0x0f172a, 1.1);
    scene.add(hemiLight);

    const magentaLight = new THREE.DirectionalLight(0xf43f5e, 1.5);
    magentaLight.position.set(-10, 8, 8);
    scene.add(magentaLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
    cyanLight.position.set(10, 8, 8);
    scene.add(cyanLight);

    const goldPoint = new THREE.PointLight(0xfbbf24, 2.5, 25);
    goldPoint.position.set(0, -5, 6);
    scene.add(goldPoint);

    // 4. Hero Composite Procedural Model
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0.2, 0);
    scene.add(heroGroup);

    // Part 1: Central Chromatic Crystal (Icosahedron)
    const crystalGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    heroGroup.add(crystalMesh);

    // Part 2: Inner Faceted Core with radiant cyan
    const innerGeo = new THREE.OctahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    heroGroup.add(innerMesh);

    // Part 3: Radiant Cyan Orbital Ring
    const ringGeo1 = new THREE.TorusGeometry(3.7, 0.05, 16, 90);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.35;
    heroGroup.add(ring1);

    // Part 4: Vibrant Fuchsia/Pink Orbital Ring
    const ringGeo2 = new THREE.TorusGeometry(4.4, 0.04, 16, 90);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.4;
    ring2.rotation.z = Math.PI * 0.25;
    heroGroup.add(ring2);

    // Part 5: Golden Amber Accent Halo Ring
    const ringGeo3 = new THREE.TorusGeometry(5.1, 0.03, 16, 90);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.x = Math.PI * 0.15;
    ring3.rotation.y = -Math.PI * 0.3;
    heroGroup.add(ring3);

    // Part 6 & 7: Passage A (Electric Cyan) & Passage B (Electric Pink)
    const probeGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const probeMatA = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.95,
      roughness: 0.05
    });
    const probeA = new THREE.Mesh(probeGeo, probeMatA);

    const probeMatB = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.8,
      metalness: 0.95,
      roughness: 0.05
    });
    const probeB = new THREE.Mesh(probeGeo, probeMatB);

    heroGroup.add(probeA);
    heroGroup.add(probeB);

    // Part 8: Rainbow Gradient Link Line between Probes
    const linkMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6
    });
    const linkGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4.8, 0, 0),
      new THREE.Vector3(4.8, 0, 0)
    ]);
    const linkLine = new THREE.Line(linkGeo, linkMat);
    heroGroup.add(linkLine);

    // Part 9: Multi-Color Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.25)');
      grad.addColorStop(0.7, 'rgba(236, 72, 153, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.8;
    scene.add(shadowPlane);

    // 5. Multi-Color Floating Sparkle Particles
    const particleCount = metricsRef.current.performance === 'CINEMATIC' ? 360 : (metricsRef.current.performance === 'BALANCED' ? 180 : 80);
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x38bdf8), // Sky
      new THREE.Color(0xf472b6), // Pink
      new THREE.Color(0xa78bfa), // Violet
      new THREE.Color(0x34d399), // Emerald
      new THREE.Color(0xfbbf24), // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 1;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particlesMat = new THREE.PointsMaterial({
      size: 0.35,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // 6. Pointer & Parallax
    const handlePointerMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      _targetMouse.x = (e.clientX - halfW) / halfW;
      _targetMouse.y = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // 7. Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const m = metricsRef.current;

      const dampFactor = m.reducedMotion ? 1 : 2.0;
      _mouse.x = THREE.MathUtils.damp(_mouse.x, _targetMouse.x, dampFactor, delta);
      _mouse.y = THREE.MathUtils.damp(_mouse.y, _targetMouse.y, dampFactor, delta);

      camera.position.x = _mouse.x * 1.6;
      camera.position.y = 1.2 - _mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      const rotSpeed = m.reducedMotion ? 0.04 : 0.22 * (1 + (m.diversity / 100) * 0.4);
      heroGroup.rotation.y += delta * rotSpeed;
      heroGroup.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.08;

      ring1.rotation.z += delta * 0.35;
      ring2.rotation.z -= delta * 0.28;
      ring3.rotation.z += delta * 0.2;
      innerMesh.rotation.y -= delta * 0.55;

      const simRatio = Math.max(0, Math.min(1, m.similarity / 100));
      const targetDist = 4.8 - simRatio * 3.2;
      probeA.position.x = -targetDist;
      probeA.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.35;
      probeB.position.x = targetDist;
      probeB.position.y = -Math.sin(clock.elapsedTime * 1.4) * 0.35;

      const posAttr = linkLine.geometry.attributes.position as THREE.BufferAttribute;
      if (posAttr) {
        posAttr.setXYZ(0, probeA.position.x, probeA.position.y, 0);
        posAttr.setXYZ(1, probeB.position.x, probeB.position.y, 0);
        posAttr.needsUpdate = true;
      }
      linkMat.opacity = 0.3 + simRatio * 0.7;

      if (!m.reducedMotion) {
        particles.rotation.y += delta * 0.035;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      crystalGeo.dispose();
      crystalMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      probeGeo.dispose();
      probeMatA.dispose();
      probeMatB.dispose();
      linkGeo.dispose();
      linkMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTexture.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      pTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-65 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
