import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {DeleteFilled} from '@ant-design/icons';


const DeletePaymentOrderModal = ({paymentOrderObj,fetchPaymentOrder}) => {

    const { confirm } = Modal;

                    const handleDelete = async (id)=>{           
                    try{
                        // const response = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/paymentOrder/${id}`,{
                        const response = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/paymentOrder/${id}`,{
                                method:'DELETE',
                            }
                        );
                        const result = await response.json();
                        if(result.success){
                            fetchPaymentOrder();
                        }   else{
                                console.error("Error deleting PaymentOrder: ",result.message)
                            }
                    }   catch(error){
                            console.error("Error deleting PaymentOrder: ",error)
                        } 
                }

    const showConfirm = () => {
  confirm({
    title: 'Do you want to delete these items?',
    icon: <ExclamationCircleFilled />,
    content: 'Some descriptions',
    onOk() {
        handleDelete(paymentOrderObj._id)
    },
    onCancel() {
    },
  });
};
    return (    
            <Button  type="link" style={{color:'red'}} onClick={showConfirm}><DeleteFilled /></Button>
       
    )
}

export default DeletePaymentOrderModal
