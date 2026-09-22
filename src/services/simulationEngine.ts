import { ApplianceProfile, ElectricalTelemetry, FaultScenario, OperatingState } from '../types';

export interface SimulationParams {
  faultScenario: FaultScenario;
  faultIntensity: number; // 0.0 to 1.0 (0% to 100%)
  progressiveWearDay: number; // 1 to 40
  targetState: OperatingState;
  ambientTemperature: number; // °C (default 26.0)
  speedMultiplier: number;
}

export class SimulationEngine {
  private startupElapsedSeconds: number = 0;
  private isRelayOpen: boolean = false;
  private noiseSeed: number = Math.random();

  public setRelayState(isOpen: boolean) {
    this.isRelayOpen = isOpen;
  }

  public step(
    currentTelemetry: ElectricalTelemetry,
    appliance: ApplianceProfile,
    params: SimulationParams,
    deltaSeconds: number
  ): ElectricalTelemetry {
    // If relay is tripped open, electrical flow is completely broken
    if (this.isRelayOpen) {
      const ambient = params.ambientTemperature;
      // Thermal cooling toward ambient
      const cooledTemp = Math.max(
        ambient,
        currentTelemetry.temperature - 0.25 * deltaSeconds * params.speedMultiplier
      );
      return {
        ...currentTelemetry,
        current: 0.0,
        realPower: 0,
        apparentPower: 0,
        reactivePower: 0,
        powerFactor: 1.0,
        temperature: Number(cooledTemp.toFixed(1)),
        operatingState: 'SHUTDOWN',
        timestamp: Date.now()
      };
    }

    const state = params.targetState;
    const baseBaseline = appliance.baseline.stateBaselines[state] || appliance.baseline.stateBaselines.NORMAL;
    
    // 1. Voltage Calculation
    let targetVoltage = appliance.ratedVoltageV;
    if (params.faultScenario === 'VOLTAGE_SAG') {
      targetVoltage -= 35 * params.faultIntensity; // Drop to ~195V
    } else if (params.faultScenario === 'VOLTAGE_FLUCTUATION') {
      const freqWobble = Math.sin(Date.now() / 1200) * 18 * params.faultIntensity;
      targetVoltage += freqWobble;
    }
    // Small natural utility grid variation (±0.4 V)
    const gridNoise = (Math.sin(Date.now() / 3000 + this.noiseSeed) * 0.35);
    const voltage = Number((targetVoltage + gridNoise).toFixed(1));

    // 2. Base Current Calculation
    let targetCurrent = baseBaseline.current;

    // Handle startup surge transient
    if (state === 'STARTUP') {
      this.startupElapsedSeconds += deltaSeconds * params.speedMultiplier;
      const peakSurge = appliance.baseline.startupSurgeMax;
      // Exponential decay of startup surge over ~1.2s
      const tau = 0.45;
      const surgeDecay = Math.exp(-this.startupElapsedSeconds / tau);
      targetCurrent = baseBaseline.current + (peakSurge - baseBaseline.current) * surgeDecay;
    } else {
      this.startupElapsedSeconds = 0;
    }

    // Apply Fault Scenarios to Current
    if (params.faultScenario === 'CURRENT_DEVIATION') {
      // 13.2% deviation + intensity scaling
      targetCurrent *= (1.0 + 0.132 * (0.8 + 0.6 * params.faultIntensity));
    } else if (params.faultScenario === 'PROGRESSIVE_WEAR') {
      // Day 1 to Day 40 drift
      // Day 1: 1180W -> Day 40: 1290W (~9.3% current increase)
      const dayFactor = Math.min(1.0, (params.progressiveWearDay - 1) / 39);
      targetCurrent *= (1.0 + 0.093 * dayFactor);
    } else if (params.faultScenario === 'CRITICAL_OVERLOAD') {
      // Exceeds rated limit safely for simulation (e.g. 8.1A for 7.0A limit)
      targetCurrent = (appliance.protection.maxCurrentLimit * 1.15) * (1.0 + 0.1 * params.faultIntensity);
    }

    // Smooth current response (low-pass filter)
    const smoothingAlpha = Math.min(1.0, 3.5 * deltaSeconds * params.speedMultiplier);
    const sensorJitter = (Math.random() - 0.5) * 0.04; // ±0.02 A realistic ADC noise
    const currentVal = Math.max(0, currentTelemetry.current + (targetCurrent - currentTelemetry.current) * smoothingAlpha + sensorJitter);
    const current = Number(currentVal.toFixed(2));

    // 3. Power Factor Calculation
    let targetPF = baseBaseline.powerFactor;
    if (params.faultScenario === 'POWER_FACTOR_DROP') {
      targetPF = Math.max(0.55, targetPF - 0.22 * params.faultIntensity);
    } else if (params.faultScenario === 'PROGRESSIVE_WEAR') {
      const dayFactor = Math.min(1.0, (params.progressiveWearDay - 1) / 39);
      targetPF = Math.max(0.75, targetPF - 0.05 * dayFactor);
    }
    const pfJitter = (Math.random() - 0.5) * 0.005;
    const powerFactor = Number(Math.min(1.0, Math.max(0.2, targetPF + pfJitter)).toFixed(2));

    // 4. Power Physics Core
    // P = V * I * PF (for single phase) or sqrt(3) * V * I * PF (for 3-phase)
    const is3Phase = appliance.hardwareVariant === 'INDUSTRIAL';
    const phaseMultiplier = is3Phase ? Math.sqrt(3) : 1.0;
    
    const apparentPower = Math.round(voltage * current * phaseMultiplier);
    const realPower = Math.round(apparentPower * powerFactor);
    const reactivePower = Math.round(Math.sqrt(Math.max(0, apparentPower * apparentPower - realPower * realPower)));

    // 5. Thermal Inertia Simulation
    // dT/dt = (k_heat * I^2 - k_dissipation * (T - T_ambient))
    const ambient = params.ambientTemperature;
    const kHeat = 0.035;
    const kDissipation = 0.025;
    let thermalFaultOffset = 0;
    if (params.faultScenario === 'THERMAL_DRIFT') {
      thermalFaultOffset = 15.0 * params.faultIntensity;
    }
    const targetEquilibriumTemp = ambient + (current * current * kHeat / kDissipation) + thermalFaultOffset;
    const thermalSpeed = 0.45 * deltaSeconds * params.speedMultiplier;
    const nextTemp = currentTelemetry.temperature + (targetEquilibriumTemp - currentTelemetry.temperature) * thermalSpeed;
    const temperature = Number(Math.max(ambient, nextTemp).toFixed(1));

    // 6. Frequency Calculation
    const freqNoise = (Math.sin(Date.now() / 4000) * 0.04);
    const frequency = Number((50.0 + freqNoise).toFixed(2));

    // 7. Energy Accumulation (kWh)
    const hoursDelta = (deltaSeconds * params.speedMultiplier) / 3600;
    const addedKwh = (realPower / 1000) * hoursDelta;
    const energyToday = Number((currentTelemetry.energyToday + addedKwh).toFixed(3));

    return {
      voltage,
      current,
      realPower,
      apparentPower,
      reactivePower,
      powerFactor,
      frequency,
      temperature,
      energyToday,
      operatingState: state,
      timestamp: Date.now()
    };
  }
}

export const globalSimulationEngine = new SimulationEngine();
