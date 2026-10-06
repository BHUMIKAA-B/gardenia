import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ActivityContext = createContext();

/* Seed events from actual app data */
const SEED_EVENTS = [
  { id: 1,  type: 'validation', icon: '✅', actor: 'Dr. Meera Rao',    action: "validated Bhumikaa's Data Cleaning Pipeline",           project: 'PW-1042', ts: Date.now() - 12000,  color: 'emerald' },
  { id: 2,  type: 'upload',     icon: '📊', actor: 'Bhumikaa B',       action: 'uploaded Dataset Validation Report (12,400 rows)',        project: 'PW-1042', ts: Date.now() - 38000,  color: 'blue'    },
  { id: 3,  type: 'ai',         icon: '🤖', actor: 'Literature Scout', action: 'generated research summary for water quality papers',     project: 'PW-1042', ts: Date.now() - 62000,  color: 'purple'  },
  { id: 4,  type: 'milestone',  icon: '🏁', actor: 'System',           action: 'Milestone 1 reached 100% — escrow release pending',      project: 'PW-1042', ts: Date.now() - 120000, color: 'amber'   },
  { id: 5,  type: 'security',   icon: '🚨', actor: 'Scope Sentinel',   action: 'AI Agent access to PW-1088 BLOCKED & logged',            project: 'PW-1088', ts: Date.now() - 183000, color: 'red'     },
  { id: 6,  type: 'charter',    icon: '🔒', actor: 'All Participants', action: 'Project Charter locked — all 4 parties signed',           project: 'PW-1042', ts: Date.now() - 240000, color: 'violet'  },
  { id: 7,  type: 'reward',     icon: '💰', actor: 'AquaNova Escrow',  action: '₹40,000 Milestone 1 payout released to contributors',    project: 'PW-1042', ts: Date.now() - 300000, color: 'gold'    },
  { id: 8,  type: 'upload',     icon: '🧠', actor: 'Aarav Patel',      action: 'submitted LSTM Model commit #b40c991',                   project: 'PW-1042', ts: Date.now() - 360000, color: 'pink'    },
];

function relativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export function ActivityProvider({ children }) {
  const [events, setEvents] = useState(SEED_EVENTS);
  const [tick,   setTick]   = useState(0); // force re-render for live times

  // Refresh relative timestamps every 30s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  /** Push a new application event — called by components when actions happen */
  const pushEvent = useCallback((event) => {
    setEvents(prev => [{
      id:    Date.now(),
      ts:    Date.now(),
      color: 'indigo',
      ...event,
    }, ...prev].slice(0, 20)); // keep latest 20
  }, []);

  const eventsWithTime = events.map(e => ({ ...e, timeAgo: relativeTime(e.ts) }));

  return (
    <ActivityContext.Provider value={{ events: eventsWithTime, pushEvent }}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => useContext(ActivityContext);
