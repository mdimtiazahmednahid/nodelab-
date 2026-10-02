# NodeLab Development Plan (Labster-Style & High Efficiency)

To build NodeLab effectively while matching the high-fidelity, immersive standard of leading educational platforms like **Labster**, we will follow a **"Greybox to Polish"** methodology. This ensures we deliver a realistic 3D science simulation without wasting budget on premature asset optimization.

This means we build the entire functional game using simple, free shapes first. Only after the game is 100% playable do we swap in realistic assets.

---

## Phase 1: Foundation & Greyboxing (Cost: $0)
*Goal: Set up the tech stack and build the physical boundaries of the room without any real assets.*

1. **Initialize Project:** 
   - `npm create vite@latest nodelab -- --template react-ts`
   - Install core 3D libraries: `three`, `@react-three/fiber`, `@react-three/drei`.
2. **Basic Scene Setup:** 
   - Add a basic camera, ambient light, and a simple ground plane.
3. **Greybox the Lab:** 
   - Use simple Three.js primitives (Boxes, Cylinders) to block out the room: walls, a main table (for the experiment), and a computer monitor. 
4. **Player Controller:** 
   - Implement `@react-three/drei`'s `PointerLockControls` for desktop looking.
   - Implement basic WASD movement and simple AABB (bounding box) collision to prevent walking through the greybox tables/walls.
   - Add a virtual joystick (e.g., `react-use-gesture`) for mobile movement.

## Phase 2: Core Mechanics & The Circuit (Cost: $0)
*Goal: Build the interactive circuit and the Ohm's law simulation using primitive shapes.*

1. **The Circuit Logic (React State):** 
   - Create a state machine for the circuit: `{ power: true, switch: false, wireConnected: false, resistance: 10 }`.
   - Calculate output dynamically: `current = voltage / resistance`.
2. **Interactive Elements (Greybox):**
   - Create a box for the battery, a box for the switch, a box for the bulb, and simple lines/tubes for wires.
3. **The Interaction System:**
   - Implement raycasting to detect when the player looks at or taps an object (switch, wire).
   - Add a minimal UI overlay (HTML overlaid on the canvas) to show "Press E to toggle" or "Tap to connect".
4. **The "Game Loop":**
   - Ensure the player can connect the wire -> turn the switch -> see the "bulb" (a simple sphere) change its material color to yellow (emit light).

## Phase 3: Asset Acquisition & Lighting (The "Low Cost" Strategy)
*Goal: Replace greyboxes with realistic assets without hiring a 3D artist.*

1. **Free/Low-Cost Sourcing:**
   - **Environment Lighting:** Download a free, high-quality indoor HDRI from [Poly Haven](https://polyhaven.com/) to provide realistic reflections and ambient light instantly.
   - **Models:** Use [Sketchfab](https://sketchfab.com/) and filter by **"Downloadable" (CC0 or CC-BY licenses)**. You can find free, high-quality models for oscilloscopes, batteries, lab tables, and monitors.
2. **Asset Optimization:**
   - Run downloaded `.glb` files through `gltf-pipeline` or glTF-Transform to compress textures and reduce file sizes for web performance.
3. **Implementation:**
   - Swap the greybox React components with the loaded `useGLTF` models.
   - Add a single, baked soft shadow to the main table to anchor the objects visually without expensive real-time shadow maps.

## Phase 4: UI, Data, & Narrative (The Labster Approach) (Cost: $0)
*Goal: Add the educational layer, guided scaffolding, and story.*

1. **The Virtual Pad (Labster Style):** 
   - Instead of standard web popups, implement a virtual 2D "Tablet/Pad" UI overlay. This Pad acts as the player's AI assistant, providing instructions, tracking the current mission, and asking multiple-choice assessment questions dynamically as they play.
2. **The Computer Terminal:** 
   - Use `@react-three/drei`'s `Html` component to render an actual React UI on the in-game 3D computer screen object to display the V/I/R data.
3. **Graphing & Proof:** 
   - Use a lightweight charting library (like `recharts`) on the 3D screen to plot the data. The "Prove It" prompts and Ohm's Law multiple-choice questions should happen on the Virtual Pad.

## Phase 5: Polish & Mobile Optimization (Cost: $0)
*Goal: Ensure the game feels like a game, not a website.*

1. **Mobile Touchups:** 
   - Ensure the touch joystick doesn't conflict with dragging wires.
   - Optimize pixel ratio on mobile to save GPU cycles (`dpr={[1, 1.5]}`).
2. **Audio:** 
   - Source free sound effects from freesound.org (click, electrical hum, success chime).
   - Implement audio using the Web Audio API or `useThree().camera` audio listeners.
3. **Post-Processing (Optional & Conditional):** 
   - Add a very subtle Bloom effect (from `@react-three/postprocessing`), but disable it on mobile devices to save performance.

---

### Why this is effective:
By building the entire game logic first (Phases 1 & 2), you guarantee the educational and gameplay loops work perfectly. If you run out of time or budget, you still have a fully functional game—it just looks simpler. You only spend time integrating high-fidelity graphics *after* the core game is fun.
