import React, { useState, useEffect } from 'react';
import { Search, Send, Paperclip, Lock, CheckCheck, FileText } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const INITIAL_CONVERSATIONS = [
  {
    id: "CONV-101",
    project_id: "PW-1042",
    project_title: "AI-Assisted Urban Water Quality Prediction",
    title: "PW-1042: Student ↔ Mentor Discussion",
    last_message: "Great work Bhumikaa! Please review the 7% timestamp inconsistencies in sector B.",
    last_message_time: "10:14 AM",
    unread_count: 1,
    participants: [
      { id: 2, name: "Bhumikaa B", role: "Student" },
      { id: 4, name: "Dr. Meera Rao", role: "Mentor" }
    ]
  },
  {
    id: "CONV-102",
    project_id: "PW-1042",
    project_title: "AI-Assisted Urban Water Quality Prediction",
    title: "PW-1042: Mentor ↔ Expert Sync",
    last_message: "Milestone 1 data validation complete. Moving to prediction model.",
    last_message_time: "Yesterday",
    unread_count: 0,
    participants: [
      { id: 4, name: "Dr. Meera Rao", role: "Mentor" },
      { id: 5, name: "AquaNova Research Director", role: "Sponsor" }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    id: "MSG-101",
    conversation_id: "CONV-101",
    sender_id: 2,
    sender_name: "Bhumikaa B",
    sender_role: "Student",
    text: "Hello Dr. Meera, I have completed validating the 12,400 water telemetry records. Attached the validation report.",
    attachment_ref: "Dataset Validation Report #EV-1024",
    is_read: true,
    timestamp: "10:05 AM"
  },
  {
    id: "MSG-102",
    conversation_id: "CONV-101",
    sender_id: 4,
    sender_name: "Dr. Meera Rao",
    sender_role: "Mentor",
    text: "Great work Bhumikaa! Please review the 7% timestamp inconsistencies in sector B before feature engineering.",
    attachment_ref: null,
    is_read: false,
    timestamp: "10:14 AM"
  }
];

export default function MessagesView() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState("CONV-101");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachment, setAttachment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.getConversations().then(data => {
      if (data && Array.isArray(data) && data.length > 0) setConversations(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedConvId) return;
    api.getConversationMessages(selectedConvId).then(data => {
      if (data && Array.isArray(data) && data.length > 0) setMessages(data);
    });
  }, [selectedConvId]);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      id: `MSG-${Date.now()}`,
      conversation_id: selectedConvId,
      sender_id: user?.id || 2,
      sender_name: user?.name || "Bhumikaa B",
      sender_role: user?.role || "Student",
      text: newMessageText,
      attachment_ref: attachment || null,
      is_read: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessageText("");
    setAttachment("");

    api.sendMessage(selectedConvId, {
      text: newMessageText,
      attachment_ref: attachment || null
    });
  };

  const filteredConversations = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            Private Research Messages
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Role & project-scoped confidential team communications
          </p>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[520px] rounded-xl border overflow-hidden panel">
        {/* Left: Conversation List */}
        <div className="border-r flex flex-col" style={{ borderColor: 'var(--bg-border)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--bg-border)' }}>
            <div className="search-wrap">
              <Search />
              <input
                type="text"
                placeholder="Search conversations…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="divide-y overflow-y-auto flex-1" style={{ borderColor: 'var(--bg-border)' }}>
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className="w-full text-left p-3 transition-all"
                  style={{
                    background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent'
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{conv.project_id}</span>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{conv.last_message_time}</span>
                  </div>
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{conv.title}</div>
                  <div className="text-[11px] truncate mt-1" style={{ color: 'var(--text-secondary)' }}>{conv.last_message}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="md:col-span-2 flex flex-col justify-between" style={{ background: 'var(--bg-elevated)' }}>
          {/* Chat Header */}
          <div className="p-3 border-b flex items-center justify-between" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{activeConv.title}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{activeConv.project_title}</div>
            </div>
            <span className="badge badge-green">
              Encrypted & Scoped
            </span>
          </div>

          {/* Messages list */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {messages.map(m => {
              const isSelf = m.sender_id === (user?.id || 2) || m.sender_name === "Bhumikaa B";
              return (
                <div key={m.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.sender_name}</span>
                    <span>({m.sender_role})</span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className={`p-3 rounded-xl max-w-md text-xs leading-relaxed ${
                    isSelf
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'panel rounded-bl-none text-secondary'
                  }`}
                  style={!isSelf ? { background: 'var(--bg-surface)', color: 'var(--text-primary)' } : {}}
                  >
                    <p>{m.text}</p>
                    {m.attachment_ref && (
                      <div className="mt-2 pt-2 border-t border-indigo-400/30 flex items-center gap-1.5 font-mono text-[11px]">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="underline">{m.attachment_ref}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t space-y-2" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            {attachment && (
              <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded border text-indigo-500" style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)' }}>
                <span>Attachment: {attachment}</span>
                <button type="button" onClick={() => setAttachment('')} style={{ color: 'var(--text-muted)' }}>×</button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachment('Dataset Validation Report #EV-1024')}
                title="Attach Evidence Artifact"
                className="btn btn-secondary btn-sm"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={newMessageText}
                onChange={e => setNewMessageText(e.target.value)}
                placeholder="Type confidential research message…"
                className="input"
              />
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
