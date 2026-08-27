import { TopNav } from './TopNav.jsx';
import { Footer } from './Footer.jsx';

/**
 * Shell — wraps all public (marketing) pages.
 * Provides TopNav + Footer + max-width container.
 */
export function Shell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1400px]">
        <TopNav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
