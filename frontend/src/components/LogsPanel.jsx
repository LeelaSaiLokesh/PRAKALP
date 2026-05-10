/**
 * Logs Panel - Typing animation for execution logs
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogsPanel = ({ logs, isLoading }) => {
  const [displayedLogs, setDisplayedLogs] = useState([]);

  useEffect(() => {
    if (!logs || logs.length === 0) {
      setDisplayedLogs([]);
      return;
    }

    // Animate logs one by one
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setDisplayedLogs(prev => [...prev, log]);
      }, idx * 100);
    });
  }, [logs]);

  const getLogColor = (log) => {
    if (log.includes('Error') || log.includes('error')) return 'text-red-400';
    if (log.includes('Success') || log.includes('completed')) return 'text-green-400';
    if (log.includes('Warning') || log.includes('warning')) return 'text-yellow-400';
    return 'text-blue-300';
  };

  const getLogIcon = (log) => {
    if (log.includes('Error') || log.includes('error')) return '❌';
    if (log.includes('Success') || log.includes('completed')) return '✅';
    if (log.includes('Warning') || log.includes('warning')) return '⚠️';
    return '📝';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl min-h-96"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          📋 Execution Logs
        </h3>
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"
          />
        )}
      </div>

      {/* Logs Container */}
      <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
        {displayedLogs.length > 0 ? (
          displayedLogs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`py-2 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 ${getLogColor(log)} flex items-start gap-3`}
            >
              <span className="text-lg flex-shrink-0 pt-0.5">{getLogIcon(log)}</span>
              <span className="flex-grow break-words">{log}</span>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500">
            {isLoading ? (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-3xl mb-2"
                >
                  ⚙️
                </motion.div>
                <p>Analysis in progress...</p>
              </div>
            ) : (
              <p>No logs yet. Run an analysis to see logs.</p>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      {displayedLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-slate-700/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Logs: {displayedLogs.length}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDisplayedLogs([])}
              className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-lg font-semibold text-sm transition-all"
            >
              Clear
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LogsPanel;
