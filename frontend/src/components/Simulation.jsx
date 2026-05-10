/**
 * Simulation Component - Run what-if scenarios
 */

import React, { useState } from 'react';
import { runSimulation } from '../services/api';

const Simulation = () => {
  const [scenario, setScenario] = useState({
    feature_adjustments: {
      purchase_frequency: 0.1,
    },
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFeatureChange = (feature, value) => {
    setScenario((prev) => ({
      ...prev,
      feature_adjustments: {
        ...prev.feature_adjustments,
        [feature]: parseFloat(value),
      },
    }));
  };

  const handleAddFeature = () => {
    const newFeature = `feature_${Object.keys(scenario.feature_adjustments).length}`;
    setScenario((prev) => ({
      ...prev,
      feature_adjustments: {
        ...prev.feature_adjustments,
        [newFeature]: 0,
      },
    }));
  };

  const handleRemoveFeature = (feature) => {
    setScenario((prev) => {
      const updated = { ...prev.feature_adjustments };
      delete updated[feature];
      return { ...prev, feature_adjustments: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const simulationResult = await runSimulation(scenario);
      setResult(simulationResult);
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">
        🎮 Simulation Platform
      </h1>
      <p className="text-gray-600 mb-8">Run what-if scenarios to explore outcomes</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Builder */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Build Scenario</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Feature Adjustments (%)
              </h3>
              <div className="space-y-3">
                {Object.keys(scenario.feature_adjustments).map((feature) => (
                  <div key={feature} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={feature}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                    <input
                      type="number"
                      value={scenario.feature_adjustments[feature]}
                      onChange={(e) => handleFeatureChange(feature, e.target.value)}
                      placeholder="Adjustment %"
                      step="0.1"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddFeature}
                className="mt-3 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
              >
                + Add Feature
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Running Simulation...' : '▶️ Run Simulation'}
            </button>
          </form>

          {/* Scenario Description */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Adjust feature values by percentage</li>
              <li>Positive values increase the feature</li>
              <li>Negative values decrease the feature</li>
              <li>See how clusters evolve under new conditions</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Results</h2>

          {result ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="text-sm text-gray-600">Original Inertia</div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.original_inertia?.toFixed(2) || 'N/A'}
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="text-sm text-gray-600">Simulated Inertia</div>
                <div className="text-2xl font-bold text-green-600">
                  {result.simulated_inertia?.toFixed(2) || 'N/A'}
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="text-sm text-gray-600">Impact</div>
                <div className="text-2xl font-bold text-purple-600">
                  {result.original_inertia &&
                  result.simulated_inertia
                    ? (
                        ((result.simulated_inertia - result.original_inertia) /
                          result.original_inertia) *
                        100
                      ).toFixed(1)
                    : 'N/A'}
                  %
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 p-4 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Scenario Details:
                </div>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(result.scenario, null, 2)}
                </pre>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                🔄 Run Another Simulation
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🌍</div>
              <p>Define your scenario and run the simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
