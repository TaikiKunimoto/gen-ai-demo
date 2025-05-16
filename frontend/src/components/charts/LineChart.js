import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ChartJSのコンポーネント登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
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
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart; 
