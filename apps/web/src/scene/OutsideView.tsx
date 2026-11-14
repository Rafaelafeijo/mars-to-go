/**
 * Outside view (ADR-0030): the real Jezero panorama (PIA24921, cropped, never altered
 * by AI), dragged sideways. Illustrated base props sit on the real ground; a badge
 * says what is photo and what is illustration. Night and dust are color filters only.
 */
import { useEffect, useRef, type PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../cards/Badge';
import { prefersReducedMotion } from '../lib/format';

const BASE = import.meta.env.BASE_URL;

interface Props {
  night: boolean;
  dust: boolean;
  shieldCells: number;
}

/** Illustrated props, positioned in % of the strip. */
function Props({ shieldCells }: { shieldCells: number }) {
  const { t } = useTranslation();
  return (
    <>
      <svg className="prop" style={{ left: '30%', bottom: '14%', width: '15%' }} viewBox="0 0 160 70" role="img" aria-label={t('scene.props.panels')}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 52} 0)`}>
            <path d="M4 30 L44 22 L48 44 L8 52 Z" fill="#1d3550" stroke="#9fc3ff" strokeWidth="1.5" />
            <path d="M14 28 L18 50 M24 26 L28 48 M34 24 L38 46" stroke="#9fc3ff" strokeWidth="0.8" />
            <path d="M26 48 L26 66" stroke="#c4b5a8" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <svg className="prop" style={{ left: '47%', bottom: '12%', width: '16%' }} viewBox="0 0 160 90" role="img" aria-label={t('scene.props.dome')}>
        <path d="M6 84 Q6 10 80 8 Q154 10 154 84 Z" fill="#e9e1d8" stroke="#5a4a40" strokeWidth="2" />
        <path d="M6 84 Q6 10 80 8 Q154 10 154 84" fill="none" stroke="#c9b26a" strokeWidth={3 + shieldCells * 4} strokeOpacity={shieldCells ? 0.95 : 0.3} />
        <rect x="64" y="56" width="32" height="28" rx="4" fill="#5a4a40" />
        <circle cx="40" cy="50" r="7" fill="#9fd3e8" />
        <circle cx="120" cy="50" r="7" fill="#9fd3e8" />
      </svg>
      <svg className="prop" style={{ left: '64%', bottom: '18%', width: '6%' }} viewBox="0 0 60 100" role="img" aria-label={t('scene.props.antenna')}>
        <path d="M30 40 L30 98 M20 98 L40 98" stroke="#c4b5a8" strokeWidth="3" />
        <path d="M6 30 Q30 60 54 30 Z" fill="#e9e1d8" stroke="#5a4a40" strokeWidth="2" />
        <path d="M30 42 L30 22" stroke="#5a4a40" strokeWidth="2" />
      </svg>
      <svg className="prop" style={{ left: '72%', bottom: '9%', width: '9%' }} viewBox="0 0 120 70" role="img" aria-label={t('scene.props.rover')}>
        <rect x="18" y="16" width="80" height="24" rx="4" fill="#e9e1d8" stroke="#5a4a40" strokeWidth="2" />
        <path d="M84 16 L84 4 L96 4" stroke="#5a4a40" strokeWidth="3" fill="none" />
        {[24, 58, 92].map((x) => (
          <circle key={x} cx={x} cy="54" r="11" fill="#2a2420" stroke="#5a4a40" strokeWidth="2" />
        ))}
      </svg>
    </>
  );
}

export function OutsideView({ night, dust, shieldCells }: Props) {
  const { t } = useTranslation();
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  // Start looking at the base, not at the edge of the photo.
  useEffect(() => {
    const el = strip.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) * 0.42;
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !strip.current) return; // touch scrolls natively
    drag.current = { x: e.clientX, left: strip.current.scrollLeft };
    strip.current.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !strip.current) return;
    strip.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div className={`outside${night ? ' outside--night' : ''}${dust ? ' outside--dust' : ''}`}>
      <div
        ref={strip}
        className="outside__strip"
        // A scrollable region must be focusable so keyboard users can pan it (WCAG 2.1.1).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label={t('scene.drag')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ scrollBehavior: prefersReducedMotion() ? 'auto' : 'smooth' }}
      >
        <div className="outside__world">
          <img
            src={`${BASE}images/jezero-wide-h840.webp`}
            srcSet={`${BASE}images/jezero-wide-h480.webp 1564w, ${BASE}images/jezero-wide-h840.webp 2737w`}
            sizes="200vh"
            alt=""
            draggable={false}
          />
          <div className="outside__veil" aria-hidden="true" />
          <Props shieldCells={shieldCells} />
          <span className="marker" style={{ left: '14%', top: '10%' }}>
            {t('scene.markers.delta')} <Badge cardId="photo-jezero-panorama" />
          </span>
          <span className="signpost" style={{ right: '3%', bottom: '30%' }}>
            {t('scene.markers.kodiak')}
          </span>
          <span className="signpost" style={{ left: '2%', bottom: '30%' }}>
            {t('scene.markers.rochette')}
          </span>
        </div>
      </div>
      <p className="outside__badge">
        {t('scene.outsideBadge')} <Badge cardId="photo-jezero-panorama" />
      </p>
      <p className="outside__hint" aria-hidden="true">
        ⇆ {t('scene.drag')}
      </p>
    </div>
  );
}
