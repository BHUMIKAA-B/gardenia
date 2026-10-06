import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Filter, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Research Problem Posted",
    message: "AquaNova Research Labs posted 'AI-Assisted Urban Water Quality Prediction' (92% skill match).",
    category: "Research Problem",
    related_project_id: "PW-1042",
    is_read: false,
    created_at: "2 mins ago"
  },
  {
    id: 2,
    title: "Project Access Granted — AI Handover Ready",
    message: "You are approved as replacement researcher for PW-1042. AI Handover Assistant onboarding brief is ready.",
    category: "AI Handover",
    related_project_id: "PW-1042",
    is_read: false,
    created_at: "1 hour ago"
  },
  {
    id: 3,
    title: "Student Daily Update Submitted",
    message: "Bhumikaa B submitted a daily work update for PW-1042 (12,400 records reviewed).",
    category: "Work Update",
    related_project_id: "PW-1042",
    is_read: true,
    created_at: "3 hours ago"
  },
  {
    id: 4,
    title: "Private Replacement Invitation",
    message: "You have been matched as a candidate for PW-1042 researcher replacement (94% skill match).",
    category: "Replacement",
    related_project_id: "PW-1042",
    is_read: true,
    created_at: "Yesterday"
  }
];

const CATEGORIES = ["All", "Unread", "Research Problem", "Work Update", "Replacement", "AI Handover"];

export default function NotificationCenter({ onNavigateTab }) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.getNotifications(activeCategory).then(data => {
      if (data && data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
      }
    });
  }, [activeCategory]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    api.markAllNotificationsRead();
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    api.markNotificationRead(id);
  };

  const filtered = notifications.filter(n => {
    if (activeCategory === "Unread") return !n.is_read;
    if (activeCategory === "All") return true;
    return n.category === activeCategory;
  });

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-400" />
            Notification Center
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Targeted updates for research problems, work logs, replacement candidates & AI handovers
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Mark All as Read
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeCategory === cat
                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => handleMarkRead(item.id)}
            className={`p-4 rounded-xl border transition-all ${
              !item.is_read
                ? 'bg-zinc-900 border-indigo-500/30 shadow-sm'
                : 'bg-zinc-900/60 border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${!item.is_read ? 'bg-indigo-400' : 'bg-transparent'}`} />
                  <span className="text-xs font-semibold text-zinc-100">{item.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed pl-3.5">{item.message}</p>

                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pl-3.5 pt-1">
                  <span>{item.related_project_id}</span>
                  <span>·</span>
                  <span>{item.created_at}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleMarkRead(item.id);
                  if (item.category === 'Replacement' || item.category === 'AI Handover') {
                    onNavigateTab && onNavigateTab('handover');
                  } else if (item.category === 'Work Update') {
                    onNavigateTab && onNavigateTab('updates');
                  } else {
                    onNavigateTab && onNavigateTab('discover');
                  }
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium shrink-0 flex items-center gap-1"
              >
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
