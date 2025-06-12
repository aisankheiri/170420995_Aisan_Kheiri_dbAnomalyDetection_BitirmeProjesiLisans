// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ChartComponent = () => {
//   const [chartUrl, setChartUrl] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/chart')
//       .then(response => {
//         setChartUrl(response.data.image_url);
//       })
//       .catch(error => {
//         console.error('API request error:', error);
//       });
//   }, []);

//   return (
//     <div>
//       {chartUrl && <img src={chartUrl} alt="Chart" />}
//       chart alindi
//     </div>
//   );
// };

// export default ChartComponent;


import React, { useEffect, useState } from 'react';

const ChartComponent = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/chart')
      .then(response => response.blob())
      .then(blob => {
        const imageURL = URL.createObjectURL(blob);
        setImageSrc(imageURL);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, []);

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Chart" />}
    </div>
  );
};

export default ChartComponent;