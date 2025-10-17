import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';

const EditVendorModal = ({vendorObj, fetchVendor, payment}) => {

      const [form] = Form.useForm();

            const onChange = value => {
      };
      const onSearch = value => {
      };
    
      // When editing: populate form fields
      useEffect(() => {
        if (vendorObj) {
          form.setFieldsValue({
            name: vendorObj.name,
            address: vendorObj.address,
            contactName: vendorObj.contactName,
            contactPhoneNumber : vendorObj.contactPhoneNumber,
            paymentId: vendorObj.paymentId,
            creditLimit: vendorObj.creditLimit,
            remark: vendorObj.remark,
          });
        }
      }, [vendorObj]);
        
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
        
                         const res = await fetch(`import.meta.env.VITE_URL_BASE_APP/api/vendor/${vendorObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchVendor();
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
    </>
    )
}

export default EditVendorModal
