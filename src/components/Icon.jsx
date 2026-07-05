const PATHS = {
  camera: (
    <>
      <rect x="6" y="2.5" width="12" height="12" rx="3.5" />
      <circle cx="12" cy="8.5" r="2.4" />
      <path d="M9.25 20.5a2.75 2.75 0 0 1 5.5 0" />
      <path d="M5.5 20.5h13" />
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5.5L12 2 4 5.5V12c0 6 8 10 8 10z" />
  ),
  sensor: (
    <>
      <rect x="6.5" y="3" width="11" height="7.5" rx="2.5" />
      <path d="M9.6 6.75h.9M13.5 6.75h.9" strokeWidth="2" />
      <path d="M8 14a5.7 5.7 0 0 0 8 0" />
      <path d="M5 17.5a10 10 0 0 0 14 0" />
    </>
  ),
  truck: (
    <>
      <rect x="1.5" y="4.5" width="13.5" height="11.5" rx="1" />
      <path d="M15 9h3.5l3 3.5V16H15V9z" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="17.5" cy="18.5" r="2" />
    </>
  ),
  'caret-down': <path d="M6.5 9h11L12 16z" fill="currentColor" stroke="none" />,
  'caret-up': <path d="M6.5 15h11L12 8z" fill="currentColor" stroke="none" />,
  grid: (
    <g strokeWidth="1.4">
      <circle cx="8" cy="6" r="1.4" />
      <circle cx="12" cy="6" r="1.4" />
      <circle cx="16" cy="6" r="1.4" />
      <circle cx="6" cy="12" r="1.4" />
      <circle cx="10" cy="12" r="1.4" />
      <circle cx="14" cy="12" r="1.4" />
      <circle cx="18" cy="12" r="1.4" />
      <circle cx="8" cy="18" r="1.4" />
      <circle cx="12" cy="18" r="1.4" />
      <circle cx="16" cy="18" r="1.4" />
    </g>
  ),
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
