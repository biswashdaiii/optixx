import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as mpFaceMesh from "@mediapipe/face_mesh";
import * as mpCamera from "@mediapipe/camera_utils";
import * as THREE from 'three';
import '../styles/VirtualTryOn.css';

// 3D Anchor removed for production

import { API } from '../config';

// Head Occluder removed for armless mode

// Glasses Model Component
const GlassesModel = ({ position, rotation, scale, modelPath }) => {
  // Use the provided model path or fallback to default
  const glbPath = modelPath ? `${API}${modelPath}`.replace('/api', '') : '/models/glasses.glb';
  const { scene } = useGLTF(glbPath);

  const processedModel = useMemo(() => {
    if (!scene) return null;
    const s = scene.clone();

    // 1. "Civilized Hiding": Hide arm/temple meshes FIRST
    s.traverse((node) => {
      if (node.isMesh) {
        const name = node.name.toLowerCase();
        if (name.includes('temple') || name.includes('arm') || name.includes('ear') || name.includes('handle')) {
          node.visible = false;
        }
      }
    });

    // 2. Calculate bounding box ONLY for visible parts (Lenses + Bridge)
    // This ensures the pivot is exactly between the eyes
    const box = new THREE.Box3();
    s.traverse((node) => {
      if (node.isMesh && node.visible) {
        box.expandByObject(node);
      }
    });

    if (box.isEmpty()) box.setFromObject(s); // Fallback

    const size = new THREE.Vector3();
    box.getSize(size);

    // 3. Normalize size - Force width to 1
    const scaleFactor = 1 / size.x;
    s.scale.setScalar(scaleFactor);

    // 4. Anchor Point Calibration
    // Center the model on requested pivot (Bridge/Nose)
    const center = new THREE.Vector3();
    box.getCenter(center);

    s.position.x = -center.x * scaleFactor;
    s.position.y = -center.y * scaleFactor;

    // Z-Anchor: Lenses should stay close to the face plane
    s.position.z = -box.min.z * scaleFactor;

    s.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        if (node.material) {
          node.material.depthTest = true;
          node.material.depthWrite = true;
        }
      }
    });

    console.log("� Pivot recalibrated. Center Y:", center.y.toFixed(2), "New Width:", size.x.toFixed(2));
    return s;
  }, [scene, scale]); // Include scale here to avoid stale closures

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* 180-flip to ensure arms point AWAY from camera and lenses face USER */}
      <group rotation={[0, Math.PI, 0]}>
        {processedModel && <primitive object={processedModel} key={processedModel.uuid} />}
      </group>
    </group>
  );
};

// Fix for MediaPipe Module.arguments error
if (typeof window !== 'undefined' && !window.arguments) {
  window.arguments = [];
}

