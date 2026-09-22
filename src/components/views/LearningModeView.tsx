import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { 
  GraduationCap, 
  CheckCircle, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  Zap, 
  Activity, 
  Layers, 
  Calendar 
} from 'lucide-react';

export const LearningModeView: React.FC = () => {
  const {
    activeAppliance,
    setCommissionVerified,
    setActiveSection,
    resetSimulation
  } = useSimulation();

  const baseline = activeAppliance.baseline;
  const [isCommissioningChecked, setIsCommissioningChecked] = useState<boolean>(baseline.isCommissionVerified);

  const handleCommissionToggle = (checked: boolean) => {
    setIsCommissioningChecked(checked);
    setCommissionVerified(checked);
  };

  const PARAMETERS = [
    { name: 'Load Current', unit: 'A', status: 'LEARNED', value: `${baseline.nominalCurrent.toFixed(2)} A` },
    { name: 'Real Power Draw', unit: 'W', status: 'LEARNED', value: `${baseline.nominalPower} W` },
    { name: 'Power Factor', unit: 'PF', status: 'LEARNED', value: `${baseline.nominalPowerFactor.toFixed(2)}` },
    { name: 'Start-up Inrush Surge', unit: 'A Peak', status: 'LEARNED', value: `${baseline.startupSurgeMax.toFixed(1)} A` },
    { name: 'Cycle Operating Duration', unit: 'Min', status: 'LEARNED', value: `${baseline.cycleDurationAvg} mins` },
    { name: 'Equilibrium Temperature', unit: '°C', status: 'LEARNED', value: `${baseline.nominalTemperature.toFixed(1)} °C` },
    { name: 'Energy Consumption Rate', unit: 'kWh/cycle', status: 'LEARNED', value: '1.24 kWh' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              LOADGUARD LEARNING MODE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              BASELINE ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Learning Your Appliance's Normal Electrical Behaviour
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            7-Day Continuous Envelope Synthesis • Operating State Clustering • Commissioning Quality Validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('appliance-monitor')}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-industrial-950 font-bold font-mono text-xs hover:bg-cyan-400 transition shadow-glow-cyan"
          >
            ACTIVATE MONITORING
          </button>
        </div>
      </div>

      {/* Progress & Key Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800 shadow-lg">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">LEARNING PROGRESS</div>
          <div className="text-2xl font-extrabold font-mono text-electric-cyan">
            {baseline.learningProgress}%
          </div>
          <div className="w-full bg-industrial-950 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${baseline.learningProgress}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-2">
            Status: Baseline established ✓
          </div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800 shadow-lg">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">OBSERVATION WINDOW</div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {baseline.daysLearned} / {baseline.totalDaysTarget} DAYS
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1.5">
            <Calendar size={13} className="text-cyan-400" />
            <span>Full 168-hour continuous cycle</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800 shadow-lg">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">CYCLES OBSERVED</div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {baseline.cyclesObserved} CYCLES
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            States: <b>6 recognized</b>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800 shadow-lg">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">DATA QUALITY INDEX</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {baseline.dataQuality}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Confidence: <b>High (p &lt; 0.01)</b>
          </div>
        </div>
      </div>

      {/* Commissioning Safety Verification Section (Requirement 12) */}
      <div className="p-5 rounded-2xl bg-industrial-900 border-2 border-cyan-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <h3 className="font-bold text-base text-white">
                Baseline Commissioning & Pre-Existing Fault Guard
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Engineering Dilemma: <i>"What if the appliance was already faulty or degraded during the learning period?"</i>
              <br />
              LoadGuard requires explicit reference confirmation before locking the baseline, preventing the learning of mechanical friction or bad electrical wiring as "normal".
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
              isCommissioningChecked 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              REFERENCE QUALITY: {isCommissioningChecked ? 'CONFIRMED HEALTHY' : 'NEEDS REVIEW'}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between bg-industrial-950 p-3.5 rounded-xl border border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isCommissioningChecked}
              onChange={(e) => handleCommissionToggle(e.target.checked)}
              className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-200">
              Appliance verified healthy by installer / owner before baseline creation
            </span>
          </label>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Audit Flag: LG-COMMISSION-OK
          </span>
        </div>
      </div>

      {/* Parameters Being Learned Checklist (Requirement 11) */}
      <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              TELEMETRY PARAMETER SYNTHESIS
            </div>
            <div className="text-sm font-bold text-white">
              Learned Appliance Parameters & Statistical Envelopes
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle size={14} /> 7 of 7 Vectors Locked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {PARAMETERS.map((p, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">{p.name}</span>
                <span className="text-emerald-400 font-bold">✓ {p.status}</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {p.value}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Unit: {p.unit} • Nominal reference
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Envelope Comparison Chart */}
      <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              STATISTICAL BASELINE ENVELOPE
            </div>
            <div className="text-sm font-bold text-white">
              7-Day Normal Operating Band (Min — Nominal — Max)
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-500/20 border border-cyan-500"></span> Envelope Band</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-cyan-400"></span> Nominal</span>
          </div>
        </div>

        {/* Envelope Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="text-[10px] uppercase text-slate-400 bg-industrial-950 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Min Allowed (A)</th>
                <th className="py-2.5 px-3">Nominal (A)</th>
                <th className="py-2.5 px-3">Max Envelope (A)</th>
                <th className="py-2.5 px-3">Nominal Power (W)</th>
                <th className="py-2.5 px-3">Nominal Temp (°C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {Object.entries(baseline.stateBaselines).map(([st, data]) => (
                <tr key={st} className="hover:bg-slate-800/30 transition">
                  <td className="py-2 px-3 font-bold text-white">{st}</td>
                  <td className="py-2 px-3 text-slate-400">{(data.current * 0.9).toFixed(2)}</td>
                  <td className="py-2 px-3 text-cyan-400 font-bold">{data.current.toFixed(2)}</td>
                  <td className="py-2 px-3 text-slate-400">{(data.current * 1.1).toFixed(2)}</td>
                  <td className="py-2 px-3 text-slate-300">{data.power} W</td>
                  <td className="py-2 px-3 text-slate-300">{data.temperature.toFixed(1)} °C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={resetSimulation}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw size={13} /> RESTART LEARNING CYCLE
          </button>
        </div>
      </div>
    </div>
  );
};
