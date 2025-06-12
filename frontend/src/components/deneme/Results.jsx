import React, { useEffect, useState } from 'react';

function Results() {
  const [accuracy, setAccuracy] = useState(null);
  const [classificationReport, setClassificationReport] = useState(null);
  const [confusionMatrixImage, setConfusionMatrixImage] = useState(null);

  useEffect(() => {
    // API endpoint URLs
    const accuracyUrl = 'http://localhost:5000/api/accuracy';
    const classificationReportUrl = 'http://localhost:5000/api/classification-report';
    const confusionMatrixUrl = 'http://localhost:5000/api/confusion-matrix';

    // Fetch accuracy
    fetch(accuracyUrl)
      .then(response => response.json())
      .then(data => setAccuracy(data.accuracy))
      .catch(error => console.error('Error:', error));

    // Fetch classification report
    fetch(classificationReportUrl)
      .then(response => response.json())
      .then(data => setClassificationReport(data.classification_report))
      .catch(error => console.error('Error:', error));

    // Fetch confusion matrix image
    fetch(confusionMatrixUrl)
      .then(response => response.blob())
      .then(blob => {
        const imageSrc = URL.createObjectURL(blob);
        setConfusionMatrixImage(imageSrc);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {accuracy !== null && (
        <div>
          <h2>Accuracy</h2>
          <p>{accuracy}</p>
        </div>
      )}

      {classificationReport !== null && (
        <div>
          <h2>Classification Report</h2>
          <pre>{classificationReport}</pre>
        </div>
      )}

      {confusionMatrixImage !== null && (
        <div>
          <h2>Confusion Matrix</h2>
          <img src={confusionMatrixImage} alt="Confusion Matrix" />
        </div>
      )}
    </div>
  );
}

export default Results;