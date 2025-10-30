import React,{useState, useEffect} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Card, Select } from 'antd';
import{useAuth} from '../../contexts/AuthContext';
import EditProductionModal from './EditProductionModal';
import DeleteProductionModal from './DeleteProductionModal';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';


const Production = () => {

     const [form] = Form.useForm();
    const [data, setData] = useState([]);
    
   

    const [product, setProduct] = useState([]);
    const [productSelection, setProductSelection] = useState([]);

    console.log('Product Selection data: ',productSelection)
    
        const [isModalOpen, setIsModalOpen] = useState(false);
    
              const [formData, setFormData] = useState({
              name:"",
              code:"",
          }); 
    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };



      const onChange = value => {
        };
        const onSearch = value => {
        };
        
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/production/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchProduction();
                handleCancel();
            }catch(error){
                console.error("Error fetching1 user: ",error)
            }
        }
    
        const onFinish = values => {
            handleSubmit(values);
              form.resetFields();
        };
        const onFinishFailed = errorInfo => {
        };

    const fetchProduction = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/production',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.production)

            console.log("result: ",result)

            const productMapped = result.product.map( prod =>({
              value: prod._id,
              label: prod.name,
            }));

            

             const assembledproductMapped = result.product
              .filter(prod => prod.assembled === true) // only assembled products
              .map(prod => ({
                value: prod._id,
                label: prod.name,
              }));

              console.log("Assembled Product mapped: ",assembledproductMapped)

            setProduct(productMapped)
            setProductSelection(assembledproductMapped)
          
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getProductLabel = (productId) => {
    const found = productSelection.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
  };

    useEffect(()=>{
        fetchProduction();
    },[]);

    const columns = [

  {
    title: 'Production Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Assembled Product',
    key: 'assembledProduct',
    children: [
      {
        title: 'Product',
        key: 'productId',
        render: (_, record) => (
          <>
            {record.assembledProduct.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {getProductLabel(line.productId)}
              </div>
            ))}
          </>
        ),
      },
      {
        title: 'Quantity',
        key: 'quantity',
        render: (_, record) => (
          <>
            {record.assembledProduct.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {line.quantity}
              </div>
            ))}
          </>
        ),
      },
    ],
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditProductionModal productionObj={record} fetchProduction={fetchProduction} productSelection={productSelection}/>
        <DeleteProductionModal productionObj={record} fetchProduction={fetchProduction}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Production
      </Button>
      <Modal
        width={700}
        title="Add Production"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
            <Form
            form={form}
                name="basic"
                layout='vertical'
                style={{ maxWidth: 700, }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                label="Production Name"
                name="name"
                >

                <Input placeholder='Input Production Name'/>
                </Form.Item>
              
              {/* ///////////////////////////////////////////////////////////////////////////////////// */}
            <Card title="Assembled Product" style={{ border: 'none' }}>
  <Form.List name="assembledProduct">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name }) => (
          <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
            <Col span={10}>
              <Form.Item
                label="Product"
                name={[name, 'productId']}
                rules={[{ required: true, message: 'Missing Product' }]}
              >
                <Select
                  showSearch
                  placeholder="Select product"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={productSelection}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                label="Quantity"
                name={[name, 'quantity']}
              >
                <InputNumber placeholder="quantity" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18 }} />
            </Col>
          </Row>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Product
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
        <Table columns={columns} dataSource={data}   scroll={{ x: 'calc(100vh - 200px)' }}/>
        </>
    )
}

export default Production
