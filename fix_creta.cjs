const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// 1. Refactor Whiteboard to accept level and setLevel
const oldWhiteboard = `function Whiteboard({ position, rotation=[0,0,0], setAssistantMessage }: any) {
  const [level, setLevel] = useState(0)`

const newWhiteboard = `function Whiteboard({ position, rotation=[0,0,0], setAssistantMessage, level, setLevel }: any) {`

code = code.replace(oldWhiteboard, newWhiteboard)

// 2. Refactor HubRoom to hold the state and render Creta
const oldHubStart = `function HubRoom({ setCurrentRoom, onInfo }: any) {
  return (`

const newHubStart = `function HubRoom({ setCurrentRoom, onInfo }: any) {
  const [level, setLevel] = useState(0)
  return (`

code = code.replace(oldHubStart, newHubStart)

const oldWhiteboardCall = `<Whiteboard position={[-7.35, 1.6, -2]} rotation={[0, Math.PI/2, 0]} setAssistantMessage={onInfo} />`
const newWhiteboardCall = `<Whiteboard position={[-7.35, 1.6, -2]} rotation={[0, Math.PI/2, 0]} setAssistantMessage={onInfo} level={level} setLevel={setLevel} />
      <CretaNPC position={[-6, 0, -3.5]} rotation={[0, Math.PI/4, 0]} level={level} setLevel={setLevel} setAssistantMessage={onInfo} />`

code = code.replace(oldWhiteboardCall, newWhiteboardCall)

// 3. Add CretaNPC component
const cretaComponent = `
function CretaNPC({ position, rotation = [0, 0, 0], level, setLevel, setAssistantMessage }: any) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      // Hover effect
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      // Slowly rotate toward player slightly
    }
  })

  const handleTalk = (e: any) => {
    e.stopPropagation()
    const next = (level + 1) % 3
    setLevel(next)
    
    if (setAssistantMessage) {
      if (next === 1) {
        setAssistantMessage("Creta: 'Hello Scientist. Level 1 activated. Our priority is the Salty Pond. Head to the Chemistry lab.'")
      } else if (next === 2) {
        setAssistantMessage("Creta: 'Level 2 ready. The Tube-Well is contaminated. Please go to the Biology Lab for filtration analysis.'")
      } else {
        setAssistantMessage("Creta: 'Standing by. Take your time exploring the hub. I am here if you need mission briefings.'")
      }
    }
  }

  return (
    <group position={position} rotation={rotation} ref={ref} onClick={handleTalk} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      {/* Head */}
      <Sphere args={[0.25, 32, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#ecf0f1" metalness={0.5} roughness={0.2} />
      </Sphere>
      {/* Glowing Eye Visor */}
      <Box args={[0.3, 0.1, 0.2]} position={[0, 1.6, 0.15]}>
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      </Box>
      {/* Body */}
      <Cylinder args={[0.15, 0.25, 0.7]} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </Cylinder>
      {/* Hover Base */}
      <Cone args={[0.25, 0.3, 16]} position={[0, 0.55, 0]} rotation={[Math.PI, 0, 0]}>
         <meshStandardMaterial color="#34495e" metalness={0.8} />
      </Cone>
      {/* Energy Ring */}
      <TorusKnot args={[0.4, 0.01, 64, 8, 2, 3]} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={1} />
      </TorusKnot>

      <Html transform position={[0, 2.1, 0]} scale={0.08}>
        <div style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', textShadow: '0 0 5px #00ffcc' }}>CRETA (AI Guide)</div>
      </Html>
    </group>
  )
}
`

// Insert CretaNPC right before HubRoom
const hubIndex = code.indexOf('function HubRoom({')
code = code.substring(0, hubIndex) + cretaComponent + code.substring(hubIndex)

fs.writeFileSync('src/App.tsx', code)
console.log("Creta NPC added!")
