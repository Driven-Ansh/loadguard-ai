import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { HardwareViewer3D } from '../3d/HardwareViewer3D';
import { HARDWARE_COMPONENTS } from '../../data/hardwareComponents';
import { 
  Box, 
  Layers, 
  Cpu, 
  Zap, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Maximize2
} from 'lucide-react';

export const HardwareLabView: React.FC = () => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    hardwareVariant,
    setHardwareVariant,
    protectionState,
    explainableAlert,
    faultScenario
  } = useSimulation();

  const selectedComp = HARDWARE_COMPONENTS.find(c => c.id === selectedComponentId) || HARDWARE_COMPONENTS[2]; // Default CT

  const isTripped = protectionState.status === 'TRIPPED';
  const isCritical = protectionState.status === 'CRITICAL_PENDING';
  const isAbnormal = explainableAlert.hasActiveAlert;
  const isOffline = faultScenario === 'NETWORK_FAILURE';

  // Compute live state for component
  const getComponentStatus = (id: string) => {
    if (isOffline && id === 'comm_module') return { label: 'DISCONNECTED', color: 'text-slate-400 bg-slate-800' };
    if (id === 'relay_section') {
      return isTripped 
        ? { label: 'TRIPPED (OPEN)', color: 'text-red-400 bg-red-500/20 border border-red-500/40' } 
        : { label: 'CLOSED (ARMED)', color: 'text-emerald-400 bg-emerald-500/20' };
    }
    if ((id === 'current_sensor' || id === 'temp_sensor') && isCritical) {
      return { label: 'CRITICAL LIMIT', color: 'text-red-400 bg-red-500/20 border border-red-500/40 animate-pulse' };
    }
    if ((id === 'current_sensor' || id === 'temp_sensor') && isAbnormal) {
      return { label: 'ABNORMAL DRIFT', color: 'text-amber-400 bg-amber-500/20 border border-amber-500/40' };
    }
    return { label: 'ONLINE', color: 'text-emerald-400 bg-emerald-500/20' };
  };

  const compStatus = getComponentStatus(selectedComp.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              HARDWARE EXPLORER & 3D DIGITAL TWIN
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              DISCRETE COMPONENT TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            LoadGuard Modular Hardware Architecture
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Multi-layer FR4 PCB • Galvanic Isolation Barrier • Deterministic Contactor Disconnect
          </p>
        </div>

        {/* Operating State Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-industrial-950 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400 mr-2">STATE:</span>
            <span className={`font-bold ${
              isTripped ? 'text-red-400' : isCritical ? 'text-red-400' : isAbnormal ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isTripped ? 'TRIPPED' : isCritical ? 'CRITICAL' : isAbnormal ? 'ABNORMAL' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 3D Lab Viewport & Technical Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Viewport (8 cols) */}
        <div className="lg:col-span-8 h-[540px] bg-industrial-900/90 rounded-2xl border border-slate-800 p-2 shadow-2xl relative flex flex-col">
          <HardwareViewer3D />
        </div>

        {/* Right: Technical Component Inspector & Component Roster (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Inspected Component Card */}
          <div className="bg-industrial-900/95 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  SELECTED COMPONENT
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${compStatus.color}`}>
                  {compStatus.label}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-3 font-sans">
                {selectedComp.name}
              </h3>
              <div className="text-[10px] font-mono text-slate-400 mb-3">
                ID: {selectedComp.id} • Category: {selectedComp.category}
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-0.5">PURPOSE</div>
                  <div className="text-slate-200 leading-relaxed">{selectedComp.purpose}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-0.5">MEASUREMENT / CONTROL ROLE</div>
                  <div className="text-slate-200 leading-relaxed">{selectedComp.measurementRole}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase mb-0.5">TYPICAL SIGNAL</div>
                  <div className="text-cyan-200 font-mono text-[11px]">{selectedComp.typicalSignal}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-amber-400 uppercase mb-0.5">WHY IT MATTERS</div>
                  <div className="text-slate-300 leading-relaxed">{selectedComp.whyItMatters}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
              * Click any component in 3D or select from below to inspect.
            </div>
          </div>
        </div>
      </div>

      {/* Component Roster Grid */}
      <div className="bg-industrial-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            ALL INTERNAL HARDWARE SUBSYSTEMS (11 COMPONENTS)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            CLICK TO HIGHLIGHT IN 3D
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {HARDWARE_COMPONENTS.map((c) => {
            const isSelected = selectedComponentId === c.id;
            const st = getComponentStatus(c.id);

            return (
              <button
                key={c.id}
                onClick={() => setSelectedComponentId(c.id)}
                className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/60 shadow-glow-cyan'
                    : 'bg-industrial-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                    {c.category}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                <div className="font-bold text-xs text-white mb-1">
                  {c.name}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2">
                  {c.purpose}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
