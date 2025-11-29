import React from "react";
import "./loading.css";

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <h1 className="loading-text">HỆ THỐNG <br></br>AMMS LOTUS GROUP</h1>
        </div>
    );
};

export default Loading;
