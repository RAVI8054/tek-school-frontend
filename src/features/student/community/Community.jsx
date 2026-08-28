import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunityChannels, joinCommunityChannel, deleteCommunityChannel, createCommunityChannel } from "../../../lib/api";
import { pushToast } from "../../../lib/action-bus";
import { Hash, Users, Plus, Trash2, Sparkles, TrendingUp, Award, MessageCircle, BadgeCheck, Radio, Search } from "lucide-react";
import { Modal, PrimaryBtn, GhostBtn } from "../../../components/ui/Modal";
import { ConfirmDeleteModal } from "../../../components/ui/ConfirmDeleteModal";
import { Avatar } from "../../../components/Avatar";
import { COHORT } from "../../../lib/dashboard-data";

export default function CommunityPage() {
  const navigate = useNavigate();
  
  const [myChannels, setMyChannels] = useState([]);
  const [enrolledChannels, setEnrolledChannels] = useState([]);
  const [discoverChannels, setDiscoverChannels] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem("tek_student_user") || "{}");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const trimmedSearch = debouncedSearch.trim();
      
      if (trimmedSearch) {
        // If searching, just hit the 'all' filter endpoint once
        const searchRes = await getCommunityChannels("all", trimmedSearch);
        if (searchRes.status === "success") setSearchResults(searchRes.data.channels);
      } else {
        // If not searching, load the 3 specific sections
        const [myRes, enrolledRes, discoverRes] = await Promise.all([
          getCommunityChannels("my_channels"),
          getCommunityChannels("enrolled"),
          getCommunityChannels("discover")
        ]);

        if (myRes.status === "success") setMyChannels(myRes.data.channels);
        if (enrolledRes.status === "success") setEnrolledChannels(enrolledRes.data.channels);
        if (discoverRes.status === "success") setDiscoverChannels(discoverRes.data.channels);
      }
    } catch {
      pushToast("Failed to load channels", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName) return;

    try {
      setIsCreating(true);
      const res = await createCommunityChannel({
        name: newChannelName,
        description: newChannelDesc
      });
      if (res.status === "success") {
        pushToast("Room created successfully!", "success");
        setIsCreateModalOpen(false);
        setNewChannelName("");
        setNewChannelDesc("");
        loadData();
      } else {
        pushToast(res.message || "Failed to create channel", "error");
      }
    } catch {
      pushToast("An error occurred", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinChannel = async (e, channelId) => {
    e.stopPropagation();
    try {
      const res = await joinCommunityChannel(channelId);
      if (res.status === "success") {
        pushToast("Joined! Opening channel…", "success");
        await loadData();
        navigate(`/dashboard/community/${channelId}`);
      }
    } catch (err) {
      pushToast(err.message || "Failed to join channel", "error");
    }
  };

  const [channelToDelete, setChannelToDelete] = useState(null);

  const handleDeleteChannel = async () => {
    if (!channelToDelete) return;
    const res = await deleteCommunityChannel(channelToDelete._id);
    if (res.status === "success") {
      loadData();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <ConfirmDeleteModal
        open={!!channelToDelete}
        onClose={() => setChannelToDelete(null)}
        onConfirm={handleDeleteChannel}
        itemName={channelToDelete?.name ? `#${channelToDelete.name}` : undefined}
        successMessage="Room deleted successfully!"
      />
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#3B458A] p-8 md:p-10 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#F4A261]/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="pill-tag -rotate-2 bg-white/15 text-white backdrop-blur px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3 w-3" /> Your cohort · Mar 2026
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">The room where it happens.</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">1,240 builders online right now. Spin up your own room, invite your cohort and keep the conversation in one place.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white text-[#5865F2] px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-colors">
                <Plus className="h-4 w-4" /> Create a room
              </button>
              <div className="flex -space-x-2">
                {COHORT.slice(0, 5).map((m) =>
                  <div key={m.name} className="rounded-full ring-2 ring-[#4752C4]">
                    <Avatar name={m.name} initials={m.initials} photo={m.photo} size={36} />
                  </div>
                )}
                <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#4752C4] bg-white text-[10px] font-bold text-[#4752C4]">+42</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-2">
              <MiniPill icon={Users} value="1,240" label="Online now" />
              <MiniPill icon={MessageCircle} value="86" label="Threads today" />
              <MiniPill icon={TrendingUp} value="+18" label="Wins this week" />
              <MiniPill icon={Award} value="12" label="Mentors on-call" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search channels..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50 focus:border-[var(--accent-blue)] transition-all shadow-sm"
        />
      </div>

      {loading && !debouncedSearch ? (
        <div className="flex justify-center p-12 text-slate-400">Loading channels...</div>
      ) : debouncedSearch.trim() ? (
        <div className="space-y-12">
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Search Results</h2>
            {loading ? (
              <div className="flex justify-center p-12 text-slate-400">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-3xl text-center text-muted-foreground text-sm">
                No channels found matching "{debouncedSearch}"
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map(channel => {
                  // Determine channel type based on user interaction
                  let type = "discover";
                  if (channel.creatorId === user.id) type = "mine";
                  else if (channel.members?.includes(user.id)) type = "enrolled";

                  return (
                    <ChannelCard 
                      key={channel._id} 
                      channel={channel} 
                      onEnter={() => navigate(`/dashboard/community/${channel._id}`)}
                      onAction={type === "discover" ? (e) => handleJoinChannel(e, channel._id) : type === "mine" ? (e) => { e.stopPropagation(); setChannelToDelete(channel); } : undefined}
                      type={type}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Your Room Section */}
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Your room</h2>
            {myChannels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-t border-dashed border-border mt-2 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-50 mb-4 text-slate-400">
                  <Radio className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold">You haven't created a room yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mt-1">Every builder can create one room. Pick a topic, invite your cohort, and keep the conversation flowing.</p>
                <GhostBtn onClick={() => setIsCreateModalOpen(true)}>Create a room</GhostBtn>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {myChannels.map(channel => (
                  <ChannelCard 
                    key={channel._id} 
                    channel={channel} 
                    onEnter={() => navigate(`/dashboard/community/${channel._id}`)}
                    onAction={(e) => { e.stopPropagation(); setChannelToDelete(channel); }}
                    type="mine"
                  />
                ))}
              </div>
            )}
          </section>

          {/* My Channels Section */}
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">My channels</h2>
            {enrolledChannels.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-3xl text-center text-muted-foreground text-sm">
                You haven't joined any channels yet. Explore the official channels below!
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {enrolledChannels.map(channel => (
                  <ChannelCard 
                    key={channel._id} 
                    channel={channel} 
                    onEnter={() => navigate(`/dashboard/community/${channel._id}`)}
                    type="enrolled"
                  />
                ))}
              </div>
            )}
          </section>

          {/* Official Channels Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-xl font-bold">Official channels</h2>
              <span className="text-[10px] font-semibold text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                By TekSchool
              </span>
            </div>
            
            {discoverChannels.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-3xl">
                No new channels to discover.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {discoverChannels.map(channel => (
                  <ChannelCard 
                    key={channel._id} 
                    channel={channel} 
                    onAction={(e) => handleJoinChannel(e, channel._id)}
                    type="discover"
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create a Room" size="md">
        <form onSubmit={handleCreateChannel} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">#</span>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-border outline-none focus:border-[var(--accent-blue)] transition-colors"
                placeholder="react-developers"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={newChannelDesc}
              onChange={(e) => setNewChannelDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border outline-none focus:border-[var(--accent-blue)] transition-colors resize-none h-24"
              placeholder="What is this room about?"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <GhostBtn onClick={() => setIsCreateModalOpen(false)}>Cancel</GhostBtn>
            <PrimaryBtn type="submit">
              {isCreating ? "Creating..." : "Create Room"}
            </PrimaryBtn>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function MiniPill({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur min-w-[120px]">
      <div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 opacity-80" /> <p className="font-display text-lg font-bold">{value}</p></div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</p>
    </div>
  );
}

function ChannelCard({ channel, onEnter, onAction, type }) {
  // Generate a random-ish tone class based on ID or string length so it looks varied like the original
  const tones = ["bg-accent-blue/15 text-accent-blue-deep", "bg-lavender/50 text-lavender-foreground", "bg-coral/30 text-coral-foreground", "bg-slate-100"];
  const tone = tones[channel.name.length % tones.length];

  return (
    <button onClick={type !== 'discover' ? onEnter : undefined} className="group relative flex flex-col rounded-3xl border border-border bg-white p-5 text-left hover:-translate-y-1 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 w-full">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tone}`}>
          <Hash className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold flex items-center gap-1">
            {channel.name} 
            {type === 'discover' && <BadgeCheck className="h-4 w-4 text-blue-500" />}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{channel.description || "No description provided"}</p>
        </div>
      </div>
      
      <div className="mt-4 flex w-full items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {channel.members?.length || 0} members</span>
        
        {type === 'discover' ? (
          <div 
            onClick={onAction}
            className="font-semibold text-white bg-[var(--accent-blue)] px-3 py-1 rounded-full hover:bg-[var(--accent-blue-deep)] transition-colors"
          >
            Join
          </div>
        ) : type === 'mine' ? (
          <div className="flex items-center gap-4">
             <div 
                onClick={onAction}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                title="Delete channel"
             >
                <Trash2 className="h-4 w-4" />
             </div>
             <span className="font-semibold text-[var(--accent-blue-deep)]">Chat →</span>
          </div>
        ) : (
          <span className="font-semibold text-[var(--accent-blue-deep)]">Chat →</span>
        )}
      </div>
    </button>
  );
}