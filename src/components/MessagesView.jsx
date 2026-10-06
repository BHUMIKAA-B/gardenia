import React, { useState, useEffect } from 'react';
import { Search, Send, Paperclip, Lock, CheckCheck, FileText } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState("CONV-101");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachment, setAttachment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.getConversations().then(data => {
      if (data && data.length > 0) setConversations(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedConvId) return;
    api.getConversationMessages(selectedConvId).then(data => {
      if (data && data.length > 0) setMessages(data);
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
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.project_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            Private Research Messages
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Role & project-scoped confidential team communications
          </p>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-h-[520px] rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {/* Left: Conversation List */}
        <div className="border-r border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-3 transition-all ${
                    isSelected ? 'bg-zinc-800/80 border-l-2 border-indigo-500' : 'hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 truncate">{conv.project_id}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{conv.last_message_time}</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 truncate">{conv.title}</div>
                  <div className="text-[11px] text-zinc-400 truncate mt-1">{conv.last_message}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="md:col-span-2 flex flex-col justify-between bg-zinc-950">
          {/* Chat Header */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-100">{activeConv.title}</div>
              <div className="text-[10px] text-zinc-400 font-mono">{activeConv.project_title}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Encrypted & Scoped
            </span>
          </div>

          {/* Messages list */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {messages.map(m => {
              const isSelf = m.sender_id === (user?.id || 2) || m.sender_name === "Bhumikaa B";
              return (
                <div key={m.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1 font-mono">
                    <span className="font-semibold text-zinc-300">{m.sender_name}</span>
                    <span>({m.sender_role})</span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className={`p-3 rounded-xl max-w-md text-xs leading-relaxed ${
                    isSelf
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}>
                    <p>{m.text}</p>
                    {m.attachment_ref && (
                      <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 font-mono text-[11px]">
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
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-900 space-y-2">
            {attachment && (
              <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 bg-zinc-950 rounded border border-zinc-800 text-indigo-400">
                <span>Attachment: {attachment}</span>
                <button type="button" onClick={() => setAttachment('')} className="text-zinc-500 hover:text-zinc-300">×</button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachment('Dataset Validation Report #EV-1024')}
                title="Attach Evidence Artifact"
                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 bg-zinc-950"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={newMessageText}
                onChange={e => setNewMessageText(e.target.value)}
                placeholder="Type confidential research message…"
                className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
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
