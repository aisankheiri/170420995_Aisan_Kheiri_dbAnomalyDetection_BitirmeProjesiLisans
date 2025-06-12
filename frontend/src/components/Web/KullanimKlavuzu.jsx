import { Button } from 'antd';

const handleDownloadKlavuz = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/download_kullanim_klavuzu_web",
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

const KullanimKlavuzu = () => {
  return (
    <div style={{ textAlign: 'center' }}>
    <Button type="primary" onClick={handleDownloadKlavuz} style={{ display: 'inline-block' }} block>Web Sayfası Kullanım Klavuzu Dosyasını İndir</Button>

  </div>
  );
};

export default KullanimKlavuzu;
