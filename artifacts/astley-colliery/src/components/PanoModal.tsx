import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Props {
  src: string;
  title: string;
  onClose: () => void;
}

export default function PanoModal({ src, title, onClose }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const rotation = useRef({ lon: 0, lat: 0 });
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [fov, setFov] = useState(75);
  const fovRef = useRef(75);

  useEffect(() => {
    fovRef.current = fov;
    if (cameraRef.current) {
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0, 0, 0.01);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    el.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    new THREE.TextureLoader().load(src, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (!isDragging.current) rotation.current.lon += 0.03;
      const lat = Math.max(-85, Math.min(85, rotation.current.lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(rotation.current.lon);
      camera.lookAt(new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      ));
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w2 = el.clientWidth;
      const h2 = el.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, [src]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    rotation.current.lon -= (e.clientX - prevMouse.current.x) * 0.2;
    rotation.current.lat += (e.clientY - prevMouse.current.y) * 0.2;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { isDragging.current = false; };

  // touch
  const lastPinch = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinch.current = Math.sqrt(dx * dx + dy * dy);
      return;
    }
    isDragging.current = true;
    prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinch.current !== null) {
        const delta = lastPinch.current - dist;
        setFov(f => Math.max(30, Math.min(100, f + delta * 0.1)));
      }
      lastPinch.current = dist;
      return;
    }
    if (!isDragging.current) return;
    rotation.current.lon -= (e.touches[0].clientX - prevMouse.current.x) * 0.2;
    rotation.current.lat += (e.touches[0].clientY - prevMouse.current.y) * 0.2;
    prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = () => { isDragging.current = false; lastPinch.current = null; };

  const onWheel = (e: React.WheelEvent) => {
    setFov(f => Math.max(30, Math.min(100, f + e.deltaY * 0.05)));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9500, background: "#000", display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "rgba(0,0,0,0.8)", borderBottom: "1px solid rgba(255,255,255,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.2" width="16" height="16">
            <ellipse cx="12" cy="12" rx="10" ry="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span style={{ color: "#d4af37", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={() => setFov(f => Math.max(30, f - 10))} style={{ color: "white", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "3px", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "1rem" }}>+</button>
          <button onClick={() => setFov(f => Math.min(100, f + 10))} style={{ color: "white", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "3px", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "1rem" }}>−</button>
          <button onClick={onClose} style={{ color: "white", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "3px", padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "1rem" }}>✕</button>
        </div>
      </div>

      {/* viewer */}
      <div
        ref={mountRef}
        style={{ flex: 1, position: "relative", cursor: isDragging.current ? "grabbing" : "grab", touchAction: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* hint */}
      <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.55)", padding: "0.35rem 1rem", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap", borderRadius: "2px" }}>
        Drag to look around · Scroll to zoom · Esc to close
      </div>
    </div>
  );
}
