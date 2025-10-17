import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {DeleteFilled} from '@ant-design/icons';

const DeletePaymentModal = ({paymentObj, fetchPayment}) => {

        const { confirm } = Modal;
    
                        const handleDelete = async (id)=>{           
                        try{
                            const response = await fetch(`${import.meta.env.VITE_URL_BASE_APP}/api/payment/${id}`,{
                                    method:'DELETE',
                                }
                            );
                            const result = await response.json();
                            if(result.success){
                                fetchPayment();
                            }   else{
                                    console.error("Error deleting Payment: ",result.message)
                                }
                        }   catch(error){
                                console.error("Error deleting Payment: ",error)
                            } 
                    }
    
        const showConfirm = () => {
      confirm({
        title: 'Do you want to delete these items?',
        icon: <ExclamationCircleFilled />,
        content: 'Some descriptions',
        onOk() {
            handleDelete(paymentObj._id)
        },
        onCancel() {
        },
      });
    };

    return (
        <Button  type="link" style={{color:'red'}} onClick={showConfirm}><DeleteFilled /></Button>
    )
}

export default DeletePaymentModal
