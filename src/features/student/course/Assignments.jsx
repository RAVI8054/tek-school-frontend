import { ASSIGNMENTS, relativeDay } from "../../../lib/dashboard-data";
import { openAction } from "../../../lib/action-bus";
import { FileText, HelpCircle, Clock, CheckCircle2, MessageSquare, AlertCircle, Upload } from "lucide-react";


export default AssignmentsPage;

const GROUPS = [
{ key: "due", label: "Due soon", tone: "bg-coral/40 text-coral-foreground", empty: "No assignments due right now. Enjoy the breather ☕" },
{ key: "submitted", label: "Awaiting review", tone: "bg-accent-blue/20 text-accent-blue-deep", empty: "Nothing pending review — nice work." },
{ key: "reviewed", label: "Reviewed", tone: "bg-lavender/50", empty: "Feedback appears here once mentors review your work." },
{ key: "overdue", label: "Overdue", tone: "bg-primary text-primary-foreground", empty: "You're up to date on deadlines." }];


export function AssignmentsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Assignments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you owe, everything you've shipped, everything you've gotten feedback on.</p>
      </header>

      {GROUPS.map((g) => {
        const items = ASSIGNMENTS.filter((a) => a.status === g.key);
        return (
          <section key={g.key}>
            <div className="mb-3 flex items-center gap-3">
              <span className={`pill-tag -rotate-2 ${g.tone}`}>{g.label}</span>
              <span className="text-xs font-semibold text-muted-foreground">{items.length}</span>
            </div>
            {items.length === 0 ?
            <p className="rounded-3xl border border-dashed border-border bg-white p-6 text-center text-sm text-muted-foreground">{g.empty}</p> :

            <div className="space-y-3">
                {items.map((a) => <AssignmentCard key={a.id} a={a} />)}
              </div>
            }
          </section>);

      })}
    </div>);

}

function AssignmentCard({ a }) {
  const TypeIcon = a.submissionType === "Code repo" ? Github : a.submissionType === "Quiz" ? HelpCircle : FileText;
  const StatusIcon = a.status === "reviewed" ? CheckCircle2 : a.status === "submitted" ? Upload : a.status === "overdue" ? AlertCircle : Clock;

  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted"><TypeIcon className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{a.module}</p>
          <h3 className="font-display text-lg font-bold leading-snug">{a.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><StatusIcon className="h-3.5 w-3.5" /> {a.status === "reviewed" ? `Grade ${a.grade}` : relativeDay(a.dueDate)}</span>
            <span>· {a.submissionType}</span>
          </div>
        </div>
        <div className="shrink-0">
          {a.status === "due" && <button onClick={() => openAction({ kind: "submit-assignment", title: a.title, submissionType: a.submissionType, module: a.module })} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Submit</button>}
          {a.status === "overdue" && <button onClick={() => openAction({ kind: "submit-assignment", title: a.title, submissionType: a.submissionType, module: a.module })} className="rounded-full bg-coral px-4 py-2 text-xs font-semibold text-coral-foreground">Submit late</button>}
          {a.status === "submitted" && <span className="pill-tag rotate-1 bg-accent-blue/20 text-accent-blue-deep">Under review</span>}
          {a.status === "reviewed" &&
          <button onClick={() => openAction({ kind: "view-feedback", title: a.title, grade: a.grade, feedback: a.feedback })} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-semibold">
              <MessageSquare className="h-3.5 w-3.5" /> View feedback
            </button>
          }
        </div>
      </div>
    </div>);

}