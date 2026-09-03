import { Briefcase, Pencil, Power } from 'lucide-react';
import { AdminTable } from '../../../../components/admin/AdminTable.jsx';

export function OpenRolesSection({ jobs, onEdit, onToggleStatus }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 font-display text-sm font-bold flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Open roles</h3>
      <AdminTable
        rows={jobs}
        filename="job-posts.csv"
        empty={{ title: "No open roles", hint: "Add a job posting to start collecting applicants." }}
        rowActions={[
          { label: "Edit Job", icon: Pencil, onClick: (r) => onEdit(r) },
          { label: "Toggle status", icon: Power, onClick: (r) => onToggleStatus(r),
            confirm: { title: "Change role status?", message: (r) => <>Toggling <b>{r.role}</b> at <b>{r.company}</b> to <b>{r.status === "Open" ? "Closed" : "Open"}</b>.</> } },
        ]}
        columns={[
          { key: "serialNumber", label: "#" },
          { key: "role", label: "Role" },
          { key: "company", label: "Company" },
          { key: "track", label: "Track" },
          { key: "location", label: "Location" },
          { key: "salary", label: "Salary" },
          { key: "applicants", label: "Applicants" },
          { key: "postedDays", label: "Posted", render: (r) => `${r.postedDays}d ago` },
          { key: "status", label: "Status", render: (r) => <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${r.status === "Open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.status}</span> },
        ]}
      />
    </div>
  );
}
