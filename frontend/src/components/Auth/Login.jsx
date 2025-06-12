
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

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

const Login = () => {
  const [form] = Form.useForm();
  // const navigate = useNavigate();
  

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('user', JSON.stringify(data));
        message.success('Giriş başarılı.');

        

        if (data.role === 'user') {
          // setTimeout(() => {
          //   navigate(`/modelPage?username=${data.username}`);
          // }, 1000);
          setTimeout(() => {
            window.location.href = "/modelPage";
          }, 2000);
        } else {
          setTimeout(() => {
            window.location.href = "/admin";
          }, 2000);
          // setTimeout(() => {
          //   navigate('/admin');
          // }, 1000);
        }
      } else if (response.status === 401) {
        message.error('Geçersiz e-posta veya şifre.');
      } else {
        message.error('Giriş başarısız.');
      }
    } catch (error) {
      console.log('Sunucu hatası:', error);
      message.error('Geçersiz e-posta veya şifre.');
    }
  };

  return (
    <div className="account-column">
      <h2>Giriş</h2>
      <Form form={form} onFinish={handleLogin} {...formItemLayout}>
      <span style={{marginBottom:"-0.5rem"}}>Eposta adresi <span style={{ color: 'red' }}>*</span></span>
        <Form.Item
      
          name="email"
          rules={[{ required: true, message: 'Eposta adresi zorunlu alan!' }]}
        >
          <Input type="text" />
        </Form.Item>

        <span style={{marginBottom:"-0.5rem",marginTop:"-1.5rem"}}>Şifre <span style={{ color: 'red' }}>*</span></span>
        <Form.Item
        
          name="password"
          rules={[{ required: true, message: 'Şifre zorunlu alan!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{marginBottom:"-0.5rem", marginTop:"-1.5rem"}}>
          <Link to="/auth-forgetpassword" className="form-link">
            Şifremi unuttum
          </Link>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Giriş
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;