import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getChannelMessages,
  sendChannelMessage,
  reactToChannelMessage,
  getCommunityChannels,
} from "../../../lib/api";
import { pushToast } from "../../../lib/action-bus";
import { useStudentAuthStore } from "../../../store/useStudentAuthStore.js";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Reply,
  X,
  Hash,
  Loader2,
  Users,
  MessageSquare,
} from "lucide-react";

export default function ChannelPage() {
  const { channelId } = useParams();
  const { user: currentUser } = useStudentAuthStore();
  const myId = (currentUser?._id || currentUser?.id || "").toString();

  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Load channel info ──────────────────────────────────────
  useEffect(() => {
    loadChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const loadChannel = async () => {
    try {
      const [myRes, enrolledRes] = await Promise.all([
        getCommunityChannels("my_channels"),
        getCommunityChannels("enrolled"),
      ]);
      const all = [
        ...(myRes.data?.channels || []),
        ...(enrolledRes.data?.channels || []),
      ];
      const found = all.find((c) => c._id === channelId);
      if (found) setChannel(found);
    } catch {
      // ignore
    }
  };

  // ── Load messages ──────────────────────────────────────────
  useEffect(() => {
    if (!channelId) return;
    loadMessages(true);
    const iv = setInterval(() => loadMessages(false), 4000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [errorMsg, setErrorMsg] = useState(null);

  const loadMessages = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setErrorMsg(null);
      const res = await getChannelMessages(channelId, 50, 0);
      console.log("FETCHED MESSAGES API RES:", res);
      if (res.status === "success") {
        setMessages(res.data.messages || []);
      } else {
        setErrorMsg(res.message || "Unknown error");
      }
    } catch (err) {
      console.error("LOAD MESSAGES ERROR:", err);
      setErrorMsg(err.message || "Failed to fetch");
      if (showLoader) pushToast("Could not load messages", "error");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // ── Send ───────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    const parentId = replyingTo?._id || null;

    // Optimistic
    const temp = {
      _id: `temp-${Date.now()}`,
      content: trimmed,
      createdAt: new Date().toISOString(),
      senderId: { _id: myId, name: currentUser?.name || "Me" },
      parentMessageId: replyingTo
        ? { _id: replyingTo._id, content: replyingTo.content, senderId: replyingTo.senderId }
        : null,
      likes: [],
      dislikes: [],
      _temp: true,
    };
    setMessages((p) => [...p, temp]);
    setContent("");
    setReplyingTo(null);
    setSending(true);

    try {
      await sendChannelMessage({ channelId, content: trimmed, parentMessageId: parentId });
      loadMessages(false);
    } catch (err) {
      pushToast(err.message || "Failed to send", "error");
      setMessages((p) => p.filter((m) => m._id !== temp._id));
    } finally {
      setSending(false);
    }
  };

  // ── React ──────────────────────────────────────────────────
  const handleReact = async (msgId, action) => {
    try {
      await reactToChannelMessage(msgId, action);
      loadMessages(false);
    } catch {
      // ignore
    }
  };

  // ── Group by date ──────────────────────────────────────────
  const grouped = messages.reduce((acc, msg) => {
    const d = new Date(msg.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(msg);
    return acc;
  }, {});

  const isToday = (dateStr) => {
    return (
      dateStr ===
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-white shrink-0">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent-blue)]/10">
          <Hash className="w-4 h-4 text-[var(--accent-blue)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm text-slate-900 truncate font-display">
            {channel ? channel.name.replace(/^#/, "") : "Loading…"}
          </h2>
          {channel && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              {channel.members?.length || 0} members
              {channel.description ? ` · ${channel.description}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-sm">Loading messages…</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-red-400">
            <X className="w-10 h-10 opacity-50" />
            <p className="text-sm font-semibold">API Error: {errorMsg}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <MessageSquare className="w-10 h-10 opacity-20" />
            <p className="text-sm">No messages yet — say hello! 👋</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  {isToday(date) ? "Today" : date}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {msgs.map((msg, i) => {
                const prevMsg = i > 0 ? msgs[i - 1] : null;
                
                let isGrouped = false;
                if (prevMsg) {
                  const sameSender = (prevMsg.senderId?._id || "").toString() === (msg.senderId?._id || "").toString();
                  const timeDiff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
                  const lessThan10Mins = timeDiff < 10 * 60 * 1000;
                  isGrouped = sameSender && lessThan10Mins && !msg.parentMessageId;
                }

                const isTemp = Boolean(msg._temp);

                return (
                  <MessageRow
                    key={msg._id}
                    msg={msg}
                    grouped={isGrouped}
                    isFirstInDay={i === 0}
                    isTemp={isTemp}
                    onReply={() => {
                      setReplyingTo(msg);
                      inputRef.current?.focus();
                    }}
                    onReact={handleReact}
                  />
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Reply banner ───────────────────────────────────── */}
      {replyingTo && (
        <div className="px-5 py-2 bg-blue-50 border-t border-blue-100 flex items-center gap-2 shrink-0">
          <Reply className="w-3.5 h-3.5 text-[var(--accent-blue)] shrink-0" />
          <span className="text-xs font-semibold text-slate-700 shrink-0">
            {replyingTo.senderId?.name}:
          </span>
          <span className="text-xs text-slate-500 italic truncate flex-1">
            {replyingTo.content}
          </span>
          <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-blue-100 rounded-full shrink-0">
            <X className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      )}

      {/* ── Input ──────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Message ${channel ? "#" + channel.name.replace(/^#/, "") : "channel"}…`}
            className="flex-1 h-10 rounded-full bg-slate-50 border border-slate-200 px-4 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-[var(--accent-blue)] text-white disabled:opacity-40 hover:bg-[var(--accent-blue-deep)] transition-all"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Message Row Component ──────────────────────────────────────
function MessageRow({ msg, grouped, isFirstInDay, isTemp, onReply, onReact }) {
  const [hovered, setHovered] = useState(false);

  const senderName = msg.senderId?.name || "Unknown";
  const initials = senderName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-3 items-start group relative ${
        grouped ? "mt-0.5" : `mt-4 ${!isFirstInDay ? 'pt-4 border-t border-slate-100' : ''}`
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar / spacer */}
      <div className="w-8 shrink-0 mt-0.5">
        {!grouped ? (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-white text-[11px] font-bold">
            {initials}
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + time — only for first in group */}
        {!grouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-800">{senderName}</span>
            <span className="text-[10px] text-slate-400">{time}</span>
          </div>
        )}

        {/* Reply quote */}
        {msg.parentMessageId && (
          <div className="flex items-center gap-1.5 mb-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-500 border-l-2 border-slate-300 max-w-md">
            <Reply className="w-2.5 h-2.5 shrink-0" />
            <span className="font-semibold shrink-0">
              {msg.parentMessageId.senderId?.name}:
            </span>
            <span className="truncate italic">{msg.parentMessageId.content}</span>
          </div>
        )}

        {/* Message bubble */}
        <p
          className={`text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words ${
            isTemp ? "opacity-60" : ""
          }`}
        >
          {msg.content}
        </p>

        {/* Reactions row */}
        {!isTemp && (msg.likes?.length > 0 || msg.dislikes?.length > 0) && (
          <div className="flex items-center gap-1.5 mt-1">
            {msg.likes?.length > 0 && (
              <button
                onClick={() => onReact(msg._id, "like")}
                className="flex items-center gap-1 text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium hover:bg-blue-100 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                {msg.likes.length}
              </button>
            )}
            {msg.dislikes?.length > 0 && (
              <button
                onClick={() => onReact(msg._id, "dislike")}
                className="flex items-center gap-1 text-[11px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium hover:bg-red-100 transition-colors"
              >
                <ThumbsDown className="w-3 h-3" />
                {msg.dislikes.length}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hover action bar */}
      {hovered && !isTemp && (
        <div className="absolute right-0 top-0 flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl shadow-sm px-1.5 py-1 z-10">
          <ActionBtn icon={ThumbsUp} onClick={() => onReact(msg._id, "like")} title="Like" />
          <ActionBtn icon={ThumbsDown} onClick={() => onReact(msg._id, "dislike")} title="Dislike" />
          <ActionBtn icon={Reply} onClick={onReply} title="Reply" />
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
