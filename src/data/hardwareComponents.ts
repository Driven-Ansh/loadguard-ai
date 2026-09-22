import { HardwareComponentInfo } from '../types';

export const HARDWARE_COMPONENTS: HardwareComponentInfo[] = [
  {
    id: 'ac_input',
    name: 'AC Input Terminal Block',
    category: 'POWER',
    purpose: 'Accepts incoming utility mains power (230V / 50Hz single-phase or 415V three-phase).',
    measurementRole: 'Entry point for line voltage and line current before filtering and switching.',
    typicalSignal: '220 - 240 VAC RMS, 50/60 Hz sinusoidal mains waveform.',
    whyItMatters: 'Industrial-grade screw cage clamp prevents high-resistance contact arcs and overheating.',
    status: 'ONLINE',
    position: [-1.4, 0.2, -0.9]
  },
  {
    id: 'protection_module',
    name: 'Primary Protection Section',
    category: 'POWER',
    purpose: 'Absorbs utility voltage spikes, lightning transients, and limits short-circuit fault energy.',
    measurementRole: 'First-line defense; integrates metal-oxide varistors (MOV), thermal cutoffs, and fast blow ceramic fuses.',
    typicalSignal: 'Clamps surge voltages >385 VAC within <25 nanoseconds.',
    whyItMatters: 'Guarantees the monitoring electronics and load are isolated from destructive utility line surges.',
    status: 'ONLINE',
    position: [-0.9, 0.25, -0.5]
  },
  {
    id: 'current_sensor',
    name: 'Toroidal Current Transformer (CT)',
    category: 'SENSING',
    purpose: 'Provides high-bandwidth galvanically isolated current telemetry from 50mA to 32A.',
    measurementRole: 'Outputs proportional low-voltage differential analog signal to the metering ADC.',
    typicalSignal: '0 to 333 mV RMS differential proportional to load current, 10 kHz bandwidth.',
    whyItMatters: 'Enables high-fidelity capture of motor startup inrush transients, micro-surges, and harmonic current distortion.',
    status: 'ONLINE',
    position: [-0.3, 0.4, 0.1]
  },
  {
    id: 'voltage_sensor',
    name: 'Precision Voltage Sensing Section',
    category: 'SENSING',
    purpose: 'Monitors real-time mains line voltage waveform with 0.1% accuracy.',
    measurementRole: 'M-Ohm laser-trimmed divider network coupled to high-CMRR isolation amplifier.',
    typicalSignal: '±1.2 V peak differential input to sigma-delta converter.',
    whyItMatters: 'Critical for computing true RMS voltage, frequency lock (PLL), phase angle, and power factor.',
    status: 'ONLINE',
    position: [0.3, 0.2, -0.6]
  },
  {
    id: 'metering_ic',
    name: 'Dedicated Energy Metering IC',
    category: 'PROCESSING',
    purpose: 'High-speed hardware polyphase metering processor with 24-bit sigma-delta ADCs.',
    measurementRole: 'Calculates instantaneous V, I, Real Power (W), Reactive Power (VAR), Apparent Power (VA), and Power Factor at 6.4 kSPS.',
    typicalSignal: 'SPI / I2C digital bus with hardware cyclic redundancy check (CRC-16).',
    whyItMatters: 'Offloads real-time metrology computation from the main MCU with class 0.5S industrial billing-grade accuracy.',
    status: 'ONLINE',
    position: [0.1, 0.25, 0.0]
  },
  {
    id: 'mcu_edge',
    name: 'MCU / Edge AI Processor',
    category: 'PROCESSING',
    purpose: 'Dual-core 240MHz microcontroller executing on-device baseline learning and deterministic protection rules.',
    measurementRole: 'Runs circular telemetry buffers, sliding-window statistical anomaly checks, and commands the relay trip line in <10ms.',
    typicalSignal: '3.3V LVCMOS GPIO interrupt lines, dual hardware timers, neural vector inference engine.',
    whyItMatters: 'Guarantees sub-cycle safety trips even during loss of cloud/network connectivity (Edge autonomy).',
    status: 'ONLINE',
    position: [0.7, 0.25, 0.1]
  },
  {
    id: 'comm_module',
    name: 'Communication Module & Antenna',
    category: 'COMMUNICATION',
    purpose: 'Dual-band Wi-Fi 6, Bluetooth LE 5.2, and isolated RS485 Modbus industrial RTU interface.',
    measurementRole: 'Transmits compressed telemetry frames and cryptographic audit events to cloud and local dashboard.',
    typicalSignal: '2.4 GHz RF / RS485 differential bus (A/B line at 115200 baud).',
    whyItMatters: 'Enables remote fleet management, firmware OTA upgrades, and fleet-wide anomaly correlation.',
    status: 'ONLINE',
    position: [1.2, 0.35, -0.7]
  },
  {
    id: 'temp_sensor',
    name: 'Precision Shunt & Enclosure Temp Sensor',
    category: 'SENSING',
    purpose: 'Monitors thermal dynamics of internal power switching path and ambient enclosure heat.',
    measurementRole: 'Sub-miniature platinum RTD / calibrated digital 1-Wire probe with 0.1°C resolution.',
    typicalSignal: '1-Wire digital pulse train / 10k NTC resistance bridge.',
    whyItMatters: 'Prevents thermal runaway, detects bad terminal contacts, and powers the multi-signal AI thermal correlation model.',
    status: 'ONLINE',
    position: [0.4, 0.2, 0.6]
  },
  {
    id: 'power_supply',
    name: 'Isolated Switched-Mode Power Supply',
    category: 'POWER',
    purpose: 'Converts 85-265 VAC universal mains input to regulated, galvanic 3.3V and 12V DC logic rails.',
    measurementRole: 'Supplies high-dielectric isolated power (2.5 kV RMS reinforced isolation barrier) to sensitive electronics.',
    typicalSignal: '12V DC (relay coil drive) & 3.3V DC ±1% (MCU & sensors).',
    whyItMatters: 'Ensures the processor and wireless radios survive severe mains sags, brownouts, and electrical noise.',
    status: 'ONLINE',
    position: [-0.9, 0.35, 0.6]
  },
  {
    id: 'relay_section',
    name: 'Deterministic Latching Contactor / Relay',
    category: 'SWITCHING',
    purpose: 'High-current mechanical switching element for electrical load connection and emergency protective trip.',
    measurementRole: 'Deterministic safety execution: physically separates load contacts when overcurrent/temperature limits are violated.',
    typicalSignal: '16A / 250 VAC continuous rated silver-alloy contacts with arc suppression chamber.',
    whyItMatters: 'Provides galvanic physical air-gap disconnection, serving as the guaranteed hardware safety mechanism.',
    status: 'ONLINE',
    position: [1.0, 0.45, 0.6]
  },
  {
    id: 'load_output',
    name: 'Load Output Terminal Block',
    category: 'POWER',
    purpose: 'Switched power connection directly supplying the monitored appliance or industrial load.',
    measurementRole: 'Clean, protected power terminal feeding the appliance after safety relay and current sensing.',
    typicalSignal: '230 VAC RMS (or 0 VAC when safety relay is tripped).',
    whyItMatters: 'Reinforced nylon barrier prevents accidental finger contact and wiring cross-shorts.',
    status: 'ONLINE',
    position: [1.4, 0.2, 0.9]
  }
];
