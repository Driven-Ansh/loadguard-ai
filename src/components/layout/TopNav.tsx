import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  Bell, 
  Sliders, 
  Sparkles, 
  Clock, 
  ChevronDown,
  Wifi,
  Radio
} from 'lucide-react';

interface TopNavProps {
  onToggleSimulationDrawer: () => void;
  isSimulationDrawerOpen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  onToggleSimulationDrawer, 
  isSimulationDrawerOpen 
}) => {
  const {
    appliances,
    activeAppliance,
    setActiveApplianceId,
    protectionState,
    unreadAlertCount,
    setIsJudgeDemoOpen,
    setJudgeDemoStep,
    faultScenario
  } = useSimulation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);

  const isTripped = protectionState.status === 'TRIPPED';
  const isOffline = faultScenario === 'NETWORK_FAILURE';

  return (
    <header className="h-16 border-b border-slate-800 bg-industrial-950/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30 select-none shrink-0">
      {/* Brand & Simulation Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-glow-cyan">
            <Cpu className="text-industrial-950" size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">LOADGUARD</span>
              <span className="text-xs font-bold font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-electric-cyan border border-cyan-500/40">
                AI
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
              INTELLIGENT APPLIANCE HEALTH & PROTECTIVE CONTROL
            </div>
          </div>
        </div>

        {/* Clear Simulation Notice */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/30 font-mono text-[10px] text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>SIMULATION MODE (HARDWARE EMULATION)</span>
        </div>
      </div>

      {/* Center: Active Appliance Switcher */}
      <div className="relative">
        <button
          onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-industrial-900 border border-slate-700/80 hover:border-cyan-500/50 transition text-xs font-mono text-slate-200"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">Active Device</span>
            <span className="font-semibold text-white">{activeAppliance.name}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
            {activeAppliance.assetTag}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {isDeviceMenuOpen && (
          <div className="absolute top-12 left-0 w-64 bg-industrial-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 divide-y divide-slate-800">
            {appliances.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  setActiveApplianceId(app.id);
                  setIsDeviceMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-800/60 transition ${
                  app.id === activeAppliance.id ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <div>
                  <div className="font-medium text-white">{app.name}</div>
                  <div className="font-mono text-[10px] text-slate-400">{app.assetTag} • {app.ratedPowerW}W</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  app.status === 'NORMAL' ? 'bg-emerald-400' : app.status === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Telemetry Link, Demo Mode, Notifications, Simulation Drawer */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[11px]">
          {isOffline ? (
            <>
              <Radio size={13} className="text-slate-500 animate-pulse" />
              <span className="text-slate-400">OFFLINE</span>
            </>
          ) : isTripped ? (
            <>
              <ShieldAlert size={13} className="text-red-400 animate-pulse" />
              <span className="text-red-400 font-bold">RELAY OPEN (TRIPPED)</span>
            </>
          ) : (
            <>
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-emerald-400">SAFETY ARMED</span>
            </>
          )}
        </div>

        {/* COMPETITION READY: JUDGE DEMO MODE BUTTON */}
        <button
          onClick={() => {
            setJudgeDemoStep(1);
            setIsJudgeDemoOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/60 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold shadow-glow-amber transition"
          title="Launch 9-Step Guided 90-Second Demo for Competition Judges"
        >
          <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>JUDGE DEMO MODE</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg bg-industrial-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition relative"
            title="System Notifications"
          >
            <Bell size={16} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-bounce">
                {unreadAlertCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Simulation Controls Drawer Toggle */}
        <button
          onClick={onToggleSimulationDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
            isSimulationDrawerOpen 
              ? 'bg-cyan-500/20 border-cyan-500/60 text-electric-cyan shadow-glow-cyan' 
              : 'bg-industrial-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
          title="Open Simulation Controls & Fault Injection Lab"
        >
          <Sliders size={15} />
          <span className="hidden sm:inline">SIM LAB</span>
        </button>
      </div>
    </header>
  );
};
