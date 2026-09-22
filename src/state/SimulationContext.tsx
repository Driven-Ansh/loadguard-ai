import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  ApplianceProfile, 
  ElectricalTelemetry, 
  ExplainableAIAlert, 
  FaultScenario, 
  HealthScoreBreakdown, 
  NavigationSection, 
  OperatingState, 
  ProtectionConfig, 
  ProtectionState, 
  TimelineEvent, 
  EnergyMetrics 
} from '../types';
import { DEFAULT_APPLIANCES } from '../data/defaultAppliances';
import { globalSimulationEngine } from '../services/simulationEngine';
import { globalAIHealthEngine } from '../services/aiHealthEngine';
import { globalProtectionEngine } from '../services/protectionEngine';

interface SimulationContextType {
  // Navigation
  activeSection: NavigationSection;
  setActiveSection: (section: NavigationSection) => void;

  // Appliances
  appliances: ApplianceProfile[];
  activeAppliance: ApplianceProfile;
  setActiveApplianceId: (id: string) => void;
  updateApplianceConfig: (applianceId: string, updates: Partial<ApplianceProfile>) => void;

  // Real-time Telemetry & Health
  telemetry: ElectricalTelemetry;
  telemetryHistory: ElectricalTelemetry[];
  health: HealthScoreBreakdown;
  explainableAlert: ExplainableAIAlert;
  protectionState: ProtectionState;
  energyMetrics: EnergyMetrics;
  events: TimelineEvent[];
  unreadAlertCount: number;
  clearUnreadAlerts: () => void;

  // Simulation Controls
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  faultScenario: FaultScenario;
  setFaultScenario: (scenario: FaultScenario) => void;
  faultIntensity: number;
  setFaultIntensity: (val: number) => void;
  progressiveWearDay: number;
  setProgressiveWearDay: (day: number) => void;
  targetState: OperatingState;
  setTargetState: (state: OperatingState) => void;
  resetSimulation: () => void;
  resetProtection: () => void;
  manualTripProtection: () => void;
  setCommissionVerified: (verified: boolean) => void;
  setElectricityTariff: (tariff: number) => void;

  // 3D Lab State
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  explodedProgress: number;
  setExplodedProgress: (val: number) => void;
  casingMode: 'OPAQUE' | 'TRANSPARENT' | 'OFF';
  setCasingMode: (mode: 'OPAQUE' | 'TRANSPARENT' | 'OFF') => void;
  flowMode: 'BOTH' | 'POWER' | 'DATA' | 'OFF';
  setFlowMode: (mode: 'BOTH' | 'POWER' | 'DATA' | 'OFF') => void;
  hardwareVariant: 'HOUSEHOLD' | 'INDUSTRIAL';
  setHardwareVariant: (variant: 'HOUSEHOLD' | 'INDUSTRIAL') => void;

