import { useEffect, useState } from 'react';
import { Table } from 'antd';


const AdminInformation = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/admins_data_adminpage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error:', error));
    }, []);

    const columns = [
        {
            title: 'Admin İd Numarası',
            dataIndex: 'UserID',
            key: 'UserID',
        },
        {
            title: 'Kullanıcı Adı',
            dataIndex: 'UserName',
            key: 'UserName',
        },
        {
            title: 'Eposta Adresi',
            dataIndex: 'Email',
            key: 'Email',
        },
        {
            title: 'Rol',
            dataIndex: 'Role',
            key: 'Role',
        },
        {
            title: 'Hesap Oluşturma Tarihi',
            dataIndex: 'CreateDate',
            key: 'CreateDate',
        },
        {
            title: 'Şifre',
            dataIndex: 'Password',
            key: 'Password',
        },
    ];

    return (
        <Table dataSource={userData.map((data, index) => ({ ...data, key: index }))} columns={columns} 
        pagination={{
            position: ["bottomRight"],
          }}
          size="small"
          style={{ width: "100%" }}
          scroll={{ x: "max-content" }}
        
        />

     
    );
};

export default AdminInformation;