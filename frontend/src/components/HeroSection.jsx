/**
 * Hero Section - Premium landing with cinematic storytelling
 */

import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 overflow-hidden flex items-center justify-center">
      {/* Background animated gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-blue-300">🚀 Autonomous AI System</span>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-white">From Data to</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Decisions Automatically
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Goal-driven autonomous AI system that orchestrates 12 specialized agents to segment data, uncover insights, and drive decisions in seconds.
        </motion.p>

        {/* Feature highlights */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-12">
          {['12 AI Agents', 'Auto Domain Detection', 'Real-time Analysis'].map((feature) => (
            <div key={feature} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm">
              <span className="text-sm text-gray-300">✓ {feature}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          onClick={onGetStarted}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl shadow-blue-500/50"
        >
          Start Analysis
        </motion.button>

        {/* Floating icon animation */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="mt-16"
        >
          <div className="text-6xl">⚡</div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-gray-500 text-sm">Scroll to explore</div>
        <div className="text-2xl">↓</div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
