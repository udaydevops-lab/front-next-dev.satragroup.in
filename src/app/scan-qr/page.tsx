'use client'
import Image from "next/image";
import React from "react";
import earogyaqr from "./../../../public/images/ABHAImages/earogyaqr.png";
import abdmProdQr from "./../../../public/images/ABHAImages/abdmProdQr.png";
import devopqr from "./../../../public/images/ABHAImages/devopqr.jpeg";
import { getLocalItem } from "../utilities/local";
export default function page() {
    const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  return (
    <div className="min-h-full">
      <div className="w-full mx-auto max-w-7xl md:py-6 position-relative">
        <div className="font-semibold ms-4">Share Profile QR</div>
        <div className="min-h-full flex justify-center items-center rounded-curve border border-stroke mt-4 bg-white  ">
          <div className="m-10 ">
            <Image src={loginResponse?.abhaSuffix=='abdm'?abdmProdQr:earogyaqr} width={250} height={250} alt="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
