/**
 * Upload Component - Upload CSV and enter goal
 */

import React, { useState } from 'react';
import { analyzeData } from '../services/api';

const Upload = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    if (!goal.trim()) {
      setError('Please enter a business goal');
      return;
    }

    setLoading(true);
    setError(null);
    onAnalysisStart();

    try {
      const result = await analyzeData(file, goal);
      onAnalysisComplete(result);
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">
        🔷 Multi-Agent Analysis
      </h1>
      <p className="text-gray-600 mb-8">
        Upload your dataset and define your business goal
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📁 Upload CSV File
          </label>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer block text-center"
            >
              <div className="text-blue-600 font-semibold">
                Click to select or drag and drop
              </div>
              <div className="text-sm text-gray-500 mt-2">{fileName}</div>
            </label>
          </div>
        </div>

        {/* Goal Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Business Goal
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., 'Segment customers for targeted marketing campaigns'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Describe what you want to achieve with this analysis
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Running Analysis...
            </span>
          ) : (
            '▶️ Start Analysis'
          )}
        </button>

        {/* Sample Data Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Need sample data?</strong> Use the included{' '}
            <code className="bg-gray-200 px-2 py-1 rounded">
              data/ecommerce_data.csv
            </code>{' '}
            to test the system.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Upload;
