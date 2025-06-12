import  { useState } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const JustCsv = () => {
  const [fileList, setFileList] = useState([]);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      if (!isCSV) {
        message.error(`${file.name} bir CSV dosyası değil`);
      } else if (fileList.length >= 1) {
        message.error("En fazla 1 dosya yükleyebilirsiniz.");
        return Upload.LIST_IGNORE;
      } else {
        message.success(`${file.name} başarıyla yüklendi`);
        setFileList([...fileList, file]);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    fileList,
    itemRender: (originNode, file, fileList, actions) => (
      <div style={{ color: "blue", display: "flex", alignItems: "center" }}>
        <span>{file.name}</span>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => actions.remove(file)}
          style={{ marginLeft: "8px" }}
        />
      </div>
    ),
  };

  return (
    <div>
      <Upload {...props} maxCount={1}>
        <Button icon={<UploadOutlined />}>Sadece CSV Yükle</Button>
      </Upload>
    </div>
  );
};

export default JustCsv;

// import React, { useState } from "react";
// import { Upload, Button, message, Table } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import Papa from "papaparse";
// import DataTable from "../DataTable/DataTable";
// import "./UploadButton.css";

// const UploadButton = () => {
//   const [file, setFile] = useState(null);
//   const [fileContent, setFileContent] = useState([]);
//   const [columns, setColumns] = useState([]);

//   const handleUpload = (info) => {
//     if (info.file.status !== "uploading") {
//       setFile(info.file);
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} dosyası başarıyla yüklendi`);
//       setFile(info.file);
//       console.log("Dosya Başarıyla Yüklendi");
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} dosya yüklenemedi.`);
//     } else if (info.file.status === "removed") {
//       setFile(null);
//       setFileContent([]);
//       setColumns([]);
//     }
//   };

//   const handleSubmit = () => {
//     if (!file) {
//       message.error("Öncelikle CSV dosyasını seçiniz.");
//       return;
//     }

//     Papa.parse(file, {
//       header: true,
//       complete: function (results) {
//         console.log("CSV Dosyası İçeriği:", results.data);
//         setFileContent(results.data);
//         const headerColumns = Object.keys(results.data[0]).map(
//           (columnName) => ({
//             title: columnName,
//             dataIndex: columnName,
//             key: columnName,
//           })
//         );
//         setColumns(headerColumns);
//       },
//     });
//   };

//   return (
//     <div>
//       <div className="dropzone">
//         <h1> Eğitimek İstediğiniz Dosyayı Yükleyin.</h1>
//         <Upload
//           beforeUpload={() => false}
//           onChange={handleUpload}
//           maxCount={1}
//           accept=".csv"
//         >
//           <Button icon={<UploadOutlined />} style={{ marginTop: "1rem" }}>
//             Sadece CSV
//           </Button>
//         </Upload>
//         <Button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
//           Yükle
//         </Button>
//       </div>
//       <div>
//         {fileContent.length > 0 && (
//           <DataTable
//             dataSource={fileContent.map((item, index) => ({
//               ...item,
//               key: index,
//             }))}
//             columns={columns}
//             fileName={file.name}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadButton;
