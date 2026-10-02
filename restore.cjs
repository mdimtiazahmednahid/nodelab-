const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const missingCode = `
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
  useFrame((state) => {
    if (active && rotorRef.current) rotorRef.current.rotation.y += 0.5
  })
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); setActive(!active); onInfo && onInfo('Centrifuge: Used to separate fluids of different densities.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Cylinder position={[0, 0.1, 0]} args={[0.15, 0.15, 0.2]}><meshStandardMaterial color="#ecf0f1" /></Cylinder>
      <Cylinder ref={rotorRef} position={[0, 0.2, 0]} args={[0.1, 0.1, 0.05]}><meshStandardMaterial color="#34495e" /></Cylinder>
    </group>
  )
}

function Whiteboard({ position, setAssistantMessage }: any) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setAssistantMessage && setAssistantMessage("Central Whiteboard: Mission Hub.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, 0, 0]} args={[4, 2, 0.05]}><meshStandardMaterial color="#ffffff" /></Box>
      <Box position={[0, 0, -0.05]} args={[4.2, 2.2, 0.05]}><meshStandardMaterial color="#2c3e50" /></Box>
      <Html transform position={[0, 0, 0.03]} scale={0.1}>
        <div style={{ color: '#2c3e50', fontSize: '30px', fontWeight: 'bold' }}>Operation Nodi Missions</div>
      </Html>
    </group>
  )
}

function InnovationWall({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 1.5, 0]} args={[4, 2, 0.05]}><meshStandardMaterial color="#3498db" /></Box>
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
`

const targetStr = 'function StandardRoom('
const insertIdx = code.indexOf(targetStr)
if (insertIdx !== -1) {
  code = code.substring(0, insertIdx) + missingCode + '\n' + code.substring(insertIdx)
}

// Ensure the imports are correct
if (!code.includes('Cone')) {
  code = code.replace("import { Box, Sphere, Cylinder, Environment, Html, Grid, PointerLockControls } from '@react-three/drei'", "import { Box, Sphere, Cylinder, Cone, Environment, Html, Grid, PointerLockControls } from '@react-three/drei'")
}

fs.writeFileSync('src/App.tsx', code)
console.log("Restored missing components!")
