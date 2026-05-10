/**
 * Premium Dashboard - Glassmorphism with animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PremiumDashboard = ({ results, logs }) => {
  // activeTab and setActiveTab could be used for tabbed dashboard in future

  if (!results) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">Run an analysis to see results</p>
        </div>
      </section>
    );
  }

  const context = results.results || {};
  const domain = context.domain || 'Unknown';
  const features = context.features || [];
  const insights = context.insights || 'No insights available';
  const strategy = context.strategy || 'No strategy available';
  const score = context.score || 0;
  const anomalyCount = context.anomalies?.count || 0;
  const clusters = context.clusters || {};
  const clusterNames = context.cluster_names || {};

  const sortedKeys = Object.keys(clusters).sort((a, b) => parseInt(a) - parseInt(b));
  const clusterLabels = sortedKeys.map(k => clusterNames[k] || `Cluster ${k}`);
  const clusterSizes = sortedKeys.map(key => {
    const clusterData = clusters[key];
    return Array.isArray(clusterData) ? clusterData.length : 0;
  });

  const clusterData = {
    labels: clusterLabels,
    datasets: [
      {
        label: 'Distribution',
        data: clusterSizes,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black text-white mb-2">Analysis Results</h1>
          <p className="text-gray-400 text-lg">12 AI agents have completed their analysis</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Domain', value: domain, icon: '📍' },
            { label: 'Features', value: features.length, icon: '✨' },
            { label: 'Clusters', value: clusterLabels.length, icon: '🎨' },
            { label: 'Quality', value: `${(score * 100).toFixed(0)}%`, icon: '⭐' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={statVariants}
              whileHover={{ translateY: -5, boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)' }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left: Features & Clusters */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Features */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                ✨ Selected Features
              </h3>
              <div className="flex flex-wrap gap-3">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-900 rounded-full font-semibold text-sm"
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cluster Distribution */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                🎨 Cluster Distribution
              </h3>
              <div className="space-y-4">
                {clusterLabels.map((label, idx) => {
                  const total = clusterSizes.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((clusterSizes[idx] / total) * 100).toFixed(1) : 0;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{label}</span>
                        <span className="text-white font-bold">{clusterSizes[idx]} ({percentage}%)</span>
                      </div>
                      <motion.div
                        className="h-2 bg-gray-700 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.7 + idx * 0.1, duration: 1 }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Chart and Stats */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Pie Chart */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-400/20 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-4">Distribution</h3>
              <div className="h-64">
                <Pie data={clusterData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Anomalies Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-400/20 rounded-3xl p-8 backdrop-blur-xl"
            >
              <p className="text-gray-400 text-sm mb-2">Anomalies Detected</p>
              <p className="text-4xl font-black text-red-400">{anomalyCount}</p>
              <p className="text-gray-500 text-xs mt-2">Outliers found in data</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Insights & Strategy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-3xl p-8 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              💡 Key Insights
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {insights}
            </p>
          </motion.div>

          {/* Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-3xl p-8 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🗺️ Strategic Recommendations
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {strategy}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumDashboard;
