import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditSalesOrderModal = ({salesOrderObj, fetchSalesOrder, uom, currency, customer, payment, product, productSelection, customerSelection}) => {

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
    if (salesOrderObj) {
      form.setFieldsValue({
        customerId:salesOrderObj.customerId,
        productId:salesOrderObj.productId,
        quantity:salesOrderObj.quantity, 
        uomId:salesOrderObj.uomId, 
        price:salesOrderObj.price, 
        currencyId:salesOrderObj.currencyId,
        deliveryDate:dayjs(salesOrderObj.deliveryDate ),
        paymentId:salesOrderObj.paymentId, 
        remark:salesOrderObj.remark, 
      });

    }
  }, [salesOrderObj]);
    
        const [isModalOpen, setIsModalOpen] = useState(false);

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
                     const res = await fetch(`import.meta.env.VITE_URL_BASE_APP/api/salesOrder/${salesOrderObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchSalesOrder();
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
        title="Edit SalesOrder"
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
                           <InputNumber placeholder="Please enter quantity" style={{width:'100%'}}/>
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
                           label="Delivery Date"
                           name="deliveryDate"
                           >
                            <DatePicker
                            onChange={handleDateChange} 
                            style={{width:'100%'}}
                            format="M/D/YYYY"
                            value={selectedDate ? dayjs(selectedDate, 'M/D/YYYY') : null}
                            />
                           </Form.Item>
                             </Col>
                             <Col span={12}>
                             <Form.Item
                           label="Payment"
                           name="paymentId"
                           >
                             <Select
                             open={false}
                             suffixIcon={null}
                             placeholder="Select a payment"
                           >
                           {payment.map(pay => (
                               <Option key={pay.value} value={pay.value}>
                                 {pay.label}
                               </Option>
                             ))}
                             </Select>
                           </Form.Item>
                             </Col>
                             </Row>
           
                           <Form.Item
                           label="Remark"
                           name="remark"
                           >
                           <Input placeholder="Please enter the remark"/>
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

export default EditSalesOrderModal
