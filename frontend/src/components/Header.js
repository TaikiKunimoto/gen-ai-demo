import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold">世界幸福度レポート</h1>
            <p className="text-blue-100 mt-1">データの可視化とインサイト分析</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-1">
              <span className="text-sm">データ分析パイプライン</span>
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                稼働中
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
