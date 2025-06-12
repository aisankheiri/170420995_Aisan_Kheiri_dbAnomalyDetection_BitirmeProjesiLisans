import { useEffect, useState } from "react";

function ElbowPlot() {
  const [heatmapUrl, setHeatmapUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/generate_plot_elbow")
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setHeatmapUrl(url);
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
        Elbow Plot
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
              alt="generate_plot_elbow"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ElbowPlot;
