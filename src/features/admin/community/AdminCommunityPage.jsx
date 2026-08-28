import { useState, useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { CommunityList } from './CommunityList.jsx';
import { CommunityDetail } from './CommunityDetail.jsx';
import {
  getAdminCommunityChannels,
  editAdminCommunityChannel,
  deleteAdminCommunityChannel,
} from '../../../lib/api.js';
import { ConfirmDeleteModal } from '../../../components/ui/ConfirmDeleteModal.jsx';
import toast from 'react-hot-toast';

export function AdminCommunityPage() {
  const [channels, setChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const fetchChannels = async (search = '') => {
    setLoading(true);
    try {
      const res = await getAdminCommunityChannels(search);
      if (res.status === 'success') {
        setChannels(res.data.channels);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load community channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChannels(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleEditChannel = async (channelId, data) => {
    try {
      const res = await editAdminCommunityChannel(channelId, data);
      if (res.status === 'success') {
        toast.success('Channel updated successfully');
        fetchChannels(searchQuery);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update channel');
    }
  };

  const [deletingChannel, setDeletingChannel] = useState(null);

  const handleDeleteChannel = async () => {
    if (!deletingChannel) return;
    
    // We throw the error so the ConfirmDeleteModal catches it and shows a toast
    const res = await deleteAdminCommunityChannel(deletingChannel._id);
    if (res.status !== 'success') {
      throw new Error('Failed to delete channel');
    }
    
    if (selectedChannel?._id === deletingChannel._id) {
      setSelectedChannel(null);
    }
    fetchChannels(searchQuery);
    setDeletingChannel(null);
  };



  return (
    <AdminShell 
      title="Community Management" 
      fullHeight
      hideDefaultSearch
      actions={
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-indigo-500"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      }
    >
      <div className="flex h-full gap-4">
        <div className={`flex-1 transition-all ${selectedChannel ? 'hidden md:block md:max-w-md lg:max-w-lg' : ''}`}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <CommunityList
              channels={channels}
              selectedChannelId={selectedChannel?._id}
              onSelect={setSelectedChannel}
              onEdit={handleEditChannel}
              onDelete={(channelId) => setDeletingChannel(channels.find(c => c._id === channelId))}
            />
          )}
        </div>

        {selectedChannel && (
          <div className="flex-1 flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <CommunityDetail
              channel={selectedChannel}
              onClose={() => setSelectedChannel(null)}
            />
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deletingChannel}
        onClose={() => setDeletingChannel(null)}
        onConfirm={handleDeleteChannel}
        itemName={deletingChannel?.name}
        description="Are you sure you want to delete this channel? All messages inside it will be permanently removed."
        successMessage="Channel deleted successfully!"
      />
    </AdminShell>
  );
}
