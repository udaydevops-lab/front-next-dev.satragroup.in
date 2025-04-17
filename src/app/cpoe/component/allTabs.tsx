import React, { useEffect, useState } from "react";
import AllTabCpoeForm from "./allTabCpoeForm";
import AllTabsGrid from "./allTabsGrid";
import services from "@/app/utilities/services";
import { getCPOE, getPatientDetails, saveCPOE } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { getLocalItem } from "@/app/utilities/local";

const AllTabs = (props: any) => {
  const { patientid, opdEncounterId } = useParams();
  console.log("pationt info", patientid, opdEncounterId);
  const [getAddAllCpoe, setGetAddAllCpoe] = useState<any>([]);
  const [store, setStore] = useState<any>([]);

  const storedLoginResponse = getLocalItem("loginResponse");
  let empName;
  try {
    empName = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeename
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empName = ""; // Set a default value or handle the error accordingly
  }
  const doctor = empName;

  const [patientDetials, setatientDetials] = useState<any>({
    patientName: "",
    mrnNum: "",
  });

  const getPatientData = async () => {
    const data: any = await services.get(
      getPatientDetails + patientid + "/" + opdEncounterId
    );

    setatientDetials({
      ...patientDetials,
      patientName: data.data.middleName,
      mrnNum: data.data.mrn,
    });
  };

  const copeSaveSubmission = () => {
    if (store.length === 0) {
      toast.error("Please add alteast one record...");
    } else {
      /*                
                {
                    "patientId": 939,
                    "opdEncounterId": 1412,
                    "recordedBy": "Kranthi b",
                    "statusFlag": 1,
                    "patintName": "Daram  Karthik",
                    "mrn": "34822",
                    "opAssessmentCpoeSet": [
                        {
                            "cpoeType": "Laboratory",
                            "basePrice":"1200.00",
                            "labServiceDesc": "Amino Acids Urea Cycle Panel LC/MS/MS", - get service desc
                            "serviceCode":"LB1003680", - get service code 
                            "department": "Laboratory", -
                            "specialty": "Biochemistry",
                            "specimen": null,
                            "modality": "Biochemistry",
                            "priority": "Routine",
                            "requestdate": "2024-02-03",
                            "opAssementCpoeId": null,
                            "status": "New Order",
                            "comments": "Pain In Ear",
                            "reasonForTesting": "Choroidal hemorrhage",
                            "statusFlag": 1,
                            "snomedCode":"313402005",   - get terminology code 
                            "snomedDescription":"Plasma amino acid measurement (procedure)" - get terminology Desc  
                            
                        }
                    ]
                }
            */

      let savePostObj: any = {
        patientId: Number(patientid),
        opdEncounterId: Number(opdEncounterId),
        recordedBy: doctor,
        statusFlag: 1,
        patintName: patientDetials.patientName,
        mrn: patientDetials.mrnNum,
        opAssessmentCpoeSet: store,
      };
      services
        .create(saveCPOE, savePostObj)
        .then((res) => {
          toast.success(`Successfully Added ${props.tabType} Record..`);
          getCpoeData();
          setStore([]);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Getting error, Please try again!");
        });
    }
  };

  // get copoe data as per the copetype
  const getCpoeData = () => {
    services
      .get(
        getCPOE +
          `patientId=${patientid}&opdEncounterId=${opdEncounterId}&cpoeType=${props.tabType}`
      )
      .then((res: any) => {
        let getfilterCpoetype = res.data
          .map((list: any) => {
            if (list.cpoeType === props.tabType) {
              return {
                cpoeType: list.cpoeType,
                opAssementHeaderId: list?.opAssementHeaderId,
                serviceCode: list.snomedCode,
                labServiceDesc: list.labServiceDesc,
                department: list.department,
                specialty: list.specialty,
                specimen: list.specimen,
                modality: list.modality,
                priority: list.priority,
                requestdate: list.requestdate,
                status: list.status,
                comments: list.comments,
                reasonForTesting: list.reasonForTesting,
                statusFlag: list.statusFlag,
                id: list.id,
                opAssementCpoeId: list.id,
                opdEncounterId: list.id,
              };
            }
          })
          .filter((list: any) => list.cpoeType === props.tabType)
          .filter((del: any) => del.statusFlag === 1);

        setGetAddAllCpoe(
          getfilterCpoetype
          //     .reduce((acc: any, ccmpl: any) => {
          //     let obj = acc.find((c: any) => (c.labServiceDesc === ccmpl.labServiceDesc) && (c.reasonForTesting === ccmpl.reasonForTesting) && (c.comments === ccmpl.comments));
          //     if (obj) {
          //         return acc;
          //     }
          //     else {
          //         return acc.concat([ccmpl])
          //     }
          // }, [])
        );
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.response.status}`)
      });
  };

  const [sendEditRecord, setSendEditRecord] = useState<any>(null);
  const onEdit = (data: any) => {
    setSendEditRecord(data);
  };

  useEffect(() => {
    getCpoeData();
    getPatientData();
  }, [props.tabType]);

  return (
    <>
      <div className="flex gap-4">
        <AllTabCpoeForm
          tabType={props.tabType}
          setGetAddAllCpoe={setGetAddAllCpoe}
          getAddAllCpoe={getAddAllCpoe}
          store={store}
          setStore={setStore}
          sendDataRecord={sendEditRecord}
          getCpoeData={getCpoeData}
          setSendEditRecord={setSendEditRecord}
          patientId={patientid}
          opdEncounterId={opdEncounterId}
          patintDetails={patientDetials}
          recordedBy={doctor}
        />
        <AllTabsGrid
          getAddAllCpoe={getAddAllCpoe}
          copeSaveSubmission={copeSaveSubmission}
          onEdit={onEdit}
          getCpoeData={getCpoeData}
          sendEditRecord={sendEditRecord}
          patientid={patientid}
          opdEncounterId={opdEncounterId}
          setGetAddAllCpoe={setGetAddAllCpoe}
          setStore={setStore}
          store={store}
          tabType={props.tabType}
        />
      </div>
    </>
  );
};

export default AllTabs;
