import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select, InputNumber, Card, Space } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const EditProjectDetailsModal = ({projectDetailsObj, fetchProjectDetails, staff, asset, project}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (projectDetailsObj) {
          form.setFieldsValue({
            projectId: projectDetailsObj.projectId,
            staff: projectDetailsObj.staff,
            asset: projectDetailsObj.asset,
          });
        }
      }, [projectDetailsObj]);
        
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
        
                         const res = await fetch(`http://localhost:3000/api/projectDetails/${projectDetailsObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchProjectDetails();
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
                              label="Project"
                              name="projectId"
                              rules={[{ required: true, message: 'Please select a project!' }]}
                              >
              
                              <Select
                                showSearch
                                placeholder="Select project"
                                optionFilterProp="label"
                                onSearch={onSearch}
                                options={project}
                              />
                              </Form.Item>
                            
                            {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                          <Card title="Staff" style={{ border: 'none' }}>
                <Form.List name="staff">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name }) => (
                        <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                          <Col span={10}>
                            <Form.Item
                              label="Staff"
                              name={[name, 'staffId']}
                            >
                              <Select
                                showSearch
                                placeholder="Select staff"
                                optionFilterProp="label"
                                onSearch={onSearch}
                                options={staff}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
              
                          <Col span={10}>
                            <Form.Item
                              label="Hours"
                              name={[name, 'hours']}
                            >
                              <InputNumber placeholder="hours" style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
              
                          <Col span={4}>
                            <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18 }} />
                          </Col>
                        </Row>
                      ))}
              
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Staff
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
              
              
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
                              label="Hours"
                              name={[name, 'hours']}
                            >
                              <InputNumber placeholder="hours" style={{ width: '100%' }} />
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

export default EditProjectDetailsModal
