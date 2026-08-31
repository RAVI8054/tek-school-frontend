import { Outlet, useLocation } from "react-router-dom";
import { AdminShell } from "../../../components/admin/AdminShell.jsx";

const TITLE_MAP = {
  admission:  'Admission Enquiries',
  tekcampus:  'Tek Campus Enquiries',
};

export function EnquiriesPage() {
  const { pathname } = useLocation();
  const segment = pathname.split('/').pop();
  const title = TITLE_MAP[segment] ?? 'Enquiries';

  return (
    <AdminShell title={title} fullHeight>
      <div className="h-full flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </AdminShell>
  );
}
