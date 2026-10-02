# NODELAB

## REALISTIC 3D WEB GAME — LEVEL 01

You are building the first playable prototype of **NodeLab**, a browser-based 3D virtual laboratory game.

NodeLab is a gamified virtual laboratory where students learn science by **physically interacting with a realistic laboratory environment and performing experiments**.

The first playable level is:

# THE MISSING SIGNAL

The scientific concept discovered during the level is:

# OHM'S LAW

The experience should feel like a **real 3D game**, not a website pretending to be a game.

---

# 1. PRIMARY GOAL

Build a highly polished browser-based 3D experience where the player enters a realistic laboratory, investigates a mysterious electrical problem, performs an experiment, discovers a scientific relationship, and completes the first level.

The player should feel:

> "I am inside a laboratory."

Not:

> "I am using an educational website."

The game should prioritize:

**Realism
Immersion
Smooth interaction
Atmosphere
Exploration
Scientific accuracy
Storytelling
Performance**

---

# 2. PLATFORM

The game must run in modern desktop and mobile browsers.

Target:

* Chrome (Desktop & Mobile)
* Edge
* Firefox
* Safari (Desktop & iOS)

Primary targets:

**Desktop / Laptop & Mobile Devices**

The prototype should run smoothly across:

* Standard Desktop resolutions (1080p, 720p, etc.)
* Mobile portrait and landscape orientations
* Tablets

The game must be fully responsive, automatically adapting its UI, controls, and 3D canvas to different screen sizes and aspect ratios. Ensure performance is optimized for mobile hardware.

---

# 3. TECHNOLOGY

Use a modern web 3D stack.

Preferred:

**React + TypeScript + Three.js**

Use:

* Three.js
* React Three Fiber if appropriate
* Drei where useful
* WebGL
* WebGPU where practical and supported
* GLTF/GLB models
* PBR materials
* HDR environment lighting
* Shadow mapping
* Post-processing
* GPU instancing where useful
* Texture compression where appropriate

If another web-native 3D engine provides substantially better results, you may evaluate:

**Babylon.js**

But do not choose technology merely because it is convenient.

Choose based on:

**visual quality + performance + maintainability + future scalability.**

---

# 4. VERY IMPORTANT — REALISTIC GRAPHICS

The visual target is:

### AAA-inspired realistic laboratory environment

Do NOT create:

* Flat colored geometry
* Cartoon laboratory
* Low-poly educational environment
* Generic CSS cards pretending to be equipment
* Primitive boxes everywhere
* Toy-like equipment
* Excessive neon
* Unrealistic lighting

Use realistic:

* Materials
* Metal
* Glass
* Plastic
* Rubber
* Paper
* Screens
* Wires
* Laboratory surfaces
* Equipment
* Reflections
* Shadows
* Ambient lighting

The laboratory should look believable.

---

# 5. ART DIRECTION

Imagine a modern scientific research laboratory.

The environment contains:

* Stainless-steel surfaces
* Dark laboratory benches
* Glass equipment
* Realistic electrical components
* Measurement instruments
* Computers
* Research monitors
* Storage cabinets
* Cable management
* Small tools
* Scientific notes
* Equipment labels
* Warning signs
* Realistic wear and imperfections

Do not make the environment excessively futuristic.

It should feel like a laboratory that could actually exist.

---

# 6. MATERIAL QUALITY

Use physically based rendering.

Materials should have appropriate:

* Roughness
* Metallic values
* Normal maps
* Ambient occlusion
* Specular response
* Reflection

Glass should behave like glass.

Metal should behave like metal.

Plastic should behave like plastic.

Rubber should not look metallic.

Paper should not look like plastic.

Avoid one-material-for-everything rendering.

---

# 7. LIGHTING

Lighting is extremely important.

Use realistic layered lighting.

Possible setup:

### Main environment lighting

HDRI / environment map.

### Laboratory lights

Ceiling fluorescent/LED fixtures.

### Local lights

Equipment indicators.

### Emergency lighting

Subtle red/orange emergency indicator where appropriate.

### Screen lighting

Computer monitors emit subtle light.

### Electrical experiment lighting

The bulb and circuit should visibly illuminate when powered.

Avoid excessive bloom.

The laboratory should have believable light falloff.

---

# 8. POST PROCESSING

Use subtle post-processing where it improves realism.

Possible effects:

* Ambient occlusion
* Bloom
* Tone mapping
* Color grading
* Anti-aliasing
* Depth of field for cinematic moments
* Subtle vignette

