import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

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

const CATEGORIES = ["All", "Unread", "Message", "Research Problem", "Work Update", "Replacement", "AI Handover"];

export default function NotificationCenter({ onNavigateTab }) {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchNotifs = () => {
    api.getNotifications(activeCategory).then(data => {
      if (data) {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    });
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    api.markAllNotificationsRead();
    addToast({ title: 'Notifications Cleared ✓', message: 'All notifications marked as read.' });
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
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <div>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: '"Times New Roman", Times, serif' }}>
            <Bell className="w-4 h-4 text-indigo-500" />
            Notification Center & Alert Audit
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Targeted notifications for private messages, research problems, work logs, replacement candidates & AI handovers
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="btn btn-secondary btn-sm"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> Mark All as Read
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-pill${activeCategory === cat ? ' active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="panel p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            <p>No notifications found in this category.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className="panel p-4 transition-all cursor-pointer hover:border-indigo-500/50 shadow-xs"
              style={{
                borderColor: !item.is_read ? 'var(--accent-border)' : 'var(--bg-border)',
                background: !item.is_read ? 'var(--accent-subtle)' : 'var(--bg-surface)'
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`status-dot ${!item.is_read ? 'status-dot-green' : ''}`} />
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: '"Times New Roman", Times, serif' }}>{item.title}</span>
                    <span className="badge badge-gray font-mono text-[10px]">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed pl-3.5" style={{ color: 'var(--text-secondary)' }}>{item.message}</p>

                  <div className="flex items-center gap-2 text-[10px] font-mono pl-3.5 pt-1" style={{ color: 'var(--text-muted)' }}>
                    <span>{item.related_project_id || 'PW-1042'}</span>
                    <span>·</span>
                    <span>{item.created_at}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkRead(item.id);
                    if (item.category === 'Message' || (item.action_link && item.action_link.startsWith('messages:'))) {
                      const convId = item.action_link ? item.action_link.split(':')[1] : null;
                      onNavigateTab && onNavigateTab('messages', convId);
                    } else if (item.category === 'Replacement' || item.category === 'AI Handover') {
                      onNavigateTab && onNavigateTab('handover');
                    } else if (item.category === 'Work Update') {
                      onNavigateTab && onNavigateTab('updates');
                    } else {
                      onNavigateTab && onNavigateTab('discover');
                    }
                  }}
                  className="btn btn-ghost btn-sm text-xs font-medium shrink-0 flex items-center gap-1 text-indigo-500 hover:text-indigo-600"
                >
                  View <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
