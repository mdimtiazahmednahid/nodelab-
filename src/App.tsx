import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, Sphere, Cylinder, Cone, TorusKnot, Icosahedron, Environment, Html, PointerLockControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useDrag } from '@use-gesture/react'

// --- AUDIO SYSTEM ---
const playSound = (type: 'click' | 'success') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContext) return
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  if (type === 'click') {
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  } else if (type === 'success') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2) // G5
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  }
}



// --- MOVEMENT STATE ---
const movementState = { forward: false, backward: false, left: false, right: false }

function usePersonControls() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': movementState.forward = true; break
        case 'KeyS': case 'ArrowDown': movementState.backward = true; break
        case 'KeyA': case 'ArrowLeft': movementState.left = true; break
        case 'KeyD': case 'ArrowRight': movementState.right = true; break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': movementState.forward = false; break
        case 'KeyS': case 'ArrowDown': movementState.backward = false; break
        case 'KeyA': case 'ArrowLeft': movementState.left = false; break
        case 'KeyD': case 'ArrowRight': movementState.right = false; break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
}

// --- PLAYER COMPONENT ---
function Player() {
  usePersonControls()
  const { camera } = useThree()
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    // Face the lab from the outside starting position
    camera.rotation.set(0, 0, 0)
  }, [camera])

  const maxSpeed = 3.0 // Reduced for more realistic walking
  const acceleration = 30.0
  const friction = 10.0

  useFrame((_, delta) => {

    const { forward, backward, left, right } = movementState

    // Mathematically bulletproof forward/right vectors based on actual camera orientation
    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    forwardVector.y = 0
    if (forwardVector.lengthSq() > 0) forwardVector.normalize()

    const rightVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    rightVector.y = 0
    if (rightVector.lengthSq() > 0) rightVector.normalize()

    const inputDirection = new THREE.Vector3()
    if (forward) inputDirection.add(forwardVector)
    if (backward) inputDirection.sub(forwardVector)
    if (right) inputDirection.add(rightVector)
    if (left) inputDirection.sub(rightVector)

    if (inputDirection.lengthSq() > 0) {
      inputDirection.normalize()
      velocity.current.add(inputDirection.multiplyScalar(acceleration * delta))
    }

    // Apply frame-rate independent friction (damping) to prevent velocity flipping on lag
    const damping = Math.exp(-friction * delta)
    velocity.current.x *= damping
    velocity.current.z *= damping

    // Clamp velocity to max speed
    if (velocity.current.lengthSq() > maxSpeed * maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed)
    }

    camera.position.x += velocity.current.x * delta
    camera.position.z += velocity.current.z * delta
    camera.position.y = 1.6

    // Limits
    if (camera.position.x > 6.5) { camera.position.x = 6.5; velocity.current.x = 0; }
    if (camera.position.x < -6.5) { camera.position.x = -6.5; velocity.current.x = 0; }
    if (camera.position.z > 4.5) { camera.position.z = 4.5; velocity.current.z = 0; }
    if (camera.position.z < -4.5) { camera.position.z = -4.5; velocity.current.z = 0; } // Wall boundary

    // Allow player to lean over the table
    const tableMinX = -2.5
    const tableMaxX = 2.5
    const tableMinZ = -2.5
    const tableMaxZ = -1.2

    if (camera.position.x > tableMinX && camera.position.x < tableMaxX &&
        camera.position.z > tableMinZ && camera.position.z < tableMaxZ) {
      
      const distMinX = Math.abs(camera.position.x - tableMinX)
      const distMaxX = Math.abs(camera.position.x - tableMaxX)
      const distMinZ = Math.abs(camera.position.z - tableMinZ)
      const distMaxZ = Math.abs(camera.position.z - tableMaxZ)
      
      const minDist = Math.min(distMinX, distMaxX, distMinZ, distMaxZ)
      
      if (minDist === distMinZ) {
        camera.position.z = tableMinZ
        velocity.current.z = 0
      } else if (minDist === distMaxZ) {
        camera.position.z = tableMaxZ
        velocity.current.z = 0
      } else if (minDist === distMinX) {
        camera.position.x = tableMinX
        velocity.current.x = 0
      } else if (minDist === distMaxX) {
        camera.position.x = tableMaxX
        velocity.current.x = 0
      }
    }
  })

  return null
}

