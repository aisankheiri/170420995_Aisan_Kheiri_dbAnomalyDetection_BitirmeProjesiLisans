import React from 'react';
import Plotly from "react-plotly.js";

const ConfusionMatrixPlot = ({ yTrue, yPred }) => {
  const data = [
    {
      z: yTrue,
      x: yPred,
      type: 'heatmap',
      colorscale: 'Viridis',
    },
  ];

  const layout = {
    title: 'Confusion Matrix',
    xaxis: { title: 'Predicted Labels' },
    yaxis: { title: 'True Labels' },
  };

  return <Plotly data={data} layout={layout} />;
};

export default ConfusionMatrixPlot;