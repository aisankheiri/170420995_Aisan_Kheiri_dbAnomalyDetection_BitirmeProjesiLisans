import  { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Header } = Layout;
const items = [
  {
    key: "1",
    label: "Ana Sayfa",
    destination: "/",
  },
  {
    key: "2",
    label: "Giriş / Kayıt Ol",
    destination: "/auth",
  },
  {
    key: "3",
    label: "Model Oluştur",
    destination: "/modelPage",
  },
];

const Headerr = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(null);

  const handleItemClick = (key, destination) => {
    setSelectedKey(key);
    navigate(destination);
  };

  const logoURL = "/img/navbar/dp_logo.png"; // Logonun URL'si

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          const selectedItem = items.find((item) => item.key === key);
          if (selectedItem) {
            handleItemClick(selectedItem.key, selectedItem.destination);
          }
        }}
        style={{
          flex: 1,
          minWidth: 0,
        }}
        items={items} // Değişiklik Burada
      />
      <Link to={"/"}>
        <img
          src={logoURL}
          alt="Logo"
          style={{ width: "200px", marginRight: "10px", marginTop: "30px" }}
        />
      </Link>
    </Header>
  );
};

export default Headerr;