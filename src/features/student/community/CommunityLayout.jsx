import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getCommunityChannels,
  createCommunityChannel,
  joinCommunityChannel,
} from "../../../lib/api";
import { pushToast } from "../../../lib/action-bus";
import {
  Hash,
  Plus,
  Search,
  Users,
  MessageSquare,
  Compass,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function CommunityLayout() {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const location = useLocation();

  const [myChannels, setMyChannels] = useState([]);
  const [enrolledChannels, setEnrolledChannels] = useState([]);
  const [discoverChannels, setDiscoverChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showDiscover, setShowDiscover] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sidebar collapse
  const [myOpen, setMyOpen] = useState(true);
  const [enrolledOpen, setEnrolledOpen] = useState(true);

  const isHome = location.pathname === "/dashboard/community";

  const loadChannels = async () => {
    try {
      setLoading(true);
      const [myRes, enrolledRes, discoverRes] = await Promise.all([
        getCommunityChannels("my_channels"),
        getCommunityChannels("enrolled"),
        getCommunityChannels("discover"),
      ]);
      setMyChannels(myRes.data?.channels || []);
      setEnrolledChannels(enrolledRes.data?.channels || []);
      setDiscoverChannels(discoverRes.data?.channels || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setIsCreating(true);
      const res = await createCommunityChannel({
        name: newName.trim(),
        description: newDesc.trim(),
      });
      if (res.status === "success") {
        pushToast("Room created!", "success");
        setNewName("");
        setNewDesc("");
        setShowCreate(false);
        await loadChannels();
        navigate(`/dashboard/community/${res.data.channel._id}`);
      }
    } catch (err) {
      pushToast(err.message || "Failed to create room", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (cId) => {
    try {
      await joinCommunityChannel(cId);
      pushToast("Joined!", "success");
      setShowDiscover(false);
      await loadChannels();
      navigate(`/dashboard/community/${cId}`);
    } catch (err) {
      pushToast(err.message || "Failed to join", "error");
    }
  };

  const filteredDiscover = discoverChannels.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SidebarChannel = ({ ch }) => {
    const isActive = channelId === ch._id;
    return (
      <button
        onClick={() => navigate(`/dashboard/community/${ch._id}`)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
          isActive
            ? "bg-[var(--accent-blue)] text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white/80" : "text-slate-400"}`} />
        <span className="text-sm font-medium truncate flex-1">
          {ch.name.replace(/^#/, "")}
        </span>
        <span className={`text-[10px] ${isActive ? "text-white/70" : "text-slate-400"}`}>
          {ch.members?.length || 0}
        </span>
      </button>
    );
  };

  return (
    <div
      className="flex flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50/70">
        {/* Sidebar Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard/community')}
            className="flex items-center gap-2 hover:bg-slate-200 p-1.5 rounded-lg transition-colors -ml-1.5"
            title="Back to all channels"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-sm text-slate-800">Community</span>
          </button>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {loading ? (
            <div className="space-y-2 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* My Rooms */}
              {myChannels.length > 0 && (
                <div>
                  <button
                    onClick={() => setMyOpen((o) => !o)}
                    className="w-full flex items-center gap-1 px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
                  >
                    {myOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    My Rooms
                  </button>
                  {myOpen && (
                    <div className="space-y-0.5">
                      {myChannels.map((ch) => (
                        <SidebarChannel key={ch._id} ch={ch} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Joined Channels */}
              {enrolledChannels.length > 0 && (
                <div>
                  <button
                    onClick={() => setEnrolledOpen((o) => !o)}
                    className="w-full flex items-center gap-1 px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
                  >
                    {enrolledOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    Joined
                  </button>
                  {enrolledOpen && (
                    <div className="space-y-0.5">
                      {enrolledChannels.map((ch) => (
                        <SidebarChannel key={ch._id} ch={ch} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {myChannels.length === 0 && enrolledChannels.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <Hash className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 mb-3">No channels yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ═══ MAIN CHAT AREA (Outlet) ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {isHome ? (
          /* Welcome screen when no channel selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--accent-blue)]/10">
              <MessageSquare className="w-8 h-8 text-[var(--accent-blue)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-display">
                Welcome to Community
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Select a channel from the sidebar to start chatting, or discover new channels to join.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDiscover(true)}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Discover
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-full bg-[var(--accent-blue)] text-white text-sm font-semibold hover:bg-[var(--accent-blue-deep)] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Room
              </button>
            </div>
          </div>
        ) : (
          <Outlet context={{ onChannelUpdate: loadChannels }} />
        )}
      </div>

      {/* ═══ DISCOVER MODAL ═══ */}
      {showDiscover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">Discover Channels</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {discoverChannels.length} channels available to join
                </p>
              </div>
              <button
                onClick={() => setShowDiscover(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredDiscover.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No channels found
                </div>
              ) : (
                filteredDiscover.map((ch) => (
                  <div
                    key={ch._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent-blue)]/10">
                      <Hash className="w-4 h-4 text-[var(--accent-blue)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        {ch.name}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        {ch.members?.length || 0} members
                      </p>
                    </div>
                    <button
                      onClick={() => handleJoin(ch._id)}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--accent-blue)] text-white text-xs font-semibold hover:bg-[var(--accent-blue-deep)] transition-colors"
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowDiscover(false);
                  setShowCreate(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your own room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CREATE ROOM MODAL ═══ */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Create a Room</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Room Name
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[var(--accent-blue)] transition-colors">
                  <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="react-developers"
                    className="bg-transparent text-sm outline-none flex-1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Description{" "}
                  <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this room about?"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-semibold hover:bg-[var(--accent-blue-deep)] disabled:opacity-50 transition-colors"
                >
                  {isCreating ? "Creating…" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
