import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select, InputNumber, Card, Space } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const EditDieselModal = ({dieselObj, fetchDiesel, uom, asset, product, productSelection}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (dieselObj) {
          form.setFieldsValue({
            productId: dieselObj.productId,
            uomId: dieselObj.uomId,
            machineCounter: dieselObj.machineCounter,
            averageCost: dieselObj.averageCost,
            asset: dieselObj.asset,
          });
        }
      }, [dieselObj]);
        
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
        
                         const res = await fetch(`http://localhost:3000/api/diesel/${dieselObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchDiesel();
                    handleCancel();
                }catch(error){
                    console.error("Error fetching1 user: ",error)
                }
            }

            const handleSelectProductChange = (value) => {
              // Find selected PO object
              const selectedProduct = product.find(pro => pro._id === value);

              if (selectedProduct) {
                // Set form fields
                form.setFieldsValue({
                  uomId: selectedProduct.uomId,
                });
              }
            };
        
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
                             label="Product"
                             name="productId"
                             rules={[{ required: true, message: 'Please select an assembled product!' }]}
                             >
             
                             <Select
                               showSearch
                               placeholder="Select product"
                               optionFilterProp="label"
                               onChange={handleSelectProductChange}
                               onSearch={onSearch}
                               options={productSelection}
                             />
                             </Form.Item>
             
                               <Form.Item
                                 label="UOM"
                                 name="uomId"
                                 >
                                   <Select
                                     open={false}
                                     suffixIcon={null}
                                     placeholder="Select UOM">
                                       {uom.map(uom => (
                                         <Option key={uom.value} value={uom.value}>
                                           {uom.label}
                                         </Option>
                                       ))}
                                     </Select>
                                 </Form.Item>
             
                                   <Form.Item
                                 label="Machine Counter Number"
                                 name="machineCounter"
                                 >
                                  <InputNumber placeholder='Enter machine counter number' style={{width:'100%'}}/>
                                 </Form.Item>
             
                                 <Form.Item
                                 label="Average Cost of Diesel per Counter"
                                 name="averageCost"
                                 >
                                  <InputNumber placeholder='Enter average cost' style={{width:'100%'}}/>
                                 </Form.Item>
                           
                           {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                        
                <Card title="Asset" style={{ border: 'none' }}>
               <Form.List name="asset">
                 {(fields, { add, remove }) => (
                   <>
                     {fields.map(({ key, name }) => (
                       <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                         <Col span={10}>
                           <Form.Item
                             label="Asset"
                             name={[name, 'assetId']}
                             rules={[{ required: true, message: 'Missing asset' }]}
                           >
                             <Select
                               showSearch
                               placeholder="Select asset"
                               optionFilterProp="label"
                               onSearch={onSearch}
                               options={asset}
                               style={{ width: '100%' }}
                             />
                           </Form.Item>
                         </Col>
             
                         <Col span={10}>
                           <Form.Item
                             label="Quantity"
                             name={[name, 'quantity']}
                             rules={[{ required: true, message: 'Missing quantity' }]}
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
                         Add Asset
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

export default EditDieselModal
