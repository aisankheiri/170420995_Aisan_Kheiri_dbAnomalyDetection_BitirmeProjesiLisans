import { Table } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";

function KnnModelPerformance({ result }) {
  useEffect(() => {
    if (result.accuracy < 1) {
      const data = {
        chat_id: -4553577604,
        text: "Knn modelin accuracy değeri 1'den düşük",
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

  const dataSource = [
    {
      key: "false",
      label: "False",
      precision: result.classification_report
        ? result.classification_report["False"]["precision"]
        : "",
      recall: result.classification_report
        ? result.classification_report["False"]["recall"]
        : "",
      f1_score: result.classification_report
        ? result.classification_report["False"]["f1-score"]
        : "",
      support: result.classification_report
        ? result.classification_report["False"]["support"]
        : "",
    },
    {
      key: "true",
      label: "True",
      precision: result.classification_report
        ? result.classification_report["True"]["precision"]
        : "",
      recall: result.classification_report
        ? result.classification_report["True"]["recall"]
        : "",
      f1_score: result.classification_report
        ? result.classification_report["True"]["f1-score"]
        : "",
      support: result.classification_report
        ? result.classification_report["True"]["support"]
        : "",
    },
    {
      key: "accuracy",
      label: "Accuracy",
      precision: "",
      recall: "",
      f1_score: result.classification_report
        ? result.classification_report["accuracy"]
        : "",
      support: result.classification_report
        ? result.classification_report["macro avg"]["support"]
        : "",
    },
    {
      key: "macro_avg",
      label: "Macro Avg",
      precision: result.classification_report
        ? result.classification_report["macro avg"]["precision"]
        : "",
      recall: result.classification_report
        ? result.classification_report["macro avg"]["recall"]
        : "",
      f1_score: result.classification_report
        ? result.classification_report["macro avg"]["f1-score"]
        : "",
      support: result.classification_report
        ? result.classification_report["macro avg"]["support"]
        : "",
    },
    {
      key: "weighted_avg",
      label: "Weighted Avg",
      precision: result.classification_report
        ? result.classification_report["weighted avg"]["precision"]
        : "",
      recall: result.classification_report
        ? result.classification_report["weighted avg"]["recall"]
        : "",
      f1_score: result.classification_report
        ? result.classification_report["weighted avg"]["f1-score"]
        : "",
      support: result.classification_report
        ? result.classification_report["weighted avg"]["support"]
        : "",
    },
  ];

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
        SVM Performansı
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
        Accuracy: {result.accuracy} <br />
        f1-score: {result.f1} <br />
        recall: {result.recall} <br />
        <br />
        <h2>Classification Report:</h2>
        <Table
          style={{ marginLeft: "auto", marginRight: "auto" }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
// result prop'unun doğrulama şeması
KnnModelPerformance.propTypes = {
  result: PropTypes.shape({
    classification_report: PropTypes.object,
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
};

export default KnnModelPerformance;
