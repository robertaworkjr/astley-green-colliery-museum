import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ModelViewer({ src }: { src: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.01, 1000);
    camera.position.set(0, 1, 4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enablePan = false;
    renderer.domElement.addEventListener("pointerdown", () => { controls.autoRotate = false; });

    // Lighting — warm industrial feel
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xd4af37, 2.5);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.8);
    fill.position.set(-5, 3, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.4);
    rim.position.set(0, -2, -6);
    scene.add(rim);

    let mixer: THREE.AnimationMixer | null = null;
    new GLTFLoader().load(
      src,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 2.5 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.sub(centre.multiplyScalar(scale));
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
        controls.target.set(0, 0, 0);
        controls.update();
        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
        }
        const overlay = mount.querySelector(".mv-loading") as HTMLElement | null;
        if (overlay) { overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }
      },
      undefined,
      (err) => { console.error("GLB load error:", err); }
    );

    const clock = new THREE.Clock();
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      mixer?.update(clock.getDelta());
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [src]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        background: "radial-gradient(ellipse at center, #111 0%, #050505 100%)",
        border: "1px solid rgba(212,175,55,0.2)",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      <div
        className="mv-loading"
        style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "1rem",
          transition: "opacity 0.4s", pointerEvents: "none", zIndex: 10,
        }}
      >
        <div style={{
          width: "40px", height: "40px",
          border: "1px solid rgba(212,175,55,0.2)", borderTop: "1px solid #d4af37",
          borderRadius: "50%", animation: "mvSpin 1s linear infinite",
        }} />
        <p style={{ fontFamily: "sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)" }}>
          Loading Model
        </p>
      </div>

      <div style={{
        position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "0.5rem",
        pointerEvents: "none", zIndex: 5,
      }}>
        <span style={{ fontFamily: "sans-serif", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)" }}>
          Drag to rotate · Scroll to zoom
        </span>
      </div>

      <style>{`@keyframes mvSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
