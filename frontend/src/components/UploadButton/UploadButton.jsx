import { useState } from "react";
import { Upload, Button, message, Spin } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import "./UploadButton.css";

import AfterButton from "../Web/AfterButton";

const UploadButton = () => {
  const [files, setFiles] = useState([null, null]);
  const [showAfterButton, setShowAfterButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMerge, setLoadingMerge] = useState(false);
  const [fileCount, setFileCount] = useState(0); // Dosya sayısını tutmak için
  const [fileList, setFileList] = useState([]);
  const [mergeSuccess, setMergeSuccess] = useState(false);
  const [mergeFail, setMergeFail] = useState(true);

  const handleFileChange = (file, index) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    if (newFiles[0] && newFiles[1]) {
      console.log("Dosya 1 İçeriği:", newFiles[0]);
      console.log("Dosya 2 İçeriği:", newFiles[1]);
    }
  };

  const beforeUpload = (file) => {
    const isCSV =
      file.type === "text/csv" || file.type === "application/vnd.ms-excel";
    if (!isCSV) {
      message.error(`${file.name} bir CSV dosyası değil`);
      return Upload.LIST_IGNORE;
    } else if (fileCount >= 2) {
      // Dosya sayısını kontrol et
      message.error("En fazla 2 dosya yükleyebilirsiniz.");
    } else {
      setFileCount(fileCount + 1); // Dosya yüklendiğinde sayacı artır
      message.success(`${file.name} başarıyla yüklendi`);
      handleFileChange(file, fileCount);
    }
  };

  const onRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);

    // Dosya silindiğinde dosya sayısını azalt
    setFileCount(fileCount - 1);
  };

  const handleSubmit = () => {
    if (
      files.filter((file) => file !== null).length !== 1 &&
      files.filter((file) => file !== null).length !== 2
    ) {
      message.error("Lütfen bir ya da iki CSV dosyanızı yükleyiniz.");
      return;
    }

    if (files[0] && files[1]) {
      setLoading(true);

      const formData = new FormData();
      formData.append("file1", files[0]);
      formData.append("file2", files[1]);

      // Dosya yükleme ve işlemler devam ediyor...

      setTimeout(() => {
        Papa.parse(files[0], {
          header: true,
          complete: function (results) {
            console.log("Dosya 1 İçeriği:", results.data);
          },
        });

        Papa.parse(files[1], {
          header: true,
          complete: function (results) {
            console.log("Dosya 2 İçeriği:", results.data);
            setShowAfterButton(true);
            setLoading(false);
          },
        });
      }, 1000);
    } else {
      setLoading(true);

      const formData = new FormData();
      formData.append("file1", files[0]);

      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      // Dosya yükleme ve işlemler devam ediyor...

      setTimeout(() => {
        Papa.parse(files[0], {
          header: true,
          complete: function (results) {
            console.log("Dosya İçeriği:", results.data);
            setShowAfterButton(true);
            setLoading(false);
          },
        });
      }, 1000);
    }
  };

  const handleMerge = () => {
    if (
      files.filter((file) => file !== null).length !== 1 &&
      files.filter((file) => file !== null).length !== 2
    ) {
      message.error("Lütfen bir ya da iki CSV dosyanızı yükleyiniz.");
      return;
    }

    if (files[0] && files[1]) {
      setLoadingMerge(true);

      const formData = new FormData();
      formData.append("file1", files[0]);
      formData.append("file2", files[1]);

      // Dosya yükleme ve işlemler devam ediyor...
      fetch("http://localhost:5000/upload1", {
        method: "POST",
        body: formData,
      });
      fetch("http://localhost:5000/upload2", {
        method: "POST",
        body: formData,
      });
      fetch("http://localhost:5000/merge_csv_files", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            message.success("Tebrikler! Dosyalar başarıyla birleştirildi.");
            setMergeSuccess(true);
            setMergeFail(true);
            setTimeout(() => {
              message.info("Şimdi algoritma seçimi yapabilirsiniz.");
            }, 4000);
          } else {
            setMergeSuccess(false);
            setMergeFail(false);
            message.error(
              "İki dosyanın sütun isimleri eşleşmiyor, dosyalar birleştirilemedi."
            );
            // İkinci bildirimi 2 saniye sonra göster
            setTimeout(() => {
              message.info(
                "Aynı sütun isimlerine sahip dosya türü yükleyiniz."
              );
            }, 3000);
          }
        })
        .catch((error) => {
          // Hata durumunda genel bir hata mesajı
          message.error("Bir hata oluştu: " + error);
        });

      setTimeout(() => {
        Papa.parse(files[0], {
          header: true,
          complete: function (results) {
            console.log("Dosya 1 İçeriği:", results.data);
          },
        });

        Papa.parse(files[1], {
          header: true,
          complete: function (results) {
            console.log("Dosya 2 İçeriği:", results.data);
            setLoadingMerge(false);
          },
        });
      }, 1000);
    } else {
      setLoadingMerge(true);

      const formData = new FormData();
      formData.append("file1", files[0]);

      // Dosya yükleme ve işlemler devam ediyor...

      setTimeout(() => {
        Papa.parse(files[0], {
          header: true,
          complete: function (results) {
            console.log("Dosya İçeriği:", results.data);
            setLoadingMerge(false);
          },
        });
      }, 1000);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/download_merge_2_csv",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "model.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };
  const handleDownloadKlavuz = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/download_kullanim_klavuzu",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "klavuz.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleDownloadCSVscript = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/download_csv_script",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "CsvMake.txt");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  return (
    <div>
      <div className="dropzone">
        <h2> Eğitim İçin İstediğiniz Dosya/Dosyaları Yükleyiniz.</h2>
        <div>
          <Button
            style={{ marginTop: "1rem" }}
            onClick={handleDownloadKlavuz}
            shape="round"
            icon={<DownloadOutlined />}
          >
            Kullanım Kılavuzu İndir
          </Button>
          <Button
            style={{ marginTop: "1rem" }}
            onClick={handleDownloadCSVscript}
            shape="round"
            icon={<DownloadOutlined />}
          >
            CSV Oluşturma İçin Scripti İndir
          </Button>
        </div>
        <br />
        <Upload
          beforeUpload={beforeUpload}
          onRemove={onRemove}
          maxCount={2}
          accept=".csv"
        >
          <Button
            icon={<UploadOutlined />}
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            Sadece CSV Yükle
          </Button>
        </Upload>
        {fileCount === 2 && (
          <Button
            onClick={handleMerge}
            style={{ marginTop: "1rem" }}
            type="primary"
          >
            {loadingMerge ? <Spin style={{ marginRight: "0.5rem" }} /> : null}
            Önce 2 Dosyayı Birleştir
          </Button>
        )}
        {mergeSuccess && fileCount === 2 && (
          <Button
            style={{ marginTop: "1rem" }}
            onClick={handleDownload}
            shape="round"
            icon={<DownloadOutlined />}
          >
            Birleşen CSV Dosyasını İndir
          </Button>
        )}
        {mergeFail && (
          <Button
            onClick={handleSubmit}
            style={{ marginTop: "1rem" }}
            type="dashed"
          >
            {loading ? <Spin style={{ marginRight: "0.5rem" }} /> : null}
            Algoritma Seçimi Yap
          </Button>
        )}
        <p style={{ marginTop: "2rem" }}>
          Yüklenen Dosya Sayısı: {fileCount}
        </p>{" "}
        {/* Dosya sayısını göster */}
      </div>
      <div>{showAfterButton && <AfterButton />}</div>
    </div>
  );
};

export default UploadButton;
