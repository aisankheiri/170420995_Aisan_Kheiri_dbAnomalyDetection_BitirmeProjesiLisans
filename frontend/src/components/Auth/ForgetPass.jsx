import { Button, Form, Input, notification } from "antd";
import { useState, useEffect } from "react";
import Success from "../Web/Success";

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

const ForgetPass = () => {
  const [form] = Form.useForm();
  const [codeEntered, setCodeEntered] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(59);
  const [success,setSuccess ] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    let timer = null;

    if (codeEntered) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000); // Her 1 saniyede bir geriye doğru sayımı güncelle
    }

    return () => clearInterval(timer);
  }, [codeEntered]);

  const onFinish = async (values) => {
    try {
      const values = await form.validateFields();
      // Form verilerini aldık, şimdi e-posta adresini kontrol etme adımına geçebiliriz

      // E-posta adresini values.email'den alabilirsiniz
      const email = values.email;
      const password = values.password;

      const response1 = await fetch(
        `http://localhost:5000/check_password_not_same`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (response1.ok) {
        console.log("şifre önceki ile aynı değil");
        
        const response2 = await fetch(`http://localhost:5000/check_email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        });

        if (response2.ok) {
          console.log("Kullanıcı veri tabanında kayıtlı");
          notification.success({
            message: "Başarılı",
            description:
              "Kaydınız bulunmuştur, eposta adresinize gelen doğrulama kodunu giriniz.",
          });
          handlesendcodetomail();
        } else {
          notification.error({
            message: "Hata",
            description:
              "Girdiğiniz mail adresi ile kayıtlı kullanıcı bulunamadı!",
          });
          console.log("E-posta adresi veritabanında bulunamadı");
        }

      } else {
        notification.error({
          message: "Hata",
          description: "Yeni şifre bir önceki ile aynı olmamalıdır!",
        });
        console.log("Yeni şifre bir önceki ile aynı olmamalıdır");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }

    console.log("Received values of form: ", values);
    console.log("Received values of form: ", values.password);
    setNewPassword(values.password);
    console.log("Received values of form: ", values.email);
    setEmail(values.email);
  };

  const handleCodeVerification = async (e) => {
    if (e.target.value.length === 6) {
      if (code === e.target.value) {
        try {
          const response = await fetch(
            "http://localhost:5000/update_password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                new_password: newPassword,
              }),
            }
          );

          if (response.ok) {
            console.log("Şifre başarıyla değiştirildi.");
            notification.success({
              message: "Başarılı",
              description:
                "Şifreniz başarıyla değiştirildi!\nYeni şifreniz ile tekrar giriş yapabilirsiniz!",
            });
            setSuccess(true)
          } else {
            console.error("Sunucu hatası:", response.status);
            // Hata durumunu bildirme veya işleme devam etme
          }
        } catch (error) {
          console.error("Hata oluştu:", error);
          // Hata durumunu bildirme veya işleme devam etme
        }
      } else {
        if (code.length === 6) {
          notification.error({
            message: "Hata",
            description: "Doğrulama kodu yanlış!",
          });
          // Handle verification code validation
        }
      }
    }
  };
  useEffect(() => {
    if (countdown === 0) {
      setCodeEntered(false);
      setCountdown(59);
    }
  }, [countdown]);

  const handlesendcodetomail = () => {
    form.validateFields().then((values) => {
      fetch("http://localhost:5000/send_verification_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Yanıtı JSON olarak al
          } else {
            throw new Error("Failed to send verification code.");
          }
        })
        .then((data) => {
          console.log(data); // Sunucu yanıtı
          setCodeEntered(true);
          setCode(data.verification_code);
        })
        .catch((error) => {
          console.error("Hata:", error);
        });
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        style={{
          maxWidth: 1000,
          width: "90%",
          padding: 50,
          margin: 10,
          border: "1px solid blue",
          borderRadius: 15,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        scrollToFirstError
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/img/navbar/forgetpassword.png"
            alt="forget password Logo"
            style={{ width: "110px", height: "auto", marginRight: "1rem" }}
          />
          <h2
            style={{
              color: "#00688b",
              marginBottom: "1rem",
              marginRight: "2rem",
            }}
          >
            Şifre Sıfırlama
          </h2>
        </div>
        <Form.Item
          name="email"
          label="Eposta Adresi"
          rules={[
            {
              type: "email",
              message: "The input is not a valid E-mail!",
            },
            {
              required: true,
              message: "Lütfen eposta adresinizi giriniz!",
            },
          ]}
        >
          <Input placeholder="Eposta adresinizi giriniz." />
        </Form.Item>

        <Form.Item
          name="password"
          label="Yeni Şifre"
          rules={[
            {
              required: true,
              message: "Lütfen yeni şifrenizi giriniz!",
            },
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
          hasFeedback
        >
          <Input.Password placeholder="Yeni şifrenizi giriniz." />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Yeni Şifre Tekrarı"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Lütfen yeni şifrenizi tekrar ediniz!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Şifreler eşleşmedi!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Yeni şifrenizi tekrar giriniz." />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Doğrulama Kodunu Al
          </Button>
        </Form.Item>

        {codeEntered && (
          <Form.Item>
            <Input
              maxLength={6}
              placeholder="Doğrulama Kodu"
              onChange={handleCodeVerification}
            />
            <h5 style={{ color: "red", marginTop: "1rem" }}>
              Kalan süre: {countdown} saniye
            </h5>
          </Form.Item>
        )}

        {success && (
          <Success/>
        )}
      </Form>
    </div>
  );
};

export default ForgetPass;
