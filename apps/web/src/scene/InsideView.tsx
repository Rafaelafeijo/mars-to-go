/**
 * Inside view (ADR-0030): the base in cutaway, drawn in SVG. Objects are buttons:
 * tap to give a cell, the "−" chip takes it back. Everything shown comes from the
 * simulation state passed in; this file only draws.
 */
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { V, unlockSol, type Destination, type MissionState } from '@mars-to-go/sim';

export type Mood = 'happy' | 'worried';

interface Props {
  state: MissionState;
  cells: Record<Destination, number>;
  free: number;
  open: Destination[];
  onAdd: (d: Destination) => void;
  onRemove: (d: Destination) => void;
  mood: Mood;
  night: boolean;
  /** Destination currently highlighted by the night animation. */
  active?: Destination | 'crew' | null;
  airShown: number;
  disabled?: boolean;
}

const C = {
  hull: '#3a2f29',
  hullLight: '#5a4a40',
  floor: '#2a221e',
  ground: '#7a4a32',
  cell: '#e8703a',
  cellOff: '#4a3c34',
  glass: '#9fd3e8',
  plant: '#7cc46b',
  water: '#6ab0de',
  text: '#f3ece6',
};

function Cells({ x, y, n, dir = 'row' }: { x: number; y: number; n: number; dir?: 'row' | 'col' }) {
  return (
    <g aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={dir === 'row' ? x + i * 9 : x} y={dir === 'row' ? y : y - i * 9} width="7" height="7" rx="1.5" fill={C.cell} />
      ))}
    </g>
  );
}

function Astronaut({ x, mood, i }: { x: number; mood: Mood; i: number }) {
  const suit = ['#f3ece6', '#ffd27a', '#9fd3a8', '#9fc3ff'][i % 4];
  return (
    <g transform={`translate(${x} 92)`} aria-hidden="true" className="crew-member">
      <rect x="-7" y="10" width="14" height="20" rx="5" fill={suit} />
      <circle cx="0" cy="4" r="8" fill={suit} />
      <circle cx="0" cy="4" r="5.5" fill="#24303a" />
      {mood === 'happy' ? (
        <path d="M-2.5 5.5 Q0 8 2.5 5.5" stroke={C.text} strokeWidth="1" fill="none" />
      ) : (
        <path d="M-2.5 7.5 Q0 5 2.5 7.5" stroke={C.text} strokeWidth="1" fill="none" />
      )}
      <circle cx="-2" cy="2.5" r="0.9" fill={C.text} />
      <circle cx="2" cy="2.5" r="0.9" fill={C.text} />
    </g>
  );
}

