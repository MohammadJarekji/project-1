import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import EditPaymentOrderModal from './EditPaymentOrderModal';
import{useAuth} from '../../contexts/AuthContext';
import DeletePaymentOrderModal from './DeletePaymentOrderModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PaymentOrder = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(null);

console.log("Data: ",data)

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

          const [currency, setcurrency] = useState([]);
          const [vendor, setVendor] = useState([]);


          const exportToExcel = () => {
                  // Map data to human-readable form
                  const formattedData = data.map(item => ({
                    'Payment Order Number': item.payNumber,
                    'Vendor': getVendorLabel(item.vendorId),
                    'Amount': item.amount || '',
                    'Currency': getCurrencyLabel(item.currencyId) || '',
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
                  saveAs(blob, 'PaymentOrders.xlsx');
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
    
                    //  const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/paymentOrder/add',{
                    const res = await fetch('http://localhost:3000/api/paymentOrder/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchPaymentOrder();
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

    const fetchPaymentOrder = async ()=>{
        try{
            // const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/paymentOrder',{
            const res = await fetch('http://localhost:3000/api/paymentOrder',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();

             console.log("Result: ",result.vendor)

             setData(result.paymentOrder)

            const currencyMapped = result.currency.map(curr => ({
        value: curr._id,
        label: curr.code,
      }));
       const vendorMapped = result.vendor.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));

             setcurrency(currencyMapped)
             setVendor(vendorMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getCurrencyLabel = (currencyId) => {
    const found = currency.find(u => u.value === currencyId);
    return found ? found.label : 'Unknown Currency';
  };

      const getVendorLabel = (vendorId) => {
    const found = vendor.find(v => v.value === vendorId);
    return found ? found.label : 'Unknown Vendor';
  };


    useEffect(()=>{
        fetchPaymentOrder();
    },[]);

    const columns = [
    {
      title: 'Payment Order Number',
      dataIndex: 'payNumber',
      key: 'payNumber',
      ...getColumnSearchProps('payNumber'),
      render: text => <a>{text}</a>,
    },
    {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
    ...getColumnSearchProps('vendor', (record) => getVendorLabel(record.vendorId)),
    render: (text, record) => getVendorLabel(record.vendorId),
    // ...getColumnSearchProps('stock'),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    ...getColumnSearchProps('amount'),
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
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    ...getColumnSearchProps('date', (record) => dayjs(record.date).format('M/D/YYYY')),
    render: (value) => dayjs(value).format('M/D/YYYY'),
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
        <EditPaymentOrderModal 
        paymentOrderObj={record} fetchPaymentOrder={fetchPaymentOrder} currency={currency} vendor={vendor}/>
        <DeletePaymentOrderModal paymentOrderObj={record} fetchPaymentOrder={fetchPaymentOrder}/>
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Space>
      <Button type="primary" onClick={showModal}>
        Add PaymentOrder
      </Button>
      <Button type="primary" onClick={exportToExcel} style={{background:'green'}}>
        Export to Excel
      </Button>
      </Space>

      <Modal
        title="Add PaymentOrder"
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
                  label="Amount"
                  name="amount"
                  >
                  <InputNumber placeholder="Please enter the amount" style={{width:'100%'}}/>
                  </Form.Item>
                  </Col>

              </Row>

              <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="Currency"
                name="currencyId"
                >
                    <Select 
                      placeholder="Select Currency">
                  {currency.map(curr => (
                    <Option key={curr.value} value={curr.value}>
                      {curr.label}
                    </Option>
                  ))}
                </Select>
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

export default PaymentOrder
