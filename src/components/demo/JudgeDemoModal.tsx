import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  CheckCircle, 
  ShieldAlert, 
  BrainCircuit, 
  Zap, 
  Clock 
} from 'lucide-react';

export const JudgeDemoModal: React.FC = () => {
  const {
    isJudgeDemoOpen,
    setIsJudgeDemoOpen,
    judgeDemoStep,
    setJudgeDemoStep,
    nextJudgeDemoStep,
    prevJudgeDemoStep,
    telemetry,
    health,
    protectionState,
    energyMetrics
  } = useSimulation();

  if (!isJudgeDemoOpen) return null;

  const STEPS = [
    {
      step: 1,
      name: 'Normal Operation',
      badge: 'NORMAL',
      talkTrack: 'LoadGuard AI establishes normal electrical telemetry (230V, 5.25A, PF 0.91) with optimal composite health (87/100). The 3D hardware shows continuous blue power and cyan data flows.',
      presenterTip: 'Highlight the baseline learning status and synchronous live telemetry across 3D and dashboard.'
    },
    {
      step: 2,
      name: 'Startup Surge Transient',
      badge: 'STARTUP',
      talkTrack: 'During motor startup, the dedicated metering IC captures instantaneous inrush surge (up to 18.2A peak) decaying exponentially within 1.2s without triggering false alarms.',
      presenterTip: 'Point to the live oscilloscope showing the transient current spike and sub-cycle capture.'
    },
    {
      step: 3,
      name: 'Progressive Mechanical Wear',
      badge: 'WEAR DRIFT',
      talkTrack: 'Over 40 simulated operating days, the appliance power drifts progressively from 1180W to 1290W due to bearing friction and thermal build-up. We do not prematurely declare a motor death.',
      presenterTip: 'Emphasize engineering honesty: technical drift vs fake AI certainty.'
    },
    {
      step: 4,
      name: 'AI Anomaly Detection',
      badge: 'ANOMALY DETECTED',
      talkTrack: 'The AI health engine identifies that current is +13.2% above baseline for 6 consecutive cycles. Multi-signal correlation flags current, power, and thermal vectors simultaneously.',
      presenterTip: 'Notice the 3D Current Transformer pulsing amber and health score transitioning to warning.'
    },
    {
      step: 5,
      name: 'Explainable AI Breakdown',
      badge: 'WHY THIS ALERT?',
      talkTrack: '"Why am I getting this alert?" provides transparent engineering reasoning: 6 persistent cycles, multi-signal checklist, and an actionable maintenance inspection recommendation.',
      presenterTip: 'Judges love technical transparency: no black-box hallucinations.'
    },
    {
      step: 6,
      name: 'Energy Waste & Cost Estimation',
      badge: 'EXCESS ENERGY',
      talkTrack: 'LoadGuard computes empirical excess consumption (0.42 kWh today) and maps it directly to real currency using the user’s ₹8.50/kWh electricity tariff (₹3.57 excess today, ₹107/mo).',
      presenterTip: 'Shows clear ROI and tangible financial justification for preventive maintenance.'
    },
    {
      step: 7,
      name: 'Critical Overload Condition',
      badge: 'CRITICAL THRESHOLD',
      talkTrack: 'A severe mechanical stall forces current to 8.1A, exceeding the configured 7.0A deterministic threshold. The safety persistence countdown engages (5.0s window).',
      presenterTip: 'Safety engine is deterministic, completely distinct from the predictive AI.'
    },
    {
      step: 8,
      name: 'Deterministic Protection Trip',
      badge: 'RELAY OPEN',
      talkTrack: 'Trip condition confirmed! The high-speed latching relay physically opens in <10ms. In the 3D lab, the contactor armature swings open and power flow halts immediately.',
      presenterTip: 'Watch the physical relay swing open in 3D and current drop instantaneously to 0.0A.'
    },
    {
      step: 9,
      name: 'Event Audit Log & Fleet Status',
      badge: 'EVENT LOGGED',
      talkTrack: 'The entire event lifecycle is cryptographically recorded in the immutable audit log with full pre-trip measurements. Ready for CSV/JSON and PDF executive health report export.',
      presenterTip: 'Wrap up: Complete end-to-end loop from Measurement to Protection.'
    }
  ];

  const currentStepData = STEPS[judgeDemoStep - 1];

  return (
    <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-industrial-900/98 backdrop-blur-2xl border-2 border-amber-500/80 rounded-2xl shadow-glow-amber p-4 sm:p-5 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white font-mono tracking-wide">
                  JUDGE DEMO MODE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  STEP {judgeDemoStep} OF 9
                </span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  — {currentStepData.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJudgeDemoOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
              title="Close Judge Demo"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="grid grid-cols-9 gap-1.5 my-3">
          {STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setJudgeDemoStep(s.step)}
              className={`h-2 rounded-full transition-all ${
                s.step === judgeDemoStep
                  ? 'bg-amber-400 shadow-glow-amber'
                  : s.step < judgeDemoStep
                  ? 'bg-cyan-500/80'
                  : 'bg-slate-800'
              }`}
              title={`Step ${s.step}: ${s.name}`}
            />
          ))}
        </div>

        {/* Talk Track & Presenter Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
          {/* Main Presenter Script */}
          <div className="md:col-span-2 bg-industrial-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              PRESENTER TALK TRACK (What to say to Judges):
            </div>
            <p className="text-sm text-slate-100 font-sans leading-relaxed">
              "{currentStepData.talkTrack}"
            </p>
          </div>

          {/* Quick Metrics / Verification Snapshot */}
          <div className="bg-industrial-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                JURY FOCUS TIP:
              </div>
              <p className="text-xs text-slate-300 italic">
                {currentStepData.presenterTip}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>I: <b className="text-white">{telemetry.current.toFixed(2)}A</b></span>
              <span>P: <b className="text-white">{telemetry.realPower}W</b></span>
              <span>Relay: <b className={protectionState.relayPosition === 'OPEN' ? 'text-red-400' : 'text-emerald-400'}>{protectionState.relayPosition}</b></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">
            Scenario: <span className="text-amber-300 font-bold">{currentStepData.badge}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevJudgeDemoStep}
              disabled={judgeDemoStep === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono text-slate-200 transition flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={nextJudgeDemoStep}
              disabled={judgeDemoStep === 9}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-industrial-950 font-bold text-xs font-mono transition flex items-center gap-1 shadow-glow-amber"
            >
              {judgeDemoStep === 9 ? 'Finish Scenario' : 'Next Step'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
