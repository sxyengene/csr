import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Button, message } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getCurrentUser, logout, isAuthenticated } from "../../services/auth";
import { debugTokenStatus } from "./debug";
import styles from "./index.module.scss";

const { Header, Sider, Content, Footer } = Layout;

// 定义移动端断点
const MOBILE_BREAKPOINT = 768;

const BasicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 调试 Token 状态
    console.log("🔍 检查用户认证状态...");
    const tokenStatus = debugTokenStatus();

    // 检查登录状态并获取用户信息
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setCurrentUser(user);
      console.log("✅ 用户已登录:", user);
    } else {
      console.log("❌ 用户未登录，跳转到登录页");
      // 未登录则跳转到登录页
      navigate("/login");
    }
  }, [navigate]);

  // 主要导航菜单
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "事件管理",
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

  // 处理登出
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      message.success("登出成功");
      // logout 函数会自动跳转到登录页
    } catch (error) {
      message.error("登出失败，请重试");
      console.error("登出错误:", error);
    } finally {
      setLoading(false);
    }
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
      disabled: true, // 暂时禁用，后续可以实现
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.logo}>CSR Admin</div>
          {currentUser && (
            <div className={styles.userInfo}>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  loading={loading}
                  className={styles.userButton}
                  size="small"
                >
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className={styles.username}>{currentUser.name}</span>
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          )}
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
        theme="dark"
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
            borderRadius: 4,
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
        {/* 登出按钮放在侧边栏底部 */}
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            loading={loading}
            onClick={handleLogout}
            style={{
              width: "100%",
              color: "#ff4d4f",
              borderColor: "#ff4d4f",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {!collapsed && "退出登录"}
          </Button>
        </div>
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
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
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
          </div>
          {currentUser && (
            <div className={styles.userInfo} style={{ marginRight: 24 }}>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  loading={loading}
                  className={styles.userButton}
                >
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className={styles.username}>{currentUser.name}</span>
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
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
