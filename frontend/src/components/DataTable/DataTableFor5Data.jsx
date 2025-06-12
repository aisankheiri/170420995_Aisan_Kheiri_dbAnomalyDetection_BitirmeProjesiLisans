import PropTypes from 'prop-types';
import { Table } from 'antd';

const DataTableFor5Data = ({ dataSource, columns }) => {
  return (
    <>
      <h2 style={{ marginTop: '4rem', textAlign: 'center', backgroundColor: '#c6e2ff' }}>Dosya İçeriğine ait ilk 5 satır</h2>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        style={{ width: '100%' }}
        scroll={{ x: 'max-content' }}
      />
      <br/>
      <br/>
    </>
  );
};

DataTableFor5Data.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default DataTableFor5Data;