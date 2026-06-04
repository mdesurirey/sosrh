interface Props {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
}

export default function Logo({ className = "", variant = "default", showWordmark = true }: Props) {
  const textColor = variant === "light" ? "text-white" : "text-navy";
  const frameStroke = variant === "light" ? "#ffffff" : "hsl(217 55% 18%)";
  const accent = "hsl(28 80% 82%)"; // beige peach asterisk

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-8 h-8" aria-hidden="true">
        {/* offset squared frame */}
        <path
          d="M22 18 L82 18 L82 78"
          stroke={frameStroke}
          strokeWidth="6"
          fill="none"
          strokeLinecap="square"
        />
        <path
          d="M78 82 L18 82 L18 22"
          stroke={frameStroke}
          strokeWidth="6"
          fill="none"
          strokeLinecap="square"
        />
        {/* asterisk */}
        <g stroke={accent} strokeWidth="8" strokeLinecap="round">
          <line x1="50" y1="36" x2="50" y2="64" />
          <line x1="38" y1="43" x2="62" y2="57" />
          <line x1="62" y1="43" x2="38" y2="57" />
        </g>
      </svg>
      {showWordmark && (
        <span className={`font-bold text-xl tracking-tight ${textColor}`}>LégiPilot</span>
      )}
    </div>
  );
}
