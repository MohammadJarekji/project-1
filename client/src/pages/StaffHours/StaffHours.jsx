import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import EditStaffHoursModal from './EditStaffHoursModal';
import dayjs from 'dayjs';
import DeleteStaffHoursModal from './DeleteStaffHoursModal';

const StaffHours = () => {
  const [form] = Form.useForm();
  const [staffData, setStaffData] = useState([]); // Store staff data here
  const [newStaff, setNewStaff] = useState({ name: '', hours: '' });
  const [currentDay, setCurrentDay] = useState(dayjs()); // Start from today
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [selectedAD, setselectedAD] = useState(null);

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

  // Add staff modal functions
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/StaffWorkHours/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      fetchStaffWork(currentDay); // Re-fetch work hours after adding new data
      handleCancel(); // Close modal after submit
    } catch (error) {
      console.error('Error fetching user: ', error);
    }
  };

  const onFinish = (values) => {
    handleSubmit(values); // Submit the form and close modal
    form.resetFields();
  };

const fetchStaffWork = async (selectedDate) => {
  try {
    // Check if selectedDate is valid, otherwise set it to today
    const dateToFetch = selectedDate ? dayjs(selectedDate).startOf('day') : dayjs().startOf('day');

    const res = await fetch(
      `${import.meta.env.VITE_URL_BASE_APP}/api/StaffWorkHours?date=${dateToFetch.toISOString()}`, // Pass the valid date
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();
    if (result.workHours && result.workHours.staffHours && result.workHours.staffHours.length > 0) {
      setStaffData(result.workHours.staffHours); // Set staff data for the selected date
    } else {
      setStaffData([]); // If no data found for the selected date
    }

    console.log("I want this result: ",result)

    const staffMapped = result.staff.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));

              setStaff(staffMapped)

  } catch (error) {
    console.error('Error fetching staff work hours:', error);
  }
};

  const getStaffLabel = (staffId) => {
    const found = staff.find(v => v.value === staffId);
    return found ? found.label : 'Unknown staff';
  };

  useEffect(() => {
    fetchStaffWork(currentDay); // Initial data fetch for today
  }, []);

  // Move to the next day
  const handleNextDay = () => {
    const nextDay = currentDay.add(1, 'day'); // Move to the next day
    setCurrentDay(nextDay); // Update the current date state
    fetchStaffWork(nextDay); // Fetch work hours for the next day
  };

  // Move to the previous day
  const handlePreviousDay = () => {
    const prevDay = currentDay.subtract(1, 'day'); // Move to the previous day
    setCurrentDay(prevDay); // Update the current date state
    fetchStaffWork(prevDay); // Fetch work hours for the previous day
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
            onClick={handlePreviousDay} // Allow navigation to any previous day
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
          render: (text, record) => getStaffLabel(record.name),
        },
        {
          title: 'Hours',
          dataIndex: 'hours',
          key: 'hours',
          ...getColumnSearchProps('hours'),
        },
      ],
    },
//     ...(currentDay.isSame(dayjs(), 'day')?[
//     {
//     title: 'Action',
//     key: 'action',
//     render: (_, record) => (
//       <Space size="middle">
//         <EditStaffHoursModal StaffWorkObj={record} fetchStaffWork={fetchStaffWork}/>
//       </Space>
//     ),
//   },
// ]:[]),
  ];

  const handleADChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setselectedAD(formatted);
    } else {
      setselectedAD(null);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>
        Add Staff
      </Button>

      {/* Add Staff Modal */}
      <Modal title="Add Staff" closable={true} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          form={form}
          name="staffForm"
          layout="vertical"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish} // Call onFinish when form is submitted
        >
          <Form.Item label="Staff Name" name="name" rules={[{ required: true, message: 'Please input the staff name!' }]}>
            <Select
                  showSearch
                  placeholder="Select staff"
                  optionFilterProp="label"
                  options={staff}
                  style={{ width: '100%' }}
                />
          </Form.Item>

          <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please input the date name!' }]}
                >
                <DatePicker 
                  onChange={handleADChange} 
                  style={{width:'100%'}}
                  format="M/D/YYYY"
                  value={selectedAD && dayjs(selectedAD, 'M/D/YYYY').isValid() ? dayjs(selectedAD, 'M/D/YYYY') : null}
                  />
                </Form.Item>

          <Form.Item label="Hours Worked" name="hours" rules={[{ required: true, message: 'Please input hours worked!' }]}>
            <InputNumber min={1} max={24} placeholder="Enter staf working hours" style={{width:'100%'}} />
          </Form.Item>

          <Form.Item>
            <Button style={{ float: 'right' }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Staff Table */}
      <Table columns={columns} dataSource={staffData} rowKey="name" scroll={{ x: 'calc(100vh - 200px)' }} />
    </>
  );
};

export default StaffHours;