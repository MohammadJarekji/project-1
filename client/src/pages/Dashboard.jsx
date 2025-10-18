import React, { useState, useEffect } from 'react'
import{useAuth} from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

import {
  AiOutlineShoppingCart,
  AiOutlineTags,
  AiOutlineFieldNumber,
  AiOutlineDollarCircle,
  AiOutlineDatabase,
  AiOutlineUsergroupAdd,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineFolderOpen,
  AiOutlineTool,
  AiOutlineSwap,
  AiOutlineProject,
  AiOutlineAudit,
  AiOutlineThunderbolt,
} from 'react-icons/ai';

import { Button, Layout, Menu, theme } from 'antd';
import Products from './Products/Products';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    
    const { userData, logout}=useAuth();
    const location = useLocation();
    const { SubMenu } = Menu;
    const menuItems = [
  {
    type: 'group',
    label: 'Inventory & Products',
    children: [
      { key: '1', icon: <AiOutlineShoppingCart />, label: <Link to="/dashboard">Products</Link> },
      { key: '3', icon: <AiOutlineTags />, label: <Link to="/category">Category</Link> },
      { key: '5', icon: <AiOutlineFieldNumber />, label: <Link to="/uom">UOM</Link> },
      { key: '4', icon: <AiOutlineDollarCircle />, label: <Link to="/currency">Currency</Link> },
      { key: '17', icon: <AiOutlineDatabase />, label: <Link to="/inventory">Inventory</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Vendors & Orders',
    children: [
      { key: '2', icon: <AiOutlineUsergroupAdd />, label: <Link to="/vendor">Vendors</Link> },
      { key: '9', icon: <AiOutlineFileText />, label: <Link to="/purchaseOrder">Purchase Order</Link> },
      { key: '10', icon: <AiOutlineFileText />, label: <Link to="/salesOrder">Sales Order</Link> },
      { key: '20', icon: <AiOutlineFileText />, label: <Link to="/paymentOrder">Payment Order</Link> },
      { key: '21', icon: <AiOutlineFileText />, label: <Link to="/receiptOrder">Receipt Order</Link> },
      { key: '15', icon: <AiOutlineSwap />, label: <Link to="/transfer">Transfer</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Customers & Payments',
    children: [
      { key: '7', icon: <AiOutlineDollarCircle />, label: <Link to="/payment">Payment</Link> },
      { key: '8', icon: <AiOutlineUser />, label: <Link to="/customer">Customer</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Operations',
    children: [
      { key: '6', icon: <AiOutlineHome />, label: <Link to="/warehouse">Warehouse</Link> },
      { key: '18', icon: <AiOutlineSetting />, label: <Link to="/production">Production</Link> },
      { key: '14', icon: <AiOutlineTool />, label: <Link to="/assembly">Assembly Order</Link> },
      { key: '19', icon: <AiOutlineThunderbolt />, label: <Link to="/diesel">Diesel</Link> },
      { key: '12', icon: <AiOutlineAudit />, label: <Link to="/asset">Asset</Link> },
    ],
  },
  {
    type: 'group',
    label: 'People & Projects',
    children: [
      { key: '11', icon: <AiOutlineTeam />, label: <Link to="/staff">Staff</Link> },
      { key: '13', icon: <AiOutlineProject />, label: <Link to="/project">Project</Link> },
      { key: '16', icon: <AiOutlineFolderOpen />, label: <Link to="/projectDetails">Project Details</Link> },
    ],
  },
];

      // Map your route paths to menu keys
  const pathToKey = {
    '/dashboard': '1',
    '/vendor': '2',
    '/category': '3',
    '/currency': '4',
    '/uom': '5',
    '/warehouse': '6',
    '/payment': '7',
    '/customer': '8',
    '/purchaseOrder': '9',
    '/salesOrder': '10',
    '/staff': '11',
    '/asset': '12',
    '/project': '13',
    '/assembly': '14',
    '/transfer': '15',
    '/projectDetails': '16',
    '/inventory': '17',
    '/production': '18',
    '/diesel': '19',
    '/paymentOrder': '20',
    '/receiptOrder': '21',
  };

  
// Helper to find open keys based on selectedKey
function getOpenKeysFromSelectedKey(selectedKey) {
  for (const group of menuItems) {
    if (group.children.some(item => item.key === selectedKey)) {
      return [group.label];
    }
  }
  return [];
}

const selectedKey = Object.entries(pathToKey)
  .filter(([path]) => location.pathname.startsWith(path))
  .sort((a, b) => b[0].length - a[0].length)
  .map(([_, key]) => key)[0] || '1';

    const handleLogout = async ()=>{
        await logout();
    };

     const [openKeys, setOpenKeys] = useState(getOpenKeysFromSelectedKey(selectedKey));

      // Update open keys when selectedKey changes (i.e. route changes)
  useEffect(() => {
    setOpenKeys(getOpenKeysFromSelectedKey(selectedKey));
  }, [selectedKey]);

  const onOpenChange = keys => {
    setOpenKeys(keys);
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

    return (

 <Layout style={{height:'100vh'}}>
      <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div className="demo-logo-vertical" />
      <div style={{ height: 'calc(100% - 64px)', overflowY: 'auto', paddingTop: 16 }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ height: '100%' }}
        >
          {menuItems.map(group => (
            <Menu.SubMenu
              key={group.label}
              title={group.label}
              icon={group.children[0]?.icon}
            >
              {group.children.map(item => (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </div>
    </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        <Button style={{float:'right', margin:'10px'}} size="large" type="primary" onClick={handleLogout}>
          Logout
        </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
                  <h2> Welcome {userData.name}</h2>
                
                <Outlet />

        </Content>
      </Layout>
    </Layout>
    )
}

export default Dashboard
