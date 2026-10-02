const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Fix App definition
const appStart = code.indexOf('function App() {')
const line2 = code.indexOf('const [currentRoom', appStart)
code = code.substring(0, line2) + 'const [started, setStarted] = useState(false)\n  const [level, setLevel] = useState(0)\n  ' + code.substring(line2)

// Fix HubRoom call inside App
code = code.replace(
  '<HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} />',
  '<HubRoom setCurrentRoom={setCurrentRoom} onInfo={setAssistantMessage} level={level} setLevel={setLevel} />'
)

fs.writeFileSync('src/App.tsx', code)
console.log("App state fixed!")
