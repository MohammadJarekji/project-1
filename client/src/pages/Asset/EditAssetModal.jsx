import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditAssetModal = ({assetObj, fetchAsset, vendor, staff}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (assetObj) {
          form.setFieldsValue({
            serialNumber: assetObj.serialNumber,
            name: assetObj.name,
            assetType: assetObj.assetType,
            acquisitionCost: assetObj.acquisitionCost,
            vendorId: assetObj.vendorId,
            location: assetObj.location,
            staffId: assetObj.staffId,
            depreciationMethod: assetObj.depreciationMethod,
            warrantyExpiry: dayjs(assetObj.warrantyExpiry),
            maintenanceDate: dayjs(assetObj.maintenanceDate),
            maintenanceHour: assetObj.maintenanceHour,
            insurance: assetObj.insurance,
            status: assetObj.status,
            attachment: assetObj.attachment,
            remark: assetObj.remark,
          });
        }
      }, [assetObj]);
        
            const [isModalOpen, setIsModalOpen] = useState(false);
        
                  const [formData, setFormData] = useState({
                  name:"",
                  code:"",
              });

          const onChange = value => {
        };
        const onSearch = value => {
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

            const [selectedWarrantyExpiry, setSelectedWarrantyExpiry] = useState(null);
            const [selectedMaintenanceDate, setSelectedMaintenanceDate] = useState(null);


            const handleWarrantyExpiryChange = (date) => {
                if (date) {
                  // Save formatted string like "10/8/2025"
                  const formatted = date.format('M/D/YYYY');
                  setSelectedWarrantyExpiry(formatted);
                } else {
                  setSelectedWarrantyExpiry(null);
                }
              };

            const handleMaintenanceDateChange = (date) => {
                if (date) {
                  // Save formatted string like "10/8/2025"
                  const formatted = date.format('M/D/YYYY');
                  setSelectedMaintenanceDate(formatted);
                } else {
                  setSelectedMaintenanceDate(null);
                }
              };
        
            const handleSubmit = async (values)=>{
                // e.preventDefault();
                setFormData(values);
                try{
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/asset/${assetObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchAsset();
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
                               label="Serial Number"
                               name="serialNumber"
                               >
                               <Input placeholder='Enter the serial number'/>
                               </Form.Item>
                               </Col>
             
                               <Col span={12}>
                               <Form.Item
                               label="Asset Name"
                               name="name"
                               rules={[{ required: true, message: 'Please input your asset name!' }]}
                               >
                               <Input placeholder='Enter the asset name'/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                               <Row gutter={[9,9]}>
                               <Col span={12}>
                               <Form.Item
                               label="Asset Type"
                               name="assetType"
                               rules={[{ required: true, message: 'Please input your asset type!' }]}
                               >
                               <Input placeholder='Enter the asset type'/>
                               </Form.Item>
                               </Col>
                           
                           
                           
                             <Col span={12}>
                               <Form.Item
                               label="Acquisition Cost"
                               name="acquisitionCost"
                               >
                               <InputNumber placeholder='enter acquisition cost' style={{width:'100%'}}/>
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
                               label="Location"
                               name="location"
                               >
                               <Input placeholder='Enter location'/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                             <Row gutter={[9,9]}>
                               <Col span={12}>
                                <Form.Item
                             label="Assigned Staff"
                             name="staffId"
                             >
                               <Select
                               showSearch
                               placeholder="Select a staff"
                               optionFilterProp="label"
                               onChange={onChange}
                               onSearch={onSearch}
                               options={staff}
                             />
                             </Form.Item>
                               </Col>
                           
                             <Col span={12}>
                               <Form.Item
                               label="Depreciation Method"
                               name="depreciationMethod"
                               >
                               <Input placeholder='enter deprecation method'/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                               <Row gutter={[9,9]}>
                               <Col span={12}>
                               <Form.Item
                               label="Warranty Expiry"
                               name="warrantyExpiry"
                               >
                               <DatePicker 
                                 onChange={handleWarrantyExpiryChange} 
                                 style={{width:'100%'}}
                                 format="M/D/YYYY"
                                 value={selectedWarrantyExpiry ? dayjs(selectedWarrantyExpiry, 'M/D/YYYY') : null}/>
                               </Form.Item>
                               </Col>
             
                             <Col span={12}>
                               <Form.Item
                               label="Maintenance Date"
                               name="maintenanceDate"
                               >
                               <DatePicker
                               onChange={handleMaintenanceDateChange} 
                                 style={{width:'100%'}}
                                 format="M/D/YYYY"
                                 value={selectedMaintenanceDate ? dayjs(selectedMaintenanceDate, 'M/D/YYYY') : null}/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                               <Row gutter={[9,9]}>
                               <Col span={12}>
                               <Form.Item
                               label="Maintenance Hour"
                               name="maintenanceHour"
                               >
                               <InputNumber placeholder='enter maintenance hour' style={{width:'100%'}}/>
                               </Form.Item>
                               </Col>
             
                             <Col span={12}>
                               <Form.Item
                               label="Insurance"
                               name="insurance"
                               >
                               <Input placeholder='enter insurance'/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                               <Row gutter={[9,9]}>
                               <Col span={12}>
                               <Form.Item
                               label="Status"
                               name="status"
                               >
                               <Select
                                   placeholder="Select a status"
                                   options={[
                                     { value: 'Active', label: 'Active' },
                                     { value: 'Scrapped', label: 'Scrapped' },
                                     { value: 'Sold', label: 'Sold' },
                                   ]}
                                 />
                               </Form.Item>
                               </Col>
             
                             <Col span={12}>
                               <Form.Item
                               label="Attachment"
                               name="attachment"
                               >
                               <Input placeholder='Input attachment'/>
                               </Form.Item>
                               </Col>
                               </Row>
             
                               <Form.Item
                               label="Remark"
                               name="remark"
                               >
                               <Input placeholder='Input remark'/>
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

export default EditAssetModal
