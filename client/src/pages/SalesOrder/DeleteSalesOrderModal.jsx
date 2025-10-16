import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {DeleteFilled} from '@ant-design/icons';


const DeleteSalesOrderModal = ({salesOrderObj,fetchSalesOrder}) => {

    const { confirm } = Modal;

                    const handleDelete = async (id)=>{           
                    try{
                        const response = await fetch(`http://localhost:3000/api/salesOrder/${id}`,{
                                method:'DELETE',
                            }
                        );
                        const result = await response.json();
                        if(result.success){
                            fetchSalesOrder();
                        }   else{
                                console.error("Error deleting SalesOrder: ",result.message)
                            }
                    }   catch(error){
                            console.error("Error deleting SalesOrder: ",error)
                        } 
                }

    const showConfirm = () => {
  confirm({
    title: 'Do you want to delete these items?',
    icon: <ExclamationCircleFilled />,
    content: 'Some descriptions',
    onOk() {
        handleDelete(salesOrderObj._id)
    },
    onCancel() {
    },
  });
};
    return (    
            <Button  type="link" style={{color:'red'}} onClick={showConfirm}><DeleteFilled /></Button>
       
    )
}

export default DeleteSalesOrderModal
