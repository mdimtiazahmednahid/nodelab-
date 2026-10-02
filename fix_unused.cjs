const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Remove InnovationWall completely
const invStart = code.indexOf('function InnovationWall')
const invEnd = code.indexOf('}', invStart) + 1
code = code.substring(0, invStart) + code.substring(invEnd)

// Remove title from StandardRoom signature
code = code.replace(
  'function StandardRoom({ title, color, children, onExit }: any) {',
  'function StandardRoom({ color, children, onExit }: any) {'
)

fs.writeFileSync('src/App.tsx', code)
console.log("Unused variables removed!")
