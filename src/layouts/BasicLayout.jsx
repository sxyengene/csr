import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;

// 定义移动端断点
const MOBILE_BREAKPOINT = 768;

const BasicLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );
  const navigate = useNavigate();
  const location = useLocation();

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "活动管理",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "用户管理",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 移动端布局
  if (isMobile) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "fixed",
            width: "100%",
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              float: "left",
              width: 120,
              height: 31,
              margin: "16px 24px 16px 0",
            }}
          >
            CSR Admin
          </div>
        </Header>
        <Content
          style={{
            marginTop: 64,
            marginBottom: 60,
            padding: 16,
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            padding: 0,
            position: "fixed",
            width: "100%",
            bottom: 0,
            zIndex: 100,
            background: "#fff",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={menuItems}
            style={{
              display: "flex",
              justifyContent: "space-around",
              border: "none",
            }}
          />
        </Footer>
      </Layout>
    );
  }

  // PC端布局
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            color: "#fff",
            lineHeight: "32px",
          }}
        >
          {!collapsed && "CSR Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}
      >
        <Header
          style={{
            padding: 0,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: {
                padding: "0 24px",
                fontSize: "18px",
                cursor: "pointer",
              },
            }
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: 4,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
