import React from 'react';

const DataSummary = ({ data }) => {
  // データが存在しない場合
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-gray-500">データがありません</p>
      </div>
    );
  }

  // データの基本情報
  const totalRows = data.data.length;
  const topCountries = data.top_happy_countries || {};
  const bottomCountries = data.bottom_happy_countries || {};
  const factorCorrelations = data.factor_correlations || {};

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">データ概要</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">データ総数</h3>
          <p className="text-2xl font-bold text-blue-600">{totalRows}カ国</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">最も幸福な国</h3>
          <p className="text-2xl font-bold text-green-600">
            {Object.keys(topCountries)[0] || 'データなし'}
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">最も幸福でない国</h3>
          <p className="text-2xl font-bold text-red-600">
            {Object.keys(bottomCountries)[0] || 'データなし'}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">幸福度に最も影響する要因</h3>
          <p className="text-xl font-bold text-purple-600">
            {Object.keys(factorCorrelations)[0] || 'データなし'}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">幸福度上位5カ国</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  国名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  幸福度スコア
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(topCountries).slice(0, 5).map(([country, score], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {score.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">幸福度と各要因の相関</h3>
        <div className="space-y-2">
          {Object.entries(factorCorrelations).map(([factor, correlation], index) => (
            <div key={index} className="flex items-center">
              <div className="w-1/3 text-sm text-gray-600">{factor}</div>
              <div className="w-2/3">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold inline-block text-blue-600">
                      相関係数: {correlation.toFixed(3)}
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ 
                        width: `${Math.abs(correlation) * 100}%`,
                        backgroundColor: correlation > 0 ? '#3b82f6' : '#ef4444'
                      }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSummary; 
