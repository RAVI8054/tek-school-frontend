import { cn } from "../lib/utils.js";
export function Avatar({ name, initials, photo, size = 40, className, ring }) {
  const label = initials ?? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-white font-bold grid place-items-center",
        ring && "ring-2 ring-white",
        className
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.35)) }}>
      
      {photo ?
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }} /> :

      null}
      {!photo && <span>{label}</span>}
    </div>);

}