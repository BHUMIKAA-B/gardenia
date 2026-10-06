import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Lock, FileText, CheckCheck, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MessagesView({ selectedConversationId, onSelectConversation }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(selectedConversationId || null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachment, setAttachment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Synchronize prop updates if parent component passes a selectedConversationId
  useEffect(() => {
    if (selectedConversationId) {
      setSelectedConvId(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Fetch conversation list from backend with polling
  const fetchConversations = async () => {
    const data = await api.getConversations();
    if (data && Array.isArray(data)) {
      setConversations(data);
      if (!selectedConvId && data.length > 0) {
        setSelectedConvId(data[0].id);
      }
    }
  };

  // Fetch messages for selected conversation from backend
  const fetchMessages = async (convId) => {
    if (!convId) return;
    const data = await api.getConversationMessages(convId);
    if (data && Array.isArray(data)) {
      setMessages(data);
    }
  };

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchConversations().finally(() => setIsLoading(false));
  }, [user?.id]);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      if (onSelectConversation) {
        onSelectConversation(selectedConvId);
      }
    }
  }, [selectedConvId]);

  // Real-time polling interval (every 3 seconds) for cross-session message delivery
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedConvId) {
        fetchMessages(selectedConvId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0] || {
    id: "NEW",
    title: "No Conversation Selected",
    project_title: "Please select a conversation",
    project_id: "",
    participants: []
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || isSending) return;

    const textToSend = newMessageText.trim();
    const attachToSend = attachment.trim() || null;

    setNewMessageText("");
    setAttachment("");
    setIsSending(true);

    try {
      const res = await api.sendMessage(selectedConvId, {
        text: textToSend,
        attachment_ref: attachToSend
      });

      if (res && res.id) {
        setMessages(prev => [...prev, res]);
        fetchConversations();
      } else {
        addToast("Message could not be saved to backend database.", "error");
      }
    } catch (err) {
      addToast("Failed to send message: network or backend error.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.participants?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <div>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: '"Times New Roman", Times, serif' }}>
            <Lock className="w-4 h-4 text-indigo-500" />
            Private Research Communications & Audit Chat
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Role & project-scoped confidential team chat backed by database proof logging
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Real-Time Database Sync</span>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[560px] rounded-xl border overflow-hidden panel shadow-lg">
        {/* Left: Conversation List */}
        <div className="border-r flex flex-col" style={{ borderColor: 'var(--bg-border)', background: 'var(--bg-surface)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--bg-border)' }}>
            <div className="search-wrap">
              <Search />
              <input
                type="text"
                placeholder="Search conversations or participants…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="divide-y overflow-y-auto flex-1 max-h-[480px]" style={{ borderColor: 'var(--bg-border)' }}>
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.id === selectedConvId;
                const hasUnread = conv.unread_count > 0 && !isSelected;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className="w-full text-left p-3.5 transition-all relative hover:opacity-95"
                    style={{
                      background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--accent)' : '4px solid transparent'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--bg-border)', color: 'var(--accent)' }}>
                        {conv.project_id || 'PW-1042'}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        {conv.last_message_time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)', fontFamily: '"Times New Roman", Times, serif' }}>
                        {conv.title}
                      </div>
                      {hasUnread && (
                        <span className="shrink-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono shadow-sm">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] truncate mt-1.5" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {conv.last_message}
                    </div>

                    {conv.participants && conv.participants.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        <UserCheck className="w-3 h-3 text-indigo-400" />
                        <span>{conv.participants.map(p => `${p.name} (${p.role})`).join(' · ')}</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="md:col-span-2 flex flex-col justify-between" style={{ background: 'var(--bg-elevated)' }}>
          {/* Chat Header */}
          <div className="p-3.5 border-b flex items-center justify-between shadow-xs" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div>
              <div className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: '"Times New Roman", Times, serif' }}>
                {activeConv.title}
              </div>
              <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {activeConv.project_title} ({activeConv.project_id || 'PW-1042'})
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-green flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3" /> Persistent & Scoped
              </span>
            </div>
          </div>

          {/* Messages list */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 max-h-[440px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Lock className="w-8 h-8 mb-2 opacity-50 text-indigo-400" />
                <p className="font-semibold">No messages in this conversation yet.</p>
                <p className="text-[11px] mt-1">Send a message below to start the discussion.</p>
              </div>
            ) : (
              messages.map(m => {
                const isSelf = user ? (m.sender_id === user.id || m.sender_name === user.name || m.sender_name === user.full_name) : false;
                return (
                  <div key={m.id || Math.random()} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.sender_name}</span>
                      <span>({m.sender_role})</span>
                      <span>·</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-sm transition-all ${
                        isSelf
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'panel rounded-bl-xs text-secondary'
                      }`}
                      style={!isSelf ? { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--bg-border)' } : {}}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      {m.attachment_ref && (
                        <div className={`mt-2.5 pt-2 border-t flex items-center gap-2 font-mono text-[11px] ${
                          isSelf ? 'border-indigo-400/40 text-indigo-100' : 'border-slate-300/30 text-indigo-400'
                        }`}>
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="underline">{m.attachment_ref}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input composer */}
          <form onSubmit={handleSendMessage} className="p-3.5 border-t space-y-2.5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            {attachment && (
              <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-md border text-indigo-500" style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)' }}>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Attachment: {attachment}
                </span>
                <button type="button" onClick={() => setAttachment('')} className="hover:text-red-500 font-bold ml-2">×</button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachment('Dataset Validation Report #EV-1024')}
                title="Attach Evidence Artifact"
                className="btn btn-secondary btn-sm shrink-0"
              >
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline">Attach</span>
              </button>
              <input
                type="text"
                value={newMessageText}
                onChange={e => setNewMessageText(e.target.value)}
                placeholder="Type confidential research message to team…"
                className="input text-xs py-2.5"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !newMessageText.trim()}
                className="btn btn-primary text-xs py-2.5 px-4 shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending…' : 'Send'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