const VirtualTryOn = ({ product }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [systemStatus, setSystemStatus] = useState('Initializing AI...');

  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 0.1
  });

  const [adjustments, setAdjustments] = useState({
    scale: 1.0,
    offsetY: 0,
    offsetX: 0,
    offsetZ: 0
  });

  const adjustmentsRef = useRef(adjustments);
  useEffect(() => {
    adjustmentsRef.current = adjustments;
  }, [adjustments]);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (videoRef.current) {
          const camera = new mpCamera.Camera(videoRef.current, {
            onFrame: async () => {
              if (faceMeshRef.current && videoRef.current && mounted) {
                await faceMeshRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          cameraRef.current = camera;
          await camera.start();
          console.log("📸 Camera Active");
        }
      } catch (err) {
        console.error("Camera Start Error:", err);
      }
    };

    const initializeSystem = async () => {
      try {
        console.log("🚀 Initializing 3D Try-On...");

        // 1. Setup MediaPipe FaceMesh
        const faceMesh = new mpFaceMesh.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (!mounted) return;

          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setFaceDetected(false);
            return;
          }

          const adj = adjustmentsRef.current;
          const landmarks = results.multiFaceLandmarks[0];

          // landmarks are normalized 0 to 1
          // Mapping to Three.js space (Camera at Z=5, looking at origin)

          // Index 168 is the nose bridge (between eyes)
          const bridge = landmarks[168];
          const leftEye = landmarks[33];
          const rightEye = landmarks[263];

          // Mirroring: MediaPipe is usually mirrored relative to camera
          // X: Mirror and center (0.5 is screen center)
          const x = (0.5 - bridge.x) * 8.0 + (adj.offsetX || 0);

          // Y: Vertical alignment
          const y = (0.5 - bridge.y) * 6.0 - 0.1 + (adj.offsetY || 0);

          // Z: High precision depth mapping
          const z = (0.5 - bridge.z) * 4.0 - 2.1 + (adj.offsetZ * 2.5);

          // Rotation: Automated
          const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
          const leftTemple = landmarks[127];
          const rightTemple = landmarks[356];
          const yaw = (leftTemple.z - rightTemple.z) * 1.6;
          const noseTip = landmarks[1];
          const pitch = (noseTip.y - bridge.y) * 1.4;

          // Scale: AUTOMATED based on Pupillary Distance (Eye Dist)
          const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
          const autoScale = eyeDist * 7.5;

          setGlassesTransform({
            position: [x, y, z],
            rotation: [pitch, yaw, roll],
            scale: autoScale * adj.scale
          });

          if (!faceDetected) {
            setFaceDetected(true);
            setIsLoading(false);
            setSystemStatus('Face Locked');
          }
        });

        faceMeshRef.current = faceMesh;
        await startCamera();

      } catch (err) {
        console.error("System Init Error:", err);
        setSystemStatus(`Error: ${err.message}`);
        setIsLoading(false);
      }
    };

    initializeSystem();

    return () => {
      mounted = false;
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, []); // Only run on mount

  return (
    <div className="virtual-tryon-container">
      <div className="tryon-header">
        <h2>✨ Pro 3D Virtual Try-On</h2>
        <p>Real-time head orientation & depth tracking</p>
      </div>

      <div className="tryon-content-grid">
        <div className="video-main-area">
          <video
            ref={videoRef}
            className="tryon-video"
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }}
          />

          <div className="threejs-overlay" style={{ zIndex: 10 }}>
            <Canvas
              gl={{ alpha: true }}
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ width: '100%', height: '100%' }}
            >
              <SceneContent
                glassesTransform={glassesTransform}
                faceDetected={faceDetected}
                product={product}
              />
            </Canvas>
          </div>

          {!isLoading && (
            <div className={`system-badge ${faceDetected ? 'active' : 'searching'}`}>
              {faceDetected ? '🎯 3D LOCK' : '🔍 SCANNING...'}
            </div>
          )}

          {isLoading && (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Waking up the AI...</p>
            </div>
          )}

          <div className="action-bar-overlay" style={{ background: 'transparent' }}>
            <p style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontWeight: 600 }}>
              {faceDetected ? '✅ Real-time 3D Active' : '🔍 Looking for your face...'}
            </p>
          </div>
        </div>

        <div className="controls-side-panel">
          <div className="product-brief">
            <img src={product?.image || '/placeholder.png'} alt="Product" />
            <div>
              <h4>{product?.name || 'Glasses'}</h4>
              <p>${product?.price || '0.00'}</p>
            </div>
          </div>

          <div className="controls-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>✨</span> Optix Auto-Fit
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
              We've automatically calibrated the fit based on your face shape.
            </p>

            <div className="slider-group">
              <label>Fine-tune Size <span>{Math.round(adjustments.scale * 100)}%</span></label>
              <input
                type="range" min="0.8" max="1.3" step="0.01"
                value={adjustments.scale}
                onChange={(e) => setAdjustments(p => ({ ...p, scale: +e.target.value }))}
              />
            </div>

            <details className="advanced-tuning" open>
              <summary style={{ fontSize: '12px', color: '#888', cursor: 'pointer', marginBottom: '10px' }}>
                Position Adjustments
              </summary>

              <div className="slider-group">
                <label>Vertical Position (Up/Down)</label>
                <input
                  type="range" min="-0.5" max="0.5" step="0.01"
                  value={adjustments.offsetY}
                  onChange={(e) => setAdjustments(p => ({ ...p, offsetY: +e.target.value }))}
                />
              </div>

              <div className="slider-group">
                <label>Horizontal Position (Left/Right)</label>
                <input
                  type="range" min="-0.5" max="0.5" step="0.01"
                  value={adjustments.offsetX}
                  onChange={(e) => setAdjustments(p => ({ ...p, offsetX: +e.target.value }))}
                />
              </div>

              <div className="slider-group">
                <label>Depth (Stick to Face/Ear)</label>
                <input
                  type="range" min="-0.5" max="0.5" step="0.01"
                  value={adjustments.offsetZ}
                  onChange={(e) => setAdjustments(p => ({ ...p, offsetZ: +e.target.value }))}
                />
              </div>
            </details>
          </div>

          <div className="status-log">
            <strong>System Engine:</strong> {systemStatus}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;

// --- Helper Components for Three.js Scene ---

const SceneContent = ({ glassesTransform, faceDetected, product }) => {
  return (
    <>
      <ambientLight intensity={3.0} />
      <pointLight position={[0, 10, 10]} intensity={3.0} />
      <spotLight position={[0, 5, 10]} intensity={2.0} penumbra={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />

      <Suspense fallback={null}>
        {faceDetected && (
          <group position={glassesTransform.position} rotation={glassesTransform.rotation}>
            <GlassesModel
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={glassesTransform.scale}
              modelPath={product?.model3D}
            />
          </group>
        )}
      </Suspense>
    </>
  );
};