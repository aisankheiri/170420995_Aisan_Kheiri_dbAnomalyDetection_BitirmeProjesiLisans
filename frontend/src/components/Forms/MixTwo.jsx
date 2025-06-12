import {
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Tooltip,
  Spin,
  Progress,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import CompanySelectButton from "./CompanySelectButton";

import MixThree from "./MixThree";

const { Option } = Select;

const criterionOptions = {
  regression: [
    {
      label: "Squared Error",
      value: "squared_error",
    },
    {
      label: "Friedman MSE",
      value: "friedman_mse",
    },
    {
      label: "Absolute Error",
      value: "absolute_error",
    },
    {
      label: "Poisson",
      value: "poisson",
    },
  ],
  classification: [
    {
      label: "Gini",
      value: "gini",
    },
    {
      label: "Entropy",
      value: "entropy",
    },
    {
      label: "Log Loss",
      value: "log_loss",
    },
  ],
};

function MixTwo({result1}) {
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
      n_estimators,
      max_depth,
      min_samples_split,
      criterion,
      test_size,
      random_state,
    } = form.getFieldsValue([
      "n_estimators",
      "max_depth",
      "min_samples_split",
      "criterion",
      "test_size",
      "random_state",
    ]);

    if (!n_estimators) {
      form.setFieldsValue({
        n_estimators: 100, // Varsayılan n_estimators değeri 100 olarak atanır
      });
    }

    if (!max_depth) {
      form.setFieldsValue({
        max_depth: 5, // Varsayılan max_depth değeri 5 olarak atanır
      });
    }

    if (!min_samples_split) {
      form.setFieldsValue({
        min_samples_split: 2, // Varsayılan min_samples_split değeri 2 olarak atanır
      });
    }

    if (!criterion) {
      form.setFieldsValue({
        criterion: "gini", // Varsayılan criterion değeri 'gini' olarak atanır
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
  };
  const handleButtonClick = () => {
    setShowProgressIcon(true);
    form.validateFields().then((values) => {
      if (
        values.n_estimators &&
        values.max_depth &&
        values.min_samples_split &&
        values.criterion &&
        values.test_size &&
        values.random_state
      ) {
        setLoading(true);

        const formData = {
          n_estimators: values.n_estimators || 0, // Varsayılan değeri 0 olarak ayarlayabilirsiniz
          max_depth: values.max_depth,
          min_samples_split: values.min_samples_split,
          criterion: values.criterion,
          test_size: values.test_size,
          random_state: values.random_state,
        };
        axios
          .post("http://localhost:5000/get_confusion_matrix_RF", formData, {
            responseType: "blob",
          })
          .then((response) => {
            const imageBlob = new Blob([response.data], { type: "image/png" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageSrc(imageUrl);
            // message.success("Karmaşıklık matrisi çizildi!");
            setCounter(1);
            return axios.post(
              "http://localhost:5000/get_RF_performance",
              formData
            );
          })
          .then((response) => {
            const result = response.data;
            setResult(result);
            message.success("Random forest performance tamamlandı!");
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
  const handleCriterionChange = (value) => {
    const classificationOptions = criterionOptions.classification;
    const regressionOptions = criterionOptions.regression;
    const options =
      value === "regression" ? regressionOptions : classificationOptions;

    form.setFieldsValue({
      splitter: options[0].value,
    });
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
          name={["n_estimators"]}
          label={
            <span>
              <Tooltip title="Random Forest algoritmasında kullanılacak olan karar ağaçlarının sayısını belirler. Genellikle 10 ile 1000 arasında olabilir.">
                n_estimators
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 10,
              max: 1000,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["max_depth"]}
          label={
            <span>
              <Tooltip title="Karar ağaçlarının maksimum derinliğini belirler, ağacın kaç seviyeye kadar dallanabileceğini kontrol eder. Genellikle 1 ile 100 arasında olabilir.">
                max_depth
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 1,
              max: 100,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={["min_samples_split"]}
          label={
            <span>
              <Tooltip title=" Bir düğümün bölünmesi için gereken minimum örnek sayısını belirler. Genellikle 2 ile 20 arasında olabilir.">
                min_samples_split
              </Tooltip>
            </span>
          }
          rules={[
            {
              type: "number",
              min: 2,
              max: 20,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Tooltip title="Karar ağaçlarının bölünme noktalarını belirlemede kullanılan ölçütü (örneğin, 'gini' veya 'log loss') belirler.">
                criterion
              </Tooltip>
            </span>
          }
          name="criterion"
        >
          <Select onChange={handleCriterionChange}>
            <Option value="gini">Gini</Option>
            <Option value="log_loss">Log Loss</Option>
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

      {finnish && imageSrc &&(
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
          
       
        </div>
      )}
      <div
        style={{
          backgroundColor: "#87ceeb",
          textAlign: "center",
          margintop: "1rem",
          marginBottom: "1rem",
        }}
      >
        {" "}
        3.adım: KNN Algoritmasi
      </div>
      {result && (

      <MixThree result1={result1} result2={result}/>
      )}
    </React.Fragment>
  );
}

// result prop'unun doğrulama şeması
MixTwo.propTypes = {
  result1: PropTypes.shape({
    classification_report: PropTypes.object,
    confusion_matrix: PropTypes.array,
    accuracy: PropTypes.number,
    f1: PropTypes.number,
    recall: PropTypes.number,
  }).isRequired,
};


export default MixTwo;
