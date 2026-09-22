import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { CircularGauge } from '../common/CircularGauge';
import { 
  BrainCircuit, 
  HelpCircle, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Activity, 
  Zap, 
  Info,
  Layers
} from 'lucide-react';

export const AIHealthView: React.FC = () => {
  const {
    activeAppliance,
    health,
    explainableAlert,
    telemetry
  } = useSimulation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              AI APPLIANCE HEALTH ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              MULTI-VECTOR ANOMALY DETECTION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Explainable Appliance Health & Anomaly Diagnostics
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Deterministic Metric Grounding • Empirical Multi-Signal Fusion • Zero Hallucinations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-industrial-950 border border-slate-700 text-xs font-mono">
            <span>MODEL: </span>
            <span className="text-cyan-400 font-bold">EDGE-ISOLATION-V4</span>
          </div>
        </div>
      </div>

      {/* Main Health Card & Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Health & Trend (5 cols) */}
        <div className="lg:col-span-5 bg-industrial-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              COMPOSITE HEALTH SCORE
            </div>
            <div className="text-lg font-bold text-white mb-4">
              {health.statusText}
            </div>

            <div className="my-2 flex justify-center">
              <CircularGauge
                value={health.overall}
                size={180}
                strokeWidth={14}
                statusText={health.statusText}
              />
            </div>

            {/* 7-Day Trend Sparkline / Bar Graph */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>7-DAY HEALTH HISTORY</span>
                <span>Baseline = 100</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 items-end h-20 pt-2">
                {health.trendHistory.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-mono text-slate-400">{item.score}</span>
                    <div 
                      className="w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${(item.score / 100) * 100}%`,
                        backgroundColor: item.score > 80 ? '#00e676' : item.score > 60 ? '#ffb300' : '#ff1744'
                      }}
                    />
                    <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                      {item.day.replace('Day ', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            * Health scores are strictly derived from empirical electrical measurements.
          </div>
        </div>

        {/* Right: 5 Explainable Dimensions (7 cols) */}
        <div className="lg:col-span-7 bg-industrial-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  HEALTH SCORE BREAKDOWN
                </div>
                <div className="text-base font-bold text-white">
                  Five Independent Electrical Dimensions
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                WEIGHTED FUSION
              </span>
            </div>

            <div className="space-y-4">
              {[
                { 
                  name: 'Electrical Stability', 
                  score: health.electricalStability, 
                  desc: 'Compares real-time RMS voltage sag/swell and current variance against learned nominal limits.',
                  detail: `${telemetry.voltage.toFixed(1)}V RMS (${Math.abs(telemetry.voltage - activeAppliance.baseline.nominalVoltage).toFixed(1)}V offset)` 
                },
                { 
                  name: 'Energy Efficiency', 
                  score: health.energyEfficiency, 
                  desc: 'Evaluates real power draw per operating state relative to the 7-day empirical baseline power envelope.',
                  detail: `${telemetry.realPower}W (Baseline: ${activeAppliance.baseline.stateBaselines[telemetry.operatingState]?.power || activeAppliance.baseline.nominalPower}W)` 
                },
                { 
                  name: 'Thermal Behaviour', 
                  score: health.thermalBehaviour, 
                  desc: 'Tracks dynamic temperature rise vs expected thermal equilibrium curve (I²R heating model).',
                  detail: `${telemetry.temperature.toFixed(1)}°C (Thermal drift: +${Math.max(0, telemetry.temperature - 36.5).toFixed(1)}°C)` 
                },
                { 
                  name: 'Operating Consistency', 
                  score: health.operatingConsistency, 
                  desc: 'Verifies duty-cycle durations, startup transient decay time constants, and state transitions.',
                  detail: `Current state: ${telemetry.operatingState} (PF: ${telemetry.powerFactor.toFixed(2)})` 
                },
                { 
                  name: 'Power Quality', 
                  score: health.powerQuality, 
                  desc: 'Calculates power factor degradation, harmonic ripple indicators, and utility grid frequency sync.',
                  detail: `PF: ${telemetry.powerFactor.toFixed(2)} • Freq: ${telemetry.frequency.toFixed(2)} Hz` 
                }
              ].map((dim) => (
                <div key={dim.name} className="p-3 rounded-xl bg-industrial-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-white">{dim.name}</span>
                    <span className="font-bold" style={{
                      color: dim.score > 80 ? '#00e676' : dim.score > 60 ? '#ffb300' : '#ff1744'
                    }}>
                      {dim.score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dim.score}%`,
                        backgroundColor: dim.score > 80 ? '#00e676' : dim.score > 60 ? '#ffb300' : '#ff1744'
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
                    <p className="leading-snug">{dim.desc}</p>
                    <span className="font-mono text-cyan-400 text-[10px] shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {dim.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Major Explainable AI Panel: "WHY AM I GETTING THIS ALERT?" (Requirement 15) */}
      <div className="p-6 rounded-2xl bg-industrial-900 border-2 border-amber-500/50 shadow-glow-amber">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-amber-400" />
            <h3 className="font-bold text-lg text-white font-mono tracking-wide">
              WHY AM I GETTING THIS ALERT?
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
            {explainableAlert.headline}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reason & Persistence */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                PRIMARY DETECTION REASON
              </div>
              <div className="text-sm font-semibold text-white leading-relaxed font-sans">
                {explainableAlert.primaryReason}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                PERSISTENCE WINDOW
              </div>
              <div className="text-sm font-mono text-slate-200">
                Observed over <b className="text-white">{explainableAlert.persistenceCycles} consecutive operating cycles</b>.
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Filtered through 3-stage temporal debouncing to eliminate false positive transients.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
                DEVIATION INTERPRETATION
              </div>
              <div className="text-xs text-slate-200 leading-relaxed font-sans">
                "{explainableAlert.interpretation}"
              </div>
            </div>
          </div>

          {/* Supporting Observations Checklist & Recommendation */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">
                SUPPORTING TELEMETRY OBSERVATIONS
              </div>
              <div className="space-y-2">
                {explainableAlert.observations.map((obs, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-900 last:border-none">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={obs.isAbnormal ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {obs.isAbnormal ? '⚠' : '✓'}
                      </span>
                      {obs.label}
                    </span>
                    <span className={`text-[11px] ${obs.isAbnormal ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                      {obs.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
              <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Info size={13} /> ACTIONABLE ENGINEERING RECOMMENDATION
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                "{explainableAlert.recommendation}"
              </p>
            </div>
          </div>
        </div>

        {/* Engineering Honesty Banner */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>* TECHNICAL TRANSPARENCY: AI identifies electrical signature drift. Physical mechanical diagnosis requires certified onsite inspection.</span>
          <span className="text-slate-400">Deterministic Safety Engine armed independently</span>
        </div>
      </div>
    </div>
  );
};
