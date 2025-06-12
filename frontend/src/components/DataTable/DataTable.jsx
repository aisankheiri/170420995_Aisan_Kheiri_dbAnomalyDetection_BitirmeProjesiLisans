import PropTypes from 'prop-types';
import { Table } from "antd";

const DataTable = ({ dataSource, columns }) => {
  return (
    <>
      <h2 style={{ marginTop: "4rem", textAlign: "center" ,backgroundColor:"#c6e2ff"}}>Dosya İçeriği Tablo Şeklinde</h2>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomRight"],
        }}
        size="small"
        style={{ width: "100%" }}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

DataTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default DataTable;