
import { Layout, theme } from "antd";

import Auth from "../../components/Auth/Auth";
import Footerr from "../../components/Footerr/Footerr";
import Headerr from "../../components/Headerr/Headerr";

const { Content } = Layout;

const AuthPageLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Headerr />
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
          <Auth />
        </div>
      </Content>
      <Footerr />
    </Layout>
  );
};

export default AuthPageLayout;
