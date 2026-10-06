import React from 'react';
import { Activity } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

export default function LiveActivityPanel() {
  const { events } = useActivity();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-200">Live Activity Feed</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE
        </div>
      </div>

      {/* Events */}
      <div className="divide-y divide-zinc-800/60 max-h-[360px] overflow-y-auto">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-zinc-800/40 transition-all text-xs">
            <div className="flex-1 min-w-0">
              <div className="text-zinc-300 leading-snug">
                <span className="font-semibold text-zinc-100">{ev.actor}</span>{' '}
                <span className="text-zinc-400">{ev.action}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-zinc-500">
                <span className="text-zinc-400">{ev.project}</span>
                <span>·</span>
                <span>{ev.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