Do not overuse cinematic effects.

The game must remain clear and playable.

---

# 9. CAMERA

Use an immersive first-person camera.

The player should feel like they are physically standing inside the laboratory.

Implement:

* Mouse look
* WASD movement
* Smooth camera movement
* Sensible movement speed
* Collision detection
* Head-height positioning
* Interaction raycasting

Do not make the camera float unnaturally.

---

# 10. PLAYER MOVEMENT

Implement Desktop Controls:

**W** — forward

**S** — backward

**A** — left

**D** — right

Mouse:

**Look around**

**ESC**:

Release mouse pointer / open pause interface.

Implement Mobile Controls:

**Virtual Joystick** (Left side): Move forward/backward/left/right

**Touch Drag** (Right side): Look around

**On-screen buttons**: Contextual interactions (e.g., Pause, Interact)

Add collision detection with laboratory objects.

Prevent the player from walking through:

* Walls
* Tables
* Cabinets
* Equipment
* Major environmental objects

---

# 11. INTERACTION SYSTEM

Build a reusable interaction system.

When the player looks at an interactive object:

* Subtle highlight
* Small interaction indicator
* Object name
* Optional interaction instruction

Example:

> **Circuit**
>
> Press E to inspect

or:

> **Switch**
>
> Press E to toggle

Avoid giant UI prompts.

The interaction system should feel like a professional game.

---

# 12. LAB ENVIRONMENT

Create one complete laboratory room.

The player should be able to walk around it.

Include enough environmental detail to make it believable.

Suggested layout:

### Central workbench

Contains the main experiment.

### Computer workstation

Displays system alerts and experiment data.

### Equipment shelf

Contains additional laboratory equipment.

### Electrical components area

Contains:

* Battery
* Wires
* Switch
* Bulb
* Resistors
* Multimeter / measurement instrument

### Storage area

Adds realism but doesn't need to be fully interactive.

---

# 13. OPENING

Start with a cinematic sequence.

Black screen.

Display:

**08:43 AM**

Then fade into the laboratory.

Camera begins inside the room.

Show subtle environmental movement.

Computer screen suddenly turns on.

Display:

> SYSTEM ALERT
>
> LAB 03 — SIGNAL LOST

Then:

> REMOTE SENSOR: OFFLINE

Pause.

Then:

> CAN YOU FIND OUT WHY?

Allow player control.

---

# 14. ENVIRONMENTAL STORYTELLING

Do not explain everything through dialogue.

Let the environment tell the story.

Examples:

* Warning labels
* Research notes
* Computer logs
* Equipment status
* Strange waveform
* Unusual measurements
* Damaged/loose wire
* Recent experiment notes

The player should investigate.

---

# 15. MISSION 01

## FIND THE MISSING SIGNAL

The player discovers an electrical circuit.

The circuit contains:

* Battery
* Switch
* Bulb
* Wires

The bulb is not working.

Computer:

> POWER SOURCE: AVAILABLE

The player investigates.

The switch is OFF.

The player turns it ON.

Nothing happens.

The player notices a disconnected wire.

They reconnect it.

---

# 16. CIRCUIT INTERACTION

This must be a real interactive 3D circuit.

The player should be able to:

* Pick up a wire
* Move it
* Connect it to an appropriate terminal
* Toggle the switch
* Inspect components

When the circuit is correctly connected:

The bulb illuminates.

The electrical system activates.

The computer displays:

> SIGNAL DETECTED

The player should clearly see the physical cause-and-effect.

---

# 17. PHYSICAL FEEDBACK

When the circuit becomes active:

* Bulb gradually illuminates
* Small electrical indicator activates
* Meter reading changes
* Computer status changes
* Subtle electrical sound plays
* Nearby environment receives slight illumination from the bulb

Make it satisfying.

---

# 18. MISSION 02

The computer begins recording data.

Display:

**Voltage: 1.5 V**

**Current: 0.15 A**

Then:

> "If you change one thing, what happens to the other?"

The player must investigate.

---

# 19. RESISTANCE EXPERIMENT

The player has access to different resistors.

Allow the player to select or physically insert different resistance values.

Initial values:

**10 Ω**

**20 Ω**

**30 Ω**

Use:

**I = V / R**

with:

**V = 1.5 V**

Expected results:

10 Ω → 0.15 A

20 Ω → 0.075 A

30 Ω → 0.05 A

These values must be calculated dynamically.

---

# 20. REALISTIC INSTRUMENT

Create a believable digital multimeter or measurement device.

It should have:

