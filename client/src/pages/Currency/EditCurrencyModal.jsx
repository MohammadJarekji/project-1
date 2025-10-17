import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';

const EditCurrencyModal = ({currencyObj, fetchCurrency}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (currencyObj) {
          form.setFieldsValue({
            name: currencyObj.name,
            code: currencyObj.code,
          });
        }
      }, [currencyObj]);
        
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
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/currency/${currencyObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchCurrency();
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
                label="Category Name"
                name="name"
                rules={[{ required: true, message: 'Please input your currency name!' }]}
                >
                <Input placeholder='enter currency name'/>
                </Form.Item>

                <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please input the code!' }]}
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
    </>
    )
}

export default EditCurrencyModal
