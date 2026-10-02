const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const components = `
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

function Microscope({ position, rotation = [0, 0, 0], onInfo }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onInfo && onInfo('Electron Microscope: Currently analyzing cellular structure of saline-resistant crops.') }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, 0.05, 0]} args={[0.2, 0.1, 0.3]}><meshStandardMaterial color="#bdc3c7" /></Box>
      <Cylinder position={[0, 0.2, 0.1]} args={[0.04, 0.04, 0.3]} rotation={[Math.PI/6, 0, 0]}><meshStandardMaterial color="#7f8c8d" /></Cylinder>
      <Cylinder position={[0, 0.3, -0.05]} args={[0.03, 0.03, 0.2]} rotation={[-Math.PI/6, 0, 0]}><meshStandardMaterial color="#2c3e50" /></Cylinder>
      <Box position={[0, 0.15, -0.05]} args={[0.15, 0.02, 0.15]}><meshStandardMaterial color="#2c3e50" /></Box>
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
`

const appIndex = code.indexOf('function App()')
code = code.substring(0, appIndex) + components + '\n' + code.substring(appIndex)

const biologyRoomOld = \`function BiologyRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Biology Lab" color="#2ecc71" onExit={() => setCurrentRoom('hub')}>
      <BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
    </StandardRoom>
  )
}\`
const biologyRoomNew = \`function BiologyRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Biology Lab" color="#2ecc71" onExit={() => setCurrentRoom('hub')}>
      <BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />
      
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
}\`
code = code.replace(biologyRoomOld, biologyRoomNew)

const mathRoomOld = \`function MathRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Mathematics Lab" color="#9b59b6" onExit={() => setCurrentRoom('hub')}>
      <Html transform position={[0, 1.5, 0]} scale={0.1}>
        <div style={{ color: 'white', fontSize: '30px', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
          Math Experiments Coming Soon!
        </div>
      </Html>
    </StandardRoom>
  )
}\`
const mathRoomNew = \`function MathRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Mathematics Lab" color="#9b59b6" onExit={() => setCurrentRoom('hub')}>
      <Chalkboard position={[0, 0, -4.8]} />
      
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
}\`
code = code.replace(mathRoomOld, mathRoomNew)

const aiRoomOld = \`function AIRoom({ setCurrentRoom, onInfo }: any) {
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
}\`
const aiRoomNew = \`function AIRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="AI Lab" color="#f1c40f" onExit={() => setCurrentRoom('hub')}>
      {/* Server Farm Aisle */}
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
}\`
code = code.replace(aiRoomOld, aiRoomNew)

fs.writeFileSync('src/App.tsx', code)
console.log("Infrastructure added successfully!")
