import React, { useState } from 'react';
import { LayoutTemplate, X } from 'lucide-react';
import { DESIGNS, DesignId } from '../types';

interface Props {
  current: DesignId;
  onChange: (id: DesignId) => void;
}

/**
 * デザイン案の切替UI（比較・検討用）。
 * 採用案が決まったらこのコンポーネントと App.tsx の切替ロジックを削除してください。
 */
const DesignSwitcher: React.FC<Props> = ({ current, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-[100] font-sans">
      {open && (
        <div className="mb-3 w-72 rounded-2xl bg-zinc-900/95 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur p-3">
          <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-white/10">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Design Proposals</span>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white" aria-label="close"><X size={14} /></button>
          </div>
          <div className="flex flex-col gap-1">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => { onChange(d.id); setOpen(false); }}
                className={`text-left rounded-xl px-3 py-2 transition-colors ${current === d.id ? 'bg-white text-zinc-900' : 'hover:bg-white/10'}`}
              >
                <div className="text-sm font-semibold">{d.name}</div>
                <div className={`text-[11px] ${current === d.id ? 'text-zinc-600' : 'text-zinc-400'}`}>{d.description} · ref: {d.reference}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-zinc-900/90 text-white text-xs font-medium pl-3 pr-4 py-2.5 shadow-lg ring-1 ring-white/15 backdrop-blur hover:scale-105 transition-transform"
        aria-label="Switch design proposal"
      >
        <LayoutTemplate size={14} />
        {DESIGNS.find((d) => d.id === current)?.name}
      </button>
    </div>
  );
};

export default DesignSwitcher;
