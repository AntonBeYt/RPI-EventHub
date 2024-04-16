import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import posters
import poster1 from './poster1.jpeg';
import poster2 from './poster2.jpeg';
import poster3 from './poster3.png';
import poster4 from './poster4.jpeg';
import poster5 from './poster5.png';

const images = [
  { src: poster1, caption: "Caption for Poster 1" },
  { src: poster2, caption: "Caption for Poster 2" },
  { src: poster3, caption: "Caption for Poster 3" },
  { src: poster4, caption: "Caption for Poster 4" },
  { src: poster5, caption: "Caption for Poster 5" }
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const goToNext = () => {
    setActiveIndex(current => current === images.length - 1 ? 0 : current + 1);
  };

  const goToPrev = () => {
    setActiveIndex(current => current === 0 ? images.length - 1 : current - 1);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="carousel">
      <div className="main-image">
        <div className="caption-above">{images[activeIndex].caption}</div>
        <img src={images[activeIndex].src} alt={`Slide ${activeIndex}`} />
        <button onClick={() => { goToPrev(); resetTimer(); }} className="prev-button">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button onClick={() => { goToNext(); resetTimer(); }} className="next-button">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
