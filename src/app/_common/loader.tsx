'use client'
import * as React from "react";
import lodergif from '../../app/images/loderr.gif';
import Image from "next/image";


export default function Loader() {
  return (
    <div className="loder-gif">
      <Image className="lodergifff" src={lodergif} alt="icon" />
    </div>

  );
}
