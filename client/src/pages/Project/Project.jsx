import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditProjectModal from './EditProjectModal';
import DeleteProjectModal from './DeleteProjectModal';
import dayjs from 'dayjs';


const Project = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
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

      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);

      const handleStartDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setStartDate(formatted);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setEndDate(formatted);
    } else {
      setEndDate(null);
    }
  };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/project/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchProject();
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

    const fetchProject = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/project',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.project)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    useEffect(()=>{
        fetchProject();
    },[]);

    const columns = [
  {
    title: 'Project Name',
    dataIndex: 'name',
    key: 'name',
    ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    ...getColumnSearchProps('location'),
  },
  {
    title: 'Project Type',
    dataIndex: 'type',
    key: 'type',
    ...getColumnSearchProps('type'),
  },
  {
    title: 'Cost',
    dataIndex: 'cost',
    key: 'cost',
    ...getColumnSearchProps('cost'),
  },
  {
    title: 'Start Date',
    dataIndex: 'fromDate',
    key: 'fromDate',
    ...getColumnSearchProps('fromDate', (record) => dayjs(record.fromDate).format('M/D/YYYY')),
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'End Date',
    dataIndex: 'toDate',
    key: 'toDate',
    ...getColumnSearchProps('toDate', (record) => dayjs(record.toDate).format('M/D/YYYY')),
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditProjectModal projectObj={record} fetchProject={fetchProject}/>
        <DeleteProjectModal projectObj={record} fetchProject={fetchProject}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Project
      </Button>
      <Modal
        title="Add Project"
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
                label="Project Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Project name!' }]}
                >
                <Input placeholder='Enter project name'/>
                </Form.Item>

                <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please input the location!' }]}
                >
                <Input placeholder='enter location'/>
                </Form.Item>

                <Form.Item
                label="Project Type"
                name="type"
                rules={[{ required: true, message: 'Please input the type of the Project!' }]}
                >
                <Input placeholder='enter the type of the project'/>
                </Form.Item>

                <Form.Item
                label="Cost"
                name="cost"
                rules={[{ required: true, message: 'Please input your cost!' }]}
                >
                <Input placeholder='Enter cost'/>
                </Form.Item>

                <Form.Item
                label="Start Date"
                name="fromDate"
                rules={[{ required: true, message: 'Please input the start date!' }]}
                >
                <DatePicker
                onChange={handleStartDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={startDate ? dayjs(startDate, 'M/D/YYYY') : null}
                 />
                </Form.Item>

                <Form.Item
                label="End Date"
                name="toDate"
                rules={[{ required: true, message: 'Please input the end date!' }]}
                >
                <DatePicker 
                onChange={handleEndDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={endDate ? dayjs(endDate, 'M/D/YYYY') : null}
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

export default Project
