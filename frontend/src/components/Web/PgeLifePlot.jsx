import { useEffect, useState } from "react";

function PgeLifePlot() {
  const [imageSrc, setImageSrc] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/generate_and_send_plot").then((response) =>
        response.blob()
      ),
      fetch("http://localhost:5000/get_expectancy_gpt_yorum").then((response) =>
        response.json()
      ),
    ]).then(([heatmapResponse, gptResponse]) => {
      const url = URL.createObjectURL(heatmapResponse);
      setImageSrc(url);
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
        Page life expectancy için en çok etki eden kolonlar
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {imageSrc && (
          <div style={{ maxWidth: "100%", width: "60%", height: "auto" }}>
            <img
              src={imageSrc}
              alt="Flask Image"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <br/>
      <div style={{ textAlign: "justify" }}>{answer}</div>
    </div>
  );
}

export default PgeLifePlot;
