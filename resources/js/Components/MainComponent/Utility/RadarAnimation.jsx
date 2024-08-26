import React from 'react';
import { FaCircle } from 'react-icons/fa';

const RadarAnimation = () => {
    return (
        <div className="radar-container">
            <FaCircle className="icon-center" style={{ color: 'purple', fontSize: '12px' }} />
            <div className="radar-ring"></div>
            <div className="radar-ring"></div>
        </div>
    );
};

export default RadarAnimation;
