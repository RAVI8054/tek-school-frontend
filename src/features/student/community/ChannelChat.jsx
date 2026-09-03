import { useState, useEffect, useRef } from "react";
import { getChannelMessages, sendChannelMessage, reactToChannelMessage } from "../../../lib/api";
import { Avatar } from "../../../components/Avatar";
import { ArrowLeft, Send, ThumbsUp, ThumbsDown, MessageSquare, Reply, X, Hash } from "lucide-react";
import { pushToast } from "../../../lib/action-bus";
import { useStudentAuthStore } from "../../../store/useStudentAuthStore.js";

export function ChannelChat({ channel, onBack }) {
  const { user: currentUser } = useStudentAuthStore();
  const myId = (currentUser?._id || currentUser?.id || "").toString();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const loadMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await getChannelMessages(channel._id);
      if (res.status === "success") {
        setMessages(res.data.messages);
      }
    } catch {
      if (showLoading) pushToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages(false);
    }, 5000); 
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tempMessage = {
      _id: "temp-" + Date.now(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      senderId: {
        _id: currentUser.id || currentUser._id,
        name: currentUser.name || "Me",
      },
      parentMessageId: replyingTo ? {
         _id: replyingTo._id,
         content: replyingTo.content,
         senderId: replyingTo.senderId
      } : null,
      likes: [],
      dislikes: []
    };
    
    setMessages(prev => [...prev, tempMessage]);
    const messageContent = content.trim();
    const parentId = replyingTo ? replyingTo._id : null;
    
    setContent("");
    setReplyingTo(null);

    try {
      const res = await sendChannelMessage({
        channelId: channel._id,
        content: messageContent,
        parentMessageId: parentId,
      });
      if (res.status === "success") {
        loadMessages(false);
      }
    } catch (err) {
      pushToast(err.message || "Failed to send message", "error");
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    }
  };

  const handleReact = async (messageId, action) => {
    try {
      const res = await reactToChannelMessage(messageId, action);
      if (res.status === "success") {
        loadMessages(false);
      }
    } catch (err) {
      pushToast(err.message || "Failed to react", "error");
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, { 
      weekday: 'long', month: 'short', day: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100">
          <Hash className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm leading-tight font-display truncate">{channel.name}</h2>
          <p className="text-[11px] text-slate-400 truncate">{channel.members?.length || 0} members · {channel.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-slate-50/40">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
            <p>No messages yet. Be the first to say hello!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2">{date}</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              
              {msgs.map((msg) => {
                const senderId = (msg.senderId?._id || "").toString();
                const isMe = myId && senderId && senderId === myId;
                return (
                  <div key={msg._id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0">
                      <Avatar name={msg.senderId?.name || "Unknown"} size={30} />
                    </div>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      {!isMe && (
                        <span className="text-[11px] font-semibold text-slate-500 mb-0.5 ml-1">{msg.senderId?.name}</span>
                      )}
                      
                      {/* Reply preview */}
                      {msg.parentMessageId && (
                        <div className={`mb-1 px-2.5 py-1 text-[11px] rounded-lg bg-slate-200/70 text-slate-500 max-w-full flex items-center gap-1.5 border-l-2 ${isMe ? 'border-[var(--accent-blue)]' : 'border-slate-400'}`}>
                          <Reply className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate italic">
                            {msg.parentMessageId.senderId?.name}: {msg.parentMessageId.content}
                          </span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[var(--accent-blue)] text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] text-slate-400 mt-0.5 mx-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Reactions */}
                      {!msg._id.toString().startsWith('temp') && (
                        <div className={`flex items-center gap-1.5 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <button onClick={() => handleReact(msg._id, 'like')} className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors ${
                            msg.likes?.map(id => id.toString()).includes(myId) ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
                          }`}>
                            <ThumbsUp className="w-3 h-3" /> {msg.likes?.length || 0}
                          </button>
                          <button onClick={() => handleReact(msg._id, 'dislike')} className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors ${
                            msg.dislikes?.map(id => id.toString()).includes(myId) ? 'bg-red-100 text-red-500' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                          }`}>
                            <ThumbsDown className="w-3 h-3" /> {msg.dislikes?.length || 0}
                          </button>
                          <button onClick={() => { setReplyingTo(msg); inputRef.current?.focus(); }} className="flex items-center gap-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-full hover:bg-slate-100 transition-colors">
                            <Reply className="w-3 h-3" /> Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="px-6 py-2 bg-slate-100 border-t border-border flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2 overflow-hidden">
             <Reply className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
             <span className="font-semibold text-slate-700 shrink-0">Replying to {replyingTo.senderId?.name || "someone"}:</span>
             <span className="truncate italic opacity-80">{replyingTo.content}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-slate-200 rounded-full shrink-0">
             <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="px-3 pb-3 pt-2 border-t border-border bg-white">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Message ${channel.name}...`}
            className="flex-1 h-10 rounded-full bg-slate-50 border border-slate-200 px-4 outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-deep)] disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
