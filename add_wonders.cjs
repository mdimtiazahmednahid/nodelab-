const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Add imports for TorusKnot, Icosahedron if not present
if (!code.includes('TorusKnot')) {
  code = code.replace('Cone, Environment, Html', 'Cone, TorusKnot, Icosahedron, Environment, Html')
}

// 1. Define the components
const newComponents = `
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
`

// Insert components before function App
const appIndex = code.indexOf('function App()')
code = code.substring(0, appIndex) + newComponents + code.substring(appIndex)

// Add HumanAnatomy to BiologyRoom
code = code.replace(
  '<WaterFilter position={[0, 1.2, 0.5]} onInfo={onInfo} />',
  '<WaterFilter position={[0, 1.2, 0.5]} onInfo={onInfo} />\n      <HumanAnatomy position={[-4.5, 0, -2]} onInfo={onInfo} />'
)

// Add QuantumAtom to PhysicsRoom
code = code.replace(
  '<Telescope position={[4, 0, -2]} onInfo={onInfo} />',
  '<Telescope position={[4, 0, -2]} onInfo={onInfo} />\n      <QuantumAtom position={[-4, 1.5, -2]} onInfo={onInfo} />'
)

// Add CrystalLattice to ChemistryRoom
code = code.replace(
  '<BunsenBurner position={[1, 1.2, 0]} onInfo={onInfo} />',
  '<BunsenBurner position={[1, 1.2, 0]} onInfo={onInfo} />\n      <CrystalLattice position={[-4.5, 1.5, -2]} onInfo={onInfo} />'
)

// Add MathTorus to MathRoom
code = code.replace(
  '<PlatonicSolids position={[4, 1, -2]} onInfo={onInfo} />',
  '<PlatonicSolids position={[4, 1, -2]} onInfo={onInfo} />\n      <MathTorus position={[-4, 2, -2]} onInfo={onInfo} />'
)

// Add AIBrain to AIRoom
code = code.replace(
  '<NeuralNetHologram position={[0, 1.5, -2]} onInfo={onInfo} />',
  '<NeuralNetHologram position={[0, 1.5, -2]} onInfo={onInfo} />\n      <AIBrain position={[-4, 2, -2]} onInfo={onInfo} />'
)

fs.writeFileSync('src/App.tsx', code)
console.log("Added Wonders!")
