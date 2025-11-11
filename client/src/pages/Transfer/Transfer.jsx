import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import EditTransferModal from './EditTransferModal';
import{useAuth} from '../../contexts/AuthContext';
import DeleteTransferModal from './DeleteTransferModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

const Transfer = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(null);

      const handleDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setSelectedDate(formatted);
    } else {
      setSelectedDate(null);
    }
  };

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
          const [currency, setcurrency] = useState([]);
          const [product, setProduct] = useState([]);
          const [wareHouse, setWareHouse] = useState([]);
          const [productSelection, setProductSelection] = useState([]);
        
            const handleSelectProductChange = (value) => {
              // Find selected PO object
              const selectedProduct = product.find(pro => pro._id === value);

              if (selectedProduct) {
                // Set form fields
                form.setFieldsValue({
                  uomId: selectedProduct.uomId,
                });
              }
            };

              const handleSelectCustomerChange = (value) => {
              // Find selected PO object
              const selectedCustomer = customer.find(cust => cust._id === value);

              if (selectedCustomer) {
                // Set form fields
                form.setFieldsValue({
                  paymentId: selectedCustomer.paymentId,
                });
              }
            };
    
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
    
                     const res = await fetch('http://localhost:3000/api/transfer/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchTransfer();
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

    const fetchTransfer = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/transfer',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.transfer)
            const uomMapped = result.uom.map(uom => ({
        value: uom._id,
        label: uom.code,
      }));

            const wareHouseMapped = result.wareHouse.map(wh => ({
                    value: wh._id,
                    label: wh.name,
                  }));           

      const productMapped = result.product.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));
             setUOM(uomMapped)
             setProductSelection(productMapped)
             setProduct(result.product)
             setWareHouse(wareHouseMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

     const getUomLabel = (uomId) => {
    const found = uom.find(u => u.value === uomId);
    return found ? found.label : 'Unknown UOM';
  };

    const getCurrencyLabel = (currencyId) => {
    const found = currency.find(u => u.value === currencyId);
    return found ? found.label : 'Unknown Currency';
  };

    const getCustomerLabel = (customerId) => {
    const found = customerSelection.find(v => v.value === customerId);
    return found ? found.label : 'Unknown customer';
  };

  const getProductLabel = (productId) => {
    const found = productSelection.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
  };

  const getWareHouseLabel = (wareHouseId) => {
    const found = wareHouse.find(u => u.value === wareHouseId);
    return found ? found.label : 'Unknown Warehouse';
  };

    useEffect(()=>{
        fetchTransfer();
    },[]);

    const columns = [
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    ...getColumnSearchProps('product', (record) => getProductLabel(record.productId)),
    render: (text, record) => getProductLabel(record.productId),
    // render: text => <a>{text}</a>,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    ...getColumnSearchProps('quantity'),
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
  {
    title: 'UOM',
    dataIndex: 'uom',
    key: 'uom',
    ...getColumnSearchProps('uom', (record) => getUomLabel(record.uomId)),
    render: (text, record) => getUomLabel(record.uomId),
  },
  {
    title: 'From',
    dataIndex: 'fromWareHouse',
    key: 'fromWareHouse',
    render: (text, record) => getWareHouseLabel(record.fromWareHouseId),
  },
  {
    title: 'To',
    dataIndex: 'toWareHouse',
    key: 'toWareHouse',
    render: (text, record) => getWareHouseLabel(record.toWareHouseId),
  },

  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditTransferModal 
        transferObj={record} fetchTransfer={fetchTransfer} 
        uom={uom} product={product} productSelection={productSelection} wareHouse={wareHouse}/>
        <DeleteTransferModal transferObj={record} fetchTransfer={fetchTransfer}/>
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Button type="primary" onClick={showModal}>
        Add Transfer
      </Button>
      <Modal
        title="Add Transfer"
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
                label="Product"
                name="productId"
                rules={[{ required: true, message: 'Please select product!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a product"
                  optionFilterProp="label"
                  onChange={handleSelectProductChange}
                  onSearch={onSearch}
                  options={productSelection}
                />
                </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please input your quantity!' }]}
                >
                <InputNumber placeholder="Please enter quantity" style={{width:'100%'}}/>
                </Form.Item>
                </Col>

              </Row>

              <Row gutter={[9,9]}>

                <Col span={12}>
                  <Form.Item
                  label="UOM"
                  name="uomId"
                  >
                  <Select
                    open={false}
                    suffixIcon={null}
                    placeholder="Select UOM">
                    {uom.map(uom => (
                      <Option key={uom.value} value={uom.value}>
                        {uom.label}
                      </Option>
                    ))}
                  </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                label="From"
                name="fromWareHouseId"
                rules={[{ required: true, message: 'Please select from which wareHouse!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a warehouse"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={wareHouse}
                />
                </Form.Item>
                </Col>
                </Row>

                <Form.Item
                label="To"
                name="toWareHouseId"
                dependencies={['fromWarehouse']} // Reacts when fromWarehouse changes
                rules={[
                  { required: true, message: 'Please select a destination warehouse' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('fromWareHouseId') !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Source and destination cannot be the same'));
                    },
                  }),
                ]}
                >
                  <Select
                  showSearch
                  placeholder="Select a warehouse"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={wareHouse}
                />
                </Form.Item>

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

export default Transfer
