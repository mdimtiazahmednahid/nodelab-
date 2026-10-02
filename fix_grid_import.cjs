const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

code = code.replace("import { Grid } from '@react-three/drei'\n", "")

fs.writeFileSync('src/App.tsx', code)
console.log("Unused Grid import removed!")
