import { useEffect, useState } from "react";

function PieChart() {
  const [chartUrl, setChartUrl] = useState("");

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/get_pie_chart").then((response) =>
        response.blob()
      ),
      fetch("http://localhost:5000/get_piechart_gpt_yorum").then((response) =>
        response.json()
      ),
    ]).then(([heatmapResponse, gptResponse]) => {
      const url = URL.createObjectURL(heatmapResponse);
      setChartUrl(url);
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
          Pie Chart
        </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
     
        }}
      >
       
        {chartUrl && (
          <div style={{ maxWidth: "100%", width: "50%", height: "auto" }}>
            <img
              src={chartUrl}
              alt="Pie Chart"
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

export default PieChart;
