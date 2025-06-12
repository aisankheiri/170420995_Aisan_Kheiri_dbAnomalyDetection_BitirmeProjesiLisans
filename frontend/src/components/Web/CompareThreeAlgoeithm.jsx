import PropTypes from "prop-types";
import { Table } from 'antd';

const CompareThreeAlgoeithm = ({ result1, result2, result3 }) => {
  const columns = [
    {
      title: 'Algorithm',
      dataIndex: 'algorithm',
      key: 'algorithm',
    },
    {
      title: 'Confusion Matrix',
      dataIndex: 'confusion_matrix',
      key: 'confusion_matrix',
      render: matrix => (
        <pre>
          {matrix.map((row, index) => (
            <div key={index}>{JSON.stringify(row)}</div>
          ))}
        </pre>
      ),
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: accuracy => accuracy.toFixed(4),
    },
    {
      title: 'F1-Score',
      dataIndex: 'f1',
      key: 'f1',
      render: f1 => f1.toFixed(4),
    },
    {
      title: 'Recall',
      dataIndex: 'recall',
      key: 'recall',
      render: recall => recall.toFixed(4),
    },
  ];

  const data = [
    {
      key: 'svm',
      algorithm: 'SVM',
      confusion_matrix: result1.confusion_matrix || [],
      accuracy: result1.accuracy,
      f1: result1.f1,
      recall: result1.recall,
    },
    {
      key: 'random_forest',
      algorithm: 'Random Forest',
      confusion_matrix: result2.confusion_matrix || [],
      accuracy: result2.accuracy,
      f1: result2.f1,
      recall: result2.recall,
    },
    {
      key: 'knn',
      algorithm: 'KNN',
      confusion_matrix: result3.confusion_matrix || [],
      accuracy: result3.accuracy,
      f1: result3.f1,
      recall: result3.recall,
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", backgroundColor: "#ffff00" ,marginTop:"2rem"}}>
        <h2>Makine öğrenmede üç algoritmanın performans olarak kıyaslanması aşağıdaki gibidir</h2>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} size="small"
        style={{ width: "100%" }}
        scroll={{ x: "max-content" }}/>
    </div>
  );
};

CompareThreeAlgoeithm.propTypes = {
  result1: PropTypes.shape({
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
  result2: PropTypes.shape({
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
  result3: PropTypes.shape({
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
};

export default CompareThreeAlgoeithm;