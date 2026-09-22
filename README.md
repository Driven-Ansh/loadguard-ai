<h1 align="center">
  <br/>
  <img src="https://img.shields.io/badge/LOADGUARD-AI-00f0ff?style=for-the-badge&logo=lightning&logoColor=black" alt="LOADGUARD AI"/>
  <br/>
  <br/>
  LOADGUARD AI
  <br/>
  <sup><sub>Intelligent Appliance Health, Energy Monitoring & Protective Control</sub></sup>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live_Prototype-00e676?style=flat-square"/>
  <img src="https://img.shields.io/badge/Version-2.4.1--EDGE-00f0ff?style=flat-square"/>
  <img src="https://img.shields.io/badge/Built_with-React_19_+_Three.js-61DAFB?style=flat-square&logo=react"/>
  <img src="https://img.shields.io/badge/3D-WebGL_via_Three.js-ff6600?style=flat-square"/>
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript"/>
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel"/>
</p>

<p align="center">
  <strong>A competition-ready hardware + AI + software simulation prototype for intelligent electrical appliance health monitoring and deterministic safety protection.</strong>
</p>

---

## 🎯 Product Concept

**LoadGuard AI** is an intelligent edge IoT device that continuously monitors electrical appliances using high-fidelity sensor telemetry and applies a learned behavioral baseline to detect anomalies before they become failures.

The system follows a single governing philosophy:

```
MEASURE → LEARN → UNDERSTAND → DETECT → EXPLAIN → ESTIMATE → PROTECT
```

> ⚡ **Engineering Honesty**: AI provides anomaly intelligence and explainable diagnostics.
> Deterministic hardware protection handles all configured critical safety conditions.
> This prototype clearly identifies itself as a simulation and does not imply real mains electrical control.

---

## 🖥️ Live Demo

