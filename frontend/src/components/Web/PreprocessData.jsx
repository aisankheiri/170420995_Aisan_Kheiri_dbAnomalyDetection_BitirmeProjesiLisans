import { useEffect, useState } from "react";

function PreprocessData() {
  const [orijinalChartUrl, setOrijinalChartUrl] = useState("");
  const [undersamplingChartUrl, setUndersamplingChartUrl] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/get_orijinal_sinifdagilimi").then(
        (response) => response.blob()
      ),
      fetch("http://localhost:5000/get_undersampling_sinifdagilimi").then(
        (response) => response.blob()
      ),
      fetch("http://localhost:5000/get_get_orijinal_sinifdagilimi_gpt_yorum").then(
        (response) => response.json()
      ),
      fetch("http://localhost:5000/get_get_undersampling_sinifdagilimi_gpt_yorum").then(
        (response) => response.json()
      )
    ]).then(([heatmapResponse1, heatmapResponse2, gptResponse1, gptResponse2]) => {
      const url1 = URL.createObjectURL(heatmapResponse1);
      const url2 = URL.createObjectURL(heatmapResponse2);
      setOrijinalChartUrl(url1);
      setUndersamplingChartUrl(url2);
      setAnswer1(gptResponse1.answer);
      setAnswer2(gptResponse2.answer);
    });
  }, []);

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#c6e2ff",
        }}
      >
        Orijinal Sınıf Dağılımı 1
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {orijinalChartUrl && (
          <div style={{ maxWidth: "100%", width: "60%", height: "auto" }}>
            <img
              src={orijinalChartUrl}
              alt="Orijinal Sınıf Dağılımı"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <br />
      <div style={{ textAlign: "justify" }}>{answer1}</div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#c6e2ff",
        }}
      >
        Orijinal Sınıf Dağılımı 2
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {undersamplingChartUrl && (
          <div style={{ maxWidth: "100%", width: "80%", height: "auto" }}>
            <img
              src={undersamplingChartUrl}
              alt="Orijinal Sınıf Dağılımı"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <br />
      <div style={{ textAlign: "justify" }}>{answer2}</div>
    </div>
  );
}

export default PreprocessData;