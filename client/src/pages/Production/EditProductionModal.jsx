import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select, InputNumber, Card, Space } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const EditProductionModal = ({productionObj, fetchProduction,  productSelection, product}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (productionObj) {
          form.setFieldsValue({
            productId:productionObj.productId,
            name: productionObj.name,         
            assembledProduct: productionObj.assembledProduct,
          });
        }
      }, [productionObj]);
        
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

           const onSearch = value => {
        };
    
            const handleSubmit = async (values)=>{
                // e.preventDefault();
                setFormData(values);
                try{
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/production/${productionObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchProduction();
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
                               label="Production Name"
                               name="productId"
                               >
               
                               <Select
                                    showSearch
                                    placeholder="Select a product"
                                    optionFilterProp="label"
                                    options={product}
                                  />
                               </Form.Item>
                             
                             {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                           <Card title="Assembled Product" style={{ border: 'none' }}>
                 <Form.List name="assembledProduct">
                   {(fields, { add, remove }) => (
                     <>
                       {fields.map(({ key, name }) => (
                         <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                           <Col span={10}>
                             <Form.Item
                               label="Product"
                               name={[name, 'productId']}
                               rules={[{ required: true, message: 'Missing Product' }]}
                             >
                               <Select
                                 showSearch
                                 placeholder="Select product"
                                 optionFilterProp="label"
                                 onSearch={onSearch}
                                 options={productSelection}
                                 style={{ width: '100%' }}
                               />
                             </Form.Item>
                           </Col>
               
                           <Col span={10}>
                             <Form.Item
                               label="Quantity"
                               name={[name, 'quantity']}
                             >
                               <InputNumber placeholder="quantity" style={{ width: '100%' }} />
                             </Form.Item>
                           </Col>
               
                           <Col span={4}>
                             <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18 }} />
                           </Col>
                         </Row>
                       ))}
               
                       <Form.Item>
                         <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                           Add Product
                         </Button>
                       </Form.Item>
                     </>
                   )}
                 </Form.List>
               </Card>
               
               
                             {/* ///////////////////////////////////////////////////////////////////////////////////// */}

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

export default EditProductionModal
