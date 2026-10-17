import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Celestial3DSphere() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    // 2. Main Celestial Sphere with custom shader or gradient material
    const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
    
    // Shader material for radiant violet/cyan/magenta planetary gradient
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorTop: { value: new THREE.Color(0x8b5cf6) }, // Purple/Violet
        colorMid: { value: new THREE.Color(0xec4899) }, // Pink
        colorBottom: { value: new THREE.Color(0x06b6d4) }, // Cyan
        colorDark: { value: new THREE.Color(0x13112c) }, // Deep shadow
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorTop;
        uniform vec3 colorMid;
        uniform vec3 colorBottom;
        uniform vec3 colorDark;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // Rim lighting
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          rim = pow(rim, 2.2);

          // Vertical gradient
          float y = (vPosition.y + 1.5) / 3.0;
          vec3 baseColor = mix(colorBottom, colorMid, smoothstep(0.1, 0.6, y));
          baseColor = mix(baseColor, colorTop, smoothstep(0.5, 0.95, y));

          // Shadow on bottom-right
          float shadow = max(dot(vNormal, normalize(vec3(-0.5, -0.3, 0.5))), 0.1);
          vec3 finalColor = mix(colorDark, baseColor, shadow);

          // Add radiant cyan/pink rim glow
          finalColor += rim * mix(colorCyan(rim), colorPink(rim), vUv.x);

          gl_FragColor = vec4(finalColor, 0.95);
        }

        vec3 colorCyan(float r) { return vec3(0.02, 0.71, 0.83); }
        vec3 colorPink(float r) { return vec3(0.92, 0.28, 0.60); }
      `,
      transparent: true,
    });

    const planet = new THREE.Mesh(sphereGeo, sphereMat);
    celestialGroup.add(planet);

    // 3. Glowing Orbital Ring
    const ringGeo = new THREE.TorusGeometry(2.35, 0.035, 32, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    // Orient ring diagonally across sphere
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.y = Math.PI / 5;
    celestialGroup.add(ring);

    // Outer faint secondary ring
    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.015, 24, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 5;
    celestialGroup.add(ring2);

    // 4. Diagonal Beam of Light / Solar Flare extending to bottom-left
    const beamGeo = new THREE.CylinderGeometry(0.03, 1.2, 5.0, 32, 1, true);
    const beamMat = new THREE.ShaderMaterial({
      uniforms: {
        colorGold: { value: new THREE.Color(0xfbbf24) },
        colorCyan: { value: new THREE.Color(0x38bdf8) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorGold;
        uniform vec3 colorCyan;
        varying vec2 vUv;
        void main() {
          float alpha = (1.0 - vUv.y) * 0.45;
          float sideGlow = 1.0 - abs(vUv.x - 0.5) * 2.0;
          alpha *= pow(sideGlow, 2.0);
          vec3 c = mix(colorCyan, colorGold, vUv.y);
          gl_FragColor = vec4(c, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(-1.4, -0.9, 0.2);
    beam.rotation.z = Math.PI / 3.4;
    celestialGroup.add(beam);

    // 5. Star Dust Particles
    const starCount = 80;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 8;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Mouse parallax easing
      targetX += (mouseX * 0.35 - targetX) * 0.05;
      targetY += (mouseY * 0.35 - targetY) * 0.05;

      celestialGroup.rotation.y = elapsed * 0.08 + targetX;
      celestialGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.1 + targetY;

      // Slight pulsing glow
      sphereMat.uniforms.time.value = elapsed;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] md:h-[560px] flex items-center justify-center">
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      {/* Background glow lens flare */}
      <div className="pointer-events-none absolute -bottom-10 left-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[90px]" />
      <div className="pointer-events-none absolute -top-10 right-10 w-72 h-72 bg-purple-500/25 rounded-full blur-[100px]" />
    </div>
  );
}
