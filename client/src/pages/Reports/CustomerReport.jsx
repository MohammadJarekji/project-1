import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Table, Spin, Input, Space, Button } from "antd";

const CustomerReport = () => {
     const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const response = await fetch('http://localhost:3000/api/report/customers');// your endpoint
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

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "Contact Name",
      dataIndex: "contactName",
      key: "contactName",
      ...getColumnSearchProps('contactName'),
    },
    {
      title: "Phone Number",
      dataIndex: "contactPhoneNumber",
      key: "contactPhoneNumber",
      ...getColumnSearchProps('contactPhoneNumber'),
    },
    {
      title: "Total Sales (USD)",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => `$${value.toFixed(2)}`,
      sorter: (a, b) => a.totalSales - b.totalSales,
    },
    {
      title: "Total Receipts (USD)",
      dataIndex: "totalReceipts",
      key: "totalReceipts",
      render: (value) => `$${value.toFixed(2)}`,
      sorter: (a, b) => a.totalReceipts - b.totalReceipts,
    },
    {
      title: "Outstanding (USD)",
      dataIndex: "outstanding",
      key: "outstanding",
      render: (value) => `$${value.toFixed(2)}`,
      sorter: (a, b) => a.outstanding - b.outstanding,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.customerId }))}
        pagination={{ pageSize: 10 }}
        title={() => <h2>Customers Reports</h2>}
      />
    </Spin>
  );
}

export default CustomerReport
