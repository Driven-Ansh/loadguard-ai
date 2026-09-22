import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { AlertTriangle, ShieldAlert, CheckCircle, Info, X } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { events, unreadAlertCount, clearUnreadAlerts, setActiveSection } = useSimulation();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-industrial-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden font-sans">
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-industrial-950/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-100">System Notifications</span>
          {unreadAlertCount > 0 && (
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
              {unreadAlertCount} NEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearUnreadAlerts}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition"
          >
            Mark Read
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
        {events.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-mono">
            No system events logged.
          </div>
        ) : (
          events.slice(0, 6).map((evt) => {
            const isProt = evt.severity === 'PROTECTION';
            const isCrit = evt.severity === 'CRITICAL';
            const isWarn = evt.severity === 'WARNING';
            const isAbnorm = evt.severity === 'ABNORMAL';

            return (
              <div 
                key={evt.id} 
                onClick={() => {
                  setActiveSection('timeline');
                  onClose();
                }}
                className="p-3 hover:bg-slate-800/40 cursor-pointer transition flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  {isProt ? (
                    <ShieldAlert size={16} className="text-red-400 animate-pulse" />
                  ) : isCrit ? (
                    <AlertTriangle size={16} className="text-red-400" />
                  ) : isWarn || isAbnorm ? (
                    <AlertTriangle size={16} className="text-amber-400" />
                  ) : (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-slate-200 truncate pr-2">
                      {evt.title}
                    </span>
                    <span className="font-mono text-slate-500 shrink-0 text-[10px]">
                      {evt.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {evt.triggerCondition}
                  </p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    <span>{evt.current.toFixed(2)}A</span>
                    <span>•</span>
                    <span>{evt.power}W</span>
                    <span>•</span>
                    <span>{evt.temperature.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2.5 bg-industrial-950 border-t border-slate-800 text-center">
        <button
          onClick={() => {
            setActiveSection('timeline');
            onClose();
          }}
          className="text-xs text-electric-cyan hover:underline font-mono"
        >
          View Full Event History ({events.length}) →
        </button>
      </div>
    </div>
  );
};
