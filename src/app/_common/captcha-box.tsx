"use client";
import React, { useEffect, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LinesImg from "../../Assets/lines.jpg";
import Input from "./input";
import Canvas from "./canvas";

export default function CaptchaBox(props: any) {
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Canvas
          text={props.captchaCode}
          style={{
            fontSize: "30px",
            width: "130px",
          }}
        />
        <AutorenewIcon
          onClick={props.generateCaptcha}
          style={{
            height: "73px",
            width: "45px",
            cursor: "pointer",
            color: "steelblue",
          }}
        />
      </div>
      <Input
        type="text"
        label="Enter Captcha"
        required={true}
        handleChange={handleCapthaChange}
        handleKeyPress={handleKeyPress}
        shrink={props.capthaValue}
      />
    </div>
  );
}
