/**
 * Agent Flow - Show 12 agents with animated connections
 */

import React from 'react';
import { motion } from 'framer-motion';

const AgentFlow = () => {
  const agents = [
    { name: 'Context Understanding', emoji: '📖', color: 'from-blue-500 to-cyan-500' },
    { name: 'Goal Translation', emoji: '🎯', color: 'from-purple-500 to-pink-500' },
    { name: 'Feature Selection', emoji: '⚙️', color: 'from-green-500 to-emerald-500' },
    { name: 'Data Preprocessing', emoji: '🔧', color: 'from-orange-500 to-red-500' },
    { name: 'Segmentation', emoji: '🎨', color: 'from-indigo-500 to-blue-500' },
    { name: 'Evaluation', emoji: '📊', color: 'from-pink-500 to-rose-500' },
    { name: 'Anomaly Detection', emoji: '🚨', color: 'from-red-500 to-orange-500' },
    { name: 'Insights', emoji: '💡', color: 'from-yellow-500 to-orange-500' },
    { name: 'Strategy', emoji: '🗺️', color: 'from-teal-500 to-green-500' },
    { name: 'Simulation', emoji: '🎮', color: 'from-violet-500 to-purple-500' },
    { name: 'Prediction', emoji: '🔮', color: 'from-cyan-500 to-blue-500' },
    { name: 'Orchestrator', emoji: '⚡', color: 'from-gray-400 to-gray-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-24 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={cardVariants}
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            12 AI Agents Working Together
          </h2>
          <p className="text-xl text-gray-400">
            Each agent specializes in one critical task, orchestrated seamlessly
          </p>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.08,
                translateY: -10,
              }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${agent.color} p-0.5 rounded-2xl transition-all duration-300`}>
                <div className="bg-slate-900 rounded-2xl p-6 h-full flex flex-col items-center justify-center cursor-pointer">
                  <motion.div
                    className="text-5xl mb-3"
                    whileHover={{ rotate: 10, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {agent.emoji}
                  </motion.div>
                  <p className="text-center text-sm font-semibold text-gray-200 group-hover:text-white transition">
                    {agent.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Data Flow Illustration */}
        <motion.div
          className="mt-20 text-center"
          variants={cardVariants}
        >
          <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <span>📥 Data Input</span>
              <span className="text-2xl">→</span>
              <span>🤖 Multi-Agent Pipeline</span>
              <span className="text-2xl">→</span>
              <span>📈 Insights Generated</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AgentFlow;
