// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Accurcy.css";



// const Accuracy = () => {
//   const [accuracy, setAccuracy] = useState(0);
//   const [classificationReport, setClassificationReport] = useState("");
//   const [confusionMatrix, setConfusionMatrix] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/ml");
//         setAccuracy(response.data.accuracy);
//         setClassificationReport(response.data.classification_report);
//         setConfusionMatrix(response.data.confusion_matrix);
//       } catch (error) {
//         console.error("Error fetching accuracy:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderConfusionMatrix = () => {
//     if (confusionMatrix.length > 0) {
//       return (
//         <div>
//           <div>Confusion Matrix:</div>
//           <table>
//             <tbody>
//               {confusionMatrix.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {row.map((cell, cellIndex) => (
//                     <td key={cellIndex}>{cell}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     } else {
//       return null;
//     }
//   };

//   return (
//     <div className="accuracy-container">
//       <div className="accuracy">Accuracy: {accuracy}</div>
      
//       <div className="classification-report">Classification Report:</div>
//       <pre className="classification-report-content">{classificationReport}</pre>
//       {renderConfusionMatrix()}
  
     
//     </div>
//   );
// };

// export default Accuracy;



import  { useEffect, useState } from "react";
import axios from "axios";
import "./Accurcy.css";

const Accuracy = () => {
  const [accuracy, setAccuracy] = useState(0);
  const [classificationReport, setClassificationReport] = useState("");
  const [confusionMatrix, setConfusionMatrix] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/accuracy");
        setAccuracy(response.data.accuracy);
      } catch (error) {
        console.error("Error fetching accuracy:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/classification-report");
        setClassificationReport(response.data.classification_report);
      } catch (error) {
        console.error("Error fetching classification report:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/confusion-matrix");
        setConfusionMatrix(response.data.confusion_matrix);
      } catch (error) {
        console.error("Error fetching confusion matrix:", error);
      }
    };

    fetchData();
  }, []);

  const renderConfusionMatrix = () => {
    if (confusionMatrix.length > 0) {
      return (
        <div>
          <div>Confusion Matrix:</div>
          <table>
            <tbody>
              {confusionMatrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="accuracy-container">
      <div className="accuracy">Accuracy: {accuracy}</div>
      
      <div className="classification-report">Classification Report:</div>
      <pre className="classification-report-content">{classificationReport}</pre>
      {renderConfusionMatrix()}
    </div>
  );
};

export default Accuracy;