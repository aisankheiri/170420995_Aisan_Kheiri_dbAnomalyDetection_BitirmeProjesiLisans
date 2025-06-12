import { Form, Select, InputNumber, Button, message,Tooltip } from "antd";

const { Option } = Select;

const lossOptions = {
  regression: [
    {
      label: "Squared Error",
      value: "squared_error",
    },
    {
      label: "Absolute Error",
      value: "absolute_error",
    },
    {
      label: "Huber",
      value: "huber",
    },
    {
      label: "Quantile",
      value: "quantile",
    },
  ],
  classification: [
    {
      label: "Log Loss",
      value: "log_loss",
    },
    {
      label: "Exponential",
      value: "exponential",
    },
  ],
};

function GradientBoostingForm() {
  const handleDefaultButtonClick = () => {
    const { loss, learning_rate, subsample, n_estimators, max_depth, min_samples_split, criterion } = form.getFieldsValue([
      'loss',
      'learning_rate',
      'subsample',
      'n_estimators',
      'max_depth',
      'min_samples_split',
      'criterion',
    ]);
  
    if (!loss) {
      form.setFieldsValue({
        loss: 'squared_error', // Varsayılan loss fonksiyonu
      });
    }
  
    if (!learning_rate) {
      form.setFieldsValue({
        learning_rate: 0.1, // Varsayılan öğrenme oranı
      });
    }
  
    if (!subsample) {
      form.setFieldsValue({
        subsample: 0.7, // Varsayılan alt örneklem oranı
      });
    }
  
    if (!n_estimators) {
      form.setFieldsValue({
        n_estimators: 100, // Varsayılan ağaç sayısı
      });
    }
  
    if (!max_depth) {
      form.setFieldsValue({
        max_depth: 5, // Varsayılan maksimum derinlik
      });
    }
  
    if (!min_samples_split) {
      form.setFieldsValue({
        min_samples_split: 2, // Varsayılan minimum örnek sayısı
      });
    }
  
    if (!criterion) {
      form.setFieldsValue({
        criterion: 'friedman_mse', // Varsayılan bölme kriteri
      });
    }
  };

  const handleButtonClick = () => {
    form.validateFields().then((values) => {
      // Form girişlerini kontrol et
      if (
        !values.loss ||
        !values.learning_rate ||
        !values.subsample ||
        !values.n_estimators ||
        !values.max_depth ||
        !values.min_samples_split ||
        !values.criterion
      ) {
        message.error("Lütfen tüm gerekli girişleri doldurun veya varsayılan değerleri seçin!");
        return;
      }

      // Girişler geçerli, işlemlere devam et
      // ...
      message.success("Gerekli girişler dolu. İşlem yapılabilir!");
    });
  };

  const [form] = Form.useForm();

  const handleLossChange = (value) => {
    // loss fonksiyonu değiştiğinde, criterion seçeneklerini güncelle
    const classificationOptions = lossOptions.classification;
    const regressionOptions = lossOptions.regression;
    const options =
      value === "regression" ? regressionOptions : classificationOptions;

    form.setFieldsValue({
      criterion: options[0].value, // Varsayılan criterion değerini güncelle
    });
  };

  return (
    <Form form={form} labelCol={{ span: 3 }}>
      <Form.Item 
          label={
          <span>
            <Tooltip title="Kayıp fonksiyonu, modelin eğitim sırasında hata ölçümünü ve optimize edilecek hedefi belirler.">
            loss
            </Tooltip>
          </span>
        }
        name="loss">
        <Select onChange={handleLossChange}>
          <Option value="classification">Classification</Option>
          <Option value="regression">Regression</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={["learning_rate"]}
        label={
          <span>
            <Tooltip title="Her bir ağacın katkısının ölçeğini kontrol eder, genellikle 0.001 ile 0.1 arasında bir değer kullanılır.">
            learning_rate
            </Tooltip>
          </span>
        }
        rules={[
          {
            type: "number",
            min: 0.001,
            max: 0.1,
          },
        ]}
      >
        <InputNumber step={0.01} />
      </Form.Item>
      <Form.Item
        name={["subsample"]}
        label={
          <span>
            <Tooltip title="Her bir ağaç için kullanılacak veri alt kümesinin oranını belirler, genellikle 0.5 ile 1 arasında bir değer kullanılır.">
            subsample
            </Tooltip>
          </span>
        }
        rules={[
          {
            type: "number",
            min: 0.5,
            max: 1,
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
      <Form.Item
        name={["n_estimators"]}
        label={
          <span>
            <Tooltip title="Gradient boosting modelinde kullanılacak ağaç sayısını belirler, genellikle 100 ile 1000 arasında bir değer kullanılır.">
            n_estimators
            </Tooltip>
          </span>
        }
        rules={[
          {
            type: "number",
            min: 100,
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
            <Tooltip title="Her bir ağacın maksimum derinliğini belirler, genellikle 3 ile 10 arasında bir değer kullanılır.">
            max_depth
            </Tooltip>
          </span>
        }
        rules={[
          {
            type: "number",
            min: 3,
            max: 10,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={["min_samples_split"]}
        label={
          <span>
            <Tooltip title="Bir iç düğümün bölünmesi için gereken minimum örnek sayısını belirler, genellikle 2 ile 10 arasında bir değer kullanılır.">
            min_samples_split
            </Tooltip>
          </span>
        }
        rules={[
          {
            type: "number",
            min: 2,
            max: 10,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item  label={
          <span>
            <Tooltip title="Ağaçların bölünme kriterini belirler.">
            criterion
            </Tooltip>
          </span>
        }
         name="criterion">
        <Select>
          {lossOptions.classification.map((option,index) => (
            <Option key={index} value={option.value}>
              {option.label}
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
          1.adımı Tamamla
        </Button>
      </Form.Item>
    </Form>
  );
}

export default GradientBoostingForm;
