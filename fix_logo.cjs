const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// 1. Add Suspense to react import
if (!code.includes('Suspense')) {
  code = code.replace(
    "import { useState, useEffect, useRef } from 'react'",
    "import { useState, useEffect, useRef, Suspense } from 'react'"
  )
}

// 2. Add useTexture to drei import
if (!code.includes('useTexture')) {
  code = code.replace(
    "import { Box, Sphere, Cylinder, Cone, TorusKnot, Icosahedron, Environment, Html, PointerLockControls } from '@react-three/drei'",
    "import { Box, Sphere, Cylinder, Cone, TorusKnot, Icosahedron, Environment, Html, PointerLockControls, useTexture } from '@react-three/drei'"
  )
}

// 3. Add HexagonLogo component
const logoComponent = `
function HexagonLogo() {
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
}
`

if (!code.includes('function HexagonLogo')) {
  const target = 'function HubRoom({ setCurrentRoom, onInfo, level, setLevel }: any) {'
  code = code.replace(target, logoComponent + '\n' + target)
}

// 4. Replace old centerpiece
const oldCenterpiece = `{/* NodeLab 3D Hexagon Logo */}
        <Cylinder args={[0.8, 0.8, 0.1, 6]} position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.95} roughness={0.05} />
        </Cylinder>
        <Cylinder args={[0.65, 0.65, 0.12, 6]} position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <meshStandardMaterial color="#00ffcc" metalness={0.8} roughness={0.2} />
        </Cylinder>`

const newCenterpiece = `<Suspense fallback={null}>
          <HexagonLogo />
        </Suspense>`

code = code.replace(oldCenterpiece, newCenterpiece)

fs.writeFileSync('src/App.tsx', code)
console.log("Logo added!")
