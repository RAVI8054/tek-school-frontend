import { useState, useEffect } from 'react';
import { X, MessageSquare, Trash2, ShieldAlert, Hash } from 'lucide-react';
import { getAdminChannelMessages, deleteAdminCommunityMessage, blockAdminCommunityUser } from '../../../lib/api.js';
import { ConfirmDeleteModal } from '../../../components/ui/ConfirmDeleteModal.jsx';
import toast from 'react-hot-toast';

function BlockUserModal({ user, onClose, onConfirm, loading }) {
  const [note, setNote] = useState('');

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 flex flex-col gap-5">
        <button
          onClick={loading ? undefined : onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-red-500" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Block {user.name}?
          </h3>
          <p className="text-sm text-slate-500">
            This student will be blocked from accessing the community channels. You can provide an optional reason below.
          </p>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Block Reason (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Spamming channels, inappropriate behavior..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-red-500 min-h-[80px] resize-none"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            Block Student
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommunityDetail({ channel, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await getAdminChannelMessages(channel._id);
        if (res.status === 'success') {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (channel?._id) {
      fetchMessages();
    }
  }, [channel?._id]);

  const [deletingMessage, setDeletingMessage] = useState(null);

  const handleDeleteMessage = async () => {
    if (!deletingMessage) return;
    
    const res = await deleteAdminCommunityMessage(deletingMessage._id);
    if (res.status === 'success') {
      setMessages(messages.filter(m => m._id !== deletingMessage._id));
      setDeletingMessage(null);
    } else {
      throw new Error('Failed to delete message');
    }
  };

  const [blockingUser, setBlockingUser] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleConfirmBlock = async (note) => {
    if (!blockingUser) return;
    
    setIsBlocking(true);
    try {
      const res = await blockAdminCommunityUser(blockingUser.id, note);
      if (res.status === 'success') {
        toast.success(`${blockingUser.name} has been blocked`);
        setBlockingUser(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to block ${blockingUser.name}`);
    } finally {
      setIsBlocking(false);
    }
  };

  if (!channel) return null;

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{channel.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{channel.description || 'No description'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="p-4 rounded-full bg-slate-100">
              <MessageSquare className="w-8 h-8 opacity-50" />
            </div>
            <p>No messages in this channel yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="group bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex gap-3 hover:border-slate-300 transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {msg.senderId?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{msg.senderId?.name || 'Unknown User'}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      {msg.senderId && (
                        <button
                          onClick={() => setBlockingUser({ id: msg.senderId._id, name: msg.senderId.name })}
                          className="p-1 text-slate-400 hover:text-coral hover:bg-coral/10 rounded transition-colors"
                          title="Block User"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingMessage(msg)}
                        className="p-1 text-slate-400 hover:text-coral hover:bg-coral/10 rounded transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deletingMessage}
        onClose={() => setDeletingMessage(null)}
        onConfirm={handleDeleteMessage}
        itemName={deletingMessage?.content?.substring(0, 50) + (deletingMessage?.content?.length > 50 ? '...' : '')}
        description="Are you sure you want to delete this message? This action cannot be undone."
        successMessage="Message deleted successfully!"
      />

      <BlockUserModal 
        user={blockingUser}
        onClose={() => setBlockingUser(null)}
        onConfirm={handleConfirmBlock}
        loading={isBlocking}
      />
    </>
  );
}
