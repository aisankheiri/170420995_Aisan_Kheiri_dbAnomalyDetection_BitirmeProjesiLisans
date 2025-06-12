import { Button, Result } from "antd";

const Success = () => {
  const handleRedirect = () => {
    window.location.href = "/auth";
  };

  return (
    <>
      <Result
        status="success"
        title="Şifreniz başarıyla değişti!"
        subTitle="Yeni şifreniz ile tekrar giriş sağlayabilirsiniz!"
        extra={[
          <Button type="primary" key="console" onClick={handleRedirect}>
            Giriş sayfasına dön
          </Button>,
        ]}
      />
    </>
  );
};

export default Success;
