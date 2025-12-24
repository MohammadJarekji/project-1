import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Card, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
    const [allproduct, setAllProduct] = useState([]);

    // /////////////////////////////////////////////////////////////////

      const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, getSearchText, searchText, searchedColumn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const fieldValue = getSearchText ? getSearchText(record) : record[dataIndex];
      return String(fieldValue ?? '').toLowerCase().includes(value.toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText || '']}
          autoEscape
          textToHighlight={String(text ?? '')}
        />
      ) : (
        String(text ?? '')
      ),
  });

    // ////////////////////////////////////////////////////////////////
    
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
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/production',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.production)

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

            setProduct(productMapped)
            setProductSelection(assembledproductMapped)
            setAllProduct(result.product)
          
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getProductLabel = (productId) => {
    const found = productSelection.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
  };

  const getAllProductLabel = (productId) => {
    const found = product.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
  };

    useEffect(()=>{
        fetchProduction();
    },[]);

    const columns = [

  {
    title: 'Production Name',
    dataIndex: 'product',
    key: 'product',
     ...getColumnSearchProps('product', (record) => getAllProductLabel(record.productId)),
    render: (text, record) => getAllProductLabel(record.productId),
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
        <EditProductionModal productionObj={record} fetchProduction={fetchProduction} productSelection={productSelection} product={product}/>
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
                name="productId"
                rules={[{ required: true, message: 'Please select a product!' }]}
                >

                <Select
                    showSearch
                    placeholder="Select a product"
                    optionFilterProp="label"
                    options={product}
                  />
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
