import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditTransferModal = ({transferObj, fetchTransfer, uom, product, productSelection, wareHouse}) => {

      const { userData}=useAuth();
      const [form] = Form.useForm();
      const [selectedDate, setSelectedDate] = useState(null);

      const onChange = value => {
      };
      const onSearch = value => {
      };

      const handleDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedDate(formatted);
    } else {
      setSelectedDate(null);
    }
  };
  // When editing: populate form fields
  useEffect(() => {
    if (transferObj) {
      form.setFieldsValue({
        productId:transferObj.productId,
        quantity:transferObj.quantity, 
        uomId:transferObj.uomId, 
        fromWareHouseId:transferObj.fromWareHouseId,
        toWareHouseId:transferObj.toWareHouseId,  
      });

    }
  }, [transferObj]);
    
        const [isModalOpen, setIsModalOpen] = useState(false);

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
                     const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/transfer/${transferObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchTransfer();
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
        title="Edit Transfer"
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
                           label="Product"
                           name="productId"
                           rules={[{ required: true, message: 'Please select product!' }]}
                           >
                             <Select
                             showSearch
                             placeholder="Select a product"
                             optionFilterProp="label"
                             onChange={handleSelectProductChange}
                             onSearch={onSearch}
                             options={productSelection}
                           />
                           </Form.Item>
                           </Col>
           
                           <Col span={12}>
                           <Form.Item
                           label="Quantity"
                           name="quantity"
                           rules={[{ required: true, message: 'Please input your quantity!' }]}
                           >
                           <InputNumber placeholder="Please enter quantity" style={{width:'100%'}}/>
                           </Form.Item>
                           </Col>
           
                         </Row>
           
                         <Row gutter={[9,9]}>
           
                           <Col span={12}>
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
                           </Col>
           
                           <Col span={12}>
                           <Form.Item
                           label="From"
                           name="fromWareHouseId"
                           rules={[{ required: true, message: 'Please select from which wareHouse!' }]}
                           >
                             <Select
                             showSearch
                             placeholder="Select a warehouse"
                             optionFilterProp="label"
                             onSearch={onSearch}
                             options={wareHouse}
                           />
                           </Form.Item>
                           </Col>
                           </Row>
           
                           <Form.Item
                           label="To"
                           name="toWareHouseId"
                           dependencies={['fromWarehouse']} // Reacts when fromWarehouse changes
                           rules={[
                             { required: true, message: 'Please select a destination warehouse' },
                             ({ getFieldValue }) => ({
                               validator(_, value) {
                                 if (!value || getFieldValue('fromWareHouseId') !== value) {
                                   return Promise.resolve();
                                 }
                                 return Promise.reject(new Error('Source and destination cannot be the same'));
                               },
                             }),
                           ]}
                           >
                             <Select
                             showSearch
                             placeholder="Select a warehouse"
                             optionFilterProp="label"
                             onSearch={onSearch}
                             options={wareHouse}
                           />
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

export default EditTransferModal
