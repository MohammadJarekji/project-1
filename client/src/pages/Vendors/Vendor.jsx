import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditVendorModal from './EditVendorModal';
import DeleteVendorModal from './DeleteVendorModal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const Vendor = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);
     const [payment, setPayment] = useState([]); 
        const { userData}=useAuth();

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
              address:"", 
              contactName:"", 
              contactPhoneNumber:"", 
              paymentId:"",
              creditLimit:"",
              remark:"" 
          }); 

        const onChange = value => {
        };
        const onSearch = value => {
        };
 
  const exportToExcel = () => {
    // Map data to human-readable form
    const formattedData = data.map(item => ({
      'Vendor Name': item.name,
      'Address': item.address || '',
      'Contact Name': item.contactName,
      'Contact Phone Number': item.contactPhoneNumber,
      'Payment': getPaymentLabel(item.paymentId) || '',
      'Credit limit': item.creditLimit || '',
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
    saveAs(blob, 'Vendors.xlsx');
  };

    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
            setFormData(values)
            try{
    
                     const res = await fetch('http://localhost:3000/api/vendor/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchVendor();
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

    const fetchVendor = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/vendor',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             const payment = result.payment.map(pay => ({
                  value: pay._id,
                  label: pay.code,
                }));
             setData(result.vendor)
             setPayment(payment)

        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

        const getPaymentLabel = (paymentId) => {
    const found = payment.find(u => u.value === paymentId);
    return found ? found.label : 'Unknown Payment';
  };

    useEffect(()=>{
        fetchVendor();
    },[]);

    const columns = [
  {
    title: 'Vendor Name',
    dataIndex: 'name',
    key: 'name',
    ...getColumnSearchProps('name'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    ...getColumnSearchProps('address'),
  },
  {
    title: 'Contact Name',
    dataIndex: 'contactName',
    key: 'contactName',
    ...getColumnSearchProps('contactName'),
  },
    {
    title: 'Contact Phone Number',
    dataIndex: 'contactPhoneNumber',
    key: 'contactPhoneNumber',
    ...getColumnSearchProps('contactPhoneNumber'),
  },
  {
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
    render: (text, record) => getPaymentLabel(record.paymentId),
  },
  {
    title: 'Credit limit',
    dataIndex: 'creditLimit',
    key: 'creditLimit',
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EditVendorModal vendorObj={record} fetchVendor={fetchVendor} payment={payment}/>
        <DeleteVendorModal vendorObj={record} fetchVendor={fetchVendor}/>
      </Space>
    ),
  },
];

    return (
 <>
    <Space>
      <Button type="primary" onClick={showModal}>
        Add Vendor
      </Button>

       <Button type="primary" onClick={exportToExcel} style={{background:'green'}}>
        Export to Excel
      </Button>
      </Space>

      <Modal
        title="Add Vendor"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
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
                <Form.Item
                label="Vendor Name"
                name="name"
                rules={[{ required: true, message: 'Please input your Vendor name!' }]}
                >
                <Input placeholder="Please enter vendor name"/>
                </Form.Item>

                <Form.Item
                label="Address"
                name="address"
                >
                <Input placeholder="Please enter the address"/>
                </Form.Item>

                <Form.Item
                label="Contact Name"
                name="contactName"
                rules={[{ required: true, message: 'Please input your contact name!' }]}
                >
                <Input placeholder="Please enter the contract name"/>
                </Form.Item>

                <Form.Item
                label="Contact Phone Number"
                name="contactPhoneNumber"
                rules={[{ required: true, message: 'Please input your contact phone number!' }]}
                >
                <Input placeholder="Please enter the phone number"/>
                </Form.Item>

                <Form.Item
                label="Payment"
                name="paymentId"
                >
                  <Select
                  showSearch
                  placeholder="Select a Payment"
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  options={payment}
                />
                </Form.Item>

                <Form.Item
                label="Credit Limit"
                name="creditLimit"
                >
                <Input placeholder="Please enter the credit limit"/>
                </Form.Item>

                <Form.Item
                label="Remark"
                name="remark"
                >
                <Input placeholder="Please enter the Remark"/>
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

export default Vendor
