import React, { useState, useEffect, useMemo } from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import ScatterChart from './charts/ScatterChart';
import DataSummary from './DataSummary';

const Dashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('summary');

  // データが存在するかどうかをチェック
  const hasData = data && data.data && data.data.length > 0;

  // 地域別の幸福度グラフデータ
  const regionHappinessData = useMemo(() => {
    if (!hasData || !data.region_happiness) return null;
    
    const labels = Object.keys(data.region_happiness);
    const values = Object.values(data.region_happiness);
    
    return {
      labels,
      datasets: [
        {
          label: '平均幸福度スコア',
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        }
      ]
    };
  }, [hasData, data]);

  // 幸福度と上位要因の相関図データ
  const correlationScatterData = useMemo(() => {
    if (!hasData || !data.factor_correlations || !data.data) return null;
    
    // 最も相関の高い2つの要因を取得
    const topFactors = Object.keys(data.factor_correlations).slice(0, 2);
    if (topFactors.length < 2) return null;
    
    const factor1 = topFactors[0];
    const factor2 = topFactors[1];
    
    // 散布図用のデータセット作成
    const scatterData = data.data.map(item => ({
      x: item[factor1],
      y: item[factor2],
      label: item.country || ''
    }));
    
    return {
      datasets: [
        {
          label: `${factor1} vs ${factor2}`,
          data: scatterData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
  }, [hasData, data]);

  // 幸福度上位10カ国のグラフデータ
  const topCountriesData = useMemo(() => {
    if (!hasData || !data.top_happy_countries) return null;
    
    const countries = Object.keys(data.top_happy_countries).slice(0, 10);
    const scores = countries.map(country => data.top_happy_countries[country]);
    
    return {
      labels: countries,
      datasets: [
        {
          label: '幸福度スコア',
          data: scores,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        }
      ]
    };
  }, [hasData, data]);

  // 幸福度下位10カ国のグラフデータ
  const bottomCountriesData = useMemo(() => {
    if (!hasData || !data.bottom_happy_countries) return null;
    
    const countries = Object.keys(data.bottom_happy_countries).slice(0, 10);
    const scores = countries.map(country => data.bottom_happy_countries[country]);
    
    return {
      labels: countries,
      datasets: [
        {
          label: '幸福度スコア',
          data: scores,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        }
      ]
    };
  }, [hasData, data]);

  // 相関係数のグラフデータ
  const correlationData = useMemo(() => {
    if (!hasData || !data.factor_correlations) return null;
    
    const factors = Object.keys(data.factor_correlations);
    const correlations = factors.map(factor => data.factor_correlations[factor]);
    
    return {
      labels: factors,
      datasets: [
        {
          label: '幸福度との相関係数',
          data: correlations,
          backgroundColor: correlations.map(val => 
            val > 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)'
          ),
          borderColor: correlations.map(val => 
            val > 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(239, 68, 68, 1)'
          ),
          borderWidth: 1,
        }
      ]
    };
  }, [hasData, data]);

  // データがない場合のレンダリング
  if (!hasData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">データがありません</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {['summary', 'regions', 'countries', 'correlations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                {tab === 'summary' && '概要'}
                {tab === 'regions' && '地域分析'}
                {tab === 'countries' && '国別分析'}
                {tab === 'correlations' && '相関分析'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* タブ内容 */}
      <div className="grid grid-cols-1 gap-6">
        {/* 概要タブ */}
        {activeTab === 'summary' && (
          <div>
            <DataSummary data={data} />
          </div>
        )}

        {/* 地域分析タブ */}
        {activeTab === 'regions' && (
          <>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">地域別の平均幸福度</h2>
              {regionHappinessData && (
                <BarChart 
                  data={regionHappinessData} 
                  title="地域別の平均幸福度スコア" 
                  xAxisLabel="地域" 
                  yAxisLabel="平均幸福度スコア" 
                />
              )}
            </div>
          </>
        )}

        {/* 国別分析タブ */}
        {activeTab === 'countries' && (
          <>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">幸福度上位10カ国</h2>
              {topCountriesData && (
                <BarChart 
                  data={topCountriesData} 
                  title="幸福度上位10カ国" 
                  xAxisLabel="国名" 
                  yAxisLabel="幸福度スコア" 
                />
              )}
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">幸福度下位10カ国</h2>
              {bottomCountriesData && (
                <BarChart 
                  data={bottomCountriesData} 
                  title="幸福度下位10カ国" 
                  xAxisLabel="国名" 
                  yAxisLabel="幸福度スコア" 
                />
              )}
            </div>
          </>
        )}

        {/* 相関分析タブ */}
        {activeTab === 'correlations' && (
          <>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">幸福度と各要因の相関</h2>
              {correlationData && (
                <BarChart 
                  data={correlationData} 
                  title="幸福度と各要因の相関係数" 
                  xAxisLabel="要因" 
                  yAxisLabel="相関係数" 
                />
              )}
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">主要因子間の関係</h2>
              {correlationScatterData && (
                <ScatterChart 
                  data={correlationScatterData} 
                  title="主要要因の散布図" 
                  xAxisLabel={data.factor_correlations ? Object.keys(data.factor_correlations)[0] : ''} 
                  yAxisLabel={data.factor_correlations ? Object.keys(data.factor_correlations)[1] : ''} 
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