> **🌐 [Open LOADGUARD AI Live on Vercel →](https://loadguard-ai.vercel.app)**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOADGUARD AI UI                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Top Nav: Branding | SIMULATION BADGE | Device Switcher      │  │
│  │           Clock | Notifications | JUDGE DEMO MODE Button     │  │
│  ├───────────────┬───────────────────────────────────────────────┤  │
│  │  Persistent   │  10 Primary Sections (Sidebar)               │  │
│  │  Sidebar      │  Overview | 3D Lab | Monitor | Learning      │  │
│  │               │  AI Health | Energy | Protection | Timeline  │  │
│  │               │  Fleet | Settings                            │  │
│  └───────────────┴───────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
            ┌────────────────┼──────────────────┐
            ▼                ▼                  ▼
   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
   │ Electrical  │  │  AI Health   │  │  Deterministic   │
   │ Physics     │  │  Engine      │  │  Protection      │
   │ Simulator   │  │  (5-Vector)  │  │  Rules Engine    │
   │ P=V×I×PF   │  │  Explainable │  │  Sub-cycle trip  │
   │ I²R Thermal │  │  Alerts      │  │  <10ms relay     │
   └─────────────┘  └──────────────┘  └──────────────────┘
            │
            ▼
   ┌─────────────────────────────────────────────────────┐
   │         INTERACTIVE 3D HARDWARE DIGITAL TWIN        │
   │  Three.js WebGL • 11 Components • Dual Flow Paths   │
   │  Exploded View • Physical Relay Armature Movement   │
   └─────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔩 Interactive 3D Hardware Digital Twin
- **Procedural WebGL model** of the LoadGuard device with Two form factors:
  - **Household Inline Module** — Compact wall/plug-mounted enclosure
  - **Industrial DIN-Rail Module** — Panel-mounted 35mm DIN-rail housing
- **11 labeled internal components** all clickable with technical specification drawers:
  - AC Input Terminal Block, Protection MOV/Fuse/GDT, Toroidal Current Transformer, Precision Voltage Divider, Dedicated Energy Metering IC, Dual-Core Edge AI MCU, Wi-Fi 6 Communication Module, NTC Temperature Sensor, Isolated SMPS, Latching Contactor/Relay, Load Output Terminal
- **Exploded View Slider**: Smooth 0–100% continuous component separation
- **Casing modes**: Smoky Acrylic (transparent) / Solid Matte Charcoal / PCB Open
- **Physical relay armature**: Mechanically opens in 3D when protection trips

### ⚡ Dual Animated Signal Flows
- **Power Path** (Blue): AC Input → Protection → CT Sensor → Relay → Load Output
- **Data Path** (Cyan): Sensors → Metering IC → MCU → Communication Module
- Particles turn **amber** when anomaly detected, **red** on critical condition
- Power flow halts completely when the safety contactor opens

### 📐 Physics-Coupled Electrical Engine
Mathematically correlated continuous simulation:

| Parameter | Formula |
|:---|:---|
| Real Power | $P = V_{\text{rms}} \times I_{\text{rms}} \times \cos\phi$ |
| Apparent Power | $S = V_{\text{rms}} \times I_{\text{rms}}$ |
| Reactive Power | $Q = \sqrt{S^2 - P^2}$ |
| Thermal Dynamics | $\Delta T = k_h I^2 - k_d(T - T_{\text{ambient}})$ |
| Startup Transient | $I(t) = I_{\text{peak}} \cdot e^{-t/\tau} + I_{\text{run}}$ |

### 🧠 Explainable AI Health Analysis (5 Dimensions)
- **Electrical Stability** — RMS voltage deviation & current variance
- **Energy Efficiency** — Real power vs learned state-specific baseline
- **Thermal Behaviour** — Temperature trajectory vs $I^2R$ equilibrium model
- **Operating Consistency** — Power factor degradation & state cycle consistency
- **Power Quality** — THD indicators, grid frequency sync, and capacitive balance

All 5 metrics produce a **composite Health Score (0–100)** with transparent explanations.

### 🔍 "Why Am I Getting This Alert?" — Explainable Diagnostics
Instead of black-box AI verdicts, the system provides:
- Exact deviation percentage against the established baseline
- Number of consecutive abnormal operating cycles
- Multi-signal observation checklist (Voltage, Current, Power, Temperature, PF)
- Technically defensible interpretation and actionable inspection recommendation

### 🛡️ Deterministic Safety Protection Engine (Strictly Non-AI)
Hardwired comparator rules completely independent of the AI engine:
- **Overcurrent**: $I > I_{\text{limit}}$ (configurable, e.g. 7.0 A)
- **Overtemperature**: $T > T_{\text{limit}}$ (configurable, e.g. 70°C)
- **Voltage Sag/Swell**: $V < V_{\text{min}}$ or $V > V_{\text{max}}$ (configurable window)
- **Persistence Window**: Configurable temporal debounce before relay trip
- **Hardware relay response**: Physical contactor isolation in <10ms

### 📈 Progressive Wear Simulation
Gradual multi-day appliance degradation modeling:

| Day | Power Draw | Health Score | Status |
|:---|:---|:---|:---|
| Day 1 | 1180 W | 98 | Optimal |
| Day 10 | 1190 W | 95 | Minor Drift |
| Day 20 | 1210 W | 91 | Warning |
| Day 30 | 1245 W | 84 | Deviation |
| Day 40 | 1290 W | 72 | Persistent Abnormal |

### ⚗️ Fault Injection Simulation Lab
Interactive controls for injecting specific fault scenarios:
- Normal Baseline, Startup Surge, Current Deviation (+13.2%)
- Thermal Drift (+15°C), Power Factor Drop, Voltage Sag
- Voltage Fluctuation, Progressive Wear (Day slider), Critical Overload
- Network Failure (Communication module disconnect simulation)

### ⚡ Energy Intelligence & Waste Estimator
- Expected vs Actual kWh (today and projected monthly)
- **Estimated Abnormal Consumption** (clearly labeled, not a guaranteed savings claim)
- Configurable electricity tariff (₹/kWh or $/kWh)
- Real financial impact estimation from excess electrical consumption

### 🎓 Learning Mode & Commissioning Logic
- 7-day continuous baseline synthesis with progress tracking
- **Pre-Existing Fault Guard**: User must confirm *"Appliance verified healthy"* before locking the baseline
- Prevents learning degraded or already-faulty appliance behavior as "normal"
- Baseline envelope table (Min / Nominal / Max) per operating state

### 🏭 Multi-Appliance Fleet Management
5 preloaded realistic appliances with distinct electrical fingerprints:

| Asset | Category | Rated Power | Health | Status |
|:---|:---|:---|:---|:---|
| LG-AC-001 | AC Compressor | 1200 W | 87/100 | ⚠ Minor Drift |
| LG-FRIDGE-002 | Commercial Refrigerator | 180 W | 94/100 | ✅ Healthy |
| LG-PUMP-003 | Hydro-Pneumatic Pump | 750 W | 72/100 | ⚠ Warning |
| LG-WASH-004 | Front-Load Washer | 2000 W | 91/100 | ✅ Healthy |
| LG-MOTOR-005 | 3-Phase Induction Motor | 2200 W | 61/100 | 🚨 Critical |

### 🏆 Judge Demo Mode (90-Second Guided Presentation)
9-step automated walkthrough with synchronized on-screen presenter talk tracks:

| Step | Scenario | What Judges See |
|:---|:---|:---|
| 1 | Normal Operation | Baseline telemetry, optimal health, normal 3D flows |
| 2 | Startup Surge | Inrush transient captured on oscilloscope, no false alarm |
| 3 | Progressive Wear | Multi-day drift visualization and trend explanation |
| 4 | Anomaly Detection | AI identifies current +13.2% over 6 consecutive cycles |
| 5 | Explainable Alert | Transparent 5-signal observation breakdown |
| 6 | Energy Waste Estimate | Excess kWh → financial cost calculation |
| 7 | Critical Threshold | Overcurrent violation, persistence timer countdown |
| 8 | Deterministic Protection | Relay trips, 3D armature opens, power flow halts |
| 9 | Event Audit Log | Complete audit trail ready for export |

---

## 🗂️ Project Structure

```
loadguard-ai/
├── index.html                      # App entry with fonts & meta
├── package.json
├── vite.config.ts
├── tsconfig.app.json
├── tailwind.config.js              # Industrial dark theme palette
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Root layout with routing
│   ├── index.css                   # Dark industrial styles & grid
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript type definitions
│   │
│   ├── state/
│   │   └── SimulationContext.tsx   # Central state store + 10Hz tick loop
│   │
│   ├── services/
│   │   ├── simulationEngine.ts     # Physics-coupled electrical simulator
│   │   ├── aiHealthEngine.ts       # 5-vector health scoring & alerts
│   │   ├── protectionEngine.ts     # Deterministic safety rules engine
│   │   ├── learningEngine.ts       # Baseline envelope & commissioning
│   │   └── exportUtils.ts          # CSV / JSON / Printable reports
│   │
│   ├── data/
│   │   ├── defaultAppliances.ts    # 5 preloaded appliance profiles
│   │   └── hardwareComponents.ts   # 11 hardware component metadata
│   │
│   └── components/
│       ├── layout/
│       │   ├── TopNav.tsx          # Navigation bar with demo trigger
│       │   ├── Sidebar.tsx         # 10-section navigation
│       │   └── SimulationBar.tsx   # Fault injection & controls drawer
│       ├── 3d/
│       │   ├── HardwareViewer3D.tsx  # Three.js WebGL canvas
│       │   ├── ProceduralHardware.ts # 3D model builder (PCB + components)
│       │   └── FlowParticles.ts      # Animated power/data particle flows
│       ├── views/
│       │   ├── OverviewView.tsx
│       │   ├── HardwareLabView.tsx
│       │   ├── ApplianceMonitorView.tsx
│       │   ├── LearningModeView.tsx
│       │   ├── AIHealthView.tsx
│       │   ├── EnergyIntelligenceView.tsx
│       │   ├── ProtectionView.tsx
│       │   ├── EventTimelineView.tsx
│       │   ├── FleetView.tsx
│       │   └── SettingsView.tsx
│       ├── common/
│       │   ├── CircularGauge.tsx   # SVG health score gauge
│       │   ├── WaveformCanvas.tsx  # 60 FPS oscilloscope renderer
│       │   └── NotificationDropdown.tsx
│       └── demo/
│           └── JudgeDemoModal.tsx  # 9-step presentation mode
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Start
```bash
git clone https://github.com/Driven-Ansh/loadguard-ai.git
cd loadguard-ai
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 19 + TypeScript |
| **3D Graphics Engine** | Three.js (WebGL procedural rendering) |
| **Build Tool** | Vite 8.x |
| **Styling** | Tailwind CSS v3 (industrial dark theme) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🎨 Visual Design Language

| Color | Meaning |
|:---|:---|
| 🟢 `#00e676` Green | Healthy, Normal, Optimal |
| 🟡 `#ffb300` Amber | Warning, Deviation, Drift |
| 🔴 `#ff1744` Red | Critical, Tripped, Emergency |
| 🔵 `#00f0ff` Cyan | Data, Selected, Interactive |
| ⚪ Deep Navy/Black | Background, Industrial surface |

---

## ⚖️ Engineering Transparency & Honesty

This prototype explicitly adheres to the following technical principles:

- **Simulation Badge**: Every screen displays a "SIMULATION MODE (HARDWARE EMULATION)" indicator
- **No Fake Diagnosis**: The system says *"Electrical behaviour is deviating from the established profile"*, not *"AI confirms the motor is damaged"*
- **No Guaranteed Savings**: Energy excess is labeled *"Estimated Abnormal Consumption"*, not guaranteed savings
- **AI ≠ Safety**: The AI health engine provides diagnostics only. Electrical safety is handled by a completely separate deterministic comparator engine
- **No Real Mains Control**: This GUI prototype does not and cannot control real electrical mains equipment

---

## 📄 License

This project is built as a competition prototype. All rights reserved.

---

<p align="center">
  Built with ⚡ for innovation competitions
  <br/>
  <strong>LOADGUARD AI</strong> — Measure. Learn. Understand. Detect. Explain. Estimate. Protect.
</p>
