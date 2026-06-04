import Logo from "./Logo";
import { Button } from "@/components/ui/button";

interface Props {
  onStart: () => void;
}

export default function SiteHeader({ onStart }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <Logo />
        </a>
        <div className="flex items-center gap-3">
          <a
            href="https://www.legipilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Découvrir LégiPilot
          </a>
          <Button
            onClick={onStart}
            size="sm"
            className="bg-navy hover:bg-navy-deep text-white rounded-full px-5"
          >
            Évaluer mon RH
          </Button>
        </div>
      </div>
    </header>
  );
}
