import { useState } from 'react';
import { Carousel, Button } from 'antd';
import 'antd'; // Ant Design stillerini projeye ekleyin

const ImageGallery = () => {
  const [current, setCurrent] = useState(0);

  const images = [
    '/img/kullanimklavuzu/1.png',
    '/img/kullanimklavuzu/2.png',
    '/img/kullanimklavuzu/3.png',
    '/img/kullanimklavuzu/4.png',
    '/img/kullanimklavuzu/5.png',
    '/img/kullanimklavuzu/6.png',
    '/img/kullanimklavuzu/7.png',
    '/img/kullanimklavuzu/8.png',
    '/img/kullanimklavuzu/9.png',
    '/img/kullanimklavuzu/10.png',
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const previous = () => {
    setCurrent(current - 1);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Carousel dotPosition="top" effect="fade" beforeChange={(from, to) => setCurrent(to)} autoplay>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Carousel>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button type="primary" disabled={current === 0} onClick={previous}>
          Previous
        </Button>
        <Button type="primary" disabled={current === images.length - 1} onClick={next} style={{ marginLeft: '10px' }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ImageGallery;