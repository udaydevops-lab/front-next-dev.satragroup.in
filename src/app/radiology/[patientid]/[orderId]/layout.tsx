import PatientHeader from "@/app/emr/[patientid]/[opdEncounterId]/_components/patient-header";
import React, { Children } from "react";
import RadiologyHeader from "./_components/RadiologyHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <RadiologyHeader/>
      <div>{children}</div>
    </div>
  );
}
