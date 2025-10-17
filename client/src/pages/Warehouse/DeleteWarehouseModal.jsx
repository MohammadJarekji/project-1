import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {DeleteFilled} from '@ant-design/icons';

const DeleteWarehouseModal = ({warehouseObj, fetchWarehouse}) => {

        const { confirm } = Modal;
    
                        const handleDelete = async (id)=>{           
                        try{
                            const response = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/warehouse/${id}`,{
                                    method:'DELETE',
                                }
                            );
                            const result = await response.json();
                            if(result.success){
                                fetchWarehouse();
                            }   else{
                                    console.error("Error deleting Warehouse: ",result.message)
                                }
                        }   catch(error){
                                console.error("Error deleting Warehouse: ",error)
                            } 
                    }
    
        const showConfirm = () => {
      confirm({
        title: 'Do you want to delete these items?',
        icon: <ExclamationCircleFilled />,
        content: 'Some descriptions',
        onOk() {
            handleDelete(warehouseObj._id)
        },
        onCancel() {
        },
      });
    };

    return (
        <Button  type="link" style={{color:'red'}} onClick={showConfirm}><DeleteFilled /></Button>
    )
}

export default DeleteWarehouseModal
