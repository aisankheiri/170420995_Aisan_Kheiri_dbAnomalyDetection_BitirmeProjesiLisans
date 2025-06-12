import { useState } from "react";
import { Radio, Tooltip } from "antd";
import GradientBoostingForm from "../Forms/GradientBoostingForm";
import SVMForm from "../Forms/SVMForm";
import RandomForestForm from "../Forms/RandomForestForm";
import KNNForm from "../Forms/KNNForm";
import MixForm from "../Forms/MixForm";

const RadioButton = () => {
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
    if (algorithm === "SVM") {
      return (
        <div>
          <SVMForm />
        </div>
      );
    } else if (algorithm === "RandomForest") {
      return (
        <div>
          <RandomForestForm />
        </div>
      );
    } else if (algorithm === "KNN") {
      return (
        <div>
          <KNNForm />
        </div>
      );
    } else if (algorithm === "GBM") {
      return (
        <div>
          <GradientBoostingForm />
        </div>
      );
    } else if (algorithm === "MIX") {
      return (
        <div>
          <MixForm />
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
          <Radio style={{ marginRight: "1rem" }} value="SVM">
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Support Vector Machine, verileri sınıflandırmak veya regresyon problemlerini çözmek için etkili bir şekilde kullanılabilir. SVM, yüksek boyutlu veri kümeleri üzerinde iyi performans gösterir ve doğrusal olmayan verileri sınıflandırmak için kernel trick gibi teknikler kullanabilir. Ayrıca, SVM aşırı uç değerlere karşı dirençlidir ve genellikle iyi genelleme performansı sergiler. Optimum hiper düzlemi bulma prensibiyle çalışan SVM, veriler arasındaki en iyi ayrımı sağlamak için destek vektörlerini kullanır. Bu özellikleri sayesinde SVM, sınıflandırma ve regresyon problemlerinde başarılı sonuçlar elde etmek için tercih edilen bir algoritma haline gelmiştir.
                  </div>
                }
              >
                SVM Algoritması
              </Tooltip>
              
            </span>
          </Radio>
          <Radio style={{ marginRight: "1rem" }} value="RandomForest">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                   Random Forest, karmaşık veri setlerinde yüksek performans gösterir ve genellikle overfittinge karşı dirençlidir. Aynı zamanda, çok sayıda girdi değişkeniyle çalışırken de etkili sonuçlar verir. Algoritma, her bir ağacı farklı bir alt küme veriyle eğittiği için varyansı azaltır ve genel olarak iyi genelleme yapabilir. Ayrıca, Random Forest, özelliklerin önem sıralamasını elde etmek için kullanışlı olabilir ve aşırı uç değerlere karşı dirençli olma özelliğiyle de dikkat çeker. Bu özellikleriyle, Random Forest genellikle sınıflandırma ve regresyon problemlerinde tercih edilen bir algoritma haline gelmiştir.
                  </div>
                }
              >
                  Random Forest Algoritması
              </Tooltip>
              
            </span>
          
          </Radio>
          <Radio style={{ marginRight: "1rem" }} value="KNN">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                  K-En Yakın Komşu (KNN) Algoritması, basit ve anlaşılır yapısıyla popülerdir. Veri noktalarını benzerliklerine göre gruplandırarak çalışır. Özellikle küçük veri setlerinde doğrusal olmayan ilişkilere sahip problemlerde etkili olabilir. Yeni veri noktalarını sınıflandırmak için eğitim verilerine tekrar bakma gereksinimi duymadan hızlı bir şekilde uygulanabilir. Ancak, büyük veri setlerinde hesaplama maliyeti artabilir ve dengesiz veri setlerinde yanlı sonuçlar verebilir. Bu nedenlerle, KNN genellikle basit sınıflandırma ve regresyon analizlerinde tercih edilir.

                  </div>
                }
              >
                      KNN Algoritması
              </Tooltip>
              
            </span>
        
          </Radio>
          <Radio style={{ marginRight: "1rem" }} value="MIX">
          <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                  Bu seçenekde 3 algoritmayı bir yerde kullanarak performans olarak karşılaştırabilirsiniz.

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

export default RadioButton;
