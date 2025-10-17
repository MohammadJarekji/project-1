import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditWarehouseModal from './EditWarehouseModal';
import DeleteWarehouseModal from './DeleteWarehouseModal';


const Warehouse = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
        const { userData}=useAuth();
    
        const [isModalOpen, setIsModalOpen] = useState(false);
    
              const [formData, setFormData] = useState({
              name:"",
              code:"",
              location:"",
          }); 
    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/warehouse/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchWarehouse();
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

    const fetchWarehouse = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/warehouse',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.warehouse)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    useEffect(()=>{
        fetchWarehouse();
    },[]);

    const columns = [
  {
    title: 'Warehouse Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
    {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditWarehouseModal warehouseObj={record} fetchWarehouse={fetchWarehouse}/>
        <DeleteWarehouseModal warehouseObj={record} fetchWarehouse={fetchWarehouse}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Warehouse
      </Button>
      <Modal
        title="Add Warehouse"
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
                label="Warehouse Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Warehouse name!' }]}
                >
                <Input placeholder='please enter the warehouse name'/>
                </Form.Item>

                <Form.Item
                label="Warehouse Code"
                name="code"
                rules={[{ required: true, message: 'Please input your Warehouse code!' }]}
                >
                <Input placeholder='please enter the warehouse code'/>
                </Form.Item>

                 <Form.Item
                label="Warehouse Location"
                name="location"
                >
                <Input placeholder='please enter the warehouse location'/>
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

export default Warehouse
