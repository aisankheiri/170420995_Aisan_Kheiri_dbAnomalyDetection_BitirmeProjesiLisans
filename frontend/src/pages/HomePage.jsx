import { Layout, theme } from "antd";
import CarouselSlider from "../components/CarouselSlider/CarouselSlider";
import Footerr from "../components/Footerr/Footerr";

import Headerr from "../components/Headerr/Headerr";
import DataPlatform from "../components/DataPlatform/DataPlatform";

const { Content } = Layout;

const AuthPageLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Headerr/>
      <Content
        style={{
          padding: "0 48px",
          margin: "40px",
        }}
      >
        <div
          style={{
            padding: 54,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <CarouselSlider />
        </div>
      </Content>
      <DataPlatform/>
      <Footerr />
    </Layout>
  );
};

export default AuthPageLayout;
