import { useState } from "react";
import { Button, notification } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

function PdfUserKNN({
  result,
  answerHeatmap,
  answerHeatmap2,
  answerHeatmap3,
  answerHeatmap4,
  answerHeatmap5,
  answerHeatmap6,
  answerHeatmap7,
  answerHeatmap8,
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
          "http://localhost:5000/generate_pdf_knn",
          {
            answer: result.answer,
            answer1: answerHeatmap, // answerHeatmap'i answer1 olarak gönderiyoruz
            answer2: answerHeatmap2,
            answer3: answerHeatmap3,
            answer4: answerHeatmap4,
            answer5: answerHeatmap5,
            answer6: answerHeatmap6,
            answer7: answerHeatmap7,
            answer8: answerHeatmap8,
            kernel: result.kernel,
            c: result.c,
            sutun1: result.sutun1,
            sutun2: result.sutun2,
            test_size: result.test_size,
            random_state: result.random_state,
            deger: result.deger,
            operator: result.operator,
            username: username,
            companyiddValue: companyiddValue,
          }
        );

        const outputPdfPath = response.data;
        console.log("dosya yolu react tarafi:", outputPdfPath);
        setPath(outputPdfPath);
        setDownloaded(true);

        fetch("http://localhost:5000/add_reports_knn_data_adminpage", {
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
        {result.answer}
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

PdfUserKNN.propTypes = {
  result: PropTypes.shape({
    answer: PropTypes.string,
    kernel: PropTypes.string,
    c: PropTypes.number,
    sutun1: PropTypes.number,
    sutun2: PropTypes.number,
    test_size: PropTypes.number,
    random_state: PropTypes.number,
    deger: PropTypes.number,
    operator: PropTypes.string,
  }),
  answerHeatmap: PropTypes.string,
  answerHeatmap2: PropTypes.string,
  answerHeatmap3: PropTypes.string,
  answerHeatmap4: PropTypes.string,
  answerHeatmap5: PropTypes.string,
  answerHeatmap6: PropTypes.string,
  answerHeatmap7: PropTypes.string,
  answerHeatmap8: PropTypes.string,
  companyiddValue: PropTypes.number,
};

export default PdfUserKNN;
