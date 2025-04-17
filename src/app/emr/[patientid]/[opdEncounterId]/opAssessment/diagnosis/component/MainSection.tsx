import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";

import React from "react";
import DiagnosisForm from "./DiagnosisForm";
import FixedDiagnosis from "./FixedDiagnosis";

const MainSection = () => {
  //start with new code
  const [tabSel, setTabsel] = React.useState<any>("Diagnosis");
  const [result, setResult] = React.useState<any>([]);

  return (
    <>
      <Tabs value="1">
        <TabsHeader>
          <Tab value={"1"} onClick={() => setTabsel("Diagnosis")}>
            Diagnosis
          </Tab>
          <Tab value={"2"} onClick={() => setTabsel("Fixed_Diagnosis")}>
            Fixed Diagnosis
          </Tab>
        </TabsHeader>
        <TabsBody className="!p-0">
          <TabPanel value={"1"} className="!p-0">
            <DiagnosisForm
              tabSel={tabSel}
              result={result}
              setResult={setResult}
            />
          </TabPanel>
          <TabPanel value={"2"} className="!p-0">
            <FixedDiagnosis tabSel={tabSel} />
          </TabPanel>
        </TabsBody>
      </Tabs>
      {/* Diagnosis Form */}

      {/* DiagnosisGrid Form */}

      {/* FixedDiagnosis grid */}
    </>
  );
};

export default MainSection;
