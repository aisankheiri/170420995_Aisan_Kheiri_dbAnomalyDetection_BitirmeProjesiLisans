import pdf from "../../../api/img/document_with_background.pdf";
import { Button } from "antd";
const GetPdf = () => {
  return (
    <div>
      <a href={pdf} download="Rishabh's Resume" target="_blank">
        <Button type="primary" block>
          Download Rapor
        </Button>
      </a>
    </div>
  );
};

export default GetPdf;
