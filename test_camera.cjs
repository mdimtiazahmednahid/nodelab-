const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// Make sure CameraResetter faces the center properly
const oldCameraReset = `function CameraResetter({ room }: any) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.5, 2)
  }, [room])
  return null
}`

const newCameraReset = `function CameraResetter({ room }: any) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.6, 2)
    camera.rotation.set(0, 0, 0)
    camera.lookAt(0, 1.6, -5)
  }, [room])
  return null
}`

code = code.replace(oldCameraReset, newCameraReset)

fs.writeFileSync('src/App.tsx', code)
console.log("CameraResetter improved!")
