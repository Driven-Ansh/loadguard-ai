import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { 
  Zap, 
  IndianRupee, 
  TrendingUp, 
  DollarSign, 
  Sliders, 
  AlertCircle, 
  Calendar, 
  CheckCircle,
  BarChart3
} from 'lucide-react';

export const EnergyIntelligenceView: React.FC = () => {
  const {
    activeAppliance,
    energyMetrics,
    setElectricityTariff
  } = useSimulation();

  const [tariffInput, setTariffInput] = useState<number>(energyMetrics.tariffPerKwh);

  const handleTariffChange = (val: number) => {
    setTariffInput(val);
    setElectricityTariff(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              ENERGY INTELLIGENCE & ABNORMAL WASTE ESTIMATOR
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              EMPIRICAL BASELINE METRICS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Energy Consumption & Anomaly Cost Modeling
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Expected Baseline vs Actual Kilowatt-Hours • Configurable Commercial Tariffs • Cumulative Anomaly Waste
          </p>
        </div>

        {/* Currency Tariff Quick Config */}
        <div className="flex items-center gap-2 bg-industrial-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">TARIFF:</span>
          <span className="text-emerald-400 font-bold">₹</span>
          <input
            type="number"
            step="0.25"
            min="1"
            max="30"
            value={tariffInput}
            onChange={(e) => handleTariffChange(parseFloat(e.target.value) || 1)}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
          />
          <span className="text-slate-400">/ kWh</span>
        </div>
      </div>

      {/* Primary Comparison Cards: TODAY and MONTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Consumption */}
        <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                TODAY'S OPERATING CONSUMPTION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                00:00 — NOW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">NORMAL EXPECTED</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {energyMetrics.expectedTodayKwh.toFixed(2)} <span className="text-xs text-slate-400 font-normal">kWh</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  7-Day baseline model
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">ACTUAL CONSUMED</div>
                <div className="text-2xl font-bold font-mono text-electric-cyan">
                  {energyMetrics.actualTodayKwh.toFixed(2)} <span className="text-xs text-slate-400 font-normal">kWh</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1">
                  Measured by metering IC
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-amber-300 font-bold uppercase tracking-wide">
                  ESTIMATED ABNORMAL CONSUMPTION
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  +{energyMetrics.estimatedExcessKwh.toFixed(2)} kWh
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mt-2 pt-2 border-t border-amber-500/20">
                <span>Estimated Additional Cost Impact:</span>
                <span className="text-white font-bold text-sm">
                  ₹ {energyMetrics.estimatedAdditionalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 mt-4">
            * Labeled strictly as estimated abnormal consumption. Not a guaranteed savings claim.
          </div>
        </div>

        {/* Projected Monthly Consumption */}
        <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                PROJECTED MONTHLY IMPACT (30 DAYS)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                FORECAST
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">EXPECTED MONTHLY</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {energyMetrics.expectedMonthKwh.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kWh</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  Est: ₹ {(energyMetrics.expectedMonthKwh * energyMetrics.tariffPerKwh).toFixed(0)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-industrial-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">ACTUAL / PROJECTED</div>
                <div className="text-2xl font-bold font-mono text-purple-400">
                  {energyMetrics.actualMonthKwh.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kWh</span>
                </div>
                <div className="text-[10px] font-mono text-purple-300 mt-1">
                  Est: ₹ {(energyMetrics.actualMonthKwh * energyMetrics.tariffPerKwh).toFixed(0)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-purple-300 font-bold uppercase tracking-wide">
                  PROJECTED MONTHLY ABNORMAL EXCESS
                </span>
                <span className="text-purple-400 font-bold text-sm">
                  +{energyMetrics.excessMonthKwh.toFixed(1)} kWh
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mt-2 pt-2 border-t border-purple-500/20">
                <span>Estimated Monthly Cost Penalty:</span>
                <span className="text-white font-bold text-sm">
                  ₹ {energyMetrics.costImpactMonth.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 mt-4">
            * Direct financial ROI justification for addressing mechanical friction or filter clogging.
          </div>
        </div>
      </div>

      {/* Baseline vs Actual Energy Trend Chart */}
      <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              ENERGY PROFILE DIVERGENCE (BASELINE VS ACTUAL)
            </div>
            <div className="text-base font-bold text-white">
              Hourly Cumulative Energy Consumption (24 Hours)
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-500"></span> Expected Baseline
            </span>
            <span className="flex items-center gap-1.5 text-electric-cyan font-bold">
              <span className="w-3 h-0.5 bg-cyan-400"></span> Measured Actual
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded bg-amber-500/30 border border-amber-500"></span> Estimated Abnormal
            </span>
          </div>
        </div>

        {/* 24-Hour Bar Chart Visualization */}
        <div className="h-52 w-full bg-industrial-950 rounded-xl border border-slate-800 p-4 flex items-end gap-2 sm:gap-3">
          {[
            { hour: '00', base: 0.3, act: 0.3 },
            { hour: '02', base: 0.2, act: 0.2 },
            { hour: '04', base: 0.2, act: 0.2 },
            { hour: '06', base: 0.4, act: 0.45 },
            { hour: '08', base: 0.8, act: 0.9 },
            { hour: '10', base: 1.1, act: 1.25 },
            { hour: '12', base: 1.2, act: 1.4 },
            { hour: '14', base: 1.2, act: 1.45 },
            { hour: '16', base: 1.0, act: 1.2 },
            { hour: '18', base: 0.9, act: 1.1 },
            { hour: '20', base: 0.8, act: 0.95 },
            { hour: '22', base: 0.5, act: 0.6 }
          ].map((bar, i) => {
            const excess = Math.max(0, bar.act - bar.base);
            const baseHeight = (bar.base / 1.6) * 100;
            const actHeight = (bar.act / 1.6) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  {/* Baseline bar */}
                  <div
                    className="w-1/2 bg-slate-700/80 rounded-t"
                    style={{ height: `${baseHeight}%` }}
                    title={`Hour ${bar.hour}:00 - Baseline: ${bar.base} kWh`}
                  />
                  {/* Actual bar with excess highlight */}
                  <div
                    className="w-1/2 bg-cyan-500 rounded-t relative overflow-hidden"
                    style={{ height: `${actHeight}%` }}
                    title={`Hour ${bar.hour}:00 - Actual: ${bar.act} kWh`}
                  >
                    {excess > 0 && (
                      <div 
                        className="w-full bg-amber-400 absolute top-0"
                        style={{ height: `${(excess / bar.act) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {bar.hour}h
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>* Chart displays 24-hour diurnal cycling with highlighted abnormal excess bands.</span>
          <span>Configured Tariff: ₹ {energyMetrics.tariffPerKwh.toFixed(2)}/kWh</span>
        </div>
      </div>
    </div>
  );
};
