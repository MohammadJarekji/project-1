import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Card, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditDieselModal from './EditDieselModal';
import DeleteDieselModal from './DeleteDieselModal';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';


const Diesel = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);
    
    const [uom, setUOM] = useState([]);
    const [asset, setAsset] = useState([]);
    const [product, setProduct] = useState([]);
    const [productSelection, setProductSelection] = useState([]);


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
    
                     const res = await fetch('http://localhost:3000/api/diesel/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchDiesel();
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

    const fetchDiesel = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/api/diesel',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.diesel)

             const productMapped = result.product.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));

              const assetMapped = result.asset.map(proj => ({
                value: proj._id,
                label: proj.name,
              }));
              
              const uomMapped = result.uom.map(uom => ({
            value: uom._id,
            label: uom.code,
          }));

            setUOM(uomMapped)
            setProduct(result.product)
            setProductSelection(productMapped)
            setAsset(assetMapped)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getUomLabel = (uomId) => {
    const found = uom.find(u => u.value === uomId);
    return found ? found.label : 'Unknown UOM';
  };

    const getProductLabel = (productId) => {
    const found = productSelection.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
  };

    const getAssetLabel = (assetId) => {
    const found = asset.find(v => v.value === assetId);
    return found ? found.label : 'Unknown Asset';
  };

    useEffect(()=>{
        fetchDiesel();
    },[]);

    const columns = [

  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    ...getColumnSearchProps('product', (record) => getProductLabel(record.productId)),
    render: (text, record) => getProductLabel(record.productId),
  },
  {
    title: 'UOM',
    dataIndex: 'uom',
    key: 'uom',
    ...getColumnSearchProps('uom', (record) => getUomLabel(record.uomId)),
    render: (text, record) => getUomLabel(record.uomId),
    // render: (text, record) => getProjectLabel(record.projectId),
  },
  {
    title: 'Machine Counter Number',
    dataIndex: 'machineCounter',
    key: 'machineCounter',
    ...getColumnSearchProps('machineCounter'),
    // render: (text, record) => getProjectLabel(record.projectId),
  },
  {
    title: 'Average Cost of Diesel',
    dataIndex: 'averageCost',
    key: 'averageCost',
    ...getColumnSearchProps('averageCost'),
    // render: (text, record) => getProjectLabel(record.projectId),
  },
  {
    title: 'Asset',
    key: 'asset',

    children: [
      {
        title: 'Asset',
        key: 'asset',

        render: (_, record) => (
          <>
            {record.asset.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {getAssetLabel(line.assetId)}
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
            {record.asset.map((line, index) => (
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
        <EditDieselModal dieselObj={record} fetchDiesel={fetchDiesel} asset={asset} 
        productSelection={productSelection} uom={uom} product={product}/>
        <DeleteDieselModal dieselObj={record} fetchDiesel={fetchDiesel}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Diesel
      </Button>
      <Modal
        width={700}
        title="Add Diesel"
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
                label="Product"
                name="productId"
                rules={[{ required: true, message: 'Please select an assembled product!' }]}
                >

                <Select
                  showSearch
                  placeholder="Select product"
                  optionFilterProp="label"
                  onChange={handleSelectProductChange}
                  onSearch={onSearch}
                  options={productSelection}
                />
                </Form.Item>

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

                      <Form.Item
                    label="Machine Counter Number"
                    name="machineCounter"
                    >
                     <InputNumber placeholder='Enter machine counter number' style={{width:'100%'}}/>
                    </Form.Item>

                    <Form.Item
                    label="Average Cost of Diesel per Counter"
                    name="averageCost"
                    >
                     <InputNumber placeholder='Enter average cost' style={{width:'100%'}}/>
                    </Form.Item>
              
              {/* ///////////////////////////////////////////////////////////////////////////////////// */}
           
   <Card title="Asset" style={{ border: 'none' }}>
  <Form.List name="asset">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name }) => (
          <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
            <Col span={10}>
              <Form.Item
                label="Asset"
                name={[name, 'assetId']}
                rules={[{ required: true, message: 'Missing asset' }]}
              >
                <Select
                  showSearch
                  placeholder="Select asset"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={asset}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                label="Quantity"
                name={[name, 'quantity']}
                rules={[{ required: true, message: 'Missing quantity' }]}
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
            Add Asset
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

export default Diesel
