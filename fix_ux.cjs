const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// 1. Lift level state from HubRoom to App
const hubOld = `function HubRoom({ setCurrentRoom, onInfo }: any) {
  const [level, setLevel] = useState(0)
  return (`
const hubNew = `function HubRoom({ setCurrentRoom, onInfo, level, setLevel }: any) {
  return (`
code = code.replace(hubOld, hubNew)

// 2. Add level state to App and add Welcome Screen + Quest Tracker
const appOld = `function App() {
  const [currentRoom, setCurrentRoom] = useState('hub')
  const [assistantMessage, setAssistantMessage] = useState("Welcome to the Operation Nodi Virtual Lab. Step forward to explore.")`

const appNew = `function App() {
  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(0)
  const [currentRoom, setCurrentRoom] = useState('hub')
  const [assistantMessage, setAssistantMessage] = useState("Welcome to the Operation Nodi Virtual Lab. Step forward to explore.")`

code = code.replace(appOld, appNew)

const hubCallOld = `<HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />`
const hubCallNew = `<HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} level={level} setLevel={setLevel} />`
code = code.replace(hubCallOld, hubCallNew)

// 3. Add UI elements to App return
const uiOld = `{/* UI Overlay */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '80%', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid #00ffcc', pointerEvents: 'auto' }}>`

const uiNew = `{/* Crosshair */}
      {started && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: 'white', borderRadius: '50%', mixBlendMode: 'difference', pointerEvents: 'none', zIndex: 10 }}></div>}

      {/* Quest Tracker */}
      {started && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid #f39c12', color: 'white', fontFamily: 'sans-serif', maxWidth: '300px', zIndex: 10 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f39c12', textTransform: 'uppercase' }}>Current Objective</h3>
          {level === 0 ? <p style={{ margin: 0, fontSize: '18px' }}>Speak to CRETA or check the Whiteboard in the Hub to get your mission.</p> : null}
          {level === 1 ? <p style={{ margin: 0, fontSize: '18px' }}><strong>Level 1: The Salty Pond</strong><br/><br/>Go to the Chemistry Lab and use the Solar Still Experiment.</p> : null}
          {level === 2 ? <p style={{ margin: 0, fontSize: '18px' }}><strong>Level 2: The Mystery Tube-Well</strong><br/><br/>Go to the Biology Lab and inspect the Water Filter.</p> : null}
        </div>
      )}

      {/* Welcome Screen */}
      {!started && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#00ffcc', fontSize: '56px', marginBottom: '10px', textShadow: '0 0 20px #00ffcc' }}>OPERATION NODI</h1>
          <h2 style={{ color: '#bdc3c7', fontSize: '24px', marginTop: 0, marginBottom: '40px' }}>Virtual Science Laboratory</h2>
          
          <div style={{ maxWidth: '700px', fontSize: '20px', lineHeight: '1.6', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px', border: '1px solid #34495e' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>HOW TO PLAY:</p>
            <p><strong>1. Get a Mission:</strong> Walk up to CRETA (the AI) or the Whiteboard in the central hub and click them to receive an objective.</p>
            <p><strong>2. Enter a Lab:</strong> Walk through one of the glowing Portals on the right wall to travel to a specific laboratory.</p>
            <p><strong>3. Conduct Experiments:</strong> Find the glowing equipment and interact with it to learn the science behind the crisis.</p>
            <br/>
            <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '20px', borderRadius: '10px', border: '1px solid #e74c3c' }}>
              <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>🎮 CRITICAL CONTROLS</h3>
              <p style={{ margin: '5px 0' }}>Move: <strong>W, A, S, D</strong></p>
              <p style={{ margin: '5px 0' }}>Look: <strong>Mouse</strong></p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>To interact with anything: Press <span style={{ background: '#e74c3c', padding: '3px 8px', borderRadius: '5px', color: 'white' }}>ESC</span> to unlock your mouse, then Click.</p>
            </div>
          </div>
          <button onClick={() => setStarted(true)} style={{ marginTop: '40px', padding: '20px 60px', fontSize: '28px', background: '#00ffcc', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 20px #00ffcc' }}>ENTER LAB</button>
        </div>
      )}

      {/* UI Overlay */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '80%', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid #00ffcc', pointerEvents: 'auto', zIndex: 10 }}>`

code = code.replace(uiOld, uiNew)

fs.writeFileSync('src/App.tsx', code)
console.log("UX improved!")
