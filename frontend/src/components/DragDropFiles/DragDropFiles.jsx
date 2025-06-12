import  { useRef, useState } from "react";
import "./DragDropFiles.css";
import UploadButton from "../UploadButton/UploadButton";

const DragDropFiles = () => {
  const [files, setFiles] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const csvFiles = droppedFiles.filter((file) => file.type === "text/csv");
    if (csvFiles.length === droppedFiles.length) {
      setFiles(csvFiles);
      setErrorMessage(null);
    } else {
      setErrorMessage("Lütfen yalnızca CSV dosyaları yükleyin.");
    }
  };

  const handleUpload = () => {
    if (files && files.every((file) => file.type === "text/csv")) {
      // CSV dosyalarını sunucuya yükle
    } else {
      setErrorMessage("Lütfen yalnızca CSV dosyaları yükleyin.");
    }
  };

  if (files)
    return (
      <div className="uploads">
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className="actions">
          <button onClick={() => setFiles(null)}>Cancel</button>
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>
    );

  return (
    <>
      {!files && (
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1>Eğitilecek Dosya Yükleme işlemini Buradan Yapınız.</h1>
          <input
            type="file"
            multiple
            onChange={(event) => {
              const csvFiles = Array.from(event.target.files).filter(
                (file) => file.type === "text/csv"
              );
              setFiles(csvFiles);
              setErrorMessage(
                csvFiles.length === event.target.files.length
                  ? null
                  : "Lütfen yalnızca CSV dosyaları seçin."
              );
            }}
            hidden
            ref={inputRef}
          ></input>
          <UploadButton />
          
        </div>
      )}
    </>
  );
};

export default DragDropFiles;