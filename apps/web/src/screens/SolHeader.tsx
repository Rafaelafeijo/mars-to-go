import { useTranslation } from 'react-i18next';
import { V, type MissionState } from '@mars-to-go/sim';
import { Badge } from '../cards/Badge';

/** Mission 1: "SOL 3" + "day 3 on Mars". Later missions: "SOL 3 of 7" (SIM_MODEL §12). */
export function SolHeader({ state }: { state: MissionState }) {
  const { t } = useTranslation();
  const first = state.missionId === 'm1';
  return (
    <div className="sol-header">
      <p className="sol-header__label">
        {first ? t('sol.label', { n: state.sol }) : t('sol.labelOf', { n: state.sol, total: V.MISSION_SOLS })}
      </p>
      {first && <p className="sol-header__caption">{t('sol.caption', { n: state.sol })}</p>}
      <Badge cardId="sol" />
    </div>
  );
}
