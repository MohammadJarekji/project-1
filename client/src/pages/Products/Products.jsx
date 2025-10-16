import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber   } from 'antd';
import EditProductsModal from './EditProductsModal';
import{useAuth} from '../../contexts/AuthContext';
import DeleteProductModal from './DeleteProductModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const Products = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 

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

        const { userData}=useAuth();
    
        const [isModalOpen, setIsModalOpen] = useState(false);

        const onChange = value => {
        };
        const onSearch = value => {
        };
    
              const [formData, setFormData] = useState({
              name:"",
              description:"",
              price:"",
              stock:"",
              userId:"",
              uomId:"",
              warehouseId:"",
              categoryId:"",
              currencyId:"",
              vendorId:""
          }); 

          const [uom, setUOM] = useState([]);
          const [category, setCategory] = useState([]);
          const [warehouse, setwarehouse] = useState([]);
          const [currency, setcurrency] = useState([]);
          const [vendor, setVendor] = useState([]);

          
    
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
            setFormData(values)
             const updatedData = {
                ...values,
                userId: userData._id
            };
            try{
    
                     const res = await fetch('http://localhost:3000/api/product/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchProducts();
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

    const fetchProducts = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/product',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.product)
            const uomMapped = result.uom.map(uom => ({
        value: uom._id,
        label: uom.code,
      }));
            const catMapped = result.category.map(cat => ({
        value: cat._id,
        label: cat.code,
      }));
            const warehMapped = result.warehouse.map(wareh => ({
        value: wareh._id,
        label: wareh.code,
      }));
            const currencyMapped = result.currency.map(curr => ({
        value: curr._id,
        label: curr.code,
      }));
       const vendorMapped = result.vendor.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));
             setUOM(uomMapped)
             setCategory(catMapped)
             setwarehouse(warehMapped)
             setcurrency(currencyMapped)
             setVendor(vendorMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

     const getUomLabel = (uomId) => {
    const found = uom.find(u => u.value === uomId);
    return found ? found.label : 'Unknown UOM';
  };

    const getCategoryLabel = (categoryId) => {
    const found = category.find(u => u.value === categoryId);
    return found ? found.label : 'Unknown Category';
  };

    const getWarehouseLabel = (warehouseId) => {
    const found = warehouse.find(u => u.value === warehouseId);
    return found ? found.label : 'Unknown Warehouse';
  };

    const getCurrencyLabel = (currencyId) => {
    const found = currency.find(u => u.value === currencyId);
    return found ? found.label : 'Unknown Currency';
  };

    const getVendorLabel = (vendorId) => {
    const found = vendor.find(v => v.value === vendorId);
    return found ? found.label : 'Unknown Vendor';
  };

    useEffect(()=>{
        fetchProducts();
    },[]);

    const columns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 150,
    ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 150,
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
    {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 150,
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
  {
    title: 'UOM',
    dataIndex: 'uom',
    key: 'uom',
    width: 150,
    ...getColumnSearchProps('uom', (record) => getUomLabel(record.uomId)),
    render: (text, record) => getUomLabel(record.uomId),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 150,
    ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 150,
    ...getColumnSearchProps('currency', (record) => getCurrencyLabel(record.currencyId)),
    render: (text, record) => getCurrencyLabel(record.currencyId),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 150,
    ...getColumnSearchProps('category', (record) => getCategoryLabel(record.categoryId)),
    render: (text, record) => getCategoryLabel(record.categoryId),
  },
  {
    title: 'Warehouse',
    dataIndex: 'warehouse',
    key: 'warehouse',
    width: 150,
    ...getColumnSearchProps('warehouse', (record) => getWarehouseLabel(record.warehouseId)),
    render: (text, record) => getWarehouseLabel(record.warehouseId),
  },
  {
    title: 'MinStock',
    dataIndex: 'minStkLevel',
    key: 'minStkLevel',
    width: 150,
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'MaxStock',
    dataIndex: 'maxStkLevel',
    key: 'maxStkLevel',
    width: 150,
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Reorder Point',
    dataIndex: 'reorderPoint',
    key: 'reorderPoint',
    width: 150,
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
    width: 150,
    render: (text, record) => getVendorLabel(record.vendorId),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Blocked',
    dataIndex: 'blocked',
    key: 'blocked',
    width: 150,
    render: (value) => (value ? <Tag color="red">Blocked</Tag> : <Tag color="green">Not Blocked</Tag>),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Assembled',
    dataIndex: 'assembled',
    key: 'assembled',
    width: 150,
    render: (value) => (value ? <Tag color="red">Assembled</Tag> : <Tag color="green">Not Assembled</Tag>),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
    // ...getColumnSearchProps('stock'),
  },

  {
    title: 'Action',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_, record) => (
      <Space size="middle">
        <EditProductsModal 
        productObj={record} fetchProducts={fetchProducts} 
        uom={uom} category={category} warehouse={warehouse} currency={currency} vendor={vendor}/>
        <DeleteProductModal productObj={record} fetchProducts={fetchProducts}/>
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Button type="primary" onClick={showModal}>
        Add Product
      </Button>
      <Modal
        title="Add Product"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        width={600}
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

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please input your product name!' }]}
                >
                <Input placeholder="Please enter product name"/>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item
                label="Description"
                name="description"
                >
                <Input placeholder="Please enter description"/>
                </Form.Item>
                </Col>
              </Row>

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="UOM"
                name="uomId"
                rules={[{ required: true, message: 'Please input the number of uom!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a uom"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={uom}
                />
                </Form.Item>
                </Col>
           
                  <Col span={12}>
                <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input the price!' }]}
                >
                <InputNumber placeholder="Please enter the price" style={{width:'100%'}}/>
                </Form.Item>
                  </Col>
                  </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Currency"
                name="currencyId"
                rules={[{ required: true, message: 'Please input the number of currency!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a currency"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={currency}
                />
                </Form.Item>
                </Col>

                  <Col span={12}>
                <Form.Item
                label="Category"
                name="categoryId"
                >
                  <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={category}
                />
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Warehouse"
                name="warehouseId"
                >
                  <Select
                  showSearch
                  placeholder="Select a warehouse"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={warehouse}
                />
                </Form.Item>
                </Col>
          
                  <Col span={12}>
                <Form.Item
                label="Minimum Stock"
                name="minStkLevel"
                >
                <InputNumber placeholder="Please enter the stock" style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Maximum Stock"
                name="maxStkLevel"
                >
                <InputNumber placeholder="Please enter the stock" style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                
                  <Col span={12}>
                <Form.Item
                label="Re-order Point"
                name="reorderPoint"
                >
                <InputNumber placeholder="Please enter the re-order" style={{width:'100%'}}/>
                </Form.Item>
                  </Col>
                  </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                <Form.Item
                label="Vendor"
                name="vendorId"
                >
                  <Select
                  showSearch
                  placeholder="Select a vendor"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={vendor}
                />
                </Form.Item>
                </Col>

                  <Col span={12}>
                <Form.Item
                label="Blocked"
                name="blocked"
                >
                    <Select
                    placeholder="select a block type"
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                    />
                </Form.Item>
                </Col>
                </Row>
                
                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Assembled"
                name="assembled"
                >
                    <Select
                    placeholder="select a assemble type"
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                    />
                </Form.Item>
                </Col>
                
                <Col span={12}>
                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the blocked"/>
                </Form.Item>
                </Col>
                </Row>

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

export default Products
