/**
 * Dashboard Component - Display analysis results
 */

import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ results, logs }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!results) {
    return <div className="p-6 text-center text-gray-500">No results available</div>;
  }

  const context = results.results || {};
  
  // Debug logging
  console.log('Dashboard received results:', results);
  console.log('Context data:', context);
  console.log('Clusters object:', context.clusters);
  const domain = context.domain || 'Unknown';
  const features = context.features || [];
  const insights = context.insights || 'No insights available';
  const strategy = context.strategy || 'No strategy available';
  const score = context.score || 0;
  const anomalyCount = context.anomalies?.count || 0;
  
  // Get actual cluster data
  const clusters = context.clusters || {};
  
  // Extract and sort cluster keys
  const sortedKeys = Object.keys(clusters)
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  // Build labels and sizes from sorted keys
  const clusterLabels = sortedKeys.map(k => `Cluster ${k}`);
  const clusterSizes = sortedKeys.map(key => {
    const clusterData = clusters[key];
    return Array.isArray(clusterData) ? clusterData.length : (typeof clusterData === 'object' ? Object.keys(clusterData).length : 0);
  });
  
  const totalSize = clusterSizes.reduce((a, b) => a + b, 0);

  // Prepare chart data for clusters with actual data
  const clusterData = {
    labels: clusterLabels.length > 0 ? clusterLabels : ['No Data'],
    datasets: [
      {
        label: 'Cluster Distribution',
        data: clusterSizes,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ].slice(0, clusterSizes.length),
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">
        📊 Analysis Dashboard
      </h1>
      <p className="text-gray-600 mb-8">Comprehensive analysis results and insights</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['overview', 'insights', 'strategy', 'logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="text-sm text-gray-600">Domain</div>
              <div className="text-2xl font-bold text-blue-600">{domain}</div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="text-sm text-gray-600">Silhouette Score</div>
              <div className="text-2xl font-bold text-green-600">
                {(score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <div className="text-sm text-gray-600">Features Used</div>
              <div className="text-2xl font-bold text-purple-600">
                {features.length}
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="text-sm text-gray-600">Anomalies</div>
              <div className="text-2xl font-bold text-red-600">{anomalyCount}</div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ✨ Selected Features
            </h2>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📈 Cluster Distribution
              </h2>
              <div className="w-full h-80">
                <Pie data={clusterData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📊 Cluster Sizes
              </h2>
              <div className="space-y-2">
                {clusterLabels.map((cluster, idx) => {
                  const percentage = totalSize > 0 ? ((clusterSizes[idx] / totalSize) * 100).toFixed(1) : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cluster}</span>
                        <span className="font-semibold">
                          {clusterSizes[idx]} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">💡 Key Insights</h2>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded">
              {typeof insights === 'string'
                ? insights
                : JSON.stringify(insights, null, 2)}
            </div>
          </div>
        </div>
      )}

      {/* Strategy Tab */}
      {activeTab === 'strategy' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🎯 Strategic Recommendations
          </h2>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded">
              {typeof strategy === 'string'
                ? strategy
                : JSON.stringify(strategy, null, 2)}
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📝 Agent Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs && logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div>No logs available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
