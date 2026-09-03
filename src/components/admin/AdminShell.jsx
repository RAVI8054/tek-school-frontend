import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  LayoutGrid, Users, GraduationCap, ClipboardCheck, Briefcase, BookOpen, Inbox, UserSquare, Wallet, Megaphone,
  Settings2, Shield, ChevronDown, Search, Bell, LogOut, FileEdit, Palette, Send, Sparkles, PanelLeftClose, PanelLeftOpen, ClipboardList, Menu, X, Calendar,
} from 'lucide-react';
import { LogoLockup } from '../ui/Logo.jsx';
import { ROLE_ACCESS, AUDIT } from '../../lib/adminData.js';
import { AdminAI } from './AdminAI.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';

const NAV_GROUPS = [
  { label: 'Overview', items: [
    { key: 'overview', to: '/admin', label: 'Dashboard', icon: LayoutGrid },
  ] },
  { label: 'Enquiry', items: [
    { key: 'enquiries-admission',  to: '/admin/enquiries/admission',  label: 'Admission Enquiry',  icon: Inbox },
    { key: 'enquiries-tekcampus',  to: '/admin/enquiries/tekcampus',  label: 'Tek Campus Enquiry', icon: ClipboardList },
  ] },
  { label: 'Community', items: [
    { key: 'community', to: '/admin/community', label: 'Community', icon: Users },
  ] },
  { label: 'People', items: [
    { key: 'students', to: '/admin/students', label: 'Students', icon: Users },
    { key: 'cohorts', to: '/admin/cohorts', label: 'Cohorts & Classes', icon: GraduationCap },
    { key: 'instructors', to: '/admin/instructors', label: 'Instructors', icon: UserSquare },
    { key: 'salesteam', to: '/admin/salesteam', label: 'Sales Team', icon: Users },
  ] },
  { label: 'Learning', items: [
    { key: 'assignments', to: '/admin/assignments', label: 'Assignments', icon: ClipboardCheck },
    { key: 'content', to: '/admin/content', label: 'Curriculum', icon: BookOpen },
    { key: 'workshops', to: '/admin/workshops', label: 'Workshops', icon: Calendar },
  ] },
  { label: 'Growth', items: [
    { key: 'placements', to: '/admin/placements', label: 'Placements', icon: Briefcase, badge: 'AI' },
    { key: 'outreach', to: '/admin/outreach', label: 'Outreach', icon: Send, badge: 'AI' },
  ] },
  { label: 'Studio', items: [
    { key: 'pages', to: '/admin/pages', label: 'Build Pages', icon: FileEdit },
    { key: 'canvas', to: '/admin/studio', label: 'Creative Studio', icon: Palette, badge: 'AI' },
    { key: 'marketing', to: '/admin/marketing', label: 'Campaigns', icon: Megaphone },
  ] },
  { label: 'Operations', items: [
    { key: 'finance', to: '/admin/finance', label: 'Finance', icon: Wallet },
    { key: 'settings', to: '/admin/settings', label: 'Settings & Roles', icon: Settings2 },
  ] },
];

