import PropTypes from "prop-types";
import { Table } from "antd";

const ErrorValues = ({ values }) => {
  const columns = [
    {
      title: "Hata Türü",
      dataIndex: "errorType",
      key: "errorType",
    },
    {
      title: "Eğitim Değeri",
      dataIndex: "trainValue",
      key: "trainValue",
      render: (text, record) => {
        if (record.errorType === 'MAPE') {
          return parseFloat(text).toFixed(2) + '%';
        } else {
          return parseFloat(text).toFixed(2);
        }
      },
    },
    {
      title: "Test Değeri",
      dataIndex: "testValue",
      key: "testValue",
      render: (text, record) => {
        if (record.errorType === 'MAPE') {
          return parseFloat(text).toFixed(2) + '%';
        } else {
          return parseFloat(text).toFixed(2);
        }
      },
    },
  ];

  const data = [
    { errorType: "MAE", trainValue: values[0], testValue: values[1] },
    { errorType: "MSE", trainValue: values[2], testValue: values[3] },
    { errorType: "RMSE", trainValue: values[4], testValue: values[5] },
    { errorType: "MAPE", trainValue: values[6], testValue: values[7] },
    { errorType: "R'2", trainValue: values[8], testValue: values[9] },
  ];

  return (
    <div>
      <br />
      <h2 style={{ textAlign: "center", backgroundColor: "#c6e2ff" }}>
        Hata Değerleri
      </h2>

      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

ErrorValues.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      train: PropTypes.number,
      test: PropTypes.number,
    })
  ).isRequired,
};

export default ErrorValues;