const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Fix line 297:
code = code.replace(
  '  useFrame(() => {\n    if (active && tubeRef.current) {\n      // Slowly rotate the telescope to "scan the skies"\n      tubeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3',
  '  useFrame((state) => {\n    if (active && tubeRef.current) {\n      // Slowly rotate the telescope to "scan the skies"\n      tubeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3'
)

// Fix line 541 (Centrifuge)
code = code.replace(
  '  useFrame((state) => {\n    if (active && rotorRef.current) rotorRef.current.rotation.y += 0.5\n  })',
  '  useFrame(() => {\n    if (active && rotorRef.current) rotorRef.current.rotation.y += 0.5\n  })'
)

fs.writeFileSync('src/App.tsx', code)
console.log("Fixed state usage!")
