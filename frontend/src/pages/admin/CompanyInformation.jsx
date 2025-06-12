import { useEffect, useState } from 'react';
import { Table } from 'antd';


const CompanyInformation = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/company_data_adminpage', {
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
            title: 'Şirket İd Numarası',
            dataIndex: 'CompanyId',
            key: 'CompanyId',
        },
        {
            title: 'Şirket Adı',
            dataIndex: 'CompanyName',
            key: 'CompanyName',
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

export default CompanyInformation;