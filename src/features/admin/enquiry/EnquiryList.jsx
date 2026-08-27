import { Clock } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function EnquiryList({ items, onSelect, activeTag, isAdmission, statusFilter, onStatusFilterChange }) {
  return (
    <div className="bg-white p-0 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-700 flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Showing '{activeTag.replace('_', ' ')}' Leads
        </h3>
        <div className="flex space-x-3">
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2 font-medium text-gray-700 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="">Status: All</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Lead Info</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                {isAdmission && activeTag !== 'workshop' ? 'Requested Slot' : 'Institution / Detail'}
              </th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => onSelect(item)}>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 text-base">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.email} | {item.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {isAdmission && activeTag !== 'workshop' ? (
                    <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-800 flex items-center">
                         <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                         {item.slotDate || 'Not specified'}
                       </span>
                       <span className="text-xs text-gray-500 mt-0.5 ml-5">Pref: {item.slotTime || 'Anytime'}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-800">{item.source || 'N/A'}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.counselor === 'Unassigned' ? (
                    <span className="text-gray-400 text-xs italic">Unassigned</span>
                  ) : (
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-gray-800 rounded-full text-white flex items-center justify-center text-[10px] font-bold mr-2">
                        {item.counselor.substring(0,2).toUpperCase()}
                      </div>
                      {item.counselor}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 border rounded-full text-xs font-bold ${getStatusColor(item.backendStatus)}`}>
                    {item.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100">
                    Process →
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium">
                  No leads found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