* Display
* Measurement mode
* Leads
* Terminals
* Buttons/dial
* Realistic materials
* Small screen
* Physical interaction

The player should be able to read:

Voltage

Current

Resistance

Do not create a full electrical engineering simulator.

Create enough simulation to make this experiment believable.

---

# 21. EXPERIMENT DATA

Every experiment should create a measurement record.

For example:

### EXPERIMENT #01

Voltage: 1.5 V

Resistance: 10 Ω

Current: 0.15 A

Then:

### EXPERIMENT #02

Voltage: 1.5 V

Resistance: 20 Ω

Current: 0.075 A

Then:

### EXPERIMENT #03

Voltage: 1.5 V

Resistance: 30 Ω

Current: 0.05 A

The game should store these measurements.

---

# 22. DATA VISUALIZATION

After several measurements, the computer generates a graph.

Animate the graph being drawn.

Show the collected data.

The player should visually recognize the pattern.

Ask:

> **What pattern do you see?**

The player must reason from the evidence.

---

# 23. DISCOVERY

Ask:

### What happens to current when resistance increases?

Options:

A. Current increases

B. Current decreases

C. Current remains constant

D. No relationship

Correct:

**B**

If wrong, don't instantly fail.

Encourage another experiment.

---

# 24. PROOF

The game says:

> "A pattern isn't enough."

Then:

> **PROVE IT.**

The player performs another experiment.

Use another resistance value.

The player confirms the relationship.

---

# 25. LAW REVEAL

Create a cinematic reveal.

Camera subtly focuses on the computer.

Collected measurements appear.

Then:

# V = I × R

Pause.

Then:

# OHM'S LAW

Then:

> "You didn't memorize the law."

Pause.

> **"You discovered it."**

This is the emotional payoff of the first level.

---

# 26. STORY TWIST

Immediately after the discovery:

**BEEP.**

Computer:

> SIGNAL RESTORED

Then:

> SOURCE: UNKNOWN

A strange waveform appears.

The player realizes the original problem may have been more than a simple technical failure.

Display:

> "If you want to know who sent the signal..."

Pause.

> "...keep investigating."

Fade to black.

---

# 27. LEVEL COMPLETION

Show:

# INVESTIGATION COMPLETE

**Accuracy:** 96%

**Safety:** 100%

**Attempts:** 2

**Discovery:** Ohm's Law

Then:

# +250 XP

### ⭐⭐⭐

**EXPERIMENT MASTERY**

Then:

# LEVEL 02 UNLOCKED

Keep Level 02 locked.

---

# 28. GAME UI

The UI should remain minimal.

The majority of the screen should be the 3D environment.

Only show essential information:

* Current mission
* Small interaction prompt
* XP
* Experiment status
* Important alerts

Do not cover the screen with panels.

Use translucent interfaces where appropriate.

---

# 29. UI STYLE

Modern scientific interface.

Use:

* Thin borders
* Subtle transparency
* Small typography
* Clean icons
* Minimal animation
* Clear hierarchy

Avoid:

* Cartoon buttons
* Huge rounded cards
* Generic dashboard layouts
* Excessive gradients
* Excessive neon

---

# 30. ANIMATION QUALITY

Animations should feel smooth and intentional.

Target:

**60 FPS where hardware allows.**

Use interpolation and easing.

Avoid abrupt movement.

Examples:

* Door opening
* Computer booting
* Equipment activation
* Switch movement
* Wire connection
* Bulb illumination
* Graph drawing
* UI transitions
* Camera transitions

---

# 31. PERFORMANCE

Realistic graphics must not destroy browser performance.

Implement:

* Frustum culling
* Efficient geometry
* Texture compression
* Appropriate texture resolution
* LOD where useful
* Instancing for repeated objects
* Efficient shadow settings
* Lazy loading
* Asset preloading where useful
* Avoid unnecessary React re-renders
* Dispose unused GPU resources
* Keep draw calls reasonable

Target a smooth experience on a reasonably modern laptop.

Provide a graphics-quality strategy if necessary:

### Quality

### Balanced

### Performance

The default should be **Balanced**.

---

# 32. ASSET STRATEGY

Use realistic 3D assets.

Prefer:

**GLB / GLTF**

Assets should have appropriate PBR textures.

Where external assets are used, structure them cleanly and ensure their licenses permit the intended prototype use.

Do not use obviously mismatched asset styles.

The entire laboratory should feel visually coherent.

---

# 33. PROCEDURAL VS ASSET-BASED

Do not build everything from primitive Three.js boxes.

