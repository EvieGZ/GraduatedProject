import React, { useState, useEffect } from 'react';
import slidepic1 from '../assets/slidepic1.png';
import slidepic2 from '../assets/slidepic2.png';
import './componentcss/PictureSlideshow.css';

const images = [
  slidepic1,
  slidepic2,
];

const PictureSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };  

  return (
    <div className="picture-slideshow">
      <div className="slide">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      </div>

      <div className="dots">
        {images.map((_, index) => (
            <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            ></span>
            ))}
        </div>
    </div>
  );
};

export default PictureSlideshow;
