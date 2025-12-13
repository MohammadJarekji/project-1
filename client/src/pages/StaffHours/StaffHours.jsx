import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const StaffHours = () => {
  const [form] = Form.useForm();
  const [staffData, setStaffData] = useState([]); // Store staff data here
  const [newStaff, setNewStaff] = useState({ name: '', hours: '' });
  const [currentDay, setCurrentDay] = useState(dayjs()); // Start from today
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For search functionality
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  // Handling the staff search functionality
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
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
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => {
      const fieldValue = record[dataIndex];
      return String(fieldValue ?? '').toLowerCase().includes(value.toLowerCase());
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
      ) : (
        String(text ?? '')
      ),
  });

  // Add staff modal functions
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = async (values) => {
    try {
      const res = await fetch('http://localhost:3000/api/StaffWorkHours/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      fetchStaffWork();
      handleCancel(); // Close modal after submit
    } catch (error) {
      console.error('Error fetching user: ', error);
    }
  };

  const onFinish = (values) => {
    console.log("Result123: ",values)
    handleSubmit(values);
    form.resetFields();
  };

const fetchStaffWork = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/StaffWorkHours', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
    if (result.workHours && result.workHours.staffHours && result.workHours.staffHours.length > 0) {
      setStaffData(result.workHours.staffHours); // Extract staff data from the response
    } else {
      setStaffData([]); // If no staff data, set it to an empty array
    }
  } catch (error) {
    console.error('Error fetching staff work hours:', error);
  }
};

  useEffect(() => {
    fetchStaffWork();
  }, []);

  // Move to the next day
  const handleNextDay = () => {
    setCurrentDay(currentDay.add(1, 'day'));
  };

  // Move to the previous day
  const handlePreviousDay = () => {
    setCurrentDay(currentDay.subtract(1, 'day'));
  };

  // Format the date for the table header
  const today = currentDay.format('dddd, MMMM D, YYYY');

  // Table columns with nested headers for "Staff" and "Hours"
const columns = [
  {
    title: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Button
          icon={<LeftOutlined />}
          onClick={handlePreviousDay}
          disabled={currentDay.isSame(dayjs(), 'day')} // Disable if today
          style={{ marginRight: '8px' }}
        />
        <span>{today}</span>
        <Button icon={<RightOutlined />} onClick={handleNextDay} style={{ marginLeft: '8px' }} />
      </div>
    ),
    children: [
      {
        title: 'Staff Name',
        dataIndex: 'name',
        key: 'name',
        ...getColumnSearchProps('name'),
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        key: 'hours',
        ...getColumnSearchProps('hours'),
      },
    ],
  },
];

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>
        Add Staff
      </Button>

      {/* Add Staff Modal */}
     <Modal
  title="Add Staff"
  closable={true}
  open={isModalOpen}
  onCancel={handleCancel}
  footer={null}
>
  <Form
    form={form}
    name="staffForm"
    layout="vertical"
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish} // Call onFinish when form is submitted
  >
    <Form.Item label="Staff Name" name="name" rules={[{ required: true, message: 'Please input the staff name!' }]}>
      <Input placeholder="Enter staff name" />
    </Form.Item>

    <Form.Item label="Hours Worked" name="hours" rules={[{ required: true, message: 'Please input hours worked!' }]}>
      <InputNumber min={1} max={24} placeholder="Enter staf working hours" />
    </Form.Item>

    <Form.Item>
      <Button style={{ float: 'right' }} type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
</Modal>

      {/* Staff Table */}
      <Table
        columns={columns}
        dataSource={staffData}
        rowKey="name"
        scroll={{ x: 'calc(100vh - 200px)' }}
      />
    </>
  );
};

export default StaffHours;