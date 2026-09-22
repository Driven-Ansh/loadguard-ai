import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { FaultScenario, OperatingState } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  TrendingUp, 
  ZapOff, 
  AlertOctagon, 
  ShieldAlert, 
  Radio, 
  Sliders, 
  Calendar,
  X
} from 'lucide-react';

interface SimulationBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({ isOpen, onClose }) => {
  const {
    isPlaying,
    setIsPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    faultScenario,
    setFaultScenario,
    faultIntensity,
    setFaultIntensity,
    progressiveWearDay,
    setProgressiveWearDay,
    targetState,
    setTargetState,
    resetSimulation,
    resetProtection,
    manualTripProtection,
    protectionState,
    telemetry
  } = useSimulation();

  if (!isOpen) return null;

  const OPERATING_STATES: OperatingState[] = [
    'IDLE', 
    'STARTUP', 
    'NORMAL', 
    'HIGH_LOAD', 
    'COOLDOWN', 
    'SHUTDOWN'
  ];

  const FAULT_BUTTONS: { id: FaultScenario; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'NONE', label: 'Normal Baseline', icon: RotateCcw },
    { id: 'STARTUP_SURGE', label: 'Startup Surge', icon: TrendingUp },
    { id: 'CURRENT_DEVIATION', label: 'Current Increase (+13%)', icon: TrendingUp },
    { id: 'THERMAL_DRIFT', label: 'Temperature Rise (+15°C)', icon: Flame },
    { id: 'POWER_FACTOR_DROP', label: 'Power Factor Drop', icon: ZapOff },
    { id: 'VOLTAGE_SAG', label: 'Low Voltage Sag', icon: ZapOff },
    { id: 'VOLTAGE_FLUCTUATION', label: 'Voltage Fluctuation', icon: ZapOff },
    { id: 'PROGRESSIVE_WEAR', label: 'Progressive Wear (Multi-Day)', icon: Calendar },
    { id: 'CRITICAL_OVERLOAD', label: 'Critical Overload (>7.0A)', icon: AlertOctagon },
    { id: 'NETWORK_FAILURE', label: 'Network Disconnected', icon: Radio },
  ];

  return (
    <div className="border-b border-cyan-500/30 bg-industrial-900/98 backdrop-blur-xl px-4 py-3 text-xs select-none shadow-2xl z-20">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-electric-cyan" />
          <span className="font-mono font-bold text-white tracking-wide">
            HARDWARE SIMULATION & FAULT INJECTION LAB
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            STATE-COUPLED PHYSICS
          </span>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Playback & Speed Controls */}
        <div className="bg-industrial-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
            Engine Controls
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 py-1.5 px-3 rounded flex items-center justify-center gap-1.5 font-mono font-semibold transition ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {isPlaying ? <><Pause size={14} /> PAUSE</> : <><Play size={14} /> RUN</>}
            </button>
            <button
              onClick={resetSimulation}
              className="py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition flex items-center gap-1"
              title="Reset All Telemetry to Initial Baseline"
            >
              <RotateCcw size={13} /> RESET
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">SPEED:</span>
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded ${speedMultiplier === s ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* 2. Appliance Operating State Selector */}
        <div className="bg-industrial-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
            <span>Operating State</span>
            <span className="text-cyan-400 font-bold">{targetState}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {OPERATING_STATES.map((st) => (
              <button
                key={st}
                onClick={() => setTargetState(st)}
                className={`py-1 px-1 rounded text-[10px] font-mono transition truncate text-center ${
                  targetState === st 
                    ? 'bg-cyan-500/25 text-electric-cyan border border-cyan-500/50 font-bold shadow-glow-cyan' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Progressive Wear & Intensity Sliders */}
        <div className="bg-industrial-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">FAULT INTENSITY:</span>
              <span className="text-electric-cyan font-bold">{Math.round(faultIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={faultIntensity}
              onChange={(e) => setFaultIntensity(parseFloat(e.target.value))}
              className="w-full accent-electric-cyan cursor-pointer"
            />
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">PROGRESSIVE WEAR DAY:</span>
              <span className="text-amber-400 font-bold">DAY {progressiveWearDay} / 40</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={progressiveWearDay}
              onChange={(e) => {
                setProgressiveWearDay(parseInt(e.target.value));
                setFaultScenario('PROGRESSIVE_WEAR');
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Deterministic Protection Override Controls */}
        <div className="bg-industrial-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
            <span>Deterministic Safety</span>
            <span className={`font-bold ${protectionState.status === 'TRIPPED' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {protectionState.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={manualTripProtection}
              className="flex-1 py-1.5 px-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold transition flex items-center justify-center gap-1"
            >
              <ShieldAlert size={12} /> TRIP CONTACTOR
            </button>
            <button
              onClick={resetProtection}
              className="flex-1 py-1.5 px-2 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition flex items-center justify-center gap-1"
            >
              <RotateCcw size={12} /> RESET RELAY
            </button>
          </div>

          <div className="mt-1 text-[9px] font-mono text-slate-400">
            Relay: <span className="text-white font-bold">{protectionState.relayPosition}</span> • Trip Window: <span className="text-white">{protectionState.tripCountdownSeconds.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Selectable Fault Scenarios Matrix */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          FAULTS:
        </span>
        {FAULT_BUTTONS.map((fb) => {
          const Icon = fb.icon;
          const isActive = faultScenario === fb.id;
          return (
            <button
              key={fb.id}
              onClick={() => setFaultScenario(fb.id)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition ${
                isActive 
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 font-semibold shadow-glow-amber' 
                  : 'bg-industrial-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon size={12} />
              <span>{fb.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
