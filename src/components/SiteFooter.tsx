import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} LégiPilot · La plateforme qui réalise vos opérations RH sur simple demande
        </p>
        <a
          href="https://www.legipilot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-navy hover:text-sky transition"
        >
          legipilot.com →
        </a>
      </div>
    </footer>
  );
}
