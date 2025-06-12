import { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';

function FullData() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get_fulldata')
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
    <DataTable
      dataSource={dataSource}
      columns={tableColumns}
    />
  );
}

export default FullData;