/* ── Shared sidebar nav content (used in both desktop & mobile drawer) ─ */
function SidebarContent({ collapsed, setCollapsed, allowed, isActive, isMobile, onNavClick, user, logout, navigate }) {
  return (
    <>
      {/* Logo / brand header */}
      <div className={`flex shrink-0 items-center border-b border-slate-100 ${collapsed && !isMobile ? 'justify-center px-2 py-3' : 'gap-2 px-5 py-4'}`}>
        {collapsed && !isMobile ? (
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#1E1B4B] to-[#2D5FA8] text-[10px] font-black text-white" aria-label="TekSchool home">TS</Link>
        ) : (
          <>
            <Link to="/" className="inline-flex"><LogoLockup className="h-7" /></Link>
            <span className="ml-1 rounded-md bg-[#1E1B4B] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Admin</span>
            {isMobile && (
              <button
                onClick={onNavClick}
                className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav groups */}
      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        {NAV_GROUPS.map((group) => {
          const visible = group.items.filter((n) => allowed.has(n.key));
          if (visible.length === 0) return null;
          const showLabel = !collapsed || isMobile;
          return (
            <div key={group.label} className="mb-3">
              {showLabel && (
                <p className="px-3 pb-1 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.label}</p>
              )}
              {!showLabel && <div className="mx-3 my-2 h-px bg-slate-100 first:hidden" />}
              {visible.map((n) => {
                const hasChildren = !!n.children;
                const childActive = hasChildren && n.children.some(c => isActive(c.to));
                const active = !hasChildren && isActive(n.to);
                const isCollapsedDesktop = collapsed && !isMobile;

                if (hasChildren) {
                  return (
                    <div key={n.label} className="mb-0.5 group/nav">
                      <div
                        title={isCollapsedDesktop ? n.label : undefined}
                        className={`group relative flex cursor-default items-center rounded-lg font-medium transition-colors ${
                          isCollapsedDesktop ? 'mx-1 h-10 justify-center px-0' : 'gap-2.5 px-3 py-2 text-[13px]'
                        } ${childActive ? 'text-slate-900' : 'text-slate-600'}`}
                      >
                        <n.icon className={`shrink-0 ${isCollapsedDesktop ? 'h-[18px] w-[18px]' : 'h-4 w-4'}`} />
                        {!isCollapsedDesktop && <span className="flex-1 truncate">{n.label}</span>}
                        {!isCollapsedDesktop && (
                          <ChevronDown className={`h-3 w-3 transition-transform ${childActive ? 'rotate-180' : ''}`} />
                        )}
                        {isCollapsedDesktop && (
                          <div className="invisible absolute left-full top-0 z-50 ml-2 flex flex-col gap-1 rounded-lg bg-white p-2 shadow-xl ring-1 ring-slate-200 opacity-0 transition-all group-hover/nav:visible group-hover/nav:opacity-100">
                            <p className="mb-1 border-b border-slate-100 pb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{n.label}</p>
                            {n.children.map(c => (
                              <Link key={c.to} to={c.to} onClick={onNavClick} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${isActive(c.to) ? 'bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      {!isCollapsedDesktop && (
                        <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pl-2">
                          {n.children.map(c => {
                            const cActive = isActive(c.to);
                            return (
                              <Link key={c.to} to={c.to} onClick={onNavClick} className={`block rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${cActive ? 'bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] text-white shadow-[0_4px_12px_-6px_#1E1B4B]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                {c.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={onNavClick}
                    title={isCollapsedDesktop ? n.label : undefined}
                    aria-label={n.label}
                    className={`group relative mb-0.5 flex items-center rounded-lg font-medium transition-colors ${
                      isCollapsedDesktop ? 'mx-1 h-10 justify-center px-0' : 'gap-2.5 px-3 py-2 text-[13px]'
                    } ${active
                      ? 'bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] text-white shadow-[0_4px_12px_-6px_#1E1B4B]'
                      : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <n.icon className={`shrink-0 ${isCollapsedDesktop ? 'h-[18px] w-[18px]' : 'h-4 w-4'}`} />
                    {!isCollapsedDesktop && <span className="flex-1 truncate">{n.label}</span>}
                    {!isCollapsedDesktop && n.badge && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${active ? 'bg-white/25 text-white' : 'bg-coral/15 text-coral'}`}>{n.badge}</span>
                    )}
                    {isCollapsedDesktop && n.badge && (
                      <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-coral" />
                    )}
                    {isCollapsedDesktop && (
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
      <div className={`shrink-0 border-t border-slate-100 ${collapsed && !isMobile ? 'p-2' : 'p-3'}`}>
        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`mb-2 flex items-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 ${collapsed ? 'h-9 w-full justify-center' : 'w-full gap-2 px-3 py-1.5'}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-3.5 w-3.5" /> Collapse</>}
          </button>
        )}
        {(!collapsed || isMobile) && (
          <>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signed in as</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-100 text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user?.name || 'Admin'}</p>
                <p className="truncate text-[10px] font-medium text-slate-500 capitalize">{user?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={async () => { await logout(); navigate('/admin/login'); }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              <LogOut className="h-3 w-3" /> Exit admin
            </button>
          </>
        )}
        {collapsed && !isMobile && (
          <button
            onClick={async () => { await logout(); navigate('/admin/login'); }}
            className="grid h-9 w-full place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            title="Exit admin"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </>
  );
}

/* ── Main AdminShell ─────────────────────────────────────────────────── */
export function AdminShell({ title, children, actions, fullHeight, hideDefaultSearch }) {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const role = user?.role || 'admin';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tek-admin-nav-collapsed');
    setTimeout(() => setCollapsed(stored === null ? true : stored === '1'), 0);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tek-admin-role', role);
  }, [role]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tek-admin-nav-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const allowed = new Set(ROLE_ACCESS[role] || []);
  const isActive = (to) => (to === '/admin' ? path === '/admin' : path.startsWith(to));
  const sidebarW = collapsed ? 'w-[68px]' : 'w-[248px]';
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const sharedProps = { collapsed, setCollapsed, allowed, isActive, user, logout, navigate };

  return (
    <div className="h-screen overflow-hidden bg-[#F5F7FB]">
      {/* ── Mobile backdrop overlay ─────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile slide-in drawer ──────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <SidebarContent {...sharedProps} isMobile={true} onNavClick={closeMobile} />
      </aside>

      <div className="flex h-full">
        {/* ── Desktop sidebar ─────────────────────────────────────────── */}
        <aside className={`hidden h-full ${sidebarW} shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex`}>
          <SidebarContent {...sharedProps} isMobile={false} onNavClick={undefined} />
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 h-full overflow-y-auto flex flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 md:px-6">
              {/* Mobile hamburger — only visible below lg */}
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              {/* Desktop collapse toggle — only visible at lg+ */}
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="hidden h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:grid"
                aria-label="Toggle sidebar"
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">TekSchool · Internal</p>
                <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>
              </div>
              {!hideDefaultSearch && (
                <div className="relative hidden max-w-xs flex-1 md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search students, cohorts, jobs…" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--accent-blue-deep)]" />
                </div>
              )}
              {actions}
              <button
                onClick={() => setAiOpen(true)}
                className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_#1E1B4B] md:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </button>
              <button onClick={() => setShowAudit((s) => !s)} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 md:inline-flex">
                <Shield className="h-3.5 w-3.5" /> Audit
              </button>
              <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50">
                <Bell className="h-3.5 w-3.5 text-slate-600" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" />
              </button>
            </div>
          </div>

          {showAudit && (
            <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Recent activity</p>
              <ul className="space-y-1 text-xs">
                {AUDIT.map((a) => (
                  <li key={a.id} className="flex items-baseline gap-3">
                    <span className="w-16 shrink-0 text-slate-400">{a.when}</span>
                    <span className="font-semibold">{a.who}</span>
                    <span className="text-slate-600">{a.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

