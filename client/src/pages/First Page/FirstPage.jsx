import React,{useState, useEffect} from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Space } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DropboxOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { BarChart } from '@mui/x-charts/BarChart';
import BarChartComponent from './BarChartComponent';

const FirstPage = () => {

    const { Title } = Typography;

    const [customerCount, setCustomerCount] = useState(0);
    const [vendorCount, setVendorCount] = useState(0);
     const [orderCounts, setOrderCounts] = useState({
    salesOrders: 0,
    purchaseOrders: 0,
    receiptOrders: 0,
  });
   const [totalStock, setTotalStock] = useState(0);
   const [lowStockProducts, setLowStockProducts] = useState([]);
   const [topProducts, setTopProducts] = useState([]);

   console.log("Needed Data: ",lowStockProducts)

      // Example data (replace with API later)
  const stats = [
    {
      title: 'Total Sales',
      value: orderCounts.salesOrders,
      prefix: <DollarOutlined />,
    },
    {
      title: 'Total Purchases',
      value: orderCounts.purchaseOrders,
      prefix: <ShoppingCartOutlined />,
    },
    {
      title: 'Customers',
      value: customerCount,
      prefix: <UserOutlined />,
    },
    {
      title: 'Products in Stock',
      value: totalStock,
      prefix: <DropboxOutlined />,
    },
    {
      title: 'Vendors',
      value: vendorCount,
      prefix: <DollarOutlined />,
    },
    {
      title: 'Total Receipts',
      value: orderCounts.receiptOrders,
      prefix: <ShoppingCartOutlined />,
    },
  ];

  const topProductColumns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Total Sold',
      dataIndex: 'totalSold',
      key: 'totalSold'
    }
  ];


  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/customer/count',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
              const data = await response.json();
        setCustomerCount(data.count);
      } catch (error) {
        console.error('Failed to fetch customer count:', error);
      }
    };

    fetchCustomerCount();
  }, []);


  useEffect(() => {
    const fetchVendorCount = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/vendor/count',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
              const data = await response.json();
        setVendorCount(data.count);
      } catch (error) {
        console.error('Failed to fetch customer count:', error);
      }
    };

    fetchVendorCount();
  }, []);


    useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/dashboard/order-counts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOrderCounts(data);
      } catch (error) {
        console.error('Failed to fetch order counts:', error);
      }
    };

    fetchOrderCounts();
  }, []);


    useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/dashboard/products/total-stock', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTotalStock(data.totalStock);
      } catch (error) {
        console.error('Failed to fetch total stock:', error);
      }
    };

    fetchTotalStock();
  }, []);


  useEffect(() => {
  const fetchLowStock = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/product/low-stock');
      const data = await response.json();
      setLowStockProducts(data.lowStockProducts);
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
  };

  fetchLowStock();
}, []);

useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/dashboard/top-selling-products');
        const data = await res.json();
        setTopProducts(data.topProducts);
      } catch (err) {
        console.error('Failed to fetch top-selling products', err);
      }
    };
    fetchTopProducts();
  }, []);


const valueFormatter = (value) => {
  return `${value}mm`;
};

    return (
          <div style={{ padding: '24px' }}>
      <Title level={3}>Dashboard</Title>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Placeholder for a chart or extra widget */}
        <Col xs={24} md={24}>
          <Card title="Orders Overview (Last 12 Months)">
            {/* <div style={{ height: 200, textAlign: 'center', paddingTop: 80 }}> */}

            <BarChartComponent/>
              

    {/* <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month' }]}
      series={[
        { dataKey: 'london', label: 'London', valueFormatter },
        { dataKey: 'paris', label: 'Paris', valueFormatter },
        { dataKey: 'newYork', label: 'New York', valueFormatter },
        { dataKey: 'seoul', label: 'Seoul', valueFormatter },
      ]}
      {...chartSetting}
    /> */}
            {/* </div> */}
          </Card>
        </Col>

      </Row>

      {/* Product Table */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Low Stock Products" style={{ marginTop: 24 }}>
            <Table
              dataSource={lowStockProducts}
              rowKey="_id"
              pagination={false}
              columns={[
                {
                  title: 'Product Name',
                  dataIndex: 'name',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  render: val => parseFloat(val).toFixed(2),
                },
                {
                  title: 'Min Stock Level',
                  dataIndex: 'minStkLevel',
                  render: val => parseFloat(val).toFixed(2),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Top 5 selling Products" style={{ marginTop: 24 }}>
         <Table columns={topProductColumns} dataSource={topProducts} rowKey="productName" pagination={false} />
         </Card>
        </Col>
      </Row>
    </div>
    )
}

export default FirstPage
