import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditCurrencyModal from './EditCurrencyModal';
import DeleteCurrencyModal from './DeleteCurrencyModal';


const Currency = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
        const { userData}=useAuth();
    
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
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/currency/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchCurrency();
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

    const fetchCurrency = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/currency',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.currency)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    useEffect(()=>{
        fetchCurrency();
    },[]);

    const columns = [
  {
    title: 'Currency Name',
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
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditCurrencyModal currencyObj={record} fetchCurrency={fetchCurrency}/>
        <DeleteCurrencyModal currencyObj={record} fetchCurrency={fetchCurrency}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Currency
      </Button>
      <Modal
        title="Add Currency"
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
                label="Currency Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Currency name!' }]}
                >
                <Input placeholder='enter currency name'/>
                </Form.Item>

                <Form.Item
                label="Currency Code"
                name="code"
                rules={[{ required: true, message: 'Please input your Currency code!' }]}
                >
                <Input placeholder='enter currency code'/>
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

export default Currency