// --- MOBILE TOUCH CONTROLS ---
function MobileControls() {
  const { camera } = useThree()

  const bindLook = useDrag(({ delta: [dx, dy] }) => {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ')
    euler.copy(camera.rotation)
    euler.y -= dx * 0.005
    euler.x -= dy * 0.005
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
    camera.rotation.copy(euler)
  })

  const btnStyle = { background: 'rgba(255,255,255,0.2)', border: '1px solid white', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', userSelect: 'none', touchAction: 'none' }

  return (
    <Html fullscreen zIndexRange={[100, 0]}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div {...(bindLook as any)()} style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', pointerEvents: 'auto', touchAction: 'none' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '180px', height: '180px', pointerEvents: 'auto' }}>
          <div
            onPointerDown={() => movementState.forward = true} onPointerUp={() => movementState.forward = false} onPointerOut={() => movementState.forward = false}
            style={{ ...btnStyle, position: 'absolute', top: 0, left: '60px', width: '60px', height: '60px' } as any}>W</div>
          <div
            onPointerDown={() => movementState.backward = true} onPointerUp={() => movementState.backward = false} onPointerOut={() => movementState.backward = false}
            style={{ ...btnStyle, position: 'absolute', bottom: 0, left: '60px', width: '60px', height: '60px' } as any}>S</div>
          <div
            onPointerDown={() => movementState.left = true} onPointerUp={() => movementState.left = false} onPointerOut={() => movementState.left = false}
            style={{ ...btnStyle, position: 'absolute', top: '60px', left: 0, width: '60px', height: '60px' } as any}>A</div>
          <div
            onPointerDown={() => movementState.right = true} onPointerUp={() => movementState.right = false} onPointerOut={() => movementState.right = false}
            style={{ ...btnStyle, position: 'absolute', top: '60px', right: 0, width: '60px', height: '60px' } as any}>D</div>
        </div>
      </div>
    </Html>
  )
}

function Oscilloscope({ position, rotation = [0, 0, 0], currentVal, onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Oscilloscope: Analyzes and displays electronic signals. The waveform visualizes voltage over time.') }}>
      {/* Body */}
      <Box position={[0, 0.15, 0]} args={[0.4, 0.3, 0.3]} castShadow><meshStandardMaterial color="#ecf0f1" /></Box>
      {/* Screen */}
      <Box position={[-0.05, 0.15, 0.151]} args={[0.2, 0.2, 0.01]}>
        <meshBasicMaterial color="#00b894" />
      </Box>
      {/* Waveform (simulated with a thin box that moves with current) */}
      <Box position={[-0.05, 0.15 + (currentVal ? (currentVal / 900) * 0.08 : 0), 0.155]} args={[0.15, 0.01, 0.01]} rotation={[0, 0, currentVal ? Math.PI / 12 : 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Box>
      {/* Knobs */}
      <Cylinder position={[0.12, 0.2, 0.15]} args={[0.02, 0.02, 0.02]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#2d3436" /></Cylinder>
      <Cylinder position={[0.12, 0.1, 0.15]} args={[0.02, 0.02, 0.02]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#2d3436" /></Cylinder>
    </group>
  )
}

function PowerSupply({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Bench Power Supply: Delivers clean DC voltage to circuits with current limiting protection.') }}>
      <Box position={[0, 0.1, 0]} args={[0.3, 0.2, 0.2]} castShadow><meshStandardMaterial color="#7f8c8d" /></Box>
      {/* Display */}
      <Box position={[0, 0.15, 0.101]} args={[0.15, 0.08, 0.01]}><meshBasicMaterial color="#c0392b" /></Box>
      {/* Terminals */}
      <Cylinder position={[-0.05, 0.05, 0.1]} args={[0.01, 0.01, 0.02]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#e74c3c" /></Cylinder>
      <Cylinder position={[0.05, 0.05, 0.1]} args={[0.01, 0.01, 0.02]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#2c3e50" /></Cylinder>
    </group>
  )
}

function ChemistryCorner({ position, rotation, onInfo }: any) {
  
  const [stirring, setStirring] = useState(false)
  const stirrerRef = useRef<THREE.Mesh>(null)
  
  const [scaleWeight, setScaleWeight] = useState("0.000")

  useFrame((_, delta) => {
    if (stirring && stirrerRef.current) {
      stirrerRef.current.rotation.y += delta * 15
    }
  })

  const handleScaleClick = (e: any) => {
    e.stopPropagation()
    const w = (Math.random() * 50).toFixed(3)
    setScaleWeight(w)
    onInfo && onInfo(`Precision Scale: Measured ${w}g of sample.`)
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Banner */}
      <Html transform position={[0, 1.5, -0.41]} scale={0.1}>
        <div style={{ background: '#e74c3c', color: 'white', padding: '10px 30px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold', border: '4px solid #c0392b' }}>CHEMISTRY LAB</div>
      </Html>

      {/* Table */}
      <Box position={[0, 0.45, 0]} args={[3, 0.05, 0.8]} castShadow><meshStandardMaterial color="#ecf0f1" /></Box>
      <Box position={[-1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>
      <Box position={[1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>

      {/* Solar Still Experiment */}
      <SolarStill position={[-0.8, 0.475, 0]} onInfo={onInfo} />


      {/* Precision Scale */}
      <group position={[0, 0.475, 0]} onClick={handleScaleClick}>
        <Box position={[0, 0.04, 0]} args={[0.2, 0.08, 0.2]}><meshStandardMaterial color="#bdc3c7" /></Box>
        <Cylinder position={[0, 0.08, 0]} args={[0.08, 0.08, 0.01]}><meshStandardMaterial color="#7f8c8d" /></Cylinder>
        <Box position={[0, 0.04, 0.08]} args={[0.1, 0.04, 0.01]}><meshBasicMaterial color="#2ecc71" /></Box>
        <Html transform position={[0, 0.04, 0.086]} scale={0.005}>
          <div style={{ background: 'black', color: '#2ecc71', padding: '2px', fontFamily: 'monospace' }}>{scaleWeight}g</div>
        </Html>
      </group>

      {/* Magnetic Stirrer */}
      <group position={[0.8, 0.475, -0.2]} onClick={(e) => { e.stopPropagation(); setStirring(!stirring); onInfo && onInfo(stirring ? 'Magnetic Stirrer OFF.' : 'Magnetic Stirrer ON.') }}>
        <Box position={[0, 0.05, 0]} args={[0.3, 0.1, 0.3]}><meshStandardMaterial color="#ecf0f1" /></Box>
        <Cylinder position={[0, 0.1, 0]} args={[0.12, 0.12, 0.02]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
        
        {/* Beaker with liquid and stirrer bar */}
        <Cylinder position={[0, 0.18, 0]} args={[0.08, 0.08, 0.15]}><meshPhysicalMaterial color={stirring ? "#e67e22" : "#f1c40f"} transmission={0.5} opacity={0.8} transparent /></Cylinder>
        <Box ref={stirrerRef} position={[0, 0.11, 0]} args={[0.06, 0.01, 0.01]}><meshStandardMaterial color="#fff" /></Box>
      </group>
    </group>
  )
}

function Telescope({ position, rotation = [0, 0, 0], onInfo }: any) {
  const [active, setActive] = useState(false)
  const tubeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (active && tubeRef.current) {
      // Slowly rotate the telescope to "scan the skies"
      tubeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      tubeRef.current.rotation.z = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={(e) => {
      e.stopPropagation();
      setActive(!active);
      onInfo && onInfo(active ? 'Telescope: Tracking disabled. Calibrating lens.' : 'Telescope: Tracking enabled. Scanning the celestial bodies.')
    }}>
      {/* Tripod Base */}
      <Cylinder position={[0, 0.15, 0]} args={[0.02, 0.05, 0.3]}><meshStandardMaterial color="#2d3436" /></Cylinder>
      {/* Tripod Legs */}
      <Cylinder position={[0.1, 0.1, 0]} args={[0.01, 0.01, 0.3]} rotation={[0, 0, -Math.PI / 8]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[-0.05, 0.1, 0.08]} args={[0.01, 0.01, 0.3]} rotation={[Math.PI / 8, 0, Math.PI / 16]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[-0.05, 0.1, -0.08]} args={[0.01, 0.01, 0.3]} rotation={[-Math.PI / 8, 0, Math.PI / 16]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>

      {/* Main Tube Group */}
      <group position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} ref={tubeRef}>
        {/* Mount Joint */}
        <Sphere args={[0.04]}><meshStandardMaterial color="#34495e" /></Sphere>
        {/* Main Tube */}
        <Cylinder position={[0, 0.2, 0]} args={[0.04, 0.05, 0.4]}><meshStandardMaterial color="#ecf0f1" /></Cylinder>
        {/* Lens end */}
        <Cylinder position={[0, 0.4, 0]} args={[0.055, 0.05, 0.05]}><meshStandardMaterial color="#e74c3c" /></Cylinder>
        <Cylinder position={[0, 0.41, 0]} args={[0.045, 0.045, 0.02]}><meshPhysicalMaterial color="#3498db" transmission={0.9} roughness={0.1} /></Cylinder>
        {/* Eyepiece */}
        <Cylinder position={[0, -0.02, 0]} args={[0.02, 0.04, 0.08]}><meshStandardMaterial color="#2d3436" /></Cylinder>
        <Cylinder position={[0.03, -0.04, 0]} args={[0.01, 0.01, 0.06]} rotation={[0, 0, Math.PI / 4]}><meshStandardMaterial color="#2d3436" /></Cylinder>
      </group>
    </group>
  )
}

function PhysicsCorner({ position, rotation, onInfo }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Banner */}
      <Html transform position={[0, 1.5, -0.41]} scale={0.1}>
        <div style={{ background: '#2980b9', color: 'white', padding: '10px 30px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold', border: '4px solid #34495e' }}>PHYSICS LAB</div>
      </Html>

      {/* Table */}
      <Box position={[0, 0.45, 0]} args={[3, 0.05, 0.8]} castShadow><meshStandardMaterial color="#ecf0f1" /></Box>
      <Box position={[-1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>
      <Box position={[1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>

      {/* Newton's Cradle */}
      <NewtonCradle position={[-0.8, 0.475, 0]} rotation={[0, 0, 0]} onInfo={onInfo} />

      {/* Telescope */}
      <Telescope position={[0.8, 0.475, 0]} rotation={[0, 0, 0]} onInfo={onInfo} />

      {/* Brass Weights */}
      <group position={[0, 0.475, 0.1]}>
        <Cylinder position={[-0.1, 0.05, 0]} args={[0.04, 0.04, 0.1]}><meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.3} /></Cylinder>
        <Cylinder position={[0, 0.04, 0]} args={[0.03, 0.03, 0.08]}><meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.3} /></Cylinder>
        <Cylinder position={[0.1, 0.03, 0]} args={[0.02, 0.02, 0.06]}><meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.3} /></Cylinder>
      </group>
    </group>
  )
}

function Microscope({ position, rotation = [0, 0, 0], onInfo }: any) {
  const [active, setActive] = useState(false)
  const lensRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (active && lensRef.current) {
      // Bob the lens up and down to simulate focusing
      lensRef.current.position.y = 0.19 + Math.sin(state.clock.elapsedTime * 5) * 0.01
    }
    if (lightRef.current) {
      // Toggle light emission based on active state
      const material = lightRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = active ? 1.5 : 0
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={(e) => { 
      e.stopPropagation(); 
      setActive(!active);
      onInfo && onInfo(active ? 'Electron Microscope: Powered OFF.' : 'Electron Microscope: Powered ON. Scanning slide...') 
    }}>
      <Box position={[0, 0.02, 0]} args={[0.2, 0.04, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Cylinder position={[0, 0.15, -0.1]} args={[0.03, 0.04, 0.25]} rotation={[Math.PI / 8, 0, 0]}><meshStandardMaterial color="#7f8c8d" /></Cylinder>
      <Box position={[0, 0.12, 0.05]} args={[0.15, 0.02, 0.15]}><meshStandardMaterial color="#34495e" /></Box>
      <Cylinder position={[0, 0.28, -0.02]} args={[0.02, 0.02, 0.15]} rotation={[-Math.PI / 6, 0, 0]}><meshStandardMaterial color="#ecf0f1" /></Cylinder>
      
      {/* Movable Lens */}
      <Cylinder ref={lensRef} position={[0, 0.19, 0.05]} args={[0.015, 0.015, 0.08]}><meshStandardMaterial color="#ecf0f1" /></Cylinder>
      
      {/* Light Stage */}
      <Cylinder ref={lightRef} position={[0, 0.045, 0.05]} args={[0.02, 0.02, 0.01]}><meshStandardMaterial color="#ffffff" emissive="#3498db" emissiveIntensity={0} /></Cylinder>

      {/* Holographic Cellular View */}
      {active && (
        <Html transform position={[0, 0.6, 0.05]} scale={0.05}>
          <style>{`
            @keyframes panSlide {
              0% { transform: scale(1.2) translate(0, 0); }
              25% { transform: scale(1.25) translate(5px, 5px); }
              50% { transform: scale(1.3) translate(0px, 10px); }
              75% { transform: scale(1.25) translate(-5px, 5px); }
              100% { transform: scale(1.2) translate(0, 0); }
            }
            .micrograph-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              animation: panSlide 20s infinite ease-in-out;
              filter: contrast(1.1) brightness(1.1);
            }
          `}</style>
          <div style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '15px solid #2c3e50',
            backgroundColor: '#000',
            boxShadow: '0 0 50px rgba(46, 204, 113, 0.5), inset 0 0 60px rgba(0,0,0,0.8)',
            overflow: 'hidden',
            position: 'relative'
          }}>
             {/* Realistic Image */}
             <img src="/cells-micrograph.jpg" alt="Realistic Cell Micrograph" className="micrograph-image" />
             
             {/* Reticle / Crosshair */}
             <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '2px', background: 'rgba(0,0,0,0.5)' }} />
             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '100%', background: 'rgba(0,0,0,0.5)' }} />
             <div style={{ position: 'absolute', top: '50%', left: '50%', width: '40px', height: '40px', border: '2px solid rgba(0,0,0,0.5)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
             
             {/* UI Overlay */}
             <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '24px', textShadow: '0 0 5px #000, 0 0 10px #000' }}>
               1000x MAGNIFICATION
             </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function BiologyCorner({ position, rotation, onInfo }: any) {
  const glassMat = <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />

  return (
    <group position={position} rotation={rotation}>
      {/* Banner */}
      <Html transform position={[0, 1.5, -0.41]} scale={0.1}>
        <div style={{ background: '#27ae60', color: 'white', padding: '10px 30px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold', border: '4px solid #2ecc71' }}>BIOLOGY LAB</div>
      </Html>

      {/* Table */}
      <Box position={[0, 0.45, 0]} args={[3, 0.05, 0.8]} castShadow><meshStandardMaterial color="#ecf0f1" /></Box>
      <Box position={[-1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>
      <Box position={[1.4, 0.225, 0]} args={[0.05, 0.45, 0.6]} castShadow><meshStandardMaterial color="#2d3436" /></Box>

      {/* Microscope */}
      <Microscope position={[-0.8, 0.475, 0]} rotation={[0, Math.PI / 4, 0]} onInfo={onInfo} />

      {/* Centrifuge */}
      <Centrifuge position={[0.3, 0.475, -0.2]} rotation={[0, 0, 0]} onInfo={onInfo} />

      {/* Test Tube Rack */}
      <group position={[0, 0.475, -0.1]}>
        <Box position={[0, 0.02, 0]} args={[0.4, 0.04, 0.1]}><meshStandardMaterial color="#d35400" /></Box>
        <Box position={[0, 0.12, 0]} args={[0.4, 0.02, 0.1]}><meshStandardMaterial color="#d35400" /></Box>
        <Box position={[-0.18, 0.07, 0]} args={[0.02, 0.1, 0.1]}><meshStandardMaterial color="#d35400" /></Box>
        <Box position={[0.18, 0.07, 0]} args={[0.02, 0.1, 0.1]}><meshStandardMaterial color="#d35400" /></Box>

        {/* Tubes */}
        {[-0.1, 0, 0.1].map((x, i) => (
          <group key={x} position={[x, 0.08, 0]}>
            <Cylinder args={[0.015, 0.015, 0.15]}>{glassMat}</Cylinder>
            <Cylinder position={[0, -0.025, 0]} args={[0.013, 0.013, 0.1]}>
              <meshBasicMaterial color={i === 0 ? '#e74c3c' : i === 1 ? '#3498db' : '#2ecc71'} transparent opacity={0.8} />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Petri Dishes and Plant */}
      <group position={[0.8, 0.475, 0]}>
        <Cylinder position={[-0.2, 0.01, 0.1]} args={[0.05, 0.05, 0.02]}>{glassMat}</Cylinder>
        <Cylinder position={[-0.1, 0.01, 0.2]} args={[0.05, 0.05, 0.02]}>{glassMat}</Cylinder>
        {/* Plant Pot */}
        <Cylinder position={[0.1, 0.1, 0]} args={[0.08, 0.06, 0.2]}><meshStandardMaterial color="#e67e22" /></Cylinder>
        {/* Plant Leaves */}
        <Sphere position={[0.1, 0.25, 0]} args={[0.1]}><meshStandardMaterial color="#27ae60" /></Sphere>
        <Sphere position={[0.05, 0.22, 0.05]} args={[0.08]}><meshStandardMaterial color="#2ecc71" /></Sphere>
        <Sphere position={[0.15, 0.22, -0.05]} args={[0.08]}><meshStandardMaterial color="#2ecc71" /></Sphere>
      </group>
    </group>
  )
}

function Portal({ position, rotation=[0,0,0], label, color, onClick }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick() }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
      </Box>
      <Html transform position={[0, 2.8, 0]} scale={0.1}>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.8)', padding: '5px 10px', border: `2px solid ${color}`, borderRadius: '5px', fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {label}
        </div>
      </Html>
    </group>
  )
}


function NewtonCradle({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("Newton's Cradle: Demonstrates conservation of momentum and energy.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, -0.05, 0]} args={[0.3, 0.05, 0.2]}><meshStandardMaterial color="#2c3e50" /></Box>
      <Cylinder position={[-0.1, 0.1, -0.08]} args={[0.01, 0.01, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[0.1, 0.1, -0.08]} args={[0.01, 0.01, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[-0.1, 0.1, 0.08]} args={[0.01, 0.01, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[0.1, 0.1, 0.08]} args={[0.01, 0.01, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[0, 0.25, -0.08]} args={[0.01, 0.01, 0.2]} rotation={[0, 0, Math.PI/2]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Cylinder position={[0, 0.25, 0.08]} args={[0.01, 0.01, 0.2]} rotation={[0, 0, Math.PI/2]}><meshStandardMaterial color="#bdc3c7" /></Cylinder>
      <Sphere position={[-0.08, 0.05, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#ecf0f1" metalness={1} roughness={0.1} /></Sphere>
      <Sphere position={[-0.04, 0.05, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#ecf0f1" metalness={1} roughness={0.1} /></Sphere>
      <Sphere position={[0, 0.05, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#ecf0f1" metalness={1} roughness={0.1} /></Sphere>
      <Sphere position={[0.04, 0.05, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#ecf0f1" metalness={1} roughness={0.1} /></Sphere>
      <Sphere position={[0.08, 0.05, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#ecf0f1" metalness={1} roughness={0.1} /></Sphere>
    </group>
  )
}

function Centrifuge({ position, rotation = [0, 0, 0], onInfo }: any) {
  const [active, setActive] = useState(false)
  const rotorRef = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (active && rotorRef.current) rotorRef.current.rotation.y += 0.5
  })
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); setActive(!active); onInfo && onInfo('Centrifuge: Used to separate fluids of different densities.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Cylinder position={[0, 0.1, 0]} args={[0.15, 0.15, 0.2]}><meshStandardMaterial color="#ecf0f1" /></Cylinder>
      <Cylinder ref={rotorRef} position={[0, 0.2, 0]} args={[0.1, 0.1, 0.05]}><meshStandardMaterial color="#34495e" /></Cylinder>
    </group>
  )
}

function Whiteboard({ position, rotation=[0,0,0], setAssistantMessage, level, setLevel }: any) {

  const toggleMission = (e: any) => {
    e.stopPropagation()
    const next = (level + 1) % 3
    setLevel(next)
    
    if (setAssistantMessage) {
      if (next === 1) {
        setAssistantMessage("Level 1: The Salty Pond. Grandmother Rokeya says: 'We need scientists who understand us.' 🧪 Walk over to the Chemistry Lab portal on the right to begin.")
      } else if (next === 2) {
        setAssistantMessage("Level 2: The Mystery Tube-Well. Rafiq's uncle drank clear water and got sick. 💧 Check the Biology Lab portal on the right.")
      } else {
        setAssistantMessage("Mission paused. Free roam mode active.")
      }
    }
  }

  return (
    <group position={position} rotation={rotation} onClick={toggleMission} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 3, 0.05]} />
        {/* Changed to BasicMaterial to ensure visibility regardless of lighting */}
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, -0.05]} receiveShadow castShadow>
        <boxGeometry args={[8.2, 3.2, 0.05]} />
        <meshBasicMaterial color="#2c3e50" />
      </mesh>
      
      {/* Scribbles */}
      <Html transform position={[0, 0, 0.03]} scale={0.15}>
        <div style={{ width: '1200px', height: '450px', fontSize: '32px', fontFamily: 'sans-serif', color: '#2c3e50', padding: '40px', position: 'relative', pointerEvents: 'none' }}>
          {level === 1 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#e67e22', fontSize: '32px' }}>LEVEL 1: THE SALTY POND</h3>
              <p style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '10px' }}>"Our ponds are flooded with seawater. We need a way to drink." - Grandmother Rokeya</p>
              <div style={{ background: 'rgba(0,0,0,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #e67e22' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>SUCCESS CRITERIA:</p>
                <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '20px', lineHeight: '1.4' }}>
                  <li>Navigate to the <strong>Chemistry Lab</strong>.</li>
                  <li>Locate and activate the <strong>Solar Still</strong>.</li>
                  <li>Analyze how evaporation separates pure water from salt.</li>
                </ul>
              </div>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                NEXT LEVEL
              </button>
            </div>
          ) : level === 2 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#3498db', fontSize: '32px' }}>LEVEL 2: THE MYSTERY TUBE-WELL</h3>
              <p style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '10px' }}>"Rafiq's uncle drank clear water and fell ill. Clarity isn't purity."</p>
              <div style={{ background: 'rgba(0,0,0,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>SUCCESS CRITERIA:</p>
                <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '20px', lineHeight: '1.4' }}>
                  <li>Navigate to the <strong>Biology Lab</strong>.</li>
                  <li>Inspect the <strong>3-Pitcher Filter</strong> on the table.</li>
                  <li>Understand the multi-layer biological filtration process.</li>
                </ul>
              </div>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                ABORT MISSION
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ marginTop: 0, color: '#2980b9', fontSize: '32px' }}>Operation Nodi: The Last Clean Drop</h3>
              <p><strong>Status:</strong> Pending &nbsp;|&nbsp; <strong>Location:</strong> Shyamnagar, Satkhira (2040)</p>
              <p><strong>Objective:</strong> A cyclone has pushed salt water into ponds. We need scientists who understand us. Will you be one?</p>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                ENTER MISSION
              </button>
            </div>
          )}
        </div>
      </Html>

      {/* Floating Click Indicator when pending */}
      <ClickIndicator position={[0, 1.2, 0.1]} />
    </group>
  )
}



function WaterFilter({ position, onInfo }: any) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('3-Pitcher Water Filter: Traditional filtration method.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Cylinder position={[0, 0.1, 0]} args={[0.08, 0.1, 0.2]}><meshStandardMaterial color="#e67e22" /></Cylinder>
      <Cylinder position={[0, 0.3, 0]} args={[0.08, 0.1, 0.2]}><meshStandardMaterial color="#d35400" /></Cylinder>
      <Cylinder position={[0, 0.5, 0]} args={[0.08, 0.1, 0.2]}><meshStandardMaterial color="#e67e22" /></Cylinder>
    </group>
  )
}

function BunsenBurner({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Bunsen Burner: Used for heating.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Cylinder position={[0, 0.05, 0]} args={[0.05, 0.05, 0.1]}><meshStandardMaterial color="#7f8c8d" /></Cylinder>
      <Cylinder position={[0, 0.15, 0]} args={[0.02, 0.02, 0.2]}><meshStandardMaterial color="#95a5a6" /></Cylinder>
    </group>
  )
}

function Multimeter({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Multimeter: Measures voltage, current, and resistance.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, 0.05, 0]} args={[0.1, 0.02, 0.2]}><meshStandardMaterial color="#f1c40f" /></Box>
      <Box position={[0, 0.06, 0.05]} args={[0.08, 0.01, 0.08]}><meshStandardMaterial color="#2c3e50" /></Box>
    </group>
  )
}

function ServerRack({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 1.25, 0]} args={[0.8, 2.5, 1]}><meshStandardMaterial color="#1e272e" /></Box>
      <Box position={[0, 1.25, 0.51]} args={[0.7, 2.4, 0.01]}><meshStandardMaterial color="#485460" /></Box>
      {Array.from({ length: 10 }).map((_, i) => (
        <Sphere key={i} position={[-0.2 + Math.random()*0.4, 0.2 + i*0.2, 0.52]} args={[0.01]}>
          <meshBasicMaterial color={Math.random() > 0.5 ? '#2ecc71' : '#3498db'} />
        </Sphere>
      ))}
    </group>
  )
}

function ClickIndicator({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05
  })
  return (
    <group ref={ref} position={position}>
      <Html transform center scale={0.06}>
        <div style={{ background: '#f1c40f', color: '#2c3e50', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', border: '2px solid #f39c12' }}>
          👇 CLICK HERE
        </div>
      </Html>
    </group>
  )
}

function SolarStill({ position, rotation = [0, 0, 0], onInfo }: any) {
  const [stage, setStage] = useState(0)

  const handleClick = (e: any) => {
    e.stopPropagation()
    const nextStage = (stage + 1) % 4
    setStage(nextStage)
    
    if (onInfo) {
      if (nextStage === 0) onInfo("Solar Still (Empty): A basic distillation setup. Click to add salty pond water.")
      else if (nextStage === 1) onInfo("Solar Still (Filled): Salty water added. Click to cover with clear plastic.")
      else if (nextStage === 2) onInfo("Solar Still (Covered): The sun heats the water. Only H2O evaporates, leaving salt. Click to wait.")
      else if (nextStage === 3) onInfo("Solar Still (Complete): Pure water condensed! Test shows conductivity near zero. Safe to drink.")
    }
  }

  return (
    <group position={position} rotation={rotation} onClick={handleClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
      <Cylinder position={[0, 0.08, 0]} args={[0.2, 0.15, 0.16, 32]}><meshStandardMaterial color="#d35400" roughness={0.9} /></Cylinder>
      {stage > 0 && (<Cylinder position={[0, 0.10, 0]} args={[0.18, 0.16, 0.08, 32]}><meshPhysicalMaterial color="#3498db" transmission={0.6} opacity={0.8} transparent roughness={0.2} /></Cylinder>)}
      <Cylinder position={[0, 0.08, 0]} args={[0.04, 0.03, 0.14, 16]}><meshStandardMaterial color="#bdc3c7" roughness={0.4} /></Cylinder>
      {stage === 3 && (<Cylinder position={[0, 0.11, 0]} args={[0.035, 0.025, 0.08, 16]}><meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.9} transparent roughness={0.1} /></Cylinder>)}
      {stage >= 2 && (
        <group position={[0, 0.22, 0]}>
          <Cone args={[0.21, 0.15, 32]} rotation={[Math.PI, 0, 0]}>
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.3} transparent roughness={0.1} />
          </Cone>
          <Sphere position={[0, -0.06, 0]} args={[0.02, 16, 16]}><meshStandardMaterial color="#7f8c8d" /></Sphere>
        </group>
      )}
      <Html transform position={[0, 0.4, 0]} scale={0.05}>
        <div style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 12px', borderRadius: '4px', whiteSpace: 'nowrap', pointerEvents: 'none', border: '1px solid #e74c3c', textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px', color: '#f1c40f' }}>Level 1: Solar Still</div>
          <div style={{ fontSize: '10px', color: '#ecf0f1' }}>
            {stage === 0 ? "Empty. Click to add salty water." : stage === 1 ? "Salty water. Click to cover." : stage === 2 ? "Covered. Click to condense." : "Pure water collected! Click to reset."}
          </div>
        </div>
      </Html>
    </group>
  )
}

function StandardRoom({ color, children, onExit }: any) {
  const glassMat = <meshPhysicalMaterial color="#ffffff" transmission={0.95} opacity={1} transparent roughness={0.05} />
  const frameMat = <meshStandardMaterial color="#0f0f0f" metalness={0.9} roughness={0.2} />
  const floorMat = <meshStandardMaterial color="#111111" roughness={0.15} metalness={0.7} />
  const concreteMat = <meshStandardMaterial color="#8b4513" roughness={0.9} /> // Modern brick-like hue

  // Create architectural mullions for the glass wall
  const mullions = []
  for (let i = -7.5; i <= 7.5; i += 2.5) {
    mullions.push(<Box key={`mz-${i}`} position={[i, 1.6, -5]} args={[0.08, 3.2, 0.08]}>{frameMat}</Box>)
    mullions.push(<Box key={`mf-${i}`} position={[i, 1.6, 5]} args={[0.08, 3.2, 0.08]}>{frameMat}</Box>)
  }

  return (
    <>
      {/* Crisp, clear wildlife environment outside */}
      <Environment preset="forest" background blur={0} />
      {/* Modern Studio Lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[5, 10, -5]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" distance={15} />

      {/* Floating Ceiling */}
      <Box position={[0, 3.25, 0]} args={[15, 0.1, 10]} receiveShadow>{concreteMat}</Box>
      
      {/* Neon Edge Light on ceiling */}
      <Box position={[0, 3.19, 0]} args={[14.8, 0.02, 9.8]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </Box>

      {/* High-gloss dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 10]} />
        {floorMat}
      </mesh>
      
      {/* Baseboard Neon Light */}
      <Box position={[0, 0.01, 0]} args={[14.9, 0.02, 9.9]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </Box>
      
      {/* Solid Side Walls (Brutalist Concrete) */}
      <Box position={[-7.5, 1.6, 0]} args={[0.2, 3.2, 10]} receiveShadow>{concreteMat}</Box>
      <Box position={[7.5, 1.6, 0]} args={[0.2, 3.2, 10]} receiveShadow>{concreteMat}</Box>
      
      {/* Glass Front & Back Walls */}
      <Box position={[0, 1.6, -5]} args={[15, 3.2, 0.05]} receiveShadow>{glassMat}</Box>
      <Box position={[0, 1.6, 5]} args={[15, 3.2, 0.05]} receiveShadow>{glassMat}</Box>
      
      {/* Frames & Mullions */}
      <Box position={[0, 0.05, -5]} args={[15, 0.1, 0.1]}>{frameMat}</Box>
      <Box position={[0, 3.15, -5]} args={[15, 0.1, 0.1]}>{frameMat}</Box>
      <Box position={[0, 0.05, 5]} args={[15, 0.1, 0.1]}>{frameMat}</Box>
      <Box position={[0, 3.15, 5]} args={[15, 0.1, 0.1]}>{frameMat}</Box>
      {mullions}

      {/* Exit Door */}
      {onExit && <Portal position={[0, 0, 4.8]} rotation={[0, Math.PI, 0]} label="Back to Hub" color="#e74c3c" onClick={onExit} />}
      
      {children}
    </>
  )
}

function CameraResetter({ room }: any) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.6, 2)
    camera.rotation.set(0, 0, 0)
    camera.lookAt(0, 1.6, -5)
  }, [room])
  return null
}


function CretaNPC({ position, rotation = [0, 0, 0], level, setLevel, setAssistantMessage }: any) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      // Hover effect
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      // Slowly rotate toward player slightly
    }
  })

  const handleTalk = (e: any) => {
    e.stopPropagation()
    const next = (level + 1) % 3
    setLevel(next)
    
    if (setAssistantMessage) {
      if (next === 1) {
        setAssistantMessage("Creta: 'Hello Scientist. Level 1 activated. Our priority is the Salty Pond. Head to the Chemistry lab.'")
      } else if (next === 2) {
        setAssistantMessage("Creta: 'Level 2 ready. The Tube-Well is contaminated. Please go to the Biology Lab for filtration analysis.'")
      } else {
        setAssistantMessage("Creta: 'Standing by. Take your time exploring the hub. I am here if you need mission briefings.'")
      }
    }
  }

  return (
    <group position={position} rotation={rotation} ref={ref} onClick={handleTalk} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {/* Head */}
      <Sphere args={[0.25, 32, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#ecf0f1" metalness={0.5} roughness={0.2} />
      </Sphere>
      {/* Glowing Eye Visor */}
      <Box args={[0.3, 0.1, 0.2]} position={[0, 1.6, 0.15]}>
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      </Box>
      {/* Body */}
      <Cylinder args={[0.15, 0.25, 0.7]} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </Cylinder>
      {/* Hover Base */}
      <Cone args={[0.25, 0.3, 16]} position={[0, 0.55, 0]} rotation={[Math.PI, 0, 0]}>
         <meshStandardMaterial color="#34495e" metalness={0.8} />
      </Cone>
      {/* Energy Ring */}
      <TorusKnot args={[0.4, 0.01, 64, 8, 2, 3]} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={1} />
      </TorusKnot>

      <Html transform position={[0, 2.1, 0]} scale={0.08}>
        <div style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #00ffcc' }}>CRETA (AI Guide)</div>
      </Html>
    </group>
  )
}

function MissionArrow({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.15
      ref.current.rotation.y += 0.05
    }
  })
  return (
    <group position={position} ref={ref}>
      <Cone args={[0.2, 0.5, 16]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
      </Cone>
      <pointLight distance={3} intensity={1.5} color="#ff0055" />
    </group>
  )
}

function HexagonLogo() {
  const texture = useTexture('/hexagon-logo.png')
  return (
    <group position={[0, 1.4, 0]}>
      {/* 2D Plane showing the exact logo */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} transparent opacity={1} side={2} />
      </mesh>
      
      {/* Glowing Neon Outline framing the logo */}
      <Cylinder args={[0.85, 0.85, 0.05, 6]} position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.8} />
      </Cylinder>
    </group>
  )
}

function HubRoom({ setCurrentRoom, onInfo, level, setLevel }: any) {
  let arrowPos: [number, number, number] | null = null;
  if (level === 0) arrowPos = [-6, 3, -3.5]; // Over Creta
  if (level === 1) arrowPos = [6.5, 2.5, -1.75]; // Over Chem Portal
  if (level === 2) arrowPos = [6.5, 2.5, 0]; // Over Bio Portal

  return (
    <StandardRoom color="#f5f6fa">
      {/* Front glass wall looks out into wildlife (forest environment) */}
      
      {/* Portals moved to the RIGHT wall (x = 7.4), facing left */}
      <Portal position={[7.4, 0, -3.5]} rotation={[0, -Math.PI/2, 0]} label="Physics Lab" color="#3498db" onClick={() => setCurrentRoom('physics')} />
      <Portal position={[7.4, 0, -1.75]} rotation={[0, -Math.PI/2, 0]} label="Chemistry" color="#e67e22" onClick={() => setCurrentRoom('chemistry')} />
      <Portal position={[7.4, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="Biology Lab" color="#2ecc71" onClick={() => setCurrentRoom('biology')} />
      <Portal position={[7.4, 0, 1.75]} rotation={[0, -Math.PI/2, 0]} label="Math Lab" color="#9b59b6" onClick={() => setCurrentRoom('math')} />
      <Portal position={[7.4, 0, 3.5]} rotation={[0, -Math.PI/2, 0]} label="AI Lab" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />
      {arrowPos && <MissionArrow position={arrowPos} />}
      
      {/* Info elements on the left wall */}
      <Whiteboard position={[-7.2, 1.6, 0]} rotation={[0, Math.PI/2, 0]} setAssistantMessage={onInfo} level={level} setLevel={setLevel} />
      <CretaNPC position={[-6, 0, -3.5]} rotation={[0, Math.PI/4, 0]} level={level} setLevel={setLevel} setAssistantMessage={onInfo} />
      
      {/* Premium Centerpiece: NodeLab Hexagon */}
      <group position={[0, 0, -1]}>
        <Cylinder args={[1.5, 1.5, 0.1, 64]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
        </Cylinder>
        <Cylinder args={[1.4, 1.4, 0.12, 64]} position={[0, 0.06, 0]}>
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.2} />
        </Cylinder>
        
        <Suspense fallback={null}>
          <HexagonLogo />
        </Suspense>
        
        <pointLight distance={8} intensity={1.5} color="#00ffcc" position={[0, 1.4, 0]} />
      </group>
    </StandardRoom>
  )
}

function ChemistryRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Chemistry Lab" color="#e67e22" onExit={() => setCurrentRoom('hub')}>
      <ChemistryCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
      <CrystalLattice position={[-4.5, 1.5, -2]} onInfo={onInfo} />
      <WaterFilter position={[-0.5, 0.925, -1.8]} onInfo={onInfo} />
      <BunsenBurner position={[-1.5, 0.925, -1.5]} rotation={[0, 0, 0]} onInfo={onInfo} />
      
      <group position={[0, 0, -1.8]}>
        <Box position={[0, 0.9, 0]} args={[4, 0.05, 1.2]} receiveShadow castShadow><meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} /></Box>
        <Box position={[-1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[-1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
      </group>
    </StandardRoom>
  )
}

function PhysicsRoom({ setCurrentRoom, onInfo, currentVal }: any) {
  return (
    <StandardRoom title="Physics Lab" color="#3498db" onExit={() => setCurrentRoom('hub')}>
      <PhysicsCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
      <QuantumAtom position={[-4.5, 1.5, -2]} onInfo={onInfo} />
      <Oscilloscope position={[1.2, 0.925, -1.8]} rotation={[0, -Math.PI / 8, 0]} currentVal={currentVal} onInfo={onInfo} />
      <PowerSupply position={[1.6, 0.925, -1.8]} rotation={[0, -Math.PI / 6, 0]} onInfo={onInfo} />
      <Multimeter position={[0.7, 0.925, -1.6]} rotation={[0, -Math.PI/4, 0]} onInfo={onInfo} />
      
      <group position={[0, 0, -1.8]}>
        <Box position={[0, 0.9, 0]} args={[4, 0.05, 1.2]} receiveShadow castShadow><meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} /></Box>
        <Box position={[-1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[-1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
      </group>
    </StandardRoom>
  )
}

// --- BIOLOGY LAB EQUIPMENT ---
function Terrarium({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Terrarium: Simulating a closed ecosystem with native Sundarbans mangrove plants.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {/* Base */}
      <Box position={[0, 0.05, 0]} args={[0.8, 0.1, 0.5]}><meshStandardMaterial color="#2d3436" /></Box>
      {/* Glass Case */}
      <Box position={[0, 0.4, 0]} args={[0.75, 0.6, 0.45]}>
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
      </Box>
      {/* Soil */}
      <Box position={[0, 0.15, 0]} args={[0.7, 0.1, 0.4]}><meshStandardMaterial color="#5D4037" roughness={1} /></Box>
      {/* Plants */}
      <Cylinder position={[-0.2, 0.3, 0]} args={[0.02, 0.02, 0.3]}><meshStandardMaterial color="#27ae60" /></Cylinder>
      <Sphere position={[-0.2, 0.45, 0]} args={[0.1]}><meshStandardMaterial color="#2ecc71" /></Sphere>
      
      <Cylinder position={[0.2, 0.25, 0.1]} args={[0.015, 0.015, 0.2]}><meshStandardMaterial color="#27ae60" /></Cylinder>
      <Sphere position={[0.2, 0.35, 0.1]} args={[0.08]}><meshStandardMaterial color="#2ecc71" /></Sphere>
      
      <ClickIndicator position={[0, 0.8, 0]} />
    </group>
  )
}



// --- MATH LAB EQUIPMENT ---
function Chalkboard({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 1.5, 0]} args={[6, 2.5, 0.1]}><meshStandardMaterial color="#27ae60" roughness={0.9} /></Box>
      <Box position={[0, 1.5, -0.02]} args={[6.1, 2.6, 0.1]}><meshStandardMaterial color="#8e44ad" /></Box>
      
      <Html transform position={[0, 1.5, 0.06]} scale={0.1}>
        <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '30px', width: '500px' }}>
          <h3>River Flow Dynamics</h3>
          <p>Q = v * A</p>
          <p>Where:<br/>Q = Discharge (m³/s)<br/>v = Velocity (m/s)<br/>A = Cross-sectional Area (m²)</p>
          <hr/>
          <p>Calculate flood risk delta for Shyamnagar embankments given Q_max = 1500.</p>
        </div>
      </Html>
    </group>
  )
}

function GeometricShapes({ position }: any) {
  return (
    <group position={position}>
      <Box position={[-0.5, 0.2, 0]} args={[0.3, 0.3, 0.3]} rotation={[0.5, 0.5, 0]}><meshStandardMaterial color="#e74c3c" wireframe /></Box>
      <Sphere position={[0.5, 0.2, 0]} args={[0.2, 16, 16]}><meshStandardMaterial color="#3498db" wireframe /></Sphere>
      <Cylinder position={[0, 0.2, 0.4]} args={[0, 0.2, 0.4, 4]} rotation={[0.2, 0, 0.1]}><meshStandardMaterial color="#f1c40f" wireframe /></Cylinder>
    </group>
  )
}

// --- AI LAB EQUIPMENT ---
function HolographicTerminal({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Console Base */}
      <Box position={[0, 0.5, 0]} args={[1.5, 1, 0.8]}><meshStandardMaterial color="#2d3436" metalness={0.8} /></Box>
      <Box position={[0, 1.05, 0.2]} args={[1.2, 0.05, 0.4]} rotation={[0.2, 0, 0]}><meshStandardMaterial color="#111" /></Box>
      
      {/* Floating Holographic Screen */}
      <group position={[0, 1.8, -0.2]}>
        <Box args={[2, 1.2, 0.02]}><meshStandardMaterial color="#0984e3" emissive="#0984e3" emissiveIntensity={0.5} transparent opacity={0.6} /></Box>
        <Html transform position={[0, 0, 0.02]} scale={0.08}>
          <div style={{ color: '#00cec9', fontFamily: 'monospace', fontSize: '18px', width: '220px', background: 'rgba(0,0,0,0.5)', padding: '10px', border: '1px solid #00cec9', borderRadius: '5px' }}>
            <div style={{ animation: 'pulse-btn 2s infinite' }}>[ TRAINING NEURAL NET ]</div>
            <br/>
            Epoch: 4502 / 5000<br/>
            Loss: 0.0021<br/>
            <br/>
            Optimizing crop yield predictions for high-salinity soil...
            <br/><br/>
            Status: 89% Complete
          </div>
        </Html>
      </group>
    </group>
  )
}

function BiologyRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Biology Lab" color="#2ecc71" onExit={() => setCurrentRoom('hub')}>
      <BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
      <HumanAnatomy position={[-4.5, 0, -2]} onInfo={onInfo} />
      
      {/* Central Table */}
      <group position={[0, 0, -1.8]}>
        <Box position={[0, 0.9, 0]} args={[4, 0.05, 1.2]} receiveShadow castShadow><meshStandardMaterial color="#ffffff" roughness={0.3} /></Box>
        <Box position={[-1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, -0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[-1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.9, 0.45, 0.5]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
      </group>

      <Terrarium position={[-1, 0.925, -1.8]} onInfo={onInfo} />
      <Microscope position={[1, 0.925, -1.8]} rotation={[0, -Math.PI/4, 0]} onInfo={onInfo} />
    </StandardRoom>
  )
}

function MathRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Mathematics Lab" color="#9b59b6" onExit={() => setCurrentRoom('hub')}>
      <Chalkboard position={[0, 0, -4.8]} />
      <MathTorus position={[-4.5, 2, -2]} onInfo={onInfo} />
      
      {/* Central Table */}
      <group position={[0, 0, -1.5]}>
        <Box position={[0, 0.9, 0]} args={[3, 0.05, 1]} receiveShadow castShadow><meshStandardMaterial color="#ffffff" roughness={0.3} /></Box>
        <Box position={[-1.4, 0.45, -0.4]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.4, 0.45, -0.4]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[-1.4, 0.45, 0.4]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
        <Box position={[1.4, 0.45, 0.4]} args={[0.05, 0.9, 0.05]}><meshStandardMaterial color="#2d3436" /></Box>
      </group>

      <GeometricShapes position={[0, 0.925, -1.5]} />
    </StandardRoom>
  )
}

function AIRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="AI Lab" color="#f1c40f" onExit={() => setCurrentRoom('hub')}>
      {/* Server Farm Aisle */}
      <AIBrain position={[-4.5, 2, -2]} onInfo={onInfo} />
      <ServerRack position={[-3, 0, -3]} />
      <ServerRack position={[-1.5, 0, -3]} />
      <ServerRack position={[0, 0, -3]} />
      <ServerRack position={[1.5, 0, -3]} />
      <ServerRack position={[3, 0, -3]} />

      <ServerRack position={[-3, 0, 2]} rotation={[0, Math.PI, 0]} />
      <ServerRack position={[-1.5, 0, 2]} rotation={[0, Math.PI, 0]} />
      <ServerRack position={[1.5, 0, 2]} rotation={[0, Math.PI, 0]} />
      <ServerRack position={[3, 0, 2]} rotation={[0, Math.PI, 0]} />

      <HolographicTerminal position={[0, 0, 0]} />
    </StandardRoom>
  )
}


// --- WONDERS OF SCIENCE COMPONENTS ---

function HumanAnatomy({ position, rotation = [0, 0, 0], onInfo }: any) {
  const [active, setActive] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (active && groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position} rotation={rotation} ref={groupRef} onClick={(e) => { e.stopPropagation(); setActive(!active); onInfo && onInfo("Human Anatomy Hologram: Select glowing organs to go deeper. Heart (Cardiovascular), Brain (Nervous System), Lungs (Respiratory).") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {/* Base */}
      <Cylinder args={[1, 1, 0.2, 32]} position={[0, 0.1, 0]}><meshStandardMaterial color="#2c3e50" /></Cylinder>
      
      {/* Hologram Body (Stylized) */}
      <group position={[0, 1.8, 0]}>
        {/* Torso */}
        <Box args={[0.8, 1.2, 0.4]} position={[0, 0, 0]}><meshPhysicalMaterial color="#3498db" transmission={0.8} transparent opacity={0.6} roughness={0.1} /></Box>
        {/* Head */}
        <Sphere args={[0.3, 16, 16]} position={[0, 0.9, 0]}><meshPhysicalMaterial color="#3498db" transmission={0.8} transparent opacity={0.6} roughness={0.1} /></Sphere>
        {/* Legs */}
        <Cylinder args={[0.15, 0.15, 1.2]} position={[-0.2, -1.2, 0]}><meshPhysicalMaterial color="#3498db" transmission={0.8} transparent opacity={0.6} /></Cylinder>
        <Cylinder args={[0.15, 0.15, 1.2]} position={[0.2, -1.2, 0]}><meshPhysicalMaterial color="#3498db" transmission={0.8} transparent opacity={0.6} /></Cylinder>
        
        {/* Glowing Organs */}
        {/* Brain */}
        <Sphere args={[0.15, 16, 16]} position={[0, 0.9, 0]} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("The Human Brain: Contains 86 billion neurons. Responsible for all thought, memory, and emotion.") }}>
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} />
        </Sphere>
        {/* Heart */}
        <Sphere args={[0.1, 16, 16]} position={[-0.15, 0.2, 0.1]} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("The Human Heart: Pumps about 2,000 gallons of blood every day through 60,000 miles of blood vessels.") }}>
          <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={2} />
        </Sphere>
        {/* Lungs */}
        <Box args={[0.2, 0.3, 0.1]} position={[0.2, 0.2, 0]} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("The Lungs: The surface area of the lungs is roughly the same size as a tennis court!") }}>
          <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={2} />
        </Box>
      </group>
      
      <Html transform position={[0, 3.8, 0]} scale={0.08}>
        <div style={{ color: '#3498db', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #3498db' }}>Human Body Explorer</div>
      </Html>
    </group>
  )
}

