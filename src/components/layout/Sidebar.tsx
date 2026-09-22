import React from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { NavigationSection } from '../../types';
import { 
  LayoutDashboard, 
  Box, 
  Activity, 
  GraduationCap, 
  BrainCircuit, 
  Zap, 
  ShieldAlert, 
  History, 
  Server, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activeSection, setActiveSection, explainableAlert, protectionState, activeAppliance } = useSimulation();

  const isTripped = protectionState.status === 'TRIPPED';
  const hasAnomaly = explainableAlert.hasActiveAlert;

  const NAV_ITEMS: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hardware-lab', label: '3D Hardware Lab', icon: Box, badge: '3D' },
    { id: 'appliance-monitor', label: 'Appliance Monitor', icon: Activity },
    { 
      id: 'learning-mode', 
      label: 'Learning Mode', 
      icon: GraduationCap, 
      badge: activeAppliance.baseline.isLearned ? 'LOCKED' : 'LEARNING' 
    },
    { 
      id: 'ai-health', 
      label: 'AI Health Analysis', 
      icon: BrainCircuit,
      badge: hasAnomaly ? 'DRIFT' : undefined,
      badgeColor: hasAnomaly ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : undefined
    },
    { id: 'energy-intelligence', label: 'Energy Intelligence', icon: Zap },
    { 
      id: 'protection', 
      label: 'Safety & Protection', 
      icon: ShieldAlert,
      badge: isTripped ? 'TRIP' : 'ARMED',
      badgeColor: isTripped ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
    },
    { id: 'timeline', label: 'Event Timeline', icon: History },
    { id: 'fleet', label: 'Appliances / Fleet', icon: Server, badge: '5 Assets' },
    { id: 'settings', label: 'Settings & Security', icon: Settings }
  ];

  return (
    <aside 
      className={`h-[calc(100vh-4rem)] border-r border-slate-800 bg-industrial-950/90 flex flex-col justify-between transition-all duration-300 select-none z-20 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation Routes List */}
      <nav className="p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-electric-cyan font-bold border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon 
                size={18} 
                className={`shrink-0 transition-transform ${
                  isActive ? 'text-electric-cyan scale-110' : 'text-slate-400 group-hover:text-slate-200'
                }`} 
              />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span 
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Sidebar Collapse Toggle & Hardware Status */}
      <div className="p-2 border-t border-slate-800/80 bg-industrial-950">
        {!isCollapsed && (
          <div className="mb-2 p-2 rounded bg-industrial-900/60 border border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between items-center mb-1">
              <span>FIRMWARE</span>
              <span className="text-cyan-400 font-bold">v2.4.1-EDGE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ADC CLOCK</span>
              <span className="text-emerald-400">6.4 kS/s SYNC</span>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
