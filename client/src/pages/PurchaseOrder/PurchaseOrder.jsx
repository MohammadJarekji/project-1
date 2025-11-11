import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber   } from 'antd';
import EditPurchaseOrderModal from './EditPurchaseOrderModal';
import{useAuth} from '../../contexts/AuthContext';
import DeletePurchaseOrderModal from './DeletePurchaseOrderModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PurchaseOrder = () => {

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
          const [currency, setcurrency] = useState([]);
          const [vendor, setVendor] = useState([]);
          const [payment, setPayment] = useState([]);
          const [product, setProduct] = useState([]);
          const [productSelection, setProductSelection] = useState([]);
        
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
                userId: userData._id,
                date:dayjs().format('M/D/YYYY'),
            };
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/purchaseOrder/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchPurchaseOrder();
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

       const exportToExcel = () => {
  // Map data to human-readable form
  const formattedData = data.map(item => ({
    'Purchase Order Number': item.poNumber,
    'Vendor': getVendorLabel(item.vendorId),
    'Product': getProductLabel(item.productId),
    'Quantity': item.quantity,
    'UOM': getUomLabel(item.uomId) || '',
    'Price': item.price,
    'Currency': getCurrencyLabel(item.currencyId) || '',
    'Payment': getPaymentLabel(item.paymentId) || '',
    'Date': dayjs(item.date).format('M/D/YYYY') || '',
    'Remark': item.remark || '',
  }));

  // 1️⃣ Convert formatted data to worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // 2️⃣ Create a workbook and append the sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders');

  // 3️⃣ Write file and trigger download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'PurchaseOrders.xlsx');
};

    const fetchPurchaseOrder = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/purchaseOrder',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.purchaseOrder)
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
        label: pay.name,
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
             setProduct(result.product)
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

    const getVendorLabel = (vendorId) => {
    const found = vendor.find(v => v.value === vendorId);
    return found ? found.label : 'Unknown Vendor';
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
        fetchPurchaseOrder();
    },[]);

    const columns = [
  {
    title: 'Purchase Order Number',
    dataIndex: 'poNumber',
    key: 'poNumber',
    fixed: 'left',
    width: 150,
    ...getColumnSearchProps('poNumber'),
    render: text => <a>{text}</a>,
  },
    {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
     width: 150,
     ...getColumnSearchProps('vendor', (record) => getVendorLabel(record.vendorId)),
    render: (text, record) => getVendorLabel(record.vendorId),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
     width: 150,
     ...getColumnSearchProps('product', (record) => getProductLabel(record.productId)),
    render: (text, record) => getProductLabel(record.productId),
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
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
     width: 150,
    render: (text, record) => getPaymentLabel(record.paymentId),
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
     width: 150,
     ...getColumnSearchProps('date', (record) => dayjs(record.date).format('M/D/YYYY')),
    render: (value) => dayjs(value).format('M/D/YYYY'),
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
     width: 150,
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.payment.toString()}</a>,
  },

  {
    title: 'Action',
    key: 'action',
    width: 150,
    fixed: 'right',
    render: (_, record) => (
      <Space size="middle">
        <EditPurchaseOrderModal 
        purchaseOrderObj={record} fetchPurchaseOrder={fetchPurchaseOrder} 
        uom={uom} currency={currency} vendor={vendor} payment={payment} product={product} productSelection={productSelection}/>
        <DeletePurchaseOrderModal purchaseOrderObj={record} fetchPurchaseOrder={fetchPurchaseOrder}/>
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Space>
      <Button type="primary" onClick={showModal}>
        Add PurchaseOrder
      </Button>
      <Button type="primary" onClick={exportToExcel} style={{background:'green'}}>
              Export to Excel
      </Button>
      </Space>

      <Modal
        title="Add PurchaseOrder"
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
                label="Vendor"
                name="vendorId"
                rules={[{ required: true, message: 'Please select vendor!' }]}
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
                <InputNumber placeholder="Please enter Quantity" style={{width:'100%'}}/>
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
                label="Payment"
                name="paymentId"
                >
                  <Select
                  showSearch
                  placeholder="Select a payment"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={payment}
                />
                </Form.Item>
                  </Col>
                  <Col span={12}>
                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the remark"/>
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

export default PurchaseOrder
