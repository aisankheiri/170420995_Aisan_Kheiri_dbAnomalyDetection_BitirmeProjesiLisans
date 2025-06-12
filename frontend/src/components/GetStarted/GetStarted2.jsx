import { Button, Card, Flex } from "antd";
import "./GetStarted.css";

const cardStyle = {
  width: "90%",
  maxWidth: 620,
  margin: "0 auto",
  height: "90%",
  backgroundColor: "#f5f4f4",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // Resim içeriği sığacak şekilde ayarlanır
  maxWidth: "300px", // Resmin maksimum genişliği
};
const GetStarted2 = () => (
  <Card hoverable style={cardStyle}>
    <Flex justify="center" wrap="true">
      <img
        alt="avatar"
        src={
          "https://i0.wp.com/dataplatform.com.tr/wp-content/uploads/2022/03/Artboard-84.png?fit=388%2C333&ssl=1"
        }
        style={imgStyle}
        className="small-screen-img"
      />
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ paddingLeft: 16, textAlign: "center" }}
      >
        <h3 style={{ marginBottom: 16, textAlign: "justify" }}>
          Siz sadece işinize odaklanın. Veritabanlarıyla ilgili tüm yönetimi biz
          üstleniyoruz.
        </h3>

        <Button
          type="primary"
          href="https://dataplatform.com.tr/"
          target="_blank"
          
        >
          İletişime geç
        </Button>
      </Flex>
    </Flex>
  </Card>
);

export default GetStarted2;
