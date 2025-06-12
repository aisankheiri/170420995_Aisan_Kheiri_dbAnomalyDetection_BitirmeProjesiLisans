import PropTypes from "prop-types";
import { Table } from "antd";

const CompareValuesDeep = ({ values1, values2 }) => {
  const columns = [
    {
      title: "Hata Türü",
      dataIndex: "errorType",
      key: "errorType",
    },
    {
      title: "Eğitim Değeri LSTM",
      dataIndex: "trainValue1",
      key: "trainValue1",
      render: (text, record) => record.errorType === "MAPE" ? parseFloat(text).toFixed(2) + "%" : parseFloat(text).toFixed(2),
    },
    {
      title: "Test Değeri LSTM",
      dataIndex: "testValue1",
      key: "testValue1",
      render: (text, record) => record.errorType === "MAPE" ? parseFloat(text).toFixed(2) + "%" : parseFloat(text).toFixed(2),
    },
    {
      title: "Eğitim Değeri RNN",
      dataIndex: "trainValue2",
      key: "trainValue2",
      render: (text, record) => record.errorType === "MAPE" ? parseFloat(text).toFixed(2) + "%" : parseFloat(text).toFixed(2),
    },
    {
      title: "Test Değeri RNN",
      dataIndex: "testValue2",
      key: "testValue2",
      render: (text, record) => record.errorType === "MAPE" ? parseFloat(text).toFixed(2) + "%" : parseFloat(text).toFixed(2),
    },
  ];

  const data = [
    { errorType: "MAE", trainValue1: values1[0], testValue1: values1[1], trainValue2: values2[0], testValue2: values2[1] },
    { errorType: "MSE", trainValue1: values1[2], testValue1: values1[3], trainValue2: values2[2], testValue2: values2[3] },
    { errorType: "RMSE", trainValue1: values1[4], testValue1: values1[5], trainValue2: values2[4], testValue2: values2[5] },
    { errorType: "MAPE", trainValue1: values1[6], testValue1: values1[7], trainValue2: values2[6], testValue2: values2[7] },
    { errorType: "R'2", trainValue1: values1[8], testValue1: values1[9], trainValue2: values2[8], testValue2: values2[9] },
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

CompareValuesDeep.propTypes = {
  values1: PropTypes.arrayOf(PropTypes.number).isRequired,
  values2: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CompareValuesDeep;