export function InsideView({ state, cells, free, open, onAdd, onRemove, mood, night, active, airShown, disabled }: Props) {
  const { t } = useTranslation();
  const used = cells.lifeSupport + cells.greenhouse + cells.shield + cells.expedition * V.EXPEDITION_CELLS + cells.askEarth * V.ASK_EARTH_CELLS;
  const batteryLeft = free - used;
  const tankFill = Math.max(0, Math.min(1, airShown / 20));
  const sprouts = state.pendingHarvests.map((h) => h.sol - state.sol); // 0 = ready tonight, 1 = tomorrow…

  const obj = (d: Destination) => {
    const name = t(`scene.objects.${d}`);
    const isOpen = open.includes(d);
    const label = isOpen ? t('scene.objectState', { name, count: d === 'expedition' ? cells[d] * 2 : cells[d] }) : t('scene.objectLocked', { name, n: unlockSol(d) });
    return {
      role: 'button',
      tabIndex: isOpen && !disabled ? 0 : -1,
      'aria-label': label,
      'aria-disabled': !isOpen || disabled,
      className: `obj${isOpen ? '' : ' obj--locked'}${active === d ? ' obj--active' : ''}`,
      onClick: () => isOpen && !disabled && onAdd(d),
      onKeyDown: (e: KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && isOpen && !disabled) {
          e.preventDefault();
          onAdd(d);
        }
      },
    };
  };

  const minus = (d: Destination, x: number, y: number) =>
    cells[d] > 0 && !disabled ? (
      <g
        role="button"
        tabIndex={0}
        aria-label={t('scene.removeCell', { name: t(`scene.objects.${d}`) })}
        className="obj-minus"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(d);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRemove(d);
          }
        }}
      >
        <circle cx={x} cy={y} r="11" fill="#14100e" stroke={C.cell} strokeWidth="2" />
        <text x={x} y={y + 4} textAnchor="middle" fontSize="14" fill={C.cell} fontWeight="700">
          −
        </text>
      </g>
    ) : null;

  const lock = (d: Destination, x: number, y: number) =>
    open.includes(d) ? null : (
      <text x={x} y={y} textAnchor="middle" fontSize="10" fill={C.text} aria-hidden="true">
        🔒 {unlockSol(d)}
      </text>
    );

  return (
    <svg viewBox="0 0 400 290" className={`inside${night ? ' inside--night' : ''}`} role="group" aria-label={t('scene.views.inside')}>
      {/* ground and hull */}
      <rect x="0" y="250" width="400" height="40" fill={C.ground} />
      <path d="M12 250 Q12 40 200 34 Q388 40 388 250 Z" fill={C.floor} stroke={C.hullLight} strokeWidth="3" />

      {/* Shield cover: thicker with more cells */}
      <g {...obj('shield')}>
        <path d="M12 250 Q12 40 200 34 Q388 40 388 250" fill="none" stroke="#c9b26a" strokeWidth={4 + cells.shield * 5} strokeOpacity={cells.shield ? 0.9 : 0.25} strokeDasharray={cells.shield ? undefined : '6 6'} />
        <rect x="150" y="18" width="100" height="32" fill="transparent" />
        <text x="200" y="64" textAnchor="middle" fontSize="11" fill={C.text}>
          {t('scene.objects.shield')}
        </text>
        <Cells x={200 - cells.shield * 4.5} y={70} n={cells.shield} />
        {lock('shield', 200, 82)}
      </g>
      {minus('shield', 262, 60)}

      {/* Battery with 10 cells: 3 locked to the heater */}
      <g aria-label={t('scene.objects.battery')} role="img">
        <rect x="30" y="96" width="44" height="136" rx="6" fill="#1f1916" stroke={C.hullLight} strokeWidth="2" />
        <rect x="44" y="90" width="16" height="8" rx="2" fill={C.hullLight} />
        {Array.from({ length: V.CELLS_PER_SOL }, (_, i) => {
          const heating = i < V.HEATING_CELLS;
          const fromTop = V.CELLS_PER_SOL - 1 - i;
          const available = !heating && i - V.HEATING_CELLS < batteryLeft;
          return (
            <rect key={i} x="36" y={102 + fromTop * 12.6} width="32" height="9.5" rx="2" fill={heating ? '#b5502a' : available ? C.cell : C.cellOff} />
          );
        })}
        <text x="52" y="248" textAnchor="middle" fontSize="10" fill={C.text}>
          🔥 {t('scene.objects.heater')}
        </text>
      </g>

      {/* Air machine and tank */}
      <g {...obj('lifeSupport')}>
        <rect x="92" y="150" width="56" height="82" rx="6" fill="#2f3a40" stroke="#6a8a96" strokeWidth="2" />
        <circle cx="120" cy="172" r="13" fill="#1d262b" stroke="#6a8a96" strokeWidth="2" />
        <path d="M120 162 L124 172 L120 182 L116 172 Z" fill="#9fd3e8" className="fan" />
        <rect x="104" y="192" width="32" height="34" rx="4" fill="#1d262b" />
        <rect x="104" y={192 + 34 * (1 - tankFill)} width="32" height={34 * tankFill} rx="4" fill={C.water} opacity="0.85" />
        <text x="120" y="144" textAnchor="middle" fontSize="11" fill={C.text}>
          {t('scene.objects.lifeSupport')}
        </text>
        <Cells x={94} y={236} n={cells.lifeSupport} />
      </g>
      {minus('lifeSupport', 152, 150)}

      {/* Greenhouse with sprouts that grow over two sols */}
      <g {...obj('greenhouse')}>
        <rect x="166" y="150" width="84" height="82" rx="6" fill="#1d2a22" stroke={C.glass} strokeWidth="2" strokeOpacity="0.7" />
        {[0, 1, 2].map((p) => {
          const left = sprouts[p];
          const h = left === undefined ? 0 : left <= 0 ? 34 : left === 1 ? 22 : 10;
          const x = 182 + p * 26;
          return (
            <g key={p} aria-hidden="true">
              <rect x={x - 9} y="214" width="18" height="14" rx="3" fill="#6b4a36" />
              {h > 0 && <path d={`M${x} 214 L${x} ${214 - h}`} stroke={C.plant} strokeWidth="3" />}
              {h > 0 && <ellipse cx={x - 5} cy={214 - h + 4} rx="6" ry="3.5" fill={C.plant} />}
              {h > 0 && <ellipse cx={x + 5} cy={214 - h + 8} rx="6" ry="3.5" fill={C.plant} />}
            </g>
          );
        })}
        <text x="208" y="144" textAnchor="middle" fontSize="11" fill={C.text}>
          {t('scene.objects.greenhouse')}
        </text>
        <Cells x={170} y={236} n={cells.greenhouse} />
        {lock('greenhouse', 208, 190)}
      </g>
      {minus('greenhouse', 254, 150)}

      {/* Radio to Earth */}
      <g {...obj('askEarth')}>
        <rect x="268" y="176" width="52" height="56" rx="6" fill="#2b2833" stroke="#8a86a8" strokeWidth="2" />
        <rect x="276" y="184" width="36" height="20" rx="2" fill="#14100e" />
        <path d="M282 196 Q294 186 306 196" stroke="#9fc3ff" strokeWidth="2" fill="none" />
        <path d="M294 160 L294 176 M284 150 Q294 140 304 150" stroke="#8a86a8" strokeWidth="2" fill="none" />
        <text x="294" y="136" textAnchor="middle" fontSize="11" fill={C.text}>
          {t('scene.objects.askEarth')}
        </text>
        <Cells x={286} y={236} n={cells.askEarth} />
        {lock('askEarth', 294, 222)}
      </g>
      {minus('askEarth', 324, 176)}

      {/* Airlock for the expedition */}
      <g {...obj('expedition')}>
        <rect x="334" y="150" width="42" height="82" rx="8" fill="#2a2420" stroke={C.cell} strokeWidth="2" strokeOpacity="0.8" />
        <circle cx="355" cy="176" r="10" fill="#14100e" stroke={C.cell} strokeWidth="2" />
        <rect x="350" y="196" width="10" height="24" rx="2" fill={C.cell} opacity="0.6" />
        <text x="355" y="144" textAnchor="middle" fontSize="11" fill={C.text}>
          {t('scene.objects.expedition')}
        </text>
        <Cells x={346} y={236} n={cells.expedition * V.EXPEDITION_CELLS} />
        {lock('expedition', 355, 222)}
      </g>
      {minus('expedition', 378, 150)}

      {/* Crew of four */}
      <g role="img" aria-label={t(`scene.crew.${mood}`)} className={active === 'crew' ? 'obj--active' : undefined}>
        {[120, 156, 244, 280].map((x, i) => (
          <Astronaut key={i} x={x} mood={mood} i={i} />
        ))}
      </g>
    </svg>
  );
}
