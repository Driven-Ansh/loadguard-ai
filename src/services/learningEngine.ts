import { BaselineProfile, OperatingState } from '../types';

export class LearningEngine {
  public static getEnvelope(baseline: BaselineProfile, state: OperatingState) {
    const s = baseline.stateBaselines[state] || baseline.stateBaselines.NORMAL;
    return {
      current: {
        min: Number((s.current * 0.90).toFixed(2)),
        nominal: Number(s.current.toFixed(2)),
        max: Number((s.current * 1.10).toFixed(2))
      },
      power: {
        min: Math.round(s.power * 0.88),
        nominal: Math.round(s.power),
        max: Math.round(s.power * 1.12)
      },
      powerFactor: {
        min: Number(Math.max(0.2, s.powerFactor - 0.08).toFixed(2)),
        nominal: Number(s.powerFactor.toFixed(2)),
        max: Number(Math.min(1.0, s.powerFactor + 0.05).toFixed(2))
      },
      temperature: {
        min: Number((s.temperature - 3.0).toFixed(1)),
        nominal: Number(s.temperature.toFixed(1)),
        max: Number((s.temperature + 5.0).toFixed(1))
      }
    };
  }

  public static simulateLearningTick(
    currentBaseline: BaselineProfile,
    deltaDays: number
  ): BaselineProfile {
    const newDays = Math.min(currentBaseline.totalDaysTarget, currentBaseline.daysLearned + deltaDays);
    const progress = Math.min(100, Math.round((newDays / currentBaseline.totalDaysTarget) * 100));
    const isLearned = progress >= 100;
    const addedCycles = Math.round(deltaDays * 25);

    return {
      ...currentBaseline,
      daysLearned: Number(newDays.toFixed(1)),
      learningProgress: progress,
      isLearned,
      cyclesObserved: currentBaseline.cyclesObserved + addedCycles,
      dataQuality: Math.min(99, 90 + Math.round(progress * 0.09))
    };
  }
}
