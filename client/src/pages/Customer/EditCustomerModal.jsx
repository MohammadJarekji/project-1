import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';

const EditCustomerModal = ({customerObj, fetchCustomer, payment}) => {

      const [form] = Form.useForm();

            const onChange = value => {
      };
      const onSearch = value => {
      };
    
      // When editing: populate form fields
      useEffect(() => {
        if (customerObj) {
          form.setFieldsValue({
            name: customerObj.name,
            address: customerObj.address,
            contactName: customerObj.contactName,
            contactPhoneNumber : customerObj.contactPhoneNumber,
            vatnum: customerObj.vatnum,
            creditLimit: customerObj.creditLimit,
            paymentId: customerObj.paymentId,
            salesRegion: customerObj.salesRegion,
            remark: customerObj.remark,
          });
        }
      }, [customerObj]);
        
            const [isModalOpen, setIsModalOpen] = useState(false);
        
                  const [formData, setFormData] = useState({
                  name:"",
                  code:"",
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
                try{
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/customer/${customerObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchCustomer();
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
        title="Edit Category"
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
    </>
    )
}

export default EditCustomerModal
