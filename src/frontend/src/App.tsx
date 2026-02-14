import { useState } from 'react';
import { AppHeader } from './components/Brand/AppHeader';
import { CoinGradingFlow } from './components/CoinCapture/CoinGradingFlow';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <CoinGradingFlow />
      </main>
      <footer className="mt-16 border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with <span className="text-destructive">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'coin-grader'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} Coin Grader</p>
        </div>
      </footer>
    </div>
  );
}