  // Judge Demo Mode
  isJudgeDemoOpen: boolean;
  setIsJudgeDemoOpen: (open: boolean) => void;
  judgeDemoStep: number;
  setJudgeDemoStep: (step: number) => void;
  nextJudgeDemoStep: () => void;
  prevJudgeDemoStep: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: 'evt_init_1',
    timestamp: '10:42:15',
    timeEpoch: Date.now() - 3600000 * 2.5,
    applianceId: 'lg-ac-001',
    applianceName: 'AC Compressor Unit',
    title: 'Normal Steady-State Operation Established',
    severity: 'INFO',
    current: 5.25,
    power: 1150,
    temperature: 36.5,
    voltage: 230.1,
    triggerCondition: 'Baseline learning completed & commissioning verified',
    decisionRule: 'Measurements inside ±3% confidence interval',
    actionTaken: 'Autonomous real-time tracking engaged',
    systemState: 'NORMAL'
  },
  {
    id: 'evt_init_2',
    timestamp: '11:15:30',
    timeEpoch: Date.now() - 3600000 * 1.8,
    applianceId: 'lg-ac-001',
    applianceName: 'AC Compressor Unit',
    title: 'Operating Current Drift (+8.2%) Observed',
    severity: 'WARNING',
    current: 5.68,
    power: 1245,
    temperature: 37.8,
    voltage: 229.4,
    triggerCondition: 'Current exceeded 1-sigma baseline envelope for 3 consecutive intervals',
    decisionRule: 'Statistical anomaly probability > 0.72',
    actionTaken: 'Flagged for explainable AI persistence evaluation',
    systemState: 'WARNING'
  },
  {
    id: 'evt_init_3',
    timestamp: '11:48:02',
    timeEpoch: Date.now() - 3600000 * 1.2,
    applianceId: 'lg-ac-001',
    applianceName: 'AC Compressor Unit',
    title: 'Persistent Multi-Signal Deviation Detected',
    severity: 'ABNORMAL',
    current: 5.95,
    power: 1310,
    temperature: 41.2,
    voltage: 228.8,
    triggerCondition: 'Elevated current & temperature correlated over 6 cycles',
    decisionRule: 'Multi-signal Pearson correlation factor r = 0.88',
    actionTaken: 'Created explainable engineering alert with excess energy calculation',
    systemState: 'ABNORMAL'
  }
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavigationSection>('overview');
  const [appliances, setAppliances] = useState<ApplianceProfile[]>(DEFAULT_APPLIANCES);
  const [activeApplianceId, setActiveApplianceId] = useState<string>('lg-ac-001');

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [faultScenario, setFaultScenario] = useState<FaultScenario>('NONE');
  const [faultIntensity, setFaultIntensity] = useState<number>(0.5);
  const [progressiveWearDay, setProgressiveWearDay] = useState<number>(1);
  const [targetState, setTargetState] = useState<OperatingState>('NORMAL');
  const [tariffPerKwh, setTariffPerKwh] = useState<number>(8.50); // ₹ 8.50 / kWh

  // 3D Lab state
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('current_sensor');
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [casingMode, setCasingMode] = useState<'OPAQUE' | 'TRANSPARENT' | 'OFF'>('TRANSPARENT');
  const [flowMode, setFlowMode] = useState<'BOTH' | 'POWER' | 'DATA' | 'OFF'>('BOTH');
  const [hardwareVariant, setHardwareVariant] = useState<'HOUSEHOLD' | 'INDUSTRIAL'>('HOUSEHOLD');

  // Events & Notifications
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);
  const [unreadAlertCount, setUnreadAlertCount] = useState<number>(1);

  // Judge Demo state
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState<boolean>(false);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(1);

  const activeAppliance = appliances.find(a => a.id === activeApplianceId) || appliances[0];

  // Live state refs & state variables
  const [telemetry, setTelemetry] = useState<ElectricalTelemetry>(activeAppliance.telemetry);
  const [telemetryHistory, setTelemetryHistory] = useState<ElectricalTelemetry[]>([activeAppliance.telemetry]);
  const [health, setHealth] = useState<HealthScoreBreakdown>(activeAppliance.health);
  const [explainableAlert, setExplainableAlert] = useState<ExplainableAIAlert>(
    globalAIHealthEngine.generateExplainableAlert(activeAppliance.telemetry, activeAppliance)
  );
  const [protectionState, setProtectionState] = useState<ProtectionState>({
    status: 'ARMED',
    relayPosition: 'CLOSED',
    activeViolation: null,
    tripCountdownSeconds: activeAppliance.protection.persistenceSeconds,
    tripReason: null,
    lastTripTimestamp: null
  });

  // When active appliance changes, sync state
  useEffect(() => {
    setTelemetry(activeAppliance.telemetry);
    setTelemetryHistory([activeAppliance.telemetry]);
    setHealth(activeAppliance.health);
    setHardwareVariant(activeAppliance.hardwareVariant);
    setTargetState(activeAppliance.telemetry.operatingState);
    globalProtectionEngine.resetProtection();
    globalSimulationEngine.setRelayState(false);
  }, [activeApplianceId]);

  // Main simulation tick loop (100ms intervals = 10Hz)
  const lastTickTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      if (!isPlaying) return;

      // 1. Simulation Engine Step
      const nextTelemetry = globalSimulationEngine.step(
        telemetry,
        activeAppliance,
        {
          faultScenario,
          faultIntensity,
          progressiveWearDay,
          targetState,
          ambientTemperature: 26.0,
          speedMultiplier
        },
        deltaSeconds
      );

      // 2. Deterministic Safety Protection Step
      const nextProtection = globalProtectionEngine.evaluate(
        nextTelemetry,
        activeAppliance.protection,
        deltaSeconds,
        speedMultiplier,
        activeAppliance.id,
        activeAppliance.name,
        (tripEvent) => {
          setEvents(prev => [tripEvent, ...prev]);
          setUnreadAlertCount(prev => prev + 1);
        }
      );

      // Sync relay state back to simulation engine
      const isRelayOpen = nextProtection.relayPosition === 'OPEN';
      globalSimulationEngine.setRelayState(isRelayOpen);

      // 3. AI Health Analysis Step
      const nextHealth = globalAIHealthEngine.evaluateHealth(nextTelemetry, activeAppliance);
      const nextAlert = globalAIHealthEngine.generateExplainableAlert(nextTelemetry, activeAppliance);

      // 4. Update states
      setTelemetry(nextTelemetry);
      setProtectionState(nextProtection);
      setHealth(nextHealth);
      setExplainableAlert(nextAlert);

      // Update history buffer (keep last 60 samples)
      setTelemetryHistory(prev => {
        const updated = [...prev, nextTelemetry];
        if (updated.length > 60) updated.shift();
        return updated;
      });

      // Update active appliance object in fleet list
      setAppliances(prev => prev.map(app => {
        if (app.id === activeAppliance.id) {
          return {
            ...app,
            telemetry: nextTelemetry,
            health: nextHealth,
            status: isRelayOpen ? 'TRIPPED' : nextProtection.status === 'CRITICAL_PENDING' ? 'CRITICAL' : nextAlert.hasActiveAlert ? nextAlert.severity === 'CRITICAL' ? 'CRITICAL' : 'ABNORMAL' : 'NORMAL'
          };
        }
        return app;
      }));

    }, 100);

    return () => clearInterval(interval);
  }, [
    isPlaying, 
    telemetry, 
    activeAppliance, 
    faultScenario, 
    faultIntensity, 
    progressiveWearDay, 
    targetState, 
    speedMultiplier
  ]);

  // Derived Energy Metrics
  const baselineDailyKwh = (activeAppliance.baseline.nominalPower / 1000) * 6.5; // ~6.5 operating hours expected
  const actualKwh = telemetry.energyToday;
  const excessKwh = Math.max(0, actualKwh - baselineDailyKwh);
  const additionalCost = excessKwh * tariffPerKwh;

  const energyMetrics: EnergyMetrics = {
    expectedTodayKwh: Number(baselineDailyKwh.toFixed(2)),
    actualTodayKwh: Number(actualKwh.toFixed(2)),
    estimatedExcessKwh: Number(excessKwh.toFixed(2)),
    tariffPerKwh,
    currencySymbol: '₹',
    estimatedAdditionalCost: Number(additionalCost.toFixed(2)),
    expectedMonthKwh: Number((baselineDailyKwh * 30).toFixed(1)),
    actualMonthKwh: Number((actualKwh * 30 * 1.05).toFixed(1)),
    excessMonthKwh: Number((excessKwh * 30).toFixed(1)),
    costImpactMonth: Number((additionalCost * 30).toFixed(2))
  };

  // Reset Simulation Action
  const resetSimulation = () => {
    setFaultScenario('NONE');
    setFaultIntensity(0.5);
    setProgressiveWearDay(1);
    setTargetState('NORMAL');
    globalProtectionEngine.resetProtection();
    globalSimulationEngine.setRelayState(false);
    setTelemetry({
      ...activeAppliance.telemetry,
      operatingState: 'NORMAL',
      energyToday: 8.42
    });
  };

  const resetProtection = () => {
    globalProtectionEngine.resetProtection();
    globalSimulationEngine.setRelayState(false);
    setProtectionState({
      status: 'ARMED',
      relayPosition: 'CLOSED',
      activeViolation: null,
      tripCountdownSeconds: activeAppliance.protection.persistenceSeconds,
      tripReason: null,
      lastTripTimestamp: null
    });
  };

  const manualTripProtection = () => {
    globalProtectionEngine.manualTrip('Manual Emergency Cutoff from Safety Dashboard');
    globalSimulationEngine.setRelayState(true);
  };

  const setCommissionVerified = (verified: boolean) => {
    setAppliances(prev => prev.map(a => {
      if (a.id === activeAppliance.id) {
        return {
          ...a,
          baseline: { ...a.baseline, isCommissionVerified: verified }
        };
      }
      return a;
    }));
  };

  const updateApplianceConfig = (applianceId: string, updates: Partial<ApplianceProfile>) => {
    setAppliances(prev => prev.map(a => a.id === applianceId ? { ...a, ...updates } : a));
  };

  const clearUnreadAlerts = () => {
    setUnreadAlertCount(0);
  };

  // Judge Demo sequence controller
  const executeJudgeDemoStep = (step: number) => {
    setJudgeDemoStep(step);
    switch (step) {
      case 1: // Normal
        setActiveSection('overview');
        setFaultScenario('NONE');
        setTargetState('NORMAL');
        resetProtection();
        break;
      case 2: // Startup
        setActiveSection('appliance-monitor');
        setTargetState('STARTUP');
        break;
      case 3: // Progressive wear
        setActiveSection('learning-mode');
        setFaultScenario('PROGRESSIVE_WEAR');
        setProgressiveWearDay(25);
        break;
      case 4: // Anomaly detected
        setActiveSection('ai-health');
        setFaultScenario('CURRENT_DEVIATION');
        setFaultIntensity(0.65);
        break;
      case 5: // Explainable alert
        setActiveSection('ai-health');
        break;
      case 6: // Energy waste
        setActiveSection('energy-intelligence');
        break;
      case 7: // Critical condition
        setActiveSection('protection');
        setFaultScenario('CRITICAL_OVERLOAD');
        break;
      case 8: // Protection activated
        setActiveSection('hardware-lab');
        // Let it trip or ensure trip
        setTimeout(() => {
          manualTripProtection();
        }, 1200);
        break;
      case 9: // Event logged
        setActiveSection('timeline');
        break;
      default:
        break;
    }
  };

  const nextJudgeDemoStep = () => {
    if (judgeDemoStep < 9) {
      executeJudgeDemoStep(judgeDemoStep + 1);
    }
  };

  const prevJudgeDemoStep = () => {
    if (judgeDemoStep > 1) {
      executeJudgeDemoStep(judgeDemoStep - 1);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        appliances,
        activeAppliance,
        setActiveApplianceId,
        updateApplianceConfig,
        telemetry,
        telemetryHistory,
        health,
        explainableAlert,
        protectionState,
        energyMetrics,
        events,
        unreadAlertCount,
        clearUnreadAlerts,
        isPlaying,
        setIsPlaying,
        speedMultiplier,
        setSpeedMultiplier,
        faultScenario,
        setFaultScenario,
        faultIntensity,
        setFaultIntensity,
        progressiveWearDay,
        setProgressiveWearDay,
        targetState,
        setTargetState,
        resetSimulation,
        resetProtection,
        manualTripProtection,
        setCommissionVerified,
        setElectricityTariff: setTariffPerKwh,
        selectedComponentId,
        setSelectedComponentId,
        explodedProgress,
        setExplodedProgress,
        casingMode,
        setCasingMode,
        flowMode,
        setFlowMode,
        hardwareVariant,
        setHardwareVariant,
        isJudgeDemoOpen,
        setIsJudgeDemoOpen,
        judgeDemoStep,
        setJudgeDemoStep: executeJudgeDemoStep,
        nextJudgeDemoStep,
        prevJudgeDemoStep
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
