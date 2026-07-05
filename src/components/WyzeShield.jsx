export default function WyzeShield({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 2.5l8 2.8v6.2c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V5.3l8-2.8z"
        fill="none"
        stroke="#3b5bdb"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="13.6"
        textAnchor="middle"
        fill="#3b5bdb"
        fontSize="4.6"
        fontWeight="800"
        letterSpacing="0.4"
      >
        WYZE
      </text>
    </svg>
  );
}
