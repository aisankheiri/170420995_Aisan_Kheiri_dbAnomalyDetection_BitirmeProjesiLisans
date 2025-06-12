import {
  Button,
  Form,
  InputNumber,
  message,
  Progress,
  Select,
  Spin,
  Tooltip,
} from "antd";
import AfterLstm from "../Web/DeepLearning/AfterLstm";
import CompanySelectButton from "./CompanySelectButton";
import { useEffect, useState } from "react";
import axios from "axios";
import PageLifeImg2 from "../Web/DeepLearning/PageLifeImg2";
import PdfUserLstm from "../Web/DeepLearning/PdfUserLstm";
import React from "react";
import ErrorValues from "../Web/DeepLearning/ErrorValues";

const { Option } = Select;
const optimizerOptions = [
  {
    label: "Adam",
    value: "adam",
    description:
      "Adam, adaptif momentum tahmini kullanarak gradient inişini gerçekleştiren bir optimizasyon algoritmasıdır.",
  },
  {
    label: "SGD",
    value: "sgd",
    description:
      "SGD (Stokastik Gradyan Azalma), her adımda rastgele bir örnek seçerek gradyanı hesaplayan bir optimizasyon algoritmasıdır.",
  },
  {
    label: "RMSprop",
    value: "rmsprop",
    description:
      "RMSprop, gradyanları daha verimli bir şekilde hesaplamak için karesel gradyan ölçeklemesini kullanan bir optimizasyon algoritmasıdır.",
  },
  {
    label: "Adagrad",
    value: "adagrad",
    description:
      "Adagrad, her parametre için ayrı ayrı adapte edilmiş öğrenme hızları kullanarak gradyan inişini gerçekleştiren bir optimizasyon algoritmasıdır.",
  },
];
const lossFunctionOptions = [
  {
    label: "Ortalama Kare Hatası",
    value: "mean_squared_error",
    description:
      "MSE, gerçek ve tahmin edilen değerler arasındaki ortalama karesel farkı ölçer.",
  },
  {
    label: "Ortalama Mutlak Hata",
    value: "mean_absolute_error",
    description:
      "MAE, gerçek ve tahmin edilen değerler arasındaki ortalama mutlak farkı hesaplar.",
  },
  {
    label: "Ortalama Kare Logaritmik Hata",
    value: "mean_squared_logarithmic_error",
    description:
      "MSLE, gerçek ve tahmin edilen değerler arasındaki ortalama karesel logaritmik farkı ölçer.",
  },
  {
    label: "Huber Kaybı",
    value: "huber_loss",
    description:
      "Huber loss, aykırı değerlere karşı hassas olan bir hata ölçüsüdür.",
  },
  {
    label: "Quantile Kaybı",
    value: "quantile_loss",
    description:
      "Quantile loss, tahminin gerçek değerden büyük veya küçük olmasına göre farklı şekilde cezalandırır.",
  },
  {
    label: "Kosinüs Benzerliği",
    value: "cosine_proximity",
    description:
      "Kosinüs benzerliği, iki vektör arasındaki açıyı temsil eden bir benzerlik ölçüsüdür.",
  },
  {
    label: "Log-Cosh Kaybı",
    value: "logcosh",
    description:
      "Log-Cosh loss, logaritmik hiperbolik kosinüs hata fonksiyonunu kullanarak bir kayıp ölçüsüdür.",
  },
];

