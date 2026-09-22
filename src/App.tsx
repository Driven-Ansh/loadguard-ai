import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './state/SimulationContext';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { SimulationBar } from './components/layout/SimulationBar';
import { JudgeDemoModal } from './components/demo/JudgeDemoModal';

// Views
import { OverviewView } from './components/views/OverviewView';
import { HardwareLabView } from './components/views/HardwareLabView';
import { ApplianceMonitorView } from './components/views/ApplianceMonitorView';
import { LearningModeView } from './components/views/LearningModeView';
import { AIHealthView } from './components/views/AIHealthView';
import { EnergyIntelligenceView } from './components/views/EnergyIntelligenceView';
import { ProtectionView } from './components/views/ProtectionView';
import { EventTimelineView } from './components/views/EventTimelineView';
import { FleetView } from './components/views/FleetView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeSection } = useSimulation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSimulationDrawerOpen, setIsSimulationDrawerOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewView />;
      case 'hardware-lab':
        return <HardwareLabView />;
      case 'appliance-monitor':
        return <ApplianceMonitorView />;
      case 'learning-mode':
        return <LearningModeView />;
      case 'ai-health':
        return <AIHealthView />;
      case 'energy-intelligence':
        return <EnergyIntelligenceView />;
      case 'protection':
        return <ProtectionView />;
      case 'timeline':
        return <EventTimelineView />;
      case 'fleet':
        return <FleetView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Top Navigation */}
      <TopNav 
        onToggleSimulationDrawer={() => setIsSimulationDrawerOpen(!isSimulationDrawerOpen)}
        isSimulationDrawerOpen={isSimulationDrawerOpen}
      />

      {/* Simulation Lab Drawer */}
      <SimulationBar 
        isOpen={isSimulationDrawerOpen} 
        onClose={() => setIsSimulationDrawerOpen(false)} 
      />

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-tech-grid">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* 9-Step Guided Judge Demo Presentation Modal */}
      <JudgeDemoModal />
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}

export default App;
