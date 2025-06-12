import { useState } from "react";
import { Button, message, Steps } from "antd";
import UploadButton from "../UploadButton/UploadButton";
import LastStep from "../LastStep/LastStep";
import { Link } from "react-router-dom";
import MetricsTable from "../Web/MetricsTable";

const steps = [
  {
    title: "Birinci Adım",
    content: () => <MetricsTable />, // Burada bileşen çağrısı yapılıyor
  },
  {
    title: "İkinci Adım",
    content: () => <UploadButton />, // İkinci bileşen çağrısı
  },
  {
    title: "Son Adım",
    content: () => <LastStep />, // Son bileşen çağrısı
  },
];

const MachineStepsPage = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
    <div style={{backgroundColor:"#b0e2ff",textAlign:"center" ,marginBottom:"1rem"}}>
      Makine Öğrenme Algoritmaları
    </div>
      <Steps current={current} items={items} />
      <div>{steps[current].content()}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Sonraki Adım
          </Button>
        )}
        {current === steps.length - 1 && (
          <Link to="/">
            <Button
              type="primary"
              onClick={() =>
                message.success("Ana sayfaya tekrardan hoş geldiniz!")
              }
            >
              Tamamla
            </Button>
          </Link>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={prev}>
            Önceki Adım
          </Button>
        )}
      </div>
    </>
  );
};

export default MachineStepsPage;
