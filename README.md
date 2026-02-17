# Cooling-Electron

Electron desktop app that simulates cooling with a first-order differential equation using Euler's method.

## Design goal (SOLIF-oriented)

This project follows a **SOLIF-style separation of concerns**:

- **S**ingle responsibility: each module has one job.
- **O/L/I** style interface boundaries: UI, application service, model, and solver are isolated.
- **F**unctional clarity: pure functions for math-heavy logic.

## What this app solves

Cooling model (Newton's law of cooling):

\[
\frac{dT}{dt} = -k(T - T_{cool})
\]

Euler update used by the app:

\[
T_{n+1} = T_n + h \cdot \left[-k(T_n - T_{cool})\right]
\]

Where:

- `T` = object temperature
- `T_cool` = cooling/ambient temperature
- `k` = cooling coefficient (`1/time`)
- `h` = step size (`Δt`)

## Required inputs

1. **Starting temperature** (`T0`) ✅
2. **Cooling temperature** (`T_cool`) ✅
3. **Step size** (`h`) ✅

## Other parameters that need to be set

4. **Cooling coefficient** (`k`) ✅ required for the ODE itself.
5. **Maximum simulation time** ✅ controls how far Euler steps run.
6. **Stop tolerance** ✅ optional numerical stopping threshold when `|T - T_cool| <= tolerance`.

## Code segregation

- **First-order ODE solving (Euler)**: `src/solver/eulerSolver.js`
- **Temperature exchange physics**: `src/domain/temperatureModel.js`
- **Orchestration service**: `src/application/coolingSimulationService.js`
- **UI + table + graph**: `src/renderer.js`, `src/index.html`

## Download and run the Electron application

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes `npm`)
- [Git](https://git-scm.com/) (or download ZIP from GitHub)

### Option 1: Clone with Git

```bash
git clone https://github.com/dpstrip/Cooling-Electron.git
cd Cooling-Electron
```

### Option 2: Download ZIP

1. Open the GitHub repository page.
2. Click **Code** → **Download ZIP**.
3. Extract the ZIP, then open a terminal in the extracted folder.

### Install dependencies

```bash
npm install
```

### Start the app (development run)

```bash
npm start
```

This opens the Electron desktop window and runs the cooling simulation UI.

### Windows notes

- The same commands work in **PowerShell** or **Command Prompt**.
- If script execution restrictions appear in PowerShell, run commands in **Command Prompt**.

## Windows support

Build a Windows installer from Linux (when toolchain/deps are available):

```bash
npm run dist:win
```

Output will be under `dist/`.