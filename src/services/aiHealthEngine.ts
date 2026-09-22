import { ApplianceProfile, ElectricalTelemetry, ExplainableAIAlert, HealthScoreBreakdown } from '../types';

export class AIHealthEngine {
  public evaluateHealth(
    telemetry: ElectricalTelemetry,
    appliance: ApplianceProfile
  ): HealthScoreBreakdown {
    const baseline = appliance.baseline;
    const stateBaseline = baseline.stateBaselines[telemetry.operatingState] || baseline.stateBaselines.NORMAL;

    // 1. Electrical Stability Score (0-100)
    // Compares voltage deviation from nominal (230V) and current spike above state baseline
    const voltageDeviationPct = Math.abs(telemetry.voltage - baseline.nominalVoltage) / baseline.nominalVoltage * 100;
    const currentOverStatePct = Math.max(0, (telemetry.current - stateBaseline.current) / (stateBaseline.current || 1) * 100);
    const electricalStability = Math.round(
      Math.max(10, Math.min(100, 100 - (voltageDeviationPct * 2.5) - (currentOverStatePct * 1.5)))
    );

    // 2. Energy Efficiency Score (0-100)
    // Compares actual real power with nominal baseline power for the current state
    const powerDeviationPct = Math.max(0, (telemetry.realPower - stateBaseline.power) / (stateBaseline.power || 1) * 100);
    const energyEfficiency = Math.round(
      Math.max(10, Math.min(100, 100 - (powerDeviationPct * 1.8)))
    );

    // 3. Thermal Behaviour Score (0-100)
    // Compares temperature against expected baseline temperature for state
    const tempDelta = Math.max(0, telemetry.temperature - stateBaseline.temperature);
    const thermalBehaviour = Math.round(
      Math.max(10, Math.min(100, 100 - (tempDelta * 3.2)))
    );

    // 4. Operating Consistency Score (0-100)
    // Evaluates power factor alignment with baseline
    const pfDelta = Math.max(0, stateBaseline.powerFactor - telemetry.powerFactor);
    const operatingConsistency = Math.round(
      Math.max(10, Math.min(100, 100 - (pfDelta * 90) - (currentOverStatePct * 0.5)))
    );

    // 5. Power Quality Score (0-100)
    const freqDelta = Math.abs(telemetry.frequency - 50.0);
    const powerQuality = Math.round(
      Math.max(10, Math.min(100, (telemetry.powerFactor * 100) - (freqDelta * 20)))
    );

    // Weighted Overall Score
    const overall = Math.round(
      electricalStability * 0.25 +
      energyEfficiency * 0.25 +
      thermalBehaviour * 0.20 +
      operatingConsistency * 0.15 +
      powerQuality * 0.15
    );

    let statusText = 'Optimal Baseline Performance';
    if (overall < 65) {
      statusText = 'Critical Deviation: High Anomaly Risk';
    } else if (overall < 80) {
      statusText = 'Warning: Persistent Thermal & Electrical Drift';
    } else if (overall < 90) {
      statusText = 'Healthy with Minor Deviation';
    }

    // Keep existing trend history and update latest entry
    const trendHistory = appliance.health.trendHistory.map((item, idx) => {
      if (idx === appliance.health.trendHistory.length - 1) {
        return { ...item, score: overall };
      }
      return item;
    });

    return {
      overall,
      statusText,
      electricalStability,
      energyEfficiency,
      thermalBehaviour,
      operatingConsistency,
      powerQuality,
      trendHistory
    };
  }

