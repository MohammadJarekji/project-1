import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditProjectModal = ({projectObj, fetchProject}) => {

      const [form] = Form.useForm();
    
      // When editing: populate form fields
      useEffect(() => {
        if (projectObj) {
          form.setFieldsValue({
            name: projectObj.name,
            location: projectObj.location,
            type: projectObj.type,
            cost: projectObj.cost,
            fromDate: dayjs(projectObj.fromDate),
            toDate: dayjs(projectObj.toDate),
          });
        }
      }, [projectObj]);
        
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

          const [startDate, setStartDate] = useState(null);
          const [endDate, setEndDate] = useState(null);

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
                setFormData(values);
                try{
        
                         const res = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/project/${projectObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchProject();
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
                label="Project Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Project name!' }]}
                >
                <Input placeholder='Enter project name'/>
                </Form.Item>

                <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please input the location!' }]}
                >
                <Input placeholder='enter location'/>
                </Form.Item>

                <Form.Item
                label="Project Type"
                name="type"
                rules={[{ required: true, message: 'Please input the type of the Project!' }]}
                >
                <Input placeholder='enter the type of the project'/>
                </Form.Item>

                <Form.Item
                label="Cost"
                name="cost"
                rules={[{ required: true, message: 'Please input your cost!' }]}
                >
                <Input placeholder='Enter cost'/>
                </Form.Item>

                <Form.Item
                label="Start Date"
                name="fromDate"
                rules={[{ required: true, message: 'Please input the start date!' }]}
                >
                <DatePicker
                onChange={handleStartDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={startDate ? dayjs(startDate, 'M/D/YYYY') : null}
                 />
                </Form.Item>

                <Form.Item
                label="End Date"
                name="toDate"
                rules={[{ required: true, message: 'Please input the end date!' }]}
                >
                <DatePicker 
                onChange={handleEndDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={endDate ? dayjs(endDate, 'M/D/YYYY') : null}
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

export default EditProjectModal