function QuantumAtom({ position, rotation = [0, 0, 0], onInfo }: any) {
  const groupRef = useRef<THREE.Group>(null)
  const ring1 = useRef<THREE.Group>(null)
  const ring2 = useRef<THREE.Group>(null)
  const ring3 = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ring1.current) ring1.current.rotation.x += 0.02
    if (ring2.current) ring2.current.rotation.y += 0.02
    if (ring3.current) ring3.current.rotation.z += 0.02
  })

  return (
    <group position={position} rotation={rotation} ref={groupRef} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("Quantum Atom: The foundation of physics. Protons and neutrons in the center, surrounded by a cloud of probability where electrons exist.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {/* Nucleus */}
      <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={1} />
      </Sphere>
      {/* Electron Rings */}
      <group ref={ring1}>
        <TorusKnot args={[0.8, 0.02, 64, 8, 1, 0]}><meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} /></TorusKnot>
        <Sphere args={[0.1]} position={[0.8, 0, 0]}><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} /></Sphere>
      </group>
      <group ref={ring2} rotation={[Math.PI/3, 0, 0]}>
        <TorusKnot args={[1.2, 0.02, 64, 8, 1, 0]}><meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} /></TorusKnot>
        <Sphere args={[0.1]} position={[1.2, 0, 0]}><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} /></Sphere>
      </group>
      <group ref={ring3} rotation={[0, Math.PI/3, 0]}>
        <TorusKnot args={[1.6, 0.02, 64, 8, 1, 0]}><meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} /></TorusKnot>
        <Sphere args={[0.1]} position={[1.6, 0, 0]}><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} /></Sphere>
      </group>
      <Html transform position={[0, 2.5, 0]} scale={0.08}>
        <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #e74c3c' }}>Quantum Atom Model</div>
      </Html>
    </group>
  )
}

