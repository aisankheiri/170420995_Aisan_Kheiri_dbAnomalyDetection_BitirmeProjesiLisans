import { Button, Card, Flex } from "antd";
import "./GetStarted.css";
import { Link } from "react-router-dom";

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
const GetStarted = () => (
  <Card hoverable style={cardStyle}>
    <Flex justify="center" wrap="true">
      <img
        alt="avatar"
        src={
          "https://cdn.pixabay.com/photo/2022/06/19/04/32/machine-learning-7271039_1280.png"
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
          Aklınızda veriler kaybolursa ne yapacağınızı düşündünüz mü? Sunucunuza
          erken müdahale ederek önlem almak ister misiniz?
        </h3>

        <Link to="/auth">
          <Button type="primary" block>Üyeliğini Oluştur</Button>
        </Link>
      </Flex>
    </Flex>
  </Card>
);

export default GetStarted;
