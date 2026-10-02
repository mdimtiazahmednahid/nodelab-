const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// 1. Fix HexagonLogo
const oldLogo = `function HexagonLogo() {
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

const newLogo = `function HexagonLogo() {
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
}`
code = code.replace(oldLogo, newLogo)

// 2. Fix Whiteboard Material
const oldWhiteboard = `<mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 3, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.05]} receiveShadow castShadow>
        <boxGeometry args={[8.2, 3.2, 0.05]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>`

const newWhiteboard = `<mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 3, 0.05]} />
        {/* Changed to BasicMaterial to ensure visibility regardless of lighting */}
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, -0.05]} receiveShadow castShadow>
        <boxGeometry args={[8.2, 3.2, 0.05]} />
        <meshBasicMaterial color="#2c3e50" />
      </mesh>`

code = code.replace(oldWhiteboard, newWhiteboard)

fs.writeFileSync('src/App.tsx', code)
console.log("Fixes applied!")
