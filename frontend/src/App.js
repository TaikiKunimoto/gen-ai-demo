import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { ChartOptions } from 'chart.js';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import DataSourceSelector from './components/DataSourceSelector';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (customUrl = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = customUrl ? `/api/process?url=${encodeURIComponent(customUrl)}` : '/api/process';
      const response = await axios.get(url);
      
      if (response.data.status === 'success') {
        setData(response.data.results);
        if (customUrl) {
          setDataUrl(customUrl);
        }
      } else {
        setError(response.data.message || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('APIリクエストエラー: ' + (err.message || 'Unknown error'));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDataSourceChange = (newUrl) => {
    fetchData(newUrl);
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <div className="text-center">
          <ThreeDots 
            height="80" 
            width="80" 
            radius="9"
            color="#3b82f6" 
            ariaLabel="loading"
            visible={true}
          />
          <p className="mt-4 text-gray-600">データを処理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchData()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DataSourceSelector currentUrl={dataUrl} onUrlChange={handleDataSourceChange} />
        {data && <Dashboard data={data} />}
      </main>
      <footer className="bg-white shadow-inner py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2023 World Happiness Data Visualization</p>
          <p className="text-sm mt-2">Powered by React, TailwindCSS, and Flask</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 
