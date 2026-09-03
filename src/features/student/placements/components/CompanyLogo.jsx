import { useState } from "react";

export function CompanyLogo({ domain, name }) {
  const [broken, setBroken] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (broken) {
    return <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent-blue-deep)] to-[var(--accent-blue)] text-sm font-bold text-white">{initials}</div>;
  }
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-white p-2 overflow-hidden">
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={`${name} logo`}
        onError={() => setBroken(true)}
        className="h-full w-full object-contain" />
    </div>
  );
}
