import React from 'react';
import './CCFlyer.css';

const CCFlyer = () => {
  return (
    <div className="flyer-container">
      <div className="background-circle1"></div>
      <div className="background-circle"></div>
      <p className="tagline">Collaborate in Real-time</p>
      <h1 className="title">
        Code Together, <span className="highlight">Build Together</span>
      </h1>
      <p className="description">
        A real-time collaborative coding platform with AI assistance, designed for seamless team development.
      </p>
      <div className="btn-container">
        <button className="btn primary">Create Room</button>
        <button className="btn secondary">Join Existing Room</button>
      </div>
    </div>
  );
};

export default CCFlyer;
