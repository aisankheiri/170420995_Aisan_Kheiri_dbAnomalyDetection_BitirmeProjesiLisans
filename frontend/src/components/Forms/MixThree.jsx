import {
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Tooltip,
  Spin,
  Slider,
  Progress,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";

import CompanySelectButton from "./CompanySelectButton";
import CompareThreeAlgoeithm from "../Web/CompareThreeAlgoeithm";

const { Option } = Select;

const metricOptions = [
  {
    label: "Euclidean",
    value: "euclidean",
  },
  {
    label: "Minkowski",
    value: "minkowski",
  },
  {
    label: "Manhattan",
    value: "manhattan",
  },
];

const weightOptions = [
  {
    label: "Uniform",
    value: "uniform",
  },
  {
    label: "Distance",
    value: "distance",
  },
];

const sutun1options = [
  "0) InstanceID",
  "1) CreateDate",
  "2) page life expectancy",
  "3) % privileged time",
  "4) transactions/sec",
  "5) write transactions/sec",
  "6) logical connections",
  "7) dbaHCDOC",
  "8) VobVadesiDolmuslariSil",
  "9) dbaShrinkLog",
  "10) dbaHCDOCexportTxt",
  "11) dbaCheckPrimaryNode",
  "12) WMI Response - DATABASE Log File Growth Event",
  "13) dbaTurkiyeFinansEventLogDelete",
  "14) dbaBackupLog",
  "15) FON_VALUE_EXPORT",
  "16) dbaSessionKiller",
  "17) dbafullbackup",
  "18) tblTic_Sil",
  "19) OTS_Instrument_OHLC_History",
  "20) ASPState_Job_DeleteExpiredSessions",
  "21) dbaMaintenanceReIndex",
  "22) tblWebtopLogs_Sil",
  "23) TurkiyeFinans Maintenance",
  "24) dbaHCDOCcontrol",
  "25) dbaHCDOCHadrControl",
  "26) syspolicy_purge_history",
  "27) dbaCheckListenerStatus",
  "28) SP_TblTicGunlukInsertData",
  "29) tblTicTarihsel",
  "30) dbaFullAylıkBackup",
  "31) WMI Response - DATABASE Data File Growth Event",
  "32) dbaFibabankEventLogDelete",
  "33) dbaFibadataShrink",
  "34) Set Mapping Job",
  "35) dbaCheckDBSync",
  "36) page_life_category",
];

const sutun1 = sutun1options.map((label, index) => ({
  label: label,
  value: index.toString(),
  key: index, // Benzersiz bir key propu ekleyin
}));

const sutun2options = [
  "0) InstanceID",
  "1) CreateDate",
  "2) page life expectancy",
  "3) % privileged time",
  "4) transactions/sec",
  "5) write transactions/sec",
  "6) logical connections",
  "7) dbaHCDOC",
  "8) VobVadesiDolmuslariSil",
  "9) dbaShrinkLog",
  "10) dbaHCDOCexportTxt",
  "11) dbaCheckPrimaryNode",
  "12) WMI Response - DATABASE Log File Growth Event",
  "13) dbaTurkiyeFinansEventLogDelete",
  "14) dbaBackupLog",
  "15) FON_VALUE_EXPORT",
  "16) dbaSessionKiller",
  "17) dbafullbackup",
  "18) tblTic_Sil",
  "19) OTS_Instrument_OHLC_History",
  "20) ASPState_Job_DeleteExpiredSessions",
  "21) dbaMaintenanceReIndex",
  "22) tblWebtopLogs_Sil",
  "23) TurkiyeFinans Maintenance",
  "24) dbaHCDOCcontrol",
  "25) dbaHCDOCHadrControl",
  "26) syspolicy_purge_history",
  "27) dbaCheckListenerStatus",
  "28) SP_TblTicGunlukInsertData",
  "29) tblTicTarihsel",
  "30) dbaFullAylıkBackup",
  "31) WMI Response - DATABASE Data File Growth Event",
  "32) dbaFibabankEventLogDelete",
  "33) dbaFibadataShrink",
  "34) Set Mapping Job",
  "35) dbaCheckDBSync",
  "36) page_life_category",
];

const sutun2 = sutun2options.map((label, index) => ({
  label: label,
  value: index.toString(),
  key: index, // Benzersiz bir key propu ekleyin
}));

const data = [
  "InstanceID",
  "CreateDate",
  "page life expectancy",
  "% privileged time",
  "transactions/sec",
  "write transactions/sec",
  "logical connections",
  "dbaHCDOC",
  "VobVadesiDolmuslariSil",
  "dbaShrinkLog",
  "dbaHCDOCexportTxt",
  "dbaCheckPrimaryNode",
  "WMI Response - DATABASE Log File Growth Event",
  "dbaTurkiyeFinansEventLogDelete",
  "dbaBackupLog",
  "FON_VALUE_EXPORT",
  "dbaSessionKiller",
  "dbafullbackup",
  "tblTic_Sil",
  "OTS_Instrument_OHLC_History",
  "ASPState_Job_DeleteExpiredSessions",
  "dbaMaintenanceReIndex",
  "tblWebtopLogs_Sil",
  "TurkiyeFinans Maintenance",
  "dbaHCDOCcontrol",
  "dbaHCDOCHadrControl",
  "syspolicy_purge_history",
  "dbaCheckListenerStatus",
  "SP_TblTicGunlukInsertData",
  "tblTicTarihsel",
  "dbaFullAylıkBackup",
  "WMI Response - DATABASE Data File Growth Event",
  "dbaFibabankEventLogDelete",
  "dbaFibadataShrink",
  "Set Mapping Job",
  "dbaCheckDBSync",
  "page_life_category",
];
const marks = {};
data.forEach((item, index) => {
  marks[index] = {
    style: {
      writingMode: "vertical-lr",
      textAlign: "justify",
      fontSize: "9px",
    },
    label: item,
  };
});

function MixThree({ result1, result2 }) {
  const [form] = Form.useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [companyiddValue, setCompanyidValue] = useState(null);
  const [finnish, setFinnish] = useState(false);
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProgressIcon, setShowProgressIcon] = useState(false);

  const handleCompanySelect = (selectedValue) => {
    // Seçilen değeri aldığınızda burada istediğiniz işlemleri yapabilirsiniz
    console.log("Selected value in SVMForm:", selectedValue);
    setCompanyidValue(selectedValue);
  };
  const handleDefaultButtonClick = () => {
    const {
      n_neighbors,
      metric,
      weights,
      test_size,
      random_state,
      sutun1,
      sutun2,
      deger,
      operator,
    } = form.getFieldsValue([
      "n_neighbors",
      "metric",
      "weights",
      "test_size",
      "random_state",
      "sutun1",
      "sutun2",
      "deger",
      "operator",
    ]);

    if (!n_neighbors) {
      form.setFieldsValue({
        n_neighbors: 5, // Varsayılan n_neighbors değeri 5 olarak atanır
      });
    }

    if (!metric) {
      form.setFieldsValue({
        metric: "euclidean", // Varsayılan metric değeri 'euclidean' olarak atanır
      });
    }

    if (!weights) {
      form.setFieldsValue({
        weights: "uniform", // Varsayılan weights değeri 'uniform' olarak atanır
      });
    }
    if (!test_size) {
      form.setFieldsValue({
        test_size: 0.2, // Varsayılan test_size değeri "0.2" olarak atanır
      });
    }

    if (!random_state) {
      form.setFieldsValue({
        random_state: 42, // Varsayılan random_state değeri "42" olarak atanır
      });
    }
    if (!sutun1) {
      form.setFieldsValue({
        sutun1: "2", // Varsayılan sutun1 değeri "create date" olarak atanır
      });
    }
    if (!sutun2) {
      form.setFieldsValue({
        sutun2: "7", // Varsayılan sutun2 değeri "logical connection" olarak atanır
      });
    }
    if (value.length >= 2) {
      form.setFieldsValue({
        sutun1: { value: value[0] },
        sutun2: { value: value[1] },
      });
    }
    if (!deger) {
      form.setFieldsValue({
        deger: 300, // Varsayılan sutun2 değeri "logical connection" olarak atanır
      });
    }
    if (!operator) {
      form.setFieldsValue({
        operator: ">", // Varsayılan sutun2 değeri "logical connection" olarak atanır
      });
    }
  };

  const handleButtonClick = () => {
    setShowProgressIcon(true);
    form.validateFields().then((values) => {
      if (
        values.n_neighbors &&
        values.metric &&
        values.weights &&
        values.test_size &&
        values.random_state &&
        values.sutun1 &&
        values.sutun2 &&
        values.deger &&
        values.operator
      ) {
        setLoading(true);

        const formData = {
          n_neighbors: values.n_neighbors,
          metric: values.metric,
          weights: values.weights,
          test_size: values.test_size,
          random_state: values.random_state,
          sutun1: values.sutun1,
          sutun2: values.sutun2,
          deger: values.deger,
          operator: values.operator,
        };

        axios
          .post("http://localhost:5000/get_confusion_matrix_KNN", formData, {
            responseType: "blob",
          })
          .then((response) => {
            const imageBlob = new Blob([response.data], { type: "image/png" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageSrc(imageUrl);

            // message.success("Karmaşıklık matrisi çizildi!");
            setCounter(1);

            return axios.post(
              "http://localhost:5000/get_KNN_performance",
              formData
            );
          })
          .then((response) => {
            const result = response.data;
            setResult(result);

            message.success("KNN performance tamamlandı!");
            setCounter(2);
            console.log(companyiddValue)

            message.success("İşlem tamamlandı!");
            setFinnish(true);
          })
          .catch((error) => {
            console.error("API İsteği Hatası:", error);
            message.error("İşlem sırasında bir hata oluştu!");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        message.error(
          "Lütfen tüm gerekli girişleri doldurun veya varsayılan değerleri seçin!"
        );
      }
    });
  };

  const [value, setValue] = useState([2, 7]);

  const handleSliderChange = (value) => {
    setValue(value);
    const selectedSutun1 = sutun1options[value[0]];
    const selectedSutun2 = sutun1options[value[1]];
    form.setFieldsValue({
      sutun1: { value: value[0], label: selectedSutun1 },
      sutun2: { value: value[1], label: selectedSutun2 },
    });
  };

  const handleSutun1Change = (selectedValue) => {
    setValue([selectedValue, value[1]]);
    form.setFieldsValue({
      sutun1: { value: selectedValue, label: sutun1options[selectedValue] },
      sutun2: { value: value[1], label: sutun1options[value[1]] },
    });
  };

  const handleSutun2Change = (selectedValue) => {
    setValue([value[0], selectedValue]);
    form.setFieldsValue({
      sutun1: { value: value[0], label: sutun1options[value[0]] },
      sutun2: { value: selectedValue, label: sutun1options[selectedValue] },
    });
  };

  const operators = [">", ">=", "<", "<="];
  const [operator, setOperator] = useState(">");
  const [valuek, setValuek] = useState(null);
  const handleOperatorChange = (value) => {
    setOperator(value);
  };

  const handleValueChange = (value) => {
    setValuek(value);
  };

  const hedefEtiket = `y = df['page life expectancy'] ${operator} ${valuek}`;

  const progressIncrement = 50; // Her counter artışında ilerleme çubuğunun artacağı miktar
  useEffect(() => {
    if (counter === 0) {
      setProgress(0); // İlerleme çubuğu başlangıçta %0 olarak ayarlandı
    } else {
      setProgress((prevProgress) => prevProgress + progressIncrement);
      console.log("counter deger", counter);
    }
  }, [counter]);

  return (
    <React.Fragment>
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item
          name="company"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Hangi şirekete aitse dosya bilgileri listeden seçim
                    yapabilirsiniz.
                  </div>
                }
              >
                Şirketinizi Seçiniz
              </Tooltip>
            </span>
          }
        >
          <CompanySelectButton onValueChange={handleCompanySelect} />
        </Form.Item>
        <Form.Item
          name={["n_neighbors"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Kaç tane en yakın komşunun dikkate alınacağını
                    belirler.Sayısal bir değerdir ve genellikle 1 ile 20
                    arasında bir değer kullanılır.
                  </div>
                }
              >
                n_neighbors
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 1,
              max: 20,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Veri noktaları arasındaki uzaklığı veya benzerliği hesaplama
                    yöntemini belirler.
                  </div>
                }
              >
                metric
              </Tooltip>
            </span>
          }
          name="metric"
        >
          <Select>
            {metricOptions.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Komşuların etkisini belirlerken kullanılan ağırlık türünü
                    belirler.
                  </div>
                }
              >
                weights
              </Tooltip>
            </span>
          }
          name="weights"
        >
          <Select>
            {weightOptions.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="sutunAralik"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Veri setindeki belirli x. sütundan (dahil) y. sütuna (hariç)
                    kadar olan sütunları seçer. Bu şekilde, belirli verilerle
                    çalışabilirsiniz.
                  </div>
                }
              >
                Sütün Aralığı
              </Tooltip>
            </span>
          }
        >
          <div>
            <Slider
              range
              min={0}
              max={36}
              marks={marks}
              value={value}
              onChange={handleSliderChange}
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>
              <h5>Seçilen Sutün Aralığı:</h5>
              {value[0]} : {data[value[0]]} -- {value[1]} : {data[value[1]]}
            </p>
          </div>
        </Form.Item>
        <Form.Item
          name="sutun1"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Veri işleme ve model oluşturma süreçlerinde belirli
                    sütunlara odaklanmayı sağlar.Lütfen başlangıç sütünü
                    seçiniz. ( Bu sutün değeri dahildir) .
                  </div>
                }
              >
                Sütün 1
              </Tooltip>
            </span>
          }
        >
          <Select onChange={handleSutun1Change}>
            {sutun1.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="sutun2"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Veri işleme ve model oluşturma süreçlerinde belirli
                    sütunlara odaklanmayı sağlar.Lütfen bitiş sütünü seçiniz. (
                    Bu sutün değerinden öncesine kadar dahildir) .
                  </div>
                }
              >
                Sütün 2
              </Tooltip>
            </span>
          }
        >
          <Select onChange={handleSutun2Change}>
            {sutun2.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={["test_size"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Test size parametresi, veri setinin eğitim ve test alt
                    kümelerine bölünürken kullanılan test setinin oranını
                    belirleyen bir parametredir. 0.1 ile 1 arasında olabilir.
                  </div>
                }
              >
                Test Size
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 0.1,
              max: 1,
            },
          ]}
        >
          <InputNumber step={0.1} />
        </Form.Item>

        <Form.Item
          name={["random_state"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Random State rastgelelik içeren işlemlerin tekrarlanabilir
                    olmasını sağlayarak modellerin karşılaştırılabilir sonuçlar
                    vermesine yardımcı olur. 1 ile 1000 arasında olabilir.
                  </div>
                }
              >
                Random State
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 0,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={1} />
        </Form.Item>

        <Form.Item
          name="operator"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Seçtiğiniz işlemci ile page life expectancy sütunundaki
                    değerleri belirttiğiniz değer ile karşılaştırarak verileri
                    filtrelemeyi sağlar.
                  </div>
                }
              >
                Operator
              </Tooltip>
            </span>
          }
        >
          <Select onChange={handleOperatorChange}>
            {operators.map((op) => (
              <Select.Option key={op} value={op}>
                {op}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={["deger"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Seçtiğiniz sayıya göre page life expectancy sütunundaki
                    değerleri belirttiğiniz değer ile karşılaştırarak verileri
                    filtrelemeyi sağlar.
                  </div>
                }
              >
                Hedef Etiketi
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 0,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={1} onChange={handleValueChange} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>{hedefEtiket}</div>
                }
              >
                Hedef Etiketi
              </Tooltip>
            </span>
          }
        >
          <span>{hedefEtiket}</span>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button onClick={handleDefaultButtonClick}>
            Varsayılan Değeri Seç
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" onClick={handleButtonClick}>
            {loading ? <Spin style={{ marginRight: "0.5rem" }} /> : null}
            {loading ? "İşleniyor..." : "Eğitimi Tamamla"}
          </Button>
        </Form.Item>
      </Form>

      {showProgressIcon && <Progress percent={progress} status="active" />}

      {imageSrc && finnish && (
        <div>
          {/* <h2
            style={{
              marginTop: "4rem",
              textAlign: "center",
              backgroundColor: "#c6e2ff",
            }}
          >
            Karmaşıklık matrisi
          </h2> */}

          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <img
              style={{ maxWidth: "100%", height: "auto" }}
              src={imageSrc}
              alt="Confusion Matrix"
            /> */}
         
          </div>
          
          {result && (
            <CompareThreeAlgoeithm
              result1={result1}
              result2={result2}
              result3={result}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
}

// result prop'unun doğrulama şeması
MixThree.propTypes = {
  result1: PropTypes.shape({
    classification_report: PropTypes.object,
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
  result2: PropTypes.shape({
    classification_report: PropTypes.object,
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
};

export default MixThree;
