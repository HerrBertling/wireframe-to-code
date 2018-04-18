import React from "react";

const Phone = ({ children }) => (
  <div className="phoneWrapper">
    <div className="phoneOutlineTop" />
    <div className="phoneOutlineBody">
      <div className="phoneScreen">{children}</div>
    </div>
    <div className="phoneOutlineBottom" />
  </div>
);

export default Phone;
