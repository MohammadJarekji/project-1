import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditVendorModal from './EditVendorModal';
import DeleteVendorModal from './DeleteVendorModal';


const Vendor = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);
     const [payment, setPayment] = useState([]); 
        const { userData}=useAuth();
   
        const [isModalOpen, setIsModalOpen] = useState(false);
    
              const [formData, setFormData] = useState({
              name:"", 
              address:"", 
              contactName:"", 
              contactPhoneNumber:"", 
              paymentId:"",
              creditLimit:"",
              remark:"" 
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
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch('http://localhost:3000/api/vendor/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchVendor();
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

    const fetchVendor = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/vendor',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             const payment = result.payment.map(pay => ({
                  value: pay._id,
                  label: pay.code,
                }));
             setData(result.vendor)
             setPayment(payment)

        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

        const getPaymentLabel = (paymentId) => {
    const found = payment.find(u => u.value === paymentId);
    return found ? found.label : 'Unknown Payment';
  };

    useEffect(()=>{
        fetchVendor();
    },[]);

    const columns = [
  {
    title: 'Vendor Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Contact Name',
    dataIndex: 'contactName',
    key: 'contactName',
  },
    {
    title: 'Contact Phone Number',
    dataIndex: 'contactPhoneNumber',
    key: 'contactPhoneNumber',
  },
  {
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
    render: (text, record) => getPaymentLabel(record.paymentId),
  },
  {
    title: 'Credit limit',
    dataIndex: 'creditLimit',
    key: 'creditLimit',
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
        <EditVendorModal vendorObj={record} fetchVendor={fetchVendor} payment={payment}/>
        <DeleteVendorModal vendorObj={record} fetchVendor={fetchVendor}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Vendor
      </Button>
      <Modal
        title="Add Vendor"
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
                label="Vendor Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Vendor name!' }]}
                >
                <Input placeholder="Please enter vendor name"/>
                </Form.Item>

                <Form.Item
                label="Address"
                name="address"
                >
                <Input placeholder="Please enter the address"/>
                </Form.Item>

                <Form.Item
                label="Contact Name"
                name="contactName"
                rules={[{ required: true, message: 'Please input your contact name!' }]}
                >
                <Input placeholder="Please enter the contract name"/>
                </Form.Item>

                <Form.Item
                label="Contact Phone Number"
                name="contactPhoneNumber"
                rules={[{ required: true, message: 'Please input your contact phone number!' }]}
                >
                <Input placeholder="Please enter the phone number"/>
                </Form.Item>

                <Form.Item
                label="Payment"
                name="paymentId"
                >
                  <Select
                  showSearch
                  placeholder="Select a Payment"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={payment}
                />
                </Form.Item>

                <Form.Item
                label="Credit Limit"
                name="creditLimit"
                >
                <Input placeholder="Please enter the credit limit"/>
                </Form.Item>

                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the Remark"/>
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

export default Vendor
