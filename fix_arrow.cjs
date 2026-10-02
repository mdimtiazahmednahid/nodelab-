const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const arrowComponent = `
function MissionArrow({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.15
      ref.current.rotation.y += 0.05
    }
  })
  return (
    <group position={position} ref={ref}>
      <Cone args={[0.2, 0.5, 16]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
      </Cone>
      <pointLight distance={3} intensity={1.5} color="#ff0055" />
    </group>
  )
}
`

const hubStart = `function HubRoom({ setCurrentRoom, onInfo, level, setLevel }: any) {`
const hubNew = `function HubRoom({ setCurrentRoom, onInfo, level, setLevel }: any) {
  let arrowPos: [number, number, number] | null = null;
  if (level === 0) arrowPos = [-6, 3, -3.5]; // Over Creta
  if (level === 1) arrowPos = [6.5, 2.5, -1.75]; // Over Chem Portal
  if (level === 2) arrowPos = [6.5, 2.5, 0]; // Over Bio Portal
`

code = code.replace(hubStart, arrowComponent + hubStart.replace(hubStart, hubNew))

const portalsEnd = `<Portal position={[7.4, 0, 3.5]} rotation={[0, -Math.PI/2, 0]} label="AI Lab" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />`
const portalsNew = `<Portal position={[7.4, 0, 3.5]} rotation={[0, -Math.PI/2, 0]} label="AI Lab" color="#f1c40f" onClick={() => setCurrentRoom('ai')} />
      {arrowPos && <MissionArrow position={arrowPos} />}`

code = code.replace(portalsEnd, portalsNew)

fs.writeFileSync('src/App.tsx', code)
console.log("Mission Arrow added!")
