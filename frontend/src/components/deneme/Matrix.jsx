import React from 'react';
import ConfusionMatrixPlot from './ConfusionMatrixPlot';

const Matrix = () => {
  const yTrue = [0, 1, 0, 1, 0];
  const yPred = [0, 1, 1, 1, 0];

  return (
    <div>
      <h1>Confusion Matrix Example</h1>
      <ConfusionMatrixPlot yTrue={yTrue} yPred={yPred} />
    </div>
  );
};

export default Matrix;