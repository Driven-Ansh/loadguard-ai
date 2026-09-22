import React, { useState } from 'react';
import { useSimulation } from '../../state/SimulationContext';
import { TimelineEvent, AlertSeverity } from '../../types';
import { ExportUtils } from '../../services/exportUtils';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  FileCode, 
  Printer, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  X,
  ExternalLink
} from 'lucide-react';

export const EventTimelineView: React.FC = () => {
  const {
    events,
    activeAppliance,
    health,
    energyMetrics,
    telemetryHistory
  } = useSimulation();

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((e) => {
    const matchesSev = filterSeverity === 'ALL' || e.severity === filterSeverity;
    const matchesQuery = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.triggerCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.applianceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-electric-cyan tracking-widest uppercase">
              SAFETY EVENT TIMELINE & AUDIT LOG
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Chronological Anomaly & Protection Event Log
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Sequential State Progression • Pre-Fault Telemetry Snapshots • Hardware Switching Records
          </p>
        </div>

        {/* Data Export Action Buttons (Requirement 39) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => ExportUtils.downloadCSV(telemetryHistory, activeAppliance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-950 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition"
            title="Download CSV of Raw Telemetry History"
          >
            <Download size={13} /> CSV Telemetry
          </button>
          <button
            onClick={() => ExportUtils.downloadJSONAudit(events, activeAppliance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-950 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition"
            title="Download Cryptographic JSON Audit Log"
          >
            <FileCode size={13} /> JSON Audit
          </button>
          <button
            onClick={() => ExportUtils.generatePrintableReport(activeAppliance, health, energyMetrics, events)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-electric-cyan border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-mono font-bold transition shadow-glow-cyan"
            title="Print Executive Diagnostic Report"
          >
            <Printer size={13} /> Print Report
          </button>
        </div>
      </div>

      {/* Visual Chronological Timeline (Requirement 20) */}
      <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              CHRONOLOGICAL EVENT PROGRESSION
            </div>
            <div className="text-base font-bold text-white">
              Appliance State Progression & Diagnostic Chain
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any milestone to open full snapshot
          </span>
        </div>

        {/* Horizontal / Step Timeline Bar */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6 my-4">
          {events.map((evt, idx) => {
            const isProt = evt.severity === 'PROTECTION';
            const isCrit = evt.severity === 'CRITICAL';
            const isAbnorm = evt.severity === 'ABNORMAL';
            const isWarn = evt.severity === 'WARNING';

            const dotColor = isProt 
              ? 'bg-red-500 text-white shadow-glow-red' 
              : isCrit 
              ? 'bg-red-500 text-white' 
              : isAbnorm || isWarn 
              ? 'bg-amber-400 text-industrial-950 shadow-glow-amber' 
              : 'bg-emerald-400 text-industrial-950';

            return (
              <div 
                key={evt.id} 
                onClick={() => setSelectedEvent(evt)}
                className="relative group cursor-pointer"
              >
                {/* Timeline node icon */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] transition-transform group-hover:scale-125 ${dotColor}`}>
                  {isProt ? '⚡' : isCrit ? '!' : isAbnorm ? '⚠' : '✓'}
                </div>

                <div className="p-4 rounded-xl bg-industrial-950 border border-slate-800 group-hover:border-cyan-500/60 transition shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {evt.title}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isProt ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        isCrit ? 'bg-red-500/20 text-red-400' :
                        isAbnorm ? 'bg-amber-500/20 text-amber-300' :
                        isWarn ? 'bg-amber-500/20 text-amber-300' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {evt.severity}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-slate-400">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Trigger: <span className="text-slate-400">{evt.triggerCondition}</span>
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>I: <b className="text-white">{evt.current.toFixed(2)}A</b></span>
                      <span>P: <b className="text-white">{evt.power}W</b></span>
                      <span>T: <b className="text-white">{evt.temperature.toFixed(1)}°C</b></span>
                    </div>

                    <span className="text-cyan-400 text-[10px] group-hover:underline flex items-center gap-1">
                      Inspect Snapshot <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filterable & Searchable Event History Table (Requirement 23) */}
      <div className="p-6 rounded-2xl bg-industrial-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              SYSTEM EVENT HISTORY ARCHIVE
            </div>
            <div className="text-base font-bold text-white">
              Searchable Audit Database ({filteredEvents.length} records)
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search event, trigger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-industrial-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
              />
            </div>

            {/* Severity Filter Dropdown */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-400 text-[10px]">SEVERITY:</span>
              {(['ALL', 'PROTECTION', 'CRITICAL', 'ABNORMAL', 'WARNING', 'INFO'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-1 rounded text-[10px] transition ${
                    filterSeverity === sev 
                      ? 'bg-cyan-500/25 text-electric-cyan font-bold border border-cyan-500/40' 
                      : 'bg-industrial-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-industrial-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Appliance</th>
                <th className="py-2.5 px-3">Event Title</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Current</th>
                <th className="py-2.5 px-3">Power</th>
                <th className="py-2.5 px-3">Temp</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvents.map((evt) => (
                <tr 
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 text-slate-400">{evt.timestamp}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{evt.applianceName}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{evt.title}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.severity === 'PROTECTION' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      evt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      evt.severity === 'ABNORMAL' ? 'bg-amber-500/20 text-amber-300' :
                      evt.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{evt.current.toFixed(2)} A</td>
                  <td className="py-2.5 px-3 text-slate-300">{evt.power} W</td>
                  <td className="py-2.5 px-3 text-slate-300">{evt.temperature.toFixed(1)} °C</td>
                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{evt.actionTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Inspection Modal (Requirement 20) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-industrial-900 border-2 border-cyan-500/60 rounded-2xl shadow-glow-cyan p-6 select-none font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{selectedEvent.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedEvent.severity === 'PROTECTION' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {selectedEvent.severity}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded bg-industrial-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">TIMESTAMP</div>
                  <div className="text-white font-bold">{selectedEvent.timestamp}</div>
                </div>
                <div className="p-2.5 rounded bg-industrial-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">CURRENT</div>
                  <div className="text-white font-bold">{selectedEvent.current.toFixed(2)} A</div>
                </div>
                <div className="p-2.5 rounded bg-industrial-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">POWER</div>
                  <div className="text-white font-bold">{selectedEvent.power} W</div>
                </div>
                <div className="p-2.5 rounded bg-industrial-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">TEMPERATURE</div>
                  <div className="text-white font-bold">{selectedEvent.temperature.toFixed(1)} °C</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-industrial-950 border border-slate-800">
                <div className="text-[10px] text-amber-400 uppercase mb-0.5">TRIGGER CONDITION</div>
                <div className="text-slate-200">{selectedEvent.triggerCondition}</div>
              </div>

              <div className="p-3 rounded-lg bg-industrial-950 border border-slate-800">
                <div className="text-[10px] text-cyan-400 uppercase mb-0.5">DECISION RULE ENGINE</div>
                <div className="text-slate-200">{selectedEvent.decisionRule}</div>
              </div>

              <div className="p-3 rounded-lg bg-industrial-950 border border-slate-800">
                <div className="text-[10px] text-emerald-400 uppercase mb-0.5">ACTION TAKEN BY HARDWARE</div>
                <div className="text-slate-200">{selectedEvent.actionTaken}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
