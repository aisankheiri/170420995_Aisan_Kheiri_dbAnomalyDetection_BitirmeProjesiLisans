import { useEffect, useState } from "react";

function ConfusionMatrix() {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/get_confusion_matrix_SVM")
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Karmaşıklık Matrisi
      </h1>
      {imageSrc && (
        <div style={{ maxWidth: "100%", width: "35%", height: "auto" }}>
          <img
            src={imageSrc}
            alt="Flask Image"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default ConfusionMatrix;
