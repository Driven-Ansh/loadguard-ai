import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { 
  Activity, 
  Zap, 
  Flame, 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  CheckCircle,
  Clock
} from 'lucide-react';

export const ApplianceMonitorView: React.FC = () => {
  const {
    activeAppliance,
    telemetry,
    telemetryHistory,
    targetState,
    setTargetState,
    explainableAlert
  } = useSimulation();

  const [activeSignals, setActiveSignals] = useState<{
    voltage: boolean;
    current: boolean;
    power: boolean;
    temperature: boolean;
    pf: boolean;
  }>({
    voltage: true,
    current: true,
    power: true,
    temperature: true,
    pf: true
  });

  const base = activeAppliance.baseline.stateBaselines[telemetry.operatingState] || activeAppliance.baseline.stateBaselines.NORMAL;
  const currentDiffPct = ((telemetry.current - base.current) / (base.current || 1)) * 100;
  const powerDiffPct = ((telemetry.realPower - base.power) / (base.power || 1)) * 100;
  const tempDiffC = telemetry.temperature - base.temperature;

  const isMultiSignalDeviation = currentDiffPct > 8 && tempDiffC > 3 && powerDiffPct > 8;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              REAL-TIME INSTRUMENTATION & WAVEFORM MONITOR
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {activeAppliance.name} — Live Electrical Diagnostics
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Sub-cycle ADC Sampling • Synchronized Vector Analysis • Correlated Thermal Response
          </p>
        </div>

        {/* Current State Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">STATE:</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-electric-cyan border border-cyan-500/40 text-xs font-mono font-bold shadow-glow-cyan">
            {telemetry.operatingState}
          </span>
        </div>
      </div>

      {/* Multi-Signal Deviation Alert Banner (Requirement 18) */}
      {isMultiSignalDeviation && (
        <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/60 shadow-glow-amber text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
            <AlertTriangle size={16} />
            <span>MULTI-SIGNAL CORRELATED DEVIATION DETECTED</span>
          </div>
          <div className="text-slate-300 mb-2 leading-relaxed">
            Interpretation: Electrical and thermal behaviour are both deviating from baseline simultaneously.
            Current (<b>+{currentDiffPct.toFixed(1)}%</b>), Real Power (<b>+{powerDiffPct.toFixed(1)}%</b>), and Temperature (<b>+{tempDiffC.toFixed(1)}°C</b>) exhibit coupled upward drift.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-amber-200">
            <span>✓ Current ↑</span>
            <span>✓ Power ↑</span>
            <span>✓ Temperature ↑</span>
            <span className="text-slate-400 italic">No specific mechanical breakdown claimed. Inspection suggested.</span>
          </div>
        </div>
      )}

      {/* High-Speed Real-time Oscilloscope */}
      <WaveformCanvas height={220} />

      {/* Operating State Recognition Module (Requirement 13) */}
      <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              OPERATING STATE RECOGNITION
            </div>
            <div className="text-sm font-bold text-white">
              Instantaneous State Baseline Deviation Comparison
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Current State: <b className="text-electric-cyan">{telemetry.operatingState}</b>
          </span>
        </div>

        {/* State Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {(['IDLE', 'STARTUP', 'NORMAL', 'HIGH_LOAD', 'COOLDOWN', 'SHUTDOWN'] as const).map((st) => {
            const isActive = telemetry.operatingState === st;
            return (
              <button
                key={st}
                onClick={() => setTargetState(st)}
                className={`p-2.5 rounded-xl border text-center transition font-mono ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-electric-cyan shadow-glow-cyan font-bold'
                    : 'bg-industrial-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] uppercase text-slate-500 mb-0.5">● STATE</div>
                <div className="text-xs">{st}</div>
              </button>
            );
          })}
        </div>

        {/* Live Comparison for Active State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">LOAD CURRENT</div>
            <div className="text-xl font-bold font-mono text-white">
              {telemetry.current.toFixed(2)} A
            </div>
            <div className={`text-xs font-mono mt-1 ${currentDiffPct > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentDiffPct >= 0 ? '+' : ''}{currentDiffPct.toFixed(1)}% vs baseline ({base.current.toFixed(2)}A)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">REAL POWER</div>
            <div className="text-xl font-bold font-mono text-white">
              {telemetry.realPower} W
            </div>
            <div className={`text-xs font-mono mt-1 ${powerDiffPct > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {powerDiffPct >= 0 ? '+' : ''}{powerDiffPct.toFixed(1)}% vs baseline ({base.power}W)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">TEMPERATURE</div>
            <div className="text-xl font-bold font-mono text-white">
              {telemetry.temperature.toFixed(1)} °C
            </div>
            <div className={`text-xs font-mono mt-1 ${tempDiffC > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {tempDiffC >= 0 ? '+' : ''}{tempDiffC.toFixed(1)} °C vs baseline ({base.temperature}°C)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">OPERATING STATUS</div>
            <div className="text-xl font-bold font-mono">
              <span className={explainableAlert.hasActiveAlert ? 'text-amber-400' : 'text-emerald-400'}>
                {explainableAlert.hasActiveAlert ? 'ABNORMAL' : 'NORMAL'}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Envelope tolerance ±8%
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Signal Correlation Timeline History (Requirement 18) */}
      <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              MULTI-SIGNAL CORRELATION ENGINE
            </div>
            <div className="text-sm font-bold text-white">
              Simultaneous Multi-Vector Telemetry Overlay (Last 60 Samples)
            </div>
          </div>

          {/* Toggle buttons for multi-signal overlay */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] flex-wrap">
            <button
              onClick={() => setActiveSignals(s => ({ ...s, current: !s.current }))}
              className={`px-2 py-0.5 rounded border transition ${
                activeSignals.current ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-slate-500 border-slate-800'
              }`}
            >
              CURRENT
            </button>
            <button
              onClick={() => setActiveSignals(s => ({ ...s, power: !s.power }))}
              className={`px-2 py-0.5 rounded border transition ${
                activeSignals.power ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'text-slate-500 border-slate-800'
              }`}
            >
              POWER
            </button>
            <button
              onClick={() => setActiveSignals(s => ({ ...s, temperature: !s.temperature }))}
              className={`px-2 py-0.5 rounded border transition ${
                activeSignals.temperature ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-500 border-slate-800'
              }`}
            >
              TEMPERATURE
            </button>
            <button
              onClick={() => setActiveSignals(s => ({ ...s, voltage: !s.voltage }))}
              className={`px-2 py-0.5 rounded border transition ${
                activeSignals.voltage ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'text-slate-500 border-slate-800'
              }`}
            >
              VOLTAGE
            </button>
            <button
              onClick={() => setActiveSignals(s => ({ ...s, pf: !s.pf }))}
              className={`px-2 py-0.5 rounded border transition ${
                activeSignals.pf ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-slate-500 border-slate-800'
              }`}
            >
              POWER FACTOR
            </button>
          </div>
        </div>

        {/* Mini SVG Trend Timeline chart */}
        <div className="h-44 w-full bg-industrial-950 rounded-xl border border-slate-800 p-2 relative flex items-end">
          <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
            {/* Draw grid lines */}
            <line x1="0" y1="37" x2="600" y2="37" stroke="#121d36" strokeDasharray="3 3" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="#121d36" strokeDasharray="3 3" />
            <line x1="0" y1="112" x2="600" y2="112" stroke="#121d36" strokeDasharray="3 3" />

            {/* Current Path (Green/Amber) */}
            {activeSignals.current && telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#00e676"
                strokeWidth="2"
                points={telemetryHistory.map((t, idx) => {
                  const x = (idx / 59) * 600;
                  const y = 150 - Math.min(140, (t.current / 8.0) * 140);
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}

            {/* Temperature Path (Amber) */}
            {activeSignals.temperature && telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#ffb300"
                strokeWidth="2"
                strokeDasharray="4 2"
                points={telemetryHistory.map((t, idx) => {
                  const x = (idx / 59) * 600;
                  const y = 150 - Math.min(140, (t.temperature / 80.0) * 140);
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}

            {/* Power Factor Path (Cyan) */}
            {activeSignals.pf && telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#00f0ff"
                strokeWidth="1.5"
                points={telemetryHistory.map((t, idx) => {
                  const x = (idx / 59) * 600;
                  const y = 150 - (t.powerFactor * 130);
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
          </svg>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>T - 60s</span>
          <span>T - 30s</span>
          <span>LIVE INSTANTANEOUS</span>
        </div>
      </div>
    </div>
  );
};
