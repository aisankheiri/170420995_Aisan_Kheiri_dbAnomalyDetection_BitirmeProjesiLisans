import { useState } from "react";
import { Table, Button, notification, Alert, Select, Form, Flex } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
const { Option } = Select;

const openNotification = (message, description) => {
  notification.open({
    message: message,
    description: description,
    style: {
      backgroundColor: "#f72d09", // Kırmızı tonu
    },
  });
};
const data = [
  {
    key: "1",
    metric: "% İşlemci Zamanı (Ortalama) (% Average Processor Time)",
    large: " 25 < ",
    medium: " 25 - 10 ",
    small: " 10 > ",
  },
  {
    key: "2",
    metric: "Saniye Başına İşlem Sayısı (Ortalama) birimi: işlem/saniye (Average TPS)",
    large: " 1500 < ",
    medium: " 1500 - 500 ",
    small: " 500 > ",
  },
  {
    key: "3",
    metric: "En Fazla Bağlantı Adeti birimi: adet (Max Connection Count)",
    large: " 100 < ",
    medium: "100 - 10 ",
    small: " 10 > ",
  },
  {
    key: "4",
    metric: "Toplam Bağlantı Adeti birimi: adet (Total Connection Count)",
    large: " 1000 < ",
    medium: " 750 - 400 ",
    small: " 400 > ",
  },
  {
    key: "5",
    metric: "Ortalama Bağlantı Adeti birimi: adet (Average Connection Count)",
    large: " 10 < ",
    medium: " 10 - 5 ",
    small: " 5 > ",
  },
  {
    key: "6",
    metric: "En Fazla İşlem birimi: adet (Max Transaction)",
    large: " 150 < ",
    medium: " 150 - 25",
    small: " 25 > ",
  },
  {
    key: "7",
    metric: "Ortalama İşlem Sayısı birimi: adet (Average Transaction)",
    large: " 15 < ",
    medium: " 15 - 5 ",
    small: " 5 > ",
  },
  {
    key: "8",
    metric: "Hafıza birimi: GB (Memory)",
    large: " 128 GB < ",
    medium: " 128 - 100 GB ",
    small: " 100 GB > ",
  },
  {
    key: "9",
    metric: "Toplam Satır Sayısı birimi: adet (Row Count)",
    large: " 2.3 billion < ",
    medium: " 2.3 - 1 billion ",
    small: " 1 billion > ",
  },
  {
    key: "10",
    metric: "Ortalama İşlem Günlüğü Yedekleme birimi: GB (Transaction Log Backup)",
    large: " 10 GB < ",
    medium: " 10 - 5 GB ",
    small: " 5 GB > ",
  },
];
const MetricsTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState(null);
  const [form] = Form.useForm();

  const handleDownloadKriterSql = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/download_kriter_sql",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "kriter.sql");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleRadioChange = (record, sizeType) => {
    setSelectedRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.key !== record.key);
      return [
        ...updatedRows,
        {
          key: record.key,
          metric: record.metric,
          sizeType: sizeType,
          size: record[sizeType],
        },
      ];
    });
  };

  const handleSaveClick = () => {
    const openNotificationn = (type, message) => {
      notification[type]({
          message: type,
          description: message,
          duration: 10
      });
  };
    const sizeTranslations = {
        large: "büyük",
        medium: "orta",
        small: "küçük"
    };

    const hasEmptySelection = data.some(
        (item) => !selectedRows.find((row) => row.key === item.key)
    );

    if (hasEmptySelection) {
        openNotification("Uyarı", "Lütfen tüm satırlarda seçim yapınız.");
    } else {
        const typesCount = selectedRows.reduce((acc, curr) => {
            return {
                ...acc,
                [curr.sizeType]: (acc[curr.sizeType] || 0) + 1,
            };
        }, {});

        let mostSelectedSize = "";
        let count = 0;

        for (const [size, sizeCount] of Object.entries(typesCount)) {
            if (sizeCount > count) {
                mostSelectedSize = size;
                count = sizeCount;
            }
        }

        const translatedSize = sizeTranslations[mostSelectedSize] || mostSelectedSize;

        setMessage(
            `Seçtiğiniz değerlere göre şirket ${translatedSize} kategorisinde yer almaktadır. (Seçilen miktar: ${count} adet)`
        );
        if (translatedSize === 'büyük') {
          openNotificationn("info", "Şirket büyük olduğu için SVM algoritması tercih edilmesi önerilmektedir.");
      } else if (translatedSize === 'orta') {
          openNotificationn("info", "Şirket orta olduğu için Random Forest algoritması tercih edilmesi önerilmektedir.");
      } else if (translatedSize === 'küçük') {
          openNotificationn("info", "Şirket küçük olduğu için KNN algoritması tercih edilmesi önerilmektedir.");
      }
   
    }
};
  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
    },
    {
      title: "Büyük",
      dataIndex: "large",
      key: "large",
      render: (text, record) => (
        <div>
          <input
            type="radio"
            name={`size_${record.key}`}
            onChange={() => handleRadioChange(record, "large")}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Orta",
      dataIndex: "medium",
      key: "medium",
      render: (text, record) => (
        <div>
          <input
            type="radio"
            name={`size_${record.key}`}
            onChange={() => handleRadioChange(record, "medium")}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Küçük",
      dataIndex: "small",
      key: "small",
      render: (text, record) => (
        <div>
          <input
            type="radio"
            name={`size_${record.key}`}
            onChange={() => handleRadioChange(record, "small")}
          />
          {text}
        </div>
      ),
    },
  ];
  const EditionOptions = [
    {
      label: "Enterprise",
      value: "Enterprise",
    },
    {
      label: "Standard",
      value: "Standart",
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div>
        <Flex
          vertical
          gap="small"
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <Button
            style={{ marginTop: "1rem" }}
            onClick={handleDownloadKriterSql}
            shape="round"
            icon={<DownloadOutlined />}
          >
            Aşağıdaki bilgilere ulaşmak için lütfen belgeyi indirip veritabanı üzerinde scripti çalıştırınız!
          </Button>
        </Flex>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <Form form={form} style={{ marginLeft: "1rem", marginTop: "1rem" }}>
        <Form.Item name="Edition" label="Sürum Not (Edition)">
          <Select>
            {EditionOptions.map((option,index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Button style={{ marginTop: "1rem" }} onClick={handleSaveClick}>
        Seçilenleri Kaydet
      </Button>
      {message && (
        <Alert
          message={message}
          type="info"
          showIcon
          style={{ marginTop: "1rem" }}
        />
      )}
    </div>
  );
};

export default MetricsTable;
