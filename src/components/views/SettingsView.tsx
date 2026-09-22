import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { ExportUtils } from '../../services/exportUtils';
import { 
  Settings, 
  Shield, 
  Lock, 
  Unlock, 
  Save, 
  RotateCcw, 
  Download, 
  FileText, 
  Printer, 
  Cpu, 
  CheckCircle2, 
  Radio, 
  Database, 
  KeyRound,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    activeAppliance,
    updateApplianceConfig,
    energyMetrics,
    setElectricityTariff,
    resetSimulation,
    events,
    health,
    telemetryHistory
  } = useSimulation();

  const [isConfigLocked, setIsConfigLocked] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: activeAppliance.name,
    assetTag: activeAppliance.assetTag,
    ratedPowerW: activeAppliance.ratedPowerW,
    ratedVoltageV: activeAppliance.ratedVoltageV,
    ratedCurrentA: activeAppliance.ratedCurrentA,
    maxCurrentLimit: activeAppliance.protection.maxCurrentLimit,
    maxTemperatureLimit: activeAppliance.protection.maxTemperatureLimit,
    minVoltageLimit: activeAppliance.protection.minVoltageLimit,
    maxVoltageLimit: activeAppliance.protection.maxVoltageLimit,
    persistenceSeconds: activeAppliance.protection.persistenceSeconds,
    tariff: energyMetrics.tariffPerKwh
  });

  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplianceConfig(activeAppliance.id, {
      name: formData.name,
      assetTag: formData.assetTag,
      ratedPowerW: Number(formData.ratedPowerW),
      ratedVoltageV: Number(formData.ratedVoltageV),
      ratedCurrentA: Number(formData.ratedCurrentA),
      protection: {
        ...activeAppliance.protection,
        maxCurrentLimit: Number(formData.maxCurrentLimit),
        maxTemperatureLimit: Number(formData.maxTemperatureLimit),
        minVoltageLimit: Number(formData.minVoltageLimit),
        maxVoltageLimit: Number(formData.maxVoltageLimit),
        persistenceSeconds: Number(formData.persistenceSeconds)
      }
    });
    setElectricityTariff(Number(formData.tariff));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              DEVICE SETTINGS & TECHNICAL TRANSPARENCY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              HARDWARE CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Protection Limits, Tariffs & Security Architecture
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Deterministic Threshold Calibration • AES-256 Telemetry Encryption • Full Data Export
          </p>
        </div>

        {/* Configuration Lock Toggle (Requirement 38) */}
        <button
          onClick={() => setIsConfigLocked(!isConfigLocked)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition ${
            isConfigLocked
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber'
          }`}
        >
          {isConfigLocked ? <Lock size={14} /> : <Unlock size={14} />}
          <span>{isConfigLocked ? 'CONFIG LOCKED' : 'CONFIG UNLOCKED'}</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-glow-green">
          <CheckCircle2 size={16} />
          <span>Configuration saved successfully and synchronized across hardware telemetry engine!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Electrical & Protection Config (8 cols) */}
        <div className="lg:col-span-8 bg-industrial-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-mono">
              Electrical Ratings & Deterministic Safety Limits
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Active: {activeAppliance.assetTag}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Appliance Name</label>
              <input
                type="text"
                disabled={isConfigLocked}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Asset ID / Serial Tag</label>
              <input
                type="text"
                disabled={isConfigLocked}
                value={formData.assetTag}
                onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Rated Power (Watts)</label>
              <input
                type="number"
                disabled={isConfigLocked}
                value={formData.ratedPowerW}
                onChange={(e) => setFormData({ ...formData, ratedPowerW: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Rated Nominal Voltage (V)</label>
              <input
                type="number"
                disabled={isConfigLocked}
                value={formData.ratedVoltageV}
                onChange={(e) => setFormData({ ...formData, ratedVoltageV: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-red-300">Max Current Safety Limit (Amperes)</label>
              <input
                type="number"
                step="0.1"
                disabled={isConfigLocked}
                value={formData.maxCurrentLimit}
                onChange={(e) => setFormData({ ...formData, maxCurrentLimit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-red-300">Max Temperature Safety Limit (°C)</label>
              <input
                type="number"
                step="0.5"
                disabled={isConfigLocked}
                value={formData.maxTemperatureLimit}
                onChange={(e) => setFormData({ ...formData, maxTemperatureLimit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Min / Max Allowed Voltage Window (V)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  disabled={isConfigLocked}
                  value={formData.minVoltageLimit}
                  onChange={(e) => setFormData({ ...formData, minVoltageLimit: parseFloat(e.target.value) || 0 })}
                  className="w-1/2 bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
                  placeholder="Min V"
                />
                <input
                  type="number"
                  disabled={isConfigLocked}
                  value={formData.maxVoltageLimit}
                  onChange={(e) => setFormData({ ...formData, maxVoltageLimit: parseFloat(e.target.value) || 0 })}
                  className="w-1/2 bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
                  placeholder="Max V"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Trip Persistence Window (Seconds)</label>
              <input
                type="number"
                step="0.5"
                disabled={isConfigLocked}
                value={formData.persistenceSeconds}
                onChange={(e) => setFormData({ ...formData, persistenceSeconds: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-emerald-400">Electricity Tariff (₹ / kWh)</label>
              <input
                type="number"
                step="0.25"
                disabled={isConfigLocked}
                value={formData.tariff}
                onChange={(e) => setFormData({ ...formData, tariff: parseFloat(e.target.value) || 0 })}
                className="w-full bg-industrial-950 border border-slate-800 rounded-lg p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {!isConfigLocked && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfigLocked(true)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-industrial-950 font-bold font-mono text-xs transition shadow-glow-cyan flex items-center gap-1.5"
              >
                <Save size={14} /> Save Configuration
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Security, Hardware Health & Exports (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Technical Transparency Subsystem Status (Requirement 33) */}
          <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest pb-2 border-b border-slate-800 font-bold flex items-center gap-1.5">
              <Cpu size={14} /> HARDWARE TRANSPARENCY TELEMETRY
            </div>

            {[
              { label: 'ADC SAMPLING RATE', val: '6.4 kS/s', status: 'ONLINE', color: 'text-emerald-400' },
              { label: 'ANALOG SENSORS', val: 'CT / NTC / RES', status: 'ONLINE', color: 'text-emerald-400' },
              { label: 'EDGE MCU CORE', val: '240MHz DUAL-CORE', status: 'ONLINE', color: 'text-emerald-400' },
              { label: 'AI HEALTH ENGINE', val: 'EDGE-ISOLATION-V4', status: 'RUNNING', color: 'text-cyan-400' },
              { label: 'TELEMETRY CRYPTO', val: 'AES-256-GCM', status: 'SECURE', color: 'text-emerald-400' },
              { label: 'PROTECTION CORE', val: 'DETERMINISTIC COMP', status: 'ARMED', color: 'text-emerald-400' }
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-slate-950 last:border-none">
                <div>
                  <span className="text-slate-400 text-[10px] block">{sub.label}</span>
                  <span className="text-slate-200 text-[11px] font-bold">{sub.val}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 ${sub.color}`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>

          {/* Data Export & Audit Center (Requirement 39) */}
          <div className="p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <div className="text-[10px] text-purple-400 uppercase tracking-widest pb-2 border-b border-slate-800 font-bold flex items-center gap-1.5">
              <Download size={14} /> EXPORT & AUDIT DATA LOGS
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Generate signed telemetry logs, audit trails, and printable engineering reports.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => ExportUtils.downloadCSV(telemetryHistory, activeAppliance)}
                className="w-full py-2 px-3 rounded-lg bg-industrial-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition flex items-center justify-between"
              >
                <span>Export Telemetry (CSV)</span>
                <Download size={13} className="text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => ExportUtils.downloadJSONAudit(events, activeAppliance)}
                className="w-full py-2 px-3 rounded-lg bg-industrial-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition flex items-center justify-between"
              >
                <span>Export Security Audit (JSON)</span>
                <KeyRound size={13} className="text-purple-400" />
              </button>

              <button
                type="button"
                onClick={() => ExportUtils.generatePrintableReport(activeAppliance, health, energyMetrics, events)}
                className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-electric-cyan font-bold transition flex items-center justify-between shadow-glow-cyan"
              >
                <span>Print Diagnostic Report</span>
                <Printer size={13} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
