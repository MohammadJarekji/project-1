import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Table, Spin, Input, Space, Button, Typography } from "antd";

const VendorReport = () => {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Text, Title } = Typography;

  // /////////////////////////////////////////////////////////////////

      const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, getSearchText, searchText, searchedColumn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const fieldValue = getSearchText ? getSearchText(record) : record[dataIndex];
      return String(fieldValue ?? '').toLowerCase().includes(value.toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText || '']}
          autoEscape
          textToHighlight={String(text ?? '')}
        />
      ) : (
        String(text ?? '')
      ),
  });

    // ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/report/vendors');// your endpoint
        const data = await response.json();
        setData(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

   // Columns for the nested (expanded) table
  const nestedColumns = [
    {
      title: "Purchase Order #",
      dataIndex: "poNumber",
      key: "poNumber",
      render: (text) => (text ? text : "-"),
      align: "center",
    },
    {
      title: "Purchase Amount (USD)",
      dataIndex: "purchaseUSD",
      key: "purchaseUSD",
      render: (value) => (value ? `$${value.toFixed(0)}` : "-"),
      align: "right",
    },
    {
      title: "Payment Order #",
      dataIndex: "payNumber",
      key: "payNumber",
      render: (text) => (text ? text : "-"),
      align: "center",
    },
    {
      title: "Payment Amount (USD)",
      dataIndex: "paymentUSD",
      key: "paymentUSD",
      render: (value) => (value ? `$${value.toFixed(0)}` : "-"),
      align: "right",
    },
  ];

  // Main vendor table (expandable)
  const vendorColumns = [
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      ...getColumnSearchProps('vendorName'),
      render: (text) => <Text strong>{text}</Text>,
    },
  ];

  // Build the expanded rows — align purchase and payment orders side by side
  const expandedRowRender = (record) => {
    const purchaseOrders = record.purchaseOrders || [];
    const paymentOrders = record.paymentOrders || [];
    const maxRows = Math.max(purchaseOrders.length, paymentOrders.length);

    // Align them row by row
    const combined = [];
    for (let i = 0; i < maxRows; i++) {
      combined.push({
        key: i,
        poNumber: purchaseOrders[i]?.poNumber || "",
        purchaseUSD: purchaseOrders[i]?.totalUSD || null,
        payNumber: paymentOrders[i]?.payNumber || "",
        paymentUSD: paymentOrders[i]?.totalUSD || null,
      });
    }

    return (
      <div>
        <Table
          columns={nestedColumns}
          dataSource={combined}
          pagination={false}
          size="small"
          footer={() => (
            <div style={{ textAlign: "right" }}>
              <Text strong>Total Purchases: </Text>${record.totalPurchases.toFixed(0)}{" "}
              &nbsp;&nbsp;&nbsp;
              <Text strong>Total Payments: </Text>${record.totalPayments.toFixed(0)}{" "}
              &nbsp;&nbsp;&nbsp;
              <Text strong>Outstanding: </Text>
              <Text type={record.outstanding > 0 ? "danger" : "success"}>
                ${record.outstanding.toFixed(0)}
              </Text>
            </div>
          )}
        />
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      <Title level={4} style={{ marginBottom: 16 }}>
        Vendor Financial Report
      </Title>
      <Table
        columns={vendorColumns}
        expandable={{ expandedRowRender }}
        dataSource={data.map((item) => ({ ...item, key: item.vendorId }))}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        bordered
      />
    </Spin>
  );
}

export default VendorReport
