const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Change environment to forest for a "wildlife" look
code = code.replace('<Environment preset="city" background blur={0.6} />', '<Environment preset="forest" background blur={0.1} />')
// In case it's in multiple places (though it's in StandardRoom)
code = code.replace(/preset="city"/g, 'preset="forest"')

// Replace HubRoom layout
const hubStart = code.indexOf('function HubRoom({')
const hubEnd = code.indexOf('function ChemistryRoom({')
const oldHub = code.substring(hubStart, hubEnd)

const newHub = `function HubRoom({ setCurrentRoom, onInfo }: any) {
  return (
    <StandardRoom title="Central Hub: Introduction" color="#2ecc71">
      {/* Front glass wall looks out into wildlife (forest environment) */}
      
      {/* Portals moved to the RIGHT wall (x = 7.4), facing left */}
      <Portal position={[7.4, 0, -3.5]} rotation={[0, -Math.PI/2, 0]} label="Physics Lab" color="#3498db" onClick={() => setCurrentRoom('physics')} />
      <Portal position={[7.4, 0, -1.75]} rotation={[0, -Math.PI/2, 0]} label="Chemistry" color="#e67e22" onClick={() => setCurrentRoom('chemistry')} />
      <Portal position={[7.4, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="Biology Lab" color="#2ecc71" onClick={() => setCurrentRoom('biology')} />
      <Portal position={[7.4, 0, 1.75]} rotation={[0, -Math.PI/2, 0]} label="Math Lab" color="#9b59b6" onClick={() => setCurrentRoom('math')} />
      <Portal position={[7.4, 0, 3.5]} rotation={[0, -Math.PI/2, 0]} label="AI Lab" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />
      
      {/* Info elements on the left wall */}
      <Whiteboard position={[-7.35, 1.6, -2]} rotation={[0, Math.PI/2, 0]} setAssistantMessage={onInfo} />
      <InnovationWall position={[-7.35, 0, 2]} rotation={[0, Math.PI/2, 0]} />
      
      {/* Centerpiece */}
      <group position={[0, 0, -1]}>
        <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#27ae60" roughness={0.2} metalness={0.8} />
        </Cylinder>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.2, 0]}>
          <meshPhysicalMaterial color="#a8ffb2" transmission={0.9} opacity={1} transparent roughness={0.1} />
        </Sphere>
        <Html transform position={[0, 2.5, 0]} scale={0.1}>
          <div style={{ color: '#2ecc71', textShadow: '0 0 10px #2ecc71', fontSize: '30px', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
            NATURE & SCIENCE<br/>HUB
          </div>
        </Html>
      </group>
    </StandardRoom>
  )
}

`
code = code.replace(oldHub, newHub)

// Also, update Player camera rotation to face the glass window (z=-5) and the right side partially
code = code.replace('camera.rotation.set(0, 0, 0)', 'camera.rotation.set(0, 0, 0)')

fs.writeFileSync('src/App.tsx', code)
console.log("Updated Hub layout!")
