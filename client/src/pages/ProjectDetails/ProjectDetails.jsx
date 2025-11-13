import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Card, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditProjectDetailsModal from './EditProjectDetailsModal';
import DeleteProjectDetailsModal from './DeleteProjectDetailsModal';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';


const ProjectDetails = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);
    
    const [uom, setUOM] = useState([]);
    const [asset, setAsset] = useState([]);
    const [product, setProduct] = useState([]);
     const [project, setProject] = useState([]);
     const [staff, setStaff] = useState([]);
    const [productSelection, setProductSelection] = useState([]);
    const [productAssemdledSelection, setProductAssembledSelection] = useState([]);

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

      const onChange = value => {
        };
        const onSearch = value => {
        };
        
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/projectDetails/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchProjectDetails();
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

    const fetchProjectDetails = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/projectDetails',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.projectDetails)

             const projectMapped = result.project.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));

              const assetMapped = result.asset.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));

              const staffMapped = result.staff.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));

            setProject(projectMapped)
            setStaff(staffMapped)
            setAsset(assetMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getUomLabel = (uomId) => {
    const found = uom.find(u => u.value === uomId);
    return found ? found.label : 'Unknown UOM';
  };

    const getProjectLabel = (projectId) => {
    const found = project.find(v => v.value === projectId);
    return found ? found.label : 'Unknown Product';
  };

  const getStaffLabel = (staffId) => {
    const found = staff.find(v => v.value === staffId);
    return found ? found.label : 'Unknown staff';
  };

    const getAssetLabel = (assetId) => {
    const found = asset.find(v => v.value === assetId);
    return found ? found.label : 'Unknown Asset';
  };

    useEffect(()=>{
        fetchProjectDetails();
    },[]);

    const columns = [

  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    ...getColumnSearchProps('project', (record) => getProjectLabel(record.projectId)),
    render: (text, record) => getProjectLabel(record.projectId),
  },
  {
    title: 'Staff',
    key: 'staff',
    children: [
      {
        title: 'Name',
        key: 'name',
        render: (_, record) => (
          <>
            {record.staff.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {getStaffLabel(line.staffId)}
              </div>
            ))}
          </>
        ),
      },
      {
        title: 'Hours',
        key: 'hours',
        render: (_, record) => (
          <>
            {record.staff.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {line.hours}
              </div>
            ))}
          </>
        ),
      },
    ],
  },
  {
    title: 'Asset',
    key: 'asset',

    children: [
      {
        title: 'Asset',
        key: 'asset',

        render: (_, record) => (
          <>
            {record.asset.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {getAssetLabel(line.assetId)}
              </div>
            ))}
          </>
        ),
      },
      {
        title: 'Hours',
        key: 'hours',

        render: (_, record) => (
          <>
            {record.asset.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {line.hours}
              </div>
            ))}
          </>
        ),
      },
    ],
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditProjectDetailsModal projectDetailsObj={record} fetchProjectDetails={fetchProjectDetails} project={project} 
        asset={asset} staff={staff}/>
        <DeleteProjectDetailsModal projectDetailsObj={record} fetchProjectDetails={fetchProjectDetails}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add ProjectDetails
      </Button>
      <Modal
        width={700}
        title="Add ProjectDetails"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
            <Form
            form={form}
                name="basic"
                layout='vertical'
                style={{ maxWidth: 700, }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                label="Project"
                name="projectId"
                rules={[{ required: true, message: 'Please select a project!' }]}
                >

                <Select
                  showSearch
                  placeholder="Select project"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={project}
                />
                </Form.Item>
              
              {/* ///////////////////////////////////////////////////////////////////////////////////// */}
            <Card title="Staff" style={{ border: 'none' }}>
  <Form.List name="staff">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name }) => (
          <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
            <Col span={10}>
              <Form.Item
                label="Staff"
                name={[name, 'staffId']}
              >
                <Select
                  showSearch
                  placeholder="Select staff"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={staff}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                label="Hours"
                name={[name, 'hours']}
              >
                <InputNumber placeholder="hours" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18 }} />
            </Col>
          </Row>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Staff
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Card>


   <Card title="Asset" style={{ border: 'none' }}>
  <Form.List name="asset">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name }) => (
          <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
            <Col span={10}>
              <Form.Item
                label="Asset"
                name={[name, 'assetId']}
              >
                <Select
                  showSearch
                  placeholder="Select asset"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={asset}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                label="Hours"
                name={[name, 'hours']}
              >
                <InputNumber placeholder="hours" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18 }} />
            </Col>
          </Row>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Asset
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Card>

              {/* ///////////////////////////////////////////////////////////////////////////////////// */}
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

export default ProjectDetails
