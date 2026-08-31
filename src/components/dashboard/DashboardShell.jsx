import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Briefcase, MessageCircle, Settings, LogOut, Menu, X, Bell, HelpCircle, ChevronDown, GraduationCap, User } from 'lucide-react';
import { LogoLockup } from '../ui/Logo.jsx';
import { useStudentAuth } from '../../context/StudentAuthContext.jsx';
import { ActionModals } from '../ActionModals.jsx';
import { NotificationDrawer, SEED_NOTIFICATIONS } from './NotificationDrawer.jsx';

const PRIMARY = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/learning', label: 'Learning', icon: GraduationCap },
  { to: '/dashboard/course', label: 'Course', icon: BookOpen },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/placements', label: 'Placements', icon: Briefcase },
  { to: '/dashboard/community', label: 'Community', icon: MessageCircle },
];
const SECONDARY = [
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/help', label: 'Help center', icon: HelpCircle },
];

const ALL_NAV = [...PRIMARY, ...SECONDARY];

export function DashboardShell() {
  const { user, logout } = useStudentAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close drawers on navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setMobileOpen(false); setNotifOpen(false); }, [path]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const s = user;
  if (!s) return null;

  const isActive = (to, exact) => (exact ? path === to : path === to || path.startsWith(to + '/'));
  const coursePaths = ['/dashboard/classes', '/dashboard/live-room', '/dashboard/assignments', '/dashboard/resources'];

  const visibleNav = PRIMARY;
  const moreNav = SECONDARY;

  const NavLink = ({ n, className = '' }) => {
    const active = isActive(n.to, n.exact);
    const courseActive = n.to === '/dashboard/course' && coursePaths.some((p) => path === p || path.startsWith(p + '/'));
    const isNavActive = active || courseActive;
    return (
      <Link
        to={n.to}
        className={`group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
          isNavActive
            ? 'bg-[var(--accent-blue-deep)] text-white shadow-[0_8px_18px_-10px_var(--accent-blue-deep)]'
            : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
        } ${className}`}
      >
        <n.icon className={`h-4 w-4 shrink-0 ${isNavActive ? '' : 'text-slate-400 group-hover:text-foreground'}`} strokeWidth={isNavActive ? 2.4 : 2} />
        <span className="truncate">{n.label}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F6F7FB]">
      {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile slide-in drawer ───────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <LogoLockup className="h-7 flex-1" />
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer user info */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-xs font-bold text-white">
            {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{s.name || 'Student'}</p>
            <p className="truncate text-[11px] text-slate-500">{s.email || 'student@tek.school'}</p>
          </div>
        </div>

        {/* Drawer nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto p-3">
          {ALL_NAV.map((n) => {
            const active = isActive(n.to, n.exact) || (n.to === '/dashboard/course' && coursePaths.some((p) => path === p));
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[var(--accent-blue-deep)] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="relative h-full flex flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 md:px-6">

            <div className="inline-flex shrink-0 items-center" aria-label="TekSchool">
              <LogoLockup className="h-7" />
            </div>

            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {visibleNav.map((n) => (
                <NavLink key={n.to} n={n} />
              ))}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
              <button
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                onClick={() => setNotifOpen(true)}
                className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-slate-50"
              >
                {unreadCount > 0 && (
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-coral/25 animate-bell-halo" />
                )}
                <Bell className={`relative h-4 w-4 text-slate-600 ${unreadCount > 0 ? 'animate-bell-ring' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="relative hidden sm:block">
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-2.5 py-1 hover:bg-slate-50"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-xs font-bold text-white">
                    {s.avatarInitials}
                  </div>
                  <span className="hidden text-sm font-semibold md:inline">{s.name.split(' ')[0]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-xs font-bold text-white">
                          {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800">{s.name || 'Student'}</span>
                          <p className="truncate text-[11px] text-slate-500">{s.email || 'student@tek.school'}</p>
                        </div>
                      </div>
                      <div className="my-1 h-px bg-slate-100" />
                      {moreNav.map((n) => (
                        <Link key={n.to} to={n.to} onClick={() => setMoreOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-foreground">
                          <n.icon className="h-4 w-4 text-slate-400" /> {n.label}
                        </Link>
                      ))}
                      <button
                        onClick={async () => { await logout(); navigate('/'); }}
                        className="mt-0.5 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4 text-slate-400" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile hamburger — opens slide-in drawer */}
              <button
                aria-label="Menu"
                className="lg:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className={`no-scrollbar flex-1 flex flex-col ${path.startsWith('/dashboard/community/') ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <main className={`flex-1 mx-auto w-full max-w-[1400px] ${path.startsWith('/dashboard/community/') ? 'px-4 py-4 md:px-6 md:py-4 flex flex-col min-h-0' : 'px-4 py-6 pb-28 md:px-6 md:py-8 lg:pb-12'}`}>
            <Outlet />
          </main>
          <NotificationDrawer
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            items={notifications}
            onMarkAllRead={() => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))}
            onRead={(id) => setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))}
          />
          <ActionModals />

          {/* Bottom nav bar for mobile */}
          <div className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
            {PRIMARY.slice(0, 5).map((n) => {
              const active = isActive(n.to, n.exact) || (n.to === '/dashboard/course' && coursePaths.includes(path));
              return (
                <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-semibold ${active ? 'text-[var(--accent-blue-deep)]' : 'text-slate-400'}`}>
                  <n.icon className="h-5 w-5" />
                  {n.label.split(' ')[0]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
