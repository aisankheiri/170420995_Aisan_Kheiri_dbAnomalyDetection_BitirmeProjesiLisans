import { Table } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";

function RandomForestModelPerformance({ result }) {
  useEffect(() => {
    if (result.accuracy < 1) {
      const data = {
        chat_id: -4553577604,
        text: "Random forest modelin accuracy değeri 1'den düşük",
      };

      fetch("http://localhost:5000/send_telegram_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Failed to send telegram bot message.");
          }
        })
        .then((data) => {
          console.log(data); // Sunucu yanıtı
        })
        .catch((error) => {
          console.error("Hata:", error);
        });
    }
  }, [result.accuracy]);
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Precision",
      dataIndex: "precision",
      key: "precision",
    },
    {
      title: "Recall",
      dataIndex: "recall",
      key: "recall",
    },
    {
      title: "F1-Score",
      dataIndex: "f1_score",
      key: "f1_score",
    },
    {
      title: "Support",
      dataIndex: "support",
      key: "support",
    },
  ];

  const dataSource = Object.keys(result.classification_report).map((key) => ({
    key,
    label: key,
    precision: result.classification_report[key].precision,
    recall: result.classification_report[key].recall,
    f1_score: result.classification_report[key]["f1-score"],
    support: result.classification_report[key].support,
  }));

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#c6e2ff",
        }}
      >
        Random Forest Performansı
      </h2>
      <div style={{ textAlign: "center" }}>
        <br />
        <h4>Confusion Matrix:</h4>
        <pre>
          {result.confusion_matrix &&
            result.confusion_matrix.map((row, index) => (
              <div key={index}>{JSON.stringify(row)}</div>
            ))}
        </pre>
        Accuracy: {result.accuracy} <br />{" "}
        {/* accuracy değerinin burada görüntülenmesi gerekiyor */}
        f1-score: {result.f1} <br />
        recall: {result.recall} <br />
        <br />
        <h2>Classification Report:</h2>
        <Table
          style={{ marginLeft: "auto", marginRight: "auto" }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
    </div>
  );
}

RandomForestModelPerformance.propTypes = {
  result: PropTypes.shape({
    classification_report: PropTypes.object,
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
};

export default RandomForestModelPerformance;
