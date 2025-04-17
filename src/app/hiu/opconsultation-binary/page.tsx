"use client";
import React from "react";
import { consultationData } from "./opcounsultationapi";
import { DialogueBox } from "@/app/_common/graph";

export default function OpConsultation() {
  const handlePatientIdCard = () => {
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:application/pdf;base64," + consultationData.data
    );
    link.setAttribute("download", "ABHA_HealthCard.pdf");
    link.click();
  };
  return (
    <div>
      <div
        style={{ cursor: "pointer", width: "20px", height: "20px" }}
        onClick={handlePatientIdCard}
      >
        Hello
      </div>
      <DialogueBox
        buttonText="Hello"
        size="xl"
        content={
          <object
            data={`data:application/pdf;base64,${consultationData.data}`}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <div>Alternative text</div>
          </object>
        }
      />
    </div>
  );
}
