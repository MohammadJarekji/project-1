import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message  } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';

const EditStaffHoursModalModal = ({StaffWorkObj, fetchStaffWork}) => {

      const [form] = Form.useForm();

    
      // When editing: populate form fields
      useEffect(() => {
        if (StaffWorkObj) {
          form.setFieldsValue({
            name: StaffWorkObj.name,
            hours: StaffWorkObj.hours,

          });
        }
      }, [StaffWorkObj]);
        
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
        
const handleSubmit = async (values) => {
  try {
    const staffName = StaffWorkObj.name; // Current staff name
    const newStaffName = values.name; // New name
    const newHours = values.hours; // New hours

    const res = await fetch(`http://localhost:3000/api/StaffWorkHours/workhours`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        staffName,
        newStaffName,
        newHours,
      }),
    });

    const result = await res.json();

    if (res.status === 200 && result.message === "Staff hours updated successfully") {
      await fetchStaffWork();  // Refresh data
      handleCancel();
      message.success("Staff hours updated successfully");
    } 
    else if (res.status === 400 && result.message.includes("duplicate")) {
      // Handle duplicate name error
      message.error("Attendance for this staff has already been taken today. Please choose a different name.");
    } 
    else {
      message.error(result.message || "Error updating staff hours");
      console.error(result);
    }
  } catch (error) {
    console.error("Error updating staff hours:", error);
    message.error("An unexpected error occurred. Please try again.");
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
                <Form.Item label="Staff Name" name="name" rules={[{ required: true, message: 'Please input the staff name!' }]}>
                  <Input placeholder="Enter staff name" />
                </Form.Item>
                
                <Form.Item label="Hours Worked" name="hours" rules={[{ required: true, message: 'Please input hours worked!' }]}>
                  <InputNumber min={1} max={24} placeholder="Enter staf working hours" style={{width:'100%'}}/>
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

export default EditStaffHoursModalModal
