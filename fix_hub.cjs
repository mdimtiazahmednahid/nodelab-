const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Fix Player camera rotation so it faces -z (where the portals are)
code = code.replace('camera.rotation.set(0, Math.PI, 0)', 'camera.rotation.set(0, 0, 0)')

// Replace HubRoom with a better layout
const hubStart = code.indexOf('function HubRoom(')
const hubEnd = code.indexOf('function ChemistryRoom(')
const oldHub = code.substring(hubStart, hubEnd)

const newHub = `function HubRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Central Hub: Introduction" color="#2c3e50">
      {/* Portals arranged clearly */}
      <Portal position={[-4.5, 0, -4.5]} rotation={[0, Math.PI/8, 0]} label="Physics Lab" color="#3498db" onClick={() => setCurrentRoom('physics')} />
      <Portal position={[-1.5, 0, -4.9]} rotation={[0, 0, 0]} label="Chemistry Lab" color="#e67e22" onClick={() => setCurrentRoom('chemistry')} />
      <Portal position={[1.5, 0, -4.9]} rotation={[0, 0, 0]} label="Biology Lab" color="#2ecc71" onClick={() => setCurrentRoom('biology')} />
      <Portal position={[4.5, 0, -4.5]} rotation={[0, -Math.PI/8, 0]} label="Math Lab" color="#9b59b6" onClick={() => setCurrentRoom('math')} />
      <Portal position={[0, 0, 4.5]} rotation={[0, Math.PI, 0]} label="AI Lab" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />
      
      {/* Info elements on side walls */}
      <Whiteboard position={[-7.35, 1.6, 0]} rotation={[0, Math.PI/2, 0]} setAssistantMessage={onInfo} />
      <InnovationWall position={[7.35, 0, 0]} rotation={[0, -Math.PI/2, 0]} />
      
      {/* Centerpiece to make the room feel less empty */}
      <group position={[0, 0, -1]}>
        <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#34495e" roughness={0.2} metalness={0.8} />
        </Cylinder>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.2, 0]}>
          <meshPhysicalMaterial color="#3498db" transmission={0.9} opacity={1} transparent roughness={0.1} />
        </Sphere>
        <Html transform position={[0, 2.5, 0]} scale={0.1}>
          <div style={{ color: '#00ffcc', textShadow: '0 0 10px #00ffcc', fontSize: '30px', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
            UNIVERSAL<br/>SYNTHESIS LAB
          </div>
        </Html>
      </group>
    </StandardRoom>
  )
}

`
code = code.replace(oldHub, newHub)

fs.writeFileSync('src/App.tsx', code)
console.log("Fixed Hub layout and camera rotation!")
