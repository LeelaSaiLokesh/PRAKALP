/**
 * Simulation Panel - Modern inputs with animated results
 */

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SimulationPanel = ({ context, clusterMap }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [adjustments, setAdjustments] = useState({});

  const features = context?.features || [];

  const handleFeatureChange = (feature, value) => {
    setAdjustments(prev => ({
      ...prev,
      [feature]: parseFloat(value) || 0,
    }));
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/simulate', {
        adjustments,
        context,
      });
      
      // Handle response from backend
      const data = response.data;
      if (data.status === 'success' && data.simulation_result) {
        setResults(data.simulation_result);
      } else {
        setResults({ error: data.error || 'Simulation failed' });
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setResults({ error: 'Simulation failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-3xl p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        🔮 What-If Simulation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Adjust Features</h3>
          
          {features.length > 0 ? (
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {feature}
                  </label>
                  <motion.input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={adjustments[feature] || 0}
                    onChange={(e) => handleFeatureChange(feature, e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">-50%</span>
                    <motion.span
                      key={adjustments[feature]}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-bold text-purple-400"
                    >
                      {adjustments[feature] || 0}%
                    </motion.span>
                    <span className="text-xs text-gray-500">+50%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No features available. Run analysis first.</p>
          )}

          {/* Simulate Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSimulate}
            disabled={isLoading || features.length === 0}
            className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <motion.div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Simulating...
              </motion.div>
            ) : (
              'Run Simulation'
            )}
          </motion.button>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Expected Impact</h3>
          
          {results ? (
            <motion.div
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {results.error ? (
                <div className="p-6 bg-red-500/10 border border-red-400/20 rounded-xl">
                  <p className="text-red-400">{results.error}</p>
                </div>
              ) : (
                <>
                  {/* Cluster Distribution */}
                  <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                    <p className="text-sm text-gray-400 mb-3">Cluster Distribution</p>
                    <div className="space-y-2">
                      {results.cluster_distribution && Object.entries(results.cluster_distribution).map(([cluster, count], idx) => (
                        <motion.div
                          key={idx}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex justify-between items-center"
                        >
                          <span className="text-purple-400">{cluster}:</span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                            className="font-bold text-white"
                          >
                            {count}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  {results.impact_summary && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl"
                    >
                      <p className="text-sm text-gray-400 mb-3">Impact Summary</p>
                      <p className="text-white font-semibold">{results.impact_summary}</p>
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  {results.recommendations && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl"
                    >
                      <p className="text-sm text-gray-400 mb-3">Recommendations</p>
                      <p className="text-white leading-relaxed">{results.recommendations}</p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <p className="text-lg">🎯</p>
                <p className="mt-2">Adjust features and run simulation</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SimulationPanel;
