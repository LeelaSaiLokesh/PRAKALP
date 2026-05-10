/**
 * Premium App Component - Apple-style design with Framer Motion
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Upload from './components/Upload';
import PremiumDashboard from './components/PremiumDashboard';
import PredictionPanel from './components/PredictionPanel';
import SimulationPanel from './components/SimulationPanel';
import LogsPanel from './components/LogsPanel';
import HeroSection from './components/HeroSection';
import AgentFlow from './components/AgentFlow';
import FeaturesShowcase from './components/FeaturesShowcase';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    console.log('Analysis started...');
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setLogs(results.logs || []);
    setIsAnalyzing(false);
    setCurrentPage('dashboard');
  };

  const navItems = [
    { id: 'home', label: '🏠 Home', show: true },
    { id: 'upload', label: '📁 Upload', show: true },
    { id: 'showcase', label: '🎯 Showcase', show: true },
    { id: 'dashboard', label: '📊 Dashboard', show: analysisResults !== null },
    { id: 'prediction', label: '🎯 Predict', show: analysisResults !== null },
    { id: 'simulation', label: '🔮 Simulate', show: analysisResults !== null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Premium Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 bg-slate-950/80 border-b border-blue-500/10 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage('home')}
              className="cursor-pointer"
            >
              <div className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ Multi-Agent AI
              </div>
            </motion.div>

            {/* Nav Items */}
            <div className="flex gap-2">
              {navItems
                .filter((item) => item.show)
                .map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Page Content */}
      <main className="pt-20">
        {/* Home Page */}
        {currentPage === 'home' && (
          <>
            <HeroSection onGetStarted={() => setCurrentPage('upload')} />
            <AgentFlow />
          </>
        )}

        {/* Upload Page */}
        {currentPage === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Upload
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </motion.div>
        )}

        {/* Dashboard Page */}
        {currentPage === 'dashboard' && analysisResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-8">
              <PremiumDashboard results={analysisResults} logs={logs} />
              <div className="max-w-7xl mx-auto px-6">
                <LogsPanel logs={logs} isLoading={isAnalyzing} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Prediction Page */}
        {currentPage === 'prediction' && analysisResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-6 py-20"
          >
            <PredictionPanel
              context={analysisResults.results}
              features={analysisResults.results?.features}
            />
          </motion.div>
        )}

        {/* Simulation Page */}
        {currentPage === 'simulation' && analysisResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-6 py-20"
          >
            <SimulationPanel
              context={analysisResults.results}
              clusterMap={analysisResults.results?.clusters}
            />
          </motion.div>
        )}

        {/* Features Showcase */}
        {currentPage === 'showcase' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {analysisResults ? (
              <FeaturesShowcase results={analysisResults} logs={logs} />
            ) : (
              <FeaturesShowcase />
            )}
          </motion.div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-blue-500/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-2">Product</h3>
              <p className="text-gray-400 text-sm">
                Goal-Driven Autonomous Multi-Agent Intelligence System
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Technology</h3>
              <p className="text-gray-400 text-sm">
                Python, FastAPI, React, LangChain, LLM
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Features</h3>
              <p className="text-gray-400 text-sm">
                12 AI Agents | Clustering | Anomaly Detection | Prediction
              </p>
            </div>
          </div>
          <div className="border-t border-blue-500/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Multi-Agent AI System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
