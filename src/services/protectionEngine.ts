import { ElectricalTelemetry, ProtectionConfig, ProtectionState, TimelineEvent } from '../types';

export class ProtectionEngine {
  private violationTimerSeconds: number = 0;
  private isTripped: boolean = false;
  private tripReason: string | null = null;
  private lastTripTime: number | null = null;

  public resetProtection() {
    this.isTripped = false;
    this.violationTimerSeconds = 0;
    this.tripReason = null;
  }

  public manualTrip(reason: string = 'Manual Emergency Cutoff') {
    this.isTripped = true;
    this.tripReason = reason;
    this.lastTripTime = Date.now();
  }

  public evaluate(
    telemetry: ElectricalTelemetry,
    config: ProtectionConfig,
    deltaSeconds: number,
    speedMultiplier: number,
    applianceId: string,
    applianceName: string,
    onTripEvent?: (event: TimelineEvent) => void
  ): ProtectionState {
    if (this.isTripped) {
      return {
        status: 'TRIPPED',
        relayPosition: 'OPEN',
        activeViolation: this.tripReason,
        tripCountdownSeconds: 0,
        tripReason: this.tripReason,
        lastTripTimestamp: this.lastTripTime
      };
    }

    if (!config.isArmed) {
      return {
        status: 'ARMED',
        relayPosition: 'CLOSED',
        activeViolation: null,
        tripCountdownSeconds: config.persistenceSeconds,
        tripReason: null,
        lastTripTimestamp: null
      };
    }

    // Check deterministic safety rules
    let violation: string | null = null;

    if (telemetry.current > config.maxCurrentLimit) {
      violation = `Overcurrent: ${telemetry.current.toFixed(2)} A exceeds limit of ${config.maxCurrentLimit.toFixed(1)} A`;
    } else if (telemetry.temperature > config.maxTemperatureLimit) {
      violation = `Overtemperature: ${telemetry.temperature.toFixed(1)} °C exceeds limit of ${config.maxTemperatureLimit.toFixed(1)} °C`;
    } else if (telemetry.voltage < config.minVoltageLimit) {
      violation = `Severe Voltage Sag: ${telemetry.voltage.toFixed(1)} V below minimum limit of ${config.minVoltageLimit.toFixed(1)} V`;
    } else if (telemetry.voltage > config.maxVoltageLimit) {
      violation = `Severe Voltage Swell: ${telemetry.voltage.toFixed(1)} V above maximum limit of ${config.maxVoltageLimit.toFixed(1)} V`;
    }

    if (violation) {
      this.violationTimerSeconds += deltaSeconds * speedMultiplier;
      const remainingSeconds = Math.max(0, config.persistenceSeconds - this.violationTimerSeconds);

      if (remainingSeconds <= 0) {
        // Deterministic protection activated!
        this.isTripped = true;
        this.tripReason = violation;
        this.lastTripTime = Date.now();

        if (onTripEvent) {
          onTripEvent({
            id: `prot_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            timeEpoch: Date.now(),
            applianceId,
            applianceName,
            title: 'DETERMINISTIC PROTECTION ACTIVATED: CONTACTOR OPENED',
            severity: 'PROTECTION',
            current: telemetry.current,
            power: telemetry.realPower,
            temperature: telemetry.temperature,
            voltage: telemetry.voltage,
            triggerCondition: violation,
            decisionRule: `Deterministic limit exceeded for continuous ${config.persistenceSeconds.toFixed(1)}s window`,
            actionTaken: 'High-speed latching relay opened (<10ms). Load isolated from mains supply.',
            systemState: 'TRIPPED'
          });
        }

        return {
          status: 'TRIPPED',
          relayPosition: 'OPEN',
          activeViolation: violation,
          tripCountdownSeconds: 0,
          tripReason: violation,
          lastTripTimestamp: this.lastTripTime
        };
      }

      return {
        status: 'CRITICAL_PENDING',
        relayPosition: 'CLOSED',
        activeViolation: violation,
        tripCountdownSeconds: Number(remainingSeconds.toFixed(1)),
        tripReason: null,
        lastTripTimestamp: null
      };
    } else {
      // No violation; decay any previous countdown
      this.violationTimerSeconds = Math.max(0, this.violationTimerSeconds - deltaSeconds * 2.0);
      return {
        status: 'ARMED',
        relayPosition: 'CLOSED',
        activeViolation: null,
        tripCountdownSeconds: config.persistenceSeconds,
        tripReason: null,
        lastTripTimestamp: this.lastTripTime
      };
    }
  }
}

export const globalProtectionEngine = new ProtectionEngine();
