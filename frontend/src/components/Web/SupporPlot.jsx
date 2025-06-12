import { useEffect, useState } from "react";

function SupporPlot() {
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/get_support_plot").then((response) =>
        response.blob()
      ),
      fetch("http://localhost:5000/get_get_support_plot_gpt_yorum").then(
        (response) => response.json()
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
        Support Plot
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {heatmapUrl && (
          <div style={{ maxWidth: "100%", width: "60%", height: "auto" }}>
            <img
              src={heatmapUrl}
              alt="Page Life Expectancy Heatmap"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <br />
      <div style={{ textAlign: "justify" }}>{answer}</div>
    </div>
  );
}

export default SupporPlot;
