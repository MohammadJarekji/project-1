import React,{useState, useEffect, useRef} from 'react';
import axios from 'axios'
import { Space, Table, Tag, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Card, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import{useAuth} from '../../contexts/AuthContext';
import EditAssemblyModal from './EditAssemblyModal';
import DeleteAssemblyModal from './DeleteAssemblyModal';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';


const Assembly = () => {

     const [form] = Form.useForm();
    const [user, setuser]= useState([]);
    const [data, setData] = useState([]);

    const [uom, setUOM] = useState([]);
    const [asset, setAsset] = useState([]);
    const [product, setProduct] = useState([]);
    const [productSelection, setProductSelection] = useState([]);
    const [productAssemdledSelection, setProductAssembledSelection] = useState([]);
    const [mainProduct, setMainProduct] = useState(null);
    const [warningMessage, setWarningMessage] = useState('');


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


// Function to check if the selected productId is already used in any assembly
const checkIfProductUsedInAssembly = (selectedProductId) => {
  return data.some(assembly => assembly.productId === selectedProductId);
};

const handleMainProductChange = (value) => {
  setMainProduct(value);  // Update the main product only

  // Check if the selected product is already used in any assembly
  if (checkIfProductUsedInAssembly(value)) {
    setWarningMessage("This product has already been assembled and cannot be used again.");
  } else {
    setWarningMessage('');  // Clear the warning if the product is not used
  }

  // Explicitly set the form value for 'productId' to ensure the warning is not overridden
  form.setFieldsValue({ productId: value });
};

const handleSelectProductChange = (value, index) => {
  const selectedProduct = product.find(p => p._id === value);

  if (selectedProduct) {
    const currentValues = form.getFieldValue("lines") || [];
    const updatedLines = [...currentValues];
    updatedLines[index] = {
      ...updatedLines[index],
      productId: value,
      uomId: selectedProduct.uomId, // this must exist on product
    };

    form.setFieldsValue({
      lines: updatedLines,
    });
  }
};

        const { userData}=useAuth();
    
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
        setWarningMessage();
        form.resetFields();
      };

      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);

      const handleStartDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setStartDate(formatted);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      // Save formatted string like "10/8/2025"
      const formatted = date.format('M/D/YYYY');
      setEndDate(formatted);
    } else {
      setEndDate(null);
    }
  };

      const onChange = value => {
        };
        const onSearch = value => {
        };
        
    
        const handleSubmit = async (values)=>{
            // e.preventDefault();
               const isProductUsed = checkIfProductUsedInAssembly(values.productId);

            // If the product is already used in another assembly, display a warning and prevent submission
            if (isProductUsed) {
                setWarningMessage("This product has already been assembled and cannot be used again.");
                return;  // Prevent form submission if the product is already in use
            }

            setFormData(values)
            try{
    
                     const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/assembly/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(values),
                });
                const result = await res.json();
                fetchAssembly();
                form.resetFields();
                handleCancel();
            }catch(error){
                console.error("Error fetching1 user: ",error)
            }
        }
    
        const onFinish = values => {
            handleSubmit(values);
              
        };
        const onFinishFailed = errorInfo => {
        };

    const fetchAssembly = async ()=>{
        try{
            const res = await fetch(import.meta.env.VITE_URL_BASE_APP +'/api/assembly',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
             const result = await res.json();
             setData(result.assembly)


             const uomMapped = result.uom.map(uom => ({
        value: uom._id,
        label: uom.code,
      }));

             const productMapped = result.product.map(ven => ({
        value: ven._id,
        label: ven.name,
      }));

              const assetMapped = result.asset.map(asset => ({
                      value: asset._id,
                      label: asset.name,
                    }));

      const assembledProductMapped = result.product
  .filter(ven => ven.assembled === true)
  .map(ven => ({
    value: ven._id,
    label: ven.name,
  }));
      setUOM(uomMapped)
      setAsset(assetMapped)
      setProductSelection(productMapped)
      setProductAssembledSelection(assembledProductMapped);
      setProduct(result.product)
        } catch (error) {
            console.error("Error fetching user: ",error)
        }
    }

    const getUomLabel = (uomId) => {
    const found = uom.find(u => u.value === uomId);
    return found ? found.label : 'Unknown UOM';
  };

    const getAssembledProductLabel = (productId) => {
    const found = productAssemdledSelection.find(v => v.value === productId);
    return found ? found.label : 'Unknown Product';
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
        fetchAssembly();
    },[]);

    const columns = [
  {
    title: 'Assembly Number',
    dataIndex: 'asNumber',
    key: 'asNumber',
    fixed:'left',
    width: 150,
    ...getColumnSearchProps('asNumber'),
    render: text => <a>{text}</a>,
  },
  {
    title: 'Assembled Product',
    dataIndex: 'productAssembled',
    key: 'productAssembled',
    width: 150,
    ...getColumnSearchProps('productAssembled', (record) => getAssembledProductLabel(record.productId)),
    render: (text, record) => getAssembledProductLabel(record.productId),
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 150,
    render: (value) => {
        // If value is valid, format it, otherwise return an empty string
        return value && dayjs(value).isValid() ? dayjs(value).format('M/D/YYYY') : '';
      },
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 150,
    render: (value) => {
        // If value is valid, format it, otherwise return an empty string
        return value && dayjs(value).isValid() ? dayjs(value).format('M/D/YYYY') : '';
      },
  },
  {
    title: 'Labor Hours',
    dataIndex: 'laborHours',
    key: 'laborHours',
    width: 150,
  },
  {
    title: 'Labor Hours',
    dataIndex: 'laborHours',
    key: 'laborHours',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
  {
    title: 'Lines',
    key: 'lines',
    width: 450,
    children: [
      {
        title: 'Product',
        key: 'product',
        width: 150,
        render: (_, record) => (
          <>
            {record.lines.map((line, index) => (
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
        width: 150,
        render: (_, record) => (
          <>
            {record.lines.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {line.quantity}
              </div>
            ))}
          </>
        ),
      },
      {
        title: 'UOM',
        key: 'uom',
        width: 150,
        render: (_, record) => (
          <>
            {record.lines.map((line, index) => (
              <div key={index} style={{ padding: '4px 0' }}>
                {getUomLabel(line.uomId)}
              </div>
            ))}
          </>
        ),
      },
    ],
  },
  {
    title: 'Assest',
    dataIndex: 'asset',
    key: 'asset',
    width: 150,
    render: (text, record) => getAssetLabel(record.assetId),
  },
  {
    title: 'Hours',
    dataIndex: 'hours',
    key: 'hours',
    width: 150,
  },
  {
    title: 'Action',
    key: 'action',
    fixed:'right',
     width: 150,
    render: (_, record) => (
      <Space size="middle">
        <EditAssemblyModal assemblyObj={record} fetchAssembly={fetchAssembly} uom={uom} 
        asset={asset} product={product} productSelection={productSelection} productAssemdledSelection={productAssemdledSelection} usedData={data}/>
        <DeleteAssemblyModal assemblyObj={record} fetchAssembly={fetchAssembly}/>
      </Space>
    ),
  },
];

    return (
 <>
      <Button type="primary" onClick={showModal}>
        Add Assembly
      </Button>
      <Modal
        width={700}
        title="Add Assembly"
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
              <Row gutter={[9,9]}>

                <Col span={12}>
                <Form.Item
                  label="Assembled Product"
                  name="productId"
                  rules={[{ required: true, message: 'Please select an assembled product!' }]}>
                  <Select
                    showSearch
                    placeholder="Select an assembled product"
                    optionFilterProp="label"
                    onSearch={onSearch}
                    options={productAssemdledSelection}  // Populate with the assembled products
                    onChange={handleMainProductChange}
                  />
                  {warningMessage && (
                    <div style={{ color: 'red', marginTop: 5 }}>
                      {warningMessage}
                    </div>
                  )}
                </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                label="Start Date"
                name="startDate"
                >
                <DatePicker 
                onChange={handleStartDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={startDate ? dayjs(startDate, 'M/D/YYYY') : null}
                />
                </Form.Item>
                </Col>
              </Row>

                <Row gutter={[9,9]}>
                <Col span={12}>
                <Form.Item
                label="End Date"
                name="endDate"
                >
                <DatePicker 
                onChange={handleEndDateChange} 
                style={{width:'100%'}}
                format="M/D/YYYY"
                value={endDate ? dayjs(endDate, 'M/D/YYYY') : null}
                />
                </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                label="Labor Hours"
                name="laborHours"
                >
                <InputNumber placeholder='Enter the labour hours ' style={{width:'100%'}}/>
                </Form.Item>
                </Col>
                </Row>

                <Row gutter={[9,9]}>
                  <Col span={12}>
                <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select the status!' }]}
                >

                <Select
                  placeholder='Select the status '
                  options={[
                    { value: 'Planned', label: 'Planned' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Finished', label: 'Finished' },
                  ]}
                />
                </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                label="Asset"
                name="assetId"
                >
                <Select
                  showSearch
                  placeholder="Select an asset"
                  optionFilterProp="label"
                  onSearch={onSearch}
                  options={asset}
                />
                </Form.Item>
                </Col>
                </Row>

                <Form.Item
                label="Hours"
                name="hours"
                >
                <InputNumber placeholder='Select the hours ' style={{width:'100%'}}/>
                </Form.Item>

              {/* ///////////////////////////////////////////////////////////////////////////////////// */}
              <Card title={"Lines"} style={{border: 'none'}}>
                 <Form.List name="lines" label="Lines">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Form.Item
                label="Product"
                {...restField}
                name={[name, 'productId']}
                rules={[{ required: true, message: 'Missing product' }]}
              >
                <Select
                  showSearch
                  placeholder="Select product"
                  optionFilterProp="label"
                  onChange={(value) => handleSelectProductChange(value, name)}
                  onSearch={onSearch}
                  options={productSelection}
                />
              </Form.Item>
              <Form.Item
                label="Quantity"
                {...restField}
                name={[name, 'quantity']}
                rules={[{ required: true, message: 'Missing quantity' }]}
              >
                <Input placeholder="quantity" />
              </Form.Item>

              <Form.Item
                label="UOM"
                {...restField}
                name={[name, 'uomId']}
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
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add field
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

export default Assembly
