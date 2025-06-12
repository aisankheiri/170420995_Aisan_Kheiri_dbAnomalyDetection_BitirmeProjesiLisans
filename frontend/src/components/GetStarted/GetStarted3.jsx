// import { Button, Card, Flex, Typography } from "antd";

// const GetStarted3 = () => (
//   <Flex
//     justify="center"
//     style={{
//       padding: "32px 0",
//     }}
//   >
//     <Card
//       hoverable
//       style={{
//         width: "100%",
//         maxWidth: 620,
//       }}
//       bodyStyle={{
//         padding: 0,
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: ["column", "column", "row"],
//       }}
//     >
//       <Flex
//         justify="space-between"
//         style={{
//           flexDirection: ["column", "column", "row"],
//           alignItems: ["center", "center", "flex-start"],
//         }}
//       >
//         <img
//           alt="avatar"
//           src="https://i0.wp.com/dataplatform.com.tr/wp-content/uploads/2022/03/7.png?fit=1000%2C893&ssl=1"
//           //   src="/img/getStarted/GetStarted2.png"
//           style={{
//             display: "block",
//             width: 300,
//             height: 300,
//             objectFit: "cover",
//           }}
//         />
//         <Flex
//           vertical
//           align="flex-end"
//           justify="space-between"
//           style={{
//             textAlign:"justify",
//             padding: 32,
//           }}
//         >
//           <Typography.Title level={4}>
//             32 yılı aşkın tecrübemiz ile 200’den fazla müşterimize hizmet verdik
//             ve binlerce veri tabanına özenle dokunduk.
//           </Typography.Title>
//           <a
//             href="https://dataplatform.com.tr/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Button type="primary">İletişim</Button>
//           </a>
//         </Flex>
//       </Flex>
//     </Card>
//   </Flex>
// );

// export default GetStarted3;



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
const GetStarted3 = () => (
  <Card hoverable style={cardStyle}>
    <Flex justify="center" wrap="true">
      <img
        alt="avatar"
        src={"https://i0.wp.com/dataplatform.com.tr/wp-content/uploads/2022/03/7.png?fit=1000%2C893&ssl=1"}
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
        32 yılı aşkın tecrübemiz ile 200’den fazla müşterimize hizmet verdik ve binlerce veri tabanına özenle dokunduk.
        </h3>
        <Button type="primary" href="https://dataplatform.com.tr/" target="_blank" >
        İletişime geç
        </Button>
      </Flex>
    </Flex>
  </Card>
);

export default GetStarted3;