Use procedural geometry only where appropriate.

For major visible objects, prefer detailed assets.

Examples:

* Laboratory table
* Computer
* Multimeter
* Battery
* Electrical equipment
* Chairs
* Cabinets
* Laboratory equipment

Small hidden/background objects can be simplified.

---

# 34. AUDIO

Add immersive sound.

Environment:

* HVAC hum
* Very subtle laboratory ambience
* Computer fan
* Electrical equipment

Interaction:

* Switch click
* Button click
* Wire connection
* Equipment activation

Story:

* Alert sound
* Computer notification
* Discovery sound
* Completion sound

Keep audio subtle and professional.

---

# 35. GAME STATE

Create a clean game-state architecture.

Example states:

```text
INTRO
↓
FREE_EXPLORATION
↓
INVESTIGATING
↓
CIRCUIT_REPAIR
↓
SIGNAL_RESTORED
↓
EXPERIMENT
↓
DATA_COLLECTION
↓
DISCOVERY
↓
PROOF
↓
LAW_REVEAL
↓
STORY_TWIST
↓
LEVEL_COMPLETE
```

The state system should be easy to extend for future levels.

---

# 36. EXPERIMENT ENGINE

Create reusable experiment logic.

Each experiment should be able to define:

* Equipment
* Variables
* Equations
* Measurements
* Allowed interactions
* Conditions
* Correct results
* Scoring
* Completion criteria

The first experiment is:

**Ohm's Law**

Do not implement additional experiments yet.

---

# 37. FUTURE EXPANSION

Architect the project so NodeLab can eventually contain many scientific stories.

Potential future categories:

Physics

Chemistry

Biology

Electronics

But do NOT implement those now.

The first level should establish the foundation.

---

# 38. SAVE PROGRESS

For this prototype, use local browser storage if needed.

Save:

* Level completion
* XP
* Score
* Experiment results
* Discovered laws

No backend is required unless you determine it is necessary.

---

# 39. LOADING EXPERIENCE

3D assets may take time to load.

Create a polished loading screen.

Example:

# NODELAB

**INITIALIZING LABORATORY...**

Show:

* Progress indicator
* Loading percentage
* Small scientific status messages

Do not show a blank white page.

---

# 40. ERROR HANDLING

If a 3D asset fails to load:

Do not crash the entire application.

Provide a fallback or meaningful error.

If WebGPU isn't available:

Fall back to WebGL where possible.

The prototype must remain usable.

---

# 41. CODE QUALITY

Use:

* TypeScript
* Modular components
* Clear naming
* Reusable systems
* Separate game logic from UI
* Separate experiment logic from rendering
* Configuration-driven experiment definitions

Avoid putting the entire game into one component.

---

# 42. FINAL EXPERIENCE TEST

Before considering the prototype complete, test the experience from a completely new player's perspective.

A player must be able to:

1. Load NodeLab.
2. See the cinematic introduction.
3. Enter the laboratory.
4. Move around naturally.
5. Look around smoothly.
6. Identify interactive objects.
7. Find the broken circuit.
8. Interact with the wire.
9. Repair the circuit.
10. Turn on the switch.
11. See the bulb illuminate.
12. Restore the signal.
13. Access the experiment.
14. Change resistance.
15. Observe current changing.
16. Perform multiple experiments.
17. See measurement data.
18. See the generated graph.
19. Identify the pattern.
20. Prove the relationship.
21. Discover Ohm's Law.
22. Experience the story twist.
23. Receive XP.
24. Complete Level 01.
25. See Level 02 locked.

---

# 43. MOST IMPORTANT DESIGN RULE

Do not sacrifice realism for educational UI.

The player should spend most of their time:

**inside the 3D laboratory.**

Not inside menus.

Not reading instructions.

Not clicking quiz cards.

Not navigating dashboards.

The laboratory itself is the interface.

---

# 44. FINAL QUALITY BAR

Before finishing, ask:

### Does this look like a real game?

### Does the laboratory feel physically believable?

### Do objects feel tangible?

### Does the player understand what to do without being overwhelmed?

### Does the experiment actually feel interactive?

### Does the scientific discovery feel earned?

### Does the mystery make the player curious about Level 02?

If the answer to any of these is no, improve the experience before considering the prototype finished.

---

# FINAL PRODUCT IDENTITY

# NODELAB

### A virtual laboratory where students don't study science first.

### They enter it.

### They experiment.

### They make mistakes.

### They discover.

### They learn.

**Don't memorize science.**

# Discover it.
