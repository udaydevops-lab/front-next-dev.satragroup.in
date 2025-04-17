"use clients";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import DateTime from "@/app/_common/date-time-picker";
import Textarea from "@/app/_common/text-area";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import moment from "moment";
import React, { useState } from "react";
import Select from "react-tailwindcss-select";

function ProceduresEntry() {
  const [feilds, setFeilds] = useState<any>({
    // resultEnterdDate: moment()
  });
  const handelProceduresEntry = () => { };
  const handelVerify = () => { };
  const handelPrint = () => { };
  const performedByDoctorList: any = [
    { label: "mahesh", value: "mahesh" },
    { label: "raja", value: "raja" },
    { label: "kranthi", value: "kranthi" },
    { label: "karthik", value: "karthik" },
  ];
  return (
    <>
      <div className="w-full overflow-auto">
        <div className="w-full flex justify-end gap-4 mb-4">
          <div className="w-2/6 relative ps-3 my-2">
            <DateTime
              name="ResultEnterdDate"
              label="Result Enterd Date Time"
              onChange={(e: any) =>
                setFeilds({ ...feilds, ResultEnterdDate: e })
              }
              value={feilds.ResultEnterdDate}
              slotProps={{
                actionBar: {
                  actions: ["today"],
                },
              }}
            />
          </div>
          <div className="w-2/6 relative  ps-3 my-2">
            <DateTime
              name="resultVerifyedDate"
              label="Result Verifyed Date Time"
              onChange={(e: any) =>
                setFeilds({ ...feilds, resultVerifyedDate: e })
              }
              value={feilds.ResultEnterdDate}
              slotProps={{
                actionBar: {
                  actions: ["today"],
                },
              }}
            />
          </div>
        </div>
        <div className="w-full mb-3 flex flex-wrap">
          <div className="w-auto pe-2">
            <span className="font-samibold">Service Name: </span>
            <span>Airway Endoscopy Report</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-samibold">Deportment: </span>
            <span>Procedures</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span>Speciality: </span>
            <span>test</span>
          </div>
          {" | "}
          <div className="w-auto ps-2">
            <span>SNOMED Code: </span>
            <span>1111111111</span>
          </div>
        </div>
        <div className="w-full mb-2 p-2 border">
          <div className="w-full flex gap-4">
            <div className="w-1/3 mb-2">Parameter</div>
            <div className="w-2/3 mb-2">Result</div>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-1/3 mb-2">Indication</div>
            <div className="w-2/3 mb-2">
              <Textarea
                onChange={(e: any) =>
                  setFeilds({
                    ...feilds,
                    indication: sanitizeInput(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-1/3 mb-2">Procedure Param 2</div>
            <div className="w-2/3 mb-2">
              <Textarea
                onChange={(e: any) =>
                  setFeilds({
                    ...feilds,
                    procedure_2: sanitizeInput(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="w-1/3 mb-2">Procedure Param 3</div>
            <div className="w-2/3 mb-2">
              <Textarea
                onChange={(e: any) =>
                  setFeilds({
                    ...feilds,
                    procedure_3: sanitizeInput(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="w-full flex mt-2">
          <div className="w-1/4">
            <Select
              placeholder="Performed By Doctor *"
              primaryColor="blue"
              value={feilds.performedByDoctor}
              options={performedByDoctorList}
              onChange={(e: any) =>
                setFeilds({ ...feilds, performedByDoctor: e })
              }
            />
          </div>
          <div className="w-3/4 flex justify-end gap-4">
            {["SAVE", "VERIFY", "PRINT"].map((text, index) => (
              <ActionButton
                key={index}
                buttonText={text}
                handleSubmit={
                  index === 0
                    ? handelProceduresEntry
                    : index === 1
                      ? handelVerify
                      : handelPrint
                }
                width="w-[120px] py-3"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProceduresEntry;
