import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

// ChartJSのコンポーネント登録
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
);

const ScatterChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
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
        callbacks: {
          label: function(context) {
            const point = context.dataset.data[context.dataIndex];
            return point.label ? `${point.label}: (${point.x}, ${point.y})` : `(${point.x}, ${point.y})`;
          }
        },
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
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterChart; 
