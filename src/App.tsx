import React, { useState } from 'react';
import {
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, Modal, theme} from 'antd';
import TableComponent from "@/components/Table";
import CreateTraining from "@/components/CreateTraining";
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">
                    MasKey DINO
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Training',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>

                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        borderRadius: borderRadiusLG,
                    }}
                >
                 <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;