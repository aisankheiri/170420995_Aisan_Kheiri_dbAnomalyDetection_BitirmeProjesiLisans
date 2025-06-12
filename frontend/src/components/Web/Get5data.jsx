import { useEffect, useState } from 'react';
import DataTableFor5Data from '../DataTable/DataTableFor5Data';

function Get5data() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get_5data')
      .then(response => response.json())
      .then(data => {
        setColumns(data[0]);
        setRows(data[1]);
      });
  }, []);

  const dataSource = rows.map((row, rowIndex) => {
    const rowData = {};
    columns.forEach((column, index) => {
      rowData[column] = row[index];
    });
    return {
      ...rowData,
      key: rowIndex.toString() // Benzersiz "key" değeri olarak rowIndex'i kullanıyoruz
    };
  });

  const tableColumns = columns.map(column => ({
    title: column,
    dataIndex: column,
    key: column,
  }));

  return (
    <DataTableFor5Data
      dataSource={dataSource}
      columns={tableColumns}
    />
  );
}

export default Get5data;