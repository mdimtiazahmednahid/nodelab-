const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// The current HexagonLogo component is:
const oldLogo = `function HexagonLogo() {
  const texture = useTexture('/hexagon-logo.png')
  return (
    <group position={[0, 1.4, 0]}>
      {/* NodeLab 3D Hexagon Logo */}
      <Cylinder args={[0.8, 0.8, 0.1, 6]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} roughness={0.05} />
      </Cylinder>
      
      {/* Front Face with Logo Texture */}
      <mesh position={[0, 0, 0.051]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      
      <Cylinder args={[0.65, 0.65, 0.12, 6]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#00ffcc" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  )
}`

// New HexagonLogo:
const newLogo = `function HexagonLogo() {
  const texture = useTexture('/hexagon-logo.png')
  return (
    <group position={[0, 1.4, 0]}>
      {/* NodeLab 3D Hexagon Logo (Solid White with Logo on front cap) */}
      <Cylinder args={[0.9, 0.9, 0.1, 6]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <meshStandardMaterial attach="material-0" color="#ffffff" metalness={0.5} roughness={0.5} />
        <meshBasicMaterial attach="material-1" map={texture} transparent />
        <meshStandardMaterial attach="material-2" color="#ffffff" metalness={0.5} roughness={0.5} />
      </Cylinder>
      
      {/* Glowing Neon Outline */}
      <Cylinder args={[0.95, 0.95, 0.05, 6]} position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} />
      </Cylinder>
    </group>
  )
}`

code = code.replace(oldLogo, newLogo)

fs.writeFileSync('src/App.tsx', code)
console.log("HexagonLogo updated!")
