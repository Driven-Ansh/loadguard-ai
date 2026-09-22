import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  RotateCcw, 
  Flame, 
  Zap, 
  Activity, 
  Clock, 
  Lock, 
  Unlock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const ProtectionView: React.FC = () => {
  const {
    activeAppliance,
    telemetry,
    protectionState,
    resetProtection,
    manualTripProtection,
    setActiveSection
  } = useSimulation();

  const cfg = activeAppliance.protection;
  const isTripped = protectionState.status === 'TRIPPED';
  const isPending = protectionState.status === 'CRITICAL_PENDING';

  // Safety margins
  const currentMargin = Math.max(0, cfg.maxCurrentLimit - telemetry.current);
  const currentPctOfLimit = Math.min(150, (telemetry.current / cfg.maxCurrentLimit) * 100);

  const tempMargin = Math.max(0, cfg.maxTemperatureLimit - telemetry.temperature);
  const tempPctOfLimit = Math.min(150, (telemetry.temperature / cfg.maxTemperatureLimit) * 100);

  const isVoltageOk = telemetry.voltage >= cfg.minVoltageLimit && telemetry.voltage <= cfg.maxVoltageLimit;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              DETERMINISTIC SAFETY & ELECTRICAL PROTECTION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
              NON-AI SAFETY CORE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Deterministic Rules Engine & Contactor Control
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Hardwired Sub-Cycle Comparator • Microsecond Fault Detection • Mechanical Air-Gap Isolation
          </p>
        </div>

        {/* Protection Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
            isTripped 
              ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-glow-red animate-pulse' 
              : isPending 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-glow-amber' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-green'
          }`}>
            {isTripped ? <AlertOctagon size={18} /> : isPending ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
            <span>PROTECTION STATUS: {protectionState.status}</span>
          </div>
        </div>
      </div>

      {/* Tripped / Critical Banner Alert */}
      {isTripped && (
        <div className="p-6 rounded-2xl bg-red-500/15 border-2 border-red-500 shadow-glow-red text-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-300 font-bold font-mono text-sm sm:text-base">
              <AlertOctagon size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>CRITICAL ELECTRICAL CONDITION — PROTECTION TRIGGERED</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-700 font-bold">
              LOAD DISCONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono mb-4">
            Violation: <b>{protectionState.activeViolation || 'Deterministic parameter threshold exceeded'}</b>
            <br />
            Action: <b>High-Speed Latching Contactor Opened. Load isolated from mains supply in &lt;10ms.</b>
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={resetProtection}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-industrial-950 font-mono font-bold text-xs hover:from-emerald-400 hover:to-green-500 transition shadow-glow-green flex items-center gap-2"
            >
              <RotateCcw size={15} /> RESET CONTACTOR & RE-ARM SAFETY
            </button>
            <button
              onClick={() => setActiveSection('hardware-lab')}
              className="px-4 py-2.5 rounded-xl bg-industrial-950 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition"
            >
              Inspect 3D Relay Armature →
            </button>
          </div>
        </div>
      )}

      {/* Pending Trip Countdown Banner */}
      {isPending && (
        <div className="p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500 shadow-glow-amber text-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono">
              <ShieldAlert size={20} className="animate-pulse" />
              <span>LIMIT VIOLATION DETECTED — PERSISTENCE WINDOW ENGAGED</span>
            </div>
            <span className="text-sm font-mono px-3 py-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-700 animate-pulse">
              TRIP IN: {protectionState.tripCountdownSeconds.toFixed(1)}s
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Active condition: <b className="text-white">{protectionState.activeViolation}</b>.
            If sustained continuously through the configured temporal persistence window, the safety relay will open.
          </p>
        </div>
      )}

      {/* Deterministic Rules & Live Margins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rule 1: Maximum Current */}
        <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs font-mono">
              <span className="text-slate-400 uppercase">RULE 1: OVERCURRENT</span>
              <span className={telemetry.current > cfg.maxCurrentLimit ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {telemetry.current > cfg.maxCurrentLimit ? 'EXCEEDED' : 'SAFE'}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-2">
              <div>
                <span className="text-xs font-mono text-slate-400">Current:</span>
                <div className={`text-2xl font-bold font-mono ${telemetry.current > cfg.maxCurrentLimit ? 'text-red-400' : 'text-white'}`}>
                  {telemetry.current.toFixed(2)} A
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Limit:</span>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {cfg.maxCurrentLimit.toFixed(1)} A
                </div>
              </div>
            </div>

            <div className="w-full bg-industrial-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, currentPctOfLimit)}%`,
                  backgroundColor: currentPctOfLimit > 100 ? '#ff1744' : currentPctOfLimit > 85 ? '#ffb300' : '#00e676'
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Safety Margin:</span>
            <span className="font-bold text-white">{currentMargin.toFixed(2)} A</span>
          </div>
        </div>

        {/* Rule 2: Maximum Temperature */}
        <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs font-mono">
              <span className="text-slate-400 uppercase">RULE 2: OVERTEMPERATURE</span>
              <span className={telemetry.temperature > cfg.maxTemperatureLimit ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {telemetry.temperature > cfg.maxTemperatureLimit ? 'EXCEEDED' : 'SAFE'}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-2">
              <div>
                <span className="text-xs font-mono text-slate-400">Temperature:</span>
                <div className={`text-2xl font-bold font-mono ${telemetry.temperature > cfg.maxTemperatureLimit ? 'text-red-400' : 'text-white'}`}>
                  {telemetry.temperature.toFixed(1)} °C
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Limit:</span>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {cfg.maxTemperatureLimit.toFixed(1)} °C
                </div>
              </div>
            </div>

            <div className="w-full bg-industrial-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, tempPctOfLimit)}%`,
                  backgroundColor: tempPctOfLimit > 100 ? '#ff1744' : tempPctOfLimit > 85 ? '#ffb300' : '#00e676'
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Safety Margin:</span>
            <span className="font-bold text-white">{tempMargin.toFixed(1)} °C</span>
          </div>
        </div>

        {/* Rule 3: Voltage Window & Persistence */}
        <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs font-mono">
              <span className="text-slate-400 uppercase">RULE 3: VOLTAGE SAG/SWELL</span>
              <span className={isVoltageOk ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                {isVoltageOk ? 'IN WINDOW' : 'OUT OF RANGE'}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-2">
              <div>
                <span className="text-xs font-mono text-slate-400">Line Voltage:</span>
                <div className={`text-2xl font-bold font-mono ${isVoltageOk ? 'text-white' : 'text-red-400'}`}>
                  {telemetry.voltage.toFixed(1)} V
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Range:</span>
                <div className="text-sm font-bold font-mono text-cyan-400">
                  {cfg.minVoltageLimit}V — {cfg.maxVoltageLimit}V
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800 text-[11px] font-mono text-slate-300 mt-2">
              Persistence Window: <b className="text-cyan-400">{cfg.persistenceSeconds} seconds</b>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Trip Delay Counter:</span>
            <span className="font-bold text-white">{protectionState.tripCountdownSeconds.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Contactor Mechanical Armature Visual Status Card */}
      <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              HARDWARE SWITCHING SUBSYSTEM
            </div>
            <div className="text-base font-bold text-white">
              Deterministic High-Current Latching Contactor State
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={manualTripProtection}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-mono text-xs hover:bg-red-500/30 transition flex items-center gap-1.5"
            >
              <AlertOctagon size={13} /> Manual Emergency Trip
            </button>
            <button
              onClick={resetProtection}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs hover:bg-emerald-500/30 transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Reset Contactor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Visual Schematic representation of Contact Blade */}
          <div className="p-6 rounded-xl bg-industrial-950 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-3">
              PHYSICAL CONTACT POSITION
            </div>

            {/* SVG Schematic of Relay */}
            <div className="relative w-48 h-24 flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Fixed terminals */}
                <circle cx="30" cy="50" r="6" fill="#cc9933" />
                <line x1="10" y1="50" x2="30" y2="50" stroke="#00a8ff" strokeWidth="4" />
                <text x="15" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace">MAINS</text>

                <circle cx="170" cy="50" r="6" fill="#cc9933" />
                <line x1="170" y1="50" x2="190" y2="50" stroke={isTripped ? "#64748b" : "#00f0ff"} strokeWidth="4" />
                <text x="160" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace">LOAD</text>

                {/* Moving Blade */}
                <line
                  x1="30"
                  y1="50"
                  x2={isTripped ? "150" : "170"}
                  y2={isTripped ? "20" : "50"}
                  stroke={isTripped ? "#ff1744" : "#00e676"}
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ transition: 'all 0.3s ease-out' }}
                />
              </svg>
            </div>

            <div className={`mt-2 font-mono font-bold text-sm ${isTripped ? 'text-red-400' : 'text-emerald-400'}`}>
              CONTACTOR IS {isTripped ? 'OPEN (DISCONNECTED)' : 'CLOSED (ENERGIZED)'}
            </div>
          </div>

          {/* Technical Specifications of Switching Core */}
          <div className="md:col-span-2 space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded bg-industrial-950 border border-slate-800">
              <span className="text-slate-400">Contactor Type:</span>
              <span className="text-slate-200">Bistable Dual-Coil Polarized Latching Relay</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-industrial-950 border border-slate-800">
              <span className="text-slate-400">Contact Rating:</span>
              <span className="text-slate-200">16 A Continuous / 250 VAC AgSnO2 Silver Contacts</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-industrial-950 border border-slate-800">
              <span className="text-slate-400">Trip Actuation Time:</span>
              <span className="text-cyan-400 font-bold">&lt; 8.5 ms (Full galvanic break)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-industrial-950 border border-slate-800">
              <span className="text-slate-400">Dielectric Isolation:</span>
              <span className="text-slate-200">2,500 VAC RMS (Between coil and contact circuit)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
