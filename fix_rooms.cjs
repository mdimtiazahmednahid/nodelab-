const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// MathRoom
code = code.replace(
  'function MathRoom({ setCurrentRoom }: any) {',
  'function MathRoom({ setCurrentRoom, onInfo }: any) {'
)
code = code.replace(
  '<Chalkboard position={[0, 0, -4.8]} />',
  '<Chalkboard position={[0, 0, -4.8]} />\n      <MathTorus position={[-4.5, 2, -2]} onInfo={onInfo} />'
)

// AIRoom
code = code.replace(
  'function AIRoom({ setCurrentRoom }: any) {',
  'function AIRoom({ setCurrentRoom, onInfo }: any) {'
)
code = code.replace(
  '<ServerRack position={[-3, 0, -3]} />',
  '<AIBrain position={[-4.5, 2, -2]} onInfo={onInfo} />\n      <ServerRack position={[-3, 0, -3]} />'
)

fs.writeFileSync('src/App.tsx', code)
console.log("Fixed missing components!")
