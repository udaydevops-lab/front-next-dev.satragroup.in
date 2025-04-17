"use client";
import React, { useEffect, useState } from "react";
import Input from "../../../../_common/input";
import ActionButton from "@/app/_common/button";
import { useForm } from "react-hook-form";
import services from "@/app/utilities/services";
import { useParams } from "next/navigation";
import {
  abdmNotify,
  getHealthDocuments,
  saveHealthDocument,
} from "@/app/utilities/api-urls";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-tailwindcss-select";
import { getLocalItem } from "@/app/utilities/local";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import { capitalize } from "@mui/material";
import PatientHeader from "@/app/emr/[patientid]/[opdEncounterId]/_components/patient-header";
import convertToBase64 from "@/app/_commonfeatures/ConvertTobase64";
import removeBase64Prefix from "@/app/_commonfeatures/RemoveContenBase64";

export default function HealthDocument() {
  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [docData, setDocData] = useState<any>([]);
  const [fileName, setFileName] = useState("");
  const [completeDocData, setCompleteDocData] = useState<any>({});
  const [savedDocuments, setSavedDocuments] = useState<any>([]);
  const [resourceVal, setResourceVal] = useState<any>("");
  const searchParams = useParams();
  const patientId = searchParams.patientid;
  const encountId = searchParams.opdEncounterId;
  const [disable, setDisable] = useState(true);

  const handleDocumentUpload = async (e: any) => {
    const documentData = e.target.files?.[0];
    setCompleteDocData(documentData);
    const base64 = await convertToBase64(documentData);
    const removeBase64 = removeBase64Prefix(base64)

    setDocData(removeBase64);
    console.log(removeBase64)
  };

  const resourceTypeData: any = [
    {
      value: "Prescription",
      label: "Prescription",
    },
    {
      value: "DiagnosticReport",
      label: "Diagnostic Report",
    },
    {
      value: "OPConsultation",
      label: "OP Consultation",
    },
    {
      value: "DischargeSummary",
      label: "Discharge Summary",
    },
    {
      value: "ImmunizationRecord",
      label: "Immunization Record",
    },
    {
      value: "HealthDocumentRecord",
      label: "Health Document Record",
    },
    {
      value: "WellnessRecord",
      label: "Wellness Record",
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.no",
      width: 100,
      renderCell: (params) => {
        const rowNumber = savedDocuments.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "fileName",
      headerName: "Document Name",
      width: 220,
    },
    {
      field: "generatedDate",
      headerName: "Uploaded Date & Time",
      width: 200,
      renderCell: (params) => {
        const rowNumber = moment(params.row.generatedDate).format("DD-MM-YYYY");
        return rowNumber;
      },
    },
    {
      field: "viewDoc",
      headerName: "View Document",
      width: 130,
      renderCell: (params: any) => {
        return (
          <div
            onClick={() => handleDocumentClick(params.row.healthDocumentImage)}
          >
            <Tooltip content="View Health Document" className="bg-blue-600">
              <DocumentIcon className="w-5 h-5 ml-5 text-blue-400 cursor-pointer" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "uploadDoc",
      headerName: "Upload Document",
      width: 200,
      renderCell: (params: any) => {
        return (
          <div>
            <ActionButton
              buttonText={"Upload Health Records"}
              handleSubmit={() => handleUploadDocument(params.row)}
              width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        );
      }
    }
  ];

  const handleUploadDocument = (data: any) => {
    let postObj = {
      patientId: data.patientId,
      encounterId: data.encounterId,
      hiTypes: ['HealthDocumentRecord-Structured'],
    };
    services
      .create(abdmNotify, postObj)
      .then((response) => {
        if (response.data.error) {
          toast.error(capitalize(response.data.error))
        } else if (response.data.message) {
          toast.success(capitalize(response.data.message))
        }
      })
      .catch((err) => {
        toast.error("Technical error");
      });
  }

  const handleDocumentClick = (doc: string) => {
    console.log("Received document string:", doc);

    const base64Prefixes: any = {
      'data:application/pdf;base64,': 'application/pdf',
      'data:image/jpeg;base64,': 'image/jpeg',
      'data:image/png;base64,': 'image/png',
      'data:image/gif;base64,': 'image/gif',
      'data:application/msword;base64,': 'application/msword',
      'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    let mimeType = '';
    let base64String = '';

    console.log("Step 2");
    for (const prefix in base64Prefixes) {
      console.log("Checking prefix:", prefix);
      if (doc.startsWith(prefix)) {
        console.log("Prefix matched:", prefix);
        mimeType = base64Prefixes[prefix];
        base64String = doc.replace(prefix, '');
        break;
      }
    }

    if (!mimeType && !base64String) {
      try {
        atob(doc);
        mimeType = 'application/pdf';
        base64String = doc;
      } catch (error) {
        console.error('Invalid base64 string format or unsupported file type.');
        return;
      }
    }

    console.log("MIME Type:", mimeType);
    console.log("Base64 String:", base64String);

    if (mimeType && base64String) {
      try {
        console.log('MIME Type:', mimeType);
        console.log('Base64 String:', base64String.slice(0, 50));
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        console.log('Blob URL:', url);
        window.open(url);
      } catch (error) {
        console.error('Error decoding base64 string:', error);
      }
    } else {
      console.error('Invalid base64 string format or unsupported file type.');
    }
  }



  const handleSave = (data: any) => {
    const postObj = {
      patientId: patientId,
      encounterId: encountId,
      healthDocumentImage: docData,
      fileType: completeDocData.type,
      fileName: fileName,
      resourceType: resourceVal.label,
      generatedBy: JSON.parse(getLocalItem("loginResponse")!).employeename,
      statusFlag: 1,
    };
    console.log(postObj)
    services
      .create(saveHealthDocument, postObj)
      .then((response: any) => {
        toast.success("Saved successfully");
        getDocumentData();
        setFileName("");
        setResourceVal("");
      })
      .catch((err: any) => {
        console.log(err.message);
        toast.error("Please try again after sometime");
        setFileName("");
        setResourceVal("");
      });
  };

  const getDocumentData = () => {
    services
      .get(getHealthDocuments + patientId + "/" + encountId)
      .then((response: any) => {
        const updatedDocuments = response.data.map(
          (document: any, index: number) => ({
            id: index + 1,
            ...document,
          })
        );
        setSavedDocuments(updatedDocuments);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getDocumentData();
  }, []);

  return (
    <>
      <div className="font-bold md:pt-3 pb-3 mx-auto w-full ">
        <h1 className="w-full">Health Document</h1>
      </div>
      <div className=""><PatientHeader setDisable={setDisable} /></div>
      <div className="min-h-full rounded-curve border border-stroke bg-white p-8">
        <div className="mb-4 mt-4 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative flex flex-col pr-2">
            <Input
              type="text"
              label="File Name"
              name="fileName"
              handleChange={(e: any) => {
                // let cleanData = sanitizeInput(e.target.value)
                setFileName(sanitizeInput(e.target.value));
              }}
              value={fileName}
            />
          </div>
          <div className="relative flex flex-col pr-2">
            <Select
              primaryColor="blue"
              placeholder="Document Type *"
              options={resourceTypeData}
              value={resourceVal}
              onChange={(e: any) => {
                setResourceVal(e);
              }}
              classNames={{
                menuButton: ({ isDisabled }: any) =>
                  `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                    duration-300 focus:outline-none h-[39px]                                   
                                    ${isDisabled
                    ? "bg-blue-gray-200"
                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                  }`,
                menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                listItem: ({ isSelected }: any) =>
                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                    ? `text-white bg-blue-500`
                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                  }`,
              }}
            />
            <label
              style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
              className={`${resourceVal?.label !== undefined
                ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                : "text-sm opacity-0 top-10"
                } 
                                                                        truncate 
                                                                        cursor-default 
                                                                        select-none  
                                                                        absolute transition-all
                                                                       `}
            >
              Physical Activity / Observation (LOINC search)
            </label>
          </div>
          <div className="relative flex flex-col pr-2 mt-1">
            <input
              type="file"
              name="myfile"
              accept=".pdf"
              onChange={handleDocumentUpload}
            />
          </div>
          <div className="w-16 ml-[-2px]">
            <ActionButton
              buttonText="Save"
              handleSubmit={handleSubmit(handleSave)}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={resourceVal !== "" ? false : true}
            />
          </div>
        </div>
        <div>
          <DataGrid
            rows={savedDocuments}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 20]}
          />
        </div>
      </div>
    </>
  );
}