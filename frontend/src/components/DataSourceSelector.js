import React, { useState } from 'react';

const DataSourceSelector = ({ currentUrl, onUrlChange }) => {
  const [url, setUrl] = useState(currentUrl || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultDataSources = [
    {
      name: 'World Happiness Report 2021',
      url: 'https://raw.githubusercontent.com/datahub-project/datahub/main/metadata-ingestion/examples/data_examples/kaggle/world-happiness-report-2021.csv'
    },
    {
      name: 'World Happiness Report 2019',
      url: 'https://raw.githubusercontent.com/datahub-project/datahub/main/metadata-ingestion/examples/data_examples/kaggle/world-happiness-report-2019.csv'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlChange(url.trim());
    }
  };

  const handleSelectSource = (sourceUrl) => {
    setUrl(sourceUrl);
    onUrlChange(sourceUrl);
    setIsExpanded(false);
  };

  return (
    <div className="card bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">データソース</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? '閉じる' : '変更'}
        </button>
      </div>

      {isExpanded && (
        <div className="mb-4">
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">推奨データソース</h3>
            <div className="space-y-2">
              {defaultDataSources.map((source, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSource(source.url)}
                >
                  <span className="text-gray-800">{source.name}</span>
                  <button className="text-sm text-blue-500 hover:underline">
                    選択
                  </button>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-md font-medium text-gray-700 mb-2">カスタムデータソース</h3>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="データソースのURLを入力 (CSV/JSON)"
              className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            >
              適用
            </button>
          </form>
        </div>
      )}

      {!isExpanded && currentUrl && (
        <div className="text-sm text-gray-600">
          <p className="truncate">
            現在のソース: {currentUrl}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            データ形式: {currentUrl.toLowerCase().endsWith('.csv') ? 'CSV' : 
                        currentUrl.toLowerCase().endsWith('.json') ? 'JSON' : '不明'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataSourceSelector; 
