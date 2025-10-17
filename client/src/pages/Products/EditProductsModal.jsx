import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';

const EditProductsModal = ({productObj, fetchProducts, uom, category, warehouse, currency, vendor}) => {

      const { userData}=useAuth();
      const [form] = Form.useForm();

      const onChange = value => {
      };
      const onSearch = value => {
      };

  // When editing: populate form fields
  useEffect(() => {
    if (productObj) {
      form.setFieldsValue({
        name:productObj.name, 
        description:productObj.description, 
        uomId:productObj.uomId, 
        price:productObj.price, 
        currencyId:productObj.currencyId, 
        categoryId:productObj.categoryId, 
        warehouseId:productObj.warehouseId, 
        minStkLevel:productObj.minStkLevel, 
        maxStkLevel:productObj.maxStkLevel, 
        reorderPoint:productObj.reorderPoint, 
        vendorId:productObj.vendorId, 
        blocked:productObj.blocked, 
        assembled:productObj.assembled, 
        remark:productObj.remark, 
      });

    }
  }, [productObj]);
    
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
                     const res = await fetch(`import.meta.env.VITE_URL_BASE_APP/api/product/${productObj._id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                await fetchProducts();
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
        title="Edit Product"
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
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please input your product name!' }]}
                >
                <Input placeholder="Please enter product name"/>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item
                label="Description"
                name="description"
                >
                <Input placeholder="Please enter description"/>
                </Form.Item>
                </Col>
              </Row>

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="UOM"
                name="uomId"
                rules={[{ required: true, message: 'Please input the number of uom!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a uom"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={uom}
                />
                </Form.Item>
                </Col>
           
                  <Col span={12}>
                <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input the price!' }]}
                >
                <InputNumber placeholder="Please enter the price" style={{width:'100%'}}/>
                </Form.Item>
                  </Col>
                  </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Currency"
                name="currencyId"
                rules={[{ required: true, message: 'Please input the number of currency!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a currency"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={currency}
                />
                </Form.Item>
                </Col>

                  <Col span={12}>
                <Form.Item
                label="Category"
                name="categoryId"
                >
                  <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={category}
                />
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Warehouse"
                name="warehouseId"
                >
                  <Select
                  showSearch
                  placeholder="Select a warehouse"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={warehouse}
                />
                </Form.Item>
                </Col>
          
                  <Col span={12}>
                <Form.Item
                label="Minimum Stock"
                name="minStkLevel"
                >
                <InputNumber placeholder="Please enter the stock" style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Maximum Stock"
                name="maxStkLevel"
                >
                <InputNumber placeholder="Please enter the stock" style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                
                  <Col span={12}>
                <Form.Item
                label="Re-order Point"
                name="reorderPoint"
                >
                <InputNumber placeholder="Please enter the re-order" style={{width:'100%'}}/>
                </Form.Item>
                  </Col>
                  </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                <Form.Item
                label="Vendor"
                name="vendorId"
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
                label="Blocked"
                name="blocked"
                >
                    <Select
                    placeholder="select a block type"
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                    />
                </Form.Item>
                </Col>
                </Row>
                
                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Assembled"
                name="assembled"
                >
                    <Select
                    placeholder="select a assemble type"
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                    />
                </Form.Item>
                </Col>
                
                <Col span={12}>
                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the blocked"/>
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

export default EditProductsModal
