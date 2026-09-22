// LOADGUARD AI - Type Definitions

export type OperatingState = 
  | 'IDLE' 
  | 'STARTUP' 
  | 'NORMAL' 
  | 'HIGH_LOAD' 
  | 'COOLDOWN' 
  | 'SHUTDOWN';

export type SystemStatus = 
  | 'NORMAL' 
  | 'WARNING' 
  | 'ABNORMAL' 
  | 'CRITICAL' 
  | 'TRIPPED' 
  | 'OFFLINE';

export type AlertSeverity = 
  | 'INFO' 
  | 'WARNING' 
  | 'ABNORMAL' 
  | 'CRITICAL' 
  | 'PROTECTION';

export interface ElectricalTelemetry {
  voltage: number;         // V (e.g. 229.4)
  current: number;         // A (e.g. 5.42)
  realPower: number;       // W (e.g. 1180)
  apparentPower: number;   // VA
  reactivePower: number;   // VAR
  powerFactor: number;     // 0.0 - 1.0 (e.g. 0.91)
  frequency: number;       // Hz (e.g. 50.02)
  temperature: number;     // °C (e.g. 38.4)
  energyToday: number;     // kWh accumulated
  operatingState: OperatingState;
  timestamp: number;       // Unix epoch ms
}

export interface BaselineProfile {
  isLearned: boolean;
  learningProgress: number; // 0 - 100%
  daysLearned: number;     // e.g. 7
  totalDaysTarget: number; // 7
  cyclesObserved: number;
  dataQuality: number;     // 0 - 100%
  isCommissionVerified: boolean; // Healthy reference confirmed by user
  nominalVoltage: number;  // 230 V
  nominalCurrent: number;  // A
  nominalPower: number;    // W
  nominalPowerFactor: number;
  nominalTemperature: number; // °C
  startupSurgeMax: number; // Peak A
  cycleDurationAvg: number;// minutes
  stateBaselines: Record<OperatingState, {
    current: number;
    power: number;
    powerFactor: number;
    temperature: number;
  }>;
}

export interface HealthScoreBreakdown {
  overall: number;               // 0 - 100
  statusText: string;            // e.g. "Healthy with Minor Deviation"
  electricalStability: number;   // 0 - 100
  energyEfficiency: number;      // 0 - 100
  thermalBehaviour: number;      // 0 - 100
  operatingConsistency: number;  // 0 - 100
  powerQuality: number;          // 0 - 100
  trendHistory: { day: string; score: number }[];
}

export interface ExplainableAIAlert {
  id: string;
  hasActiveAlert: boolean;
  headline: string;
  primaryReason: string;
  persistenceCycles: number;
  observations: {
    label: string;
    value: string;
    isAbnormal: boolean;
  }[];
  interpretation: string;
  recommendation: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface ProtectionConfig {
  maxCurrentLimit: number;    // A (e.g. 7.0)
  maxTemperatureLimit: number;// °C (e.g. 70.0)
  minVoltageLimit: number;    // V (e.g. 200.0)
  maxVoltageLimit: number;    // V (e.g. 250.0)
  persistenceSeconds: number; // s (e.g. 5.0)
  isArmed: boolean;
}

export interface ProtectionState {
  status: 'ARMED' | 'WARNING' | 'CRITICAL_PENDING' | 'TRIPPED';
  relayPosition: 'CLOSED' | 'OPEN';
  activeViolation: string | null;
  tripCountdownSeconds: number; // Remaining time until trip
  tripReason: string | null;
  lastTripTimestamp: number | null;
}

export interface EnergyMetrics {
  expectedTodayKwh: number;
  actualTodayKwh: number;
  estimatedExcessKwh: number;
  tariffPerKwh: number;       // In local currency (e.g. ₹ 8.50)
  currencySymbol: string;     // ₹
  estimatedAdditionalCost: number;
  expectedMonthKwh: number;
  actualMonthKwh: number;
  excessMonthKwh: number;
  costImpactMonth: number;
}

export interface HardwareComponentInfo {
  id: string;
  name: string;
  category: 'POWER' | 'SENSING' | 'PROCESSING' | 'SWITCHING' | 'COMMUNICATION';
  purpose: string;
  measurementRole: string;
  typicalSignal: string;
  whyItMatters: string;
  status: 'ONLINE' | 'ACTIVE' | 'WARNING' | 'TRIPPED' | 'STANDBY';
  position: [number, number, number]; // 3D local coordinate
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeEpoch: number;
  applianceId: string;
  applianceName: string;
  title: string;
  severity: AlertSeverity;
  current: number;
  power: number;
  temperature: number;
  voltage: number;
  triggerCondition: string;
  decisionRule: string;
  actionTaken: string;
  systemState: SystemStatus;
}

export interface ApplianceProfile {
  id: string;
  name: string;
  category: string;
  assetTag: string;
  age: string;
  hardwareVariant: 'HOUSEHOLD' | 'INDUSTRIAL';
  ratedPowerW: number;
  ratedVoltageV: number;
  ratedCurrentA: number;
  ratedPF: number;
  telemetry: ElectricalTelemetry;
  baseline: BaselineProfile;
  health: HealthScoreBreakdown;
  protection: ProtectionConfig;
  status: SystemStatus;
}

export type FaultScenario = 
  | 'NONE'
  | 'STARTUP_SURGE'
  | 'VOLTAGE_SAG'
  | 'VOLTAGE_FLUCTUATION'
  | 'CURRENT_DEVIATION'
  | 'THERMAL_DRIFT'
  | 'POWER_FACTOR_DROP'
  | 'PROGRESSIVE_WEAR'
  | 'CRITICAL_OVERLOAD'
  | 'NETWORK_FAILURE';

export type NavigationSection = 
  | 'overview'
  | 'hardware-lab'
  | 'appliance-monitor'
  | 'learning-mode'
  | 'ai-health'
  | 'energy-intelligence'
  | 'protection'
  | 'timeline'
  | 'fleet'
  | 'settings';
