const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Re-add the variables in App
const appIndex = code.indexOf('function App() {\n')
const varsToAdd = `  const [gameState, setGameState] = useState('SANDBOX')
  const [wireConnected, setWireConnected] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [resistance, setResistance] = useState(10)
  const current = wireConnected && switchOn ? 1.5 / resistance : 0
  const chartData = testedValues.map(r => ({ R: r, I: parseFloat((1.5 / r).toFixed(3)) })).sort((a, b) => a.R - b.R)
`
code = code.replace('function App() {\n', 'function App() {\n' + varsToAdd)

// Remove RealisticCircuit
const rcStart = code.indexOf('function RealisticCircuit(')
const rcEnd = code.indexOf('function Oscilloscope')
if (rcStart !== -1 && rcEnd !== -1) {
  code = code.substring(0, rcStart) + code.substring(rcEnd)
}

// Remove EquipmentShelf
const esStart = code.indexOf('function EquipmentShelf')
const esEnd = code.indexOf('function Whiteboard')
if (esStart !== -1 && esEnd !== -1) {
  code = code.substring(0, esStart) + code.substring(esEnd)
}

// Remove ChemistryBeaker
const cbStart = code.indexOf('function ChemistryBeaker')
const cbEnd = code.indexOf('function NodeLabBranding')
if (cbStart !== -1 && cbEnd !== -1) {
  code = code.substring(0, cbStart) + code.substring(cbEnd)
}

// Remove NodeLabBranding
const nlbStart = code.indexOf('function NodeLabBranding')
const nlbEnd = code.indexOf('function Stool')
if (nlbStart !== -1 && nlbEnd !== -1) {
  code = code.substring(0, nlbStart) + code.substring(nlbEnd)
}

// Remove Stool
const sStart = code.indexOf('function Stool')
const sEnd = code.indexOf('function ChemistryCorner')
if (sStart !== -1 && sEnd !== -1) {
  code = code.substring(0, sStart) + code.substring(sEnd)
}

// Remove LabDoor
const ldStart = code.indexOf('function LabDoor')
const ldEnd = code.indexOf('function Portal')
if (ldStart !== -1 && ldEnd !== -1) {
  code = code.substring(0, ldStart) + code.substring(ldEnd)
}

// Also update the calls in ChemistryRoom and PhysicsRoom that I removed
code = code.replace('function ChemistryRoom({ setCurrentRoom, onInfo }: any) {', 'function ChemistryRoom({ setCurrentRoom, onInfo, currentVal }: any) {')
code = code.replace('<ChemistryRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />', '<ChemistryRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={current} />')

code = code.replace('function PhysicsRoom({ setCurrentRoom, onInfo }: any) {', 'function PhysicsRoom({ setCurrentRoom, onInfo, currentVal }: any) {')
code = code.replace('<PhysicsRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />', '<PhysicsRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} currentVal={current} />')

fs.writeFileSync('src/App.tsx', code)
console.log("Deep cleanup done")
