import { Image } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  RightCircleOutlined,
  FilePdfOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";

import UserInformation from "./UserInformation";
import UserReports from "./UserReports";
import AdminInformation from "./AdminInformation";
import CompanyInformation from "./CompanyInformation";

const { Header, Sider, Content } = Layout;

const user = JSON.parse(localStorage.getItem("user"));
const username = user ? user.username : null;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleMenuSelect = (item) => {
    setSelectedKey(item.key);
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={160}
        style={{
          left: collapsed ? "initial" : 0,
          right: collapsed ? 0 : "initial",
          height: "100%",
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onSelect={handleMenuSelect}
          mode="vertical"
          defaultSelectedKeys={["1"]}
          style={{
            position: "fixed",
            left: 0,
            height: "100vh",
            backgroundColor: "#add8e6",
          }}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: `Hoş Geldin ${username}`,
            },
            
           
            {
              key: "4",
              icon: <RightCircleOutlined />,
              label: "Kullanıcı Bilgileri",
            },
            {
              key: "5",
              icon: <FilePdfOutlined />,
              label: "Kullanıcı Raporları",
            },
            {
              key: "6",
              icon: <BankOutlined />,
              label: "Şirket Bilgileri",
            },
            {
              key: "3",
              icon: <HomeOutlined />,
              label: (
                <a href="/" className="menu-item">
                  <span className="menu-item-label">Ana Sayfa</span>
                </a>
              ),
            },
            {
              key: "2",
              icon: (
                <LogoutOutlined
                  onClick={() => {
                    if (
                      window.confirm("Çıkış yapmak istediğinize emin misiniz?")
                    ) {
                      localStorage.removeItem("user");
                      window.location.href = "./";
                    }
                  }}
                />
              ),
              label: (
                <span
                  className="menu-item"
                  onClick={() => {
                    if (
                      window.confirm("Çıkış yapmak istediğinize emin misiniz?")
                    ) {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }
                  }}
                >
                  Çıkış
                </span>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            "@media (maxwidth: 768px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "1rem",
            },
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div style={{ marginLeft: "16px" }}>
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`
                    ),
                }}
              >
                <Image
                  width={180}
                  src="https://dataplatform.com.tr/wp-content/uploads/2022/01/Asset-5.png"
                />
              </Image.PreviewGroup>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              "@media (maxwidth: 768px)": { marginTop: "1rem" },
            }}
          ></div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 450,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div style={{ marginLeft: "2rem" }}>
            <h4 style={{ textAlign: "center", marginBottom: "2rem" }}>
              Admin Paneline Hoş Geldin {username}
            </h4>
          </div>
          {selectedKey === "1" && (
            <AdminInformation/>
            // Kullanıcı "Kullanıcı Bilgileri" öğesine tıkladığında yapılacak işlemler
            // Örneğin, belirli bir componenti gösterme veya başka bir işlem yapma
          )}
          {selectedKey === "4" && (
            <UserInformation />
            // Kullanıcı "Kullanıcı Bilgileri" öğesine tıkladığında yapılacak işlemler
            // Örneğin, belirli bir componenti gösterme veya başka bir işlem yapma
          )}
          {selectedKey === "5" && (
            <UserReports />
            // Kullanıcı "Kullanıcı Bilgileri" öğesine tıkladığında yapılacak işlemler
            // Örneğin, belirli bir componenti gösterme veya başka bir işlem yapma
          )}
          {selectedKey === "6" && (
            <CompanyInformation />
            // Kullanıcı "Kullanıcı Bilgileri" öğesine tıkladığında yapılacak işlemler
            // Örneğin, belirli bir componenti gösterme veya başka bir işlem yapma
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
