export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <img
          src="/assets/generated/coin-logo.dim_512x512.png"
          alt="Coin Grader Logo"
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">Coin Grader</h1>
          <p className="text-xs text-muted-foreground">Professional Coin Analysis</p>
        </div>
      </div>
    </header>
  );
}
