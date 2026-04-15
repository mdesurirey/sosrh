export default function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-foreground mb-1">LégiPilot</p>
        <p className="text-xs text-muted-foreground">
          La gestion RH et juridique des salariés enfin simplifiée.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} LégiPilot — Solution RH hébergée en France
        </p>
      </div>
    </footer>
  );
}