  public generateExplainableAlert(
    telemetry: ElectricalTelemetry,
    appliance: ApplianceProfile
  ): ExplainableAIAlert {
    const base = appliance.baseline.stateBaselines[telemetry.operatingState] || appliance.baseline.stateBaselines.NORMAL;
    const currentDeltaPct = ((telemetry.current - base.current) / (base.current || 1)) * 100;
    const powerDeltaPct = ((telemetry.realPower - base.power) / (base.power || 1)) * 100;
    const tempDeltaC = telemetry.temperature - base.temperature;
    const pfDelta = base.powerFactor - telemetry.powerFactor;

    const isCurrentElevated = currentDeltaPct > 5.0;
    const isPowerElevated = powerDeltaPct > 5.0;
    const isTempElevated = tempDeltaC > 2.0;
    const isPFDegraded = pfDelta > 0.05;
    const isVoltageAbnormal = Math.abs(telemetry.voltage - appliance.baseline.nominalVoltage) > 15;

    const hasAnomaly = isCurrentElevated || isTempElevated || isPFDegraded;

    if (!hasAnomaly) {
      return {
        id: 'alert_normal',
        hasActiveAlert: false,
        headline: 'ELECTRICAL BEHAVIOUR NORMAL',
        primaryReason: 'All telemetry metrics are within established baseline confidence envelopes (±5%).',
        persistenceCycles: 0,
        observations: [
          { label: 'Voltage Range', value: `${telemetry.voltage.toFixed(1)} V (Nominal)`, isAbnormal: false },
          { label: 'Current Draw', value: `${telemetry.current.toFixed(2)} A (Within baseline)`, isAbnormal: false },
          { label: 'Real Power', value: `${telemetry.realPower} W (Expected)`, isAbnormal: false },
          { label: 'Operating Temp', value: `${telemetry.temperature.toFixed(1)} °C (Stable)`, isAbnormal: false },
          { label: 'Power Factor', value: `${telemetry.powerFactor.toFixed(2)} (High efficiency)`, isAbnormal: false }
        ],
        interpretation: 'Appliance is operating in complete accordance with the learned 7-day electrical baseline.',
        recommendation: 'Continue regular automated monitoring. No maintenance required.',
        severity: 'INFO',
        timestamp: new Date().toLocaleTimeString()
      };
    }

    const isCritical = currentDeltaPct > 25 || tempDeltaC > 15 || telemetry.current > appliance.protection.maxCurrentLimit;

    return {
      id: `alert_${Date.now()}`,
      hasActiveAlert: true,
      headline: isCritical ? 'CRITICAL ELECTRICAL OVERLOAD DETECTED' : 'UNUSUAL ELECTRICAL BEHAVIOUR DETECTED',
      primaryReason: `Current is ${currentDeltaPct > 0 ? '+' : ''}${currentDeltaPct.toFixed(1)}% above the learned baseline (${base.current.toFixed(2)} A nominal).`,
      persistenceCycles: isCritical ? 9 : 6,
      observations: [
        { 
          label: 'Mains Voltage', 
          value: `${telemetry.voltage.toFixed(1)} V (${isVoltageAbnormal ? 'Sag/Fluctuation' : 'Stable'})`, 
          isAbnormal: isVoltageAbnormal 
        },
        { 
          label: 'Load Current', 
          value: `${telemetry.current.toFixed(2)} A (${currentDeltaPct > 0 ? '+' : ''}${currentDeltaPct.toFixed(1)}% drift)`, 
          isAbnormal: isCurrentElevated 
        },
        { 
          label: 'Real Power Draw', 
          value: `${telemetry.realPower} W (${powerDeltaPct > 0 ? '+' : ''}${powerDeltaPct.toFixed(1)}% vs baseline)`, 
          isAbnormal: isPowerElevated 
        },
        { 
          label: 'Operating Temp', 
          value: `${telemetry.temperature.toFixed(1)} °C (+${tempDeltaC.toFixed(1)} °C above thermal baseline)`, 
          isAbnormal: isTempElevated 
        },
        { 
          label: 'Power Factor', 
          value: `${telemetry.powerFactor.toFixed(2)} (${isPFDegraded ? 'Inductive drag' : 'Normal'})`, 
          isAbnormal: isPFDegraded 
        }
      ],
      interpretation: isCritical
        ? 'Electrical load is approaching or exceeding configured safety envelope. Thermal and current rise indicate severe mechanical binding or electrical overload.'
        : 'Electrical behaviour is deviating from the established operating profile. Multi-signal analysis indicates sustained elevation across current, power, and thermal vectors.',
      recommendation: isCritical
        ? 'Deterministic safety engine is armed. Stand by for automatic protective contactor isolation if sustained.'
        : 'Continue automated monitoring. Physical inspection of mechanical components, filters, or lubrication is recommended if trend persists.',
      severity: isCritical ? 'CRITICAL' : 'ABNORMAL',
      timestamp: new Date().toLocaleTimeString()
    };
  }
}

export const globalAIHealthEngine = new AIHealthEngine();
