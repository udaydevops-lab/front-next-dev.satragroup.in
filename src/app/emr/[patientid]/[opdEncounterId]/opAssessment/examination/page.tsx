"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";
import axios from "axios";
import {
  deleteExamination,
  getExamination,
  saveExamination,
  snowmedChiefcomplaint,
  snowmedData,
} from "@/app/utilities/api-urls";
import {
  Button,
  Input,
} from "@material-tailwind/react";
import moment from "moment";
import services from "@/app/utilities/services";
import { useParams, useRouter } from "next/navigation";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getLocalItem } from "@/app/utilities/local";
import { TrashIcon } from "@heroicons/react/24/solid";
import InactiveIcon from "../../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../../public/icons/wellness-record/active-icon";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithHyphen } from "@/app/utilities/validations";
import UseErrorMessage from "@/app/_commonfeatures/UseErrorMessage";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";

const Examination = (props: any) => {
  const headers: any = {
    serviceEntityId: getLocalItem("serviceEntityId"),
    locationId: getLocalItem("locationId"),
    "Access-Control-Allow-Origin": "*",
  };
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [newdataa, setNewDataa] = useState<any>([]);
  const [dataa, setDataa] = useState<any>([]);
  const [examination, setExamination] = useState<any>("");
  const [examinationSnomedDataId, setExaminationSnomedDataId] = useState("");
  const [fullySpecifiedName, setFullySpecifiedName] = useState("");
  const [examinationList, setExaminationList] = useState([]);
  const [examinationListMain, setExaminationListMain] = useState<any>([]);
  const [comments, setComments] = useState("");
  const { errorMsg, setErrorMessage, clearErrorMessage } = UseErrorMessage();

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
  const [pushState, setPushState] = useState(true);
  const [key, setKey] = useState(44);

  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S No",
      width: 50,
      renderCell: (params) => {
        const rowNumber = dataa.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "physicalExaminatiponDesc",
      headerName: "Physical Examination",
      width: 300,
      renderCell: (params: any) => <>{params.row.snomedData.label}</>,
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 170,
      renderCell: (params: any) => <>{params.row.comments}</>,
    },
    {
      field: "recordedby",
      headerName: "Recorded By",
      width: 130,
      renderCell: (params: any) => (
        <div className="capitalize">{params.row.recordedBy}</div>
      ),
    },
    {
      field: "recordedtime",
      headerName: "Recorded Time",
      width: 180,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime1).format("DD-MM-YYYY HH:mm")}</>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params: any) => (
        <>
          {!params.row.opExaminationId ? (
            <>
              <button onClick={() => onRemove(dataa.indexOf(params.row))}>
                <TrashIcon className="text-red-500 w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              {params.row.statusFlag === 0 ? (
                <InactiveIcon />
              ) : (
                <ActiveIcon
                  className
                  onClick={(e: any) => {
                    setModaloc({ ...modaloc, open: true, row: params.row });
                  }}
                />
              )}
            </>
          )}
        </>
      ),
    },
  ];

  const getRowId = (row: any) => row.id;
  const getExaminationData = async () => {
    try {
      const response = await services.get(snowmedData + "365275006");
      const result = response.data;

      const DLresult = result.map((item: any) => ({
        value: item.id,
        label: item.fullySpecifiedName,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setExaminationList(DLresult);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };
  const getRowClassName = (params: any) => {
    return params.row.statusFlag === 0 ? "disabled-row" : "";
  };
  const onRemove = (index: any) => {
    const newGridData = [...dataa];
    newGridData.splice(index, 1);
    setDataa(newGridData);
    setNewDataa(newGridData.filter((list: any) => !list.opExaminationId));
  };

  const [delLoader, setDelLoader] = useState<any>(false)
  
  const onDelete = async () => {
    setDelLoader(true)
    const id = modaloc.row.id;
    const deleteURL =
      deleteExamination + patientid + "/" + opdEncounterId + "/" + id;
      try {
        services
          .create(deleteURL, modaloc.row)
          .then((response) => {
            setTimeout(() => {
              setKey(key + key);
              getExaminationDatamain();
              setModaloc({ ...modaloc, open: false });
              toast.success("Successfully inactivated the record");
              setDelLoader(false);
            }, 2000); // 2000 milliseconds = 2 seconds delay
          })
          .catch((e) => {
            setTimeout(() => {
              console.error(e.message);
              toast.error(`${e.response?.data?.statusMessage ? e.response.data.statusMessage : e.message}`);
              setDelLoader(false);
            }, 2000); // 2000 milliseconds = 2 seconds delay
          });
      } catch (error) {
        setTimeout(() => {
          console.error("Error:", error);
          toast.error("An unexpected error occurred.");
          setDelLoader(false);
        }, 2000); // 2000 milliseconds = 2 seconds delay
      }
  };
  const handleOptionClick = (e: any) => {
    setExamination(e);
    setExaminationSnomedDataId(e.conceptId);
    setFullySpecifiedName(e.label);
    const result: any = {
      activeStatus: 1,
      definitionStatusId: e.definitionStatusId,
      effectiveTime: e.effectiveTime,
      fullySpecifiedName: e.fullySpecifiedName,
      id: e.id,
      moduleId: e.moduleId,
      disabled: e.disabled,
    };
  };

  // add funnction
  const handleAdd = () => {
    if (!fullySpecifiedName) {
      toast.error("Please Add Examination.");
    } else {
      const conceptId =
        typeof examinationSnomedDataId === "string"
          ? examinationSnomedDataId
          : "";

      let objData: any = {
        id: uuidv4(),
        statusFlag: 1,
        comments: comments,
        conceptId: conceptId,
        recordedTime: moment().format("YYYY-MM-DD"),
        recordedBy: doctor,
        fullySpecifiedName: fullySpecifiedName,
        snomedData: examination,
      };

      const examNew: any = [...newdataa, objData];

      const uniqValue: any = examNew.reduce((acc: any, crr: any) => {
        let obj = acc.find(
          (list: any) =>
            list.snomedData.conceptFsn === crr.snomedData.conceptFsn
        );
        if (obj) {
          return acc;
        } else {
          return acc.concat([crr]);
        }
      }, []);

      setNewDataa(uniqValue);

      const finalMerge: any = [...dataa, objData].reduce(
        (acc: any, curr: any) => {
          let obj = acc.find(
            (list: any) =>
              list.snomedData.conceptFsn === curr.snomedData.conceptFsn
          );
          if (obj) {
            toast.error("You have entered same values again, Please awair....");
            return acc;
          } else {
            return acc.concat([curr]);
          }
        },
        []
      );

      setDataa(finalMerge);

      setFullySpecifiedName("");
      setExamination("");
      setComments("");
    }
  };

  // save function
  const handleSaveExamination = () => {
    var result = newdataa.map(function (obj: any) {
      return {
        statusFlag: obj.statusFlag,
        comments: obj.comments,
        conceptId: obj.conceptId,
        recordedTime: obj.recordedTime,
        recordedBy: obj.recordedBy,
        snomedData: obj.snomedData,
      };
    });
    const postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      statusFlag: 1,
      recordedBy: doctor,
      opAssessmentExaminationSet: result,
    };
    services
      .create(saveExamination, postObj, headers)
      .then((response) => {
        setNewDataa([]);
        setPushState(false);
        toast.success("success");
        getExaminationDatamain();
        setKey(key + key);
      })
      .catch((e) => {
        console.log(e.message);
        toast.error("Getting error, Please try again!");
      });
  };
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchData = e.target.value;
    const semantic =
      "finding++observable%20entity++body%20structure++qualifier%20value";
    if (searchData.length >= 2) {
      const response = await services.get(
        snowmedChiefcomplaint +
        `term=${searchData}&state=active&semantictag=${semantic}&acceptability=synonyms&returnlimit=500&refsetid=null&parentid=null&fullconcept=false`
      );
      const result = response.data.map((item: any) => ({
        value: item.id,
        label: item.conceptFsn,
        activeStatus: 1,
        caseSignificanceId: item.caseSignificanceId,
        conceptFsn: item.conceptFsn,
        conceptId: item.conceptId,
        conceptState: item.conceptState,
        definitionStatus: item.definitionStatus,
        effectiveTime: item.effectiveTime,
        hierarchy: item.hierarchy,
        id: item.id,
        isPreferredTerm: item.isPreferredTerm,
        languageCode: item.languageCode,
        moduleId: item.moduleId,
        term: item.term,
        typeId: item.typeId,
      }));
      setExaminationListMain(result);
    }
  };

  //Examination Data geting from api
  const getExaminationDatamain = async () => {
    try {
      const response = await services.get(
        ` ${getExamination}?patientId=${patientid}&opdEncounterId=${opdEncounterId}`
      );
      const ExaminationData = response.data.map((item: any) => ({
        id: item.opExaminationId,
        opExaminationId: item.opExaminationId,
        statusFlag: item.statusFlag,
        comments: item.comments,
        conceptId: item.conceptId,
        recordedTime: moment(item.recordedTime).format("DD-MM-YYYY HH:mm"),
        recordedBy: item.recordedBy,
        fullySpecifiedName: item.snomedData.fullySpecifiedName,
        snomedData: item.snomedData,
      }));
      const uniqValue: any = ExaminationData.reduce((acc: any, crr: any) => {
        let obj = acc.find(
          (list: any) =>
            list.snomedData.conceptFsn === crr.snomedData.conceptFsn
        );
        if (obj) {
          // toast.error("You have entered same values again, Please awair....")
          return acc;
        } else {
          return acc.concat([crr]);
        }
      }, []);

      setDataa(uniqValue);
    } catch (error) { }
  };
  useEffect(() => {
    getExaminationData();
    getExaminationDatamain();
  }, []);

  const handleChange = (e: any) => {
    setComments(e.target.value);
    clearErrorMessage({ ...errorMsg, comments: "" });
    if (comments && !alphaNumWithHyphen.test(comments)) {
      setErrorMessage({
        ...errorMsg,
        comments: "Please do not enter special characters!",
      });
    }
  };
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
      <div>
        <div className="mb-4  md:flex">
          <div className="md:w-2/6 my-3">Physical Examination Observation</div>
          <div className="md:w-4/6">
            <div className="md:w-full flex gap-3">
              <div className="md:w-2/6  my-2 ">
                <ReactSelectBox
                  optionListWidtsize={true}
                  isSearchable={true}
                  isMultiple={false}
                  value={examination}
                  options={examinationListMain}
                  onSearchInputChange={(e: any) => {
                    handleInputChange(e);
                  }}
                  onChange={(e: any) => {
                    handleOptionClick(e);
                  }}
                  label="Examination"
                />
              </div>
              <div className="md:w-3/6  my-2">
                <Input
                  crossOrigin
                  type="text"
                  color="blue"
                  label="Comments"
                  pattern="[a-zA-Z0-9]*"
                  name="comments"
                  value={comments}
                  onChange={(e) => setComments(sanitizeInput(e.target.value))}
                  containerProps={{
                    className: "!rounded-[8px] ",
                  }}
                  className="!rounded-[8px] focus:border-t-0"
                />
                {comments && !alphaNumWithHyphen.test(comments) && (
                  <div className="absolute text-xs mt-1 ml-1 text-red-500">
                    Please do not enter special characters !
                  </div>
                )}
              </div>
              <div className="md:w-1/6  my-2">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handleSubmit(handleAdd)}
                  width="w-full py-3"
                // disabled={
                //   errorMsg.comments === "" &&
                //     comments !== "" &&
                //     examination !== "Examination *"
                //     ? false
                //     : true
                // }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        key={key}
        className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
      >
        <DataGrid
          rows={dataa}
          columns={columns}
          getRowId={getRowId}
          pageSizeOptions={[10, 20]}
          getRowClassName={getRowClassName}
        />
      </div>
      <div className="w-full flex justify-end gap-6 mt-4 text-right">
      <div>
        {props?.screenData?.Save === 1 &&
          <ActionButton
            buttonText="SAVE"
            handleSubmit={handleSubmit(handleSaveExamination)}
            width="w-[120px] py-3"
            disabled={newdataa.length > 0 ? false : true}
          />
        }
      </div>
    </div>
      <ReactCommonDialog
        open={modaloc.open}
        handler={() => setModaloc({ ...modaloc, open: false })}
        popupClose={() => setModaloc({ ...modaloc, open: false })}
        Content={
          <DeletePopupMsg
            btnYesFun={onDelete }
            btnNoFun={() => setModaloc({ ...modaloc, open: false })}
            content={
              <>
                you want to Inactive this record?
                <div className="w-full text-gray-500">
                  <small>
                  <strong>Note:</strong>
                  Once you Inactive this record, you cannot rollback
                  </small>
                </div>
                </>
            }
            loader={delLoader}
          />
        }
      />
    
    </div>
  );
};

export default roleInfoScreenData(Examination, "EXAM")