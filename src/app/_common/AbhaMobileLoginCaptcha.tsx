"use client";
import React, { useEffect, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LinesImg from "../../Assets/lines.jpg";
import Input from "./input";
import Canvas from "./canvas";

export default function AbhaMobileLoginCaptcha(props: any) {
  const [displayCaptcha, setDisplayCaptcha] = useState(" ");

  useEffect(() => {}, []);

  const reGenerateCaptcha = () => {
    props.handleCaptcha(false);
  };
  const handleCapthaChange = (e: any) => {
    props.handleCapthaChange(e.target.value);
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      props.onSubmit();
      e.preventDefault();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center",alignItems:'center',gap:'5px' }}>
        <Canvas
          text={props.captchaCode}
          style={{
            fontSize: "20px",
            width: "110px",
          }}
        />
        <AutorenewIcon
          onClick={props.generateCaptcha}
          style={{
            height: "50px",
            width: "35px",
            cursor: "pointer",
            color: "steelblue",
          }}
        />
         <Input
        type="text"
        label="Enter Captcha"
        required={true}
        value={props.capthaValue}
        handleChange={handleCapthaChange}
        handleKeyPress={handleKeyPress}
        shrink={props.capthaValue}
      />
      </div>
     
    </div>
  );
}
