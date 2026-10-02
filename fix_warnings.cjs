const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Fix 1: Unused Grid
code = code.replace(', Grid, PointerLockControls } from', ', PointerLockControls } from')

// Fix 2: Unused recharts
code = code.replace("import { LineChart, Line } from 'recharts'\n", "")

// Fix 3: Unused state in useFrame
code = code.replace('useFrame((state) => {', 'useFrame(() => {')

// Fix 4: Unused currentVal in ChemistryRoom
code = code.replace('function ChemistryRoom({ setCurrentRoom, onInfo, currentVal }: any) {', 'function ChemistryRoom({ setCurrentRoom, onInfo }: any) {')

// Fix 5 & 6: Unused state variables in App
code = code.replace("const [gameState, setGameState] = useState('SANDBOX')\n", "")

// Wait, resistance is used in the JSX (HUD), but setResistance is NOT used.
code = code.replace("const [resistance, setResistance] = useState(10)", "const [resistance] = useState(10)")

// wireConnected and switchOn are used in `current = wireConnected && switchOn...` but their setters are unused.
code = code.replace("const [wireConnected, setWireConnected] = useState(false)", "const [wireConnected] = useState(false)")
code = code.replace("const [switchOn, setSwitchOn] = useState(false)", "const [switchOn] = useState(false)")

// chartData is unused
code = code.replace("const chartData = testedValues.map(r => ({ R: r, I: parseFloat((1.5 / r).toFixed(3)) })).sort((a, b) => a.R - b.R)\n", "")

fs.writeFileSync('src/App.tsx', code)
console.log("Warnings fixed!")
