import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import EditSalesOrderModal from './EditSalesOrderModal';
import{useAuth} from '../../contexts/AuthContext';
import DeleteSalesOrderModal from './DeleteSalesOrderModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

const SalesOrder = () => {

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
          const [vendor, setVendor] = useState([]);
          const [payment, setPayment] = useState([]);
          const [product, setProduct] = useState([]);
          const [customer, setCustomer] = useState([]);
          const [productSelection, setProductSelection] = useState([]);
          const [customerSelection, setCustomerSelection] = useState([]);
        
            const handleSelectProductChange = (value) => {
              // Find selected PO object
              const selectedProduct = product.find(pro => pro._id === value);

              if (selectedProduct) {
                // Set form fields
                form.setFieldsValue({
                  uomId: selectedProduct.uomId,
                  currencyId: selectedProduct.currencyId,
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
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/salesOrder/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchSalesOrder();
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

    const fetchSalesOrder = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/salesOrder',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.salesOrder)
            const uomMapped = result.uom.map(uom => ({
        value: uom._id,
        label: uom.code,
      }));

            const currencyMapped = result.currency.map(curr => ({
        value: curr._id,
        label: curr.code,
      }));
       const vendorMapped = result.vendor.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));

      const paymentMapped = result.payment.map(pay => ({
        value: pay._id,
        label: pay.code,
      }));

      const customerMapped = result.customer.map(cust => ({
        value: cust._id,
        label: cust.name,
      }));

      const productMapped = result.product.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));
             setUOM(uomMapped)
             setcurrency(currencyMapped)
             setVendor(vendorMapped)
             setPayment(paymentMapped)
             setProductSelection(productMapped)
             setCustomerSelection(customerMapped)
             setProduct(result.product)
             setCustomer(result.customer)
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

  const getPaymentLabel = (paymentId) => {
    const found = payment.find(u => u.value === paymentId);
    return found ? found.label : 'Unknown Payment';
  };

    useEffect(()=>{
        fetchSalesOrder();
    },[]);

    const columns = [
  {
    title: 'Sales Order Number',
    dataIndex: 'soNumber',
    key: 'soNumber',
    // ...getColumnSearchProps('name'),
    // render: text => <a>{text}</a>,
  },
    {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (text, record) => getCustomerLabel(record.customerId),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    render: (text, record) => getProductLabel(record.productId),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
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
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    ...getColumnSearchProps('currency', (record) => getCurrencyLabel(record.currencyId)),
    render: (text, record) => getCurrencyLabel(record.currencyId),
  },
  {
    title:'delivery Date',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
    render: (text, record) => getPaymentLabel(record.paymentId),
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
    {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },

  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditSalesOrderModal 
        salesOrderObj={record} fetchSalesOrder={fetchSalesOrder} 
        uom={uom} currency={currency} vendor={vendor} payment={payment} product={product} productSelection={productSelection} 
        cutomer={customer} customerSelection={customerSelection}/>
        <DeleteSalesOrderModal salesOrderObj={record} fetchSalesOrder={fetchSalesOrder}/>
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Button type="primary" onClick={showModal}>
        Add SalesOrder
      </Button>
      <Modal
        title="Add SalesOrder"
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
                label="Customer"
                name="customerId"
                rules={[{ required: true, message: 'Please select customer!' }]}
                >
                  <Select
                  showSearch
                  placeholder="Select a customer"
                  optionFilterProp="label"
                  onChange={handleSelectCustomerChange}
                  onSearch={onSearch}
                  options={customerSelection}
                />
                </Form.Item>
                </Col>
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
              </Row>

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please input your quantity!' }]}
                >
                <InputNumber placeholder="Please enter quantity" style={{width:'100%'}}/>
                </Form.Item>
                </Col>

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
                </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input the price!' }]}
                >
                <InputNumber placeholder="Please enter the price" style={{width:'100%'}}/>
                </Form.Item>
                  </Col>
                <Col span={12}>

                <Form.Item
                label="Currency"
                name="currencyId"
                >
                    <Select 
                      open={false}
                      suffixIcon={null}
                      placeholder="Select Currency">
                  {currency.map(curr => (
                    <Option key={curr.value} value={curr.value}>
                      {curr.label}
                    </Option>
                  ))}
                </Select>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                <Form.Item
                label="Delivery Date"
                name="deliveryDate"
                >
                 <DatePicker
                 onChange={handleDateChange} 
                 style={{width:'100%'}}
                 format="M/D/YYYY"
                 value={selectedDate ? dayjs(selectedDate, 'M/D/YYYY') : null}
                 />
                </Form.Item>
                  </Col>
                  <Col span={12}>
                  <Form.Item
                label="Payment"
                name="paymentId"
                >
                  <Select
                  open={false}
                  suffixIcon={null}
                  placeholder="Select a payment"
                >
                {payment.map(pay => (
                    <Option key={pay.value} value={pay.value}>
                      {pay.label}
                    </Option>
                  ))}
                  </Select>
                </Form.Item>
                  </Col>
                  </Row>

                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the remark"/>
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

export default SalesOrder
