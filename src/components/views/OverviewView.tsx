import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { CircularGauge } from '../common/CircularGauge';
import { HardwareViewer3D } from '../3d/HardwareViewer3D';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { 
  Zap, 
  Activity, 
  Gauge, 
  Flame, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    activeAppliance,
    telemetry,
    health,
    protectionState,
    explainableAlert,
    energyMetrics,
    setActiveSection,
    setIsJudgeDemoOpen,
    setJudgeDemoStep
  } = useSimulation();

  const isTripped = protectionState.status === 'TRIPPED';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-industrial-900 via-industrial-850 to-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              EXECUTIVE TELEMETRY OVERVIEW
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
              ASSET: {activeAppliance.assetTag}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeAppliance.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Intelligent Load Baseline • Continuous Thermal-Electrical Physics • Deterministic Safety
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('hardware-lab')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-industrial-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-xs font-mono transition"
          >
            <Layers size={15} /> 3D Hardware Lab
          </button>
          <button
            onClick={() => {
              setJudgeDemoStep(1);
              setIsJudgeDemoOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/60 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold shadow-glow-amber transition"
          >
            <Sparkles size={15} /> Guided Demo (90s)
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Health & Telemetry Card + 3D Hardware Digital Twin Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Circular Health & Appliance Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-industrial-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Subtle tech background grid */}
            <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    APPLIANCE HEALTH SCORE
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Multi-Vector AI Evaluation
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isTripped 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                    : explainableAlert.hasActiveAlert 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  <span>{isTripped ? 'PROTECTION TRIPPED' : activeAppliance.status}</span>
                </div>
              </div>

              {/* Large Circular Gauge */}
              <div className="my-4 flex justify-center">
                <CircularGauge
                  value={health.overall}
                  size={190}
                  strokeWidth={15}
                  statusText={health.statusText}
                />
              </div>

              {/* 5 Health Vectors Bar Progress */}
              <div className="space-y-2 mt-6 pt-4 border-t border-slate-800/80">
                {[
                  { label: 'Electrical Stability', val: health.electricalStability },
                  { label: 'Energy Efficiency', val: health.energyEfficiency },
                  { label: 'Thermal Behaviour', val: health.thermalBehaviour },
                  { label: 'Operating Consistency', val: health.operatingConsistency },
                  { label: 'Power Quality', val: health.powerQuality }
                ].map((dim) => (
                  <div key={dim.label} className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{dim.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-industrial-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${dim.val}%`,
                            backgroundColor: dim.val > 80 ? '#00e676' : dim.val > 60 ? '#ffb300' : '#ff1744'
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-bold text-slate-200">{dim.val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Commissioning: <b className="text-emerald-400">VERIFIED</b>
              </span>
              <button 
                onClick={() => setActiveSection('ai-health')}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 hover:underline"
              >
                Explain AI Diagnosis <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick Alert Card */}
          {explainableAlert.hasActiveAlert && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-mono shadow-glow-amber">
              <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                <span>⚠ {explainableAlert.headline}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">{explainableAlert.severity}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                {explainableAlert.primaryReason}
              </p>
              <button
                onClick={() => setActiveSection('ai-health')}
                className="text-[10px] text-cyan-300 hover:underline font-bold"
              >
                Inspect 5 Supporting Observations →
              </button>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Live 3D Hardware Twin Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="h-[420px] bg-industrial-900/90 rounded-2xl border border-slate-800 p-3 shadow-xl flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-electric-cyan" />
                <span className="font-mono text-xs font-bold text-white">
                  HARDWARE DIGITAL TWIN (INTERACTIVE 3D)
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                DRAG TO ROTATE • WHEEL TO ZOOM
              </span>
            </div>

            <div className="flex-1 w-full h-full relative">
              <HardwareViewer3D compact={true} />
            </div>
          </div>

          {/* Mini Waveform preview */}
          <WaveformCanvas height={110} />
        </div>
      </div>

      {/* Primary Electrical Measurements Grid (Section 4 requested values) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Voltage', value: `${telemetry.voltage.toFixed(1)} V`, sub: 'Nominal 230V', icon: Activity, color: 'text-sky-400' },
          { label: 'Current', value: `${telemetry.current.toFixed(2)} A`, sub: 'Rated 5.4A', icon: Zap, color: telemetry.current > 6.0 ? 'text-amber-400' : 'text-emerald-400' },
          { label: 'Real Power', value: `${(telemetry.realPower / 1000).toFixed(2)} kW`, sub: `${telemetry.realPower} W`, icon: Gauge, color: 'text-purple-400' },
          { label: 'Power Factor', value: `${telemetry.powerFactor.toFixed(2)}`, sub: 'Target > 0.90', icon: TrendingUp, color: telemetry.powerFactor < 0.85 ? 'text-amber-400' : 'text-cyan-400' },
          { label: 'Frequency', value: `${telemetry.frequency.toFixed(2)} Hz`, sub: 'Grid Sync 50Hz', icon: Activity, color: 'text-slate-200' },
          { label: 'Temperature', value: `${telemetry.temperature.toFixed(1)} °C`, sub: 'Max limit 70°C', icon: Flame, color: telemetry.temperature > 55 ? 'text-amber-400' : 'text-emerald-400' },
          { label: 'Energy Today', value: `${telemetry.energyToday.toFixed(2)} kWh`, sub: `+${energyMetrics.estimatedExcessKwh.toFixed(2)} kWh excess`, icon: Zap, color: 'text-electric-cyan' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-3.5 rounded-xl bg-industrial-900 border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                <span>{m.label}</span>
                <Icon size={13} className={m.color} />
              </div>
              <div className={`text-xl font-bold font-mono tracking-tight ${m.color}`}>
                {m.value}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
