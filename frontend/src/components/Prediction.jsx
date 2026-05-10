/**
 * Prediction Component - Predict cluster for new customer
 */

import React, { useState } from 'react';
import { predictCluster } from '../services/api';

const Prediction = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    age: '',
    annual_income: '',
    purchase_frequency: '',
    avg_order_value: '',
    product_category: '',
    account_age_months: '',
    reviews_count: '',
    return_rate: '',
    email_engagement: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert string inputs to appropriate types
      const data = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data[key] = isNaN(formData[key]) ? formData[key] : parseFloat(formData[key]);
        }
      });

      const predictionResult = await predictCluster(data);
      setResult(predictionResult);
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">🔮 Prediction</h1>
      <p className="text-gray-600 mb-8">Predict cluster assignment for new customers</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type={['age', 'annual_income', 'purchase_frequency', 'avg_order_value', 'account_age_months', 'reviews_count', 'return_rate'].includes(key) ? 'number' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  step={key === 'return_rate' || key === 'avg_order_value' ? '0.01' : '1'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Predicting...' : '🔮 Predict Cluster'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Prediction Result</h2>

          {result ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="text-sm text-gray-600">Assigned Cluster</div>
                <div className="text-4xl font-bold text-blue-600">
                  {result.cluster}
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="text-sm text-gray-600">Confidence</div>
                <div className="text-2xl font-bold text-green-600">
                  {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="text-sm text-gray-600">Cluster Size</div>
                <div className="text-xl font-bold text-purple-600">
                  {result.cluster_size} customers ({result.cluster_percentage.toFixed(1)}%)
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
                <div className="text-sm text-gray-600">Explanation</div>
                <div className="text-gray-700 mt-2">{result.explanation}</div>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  setFormData(
                    Object.keys(formData).reduce((acc, key) => {
                      acc[key] = '';
                      return acc;
                    }, {})
                  );
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                🔄 Reset
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p>Fill in customer data and click "Predict Cluster" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
