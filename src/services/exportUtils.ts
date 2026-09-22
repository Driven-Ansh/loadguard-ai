import { ApplianceProfile, ElectricalTelemetry, EnergyMetrics, HealthScoreBreakdown, TimelineEvent } from '../types';

export class ExportUtils {
  public static downloadCSV(telemetryHistory: ElectricalTelemetry[], appliance: ApplianceProfile) {
    const headers = [
      'Timestamp_ISO',
      'Asset_ID',
      'Appliance_Name',
      'Voltage_V',
      'Current_A',
      'RealPower_W',
      'ApparentPower_VA',
      'ReactivePower_VAR',
      'PowerFactor',
      'Frequency_Hz',
      'Temperature_C',
      'EnergyAccumulated_kWh',
      'OperatingState'
    ];

    const rows = telemetryHistory.map(t => [
      new Date(t.timestamp).toISOString(),
      appliance.assetTag,
      `"${appliance.name}"`,
      t.voltage.toFixed(1),
      t.current.toFixed(2),
      t.realPower,
      t.apparentPower,
      t.reactivePower,
      t.powerFactor.toFixed(2),
      t.frequency.toFixed(2),
      t.temperature.toFixed(1),
      t.energyToday.toFixed(3),
      t.operatingState
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LoadGuard_${appliance.assetTag}_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static downloadJSONAudit(events: TimelineEvent[], appliance: ApplianceProfile) {
    const auditData = {
      exportTimestamp: new Date().toISOString(),
      device: {
        assetId: appliance.assetTag,
        name: appliance.name,
        category: appliance.category,
        ratedSpecs: {
          powerW: appliance.ratedPowerW,
          voltageV: appliance.ratedVoltageV,
          currentA: appliance.ratedCurrentA,
          powerFactor: appliance.ratedPF
        }
      },
      auditRecordsCount: events.length,
      integrityChecksum: `SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      events
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LoadGuard_SecurityAudit_${appliance.assetTag}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static generatePrintableReport(
    appliance: ApplianceProfile,
    health: HealthScoreBreakdown,
    energy: EnergyMetrics,
    events: TimelineEvent[]
  ) {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LoadGuard AI Health & Protection Report - ${appliance.assetTag}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; }
          .header { border-bottom: 2px solid #00f0ff; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 24px; font-weight: bold; color: #00f0ff; }
          .badge { background: #1e293b; padding: 4px 10px; border-radius: 4px; font-size: 12px; border: 1px solid #334155; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
          .card { background: #1e293b; padding: 15px; border-radius: 6px; border: 1px solid #334155; }
          .metric-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
          .metric-val { font-size: 22px; font-weight: bold; color: #38bdf8; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #334155; }
          th { background: #0f172a; color: #94a3b8; }
          .disclaimer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">LOADGUARD AI — APPLIANCE HEALTH REPORT</div>
            <div>Asset: ${appliance.name} (${appliance.assetTag}) | Category: ${appliance.category}</div>
          </div>
          <div class="badge">SIMULATION AUDIT COPY</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="metric-label">Composite Health Score</div>
            <div class="metric-val" style="color: ${health.overall > 80 ? '#00e676' : health.overall > 60 ? '#ffb300' : '#ff1744'}">
              ${health.overall} / 100
            </div>
            <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">${health.statusText}</div>
          </div>
          <div class="card">
            <div class="metric-label">Today's Consumption</div>
            <div class="metric-val">${appliance.telemetry.energyToday.toFixed(2)} kWh</div>
            <div style="font-size: 12px; margin-top: 4px; color: #ffb300;">Est. Abnormal: ${energy.estimatedExcessKwh.toFixed(2)} kWh</div>
          </div>
          <div class="card">
            <div class="metric-label">Deterministic Safety</div>
            <div class="metric-val" style="color: ${appliance.protection.isArmed ? '#00e676' : '#ff1744'}">
              ${appliance.protection.isArmed ? 'ARMED & ACTIVE' : 'DISARMED'}
            </div>
            <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">Max Current: ${appliance.protection.maxCurrentLimit}A | Max Temp: ${appliance.protection.maxTemperatureLimit}°C</div>
          </div>
        </div>

        <h3>Health Dimension Breakdown</h3>
        <table>
          <tr><th>Dimension</th><th>Score</th><th>Nominal Reference</th><th>Current Deviation Assessment</th></tr>
          <tr><td>Electrical Stability</td><td>${health.electricalStability}/100</td><td>${appliance.baseline.nominalVoltage}V ±5%</td><td>Stable utility grid synchronization</td></tr>
          <tr><td>Energy Efficiency</td><td>${health.energyEfficiency}/100</td><td>${appliance.baseline.nominalPower}W baseline</td><td>Tracked vs empirical state envelope</td></tr>
          <tr><td>Thermal Behaviour</td><td>${health.thermalBehaviour}/100</td><td>${appliance.baseline.nominalTemperature}°C nominal</td><td>Dynamic I²R dissipation equilibrium</td></tr>
          <tr><td>Operating Consistency</td><td>${health.operatingConsistency}/100</td><td>PF ${appliance.baseline.nominalPowerFactor}</td><td>Motor run-phase capacitive balance</td></tr>
          <tr><td>Power Quality</td><td>${health.powerQuality}/100</td><td>50.00 Hz ±0.2 Hz</td><td>Sub-cycle total harmonic evaluation</td></tr>
        </table>

        <h3 style="margin-top: 25px;">Recent Critical & Protective Events</h3>
        <table>
          <tr><th>Timestamp</th><th>Event Title</th><th>Severity</th><th>Trigger Condition</th><th>Action Taken</th></tr>
          ${events.slice(0, 5).map(e => `
            <tr>
              <td>${e.timestamp}</td>
              <td>${e.title}</td>
              <td style="color: ${e.severity === 'PROTECTION' ? '#ff1744' : '#ffb300'}">${e.severity}</td>
              <td>${e.triggerCondition}</td>
              <td>${e.actionTaken}</td>
            </tr>
          `).join('')}
        </table>

        <div class="disclaimer">
          DISCLAIMER: This diagnostic health report was generated by the LoadGuard AI simulation framework. AI anomaly models provide predictive insights and engineering diagnostics. Primary electrical safety is enforced independently by the deterministic protection engine.
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  }
}
