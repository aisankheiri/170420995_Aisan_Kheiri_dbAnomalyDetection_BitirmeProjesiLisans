import { useEffect, useState } from "react";

function Heatmap2() {
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/get_heatmap2").then((response) =>
        response.blob()
      ),
      fetch("http://localhost:5000/get_heatmap2_gpt_yorum").then((response) =>
        response.json()
      ),
    ]).then(([heatmapResponse, gptResponse]) => {
      const url = URL.createObjectURL(heatmapResponse);
      setHeatmapUrl(url);
      setAnswer(gptResponse.answer);
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
        Korelasyon Matrisi
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {heatmapUrl && (
          <div
            style={{
              maxWidth: "100%",
              width: "60%",
              height: "auto",
              marginBottom: "30px",
            }}
          >
            <img
              src={heatmapUrl}
              alt="Korelasyon Matrisi"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <div style={{ textAlign: "justify" }}>{answer}</div>
      <br/>
    </div>
  );
}

export default Heatmap2;
