interface Props {
  className?: string;
  variant?: "default" | "light";
}

export default function Logo({ className = "", variant = "default" }: Props) {
  const text = variant === "light" ? "text-white" : "text-navy";
  const accent = variant === "light" ? "text-[hsl(36,50%,80%)]" : "text-[hsl(36,40%,55%)]";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[hsl(36,50%,80%)]">
          <path
            d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-0.5 8-5 8-10V6l-8-4z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={`font-bold text-lg tracking-tight ${text}`}>
        Légi<span className={accent}>Pilot</span>
      </div>
    </div>
  );
}
