import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import DataSourceSelector from './components/DataSourceSelector';

// バックエンドのURL
const BACKEND_URL = 'http://localhost:8000';

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
      console.log('データ取得を開始します...');
      
      // 直接バックエンドURLを使用
      const directUrl = customUrl 
        ? `${BACKEND_URL}/api/process?url=${encodeURIComponent(customUrl)}` 
        : `${BACKEND_URL}/api/process`;
      
      console.log('直接APIにアクセス:', directUrl);
      
      const response = await axios.get(directUrl, {
        timeout: 10000, // タイムアウトを10秒に設定
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.status === 'success') {
        console.log('データ取得成功:', response.data.message);
        setData(response.data.results);
        if (customUrl) {
          setDataUrl(customUrl);
        }
      } else {
        console.error('APIからのエラーレスポンス:', response.data);
        setError(response.data?.message || 'データの取得に失敗しました (status not success)');
      }
    } catch (err) {
      console.error('API request error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      // プロキシ経由でのフォールバックを試みる
      try {
        console.log('プロキシ経由でリトライします...');
        const proxyUrl = customUrl 
          ? `/api/process?url=${encodeURIComponent(customUrl)}` 
          : '/api/process';
        
        const proxyResponse = await axios.get(proxyUrl);
        
        if (proxyResponse.data && proxyResponse.data.status === 'success') {
          console.log('プロキシ経由でデータ取得成功:', proxyResponse.data.message);
          setData(proxyResponse.data.results);
          if (customUrl) {
            setDataUrl(customUrl);
          }
          setLoading(false);
          return;
        }
      } catch (proxyErr) {
        console.error('プロキシ経由のリクエストも失敗:', proxyErr.message);
      }
      
      if (err.response) {
        // サーバーからのレスポンスがある場合
        setError(`APIエラー (${err.response.status}): ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        // リクエストは送信されたがレスポンスがない場合
        setError('サーバーからの応答がありません。バックエンドサーバーが起動しているか確認してください。');
      } else {
        // リクエスト作成時のエラー
        setError('APIリクエストエラー: ' + err.message);
      }
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
          <div className="mb-4">
            <small className="text-gray-500">APIエンドポイント: /api/process</small>
            <br />
            <small className="text-gray-500">バックエンドURL: {BACKEND_URL}/api/process</small>
          </div>
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
