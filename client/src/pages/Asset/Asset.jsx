import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Row, Col ,InputNumber, DatePicker, Select } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditAssetModal from './EditAssetModal';
import DeleteAssetModal from './DeleteAssetModal';
import dayjs from 'dayjs';


const Asset = () => {

    const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);

    const [vendor, setVendor] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedWarrantyExpiry, setSelectedWarrantyExpiry] = useState(null);
    const [selectedMaintenanceDate, setSelectedMaintenanceDate] = useState(null);


        const { userData}=useAuth();
    
        const [isModalOpen, setIsModalOpen] = useState(false);
    
              const [formData, setFormData] = useState({
              name:"",
              code:"",
          }); 

          const onChange = value => {
        };
        const onSearch = value => {
        };
    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };

      const handleWarrantyExpiryChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedWarrantyExpiry(formatted);
    } else {
      setSelectedWarrantyExpiry(null);
    }
  };

  const handleMaintenanceDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedMaintenanceDate(formatted);
    } else {
      setSelectedMaintenanceDate(null);
    }
  };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/asset/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchAsset();
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

    const fetchAsset = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/asset',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })

             const result = await res.json();
             setData(result.asset)
             const vendorMapped = result.vendor.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));

      const staffMapped = result.staff.map(staff => ({
        value: staff._id,
        label: staff.name,
      }));
      setVendor(vendorMapped)
      setStaff(staffMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getStaffLabel = (staffId) => {
    const found = staff.find(v => v.value === staffId);
    return found ? found.label : 'Unknown staff';
  };

    const getVendorLabel = (vendorId) => {
    const found = vendor.find(v => v.value === vendorId);
    return found ? found.label : 'Unknown Vendor';
  };

    useEffect(()=>{
        fetchAsset();
    },[]);

    const columns = [
  {
    title: 'Serial Number',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Asset Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetType',
  },
  {
    title: 'Acquisition Cost',
    dataIndex: 'acquisitionCost',
    key: 'acquisitionCost',
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
    render: (text, record) => getVendorLabel(record.vendorId),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Assigned Staff',
    dataIndex: 'assignedStaff',
    key: 'assignedStaff',
    render: (text, record) => getStaffLabel(record.staffId),
  },
  {
    title: 'Depreciation Method',
    dataIndex: 'depreciationMethod',
    key: 'depreciationMethod',
  },
  {
    title: 'Warranty Expiry',
    dataIndex: 'warrantyExpiry',
    key: 'warrantyExpiry',
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'Maintenance Date',
    dataIndex: 'maintenanceDate',
    key: 'maintenanceDate',
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'Maintenance Hour',
    dataIndex: 'maintenanceHour',
    key: 'maintenanceHour',
  },
  {
    title: 'Insurance',
    dataIndex: 'insurance',
    key: 'insurance',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Attachment',
    dataIndex: 'attachment',
    key: 'attachment',
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditAssetModal assetObj={record} fetchAsset={fetchAsset} vendor={vendor} staff={staff}/>
        <DeleteAssetModal assetObj={record} fetchAsset={fetchAsset}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Asset
      </Button>
      <Modal
        title="Add Asset"
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
              <Row gutter={[9,9]}>
                <Col span={12}>
                  <Form.Item
                  label="Serial Number"
                  name="serialNumber"
                  >
                  <Input placeholder='Enter the serial number'/>
                  </Form.Item>
                  </Col>

                  <Col span={12}>
                  <Form.Item
                  label="Asset Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your asset name!' }]}
                  >
                  <Input placeholder='Enter the asset name'/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Row gutter={[9,9]}>
                  <Col span={12}>
                  <Form.Item
                  label="Asset Type"
                  name="assetType"
                  rules={[{ required: true, message: 'Please input your asset type!' }]}
                  >
                  <Input placeholder='Enter the asset type'/>
                  </Form.Item>
                  </Col>
              
              
              
                <Col span={12}>
                  <Form.Item
                  label="Acquisition Cost"
                  name="acquisitionCost"
                  >
                  <InputNumber placeholder='enter acquisition cost' style={{width:'100%'}}/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Row gutter={[9,9]}>
                  <Col span={12}>
                  <Form.Item
                label="Vendor"
                name="vendorId"
                >
                  <Select
                  showSearch
                  placeholder="Select a vendor"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={vendor}
                />
                </Form.Item>
                  </Col>
              

             
                <Col span={12}>
                  <Form.Item
                  label="Location"
                  name="location"
                  >
                  <Input placeholder='Enter location'/>
                  </Form.Item>
                  </Col>
                  </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                   <Form.Item
                label="Assigned Staff"
                name="staffId"
                >
                  <Select
                  showSearch
                  placeholder="Select a staff"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={staff}
                />
                </Form.Item>
                  </Col>
              
                <Col span={12}>
                  <Form.Item
                  label="Depreciation Method"
                  name="depreciationMethod"
                  >
                  <Input placeholder='enter deprecation method'/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Row gutter={[9,9]}>
                  <Col span={12}>
                  <Form.Item
                  label="Warranty Expiry"
                  name="warrantyExpiry"
                  >
                  <DatePicker 
                    onChange={handleWarrantyExpiryChange} 
                    style={{width:'100%'}}
                    format="M/D/YYYY"
                    value={selectedWarrantyExpiry ? dayjs(selectedWarrantyExpiry, 'M/D/YYYY') : null}/>
                  </Form.Item>
                  </Col>

                <Col span={12}>
                  <Form.Item
                  label="Maintenance Date"
                  name="maintenanceDate"
                  >
                  <DatePicker
                  onChange={handleMaintenanceDateChange} 
                    style={{width:'100%'}}
                    format="M/D/YYYY"
                    value={selectedMaintenanceDate ? dayjs(selectedMaintenanceDate, 'M/D/YYYY') : null}/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Row gutter={[9,9]}>
                  <Col span={12}>
                  <Form.Item
                  label="Maintenance Hour"
                  name="maintenanceHour"
                  >
                  <InputNumber placeholder='enter maintenance hour' style={{width:'100%'}}/>
                  </Form.Item>
                  </Col>

                <Col span={12}>
                  <Form.Item
                  label="Insurance"
                  name="insurance"
                  >
                  <Input placeholder='enter insurance'/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Row gutter={[9,9]}>
                  <Col span={12}>
                  <Form.Item
                  label="Status"
                  name="status"
                  >
                  <Select
                      placeholder="Select a status"
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Scrapped', label: 'Scrapped' },
                        { value: 'Sold', label: 'Sold' },
                      ]}
                    />
                  </Form.Item>
                  </Col>

                <Col span={12}>
                  <Form.Item
                  label="Attachment"
                  name="attachment"
                  >
                  <Input placeholder='Input attachment'/>
                  </Form.Item>
                  </Col>
                  </Row>

                  <Form.Item
                  label="Remark"
                  name="remark"
                  >
                  <Input placeholder='Input remark'/>
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

export default Asset
