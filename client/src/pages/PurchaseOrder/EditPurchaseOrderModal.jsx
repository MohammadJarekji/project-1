import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditPurchaseOrderModal = ({purchaseOrderObj, fetchPurchaseOrder, uom, currency, vendor, payment, product, productSelection}) => {

      const { userData}=useAuth();
      const [form] = Form.useForm();

      const onChange = value => {
      };
      const onSearch = value => {
      };

  // When editing: populate form fields
  useEffect(() => {
    if (purchaseOrderObj) {
      form.setFieldsValue({
        vendorId:purchaseOrderObj.vendorId,
        productId:purchaseOrderObj.productId,
        quantity:purchaseOrderObj.quantity, 
        uomId:purchaseOrderObj.uomId, 
        price:purchaseOrderObj.price, 
        currencyId:purchaseOrderObj.currencyId,
        paymentId:purchaseOrderObj.paymentId,
        date:dayjs(purchaseOrderObj.date), 
        remark:purchaseOrderObj.remark, 
      });

    }
  }, [purchaseOrderObj]);
    
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


                    const handleSelectProductChange = (value) => {
              // Find selected PO object
              const selectedProduct = product.find(pro => pro._id === value);

              if (selectedProduct) {
                // Set form fields
                form.setFieldsValue({
                  uomId: selectedProduct.uomId,
                  currencyId: selectedProduct.currencyId,
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
                     const res = await fetch(`http://localhost:3000/api/purchaseOrder/${purchaseOrderObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchPurchaseOrder();
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
        title="Edit PurchaseOrder"
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
                         </Row>
           
                         <Row gutter={[9,9]}>
                           <Col span={12}>
                           <Form.Item
                           label="Quantity"
                           name="quantity"
                           rules={[{ required: true, message: 'Please input your quantity!' }]}
                           >
                           <InputNumber placeholder="Please enter Quantity" style={{width:'100%'}}/>
                           </Form.Item>
                           </Col>
           
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
                           </Row>
           
                           <Row gutter={[9,9]}>
                             <Col span={12}>
                           <Form.Item
                           label="Price"
                           name="price"
                           rules={[{ required: true, message: 'Please input the price!' }]}
                           >
                           <InputNumber placeholder="Please enter the price" style={{width:'100%'}}/>
                           </Form.Item>
                             </Col>
                           <Col span={12}>
           
                           <Form.Item
                           label="Currency"
                           name="currencyId"
                           >
                               <Select 
                                 open={false}
                                 suffixIcon={null}
                                 placeholder="Select Currency">
                             {currency.map(curr => (
                               <Option key={curr.value} value={curr.value}>
                                 {curr.label}
                               </Option>
                             ))}
                           </Select>
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
                             placeholder="Select a payment"
                             optionFilterProp="label"
                             onChange={onChange}
                             onSearch={onSearch}
                             options={payment}
                           />
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

export default EditPurchaseOrderModal
