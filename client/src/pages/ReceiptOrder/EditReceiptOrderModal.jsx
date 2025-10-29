import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditReceiptOrderModal = ({receiptOrderObj, fetchReceiptOrder, customer, currency, customerSelection}) => {

      const { userData}=useAuth();
      const [form] = Form.useForm();
      const [selectedDate, setSelectedDate] = useState(null);

      const onChange = value => {
      };
      const onSearch = value => {
      };

  // When editing: populate form fields
  useEffect(() => {
    if (receiptOrderObj) {
      form.setFieldsValue({
        customerId:receiptOrderObj.customerId,
        amount:receiptOrderObj.amount,
        currencyId:receiptOrderObj.currencyId,
        date:dayjs(receiptOrderObj.date), 
        remark:receiptOrderObj.remark, 
      });

    }
  }, [receiptOrderObj]);
    
        const [isModalOpen, setIsModalOpen] = useState(false);

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


                      const handleSelectCustomerChange = (value) => {
              // Find selected PO object
              const selectedCustomer = customer.find(cust => cust._id === value);

              if (selectedCustomer) {
                // Set form fields
                form.setFieldsValue({
                  paymentId: selectedCustomer.paymentId,
                });
              }
            };
    
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
                    //  const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/receiptOrder/${receiptOrderObj._id}`,{
                      const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/receiptOrder/${receiptOrderObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchReceiptOrder();
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
        title="Edit ReceiptOrder"
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
                   label="Customer"
                   name="customerId"
                   rules={[{ required: true, message: 'Please select customer!' }]}
                   >
                     <Select
                     showSearch
                     placeholder="Select a customer"
                     optionFilterProp="label"
                     onChange={handleSelectCustomerChange}
                     onSearch={onSearch}
                     options={customerSelection}
                   />
                   </Form.Item>
                   </Col>
   
                     <Col span={12}>
                     <Form.Item
                     label="Amount"
                     name="amount"
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
                  <Col span={12}>
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

export default EditReceiptOrderModal
