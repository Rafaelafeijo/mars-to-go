/**
 * The game's own icon set (no emoji anywhere). One stroke style, 24×24, currentColor.
 * Resource colors come from CSS: air blue, food green, energy amber, radiation lilac.
 */
import type { ReactElement } from 'react';

export type IconName =
  | 'air'
  | 'food'
  | 'energy'
  | 'radiation'
  | 'shield'
  | 'rover'
  | 'antenna'
  | 'greenhouse'
  | 'airMachine'
  | 'rocket'
  | 'sun'
  | 'storm'
  | 'dust'
  | 'check'
  | 'cross'
  | 'lock'
  | 'plus'
  | 'minus'
  | 'moon'
  | 'flag'
  | 'heat'
  | 'walk';

const PATHS: Record<IconName, ReactElement> = {
  air: (
    <>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h7" />
    </>
  ),
  food: (
    <>
      <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" />
      <path d="M5 19l8-8" />
    </>
  ),
  energy: <path d="M13 2L5 14h6l-1 8 8-12h-6z" />,
  radiation: (
    <>
      <circle cx="12" cy="12" r="1.8" />
      <path d="M12 10V4a8 8 0 0 1 6.9 4l-5.2 3" />
      <path d="M10.3 13l-5.2 3A8 8 0 0 1 4 12h6" />
      <path d="M13.7 13l3 5.2A8 8 0 0 1 7 18.2l3-5.2" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  rover: (
    <>
      <rect x="4" y="8" width="14" height="6" rx="1" />
      <path d="M16 8V5h3" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="12" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
    </>
  ),
  antenna: (
    <>
      <path d="M4 10a8 8 0 0 0 10 0L9 5z" />
      <path d="M9 12v9M6 21h6" />
      <path d="M16 4a5 5 0 0 1 3 4M17 1a8 8 0 0 1 5 6" />
    </>
  ),
  greenhouse: (
    <>
      <path d="M3 20V11a9 9 0 0 1 18 0v9z" />
      <path d="M12 20v-6M12 14c-2 0-3-1-3-3 2 0 3 1 3 3zM12 15c2 0 3-1 3-3-2 0-3 1-3 3z" />
    </>
  ),
  airMachine: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 7v10M7 12h10" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2c4 3 5 7 5 11l-2 4H9l-2-4c0-4 1-8 5-11z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M9 17l-2 4M15 17l2 4M12 17v4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  storm: (
    <>
      <circle cx="10" cy="10" r="4" />
      <path d="M10 2v2M2 10h2M4.5 4.5l1.4 1.4" />
      <path d="M16 12l-3 5h4l-3 5" />
    </>
  ),
  dust: (
    <>
      <path d="M3 8c3-2 5 2 8 0s5-2 8 0" />
      <path d="M3 13c3-2 5 2 8 0s5-2 8 0" />
      <path d="M3 18c3-2 5 2 8 0s5-2 8 0" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
  cross: <path d="M5 5l14 14M19 5L5 19" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  moon: <path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z" />,
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h12l-3 4 3 4H5" />
    </>
  ),
  heat: <path d="M12 3c3 4 5 6 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />,
  walk: (
    <>
      <circle cx="13" cy="4" r="2" />
      <path d="M11 21l2-7 3 3v4M13 14l-1-6-4 3v3M12 8l4 2 2-1" />
    </>
  ),
};

export function Icon({ name, size = 20, className, title }: { name: IconName; size?: number; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`icon${className ? ` ${className}` : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
