import { useState } from "react";
import { Radio, Tooltip } from "antd";

import LSTMForm from "../Forms/LSTMForm";
import RNNForm from "../Forms/RNNForm";
import MixFormDeep from "../Forms/MixFormDeep";


const RadioButtonDeep = () => {
  const [algorithm, setAlgorithm] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState([]);

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setSelectedMetrics([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Seçilen algoritma ve metrikleri işleyebilirsiniz
    console.log("Algorithm:", algorithm);
    console.log("Selected Metrics:", selectedMetrics);

    // İşlemler tamamlandıktan sonra state'i sıfırlayabilirsiniz
    setAlgorithm("");
    setSelectedMetrics([]);
  };

  const renderMetrics = () => {
    if (algorithm === "LSTM") {
      return (
        <div>
          <LSTMForm />
        </div>
      );
    } else if (algorithm === "RNN") {
      return (
        <div>
           <RNNForm/>
        </div>
      );
      
    } 
    else if (algorithm === "MIXdeep") {
      return (
        <div>
          <MixFormDeep />
        </div>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        <Radio.Group
          name="algorithm"
          value={algorithm}
          onChange={handleAlgorithmChange}
        >
          <Radio style={{ marginRight: "1rem" }} value="LSTM">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                  Uzun Kısa Süreli Bellek (LSTM), sıralı verilerdeki uzun vadeli bağımlılıkları modelleyebilme yeteneğiyle öne çıkan bir reküran sinir ağı mimarisidir. LSTM, zaman serileri ve doğal dil işleme gibi alanlarda kullanılır. Hafıza hücreleri ve giriş-çıkış kapıları sayesinde bilgiyi koruyabilir, unutabilir veya ekleyebilir, bu da uzun vadeli bağımlılıkları daha etkili bir şekilde ele almasını sağlar. Metin tahmini, dil modelleri, zaman serileri analizi, konuşma tanıma gibi alanlarda sıklıkla tercih edilir.

                  </div>
                }
              >
                        LSTM Algoritması
              </Tooltip>
              
            </span>
          
          </Radio>
          <Radio style={{ marginRight: "1rem" }} value="RNN">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                  Reküran Sinir Ağı (RNN) Algoritmaları, zaman bağımlılıklarını modelleme yetenekleri ve geniş uygulama alanları nedeniyle tercih edilir. Metin analizi, zaman serileri, konuşma tanıma gibi alanlarda etkilidir. Hafıza mekanizmalarıyla geçmiş bilgileri kullanarak geleceği tahmin etme kabiliyetine sahiptirler ve genellikle kolayca eğitilebilirler. Bu nedenlerle, RNN ler sıralı veri problemlerinde yaygın olarak kullanılır.


                  </div>
                }
              >
                         RNN Algoritması
              </Tooltip>
              
            </span>
          
          
          </Radio>

          <Radio style={{ marginRight: "1rem" }} value="MIXdeep">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                  Bu seçenekde 2 algoritmayı bir yerde kullanarak performans olarak karşılaştırabilirsiniz.

                  </div>
                }
              >
                      Karşılaştırmalı Algoritma
              </Tooltip>
              
            </span>
        
          </Radio>
          
        </Radio.Group>
      </div>
      {renderMetrics()}
    </form>
  );
};

export default RadioButtonDeep;
