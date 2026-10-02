const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

code = code.replace(
  'preset="forest" background blur={0.1}',
  'preset="city" background blur={0.8}'
)

if (!code.includes('Grid, ')) {
  code = code.replace(
    "import { Canvas, useFrame, useThree } from '@react-three/fiber'",
    "import { Canvas, useFrame, useThree } from '@react-three/fiber'\nimport { Grid } from '@react-three/drei'"
  )
}

const oldFloor = `<Box position={[0, -0.05, 0]} args={[15, 0.1, 10]} receiveShadow><meshStandardMaterial color={color} /></Box>`
const newFloor = `<Box position={[0, -0.05, 0]} args={[15, 0.1, 10]} receiveShadow><meshStandardMaterial color={color} /></Box>
        <Grid position={[0, 0.01, 0]} args={[15, 10]} cellColor="#ffffff" sectionColor="#ffffff" sectionThickness={1.5} fadeDistance={20} cellThickness={0.5} infiniteGrid={false} />`

code = code.replace(oldFloor, newFloor)

fs.writeFileSync('src/App.tsx', code)
console.log("Environment fixed!")
