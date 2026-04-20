import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface PanoViewerProps {
  src: string;
  className?: string;
}

export default function PanoViewer({ src, className }: PanoViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
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
    rendererRef.current = renderer;
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
      const target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(target);
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
  const onWheel = (e: React.WheelEvent) => {
    setFov(f => Math.max(30, Math.min(100, f + e.deltaY * 0.05)));
  };

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ cursor: isDragging.current ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <div style={{
        position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)",
        padding: "0.3rem 0.8rem", fontSize: "0.65rem", letterSpacing: "0.15em",
        textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap"
      }}>
        Drag to look around · Scroll to zoom
      </div>
    </div>
  );
}
