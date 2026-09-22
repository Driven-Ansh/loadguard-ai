import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { CircularGauge } from '../common/CircularGauge';
import { 
  Server, 
  Zap, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const FleetView: React.FC = () => {
  const {
    appliances,
    activeAppliance,
    setActiveApplianceId,
    setActiveSection
  } = useSimulation();

  // Aggregate stats
  const totalConnected = appliances.length;
  const healthyCount = appliances.filter(a => a.health.overall >= 85).length;
  const warningCount = appliances.filter(a => a.health.overall >= 65 && a.health.overall < 85).length;
  const criticalCount = appliances.filter(a => a.health.overall < 65).length;

  const totalKwhToday = appliances.reduce((sum, a) => sum + a.telemetry.energyToday, 0);
  const avgHealth = Math.round(appliances.reduce((sum, a) => sum + a.health.overall, 0) / appliances.length);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              MULTI-DEVICE FLEET & HOME ENERGY HEALTH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              5 ASSETS MONITORED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Integrated Appliance Health & Consumption Overview
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous Edge Sensor Network • Fleet-Wide Baseline Deviation Tracking • Central Protective Orchestration
          </p>
        </div>

        {/* Overall Health Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-industrial-950 border border-slate-800 flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-[9px] uppercase text-slate-400">HOME HEALTH SCORE</div>
              <div className="text-lg font-bold text-electric-cyan">{avgHealth} / 100</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-electric-cyan flex items-center justify-center font-bold text-xs border border-cyan-500/40">
              {avgHealth}
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">CONNECTED APPLIANCES</div>
          <div className="text-2xl font-bold font-mono text-white">{totalConnected} Units</div>
          <div className="text-[10px] font-mono text-cyan-400 mt-1">All telemetry live</div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">FLEET HEALTH BREAKDOWN</div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold mt-1">
            <span className="text-emerald-400">{healthyCount} Healthy</span>
            <span>•</span>
            <span className="text-amber-400">{warningCount} Warning</span>
            <span>•</span>
            <span className="text-red-400">{criticalCount} Critical</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Weighted index</div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">TOTAL FLEET ENERGY TODAY</div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {totalKwhToday.toFixed(1)} kWh
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Across all 5 loads</div>
        </div>

        <div className="p-4 rounded-xl bg-industrial-900 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">ESTIMATED ABNORMAL WASTE</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            1.42 kWh
          </div>
          <div className="text-[10px] font-mono text-amber-300 mt-1">~ ₹ 12.07 excess cost</div>
        </div>
      </div>

      {/* Appliance Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliances.map((app) => {
          const isActive = app.id === activeAppliance.id;
          const score = app.health.overall;
          const isHealthy = score >= 85;
          const isWarning = score >= 65 && score < 85;
          const isCritical = score < 65;

          const badgeColor = isCritical 
            ? 'text-red-400 bg-red-500/20 border-red-500/40' 
            : isWarning 
            ? 'text-amber-400 bg-amber-500/20 border-amber-500/40' 
            : 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';

          return (
            <div
              key={app.id}
              onClick={() => {
                setActiveApplianceId(app.id);
                setActiveSection('overview');
              }}
              className={`p-5 rounded-2xl border transition shadow-xl cursor-pointer flex flex-col justify-between group ${
                isActive 
                  ? 'bg-industrial-900 border-cyan-500/80 shadow-glow-cyan' 
                  : 'bg-industrial-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {app.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1 group-hover:text-cyan-300 transition">
                      {app.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                    {score} / 100
                  </span>
                </div>

                {/* Status & Ratings */}
                <div className="space-y-2 text-xs font-mono mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Asset Tag:</span>
                    <span className="text-white font-bold">{app.assetTag}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Rated Power:</span>
                    <span className="text-white">{app.ratedPowerW} W ({app.ratedVoltageV}V)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Draw:</span>
                    <span className="text-cyan-400 font-bold">{app.telemetry.current.toFixed(2)} A</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Temperature:</span>
                    <span className="text-slate-200">{app.telemetry.temperature.toFixed(1)} °C</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Energy Today:</span>
                    <span className="text-purple-400">{app.telemetry.energyToday.toFixed(2)} kWh</span>
                  </div>
                </div>

                {/* Health Condition Note */}
                <div className="p-2.5 rounded-lg bg-industrial-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                  {app.health.statusText}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase">
                  {app.hardwareVariant} UNIT
                </span>
                <span className="text-electric-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isActive ? 'Active Appliance' : 'Switch Device'} <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
