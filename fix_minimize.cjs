const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

// 1. Add isMinimized state to App
const appStart = code.indexOf('function App() {')
const line2 = code.indexOf('const [started', appStart)
code = code.substring(0, line2) + 'const [isMinimized, setIsMinimized] = useState(false)\n  ' + code.substring(line2)

// 2. Fix ui-layer display
code = code.replace(
  '<div className="ui-layer" style={{ display: started ? \'block\' : \'none\' }}>',
  '<div className="ui-layer" style={{ display: started ? \'flex\' : \'none\' }}>'
)

// 3. Add Minimize toggle and conditional rendering to instruction-box
const oldBox = `<div className="instruction-box" style={{ marginBottom: '20px' }}>
          <h3 className="ui-title">Assistant Creta</h3>

          <div style={{ margin: '16px 0 24px 0' }}>
            <p className="ui-text">
              {assistantMessage}
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '12px 16px', borderRadius: '8px', width: '100%', textAlign: 'center', fontFamily: 'monospace', color: '#10b981', fontSize: '15px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            SENSORS: V: {voltage.toFixed(1)}V &nbsp;|&nbsp; R: {resistance}Ω &nbsp;|&nbsp; I: {current.toFixed(3)}A
          </div>

          <p className="ui-controls-hint">
            {!isMobile ? "Click to lock pointer • WASD to walk • Mouse to look • ESC to unlock" : "Use left side D-Pad to walk • Drag right side to look around"}
          </p>
        </div>`

const newBox = `<div className="instruction-box" style={{ marginBottom: '20px', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => setIsMinimized(!isMinimized)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="ui-title" style={{ margin: isMinimized ? '0' : '0 0 12px 0' }}>Assistant Creta</h3>
            <div style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 'bold' }}>{isMinimized ? '+' : '−'}</div>
          </div>

          {!isMinimized && (
            <>
              <div style={{ margin: '16px 0 24px 0' }}>
                <p className="ui-text">
                  {assistantMessage}
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '12px 16px', borderRadius: '8px', width: '100%', textAlign: 'center', fontFamily: 'monospace', color: '#10b981', fontSize: '15px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                SENSORS: V: {voltage.toFixed(1)}V &nbsp;|&nbsp; R: {resistance}Ω &nbsp;|&nbsp; I: {current.toFixed(3)}A
              </div>

              <p className="ui-controls-hint">
                {!isMobile ? "Click to lock pointer • WASD to walk • Mouse to look • ESC to unlock" : "Use left side D-Pad to walk • Drag right side to look around"}
              </p>
            </>
          )}
        </div>`

code = code.replace(oldBox, newBox)

fs.writeFileSync('src/App.tsx', code)
console.log("Minimize fixed!")
