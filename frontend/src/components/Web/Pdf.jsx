import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, message,notification } from 'antd';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem("user"));
const username = user ? user.username : null;

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role : null;
};
const userRole = getUserRole();
console.log(userRole);
console.log(username);

const Pdf = ({
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
}) => {
  const [reportUrl, setReportUrl] = useState('');
  const openNotification = (message, description) => {
    notification.open({
      message: message,
      description: description,
      style: {
        backgroundColor: "lightgreen", // Arka plan rengi olarak yeşil tonu
      },
    });
  };

   

      const handleGenerateReport = () => {
        openNotification("PDF olusuyor", "");
        const user = JSON.parse(localStorage.getItem("user"));
          const username = user ? user.username : null;
        
        axios.post('http://localhost:5000/generate_pdf_svm', {
          answer: result.answer,
          answer1: answerHeatmap,
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
        })
        .then(response => {
          if (response.status === 200) {
            openNotification("PDF oluşturuldu", "Raporu indirebilirsiniz.");
            setReportUrl(response.data);
            console.log("Dosya yolu react tarafi1:", response.data);
            console.log("Dosya yolu react tarafi2:", response);
          } else {
            console.error('HTTP Hata:', response.status);
            message.error('Rapor oluşturulurken bir hata oluştu.');
          }
        })
        .catch(error => {
          console.error('Rapor oluşturma hatası:', error);
          message.error('Rapor oluşturulurken bir hata oluştu.');
        });
      };

    const handleDownloadReport = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/download_kriter_sql",
            {
              method: "POST",
            }
          );
    
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "kriter.sql");
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
      <Button type="primary" onClick={handleGenerateReport}>
        Rapor Oluştur
      </Button>
      {reportUrl && (
        <Button type="primary" onClick={handleDownloadReport}>
          Raporu İndir
        </Button>
      )}
    </div>
  );
};

Pdf.propTypes = {
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
  username: PropTypes.string,
};

export default Pdf;