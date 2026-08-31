import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutGrid, GraduationCap, ClipboardCheck, BookOpen, Search, Bell, LogOut, Sparkles, PanelLeftClose, PanelLeftOpen, Menu, X
} from 'lucide-react';
import { LogoLockup } from '../ui/Logo.jsx';
import { AdminAI } from '../admin/AdminAI.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_GROUPS = [
  { label: 'Overview', items: [
    { to: '/instructor', label: 'Dashboard', icon: LayoutGrid },
  ] },
  { label: 'Teaching', items: [
    { to: '/instructor/cohorts', label: 'Cohorts & Classes', icon: GraduationCap },
  ] },
  { label: 'Learning', items: [
    { to: '/instructor/assignments', label: 'Assignments', icon: ClipboardCheck },
    { to: '/instructor/curriculum', label: 'Curriculum', icon: BookOpen },
  ] }
];

/* Declared at module level to satisfy react(static-components) lint rule */
function InstructorSidebarNav({ isCollapsed, isMobile, onClose, setCollapsed, isActive, user, logout, navigate }) {
  return (
    <>
      {/* Logo header */}
      <div className={`flex shrink-0 items-center border-b border-slate-100 ${isCollapsed && !isMobile ? 'justify-center px-2 py-3' : 'gap-2 px-5 py-4'}`}>
        {isCollapsed && !isMobile ? (
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#1E1B4B] to-[#2D5FA8] text-[10px] font-black text-white" aria-label="TekSchool home">TS</Link>
        ) : (
          <>
            <Link to="/" className="inline-flex"><LogoLockup className="h-7" /></Link>
            <span className="ml-1 rounded-md bg-[#1E1B4B] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Instructor</span>
            {isMobile && (
              <button onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        {NAV_GROUPS.map((group) => {
          const showLabel = !isCollapsed || isMobile;
          return (
            <div key={group.label} className="mb-3">
              {showLabel && <p className="px-3 pb-1 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.label}</p>}
              {!showLabel && <div className="mx-3 my-2 h-px bg-slate-100 first:hidden" />}
              {group.items.map((n) => {
                const active = isActive(n.to);
                const cd = isCollapsed && !isMobile;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={isMobile ? onClose : undefined}
                    title={cd ? n.label : undefined}
                    aria-label={n.label}
                    className={`group relative mb-0.5 flex items-center rounded-lg font-medium transition-colors ${
                      cd ? 'mx-1 h-10 justify-center px-0' : 'gap-2.5 px-3 py-2 text-[13px]'
                    } ${active
                      ? 'bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] text-white shadow-[0_4px_12px_-6px_#1E1B4B]'
                      : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <n.icon className={`shrink-0 ${cd ? 'h-[18px] w-[18px]' : 'h-4 w-4'}`} />
                    {!cd && <span className="flex-1 truncate">{n.label}</span>}
                    {cd && (
                      <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-[#1E1B4B] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {n.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`shrink-0 border-t border-slate-100 ${isCollapsed && !isMobile ? 'p-2' : 'p-3'}`}>
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`mb-2 flex items-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 ${isCollapsed ? 'h-9 w-full justify-center' : 'w-full gap-2 px-3 py-1.5'}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-3.5 w-3.5" /> Collapse</>}
          </button>
        )}
        {(!isCollapsed || isMobile) && (
          <>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signed in as</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-100 text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0).toUpperCase() || 'I'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user?.name || 'Instructor'}</p>
                <p className="truncate text-[10px] font-medium text-slate-500 capitalize">{user?.role || 'Instructor'}</p>
              </div>
            </div>
            <button
              onClick={async () => { await logout(); navigate('/admin/login'); }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </>
        )}
        {isCollapsed && !isMobile && (
          <button
            onClick={async () => { await logout(); navigate('/admin/login'); }}
            className="grid h-9 w-full place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </>
  );
}

export function InstructorShell({ title, children, actions, fullHeight, hideDefaultSearch }) {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tek-instructor-nav-collapsed');
    setTimeout(() => setCollapsed(stored === null ? true : stored === '1'), 0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tek-instructor-nav-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Lock body scroll when mobile menu is open (syncs with external DOM — no setState)
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (to) => (to === '/instructor' ? path === '/instructor' : path.startsWith(to));
  const sidebarW = collapsed ? 'w-[68px]' : 'w-[248px]';
  const closeMobile = () => setMobileOpen(false);
  const sharedNavProps = { setCollapsed, isActive, user, logout, navigate };

  return (
    <div className="h-screen overflow-hidden bg-[#F5F7FB]">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* Mobile slide-in drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Instructor navigation"
      >
        <InstructorSidebarNav {...sharedNavProps} isCollapsed={false} isMobile={true} onClose={closeMobile} />
      </aside>

      <div className="flex h-full">
        {/* Desktop sidebar */}
        <aside className={`hidden h-full ${sidebarW} shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex`}>
          <InstructorSidebarNav {...sharedNavProps} isCollapsed={collapsed} isMobile={false} onClose={undefined} />
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 h-full overflow-y-auto flex flex-col">
          {/* Topbar */}
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 md:px-6">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              {/* Desktop collapse toggle */}
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="hidden h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:grid"
                aria-label="Toggle sidebar"
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">TekSchool · Teaching</p>
                <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>
              </div>
              {!hideDefaultSearch && (
                <div className="relative hidden max-w-xs flex-1 md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search classes, curriculum…" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--accent-blue-deep)]" />
                </div>
              )}
              {actions}
              <button
                onClick={() => setAiOpen(true)}
                className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_#1E1B4B] md:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </button>
              <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50">
                <Bell className="h-3.5 w-3.5 text-slate-600" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" />
              </button>
            </div>
          </div>

          <main className={fullHeight
            ? 'no-scrollbar flex-1 overflow-hidden px-3 pt-4 sm:px-4 sm:pt-5 md:px-6 md:pt-6 flex flex-col'
            : 'no-scrollbar flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6'
          }>{children}</main>
        </div>
      </div>
      <AdminAI open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
