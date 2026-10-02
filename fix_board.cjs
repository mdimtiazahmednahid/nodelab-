const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const oldWhiteboard = `function Whiteboard({ position, setAssistantMessage }: any) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setAssistantMessage && setAssistantMessage("Central Whiteboard: Mission Hub.") }} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, 0, 0]} args={[4, 2, 0.05]}><meshStandardMaterial color="#ffffff" /></Box>
      <Box position={[0, 0, -0.05]} args={[4.2, 2.2, 0.05]}><meshStandardMaterial color="#2c3e50" /></Box>
      <Html transform position={[0, 0, 0.03]} scale={0.1}>
        <div style={{ color: '#2c3e50', fontSize: '30px', fontWeight: 'bold' }}>Operation Nodi Missions</div>
      </Html>
    </group>
  )
}`

const newWhiteboard = `function Whiteboard({ position, rotation=[0,0,0], setAssistantMessage }: any) {
  const [level, setLevel] = useState(0)

  const toggleMission = (e: any) => {
    e.stopPropagation()
    const next = (level + 1) % 3
    setLevel(next)
    
    if (setAssistantMessage) {
      if (next === 1) {
        setAssistantMessage("Level 1: The Salty Pond. Grandmother Rokeya says: 'We need scientists who understand us.' 🧪 Walk over to the Chemistry Lab portal on the right to begin.")
      } else if (next === 2) {
        setAssistantMessage("Level 2: The Mystery Tube-Well. Rafiq's uncle drank clear water and got sick. 💧 Check the Biology Lab portal on the right.")
      } else {
        setAssistantMessage("Mission paused. Free roam mode active.")
      }
    }
  }

  return (
    <group position={position} rotation={rotation} onClick={toggleMission} onPointerOver={() => document.body.style.cursor='pointer'} onPointerOut={() => document.body.style.cursor='auto'}>
      <Box position={[0, 0, 0]} args={[4, 2, 0.05]}><meshStandardMaterial color="#ffffff" /></Box>
      <Box position={[0, 0, -0.05]} args={[4.2, 2.2, 0.05]}><meshStandardMaterial color="#2c3e50" /></Box>
      
      {/* Scribbles */}
      <Html transform position={[0, 0, 0.03]} scale={0.1}>
        <div style={{ width: '800px', height: '300px', fontSize: '24px', fontFamily: 'sans-serif', color: '#2c3e50', padding: '20px', position: 'relative', pointerEvents: 'none' }}>
          {level === 1 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#e67e22', fontSize: '32px' }}>LEVEL 1 ACTIVE</h3>
              <p style={{ fontWeight: 'bold' }}>The Salty Pond</p>
              <p>Your objective: Why does pond water taste salty, but the steam does not?</p>
              <p>Go to the Chemistry Lab for the <strong>Solar Still Experiment</strong>.</p>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                NEXT LEVEL
              </button>
            </div>
          ) : level === 2 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#3498db', fontSize: '32px' }}>LEVEL 2 ACTIVE</h3>
              <p style={{ fontWeight: 'bold' }}>The Mystery Tube-Well</p>
              <p>Your objective: Why can water be perfectly clear and still make you sick?</p>
              <p>Go to the Biology Lab for the <strong>3-Pitcher Water Filter</strong>.</p>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                ABORT MISSION
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ marginTop: 0, color: '#2980b9', fontSize: '32px' }}>Operation Nodi: The Last Clean Drop</h3>
              <p><strong>Status:</strong> Pending &nbsp;|&nbsp; <strong>Location:</strong> Shyamnagar, Satkhira (2040)</p>
              <p><strong>Objective:</strong> A cyclone has pushed salt water into ponds. We need scientists who understand us. Will you be one?</p>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                ENTER MISSION
              </button>
            </div>
          )}
        </div>
      </Html>

      {/* Floating Click Indicator when pending */}
      <ClickIndicator position={[0, 1.2, 0.1]} />
    </group>
  )
}`

code = code.replace(oldWhiteboard, newWhiteboard)

fs.writeFileSync('src/App.tsx', code)
console.log("Mission board restored!")
