
import { Form, Input, Button, message } from "antd";


const Register = () => {
  const [form] = Form.useForm();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleRegister = async (values) => {
    if (!validatePassword(values.password)) {
      message.error("Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir özel karakter ve bir rakam içermelidir.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Kayıt başarılı.");
        setTimeout(() => {
          window.location.href = "/modelPage";
        }, 2000);
      } else if (response.status === 400) {
        const errorData = await response.json();
        message.error(errorData.error);
      } else {
        message.error("Kayıt başarısız.");
      }
    } catch (error) {
      console.log("Kayıt hatası:", error);
    }
  };

  return (
    <div className="account-column">
      <h2>Kayıt ol</h2>
      <Form form={form} onFinish={handleRegister}>
        <span style={{ marginBottom: "-0.5rem"}}>
          Kullanıcı adı <span style={{ color: "red" }}>*</span>
        </span>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Kullanıcı adı zorunlu alan!" }]}
        >
          <Input type="text" />
        </Form.Item>
        <span style={{ marginBottom: "-0.5rem", marginTop: "-1.5rem" }}>
          Eposta adresi <span style={{ color: "red" }}>*</span>
        </span>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Eposta adresi zorunlu alan!" },
            {
              type: "email",
              message: "Geçerli bir e-posta adresi girin.",
            },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <span style={{ marginBottom: "-0.5rem", marginTop: "-1.5rem" }}>
          Şifre <span style={{ color: "red" }}>*</span>
        </span>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Şifre zorunlu alan!" },
            {
              validator: (_, value) => {
                if (value && !validatePassword(value)) {
                  return Promise.reject(
                    "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir özel karakter ve bir rakam içermelidir."
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <p style={{marginTop:"-2rem" ,textAlign:"justify"}}>
            Kişisel verileriniz bu web sitesindeki deneyiminizi desteklemek,
            hesabınıza erişimi yönetmek ve gizlilik politikamızda açıklanan
            diğer amaçlar için kullanılacaktır.
          </p>
        </Form.Item>

        <Form.Item style={{marginTop:"-2.2rem"}}>
          <Button  type="primary" htmlType="submit">
            Kayıt ol
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;