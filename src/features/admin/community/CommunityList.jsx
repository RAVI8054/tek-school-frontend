import { useState } from 'react';
import { Users, Edit2, Trash2, Calendar, Shield, Save } from 'lucide-react';

export function CommunityList({ channels, selectedChannelId, onSelect, onEdit, onDelete, pagination, onPageChange }) {
  const [editingChannel, setEditingChannel] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const startEditing = (e, channel) => {
    e.stopPropagation();
    setEditingChannel(channel._id);
    setEditForm({ name: channel.name.replace('#', ''), description: channel.description });
  };

  const handleSave = async (e, channelId) => {
    e.stopPropagation();
    await onEdit(channelId, editForm);
    setEditingChannel(null);
  };

  const cancelEditing = (e) => {
    e.stopPropagation();
    setEditingChannel(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-slate-800">All Channels ({channels.length})</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {channels.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No channels found.</div>
        ) : (
          channels.map((channel, idx) => {
            const isSelected = selectedChannelId === channel._id;
            const isEditing = editingChannel === channel._id;
            const serialNumber = (pagination ? (pagination.page - 1) * pagination.limit : 0) + idx + 1;

            return (
              <div
                key={channel._id}
                onClick={() => !isEditing && onSelect(channel)}
                className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Channel Name</label>
                      <div className="flex items-center">
                        <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-md px-3 py-1.5 text-slate-500 font-medium">#</span>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="flex-1 border border-slate-300 rounded-r-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500 resize-none h-20"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                        Cancel
                      </button>
                      <button onClick={(e) => handleSave(e, channel._id)} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1">
                        <Save className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'} transition-colors flex items-center justify-center font-bold text-xs min-w-[28px]`}>
                          {serialNumber}.
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm truncate">{channel.name}</h4>
                      </div>
                      
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEditing(e, channel)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit Channel"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(channel._id); }}
                          className="p-1.5 text-slate-400 hover:text-coral hover:bg-coral/10 rounded transition-colors"
                          title="Delete Channel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                      {channel.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{channel.members?.length || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1" title="Creator">
                        <Shield className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{channel.creatorId?.name || 'System'}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(channel.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="border-t border-slate-100 p-3 bg-slate-50 flex justify-between items-center text-[11px] font-medium text-slate-500 shrink-0">
          <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
          <div className="flex gap-1">
            <button 
              onClick={() => onPageChange(pagination.page - 1)} 
              disabled={pagination.page <= 1}
              className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button 
              onClick={() => onPageChange(pagination.page + 1)} 
              disabled={pagination.page >= pagination.pages}
              className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
