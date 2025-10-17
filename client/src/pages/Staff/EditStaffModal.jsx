import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import {EditFilled} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditStaffModal = ({staffObj, fetchStaff}) => {

      const [form] = Form.useForm();
      const [selectedDOF, setselectedDOF] = useState(null);
      const [selectedJoinedDate, setselectedJoinedDate] = useState(null);
      const [selectedHireDate, setSelectedHireDate] = useState(null);

      const handleDOFChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setselectedDOF(formatted);
    } else {
      setselectedDOF(null);
    }
  };

  const handleJoinedDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setselectedJoinedDate(formatted);
    } else {
      setselectedJoinedDate(null);
    }
  };

  const handleHireDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedHireDate(formatted);
    } else {
      setSelectedHireDate(null);
    }
  };
    
      // When editing: populate form fields
      useEffect(() => {
        if (staffObj) {
          form.setFieldsValue({
            name: staffObj.name,
            role: staffObj.role,
            dob: dayjs(staffObj.dob),
            phoneNumber: staffObj.phoneNumber,
            joinedDate: dayjs(staffObj.joinedDate),
            hireDate: dayjs(staffObj.hireDate),
          });
        }
      }, [staffObj]);
        
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
        
            const handleSubmit = async (values)=>{
                // e.preventDefault();
                setFormData(values);
                try{
        
                         const res = await fetch(`import.meta.env.VITE_URL_BASE_APP/api/staff/${staffObj._id}`,{
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify(values),
                    });
                    const result = await res.json();
                    await fetchStaff();
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
                             label="Staff Name"
                             name="name"
                             rules={[{ required: true, message: 'Please input your Staff name!' }]}
                             >
                             <Input placeholder='Enter staff name'/>
                             </Form.Item>
             
                             <Form.Item
                             label="Role"
                             name="role"
                             rules={[{ required: true, message: 'Please input your Staff role!' }]}
                             >
                             <Input placeholder='Enter staff role'/>
                             </Form.Item>
             
                             <Form.Item
                             label="Date Of Birth"
                             name="dob"
                             >
                             <DatePicker 
                                              onChange={handleDOFChange} 
                                              style={{width:'100%'}}
                                              format="M/D/YYYY"
                                              value={selectedDOF ? dayjs(selectedDOF, 'M/D/YYYY') : null}/>
                             </Form.Item>
             
                             <Form.Item
                             label="Phone Number"
                             name="phoneNumber"
                             >
                             <Input placeholder='Enter staff phone number'/>
                             </Form.Item>
             
                             <Form.Item
                             label="Joined Date"
                             name="joinedDate"
                             >
                             <DatePicker 
                                              onChange={handleJoinedDateChange} 
                                              style={{width:'100%'}}
                                              format="M/D/YYYY"
                                              value={selectedJoinedDate ? dayjs(selectedJoinedDate, 'M/D/YYYY') : null}
                                              />
                             </Form.Item>
             
                             <Form.Item
                             label="Hire Date"
                             name="hireDate"
                             >
                             <DatePicker 
                                              onChange={handleHireDateChange} 
                                              style={{width:'100%'}}
                                              format="M/D/YYYY"
                                              value={selectedHireDate ? dayjs(selectedHireDate, 'M/D/YYYY') : null}/>
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

export default EditStaffModal
