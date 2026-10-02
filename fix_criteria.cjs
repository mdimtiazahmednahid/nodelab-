const fs = require('fs')

let code = fs.readFileSync('src/App.tsx', 'utf8')

const oldWhiteboard = `          {level === 1 ? (
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
          ) : (`

const newWhiteboard = `          {level === 1 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#e67e22', fontSize: '32px' }}>LEVEL 1: THE SALTY POND</h3>
              <p style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '10px' }}>"Our ponds are flooded with seawater. We need a way to drink." - Grandmother Rokeya</p>
              <div style={{ background: 'rgba(0,0,0,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #e67e22' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>SUCCESS CRITERIA:</p>
                <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '20px', lineHeight: '1.4' }}>
                  <li>Navigate to the <strong>Chemistry Lab</strong>.</li>
                  <li>Locate and activate the <strong>Solar Still</strong>.</li>
                  <li>Analyze how evaporation separates pure water from salt.</li>
                </ul>
              </div>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                NEXT LEVEL
              </button>
            </div>
          ) : level === 2 ? (
            <div>
              <h3 style={{ marginTop: 0, color: '#3498db', fontSize: '32px' }}>LEVEL 2: THE MYSTERY TUBE-WELL</h3>
              <p style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '10px' }}>"Rafiq's uncle drank clear water and fell ill. Clarity isn't purity."</p>
              <div style={{ background: 'rgba(0,0,0,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>SUCCESS CRITERIA:</p>
                <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '20px', lineHeight: '1.4' }}>
                  <li>Navigate to the <strong>Biology Lab</strong>.</li>
                  <li>Inspect the <strong>3-Pitcher Filter</strong> on the table.</li>
                  <li>Understand the multi-layer biological filtration process.</li>
                </ul>
              </div>
              <button style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', fontWeight: 'bold' }}>
                ABORT MISSION
              </button>
            </div>
          ) : (`

if (code.includes('The Salty Pond</p>')) {
  code = code.replace(oldWhiteboard, newWhiteboard)
  fs.writeFileSync('src/App.tsx', code)
  console.log("Updated with criteria!")
} else {
  console.log("Could not find the target code to replace!")
}
