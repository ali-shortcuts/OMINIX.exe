import React from 'react';
import { ExternalLink, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { CREATOR_LINKS } from './CreatorSupportModal';

interface CreatorSupportSectionProps {
  compact?: boolean;
}

export const CreatorSupportSection: React.FC<CreatorSupportSectionProps> = ({ compact = false }) => {
  return (
    <div className="space-y-5 text-left font-sans" dir="ltr">
      {/* Creator Info Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0 shadow">
            MA
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Powered by Mr Ali</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Creator
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Created and developed by Mr Ali, an independent developer building practical digital tools, automation solutions, and useful projects. Follow the channels above for updates, new projects, and useful content.
            </p>
          </div>
        </div>
      </div>

      {/* Official Links Grid */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Official Channels &amp; Support
        </div>
        <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-2.5`}>
          {CREATOR_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 bg-slate-950/80 border border-slate-800 rounded-xl transition-all duration-150 flex items-center justify-between ${item.hoverBorder}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${item.iconBg}`}>
                  {item.svgIcon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px] font-mono group-hover:text-slate-300">
                    {item.username}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition shrink-0 ml-1.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
