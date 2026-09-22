import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '../../state/SimulationContext';
import { buildProceduralHardware, Hardware3DScene } from './ProceduralHardware';
import { createFlowParticles, ParticleSystemController } from './FlowParticles';
import { HARDWARE_COMPONENTS } from '../../data/hardwareComponents';
import { RotateCw, ZoomIn, ZoomOut, Layers, Eye, RefreshCw, Activity, Zap, Play, Pause } from 'lucide-react';

export const HardwareViewer3D: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    selectedComponentId,
    setSelectedComponentId,
    explodedProgress,
    setExplodedProgress,
    casingMode,
    setCasingMode,
    flowMode,
    setFlowMode,
    hardwareVariant,
    setHardwareVariant,
    protectionState,
    health,
    explainableAlert,
    telemetry
  } = useSimulation();

  const [autoRotate, setAutoRotate] = useState<boolean>(!compact);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  // References to keep 3D objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const hardwareSceneRef = useRef<Hardware3DScene | null>(null);
  const particlesRef = useRef<ParticleSystemController | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraOrbitRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: compact ? 5.2 : 4.4,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2
  });

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const blueBackLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    blueBackLight.position.set(-5, -2, -4);
    scene.add(blueBackLight);

    // Build Hardware & Particles
    const hardware = buildProceduralHardware();
    hardwareSceneRef.current = hardware;
    scene.add(hardware.group);

    const particles = createFlowParticles();
    particlesRef.current = particles;
    scene.add(particles.group);

    // Initial camera placement
    const updateCamPos = () => {
      const { radius, theta, phi } = cameraOrbitRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0.2, 0);
    };
    updateCamPos();

    // Mouse / Touch handlers for Orbit, Pan & Raycast
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast for hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(hardware.group.children, true);
      let foundComp: string | null = null;
      for (const hit of intersects) {
        if (hit.object.userData?.isInteractive && hit.object.userData.componentId) {
          foundComp = hit.object.userData.componentId;
          break;
        }
      }
      setHoveredComponent(foundComp);

      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      cameraOrbitRef.current.theta -= deltaX * 0.007;
      cameraOrbitRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.05, cameraOrbitRef.current.phi - deltaY * 0.007));
      updateCamPos();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(hardware.group.children, true);
      for (const hit of intersects) {
        if (hit.object.userData?.isInteractive && hit.object.userData.componentId) {
          setSelectedComponentId(hit.object.userData.componentId);
          break;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraOrbitRef.current.radius = Math.max(2.5, Math.min(7.5, cameraOrbitRef.current.radius + e.deltaY * 0.003));
      updateCamPos();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('click', handleClick);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events for mobile
    let touchStartDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
        const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        cameraOrbitRef.current.theta -= deltaX * 0.009;
        cameraOrbitRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.05, cameraOrbitRef.current.phi - deltaY * 0.009));
        updateCamPos();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (touchStartDist - dist) * 0.008;
        cameraOrbitRef.current.radius = Math.max(2.5, Math.min(7.5, cameraOrbitRef.current.radius + factor));
        touchStartDist = dist;
        updateCamPos();
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    let lastTime = performance.now();
    let animId: number;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (autoRotate && !isDraggingRef.current) {
        cameraOrbitRef.current.theta += delta * 0.25;
        updateCamPos();
      }

      // Render
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update dynamic properties on scene
  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    hardwareSceneRef.current.updateExploded(explodedProgress);
  }, [explodedProgress]);

  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    const isRelayOpen = protectionState.relayPosition === 'OPEN';
    hardwareSceneRef.current.updateRelay(isRelayOpen);
  }, [protectionState.relayPosition]);

  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    hardwareSceneRef.current.updateVariant(hardwareVariant);
  }, [hardwareVariant]);

  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    hardwareSceneRef.current.updateCasing(casingMode);
  }, [casingMode]);

  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    const isAbnormal = explainableAlert.hasActiveAlert;
    const isCritical = protectionState.status === 'CRITICAL_PENDING' || protectionState.status === 'TRIPPED';
    hardwareSceneRef.current.highlightComponent(selectedComponentId, isAbnormal, isCritical);
  }, [selectedComponentId, explainableAlert.hasActiveAlert, protectionState.status]);

  // Update status LEDs
  useEffect(() => {
    if (!hardwareSceneRef.current) return;
    const leds = hardwareSceneRef.current.statusLeds;
    const isTripped = protectionState.status === 'TRIPPED';
    const isCritical = protectionState.status === 'CRITICAL_PENDING';
    const isAbnormal = explainableAlert.hasActiveAlert;

    if (isTripped || isCritical) {
      (leds.statusLed.material as THREE.MeshBasicMaterial).color.setHex(0xff1744);
      (leds.protectLed.material as THREE.MeshBasicMaterial).color.setHex(0xff1744);
    } else if (isAbnormal) {
      (leds.statusLed.material as THREE.MeshBasicMaterial).color.setHex(0xffb300);
      (leds.protectLed.material as THREE.MeshBasicMaterial).color.setHex(0x00e676);
    } else {
      (leds.statusLed.material as THREE.MeshBasicMaterial).color.setHex(0x00f0ff);
      (leds.protectLed.material as THREE.MeshBasicMaterial).color.setHex(0x00e676);
    }
  }, [protectionState.status, explainableAlert.hasActiveAlert]);

  // Update animated particles in tick interval
  useEffect(() => {
    const pInterval = setInterval(() => {
      if (particlesRef.current) {
        const isRelayOpen = protectionState.relayPosition === 'OPEN';
        const isAbnormal = explainableAlert.hasActiveAlert;
        const isCritical = protectionState.status === 'CRITICAL_PENDING' || protectionState.status === 'TRIPPED';
        particlesRef.current.update(0.04, flowMode, isRelayOpen, isAbnormal, isCritical);
      }
    }, 40);
    return () => clearInterval(pInterval);
  }, [flowMode, protectionState.relayPosition, explainableAlert.hasActiveAlert, protectionState.status]);

  // Camera presets
  const setCameraPreset = (preset: 'ISO' | 'TOP' | 'FRONT' | 'RELAY') => {
    if (!cameraRef.current) return;
    setAutoRotate(false);
    if (preset === 'ISO') {
      cameraOrbitRef.current = { radius: 4.4, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    } else if (preset === 'TOP') {
      cameraOrbitRef.current = { radius: 4.0, theta: 0, phi: 0.1 };
    } else if (preset === 'FRONT') {
      cameraOrbitRef.current = { radius: 4.2, theta: 0, phi: Math.PI / 2.1 };
    } else if (preset === 'RELAY') {
      cameraOrbitRef.current = { radius: 2.8, theta: 0.7, phi: Math.PI / 2.6 };
      setSelectedComponentId('relay_section');
    }
    const { radius, theta, phi } = cameraOrbitRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 0.2, 0);
  };

  const selectedComp = HARDWARE_COMPONENTS.find(c => c.id === selectedComponentId);

  return (
    <div className="relative w-full h-full flex flex-col bg-industrial-950/80 rounded-xl border border-slate-800 overflow-hidden select-none">
      {/* 3D Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[340px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Hover Tooltip Overlay */}
      {hoveredComponent && (
        <div className="absolute top-4 left-4 bg-industrial-900/90 backdrop-blur-md border border-cyan-500/40 text-xs px-3 py-1.5 rounded-md text-electric-cyan font-mono shadow-glow-cyan pointer-events-none">
          Click to inspect: {HARDWARE_COMPONENTS.find(c => c.id === hoveredComponent)?.name}
        </div>
      )}

      {/* Floating 3D Controls Ribbon */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="flex items-center bg-industrial-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-lg gap-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause Auto-Rotate" : "Start Auto-Rotate"}
            className={`p-1.5 rounded text-xs transition ${autoRotate ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            {autoRotate ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button
            onClick={() => setCameraPreset('ISO')}
            title="Isometric View"
            className="px-2 py-1 text-[11px] font-mono rounded text-slate-300 hover:bg-slate-800 transition"
          >
            ISO
          </button>
          <button
            onClick={() => setCameraPreset('TOP')}
            title="Top-Down PCB View"
            className="px-2 py-1 text-[11px] font-mono rounded text-slate-300 hover:bg-slate-800 transition"
          >
            PCB
          </button>
          <button
            onClick={() => setCameraPreset('RELAY')}
            title="Contactor / Relay Focus"
            className="px-2 py-1 text-[11px] font-mono rounded text-slate-300 hover:bg-slate-800 transition"
          >
            RELAY
          </button>
          <button
            onClick={() => {
              setExplodedProgress(explodedProgress > 0 ? 0 : 0.85);
            }}
            title="Toggle Exploded View"
            className={`p-1.5 rounded text-xs transition ${explodedProgress > 0 ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers size={15} />
          </button>
        </div>

        {/* Casing & Signal Flow Bar */}
        <div className="flex items-center justify-end bg-industrial-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-lg gap-1 font-mono text-[10px]">
          <span className="text-slate-400 pl-1.5">LID:</span>
          <button 
            onClick={() => setCasingMode('TRANSPARENT')}
            className={`px-1.5 py-0.5 rounded ${casingMode === 'TRANSPARENT' ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400'}`}
          >
            SMOKE
          </button>
          <button 
            onClick={() => setCasingMode('OPAQUE')}
            className={`px-1.5 py-0.5 rounded ${casingMode === 'OPAQUE' ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400'}`}
          >
            SOLID
          </button>
          <button 
            onClick={() => setCasingMode('OFF')}
            className={`px-1.5 py-0.5 rounded ${casingMode === 'OFF' ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400'}`}
          >
            OFF
          </button>
        </div>

        {/* Variant Switcher */}
        <div className="flex items-center justify-end bg-industrial-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-lg gap-1 font-mono text-[10px]">
          <span className="text-slate-400 pl-1.5">CHASSIS:</span>
          <button 
            onClick={() => setHardwareVariant('HOUSEHOLD')}
            className={`px-1.5 py-0.5 rounded ${hardwareVariant === 'HOUSEHOLD' ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400'}`}
          >
            HOUSEHOLD
          </button>
          <button 
            onClick={() => setHardwareVariant('INDUSTRIAL')}
            className={`px-1.5 py-0.5 rounded ${hardwareVariant === 'INDUSTRIAL' ? 'bg-cyan-500/20 text-electric-cyan' : 'text-slate-400'}`}
          >
            DIN-RAIL
          </button>
        </div>
      </div>

      {/* Exploded View Slider at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-industrial-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-electric-cyan" />
          <span className="font-mono text-slate-300 text-[11px]">EXPLODED VIEW:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodedProgress}
            onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
            className="w-28 sm:w-44 accent-electric-cyan cursor-pointer"
          />
          <span className="font-mono text-electric-cyan text-[11px] w-8">
            {Math.round(explodedProgress * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400 hidden sm:inline">FLOW:</span>
          <button
            onClick={() => setFlowMode('BOTH')}
            className={`px-2 py-0.5 rounded transition ${flowMode === 'BOTH' ? 'bg-cyan-500/25 text-electric-cyan border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            BOTH
          </button>
          <button
            onClick={() => setFlowMode('POWER')}
            className={`px-2 py-0.5 rounded transition ${flowMode === 'POWER' ? 'bg-cyan-500/25 text-electric-cyan border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            POWER
          </button>
          <button
            onClick={() => setFlowMode('DATA')}
            className={`px-2 py-0.5 rounded transition ${flowMode === 'DATA' ? 'bg-cyan-500/25 text-electric-cyan border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            DATA
          </button>
        </div>
      </div>
    </div>
  );
};
