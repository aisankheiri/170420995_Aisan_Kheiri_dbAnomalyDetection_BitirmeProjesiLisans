import { useState } from "react";
import { Image } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CaretRightOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
// import UploadButton from "../../components/UploadButton/UploadButton";
import MachineStepsPage from "../../components/StepsPage/MachineStepsPage";
import DeepStepsPage from "../../components/StepsPage/DeepStepsPage";
import UserDetailPage from "../user/UserDetailPage";
import UserReports from "../../components/Web/DeepLearning/UserReports";

import KullanimKlavuzu from "../../components/Web/KullanimKlavuzu";

const { Header, Sider, Content } = Layout;

const user = JSON.parse(localStorage.getItem("user"));
const username = user ? user.username : null;

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role : null;
};

const ModelPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleMenuSelect = (item) => {
    setSelectedKey(item.key);
  };
  const userRole = getUserRole();
  

  if (userRole === "user") {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={80}
          style={{
            left: collapsed ? "initial" : 0,
            right: collapsed ? 0 : "initial",
            height: "100%",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            onSelect={handleMenuSelect}
            theme="dark"
            mode="vertical"
            defaultSelectedKeys={["1"]}
            // style={{ position: "fixed", left: 0, height: "100vh" }}
            style={{
              position: "fixed",
              left: 0,
              height: "100vh",
              width: collapsed ? 80 : 200,
              transition: "width 0.3s",
            }}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: `Hoş Geldin ${username}`,
              },
              {
                key: "2",
                icon: <CaretRightOutlined />,
                label: "Makine Öğrenme",
              },
              {
                key: "3",
                icon: <CaretRightOutlined />,
                label: "Derin Öğrenme",
              },

              {
                key: "4",
                icon: <HomeOutlined />,
                label: (
                  <a href="/" className="menu-item">
                    <span className="menu-item-label">Ana Sayfa</span>
                  </a>
                ),
              },
              {
                key: "5",
                icon: <FilePdfOutlined />,
                label: "Raporlar",
              },
              {
                key: "6",
                icon: <FilePdfOutlined />,
                label: "Web Kullanım Kılavuzu",
              },
              {
                key: "7",
                icon: (
                  <LogoutOutlined
                    onClick={() => {
                      if (
                        window.confirm(
                          "Çıkış yapmak istediğinize emin misiniz?"
                        )
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
                        window.confirm(
                          "Çıkış yapmak istediğinize emin misiniz?"
                        )
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
            {selectedKey === "1" && <UserDetailPage />}
            {selectedKey === "2" && (
              <MachineStepsPage />

              // Kullanıcı "Kullanıcı Bilgileri" öğesine tıkladığında yapılacak işlemler
              // Örneğin, belirli bir componenti gösterme veya başka bir işlem yapma
            )}
            {selectedKey === "3" && <DeepStepsPage />}
            {selectedKey === "5" && <UserReports />}
            {selectedKey === "6" && 
            <KullanimKlavuzu/>}
          </Content>
        </Layout>
      </Layout>
    );
  } else {
    return (window.location.href = "/auth");
  }
};

export default ModelPage;
