import React from 'react';
import {
  Home, Search, FolderOpen, MessageSquare, Calendar, GitGraph, Bot,
  Award, Cpu, Bell, LayoutDashboard, Scale, Coins, UserCheck,
  Presentation, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  {
    section: 'Workspace',
    items: [
      { id: 'home',         label: 'Home',            icon: Home           },
      { id: 'discover',     label: 'Research',        icon: Search         },
      { id: 'workspace',    label: 'My Project',      icon: FolderOpen     },
      { id: 'messages',     label: 'Messages',        icon: MessageSquare  },
      { id: 'updates',      label: 'Work Updates',    icon: Calendar       },
      { id: 'proof',        label: 'Proof Graph',     icon: GitGraph       },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { id: 'ai',          label: 'AI Control',       icon: Bot            },
      { id: 'passport',    label: 'Research Passport',icon: Award          },
      { id: 'handover',    label: 'AI Handover',      icon: Cpu            },
    ],
  },
  {
    section: 'Governance',
    items: [
      { id: 'notifications',label: 'Notifications',  icon: Bell           },
      { id: 'sponsor',      label: 'Sponsor View',    icon: LayoutDashboard},
      { id: 'replacement',  label: 'Replacement',    icon: UserCheck      },
      { id: 'dispute',      label: 'Disputes',        icon: Scale          },
      { id: 'reward',       label: 'Rewards',         icon: Coins          },
    ],
  },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenPitchMode, unreadMessageCount = 0, unreadNotifCount = 0 }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="nav-logo" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        Ver<span style={{ color: 'var(--accent)' }}>ixa</span>
      </div>

      {/* Nav groups */}
      {NAV.map(group => (
        <div key={group.section} className="nav-section">
          <div className="nav-section-label">{group.section}</div>
          {group.items.map(item => {
            const Icon = item.icon;
            const badgeVal = item.id === 'messages' ? unreadMessageCount : item.id === 'notifications' ? unreadNotifCount : 0;
            return (
              <div
                key={item.id}
                className={`nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon />
                <span className="flex-1">{item.label}</span>
                {badgeVal > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                    {badgeVal}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Bottom */}
      <div className="nav-bottom">
        <div
          className="nav-item"
          onClick={onOpenPitchMode}
          style={{ color: 'var(--amber)' }}
        >
          <Presentation style={{ width: 15, height: 15, opacity: 0.8 }} />
          Pitch Mode
        </div>

        {user && (
          <div className="nav-item" style={{ cursor: 'default' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: 'var(--accent-hover)',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {user.name?.[0] || 'U'}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name?.split(' ')[0] || 'User'}
            </span>
          </div>
        )}

        {logout && (
          <div className="nav-item" onClick={logout} style={{ color: 'var(--text-muted)' }}>
            <LogOut style={{ width: 15, height: 15 }} />
            Sign out
          </div>
        )}
      </div>
    </aside>
  );
}
