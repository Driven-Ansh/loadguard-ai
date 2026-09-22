import React, { useEffect, useRef } from 'react';
import { useSimulation } from '../../state/SimulationContext';

interface WaveformCanvasProps {
  showVoltage?: boolean;
  showCurrent?: boolean;
  showPower?: boolean;
  height?: number;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  showVoltage = true,
  showCurrent = true,
  showPower = true,
  height = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { telemetry, isPlaying, speedMultiplier } = useSimulation();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.05 * speedMultiplier;
      }

      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Clear with dark grid
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, w, h);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = '#121d36';
      ctx.lineWidth = 1;

      // Vertical divisions
      const numDivsX = 12;
      for (let i = 0; i <= numDivsX; i++) {
        const x = (w / numDivsX) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal divisions
      const numDivsY = 6;
      for (let j = 0; j <= numDivsY; j++) {
        const y = (h / numDivsY) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = '#1e315b';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      const time = timeRef.current;
      const omega = 2 * Math.PI * 0.025; // Visual frequency
      const phaseAngle = Math.acos(Math.max(-1, Math.min(1, telemetry.powerFactor)));

      // 1. Voltage Waveform (Sine wave scaled)
      if (showVoltage) {
        ctx.strokeStyle = '#00a8ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const vScale = (telemetry.voltage / 230) * (h * 0.38);

        for (let x = 0; x < w; x++) {
          const t = time + (x / w) * 8;
          const y = midY - Math.sin(t * omega) * vScale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 2. Current Waveform (with phase lag & amplitude scaling)
      if (showCurrent && telemetry.current > 0) {
        const isCurrentAbnormal = telemetry.current > 6.0;
        ctx.strokeStyle = isCurrentAbnormal ? '#ffb300' : '#00e676';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const iNorm = Math.min(1.0, telemetry.current / 8.0);
        const iScale = iNorm * (h * 0.35);

        // Add 3rd harmonic distortion if in startup or abnormal
        const isHarmonic = telemetry.operatingState === 'STARTUP' || isCurrentAbnormal;

        for (let x = 0; x < w; x++) {
          const t = time + (x / w) * 8;
          let currentWave = Math.sin(t * omega - phaseAngle);
          if (isHarmonic) {
            currentWave += 0.15 * Math.sin(3 * (t * omega - phaseAngle));
          }
          const y = midY - currentWave * iScale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 3. Instantaneous Power Waveform p(t) = v(t) * i(t)
      if (showPower && telemetry.realPower > 0) {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        const pNorm = Math.min(1.0, telemetry.realPower / 2500);
        const pScale = pNorm * (h * 0.28);

        for (let x = 0; x < w; x++) {
          const t = time + (x / w) * 8;
          const v = Math.sin(t * omega);
          const i = Math.sin(t * omega - phaseAngle);
          const instP = v * i; // Doubled frequency pulsating power
          const y = midY - instP * pScale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [telemetry, isPlaying, speedMultiplier, showVoltage, showCurrent, showPower]);

  return (
    <div className="w-full flex flex-col bg-industrial-950 rounded-lg border border-slate-800 p-2.5 overflow-hidden">
      <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-800 text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          REAL-TIME TELEMETRY OSCILLOSCOPE (6.4 kS/s)
        </span>
        <div className="flex items-center gap-3">
          {showVoltage && (
            <span className="text-[#00a8ff] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#00a8ff]"></span> V(t): {telemetry.voltage.toFixed(1)}V
            </span>
          )}
          {showCurrent && (
            <span className="text-[#00e676] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#00e676]"></span> I(t): {telemetry.current.toFixed(2)}A
            </span>
          )}
          {showPower && (
            <span className="text-[#c084fc] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#c084fc]"></span> P(t): {telemetry.realPower}W
            </span>
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={height}
        className="w-full h-auto rounded bg-industrial-950"
      />
    </div>
  );
};
