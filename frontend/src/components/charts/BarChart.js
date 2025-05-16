import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ChartJSのコンポーネント登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  // チャートオプション
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Noto Sans JP', sans-serif",
          }
        }
      },
      title: {
        display: !!title,
        text: title || '',
        font: {
          family: "'Noto Sans JP', sans-serif",
          size: 16,
        }
      },
      tooltip: {
        titleFont: {
          family: "'Noto Sans JP', sans-serif",
        },
        bodyFont: {
          family: "'Noto Sans JP', sans-serif",
        }
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel || '',
          font: {
            family: "'Noto Sans JP', sans-serif",
          }
        },
        ticks: {
          font: {
            family: "'Noto Sans JP', sans-serif",
          }
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
          font: {
            family: "'Noto Sans JP', sans-serif",
          }
        },
        ticks: {
          font: {
            family: "'Noto Sans JP', sans-serif",
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart; 
