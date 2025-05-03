import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';
import img6 from '../assets/img6.png';
import Navbar from './Navbar';

const images = [img1, img2, img3, img4, img5, img6];

function EduQueryTour() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (current === images.length - 1) {
        navigate('/videos');
    }
    setCurrent((current + 1) % images.length);
  } 
  const prevSlide = () => {
      navigate('/videos');
  }

  return (
    <>
    {/* <Navbar/> */}
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'black',
    }}>
      <img
        src={images[current]}
        alt={`Screenshot ${current + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
        boxShadow: '0 0 10px 2px rgba(255,0,0,0.8)',
      }} />

      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '40%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Skip
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '60%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Next
      </button>
    </div>
    </>
  );
}

export default EduQueryTour;
