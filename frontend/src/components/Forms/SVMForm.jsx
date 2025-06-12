import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Spin,
  Tooltip,
  Slider,
  Progress,
} from "antd";
import axios from "axios";
import SvmModelPerformance from "../Web/SvmModelPerformance";
import AfterSvm from "../Web/AfterSvm";
import PdfUserSvm from "../Web/PdfUserSvm";
import CompanySelectButton from "./CompanySelectButton";

const { Option } = Select;

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

const kernelOptions = [
  {
    label: "Linear",
    value: "linear",
  },
  {
    label: "Polynomial",
    value: "poly",
  },
  {
    label: "Radial basis function (RBF)",
    value: "rbf",
  },
  {
    label: "Sigmoid",
    value: "sigmoid",
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

function SVMForm() {
  const [form] = Form.useForm();
  const [result, setResult] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answerHeatmap, setAnswerHeatmap] = useState(null);
  const [answerHeatmap2, setAnswerHeatmap2] = useState(null);
  const [answerHeatmap3, setAnswerHeatmap3] = useState(null);
  const [answerHeatmap4, setAnswerHeatmap4] = useState(null);
  const [answerHeatmap5, setAnswerHeatmap5] = useState(null);
  const [answerHeatmap6, setAnswerHeatmap6] = useState(null);
  const [answerHeatmap7, setAnswerHeatmap7] = useState(null);
  const [answerHeatmap8, setAnswerHeatmap8] = useState(null);
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
      C,
      kernel,
      test_size,
      random_state,
      sutun1,
      sutun2,
      deger,
      operator,
    } = form.getFieldsValue([
      "C",
      "kernel",
      "test_size",
      "random_state",
      "sutun1",
      "sutun2",
      "deger",
      "operator",
    ]);

    if (!C) {
      form.setFieldsValue({
        C: 2, // Varsayılan C değeri 1 olarak atanır
      });
    }

    if (!kernel) {
      form.setFieldsValue({
        kernel: "sigmoid", // Varsayılan kernel değeri "linear" olarak atanır
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
        values.C &&
        values.kernel &&
        values.test_size &&
        values.random_state &&
        values.sutun1 &&
        values.sutun2 &&
        values.deger &&
        values.operator
      ) {
        setLoading(true);

        const formData = {
          C: values.C,
          kernel: values.kernel,
          test_size: values.test_size,
          random_state: values.random_state,
          sutun1: values.sutun1,
          sutun2: values.sutun2,
          deger: values.deger,
          operator: values.operator,
        };

        axios
          .post("http://localhost:5000/get_confusion_matrix_SVM", formData, {
            responseType: "blob",
          })
          .then((response) => {
            const imageBlob = new Blob([response.data], { type: "image/png" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageSrc(imageUrl);
            message.success("Karmaşıklık matrisi çizildi!");
            setCounter(1);

            return axios.post(
              "http://localhost:5000/get_svm_performance",
              formData
            );
          })
          .then((response) => {
            const result = response.data;
            setResult(result);
            console.log("İşlem Sonucu:", result);
            message.success("get_svm_performance tamamlandı!");
            setCounter(2);

            return axios.post("http://localhost:5000/get_heatmap_gpt_yorum");
          })
          .then((response) => {
            const heatmapResult = response.data;
            setAnswerHeatmap(heatmapResult.answer);
            message.success("heatmap1 verisi alındı!");
            setCounter(3);

            return axios.post("http://localhost:5000/get_heatmap2_gpt_yorum");
          })
          .then((response) => {
            const heatmap2Result = response.data;
            setAnswerHeatmap2(heatmap2Result.answer);
            message.success("heatmap2 verisi alındı!");
            setCounter(4);

            return axios.post("http://localhost:5000/get_expectancy_gpt_yorum");
          })
          .then((response) => {
            const heatmap3Result = response.data;
            setAnswerHeatmap3(heatmap3Result.answer);
            message.success("expectancy verisi alındı!");
            setCounter(5);

            return axios.post("http://localhost:5000/get_piechart_gpt_yorum");
          })
          .then((response) => {
            const heatmap4Result = response.data;
            setAnswerHeatmap4(heatmap4Result.answer);
            message.success("piechart verisi alındı!");
            setCounter(6);

            return axios.post(
              "http://localhost:5000/get_get_orijinal_sinifdagilimi_gpt_yorum"
            );
          })
          .then((response) => {
            const heatmap5Result = response.data;
            setAnswerHeatmap5(heatmap5Result.answer);
            message.success("sınıf dağılımı verisi alındı!");
            setCounter(7);

            return axios.post(
              "http://localhost:5000/get_get_undersampling_sinifdagilimi_gpt_yorum"
            );
          })
          .then((response) => {
            const heatmap6Result = response.data;
            setAnswerHeatmap6(heatmap6Result.answer);
            message.success("under sampling verisi alındı!");
            setCounter(8);

            return axios.post(
              "http://localhost:5000/get_get_support_plot_gpt_yorum"
            );
          })
          .then((response) => {
            const heatmap7Result = response.data;
            setAnswerHeatmap7(heatmap7Result.answer);
            message.success("support plot verisi alındı!");
            setCounter(9);

            return axios.post(
              "http://localhost:5000/get_get_confidence_plot_gpt_yorum"
            );
          })
          .then((response) => {
            const heatmap8Result = response.data;
            setAnswerHeatmap8(heatmap8Result.answer);
            message.success("confidence plot verisi alındı!");
            setCounter(10);

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

  const progressIncrement = 10; // Her counter artışında ilerleme çubuğunun artacağı miktar
  useEffect(() => {
    if (counter === 0) {
      setProgress(0); // İlerleme çubuğu başlangıçta %10 olarak ayarlandı
    } else {
      setProgress((prevProgress) => prevProgress + progressIncrement);
      console.log("counter deger", counter);
    }
  }, [counter]);

  return (
    <div>
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
          name={["C"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    C değeri sınıflandırma hatasını tolere etme içindir ve 0.1
                    ila 1000 arasında olabilir.
                  </div>
                }
              >
                C
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 0.01,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={0.01} />
        </Form.Item>
        <Form.Item
          name="kernel"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Kernel, SVM in veri noktalarını yüksek boyutlu uzayda
                    dönüştürmek veya doğrudan işlemek için kullanılan
                    matematiksel bir fonksiyondur.
                  </div>
                }
              >
                Kernel
              </Tooltip>
            </span>
          }
        >
          <Select>
            {kernelOptions.map((option, index) => (
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
            <h5>Seçilen Sutün Aralığı:</h5>
            {value[0]} : {data[value[0]]} -- {value[1]} : {data[value[1]]}
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
            {operators.map((op, index) => (
              <Select.Option key={index} value={op}>
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
            {loading ? "İşleniyor..." : "Eğitimi Başlat"}
          </Button>
        </Form.Item>
      </Form>

      {showProgressIcon && <Progress percent={progress} status="active" />}

      {finnish && (
        <React.Fragment>
          <AfterSvm result={result} />
          <SvmModelPerformance result={result} />
        </React.Fragment>
      )}

      {imageSrc && finnish && (
        <div>
          <h2
            style={{
              marginTop: "4rem",
              textAlign: "center",
              backgroundColor: "#c6e2ff",
            }}
          >
            Karmaşıklık matrisi
          </h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ maxWidth: "100%", height: "auto" }}
              src={imageSrc}
              alt="Confusion Matrix"
            />
          </div>
        </div>
      )}
      {finnish && (
        <PdfUserSvm
          result={result}
          answerHeatmap={answerHeatmap}
          answerHeatmap2={answerHeatmap2}
          answerHeatmap3={answerHeatmap3}
          answerHeatmap4={answerHeatmap4}
          answerHeatmap5={answerHeatmap5}
          answerHeatmap6={answerHeatmap6}
          answerHeatmap7={answerHeatmap7}
          answerHeatmap8={answerHeatmap8}
          companyiddValue={companyiddValue}
        />
      )}
    </div>
  );
}

export default SVMForm;
