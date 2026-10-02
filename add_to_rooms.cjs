const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

code = code.replace(
  '<BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />',
  '<BiologyCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />\n      <HumanAnatomy position={[-4.5, 0, -2]} onInfo={onInfo} />'
)

code = code.replace(
  '<ChemistryCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />',
  '<ChemistryCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />\n      <CrystalLattice position={[-4.5, 1.5, -2]} onInfo={onInfo} />'
)

code = code.replace(
  '<PhysicsCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />',
  '<PhysicsCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />\n      <QuantumAtom position={[-4.5, 1.5, -2]} onInfo={onInfo} />'
)

code = code.replace(
  '<MathCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />',
  '<MathCorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />\n      <MathTorus position={[-4.5, 2, -2]} onInfo={onInfo} />'
)

code = code.replace(
  '<AICorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />',
  '<AICorner position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} onInfo={onInfo} />\n      <AIBrain position={[-4.5, 2, -2]} onInfo={onInfo} />'
)

fs.writeFileSync('src/App.tsx', code)
console.log("Injected into rooms!")
