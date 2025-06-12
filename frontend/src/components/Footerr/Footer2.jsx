import { Layout } from "antd";
import { Link } from "react-router-dom";
import "./Footer2.css";

const { Footer } = Layout;

const Footer2 = () => {
  const handleLinkClick = (url) => {
    window.location.href = url;
  };

  return (
    <Footer style={{ backgroundColor: "#001529", color: "white" }}>
      <div className="row">
        <div className="column">
          <Link to={"/"}>
            <img
              src="/img/navbar/dp_logo.png"
              alt="Data Platform Logo"
              style={{ width: "110px", height: "auto" }}
            />
          </Link>

          <div className="row" style={{ marginTop: "1rem" }}>
            Data Platform Bilgi Sistemleri, 32 yılı aşkın veri tabanı, yazılım,
            sistem tecrübesine sahip profesyonel kadrosu ve bilgi birikimi ile
            Türkiye’de veri tabanı eğitimi ve danışmanlık alanında
            faaliyetlerini bütünleşik olarak sunan sektörün önde gelen
            firmalarındandır.
          </div>
        </div>
        <div className="column" style={{ marginLeft: "6rem" }}>
          <h3>Hızlı Erişim</h3>
          <ul>
            <li
              key="key1"
              style={{ cursor: "pointer", marginTop: "2rem" }}
              onClick={() =>
                handleLinkClick("https://dataplatform.com.tr/is-ortaklarimiz/")
              }
            >
              İş Ortaklarımız
            </li>
            <li
             key="key2"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick("https://dataplatform.com.tr/referanslar/")
              }
            >
              Referanslarımız
            </li>
            <li
             key="key3"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick("https://dataplatform.com.tr/blog/")
              }
            >
              Blog
            </li>
            <li
             key="key4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick("https://dataplatform.com.tr/iletisim/")
              }
            >
              İletişim
            </li>
          </ul>
        </div>
        <div className="column">
          <h3>Hizmetlerimiz</h3>
          <ul>
            <li

             key="key5"
              style={{ cursor: "pointer", marginTop: "2rem" }}
              onClick={() =>
                handleLinkClick(
                  "https://dataplatform.com.tr/sql-server-danismanligi/"
                )
              }
            >
              SQL Server Danışmanlığı
            </li>
            <li
             key="key6"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick(
                  "https://dataplatform.com.tr/sql-server-saglik-taramasi/"
                )
              }
            >
              SQL Server Sağlık Taraması
            </li>
            <li
             key="key7"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick(
                  "https://dataplatform.com.tr/veri-ambari-danismanligi/"
                )
              }
            >
              Veri Ambarı Danışmanlığı
            </li>
            <li
             key="key8"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleLinkClick(
                  "https://dataplatform.com.tr/veri-analizi-ve-modelleme/"
                )
              }
            >
              Veri Analizi ve Modelleme
            </li>
          </ul>
        </div>
        <div className="column">
          <h3>İletişim</h3>
          <p style={{ marginTop: "2rem" }}>
            Hizmetlerimiz hakkında daha detaylı bilgi almak için aşağıdaki
            iletişim kanallarını kullanabilirsiniz.
          </p>
        </div>
      </div>
    </Footer>
  );
};

export default Footer2;
