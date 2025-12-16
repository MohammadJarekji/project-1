import React, { useState, useEffect } from 'react'
import{useAuth} from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined
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
  AiFillDashboard,
} from 'react-icons/ai';

import { Button, Layout, Menu, theme,} from 'antd';
import Products from './Products/Products';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    
    const { userData, logout}=useAuth();
    const location = useLocation();
    const { SubMenu } = Menu;
    const menuItems = [
  { key: '22', icon: <AiFillDashboard />, label: <Link to="/dashboard">Dashboard</Link> },
  {
    type: 'group',
    label: 'Vendors & PO',
    children: [
      { key: '2', icon: <AiOutlineUsergroupAdd />, label: <Link to="/vendor">Vendors</Link> },
      { key: '9', icon: <AiOutlineFileText />, label: <Link to="/purchaseOrder">Purchase Order</Link> },
      { key: '7', icon: <AiOutlineDollarCircle />, label: <Link to="/payment">Payment</Link> },
      { key: '20', icon: <AiOutlineFileText />, label: <Link to="/paymentOrder">Payment Order</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Customers & SO',
    children: [
      
      { key: '8', icon: <AiOutlineUser />, label: <Link to="/customer">Customers</Link> },
      { key: '10', icon: <AiOutlineFileText />, label: <Link to="/salesOrder">Sales Order</Link> },
      { key: '21', icon: <AiOutlineFileText />, label: <Link to="/receiptOrder">Receipt Order</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Operations',
    children: [
      { key: '18', icon: <AiOutlineSetting />, label: <Link to="/production">Production</Link> },
      { key: '14', icon: <AiOutlineTool />, label: <Link to="/assembly">Assembly Order</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Products & tools',
    children: [
      { key: '6', icon: <AiOutlineHome />, label: <Link to="/warehouse">Warehouse</Link> },
      { key: '1', icon: <AiOutlineShoppingCart />, label: <Link to="/products">Products</Link> },
      { key: '3', icon: <AiOutlineTags />, label: <Link to="/category">Category</Link> },
      { key: '5', icon: <AiOutlineFieldNumber />, label: <Link to="/uom">UOM</Link> },
      { key: '4', icon: <AiOutlineDollarCircle />, label: <Link to="/currency">Currency</Link> },
      { key: '17', icon: <AiOutlineDatabase />, label: <Link to="/inventory">Inventory</Link> },
      { key: '11', icon: <AiOutlineTeam />, label: <Link to="/staff">Staff</Link> },
      { key: '13', icon: <AiOutlineProject />, label: <Link to="/project">Project</Link> },
      { key: '16', icon: <AiOutlineFolderOpen />, label: <Link to="/projectDetails">Project Details</Link> },
      { key: '19', icon: <AiOutlineThunderbolt />, label: <Link to="/diesel">Diesel</Link> },
      { key: '12', icon: <AiOutlineAudit />, label: <Link to="/asset">Asset</Link> },
      { key: '15', icon: <AiOutlineSwap />, label: <Link to="/transfer">Transfer</Link> },
      { key: '25', icon: <AiOutlineSwap />, label: <Link to="/Staff-Working-Hours">Staff Working Hours</Link> },
    ],
  },
  {
    type: 'group',
    label: 'Reports',
    children: [
      { key: '23', icon: <AiOutlineFileText />, label: <Link to="/customersReports">Cutomers Reports</Link> },
      { key: '24', icon: <AiOutlineFileText />, label: <Link to="/vendorsReports">Vendors Reports</Link> },
    ],
  },
];

      // Map your route paths to menu keys
  const pathToKey = {
    '/products': '1',
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
    '/dashboard':'22',
    '/customersReports':'23',
    '/vendorsReports':'24',
    '/Staff-Working-Hours':'25',
  };

  
// Helper to find open keys based on selectedKey
function getOpenKeysFromSelectedKey(selectedKey) {
  for (const group of menuItems) {
    if (group.children && group.children.some(item => item.key === selectedKey)) {
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


  const avatarMenuItems = [
  {
    key: 'profile',
    label: 'Profile',
    icon: <SettingOutlined />,
    onClick: () => {
      console.log('Go to profile');
    },
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
    danger: true,
    onClick: () => {
      handleLogout();
    },
  },
];

// const avatarMenu = (
//   <Menu items={avatarMenuItems} />
// );

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
  {menuItems.map(item => {
    // If it's a group with children
    if (item.children) {
      return (
        <Menu.SubMenu
          key={item.label}
          title={item.label}
          icon={item.children[0]?.icon}
        >
          {item.children.map(child => (
            <Menu.Item key={child.key} icon={child.icon}>
              {child.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    }

    // If it's a single menu item (like Dashboard)
    return (
      <Menu.Item key={item.key} icon={item.icon}>
        {item.label}
      </Menu.Item>
    );
  })}
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
          {/* <div style={{ float: 'right',  marginRight: '16px' }}>
              <Dropdown menu={{items:avatarMenuItems}} trigger={['click']} placement="bottomRight">
          <div style={{ cursor: 'pointer' }}>
            <Avatar  size={'large'} icon={<UserOutlined />} />
          </div>
        </Dropdown>
        </div> */}
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
            overflowY: 'auto',
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
