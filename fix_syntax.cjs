const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const badStart = `: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 1.5, 0]} args={[4, 2, 0.05]}><meshStandardMaterial color="#3498db" /></Box>
    </group>
  )
}`

code = code.replace(badStart, '')

fs.writeFileSync('src/App.tsx', code)
console.log("Syntax fixed!")
