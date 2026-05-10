/**
 * Prediction Panel - Real-time cluster assignment
 */

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const PredictionPanel = ({ context, features }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({});

  const contextFeatures = context?.features || features || [];

  const handleInputChange = (feature, value) => {
    setFormData(prev => ({
      ...prev,
      [feature]: parseFloat(value) || 0,
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/predict', {
        features: formData,
        context,
      });
      
      // Handle response from backend
      const data = response.data;
      if (data.status === 'success') {
        setPrediction({
          predicted_cluster: data.cluster,
          cluster_name: data.cluster_name || `Cluster ${data.cluster}`,
          confidence: data.confidence,
          distance_to_center: data.distance_to_center,
          cluster_characteristics: data.explanation,
          recommendations: `This belongs to ${data.cluster_name || `Cluster ${data.cluster}`}, representing ${data.cluster_percentage.toFixed(1)}% of population.`,
        });
      } else {
        setPrediction({ error: data.error || 'Prediction failed' });
      }
    } catch (error) {
      console.error('Prediction failed:', error);
      setPrediction({ error: 'Prediction failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const clusterColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ];

  const getClusterColor = (clusterId) => {
    return clusterColors[clusterId % clusterColors.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-400/20 rounded-3xl p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        🎯 Predict Customer Cluster
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Customer Profile</h3>
          
          {contextFeatures.length > 0 ? (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contextFeatures.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {feature}
                  </label>
                  <motion.input
                    type="number"
                    placeholder={`Enter ${feature.toLowerCase()}`}
                    value={formData[feature] || ''}
                    onChange={(e) => handleInputChange(feature, e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-teal-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-all"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-400">No features available</p>
          )}

          {/* Predict Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePredict}
            disabled={isLoading || contextFeatures.length === 0 || Object.keys(formData).length === 0}
            className="w-full mt-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <motion.div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Predicting...
              </motion.div>
            ) : (
              'Predict Cluster'
            )}
          </motion.button>
        </motion.div>

        {/* Prediction Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Prediction Result</h3>
          
          {prediction ? (
            <motion.div
              key={prediction.predicted_cluster}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {prediction.error ? (
                <div className="p-6 bg-red-500/10 border border-red-400/20 rounded-xl">
                  <p className="text-red-400">{prediction.error}</p>
                </div>
              ) : (
                <>
                  {/* Cluster Card */}
                  <motion.div
                    whileHover={{ translateY: -5 }}
                    className={`p-8 bg-gradient-to-br ${getClusterColor(
                      prediction.predicted_cluster
                    )} bg-opacity-20 border border-white border-opacity-20 rounded-2xl text-center`}
                  >
                    <p className="text-gray-300 text-sm mb-2">Predicted Cluster</p>
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="text-4xl font-black text-white mb-2"
                    >
                      {prediction.cluster_name || `Cluster ${prediction.predicted_cluster}`}
                    </motion.p>
                    <p className="text-gray-300 text-sm">
                      {prediction.cluster_name || `Cluster ${prediction.predicted_cluster}`}
                    </p>
                  </motion.div>

                  {/* Confidence */}
                  {prediction.confidence !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-gray-300 font-semibold">Confidence</p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-white text-xl font-bold"
                        >
                          {(prediction.confidence * 100).toFixed(1)}%
                        </motion.p>
                      </div>
                      <motion.div
                        className="h-2 bg-slate-700 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence * 100}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Cluster Characteristics */}
                  {prediction.cluster_characteristics && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl"
                    >
                      <p className="text-sm text-gray-400 mb-3 font-semibold">Characteristics</p>
                      <p className="text-white leading-relaxed">
                        {prediction.cluster_characteristics}
                      </p>
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  {prediction.recommendations && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-400/20 rounded-xl"
                    >
                      <p className="text-sm text-gray-400 mb-3 font-semibold">Recommendations</p>
                      <p className="text-white leading-relaxed">{prediction.recommendations}</p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-2xl">👤</p>
                <p className="mt-2">Enter customer data to predict cluster</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PredictionPanel;
