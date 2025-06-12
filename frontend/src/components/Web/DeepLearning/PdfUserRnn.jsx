import { useState } from "react";
import { Button, notification } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));
const username = user ? user.username : null;

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role : null;
};
const userRole = getUserRole();
console.log(userRole);
console.log(username);

function PdfUserRnn({
  result,
  answer1,
  companyiddValue,
}) {
  const [downloaded, setDownloaded] = useState(false);
  const [path, setPath] = useState("");


  const openNotification = (message, description) => {
    notification.open({
      message: message,
      description: description,
      style: {
        backgroundColor: "lightgreen", // Arka plan rengi olarak yeşil tonu
      },
    });
  };

  const handleCreate = async () => {
    if (!downloaded) {
      openNotification(
        "PDF Oluşturuluyor",
        "Rapor size özel hazırlandığı için biraz zaman alıcı, lütfen bekleyiniz..."
      );

      const user = JSON.parse(localStorage.getItem("user"));
      const username = user ? user.username : null;

      try {
        const response = await axios.post(
          "http://localhost:5000/generate_pdf_rnn",
          {
            answer: result.answer,
            noron: result.noron,
            dropout: result.dropout,
            epoch: result.epoch,
            batch: result.batch,
            optimizer: result.optimizer,
            lossfunc: result.lossfunc,
            activation : result.activation,
            username: username,
            companyiddValue: companyiddValue,
            answer1:answer1,
          }
        );

        const outputPdfPath = response.data;
        console.log("dosya yolu react tarafi:", outputPdfPath);
        setPath(outputPdfPath);
        setDownloaded(true);

        fetch("http://localhost:5000/add_reports_rnn_data_adminpage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            companyiddValue: companyiddValue,
            outputPdfPath: outputPdfPath,
          }),
        });
      } catch (error) {
        console.error("Hata oluştu:", error);
      }
    }
  };
  
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:5000/download_pdf", {
        method: "POST",
        body: JSON.stringify({ path }), // path bilgisini JSON formatında gönder
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "kriter.sql");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // parentNode yerine document.body kullanarak kaldırma işlemi yapılmalı
      } else {
        console.error("Dosya indirilemedi.");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <div style={{ textAlign: "justify" }}>
        
        <br />
        <br />
      </div>
     
      <Button
        type="primary"
        shape="round"
        size="large"
        onClick={handleCreate}
        style={{ fontSize: "16px", padding: "10px 30px" }}
      >
        Rapor Oluştur
      </Button>

      {downloaded && (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={handleDownload}
          style={{ fontSize: "16px", padding: "10px 30px" }}
        >
          Rapor indir
        </Button>
      )}
    </div>
  );
}

PdfUserRnn.propTypes = {
  result: PropTypes.shape({
    answer: PropTypes.string,
    noron: PropTypes.number,
    dropout: PropTypes.number,
    epoch: PropTypes.number,
    batch: PropTypes.number,
    optimizer: PropTypes.string,
    lossfunc: PropTypes.string,
    activation: PropTypes.string,
  }),
  companyiddValue: PropTypes.number,
  answer1: PropTypes.string,
};

export default PdfUserRnn;
