import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import EditReceiptOrderModal from './EditReceiptOrderModal';
import{useAuth} from '../../contexts/AuthContext';
import DeleteReceiptOrderModal from './DeleteReceiptOrderModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

const ReceiptOrder = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [customer, setCustomer] = useState([]);
    const [customerSelection, setCustomerSelection] = useState([]);

    // /////////////////////////////////////////////////////////////////

      const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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
    
                    //  const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/receiptOrder/add',{
                    const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/receiptOrder/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(updatedData),
                });
                const result = await res.json();
                fetchReceiptOrder();
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

    const fetchReceiptOrder = async ()=>{
        try{
            // const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/receiptOrder',{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/receiptOrder',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();

             setData(result.receiptOrder)

            const currencyMapped = result.currency.map(curr => ({
        value: curr._id,
        label: curr.code,
      }));
        const customerMapped = result.customer.map(cust => ({
        value: cust._id,
        label: cust.name,
      }));

             setcurrency(currencyMapped)
             setCustomerSelection(customerMapped)
             setCustomer(result.customer)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getCurrencyLabel = (currencyId) => {
    const found = currency.find(u => u.value === currencyId);
    return found ? found.label : 'Unknown Currency';
  };

    const getCustomerLabel = (customerId) => {
    const found = customerSelection.find(v => v.value === customerId);
    return found ? found.label : 'Unknown customer';
  };


    useEffect(()=>{
        fetchReceiptOrder();
    },[]);

    const columns = [
    {
      title: 'Receipt Order Number',
      dataIndex: 'recNumber',
      key: 'recNumber',
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
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.receipt.toString()}</a>,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    ...getColumnSearchProps('currency', (record) => getCurrencyLabel(record.currencyId)),
    render: (text, record) => getCurrencyLabel(record.currencyId),
  },
    {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    // ...getColumnSearchProps('price'),
    // render: (record) => <a>{record.receipt.toString()}</a>,
  },

  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditReceiptOrderModal 
        receiptOrderObj={record} fetchReceiptOrder={fetchReceiptOrder} currency={currency} 
        cutomer={customer} customerSelection={customerSelection}/>
        <DeleteReceiptOrderModal receiptOrderObj={record} fetchReceiptOrder={fetchReceiptOrder} />
        {/* <Button type="link" style={{color:'red'}} onClick={handleDelete(record._id)}><DeleteFilled /></Button> */}
      </Space>
    ),
  },
];

    return (
        <>
      <Button type="primary" onClick={showModal}>
        Add ReceiptOrder
      </Button>
      <Modal
        title="Add ReceiptOrder"
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

export default ReceiptOrder
