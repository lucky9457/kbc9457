import React, { useState, useEffect } from 'react';
import "../styles/Chart.css"
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import html2canvas from 'html2canvas';

const Chart = () => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
    
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/data.json');
      setData(result.data);
    };
    fetchData();
  }, []);

  const processData = () => {
    if (timeframe === 'weekly') {
      return aggregateData(data, 7);
    } else if (timeframe === 'monthly') {
      return aggregateData(data, 30);
    } else {
      return data.map(point => ({
        timestamp: new Date(point.timestamp).toLocaleDateString(),
        value: point.value
      }));
    }
  };

  const aggregateData = (data, days) => {
    const result = [];
    for (let i = 0; i < data.length; i += days) {
      const chunk = data.slice(i, i + days);
      const avgValue = chunk.reduce((acc, cur) => acc + cur.value, 0) / chunk.length;
      result.push({
        timestamp: new Date(chunk[0].timestamp).toLocaleDateString(),
        value: avgValue
      });
    }
    return result;
  };

  const handleClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      alert(`Date: ${data.activeLabel}\nValue: ${data.activePayload[0].value}`);
    }
  };

  const exportChart = (type) => {
    const chartElement = document.getElementById('chart');
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(`image/${type}`);
        link.download = `chart.${type}`;
        link.click();
      });
    }
  };

  return (
    <div className='maincontainer'>
      <div className='btncon'>
        <button className={`btnDaily ${timeframe==="daily"?"active":""}`} onClick={() => setTimeframe('daily')}>Daily</button>
        <button className={`btnDaily ${timeframe==="weekly"?"active":""}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button className={`btnDaily ${timeframe==="monthly"?"active":""}`}  onClick={() => setTimeframe('monthly')}>Monthly</button>
      </div>
      <div id="chart">
        <ResponsiveContainer width="98%" height={400}>
          <LineChart
            data={processData()}
            onClick={handleClick}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <button className='exportbtns' onClick={() => exportChart('png')}>Export as PNG</button>
        <button className='exportbtns' onClick={() => exportChart('jpg')}>Export as JPG</button>
      </div>
    </div>
  );
};

export default Chart;
