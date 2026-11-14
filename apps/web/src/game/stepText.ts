import type { TFunction } from 'i18next';
import type { NightStep } from '@mars-to-go/sim';
import { cardForScience } from '@mars-to-go/content';

/** Words for one line of the live math. All text lives in packages/content (rule 7). */
export function stepText(t: TFunction, step: NightStep): string {
  const d = step.detail ?? {};
  const v = { ...d, count: typeof d.cells === 'number' ? d.cells : 0, before: step.before, delta: step.delta, after: step.after, abs: Math.abs(step.delta) };
  switch (step.id) {
    case 'harvest':
      return step.delta === 0 ? t('steps.harvestNone') : t('steps.harvest', v);
    case 'plant':
      if (!d.cells) return t('steps.plantNone');
      return d.paysInMission ? t('steps.plant', v) : t('steps.plantLate', v);
    case 'radiation':
      if (!d.eventId) return t('steps.radiationNone', v);
      return d.reachesMars === true ? t('steps.radiationHit', v) : t('steps.radiationMiss', v);
    case 'earthAnswer': {
      if (d.aboutSol === null) return t('steps.earthAnswerUseless');
      const answer = d.eventId === null ? t('steps.earthCalm') : d.reachesMars === true ? t('steps.earthYes') : t('steps.earthNo');
      return `${t('steps.earthAnswer', { aboutSol: d.aboutSol, answer })} ${t('steps.earthTravel', { min: d.minMinutes, max: d.maxMinutes })}`;
    }
    default:
      return t(`steps.${step.id}`, v);
  }
}

/** The card that explains a step (first science id with a complete card). */
export function stepCardId(step: NightStep, eventCardId?: string): string | undefined {
  if (step.id === 'radiation' && eventCardId) return eventCardId;
  for (const id of step.scienceIds) {
    const card = cardForScience(id as Parameters<typeof cardForScience>[0]);
    if (card) return card.id;
  }
  return undefined;
}
