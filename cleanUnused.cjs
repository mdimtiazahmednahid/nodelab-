const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Remove unused imports
code = code.replace(', ContactShadows, Html, Grid, DragControls, PointerLockControls', ', Html, Grid, PointerLockControls')
code = code.replace("import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'", "import { LineChart, Line } from 'recharts'")

// Remove unused variables in ChemistryRoom
code = code.replace('function ChemistryRoom({ setCurrentRoom, onInfo, currentVal }: any) {', 'function ChemistryRoom({ setCurrentRoom, onInfo }: any) {')

// Remove unused variables in MathRoom and AIRoom
code = code.replace('function MathRoom({ setCurrentRoom, onInfo }: any) {', 'function MathRoom({ setCurrentRoom }: any) {')
code = code.replace('function AIRoom({ setCurrentRoom, onInfo }: any) {', 'function AIRoom({ setCurrentRoom }: any) {')

// Remove unused variables in App
code = code.replace("const [gameState] = useState('SANDBOX')", "")
code = code.replace("const [wireConnected, setWireConnected] = useState(false)", "")
code = code.replace("const [switchOn, setSwitchOn] = useState(false)", "")
code = code.replace("const [resistance, setResistance] = useState(10)", "")
code = code.replace("const current = wireConnected && switchOn ? voltage / resistance : 0", "")
code = code.replace("const chartData = testedValues.map(r => ({ R: r, I: parseFloat((1.5 / r).toFixed(3)) })).sort((a, b) => a.R - b.R)", "")

fs.writeFileSync('src/App.tsx', code)
console.log("Cleanup done")
