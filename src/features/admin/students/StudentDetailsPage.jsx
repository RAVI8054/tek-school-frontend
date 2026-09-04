import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { getStudentDetailsAdmin } from '../../../lib/api.js';
import { pushToast } from '../../../lib/actionBus.js';
import { ChevronLeft, Mail, Phone, MapPin, Calendar, CreditCard, Video, AlertTriangle } from 'lucide-react';

export function StudentDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDetailsAdmin(id)
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch((err) => {
        pushToast('Failed to load student details: ' + err.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AdminShell title="Student Details">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--accent-blue-deep)]" />
        </div>
      </AdminShell>
    );
  }

  if (!data || !data.student) {
    return (
      <AdminShell title="Student Not Found">
        <div className="flex h-64 items-center justify-center text-slate-500">
          The requested student could not be found.
        </div>
      </AdminShell>
    );
  }

  const { student, workshopBookings = [], payments = [] } = data;

  return (
    <AdminShell 
      title={
        <div className="flex items-center gap-2">
          <Link to="/admin/students" className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span>Student Profile</span>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        {/* Header Profile Card */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)] md:flex-row md:items-start">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-3xl font-bold text-white">
            {student.profile_img ? (
              <img src={student.profile_img} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {student.name}
                  {student.atRisk && <span className="flex items-center gap-1 rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold text-coral"><AlertTriangle className="h-3 w-3" /> AT RISK</span>}
                </h1>
                <p className="mt-1 font-medium text-slate-500">{student.track === 'Workshop Only' ? 'Guest / Workshop Only' : `${student.track} · ${student.cohort}`}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold ${student.isCommunityBlocked ? 'bg-coral/10 text-coral' : 'bg-emerald-50 text-emerald-600'}`}>
                  {student.isCommunityBlocked ? 'Blocked from Community' : 'Active Account'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{student.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{student.city || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Enrolled {new Date(student.enrolledAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for the rest */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Main Content (Left, 2 columns wide) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Workshop Bookings */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-blue/20 text-[var(--accent-blue-deep)]">
                  <Video className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Workshop Bookings</h2>
              </div>
              
              {workshopBookings.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Workshop</th>
                        <th className="px-4 py-3">Booked On</th>
                        <th className="px-4 py-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workshopBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{b.workshop?.title || 'Unknown Workshop'}</td>
                          <td className="px-4 py-3 text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${b.paymentStatus === 'Completed' || b.paymentStatus === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-coral/10 text-coral'}`}>
                              {b.paymentStatus} {b.amountPaid ? `(₹${b.amountPaid})` : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No workshop bookings found for this student.
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
              </div>
              
              {payments.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">For</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-900">{p.currency} {p.amount}</td>
                          <td className="px-4 py-3 font-medium text-slate-600">{p.paymentFor}</td>
                          <td className="px-4 py-3 text-slate-500">{p.paymentMethod}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Refunded' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No payment records found. (Guest workshop payments may only be logged in the Booking if no Payment record was generated).
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Content (Right, 1 column wide) */}
          <div className="space-y-6">
            
            {/* Core Metrics */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Program Progress</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Attendance</p>
                  <p className="mt-1 text-xl font-bold">{student.attendance ?? '-'}%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Completion</p>
                  <p className="mt-1 text-xl font-bold">{student.completion ?? '-'}%</p>
                </div>
                <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Placement Status</p>
                  <p className="mt-1 font-bold">{student.placement || 'Not Started'}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Mock */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Platform Activity</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-blue-deep)]" />
                  <div>
                    <p className="font-semibold text-slate-900">Logged into platform</p>
                    <p className="text-slate-500">Last login: {student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleString() : 'Never'}</p>
                  </div>
                </li>
                {workshopBookings.length > 0 && (
                  <li className="flex gap-3">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-semibold text-slate-900">Purchased Workshop</p>
                      <p className="text-slate-500">{workshopBookings[0].workshop?.title}</p>
                    </div>
                  </li>
                )}
                {student.track !== 'Workshop Only' && (
                  <li className="flex gap-3">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-900">Joined Program</p>
                      <p className="text-slate-500">{student.track}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Admin Notes */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Private Admin Notes</h3>
              <textarea 
                placeholder="Add a note visible only to admins/admissions..." 
                className="h-32 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
                onBlur={(e) => {
                  if(e.target.value) pushToast('Note saved automatically');
                }}
              />
            </div>

          </div>
        </div>

      </div>
    </AdminShell>
  );
}
