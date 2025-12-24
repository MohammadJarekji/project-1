import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select, InputNumber, Card, Space } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const EditAssemblyModal = ({assemblyObj, fetchAssembly, uom, asset, product, productSelection, productAssemdledSelection, usedData}) => {

      const [form] = Form.useForm();
      const [isModalOpen, setIsModalOpen] = useState(false);
    
      // When editing: populate form fields
     useEffect(() => {
  if (assemblyObj) {
    form.setFieldsValue({
      productId: assemblyObj.productId, // main productId
      startDate: assemblyObj.startDate ? dayjs(assemblyObj.startDate) : null,
      endDate: assemblyObj.endDate ? dayjs(assemblyObj.endDate) : null,
      laborHours: assemblyObj.laborHours,
      status: assemblyObj.status,
      lines: assemblyObj.lines.map(line => ({
        ...line,
        productId: line.productId,  // Set the productId for each line item
      })),
      assetId: assemblyObj.assetId,
      hours: assemblyObj.hours,
    });

  }
}, [assemblyObj]);  // Make sure form is included in the dependency array
        
            
        

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
            setWarningMessage();

          };

           const onSearch = value => {
        };

              const [startDate, setStartDate] = useState(null);
              const [endDate, setEndDate] = useState(null);
              const [warningMessage, setWarningMessage] = useState('');

              // Function to check if a product is already in use (excluding the current assembly)
              const checkIfProductUsedInAssembly = (selectedProductId) => {
                return usedData.some(
                  (assembly) => assembly.productId === selectedProductId && assembly._id !== assemblyObj._id
                );
              };

              const handleMainProductChange = (value) => {

                console.log("this is the value: ",value)
                
                 form.setFieldsValue({ productId: value });

                // Check if the selected product is already used in any assembly
                if (checkIfProductUsedInAssembly(value)) {
                  setWarningMessage("This product has already been assembled and cannot be used again.");
                  console.log("good")
                } else {
                  setWarningMessage('');  // Clear the warning if the product is not used
                  console.log("bad")
                 
                }
              };

              const handleSelectProductChange = (value, index) => {
              const selectedProduct = product.find(p => p._id === value);

                if (selectedProduct) {
                  const currentValues = form.getFieldValue("lines") || [];
                  const updatedLines = [...currentValues];
                  updatedLines[index] = {
                    ...updatedLines[index],
                    productId: value,
                    uomId: selectedProduct.uomId,
                  };

                  form.setFieldsValue({
                    lines: updatedLines,
                  });
                }
              };

              const handleStartDateChange = (date) => {
              if (date) {
                // Save formatted string like "10/8/2025"
                const formatted = date.format('M/D/YYYY');
                setStartDate(formatted);
              } else {
                setStartDate(null);
              }
            };

            const handleEndDateChange = (date) => {
              if (date) {
                // Save formatted string like "10/8/2025"
                const formatted = date.format('M/D/YYYY');
                setEndDate(formatted);
              } else {
                setEndDate(null);
              }
            };

        
            const handleSubmit = async (values)=>{
                // e.preventDefault();
                const isProductUsed = checkIfProductUsedInAssembly(values.productId);

                // If the product is already used in another assembly, display a warning and prevent submission
                if (isProductUsed) {
                    setWarningMessage("This product has already been assembled and cannot be used again.");
                    return;  // Prevent form submission if the product is already in use
                }

                setFormData(values);
                try{
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/assembly/${assemblyObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchAssembly();
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
                                label="Assembled Product"
                                name="productId"
                                rules={[{ required: true, message: 'Please select an assembled product!' }]}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select an assembled product"
                                  optionFilterProp="label"
                                  onSearch={onSearch}
                                  options={productAssemdledSelection}
                                  defaultValue={assemblyObj?.productId}
                                  onChange={handleMainProductChange}
                                  // value={form.getFieldValue('productId')}
                                />
                                {warningMessage && (
                                  <div style={{ color: 'red', marginTop: 5 }}>
                                    {warningMessage}
                                  </div>
                                )}
                              </Form.Item>
                             </Col>
             
                             <Col span={12}>
                             <Form.Item
                             label="Start Date"
                             name="startDate"
                             >
                             <DatePicker 
                             onChange={handleStartDateChange} 
                             style={{width:'100%'}}
                             format="M/D/YYYY"
                             value={startDate ? dayjs(startDate, 'M/D/YYYY') : null}
                             />
                             </Form.Item>
                             </Col>
                           </Row>
             
                             <Row gutter={[9,9]}>
                             <Col span={12}>
                             <Form.Item
                             label="End Date"
                             name="endDate"
                             >
                             <DatePicker 
                             onChange={handleEndDateChange} 
                             style={{width:'100%'}}
                             format="M/D/YYYY"
                             value={endDate ? dayjs(endDate, 'M/D/YYYY') : null}
                             />
                             </Form.Item>
                             </Col>
             
                             <Col span={12}>
                             <Form.Item
                             label="Labor Hours"
                             name="laborHours"
                             >
                             <InputNumber placeholder='Enter the labour hours ' style={{width:'100%'}}/>
                             </Form.Item>
                             </Col>
                             </Row>
             
                             <Row gutter={[9,9]}>
                               <Col span={12}>
                             <Form.Item
                             label="Status"
                             name="status"
                             rules={[{ required: true, message: 'Please select the status!' }]}
                             >
             
                             <Select
                               placeholder='Select the status '
                               options={[
                                 { value: 'Planned', label: 'Planned' },
                                 { value: 'In Progress', label: 'In Progress' },
                                 { value: 'Finished', label: 'Finished' },
                               ]}
                             />
                             </Form.Item>
                             </Col>
             
                             <Col span={12}>
                             <Form.Item
                             label="Asset"
                             name="assetId"
                             >
                             <Select
                               showSearch
                               placeholder="Select an asset"
                               optionFilterProp="label"
                               onSearch={onSearch}
                               options={asset}
                             />
                             </Form.Item>
                             </Col>
                             </Row>
             
                             <Form.Item
                             label="Hours"
                             name="hours"
                             >
                             <InputNumber placeholder='Select the hours ' style={{width:'100%'}}/>
                             </Form.Item>
             
                           {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                           <Card title={"Lines"} style={{border: 'none'}}>
                              <Form.List name="lines" label="Lines">
                   {(fields, { add, remove }) => (
                     <>
                       {fields.map(({ key, name, ...restField }) => (
                         <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                           <Form.Item
                             label="Product"
                             {...restField}
                             name={[name, 'productId']}
                             rules={[{ required: true, message: 'Missing product' }]}
                           >
                             <Select
                               showSearch
                               placeholder="Select product"
                               optionFilterProp="label"
                               onChange={(value) => handleSelectProductChange(value, name)}
                               onSearch={onSearch}
                               options={productSelection}
                             />
                           </Form.Item>
                           <Form.Item
                             label="Quantity"
                             {...restField}
                             name={[name, 'quantity']}
                             rules={[{ required: true, message: 'Missing quantity' }]}
                           >
                             <Input placeholder="quantity" />
                           </Form.Item>
             
                           <Form.Item
                             label="UOM"
                             {...restField}
                             name={[name, 'uomId']}
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
                           <MinusCircleOutlined onClick={() => remove(name)} />
                         </Space>
                       ))}
                       <Form.Item>
                         <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                           Add field
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

export default EditAssemblyModal
