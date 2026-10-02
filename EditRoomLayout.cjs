const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// We will inject the Portal and Room components before LabEnvironment
const componentsToAdd = `
function Portal({ position, rotation=[0,0,0], label, color, onClick }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick() }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
      </Box>
      <Html transform position={[0, 2.8, 0]} scale={0.1}>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.8)', padding: '5px 10px', border: \`2px solid \${color}\`, borderRadius: '5px', fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {label}
        </div>
      </Html>
    </group>
  )
}

function StandardRoom({ title, color, children, onExit }: any) {
  return (
    <>
      <Environment preset="forest" background blur={0} />
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[2, 5, 2]} intensity={1.2} castShadow />

      <Box position={[0, 3.25, 0]} args={[15, 0.1, 10]} receiveShadow><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[15, 10]} /><meshStandardMaterial color="#bdc3c7" roughness={0.1} metalness={0.4} /></mesh>
      
      {/* Walls */}
      <Box position={[-7.5, 1.6, 0]} args={[0.2, 3.2, 10]} receiveShadow><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box position={[7.5, 1.6, 0]} args={[0.1, 3.2, 10]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box position={[0, 1.6, -5]} args={[15, 3.2, 0.1]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box position={[0, 1.6, 5]} args={[15, 3.2, 0.1]}><meshStandardMaterial color={color} roughness={0.9} /></Box>

      {/* Exit Door */}
      {onExit && <Portal position={[0, 0, 4.9]} rotation={[0, Math.PI, 0]} label="Back to Hub" color="#e74c3c" onClick={onExit} />}
      
      {/* Room Title */}
      <Html transform position={[0, 2.5, -4.9]} scale={0.1}>
        <div style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}>{title}</div>
      </Html>

      {children}
    </>
  )
}

function CameraResetter({ room }: any) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.5, 2)
  }, [room])
  return null
}

function HubRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Central Hub: Introduction" color="#2c3e50">
      <Portal position={[-4, 0, -4.9]} label="Enter Physics" color="#3498db" onClick={() => setCurrentRoom('physics')} />
      <Portal position={[-1.5, 0, -4.9]} label="Enter Chemistry" color="#e67e22" onClick={() => setCurrentRoom('chemistry')} />
      <Portal position={[1.5, 0, -4.9]} label="Enter Biology" color="#2ecc71" onClick={() => setCurrentRoom('biology')} />
      <Portal position={[4, 0, -4.9]} label="Enter Math" color="#9b59b6" onClick={() => setCurrentRoom('math')} />
      <Portal position={[7.4, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="Enter AI" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />
      
      <Whiteboard position={[-7.35, 1.6, -1.5]} setAssistantMessage={onInfo} />
      <InnovationWall position={[0, 0, 4.9]} rotation={[0, Math.PI, 0]} />
    </StandardRoom>
  )
}

function ChemistryRoom({ setCurrentRoom, onInfo, currentVal }: any) {
  return (
    <StandardRoom title="Chemistry Lab" color="#e67e22" onExit={() => setCurrentRoom('hub')}>
      <ChemistryCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
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

function BiologyRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Biology Lab" color="#2ecc71" onExit={() => setCurrentRoom('hub')}>
      <BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
    </StandardRoom>
  )
}

function MathRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Mathematics Lab" color="#9b59b6" onExit={() => setCurrentRoom('hub')}>
      <Html transform position={[0, 1.5, 0]} scale={0.1}>
        <div style={{ color: 'white', fontSize: '30px', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
          Math Experiments Coming Soon!
        </div>
      </Html>
    </StandardRoom>
  )
}

function AIRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="AI Lab" color="#f1c40f" onExit={() => setCurrentRoom('hub')}>
      <ServerRack position={[0, 0, -3]} />
      <Html transform position={[0, 1.5, 0]} scale={0.1}>
        <div style={{ color: 'white', fontSize: '30px', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
          AI Training in Progress...
        </div>
      </Html>
    </StandardRoom>
  )
}
`

// Replace LabEnvironment completely
let startIndex = code.indexOf('function LabEnvironment')
let endIndex = code.indexOf('function App()')
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + componentsToAdd + '\n' + code.substring(endIndex)
}

// In App()
code = code.replace("const [gameState] = useState('SANDBOX')", "const [gameState] = useState('SANDBOX')\n  const [currentRoom, setCurrentRoom] = useState('hub')")

// In <Canvas>
let canvasContentStart = code.indexOf('<LabEnvironment')
let canvasContentEnd = code.indexOf('</LabEnvironment>') + '</LabEnvironment>'.length

let replacementCanvas = `
        <CameraResetter room={currentRoom} />
        {currentRoom === 'hub' && <HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
        {currentRoom === 'chemistry' && <ChemistryRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={currentVal} />}
        {currentRoom === 'physics' && <PhysicsRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={currentVal} />}
        {currentRoom === 'biology' && <BiologyRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
        {currentRoom === 'math' && <MathRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
        {currentRoom === 'ai' && <AIRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />}
`
code = code.substring(0, canvasContentStart) + replacementCanvas + code.substring(canvasContentEnd)

fs.writeFileSync('src/App.tsx', code)
console.log("Replaced successfully!")