const LSTMForm = () => {
  const [form] = Form.useForm();
  const [companyiddValue, setCompanyidValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [answer1, setAnswer1] = useState(null);
  const [finnish, setFinnish] = useState(false);
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProgressIcon, setShowProgressIcon] = useState(false);

  const handleButtonClick = () => {
    setShowProgressIcon(true)
    form.validateFields().then((values) => {
      if (
        values.noron &&
        values.dropout &&
        values.epoch &&
        values.batch &&
        values.optimizer &&
        values.lossfunc
      ) {
        setLoading(true);
   

        const formData = {
          noron: values.noron,
          dropout: values.dropout,
          epoch: values.epoch,
          batch: values.batch,
          optimizer: values.optimizer,
          lossfunc: values.lossfunc,
        };

        axios
          .post("http://localhost:5000/Lstm_pagelife2_img", formData, {
            responseType: "json",
          })
          .then((response) => {
            const answer = response.data.answer;
            const result = response.data;
            setResult(result);
            setAnswer(answer);
         

            axios
              .get("http://localhost:5000/Lstm_pagelife2_img_path", {
                responseType: "blob",
              })
              .then((response) => {
                const imageBlob = new Blob([response.data], {
                  type: "image/png",
                });
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageSrc(imageUrl);
                message.success("page life çizildi!");
                setCounter(1)
                return axios.get(
                  "http://localhost:5000/Lstm_pagelife_img_gpt_yorum"
                );
              })
              .then((response) => {
                const answer1 = response.data;
                setAnswer1(answer1.answer);
                message.success(
                  "orijinal sinifdagilimi verisi alındı!"
                );
                setCounter(2)
                message.success(
                  "işlem tamamlandı!"
                );
                setFinnish(true)
              })
              .catch((error) => {
                console.error("API İsteği Hatası:", error);
                message.error("İşlem sırasında bir hata oluştu!");
              })
              .finally(() => {
                setLoading(false);
              });
          })
          .catch((error) => {
            console.error("API İsteği Hatası:", error);
            message.error("İşlem sırasında bir hata oluştu!");
            setLoading(false);
          });
      } else {
        message.error(
          "Lütfen tüm gerekli girişleri doldurun veya varsayılan değerleri seçin!"
        );
      }
    });
  };
  const handleDefaultButtonClick = () => {
    const { noron, dropout, epoch, batch, optimizer, lossfunc } =
      form.getFieldsValue([
        "noron",
        "dropout",
        "epoch",
        "batch",
        "optimizer",
        "lossfunc",
      ]);

    if (!noron) {
      form.setFieldsValue({
        noron: 4, // Varsayılan
      });
    }

    if (!dropout) {
      form.setFieldsValue({
        dropout: 0.2, // Varsayılan
      });
    }

    if (!epoch) {
      form.setFieldsValue({
        epoch: 5, // Varsayılan
      });
    }

    if (!batch) {
      form.setFieldsValue({
        batch: 32, // Varsayılan
      });
    }
    if (!optimizer) {
      form.setFieldsValue({
        optimizer: "adam", // Varsayılan sutun1 değeri "create date" olarak atanır
      });
    }
    if (!lossfunc) {
      form.setFieldsValue({
        lossfunc: "mean_squared_error", // Varsayılan sutun2 değeri "logical connection" olarak atanır
      });
    }
  };

  const handleCompanySelect = (selectedValue) => {
    // Seçilen değeri aldığınızda burada istediğiniz işlemleri yapabilirsiniz
    console.log("Selected value in SVMForm:", selectedValue);
    setCompanyidValue(selectedValue);
  };

    
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
          name={["noron"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    LSTM katmanındaki nöron sayısı (örneğin, 4)
                  </div>
                }
              >
                Nöron sayısı
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 1,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={1} />
        </Form.Item>
        <Form.Item
          name={["dropout"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Aşırı uyumu azaltmak için kullanılan Dropout katmanındaki
                    oran (örneğin,0.2)
                  </div>
                }
              >
                Dropout oranı
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
          name={["epoch"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Eğitim verilerinin kaç kez model üzerinden geçeceği durum
                  </div>
                }
              >
                Epoch sayısı
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 1,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={1} />
        </Form.Item>
        <Form.Item
          name={["batch"]}
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Her adımda kullanılan örnek sayısı (örneğin,32,64,128)
                  </div>
                }
              >
                Batch boyutu
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 32,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={32} />
        </Form.Item>
        <Form.Item
          name="optimizer"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Eğitim sırasında kullanılan optimizasyon algoritması
                    (örneğin, Adam, SGD, RMSprop, Adagrad)
                  </div>
                }
              >
                Optimizer seçimi
              </Tooltip>
            </span>
          }
        >
          <Select>
            {optimizerOptions.map((option,index) => (
              <Option key={index} value={option.value}>
                <Tooltip title={option.description}>
                  <span>{option.label}</span>
                </Tooltip>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="lossfunc"
          label={
            <span>
              <Tooltip
                title={
                  <div style={{ textAlign: "justify" }}>
                    Modelin gerçek değerlerle tahmin ettiği değerler arasındaki
                    farkı hesaplar ve bu farkı minimize etmeye çalışır.
                  </div>
                }
              >
                Loss fonksiyonu
              </Tooltip>
            </span>
          }
        >
          <Select>
            {lossFunctionOptions.map((option,index) => (
              <Option key={index} value={option.value}>
                <Tooltip title={option.description}>
                  <span>{option.label}</span>
                </Tooltip>
              </Option>
            ))}
          </Select>
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
      {finnish && <AfterLstm />}
      {finnish && <PageLifeImg2 imageSrc={imageSrc} answer={answer} />}
      {finnish && <ErrorValues values={result.error_values} /> }
    

      <React.Fragment>
        {finnish && (
          <PdfUserLstm
            result={result}
            answer1={answer1}
            companyiddValue={companyiddValue}
          />
        )}
      </React.Fragment>
    </div>
  );
};

export default LSTMForm;
