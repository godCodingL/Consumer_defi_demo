import React, { useState } from 'react';
import { LogEntry } from '../types';

interface DecisionLogProps {
  logs: LogEntry[];
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'journal'>('all');
  
  const filteredLogs = filter === 'journal' ? logs.filter(l => l.isJournal) : logs;

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/10">
      <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Pilot’s Flight Journal</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Autonomous activity history and human-friendly notes.</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-white/20 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilter('journal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'journal' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            Journal Only
          </button>
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto p-6 space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-24 text-slate-500 italic">
            <div className="mb-4 opacity-20">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Waiting for AI Pilot engagement to write the first entry...
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className={`p-4 rounded-2xl border transition-all animate-in slide-in-from-left-2 fade-in duration-300 ${
                log.isJournal 
                ? 'bg-blue-600/5 border-blue-600/20 italic' 
                : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  log.isJournal ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {log.isJournal ? 'Pilot Note' : log.type}
                </span>
                <span className="text-[10px] text-slate-600 mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
              </div>
              <p className={`text-sm ${log.isJournal ? 'text-blue-200' : 'text-slate-300'} leading-relaxed`}>
                {log.message}
              </p>
              {log.txHash && (
                <div className="mt-2 text-[10px] text-blue-500 mono truncate">
                  TX: {log.txHash}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};