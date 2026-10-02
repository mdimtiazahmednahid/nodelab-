const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Remove the block from the top
const badBlock = `  const [gameState, setGameState] = useState('SANDBOX')
  const [wireConnected, setWireConnected] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [resistance, setResistance] = useState(10)
  const current = wireConnected && switchOn ? 1.5 / resistance : 0
  const chartData = testedValues.map(r => ({ R: r, I: parseFloat((1.5 / r).toFixed(3)) })).sort((a, b) => a.R - b.R)
`
code = code.replace(badBlock, '')

// Insert it AFTER testedValues
const testedValuesStr = 'const [testedValues, setTestedValues] = useState<number[]>([])\n'
const newBlock = `  const [gameState, setGameState] = useState('SANDBOX')
  const [wireConnected, setWireConnected] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [resistance, setResistance] = useState(10)
  const current = wireConnected && switchOn ? 1.5 / resistance : 0
  const chartData = testedValues.map(r => ({ R: r, I: parseFloat((1.5 / r).toFixed(3)) })).sort((a, b) => a.R - b.R)
`
code = code.replace(testedValuesStr, testedValuesStr + newBlock)

fs.writeFileSync('src/App.tsx', code)
console.log("Fixed order!")
