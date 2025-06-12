import { useEffect, useState } from "react";
import { Button, Table } from "antd";

const AdminInformation = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/reports_data_adminpage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  const handleDownload = async (reportUrl) => {
    console.log("Downloading report from: ", reportUrl);

    try {
      const response = await fetch(
        "http://localhost:5000/download_special_pdf_button",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reportUrl: reportUrl }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "klavuz.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const columns = [
    {
      title: "Kullanıcı İd Numarası",
      dataIndex: "UserID",
      key: "UserID",
    },
    {
      title: "Kullanıcı Adı",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Şirket İd Numarası",
      dataIndex: "CompanyId",
      key: "CompanyId",
    },
    {
      title: "Rapor Oluşturma Tarihi",
      dataIndex: "CreateDate",
      key: "CreateDate",
    },
    {
      title: "AI Model Adı",
      dataIndex: "AIModelName",
      key: "AIModelName",
    },
    {
      title: "Rol",
      dataIndex: "UserRole",
      key: "UserRole",
    },
    {
      title: "Rapor",
      dataIndex: "Report",
      key: "Report",
      render: (text, record) => (
        <Button
          type="primary"
          shape="round"
          onClick={() => handleDownload(record.Report)}
        >
          İndir
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={userData.map((data, index) => ({ ...data, key: index }))}
      columns={columns}
      pagination={{
        position: ["bottomRight"],
      }}
      size="small"
      style={{ width: "100%" }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default AdminInformation;
