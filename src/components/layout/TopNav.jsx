import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, Layout, Brain, Rocket, Target, Calendar, Home as HomeIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LogoLockup } from '../ui/Logo.jsx';
import { MegaMenu } from './MegaMenu.jsx';
import { openSignIn } from '../../lib/auth.js';
import heroStudents from "../../assets/hero-students.jpg";

const programsRows = [
  { to: "/programs/ai-engineering", title: "AI Engineering", desc: "RAG, fine-tuning, agentic systems — shipped to prod.", tag: "9 mo + internship · Flagship", color: "coral", icon: <Brain className="h-5 w-5" /> },
  { to: "/programs/cloud-engineering", title: "Cloud Engineering", desc: "AWS, Kubernetes, SRE. Certification prep included.", tag: "6 mo + internship · Flagship", color: "blue", icon: <Package className="h-5 w-5" /> },
  { to: "/programs/software-engineering", title: "Software Engineering", desc: "Full-stack, real portfolio, 5+ guaranteed interviews.", tag: "6 mo + internship · Flagship", color: "navy", icon: <Layout className="h-5 w-5" /> },
  { to: "/programs/future-engineering", divider: true, title: "Future Engineering", desc: "School track — coding, robotics and AI for ages 6–15.", tag: "Ages 6–15 · School programme", color: "lavender", icon: <Rocket className="h-5 w-5" /> },
];

const programsFeature = {
  to: "/programs/ai-engineering",
  eyebrow: "Featured flagship",
  title: "AI Engineering — March 3 cohort, 8 seats left",
  image: heroStudents,
};

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: <HomeIcon className="h-4 w-4" /> },
  { to: '/programs', label: 'Programs', icon: <Layout className="h-4 w-4" /> },
  { to: '/workshops', label: 'Workshops', icon: <Calendar className="h-4 w-4" /> },
  { to: '/about', label: 'About', icon: <Target className="h-4 w-4" /> },
  { to: '/contact', label: 'Contact', icon: <Calendar className="h-4 w-4" /> },
];



export function TopNav() {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Keep the header always visible on programme pages so section tabs can stick to it.
  const isProgramPage = path.startsWith('/programs');

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(!isProgramPage && delta > 0 && y > 120);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isProgramPage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (hidden) setOpen(false); }, [hidden]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setOpen(false); }, [path]);

  const isProgramsActive = path.startsWith('/programs') || path.startsWith('/courses');
  const isAboutActive = path.startsWith('/about') || path.startsWith('/instructors');
  const isCampusActive = path.startsWith('/campus');

  const linkCls = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div
      className="sticky top-0 z-40 transition-all duration-300 will-change-transform"
      style={{ transform: hidden ? 'translateY(-115%)' : 'translateY(0)', opacity: hidden ? 0 : 1, padding: scrolled ? '8px 8px' : '0' }}
    >
      <nav className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'mx-auto max-w-[1360px] rounded-full bg-white border border-border px-4 py-2 md:px-6 md:py-2.5 shadow-[0_6px_18px_-12px_rgba(30,27,75,0.35)]' : 'px-4 py-3 md:px-8 md:py-5'}`}>

        <Link to="/" className="flex items-center shrink-0 select-none" aria-label="TekSchool">
          <LogoLockup className={scrolled ? 'h-7' : 'h-8'} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-1 rounded-full bg-muted p-1.5">
          <Link to="/" className={linkCls(path === '/')}>
            <span className="flex items-center gap-1"><HomeIcon className="h-3.5 w-3.5" /> Home</span>
          </Link>

          {/* Programs mega menu */}
          <MegaMenu label="Programs" to="/courses" active={isProgramsActive} rows={programsRows} feature={programsFeature} />

          <Link to="/workshops" className={linkCls(path.startsWith('/workshops'))}>Workshops</Link>
          <Link to="/about" className={linkCls(isAboutActive)}>About</Link>
          <Link to="/contact" className={linkCls(path.startsWith('/contact'))}>Contact</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/campus"
            className={`hidden sm:flex rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${isCampusActive ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary/30 bg-white text-primary hover:bg-primary/5 hover:border-primary/50'}`}
          >
            Tek Campus
          </Link>
          <button
            onClick={openSignIn}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </button>
          <button
            aria-label="Menu"
            className="xl:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden absolute left-4 right-4 top-20 z-50 rounded-3xl bg-white border p-3 shadow-xl">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold hover:bg-muted"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">{n.icon}</span>
                {n.label}
              </Link>
            ))}
            <Link to="/campus" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold hover:bg-muted">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted"><Target className="h-4 w-4" /></span>
              Tek Campus
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
