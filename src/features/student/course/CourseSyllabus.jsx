import { useState } from "react";
import { ClassesPage } from "./CourseClasses.jsx";
import { LiveRoomPage } from "../live-room/LiveRoom.jsx";
import { AssignmentsPage } from "./Assignments.jsx";
import { ResourcesPage } from "./Resources.jsx";
import { BookOpen, Video, ClipboardList, Library } from "lucide-react";


export default CoursePage;



const TABS = [
{ key: "live-room", label: "Live class", icon: Video },
{ key: "classes", label: "Classes", icon: BookOpen },
{ key: "assignments", label: "Assignment", icon: ClipboardList },
{ key: "resources", label: "Resources", icon: Library }];


function CoursePage() {
  const [tab, setTab] = useState("live-room");

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex flex-col bg-[#F6F7FB] lg:left-28">
      {/* Mobile horizontal tabs — stuck to top, flush left */}
      <div className="no-scrollbar flex shrink-0 overflow-x-auto border-b border-slate-200 bg-white py-2 pl-0 pr-2 lg:hidden">
        {TABS.map((t) =>
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors first:ml-0 ${
          tab === t.key ? "bg-[var(--accent-blue-deep)] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
          }>
          
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        )}
      </div>

      {/* Desktop vertical tabs — fixed flush to left edge of viewport */}
      <div className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-28 flex-col bg-white shadow-[2px_0_12px_-4px_rgba(15,23,42,0.08)] lg:flex">
        {TABS.map((t) =>
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`group relative flex flex-1 flex-col items-center justify-center gap-2 border-b border-slate-100 px-3 text-[11px] font-bold uppercase tracking-wide transition-all last:border-b-0 ${
          tab === t.key ?
          "bg-[var(--accent-blue-deep)] text-white" :
          "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
          }>
          
            <t.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${tab === t.key ? "text-white" : ""}`} />
            <span className="text-center leading-tight">{t.label}</span>
          </button>
        )}
      </div>

      {/* Content — fills remaining fixed viewport area and scrolls internally */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {tab === "classes" && <ClassesPage />}
        {tab === "live-room" && <LiveRoomPage />}
        {tab === "assignments" && <AssignmentsPage />}
        {tab === "resources" && <ResourcesPage />}
      </div>
    </div>);

}