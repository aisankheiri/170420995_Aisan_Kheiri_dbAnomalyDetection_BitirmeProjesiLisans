import { useState, useEffect } from "react";
import { Table } from "antd";

function Relationships() {
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_relationships")
      .then((response) => response.json())
      .then((data) => {
        setRelationships(data);
      });
  }, []);

  const columns = [
    {
      title: "Sütun",
      dataIndex: "Sütun",
      key: "Sütun",
    },
    {
      title: "1 için Ortalama",
      dataIndex: "1 için Ortalama",
      key: "1 için Ortalama",
      render: (value) => parseFloat(value).toFixed(6), // 6 basamağa kadar hassasiyet
    },
    {
      title: "0 için Ortalama",
      dataIndex: "0 için Ortalama",
      key: "0 için Ortalama",
      render: (value) => parseFloat(value).toFixed(6), // 6 basamağa kadar hassasiyet
    },
  ];

  return (
    <div>
      <h2 style={{backgroundColor: '#c6e2ff' ,textAlign:"center" }}>İlişkiler</h2>
      <br />
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={relationships}
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

export default Relationships;