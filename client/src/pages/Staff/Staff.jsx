import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditStaffModal from './EditStaffModal';
import DeleteStaffModal from './DeleteStaffModal';
import dayjs from 'dayjs';

const Staff = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
    const [selectedDOF, setselectedDOF] = useState(null);
    const [selectedJoinedDate, setselectedJoinedDate] = useState(null);
    const [selectedHireDate, setSelectedHireDate] = useState(null);
        const { userData}=useAuth();

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
    
        const [isModalOpen, setIsModalOpen] = useState(false);
    
              const [formData, setFormData] = useState({
              name:"",
              code:"",
          }); 
    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };

      const handleDOFChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setselectedDOF(formatted);
    } else {
      setselectedDOF(null);
    }
  };


  const handleJoinedDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setselectedJoinedDate(formatted);
    } else {
      setselectedJoinedDate(null);
    }
  };

  const handleHireDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedHireDate(formatted);
    } else {
      setSelectedHireDate(null);
    }
  };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch('http://localhost:3000/api/staff/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchStaff();
                handleCancel();
            }catch(error){
                console.error("Error fetching1 user: ",error)
            }
        }
    
        const onFinish = values => {
            handleSubmit(values);
              form.resetFields();
        };
        const onFinishFailed = errorInfo => {
        };

    const fetchStaff = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/staff',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.staff)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    useEffect(()=>{
        fetchStaff();
    },[]);

    const columns = [
  {
    title: 'Staff Name',
    dataIndex: 'name',
    key: 'name',
    ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    ...getColumnSearchProps('role'),
  },
  {
    title: 'Date Of Birth',
    dataIndex: 'dob',
    key: 'dob',
     render: (value) => {
    // If value is valid, format it, otherwise return an empty string
    return value && dayjs(value).isValid() ? dayjs(value).format('M/D/YYYY') : '';
  },
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    ...getColumnSearchProps('role'),
  },
  {
    title: 'Joined Date',
    dataIndex: 'joinedDate',
    key: 'joinedDate',
     render: (value) => {
    // If value is valid, format it, otherwise return an empty string
    return value && dayjs(value).isValid() ? dayjs(value).format('M/D/YYYY') : '';
  },
  },
  {
    title: 'Hire Date',
    dataIndex: 'hireDate',
    key: 'hireDate',
     render: (value) => {
    // If value is valid, format it, otherwise return an empty string
    return value && dayjs(value).isValid() ? dayjs(value).format('M/D/YYYY') : '';
  },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditStaffModal staffObj={record} fetchStaff={fetchStaff}/>
        <DeleteStaffModal staffObj={record} fetchStaff={fetchStaff}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Staff
      </Button>
      <Modal
        title="Add Staff"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
            <Form
            form={form}
                name="basic"
                layout='vertical'
                style={{ maxWidth: 600, }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="Staff Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Staff name!' }]}
                >
                <Input placeholder='Enter staff name'/>
                </Form.Item>

                <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please input your Staff role!' }]}
                >
                <Input placeholder='Enter staff role'/>
                </Form.Item>

                <Form.Item
                label="Date Of Birth"
                name="dob"
                >
                <DatePicker 
                  onChange={handleDOFChange} 
                  style={{width:'100%'}}
                  format="M/D/YYYY"
                  value={selectedDOF && dayjs(selectedDOF, 'M/D/YYYY').isValid() ? dayjs(selectedDOF, 'M/D/YYYY') : null}
                  />
                </Form.Item>

                <Form.Item
                label="Phone Number"
                name="phoneNumber"
                >
                <Input placeholder='Enter staff phone number'/>
                </Form.Item>

                <Form.Item
                label="Joined Date"
                name="joinedDate"
                >
                <DatePicker 
                  onChange={handleJoinedDateChange} 
                  style={{width:'100%'}}
                  format="M/D/YYYY"
                  value={selectedJoinedDate && dayjs(selectedJoinedDate, 'M/D/YYYY').isValid() ? dayjs(selectedJoinedDate, 'M/D/YYYY') : null}
                  />
                </Form.Item>

                <Form.Item
                label="Hire Date"
                name="hireDate"
                >
                <DatePicker 
                  onChange={handleHireDateChange} 
                  style={{width:'100%'}}
                  format="M/D/YYYY"
                  value={selectedHireDate && dayjs(selectedHireDate, 'M/D/YYYY').isValid() ? dayjs(selectedHireDate, 'M/D/YYYY') : null}
                  />
                </Form.Item>

                <Form.Item label={null}>
                <Button style={{float:'right'}} type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
      </Modal>
        <Table columns={columns} dataSource={data}   scroll={{ x: 'calc(100vh - 200px)' }}/>
        </>
    )
}

export default Staff
