import PatientHeader from "@/app/emr/[patientid]/[opdEncounterId]/_components/patient-header";
import React, { Children } from "react";
import ProceduresHeader from "./_components/ProceduresHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ProceduresHeader/>
      <div>{children}</div>
    </div>
  );
}
