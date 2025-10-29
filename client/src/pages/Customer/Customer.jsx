import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditCustomerModal from './EditCustomerModal';
import DeleteCustomerModal from './DeleteCustomerModal';


const Customer = () => {

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
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/customer/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchCustomer();
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

    const fetchCustomer = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/customer',{
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
             setData(result.customer)
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
        fetchCustomer();
    },[]);

    const columns = [
  {
    title: 'Customer Name',
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
    title: 'VAT Number',
    dataIndex: 'vatnum',
    key: 'vatnum',
  },
  {
    title: 'Credit Limit',
    dataIndex: 'creditLimit',
    key: 'creditLimit',
  },
  {
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
    render: (text, record) => getPaymentLabel(record.paymentId),
  },
  {
    title: 'Sales Region',
    dataIndex: 'salesRegion',
    key: 'salesRegion',
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
        <EditCustomerModal customerObj={record} fetchCustomer={fetchCustomer} payment={payment}/>
        <DeleteCustomerModal customerObj={record} fetchCustomer={fetchCustomer}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Customer
      </Button>
      <Modal
        title="Add Customer"
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
                label="Customer Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Customer name!' }]}
                >
                <Input placeholder="Please enter customer name"/>
                </Form.Item>
                </Col>
                
                <Col span={12}>
                <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
                >
                <Input placeholder="Please enter the address"/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Contact Name"
                name="contactName"
                rules={[{ required: true, message: 'Please input your contact name!' }]}
                >
                <Input placeholder="Please enter the contract name"/>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item
                label="Contact Phone Number"
                name="contactPhoneNumber"
                rules={[{ required: true, message: 'Please input your contact phone number!' }]}
                >
                <Input placeholder="Please enter the phone number"/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="VAT Number"
                name="vatnum"
                >
                <Input placeholder="Please enter the VAT number"/>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item
                label="Credit Limit"
                name="creditLimit"
                >
                <InputNumber placeholder="Please enter the credit limit" style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
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
                </Col>

                <Col span={12}>
                <Form.Item
                label="Sales Region"
                name="salesRegion"
                >
                <Input placeholder="Please enter the sales region"/>
                </Form.Item>
                </Col>
                </Row>

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

export default Customer
