/**
 * Game flow for the web app. Every number comes from packages/sim (ADR-0009);
 * this hook only keeps track of which screen is shown and what was chosen.
 */
import { useCallback, useState } from 'react';
import {
  newMission,
  predictionOptions,
  resolveNight,
  type Allocation,
  type MissionDef,
  type MissionState,
  type NightResult,
  type Outcome,
} from '@mars-to-go/sim';
import { MISSION_1 } from '@mars-to-go/content';

export type Screen = 'home' | 'briefing' | 'morning' | 'night' | 'log' | 'end';
export type QuestionType = 'greenhouse' | 'shield' | 'air';

/** Index of the right answer in each question's options (content/locales). */
export const QUESTION_ANSWER: Record<QuestionType, number> = { greenhouse: 1, shield: 2, air: 1 };

export function questionFor(def: MissionDef, sol: number): QuestionType {
  if (def.sols[sol - 1]?.event) return 'shield';
  return sol % 2 === 1 ? 'greenhouse' : 'air';
}

export interface Morning {
  question: QuestionType;
  answer: number | null;
}

export interface Night {
  before: MissionState;
  allocation: Allocation;
  result: NightResult;
  pick: { options: Outcome[]; correctIndex: number; picked: number | null };
}

export interface Game {
  screen: Screen;
  def: MissionDef;
  state: MissionState;
  /** State at the start of each sol: "go back to the sol where everything changed". */
  checkpoints: MissionState[];
  morning: Morning;
  night: Night | null;
  assisted: boolean;
}

function freshGame(def: MissionDef, assisted: boolean): Game {
  const state = newMission(def);
  return {
    screen: 'home',
    def,
    state: { ...state, assistedUsed: assisted },
    checkpoints: [state],
    morning: { question: questionFor(def, 1), answer: null },
    night: null,
    assisted,
  };
}

export function useGame() {
  const [game, setGame] = useState<Game>(() => freshGame(MISSION_1, false));

  const go = useCallback((screen: Screen) => setGame((g) => ({ ...g, screen })), []);

  const setAssisted = useCallback(
    (assisted: boolean) => setGame((g) => ({ ...g, assisted, state: { ...g.state, assistedUsed: g.state.assistedUsed || assisted } })),
    [],
  );

  const startMission = useCallback((def: MissionDef = MISSION_1) => {
    setGame((g) => ({ ...freshGame(def, g.assisted), screen: 'briefing' }));
  }, []);

  const answerQuestion = useCallback((answer: number | null) => {
    setGame((g) => ({ ...g, morning: { ...g.morning, answer } }));
  }, []);

  const lockPlan = useCallback((allocation: Allocation) => {
    setGame((g) => {
      const result = resolveNight(g.def, g.state, { allocation });
      const { options, correctIndex } = predictionOptions(g.def, g.state, allocation);
      return { ...g, screen: 'night', night: { before: g.state, allocation, result, pick: { options, correctIndex, picked: null } } };
    });
  }, []);

  const pickResult = useCallback((picked: number) => {
    setGame((g) => (g.night ? { ...g, night: { ...g.night, pick: { ...g.night.pick, picked } } } : g));
  }, []);

  /** Commits the night: the state from the simulation, plus the optional guess in the log. */
  const endNight = useCallback(() => {
    setGame((g) => {
      if (!g.night) return g;
      const { pick, result } = g.night;
      const log = [...result.state.log];
      const last = log.at(-1);
      if (last && pick.picked !== null) log[log.length - 1] = { ...last, prediction: { picked: pick.picked, correct: pick.picked === pick.correctIndex } };
      return { ...g, state: { ...result.state, log, assistedUsed: result.state.assistedUsed || g.assisted }, screen: 'log' };
    });
  }, []);

  const nextSol = useCallback(() => {
    setGame((g) => {
      if (g.state.status !== 'playing') return { ...g, screen: 'end' };
      return {
        ...g,
        screen: 'morning',
        checkpoints: [...g.checkpoints, g.state],
        morning: { question: questionFor(g.def, g.state.sol), answer: null },
        night: null,
      };
    });
  }, []);

  const goBackToSol = useCallback((sol: number) => {
    setGame((g) => {
      const cp = g.checkpoints.find((c) => c.sol === sol);
      if (!cp) return g;
      return {
        ...g,
        state: cp,
        checkpoints: g.checkpoints.filter((c) => c.sol <= sol),
        morning: { question: questionFor(g.def, sol), answer: null },
        night: null,
        screen: 'morning',
      };
    });
  }, []);

  return { game, go, setAssisted, startMission, answerQuestion, lockPlan, pickResult, endNight, nextSol, goBackToSol };
}
