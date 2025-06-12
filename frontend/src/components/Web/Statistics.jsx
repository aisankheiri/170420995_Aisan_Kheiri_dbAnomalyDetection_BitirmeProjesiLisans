import { useState, useEffect } from "react";
import { Table } from "antd";

function Statistics() {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    // Flask API'sinden verileri al
    fetch("http://localhost:5000/get_istatistikler")
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data);
      });
  }, []);

  const columns = [
    {
      title: "Özellik",
      dataIndex: "Özellik",
      key: "Özellik",
    },
    {
      title: "Mod",
      dataIndex: "Mod",
      key: "Mod",
      render: (value) => parseFloat(value).toFixed(2), // 2 basamak hassasiyet
    },
    {
      title: "Medyan",
      dataIndex: "Medyan",
      key: "Medyan",
      render: (value) => parseFloat(value).toFixed(2), // 2 basamak hassasiyet
    },
    {
      title: "Standart Sapma",
      dataIndex: "Standart Sapma",
      key: "Standart Sapma",
      render: (value) => parseFloat(value).toFixed(6), // 6 basamak hassasiyet
    },
    {
      title: "Ortalama",
      dataIndex: "Ortalama",
      key: "Ortalama",
      render: (value) => parseFloat(value).toFixed(6), // 6 basamak hassasiyet
    },
    {
      title: "Minimum",
      dataIndex: "Minimum",
      key: "Minimum",
      render: (value) => parseFloat(value).toFixed(2), // 2 basamak hassasiyet
    },
    {
      title: "Maksimum",
      dataIndex: "Maksimum",
      key: "Maksimum",
      render: (value) => parseFloat(value).toFixed(2), // 2 basamak hassasiyet
    },
  ];

  return (
    <div>
      <h2 style={{backgroundColor: '#c6e2ff' ,textAlign:"center" }}>İstatistiksel Özetler</h2>
      <br />
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={statistics}
          columns={columns}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
      <br />
      <br />
    </div>
  );
}

export default Statistics;