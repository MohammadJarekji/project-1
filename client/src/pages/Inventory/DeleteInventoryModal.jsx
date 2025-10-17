import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {DeleteFilled} from '@ant-design/icons';


const DeleteInventoryModal = ({inventoryObj,fetchInventory}) => {

    const { confirm } = Modal;

                    const handleDelete = async (id)=>{           
                    try{
                        const response = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/inventory/${id}`,{
                                method:'DELETE',
                            }
                        );
                        const result = await response.json();
                        if(result.success){
                            fetchInventory();
                        }   else{
                                console.error("Error deleting Inventory: ",result.message)
                            }
                    }   catch(error){
                            console.error("Error deleting Inventory: ",error)
                        } 
                }

    const showConfirm = () => {
  confirm({
    title: 'Do you want to delete these items?',
    icon: <ExclamationCircleFilled />,
    content: 'Some descriptions',
    onOk() {
        handleDelete(inventoryObj._id)
    },
    onCancel() {
    },
  });
};
    return (    
            <Button  type="link" style={{color:'red'}} onClick={showConfirm}><DeleteFilled /></Button>
       
    )
}

export default DeleteInventoryModal
