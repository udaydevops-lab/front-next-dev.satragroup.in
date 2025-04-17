import React from "react";
import { DataGridTable } from ".";

const FixedDiagnosis = (props: any) => {
  return (
    <>
      <DataGridTable tabSel={props.tabSel} />
    </>
  );
};

export default FixedDiagnosis;
