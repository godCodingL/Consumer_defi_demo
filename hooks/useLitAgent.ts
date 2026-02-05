import { useState, useEffect, useCallback } from 'react';
import { AgentStatus, LogEntry } from '../types';

export const useLitAgent = (isActive: boolean) => {
  const [decisionLogs, setDecisionLogs] = useState<LogEntry[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    lastCheck: Date.now(),
    performance24h: 4.2,
    currentAllocation: { FLOW: 52, USDC: 48 },
    targetAllocation: { FLOW: 50, USDC: 50 },
    drift: 2
  });

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', isJournal: boolean = false) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type,
      isJournal
    };
    setDecisionLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Initial Journal Entry
    addLog("Pilot Journal Entry: Starting automated flight. Systems clear. Portfolio is healthy.", "info", true);

    const interval = setInterval(() => {
      const actions = [
        "Agent checking Pyth price oracle for FLOW/USD...",
        "Validating user risk policy via Lit Action...",
        "Calculated drift: 1.2%. Within threshold, no action needed.",
        "Agent evaluating market volatility...",
        "Checking Flow Native Scheduler status...",
        "Agent verified Flow Account Abstraction vault safety."
      ];

      const journalEntries = [
        "Just checked the charts—everything looks stable for now.",
        "Market sentiment seems positive. I'm keeping an eye on your FLOW balance.",
        "Flow Network is humming along nicely. No congestion detected.",
        "Your savings are working hard while you sleep.",
        "I’ve confirmed all security certificates for this session."
      ];
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      addLog(randomAction);

      if (Math.random() > 0.7) {
        const entry = journalEntries[Math.floor(Math.random() * journalEntries.length)];
        addLog(`Journal: ${entry}`, "info", true);
      }
      
      // Periodically simulate a rebalance
      if (Math.random() > 0.9) {
        addLog("Drift detected! Executing rebalance swap...", "warning");
        addLog("Journal Update: I decided to rebalance your portfolio to stay on target.", "info", true);
        setTimeout(() => {
          addLog("Rebalance successful: 25 FLOW swapped for 32 USDC.", "success");
          setAgentStatus(prev => ({
            ...prev,
            currentAllocation: { FLOW: 50, USDC: 50 },
            drift: 0,
            lastCheck: Date.now(),
            performance24h: prev.performance24h + 0.1
          }));
        }, 2000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isActive, addLog]);

  return { agentStatus, decisionLogs };
};