import React from "react";
import Style from "../styles/HomePage.module.css";

const Button = ({ icon, btnName, handleClick }) => {
  return (
    <div className={Style.box}>
      <button className={Style.button} onClick={() => handleClick()}>
        {icon}
        {btnName}
      </button>
    </div>
  );
};

export default Button;