function MathTorus({ position, rotation = [0, 0, 0], onInfo }: any) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.015
    }
  })
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("Torus Knot: A continuous mathematical curve wrapped around a torus. It demonstrates complex topology and continuous surfaces.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <TorusKnot ref={ref} args={[1, 0.3, 128, 16]}>
        <meshStandardMaterial color="#9b59b6" metalness={0.8} roughness={0.1} wireframe />
      </TorusKnot>
      <Html transform position={[0, 2, 0]} scale={0.08}>
        <div style={{ color: '#9b59b6', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #9b59b6' }}>Topological Torus Knot</div>
      </Html>
    </group>
  )
}

function AIBrain({ position, rotation = [0, 0, 0], onInfo }: any) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      ref.current.scale.set(s, s, s)
    }
  })
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("AGI Neural Core: Simulates billions of artificial synapses processing parallel information in real-time.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Icosahedron ref={ref} args={[1.5, 2]}>
        <meshStandardMaterial color="#00ffcc" wireframe emissive="#00ffcc" emissiveIntensity={0.5} />
      </Icosahedron>
      {/* Inner core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </Sphere>
      <Html transform position={[0, 2.5, 0]} scale={0.08}>
        <div style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #00ffcc' }}>AGI Neural Core</div>
      </Html>
    </group>
  )
}

function CrystalLattice({ position, rotation = [0, 0, 0], onInfo }: any) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005
      ref.current.rotation.x += 0.005
    }
  })
  
  // Create a 2x2x2 grid for simplicity
  const nodes = []
  const offset = 0.8
  for(let x=-1; x<=1; x+=2) {
    for(let y=-1; y<=1; y+=2) {
      for(let z=-1; z<=1; z+=2) {
        nodes.push([x*offset, y*offset, z*offset])
      }
    }
  }

  return (
    <group position={position} rotation={rotation} ref={ref} onClick={(e) => { e.stopPropagation(); onInfo && onInfo("Molecular Crystal Lattice: Demonstrates strong covalent bonding structures found in diamonds and other advanced materials.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {nodes.map((pos, i) => (
        <Sphere key={i} args={[0.15, 16, 16]} position={pos as any}>
          <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={1} />
        </Sphere>
      ))}
      <Box args={[offset*2, 0.05, 0.05]} position={[0, offset, offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[offset*2, 0.05, 0.05]} position={[0, -offset, offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[offset*2, 0.05, 0.05]} position={[0, offset, -offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[offset*2, 0.05, 0.05]} position={[0, -offset, -offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      
      <Box args={[0.05, offset*2, 0.05]} position={[offset, 0, offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, offset*2, 0.05]} position={[-offset, 0, offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, offset*2, 0.05]} position={[offset, 0, -offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, offset*2, 0.05]} position={[-offset, 0, -offset]}><meshStandardMaterial color="#bdc3c7" /></Box>
      
      <Box args={[0.05, 0.05, offset*2]} position={[offset, offset, 0]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, 0.05, offset*2]} position={[-offset, offset, 0]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, 0.05, offset*2]} position={[offset, -offset, 0]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Box args={[0.05, 0.05, offset*2]} position={[-offset, -offset, 0]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Html transform position={[0, 2.5, 0]} scale={0.08}>
        <div style={{ color: '#3498db', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #3498db' }}>Covalent Crystal Lattice</div>
      </Html>
    </group>
  )
}
function App() {
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(0)
  const [currentRoom, setCurrentRoom] = useState('hub')
  const [assistantMessage, setAssistantMessage] = useState("Welcome to the Universal Synthesis Lab. All linear tutorials have been disabled. You are free to interact with any physics, electrical, or chemistry experiments on the tables. Click on any equipment to learn more about it.")

  
  
  

  const [testedValues, setTestedValues] = useState<number[]>([])
    const [wireConnected] = useState(false)
  const [switchOn] = useState(false)
  const [resistance] = useState(10)
  const current = wireConnected && switchOn ? 1.5 / resistance : 0
  
  const voltage = 1.5
  

  

  const [isMobile] = useState(() => ('ontouchstart' in window) || navigator.maxTouchPoints > 0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Track tested values for the graph even in sandbox mode
  useEffect(() => {
    if (wireConnected && switchOn && !testedValues.includes(resistance)) {
      playSound('success')
      setTestedValues(prev => [...prev, resistance])
    }
  }, [resistance, wireConnected, switchOn, testedValues])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e))
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
    }
  }

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, -9], fov: 60 }}>
        <PointerLockControls />
        <Player />

        
        <CameraResetter room={currentRoom} />
        {currentRoom === 'hub' && <HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} level={level} setLevel={setLevel} />}
        {currentRoom === 'chemistry' && <ChemistryRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={current} />}
        {currentRoom === 'physics' && <PhysicsRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={current} />}
        {currentRoom === 'biology' && <BiologyRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
        {currentRoom === 'math' && <MathRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
        {currentRoom === 'ai' && <AIRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}


        {isMobile && <MobileControls />}
      </Canvas>

      {/* Quest Tracker */}
      {started && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid #f39c12', color: 'white', fontFamily: 'sans-serif', maxWidth: '300px', zIndex: 10 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f39c12', textTransform: 'uppercase' }}>Current Objective</h3>
          {level === 0 ? <p style={{ margin: 0, fontSize: '18px' }}>Speak to CRETA or check the Whiteboard in the Hub to get your mission.</p> : null}
          {level === 1 ? <p style={{ margin: 0, fontSize: '18px' }}><strong>Level 1: The Salty Pond</strong><br/><br/>Go to the Chemistry Lab and use the Solar Still Experiment.</p> : null}
          {level === 2 ? <p style={{ margin: 0, fontSize: '18px' }}><strong>Level 2: The Mystery Tube-Well</strong><br/><br/>Go to the Biology Lab and inspect the Water Filter.</p> : null}
        </div>
      )}

      {/* Welcome Screen */}
      {!started && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ffffff', fontSize: '48px', marginBottom: '10px', letterSpacing: '8px', fontWeight: '300' }}>NODELAB</h1>
          <h2 style={{ color: '#7f8c8d', fontSize: '18px', marginTop: 0, marginBottom: '40px', letterSpacing: '4px', fontWeight: 'normal' }}>VIRTUAL LABORATORY</h2>
          
          <div style={{ maxWidth: '700px', fontSize: '20px', lineHeight: '1.6', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px', border: '1px solid #34495e' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>HOW TO PLAY:</p>
            <p><strong>1. Get a Mission:</strong> Walk up to CRETA (the AI) or the Whiteboard in the central hub and click them to receive an objective.</p>
            <p><strong>2. Enter a Lab:</strong> Walk through one of the glowing Portals on the right wall to travel to a specific laboratory.</p>
            <p><strong>3. Conduct Experiments:</strong> Find the glowing equipment and interact with it to learn the science behind the crisis.</p>
            <br/>
            <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '20px', borderRadius: '10px', border: '1px solid #e74c3c' }}>
              <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>🎮 CRITICAL CONTROLS</h3>
              <p style={{ margin: '5px 0' }}>Move: <strong>W, A, S, D</strong></p>
              <p style={{ margin: '5px 0' }}>Look: <strong>Mouse</strong></p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>To interact with anything: Press <span style={{ background: '#e74c3c', padding: '3px 8px', borderRadius: '5px', color: 'white' }}>ESC</span> to unlock your mouse, then Click.</p>
            </div>
          </div>
          <button onClick={() => setStarted(true)} style={{ marginTop: '40px', padding: '20px 60px', fontSize: '28px', background: '#00ffcc', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 20px #00ffcc' }}>ENTER LAB</button>
        </div>
      )}

      <div className="ui-layer" style={{ display: started ? 'flex' : 'none' }}>
        <button onClick={toggleFullScreen} className="fullscreen-btn" style={{ display: isFullscreen ? 'none' : 'block' }}>
          FULLSCREEN
        </button>
        {/* Crosshair */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: 'white', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 100, mixBlendMode: 'difference', boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}></div>

        <div className="instruction-box" style={{ marginBottom: '20px', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => setIsMinimized(!isMinimized)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="ui-title" style={{ margin: isMinimized ? '0' : '0 0 12px 0' }}>Assistant Creta</h3>
            <div style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 'bold' }}>{isMinimized ? '+' : '−'}</div>
          </div>

          {!isMinimized && (
            <>
              <div style={{ margin: '16px 0 24px 0' }}>
                <p className="ui-text">
                  {assistantMessage}
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '12px 16px', borderRadius: '8px', width: '100%', textAlign: 'center', fontFamily: 'monospace', color: '#10b981', fontSize: '15px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                SENSORS: V: {voltage.toFixed(1)}V &nbsp;|&nbsp; R: {resistance}Ω &nbsp;|&nbsp; I: {current.toFixed(3)}A
              </div>

              <p className="ui-controls-hint">
                {!isMobile ? "Click to lock pointer • WASD to walk • Mouse to look • ESC to unlock" : "Use left side D-Pad to walk • Drag right side to look around"}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
