const user = JSON.parse(localStorage.getItem("user"));
const username = user ? user.username : null;

import { Button, Space, Card } from "antd";
import { Form, Input, notification } from "antd";
import { useEffect, useState } from "react";

const UserDetailPage = () => {
  const [userData, setUserData] = useState([]);
  const [userDelete, setUserDelete] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user_data_page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }),
        });
        const data = await response.json();
        setUserData(data);
        console.log(userDelete);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (record) => {
    // Update işlemi için gerekli kodları buraya ekleyebilirsiniz
    console.log("Update user:", record);
    window.location.href = "/auth-forgetpassword";
   
  };

  const handleDelete = () => {
    if (window.confirm("Hesabı silmeye emin misiniz?")) {
      deleteAccount();
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:5000/delete_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await response.text(); // JSON.parse yerine response.text() kullanarak veriyi metin olarak alabilirsiniz
      console.log("responseData:", data); // Sunucudan dönen veriyi kontrol etmek için
      setUserDelete(data);
      localStorage.removeItem("user");
      // Başarılı bildirimi göster
      if (response.status === 200) {
        notification.success({
          message: "Başarılı!",
          description: "Hesabınız başarıyla silindi.",
        });
        // Yönlendirme işlemini burada yap
        setTimeout(() => {
          window.location.replace("./");
        }, 2000); // 1 saniye bekletme örneği
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Daha sonra buttonInfo objesini kullanarak butonu render edebilirsiniz
  return (
    <div>
      {userData.map((user, index) => (
        <Card key={index} style={{ marginBottom: 20 }}>
          <Form layout="vertical">
            <Form.Item label="Kullanıcı İd Numarası">
              <Input value={user.UserID} readOnly />
            </Form.Item>
            <Form.Item label="Kullanıcı Adı">
              <Input value={user.UserName} readOnly />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={user.Email} readOnly />
            </Form.Item>
            <Form.Item label="Kullanıcı Rolu">
              <Input value={user.Role} readOnly />
            </Form.Item>
            <Form.Item label="Kullanıcı Hesap Oluşturma Tarihi">
              <Input value={user.CreateDate} readOnly />
            </Form.Item>
            {/* <Form.Item label="Şifre">
              <Input.Password
                value={user.Password}
                readOnly
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item> */}
            <Space>
              <Button type="primary" onClick={() => handleUpdate(user)}>
                Şifreyi değiştir
              </Button>
              <Button
                type="primary"
                danger
                ghost
                onClick={() => handleDelete(user)}
              >
                Hesabı Sil
              </Button>
            </Space>
          </Form>
        </Card>
      ))}
    </div>
  );
};

export default UserDetailPage;
