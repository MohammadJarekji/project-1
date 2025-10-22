import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Card } from '@mui/material';

const monthNames = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const BarChartComponent = () => {
  const [data, setData] = useState({
    labels: [],
    sales: [],
    purchases: [],
    receipts: []
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/dashboard/last-12-months');
        const json = await res.json();

        // Helper to format YYYY-MM and fill missing months with 0
        const monthMap = new Map();

        // Collect all months that appear in any dataset
        const addToMonthMap = (arr) => {
          arr.forEach(({ year, month }) => {
            const key = `${year}-${month}`;
            monthMap.set(key, {
              label: `${monthNames[month]} ${year}`,
              sales: 0,
              purchases: 0,
              receipts: 0
            });
          });
        };

        addToMonthMap(json.salesData);
        addToMonthMap(json.purchaseData);
        addToMonthMap(json.receiptData);

        // Fill in values
        json.salesData.forEach(({ year, month, count }) => {
          const key = `${year}-${month}`;
          monthMap.get(key).sales = count;
        });

        json.purchaseData.forEach(({ year, month, count }) => {
          const key = `${year}-${month}`;
          monthMap.get(key).purchases = count;
        });

        json.receiptData.forEach(({ year, month, count }) => {
          const key = `${year}-${month}`;
          monthMap.get(key).receipts = count;
        });

        // Convert Map to arrays sorted by date
        const sorted = Array.from(monthMap.entries())
          .sort(([a], [b]) => new Date(`${a}-01`) - new Date(`${b}-01`))
          .slice(-12); // last 12 months

        const labels = sorted.map(([, v]) => v.label);
        const sales = sorted.map(([, v]) => v.sales);
        const purchases = sorted.map(([, v]) => v.purchases);
        const receipts = sorted.map(([, v]) => v.receipts);

        setData({ labels, sales, purchases, receipts });

      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      }
    };

    fetchChartData();
  }, []);

  return (
  <>
      <BarChart
        xAxis={[{ id: 'months', data: data.labels, scaleType: 'band' }]}
        series={[
          { data: data.sales, label: 'Sales', color: '#4caf50' },
          { data: data.purchases, label: 'Purchases', color: '#2196f3' },
          { data: data.receipts, label: 'Receipts', color: '#ff9800' }
        ]}
        width={800}
        height={250}
      />
</>
  );
};

export default BarChartComponent;
