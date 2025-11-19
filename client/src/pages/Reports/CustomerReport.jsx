import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Table, Spin, Input, Space, Button, Typography } from "antd";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CustomerReport = () => {
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
        const response = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/report/customers');// your endpoint
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


  // Export to excel

 const exportCustomerToExcel = (customer) => {
  const sales = customer.salesOrders || [];
  const receipts = customer.receiptOrders || [];
  const maxRows = Math.max(sales.length, receipts.length);

  // Build rows for Excel
  const excelData = [];

  for (let i = 0; i < maxRows; i++) {
    excelData.push({
      "Sales Order #": sales[i]?.soNumber || "",
      "Sales Amount (USD)": sales[i]?.totalUSD ? `$${sales[i].totalUSD}` : "",
      "Receipt Order #": receipts[i]?.recNumber || "",
      "Receipt Amount (USD)": receipts[i]?.totalUSD ? `$${receipts[i].totalUSD}` : "",
    });
  }

  // Footer row for totals
  excelData.push({
    "Sales Order #": `Total Sales: $${customer.totalSales}`,
    "Sales Amount (USD)": "",
    "Receipt Order #": `Total Receipts: $${customer.totalReceipts}`,
    "Receipt Amount (USD)": `Outstanding: $${customer.outstanding}`,
  });

  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  XLSX.writeFile(workbook, `${customer.customerName}_Report.xlsx`);
};

   // Columns for the nested (expanded) table
  const nestedColumns = [
    {
      title: "Sales Order #",
      dataIndex: "soNumber",
      key: "soNumber",
      render: (text) => (text ? text : "-"),
      align: "center",
    },
    {
      title: "Sales Amount (USD)",
      dataIndex: "salesUSD",
      key: "salesUSD",
      render: (value) => (value ? `$${value.toFixed(0)}` : "-"),
      align: "right",
    },
    {
      title: "Receipt Order #",
      dataIndex: "recNumber",
      key: "recNumber",
      render: (text) => (text ? text : "-"),
      align: "center",
    },
    {
      title: "Receipt Amount (USD)",
      dataIndex: "receiptUSD",
      key: "receiptUSD",
      render: (value) => (value ? `$${value.toFixed(0)}` : "-"),
      align: "right",
    },
  ];

  // Main customer table (expandable)
  const customerColumns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps('customerName'),
      render: (text,record) =>( 
      <Space>
        <Text strong>{text}</Text>
      <Button type="primary" style={{background:'green'}} onClick={() => exportCustomerToExcel(record)}>
            Export to Excel
          </Button>
          </Space>
    )},
  ];

  // Build the expanded rows — align sales and receipts side by side
  const expandedRowRender = (record) => {
    const sales = record.salesOrders || [];
    const receipts = record.receiptOrders || [];
    const maxRows = Math.max(sales.length, receipts.length);

    // Align them row by row
    const combined = [];
    for (let i = 0; i < maxRows; i++) {
      combined.push({
        key: i,
        soNumber: sales[i]?.soNumber || "",
        salesUSD: sales[i]?.totalUSD || null,
        recNumber: receipts[i]?.recNumber || "",
        receiptUSD: receipts[i]?.totalUSD || null,
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
              <Text strong>Total Sales: </Text>${record.totalSales.toFixed(0)}{" "}
              &nbsp;&nbsp;&nbsp;
              <Text strong>Total Receipts: </Text>${record.totalReceipts.toFixed(0)}{" "}
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
        Customer Financial Report
      </Title>
      <Table
        columns={customerColumns}
        expandable={{ expandedRowRender }}
        dataSource={data.map((item) => ({ ...item, key: item.customerId }))}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        bordered
      />
    </Spin>
  );
}

export default CustomerReport
