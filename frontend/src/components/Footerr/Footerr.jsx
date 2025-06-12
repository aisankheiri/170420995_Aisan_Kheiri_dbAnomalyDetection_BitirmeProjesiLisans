import Tags from "../Tags/Tags";
import { Layout } from "antd";
import Footer2 from "./Footer2";
import Map from "../Web/Map";

const { Footer } = Layout;

const Footerr = () => {
  return (
    <div>
      <Map />
      <Footer2 />
      <Footer
        style={{
          textAlign: "center",
          marginTop: "-2rem",
          backgroundColor: "#001529",
          color: "white",
        }}
      >
        Data Platform Bilgi Sistemleri A.Ş. ©{new Date().getFullYear()}
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <Tags />
        </div>
      </Footer>
    </div>
  );
};

export default Footerr;
