import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditPaymentOrderModal = ({paymentOrderObj, fetchPaymentOrder, vendor, currency}) => {

      const { userData}=useAuth();
      const [form] = Form.useForm();
      const [selectedDate, setSelectedDate] = useState(null);

      const onChange = value => {
      };
      const onSearch = value => {
      };

      const [Date, setDate] = useState(null);
              
                        const handleDateChange = (date) => {
                  if (date) {
                    // Save formatted string like "10/8/2025"
                    const formatted = date.format('M/D/YYYY');
                    setDate(formatted);
                  } else {
                    setDate(null);
                  }
                };

  // When editing: populate form fields
  useEffect(() => {
    if (paymentOrderObj) {
      form.setFieldsValue({
        vendorId:paymentOrderObj.vendorId,
        amount:paymentOrderObj.amount,
        currencyId:paymentOrderObj.currencyId,
        date:dayjs(paymentOrderObj.date),
        remark:paymentOrderObj.remark, 
      });

    }
  }, [paymentOrderObj]);
    
        const [isModalOpen, setIsModalOpen] = useState(false);

              const [formData, setFormData] = useState({
              name:"",
              description:"",
              price:"",
              stock:"",
              userId:"",
              uomId:"",
              categoryId:"",
              warehouseId:"",
              currencyId:"",
          }); 
    
      const showModal = () => {
        setIsModalOpen(true);
      };
    //   const handleOk = () => {
    //     setIsModalOpen(false);
    //   };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values);
             const updatedData = {
                ...values,
                userId: userData._id
            };
            try{
                    //  const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/paymentOrder/${paymentOrderObj._id}`,{
                      const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/paymentOrder/${paymentOrderObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchPaymentOrder();
                handleCancel();
            }catch(error){
                console.error("Error fetching1 user: ",error)
            }
        }
    
        const onFinish = values => {
            handleSubmit(values);
        };
        const onFinishFailed = errorInfo => {
        };
    
    return (
    <>
      <Button type="link" style={{color:'green'}} onClick={showModal}>
          <EditFilled />
      </Button>
   
      <Modal
        title="Edit PaymentOrder"
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
                label="Vendor"
                name="vendorId"
                rules={[{ required: true, message: 'Please select vendor!' }]}
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
                  label="Amount"
                  name="amount"
                  rules={[{ required: true, message: 'Please enter the amount!' }]}
                  >
                  <InputNumber placeholder="Please enter the amount" style={{width:'100%'}}/>
                  </Form.Item>
                  </Col>

              </Row>

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Currency"
                name="currencyId"
                rules={[{ required: true, message: 'Please choose currency!' }]}
                >
                    <Select 
                      placeholder="Select Currency">
                  {currency.map(curr => (
                    <Option key={curr.value} value={curr.value}>
                      {curr.label}
                    </Option>
                  ))}
                </Select>
                </Form.Item>
                </Col>

              <Col span={12}>
                <Form.Item
                  label="Date"
                  name="date"
                  >
                  <DatePicker
                  onChange={handleDateChange} 
                  style={{width:'100%'}}
                  format="M/D/YYYY"
                  value={Date ? dayjs(Date, 'M/D/YYYY') : null}
                  />
                  </Form.Item>
                </Col>
                
              </Row>

              <Row>
                <Col span={24}>
                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the remark"/>
                </Form.Item>
                </Col>
              </Row>


                <Form.Item label={null}>
                <Button style={{float:'right'}} type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
      </Modal>
    </>
    )
}

export default EditPaymentOrderModal
