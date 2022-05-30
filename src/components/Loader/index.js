import React from 'react';
import './style.css';

const Loader = ({ width = '100vw', height = '100vh'}) => {
  return (
    <div className='container' style={{ width, height }}>
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
};

export default Loader;