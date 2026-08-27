export function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_10%,#EEF2FF_0%,#F8FAFC_45%,#E2E8F0_100%)]">
      {/* Actual phone / narrow viewport: no bezel */}
      <div
        className="md:hidden relative mx-auto h-[100dvh] min-h-screen max-w-[440px] overflow-hidden bg-[#F5F5F7]"
        id="phone-surface-mobile"
        data-phone-surface
      >
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      </div>

      {/* Desktop: iPhone 17 Pro Max bezel */}
      <div className="hidden md:flex min-h-screen items-center justify-center px-6 py-10">
        <div className="relative">
          {/* Side buttons */}
          <span className="absolute -left-[3px] top-32 h-8 w-[3px] rounded-l bg-slate-800/80" />
          <span className="absolute -left-[3px] top-48 h-14 w-[3px] rounded-l bg-slate-800/80" />
          <span className="absolute -left-[3px] top-72 h-14 w-[3px] rounded-l bg-slate-800/80" />
          <span className="absolute -right-[3px] top-56 h-20 w-[3px] rounded-r bg-slate-800/80" />

          {/* Outer titanium bezel */}
          <div
            className="relative rounded-[62px] p-[10px] shadow-[0_50px_120px_-30px_rgba(15,23,42,0.55),0_20px_50px_-20px_rgba(15,23,42,0.35)]"
            style={{
              background:
                "linear-gradient(155deg,#3f3f46 0%,#71717a 25%,#27272a 50%,#71717a 75%,#3f3f46 100%)",
            }}
          >
            {/* Inner black bezel */}
            <div className="rounded-[54px] bg-black p-[3px]">
              <div
                id="phone-surface-desktop"
                data-phone-surface
                className="relative h-[900px] w-[430px] overflow-hidden rounded-[50px] bg-[#F5F5F7]"
              >
                {/* Dynamic Island */}
                <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-8 w-[120px] -translate-x-1/2 rounded-full bg-black" />
                {/* Status bar */}
                <StatusBar />
                {/* App content — screen stays fixed; individual app panes handle scrolling */}
                <div className="h-full w-full overflow-hidden">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function getPhoneSurface() {
  if (typeof document === "undefined") return null;
  const surfaces = Array.from(document.querySelectorAll("[data-phone-surface]"));
  return surfaces.find((surface) => {
    const rect = surface.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }) ?? document.body;
}

function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-11 items-center justify-between px-8 pt-2 text-[13px] font-semibold text-white mix-blend-difference">
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="10" viewBox="0 0 17 10" fill="currentColor"><rect x="0" y="7" width="3" height="3" rx="0.5"/><rect x="4.5" y="5" width="3" height="5" rx="0.5"/><rect x="9" y="2.5" width="3" height="7.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="10" rx="0.5"/></svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4 Q7.5 -1 14 4"/><path d="M3 6 Q7.5 2 12 6"/><path d="M5 8 Q7.5 5.5 10 8"/><circle cx="7.5" cy="9.5" r="0.7" fill="currentColor"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor"/></svg>
      </div>
    </div>
  );
}
