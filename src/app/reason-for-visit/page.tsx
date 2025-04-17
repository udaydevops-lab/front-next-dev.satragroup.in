"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ActionButton from "../_common/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  getOPEmrData,
  saveOPEmr,
  snowmedChiefcomplaint,
} from "../utilities/api-urls";
import services from "../utilities/services";
import Textarea from '@/app/_common/text-area';
// import TextArea from "../_common/textArea";
import Loader from "../_common/loader";
import { getLocalItem } from "../utilities/local";
import AlertCustomAnimation from "../_common/new-alert";
import moment from "moment";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import ActiveIcon from "../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../public/icons/wellness-record/inactive-icon";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ReactSelectBox } from "../_commonfeatures";
import { v4 as uuidv4 } from "uuid";
import { sanitizeInput } from "../utilities/sanitizeInput";
import ReactCommonDialog from "../_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "../_commonfeatures/DeletePopupMsg";


export default function ReasonForVisit(props: any) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { patientid, opdEncounterId } = useParams(); //get the patientid and opdEncounterId from url  "Access-Control-Allow-Origin": "*",
  // };

  const [alertMsg, setAlertMsg] = useState(false);
  const [delLoader, setDelLoader] = useState<any>(false);
  const [resetPopup, setResetPopup] = useState(false);
  const [reasonForVisitData, setReasonForVisitData] = useState<any>([]);
  const [selectedReason, setSelectedReason] = useState<any[]>([]);
  const [textAreaData, setTextAreaData] = useState("");
  const [getLength, setGetLength] = useState<any>(0);

  const [loading, setLoading] = useState(true);
  const [rfvData, setRfvData] = useState<any[]>([]);
  // this state for open and close the dailog popup when click on save button
  const [open, setOpen] = React.useState<any>(false);
  const [EMRData, setEMRData] = useState<any>({
    id: "",
    patientId: "",
    opdEncounterId: "",
    emrID: null,
    emrData: [
      {
        assessmentForm: [
          {
            cheifComaplaints: [],
            hpi: [],
            ros: [],
            pfsh: [],
            vitals: [],
            allergeis: [],
            physicalExamination: [],
            diagnosis: [],
            clinicalConditions: [],
            painScreening: [],
            reasonForVisit: [],
            treatmentPlan: [],
            serviceOrders: [],
          },
        ],
      },
    ],
  });

  // modal dialog open and closed
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 100,
      renderCell: (params) => {
        const rowNumber = selectedReason.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "desc", headerName: "Reason For Visit", width: 470 },
    { field: "recordDateTime", headerName: "Record Date Time", width: 150 },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params: any) => (
        <>
          {params.row.savedReasonData ? (
            <>
              <div className="cursor-pointer">
                {params.row.inActiverow === true ? (
                  <InactiveIcon />
                ) : (
                  <ActiveIcon
                    className
                    onClick={(e: any) => {
                      // inActiveMark(e, params.row)
                      setModaloc({ ...modaloc, open: true, id: params.row.id });
                    }}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="cursor-pointer">
              <TrashIcon
                onClick={() => handleDelete(params.row)}
                className="text-red-500 hover:text-red-600 w-5 h-5 cursor-pointer"
              />
            </div>
          )}
        </>
      ),
    },
  ];

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
  const getEmpLoginName = empName;

  // reason for visit states here
  const [rfvsnomed, setRfvsnomed] = useState<any>({
    label: "Reason For Visit",
  });

  let isSelectVal: boolean = false;

  // getdata from select rfvsnomed
  const selecthandleChange = (data: any) => {
    if (rfvsnomed != null) {
      isSelectVal = true;
    }
    setRfvsnomed({
      id: Math.random(),
      desc: data.conceptFsn,
      value: data.term,
      label: data.conceptFsn,
      code: data.conceptId,
    });
  };
  const [saveDataBtn, setSaveDataBtn] = useState<any>([]);
  const addDataToGrid = () => {
    if (rfvsnomed === "Reason For Visit") {
      return toast.error(
        "Plesae  Do Not Leave Blank Reason for Visit Snomed field..."
      );
    }
    let recodeData = moment(new Date().toLocaleString()).format(
      "DD-MM-YYYY HH:mm"
    );
    const storeData: any = [
      ...selectedReason,
      {
        ...rfvsnomed,
        recordDateTime: recodeData,
        recordedBy: getEmpLoginName,
        savedReasonData: false,
        inActiverow: false,
      },
    ];
    setSaveDataBtn([...saveDataBtn, rfvsnomed]);
    const uniqDatareslt = storeData.reduce((acc: any, ccmpl: any) => {
      let obj = acc.find((c: any) => c.desc === ccmpl.desc);

      //returns the true or false

      if (obj) {
        toast.error(`you have enter  Same values again, please be awair`);
        return acc;
      } else {
        return acc.concat([ccmpl]);
      }
    }, []);

    setSelectedReason(uniqDatareslt);
    setRfvsnomed({
      label: "Reason For Visit",
    });
  };

  const handleTextArea = (selectedValue: any) => {
    setTextAreaData(sanitizeInput(selectedValue));
  };

  const handleDelete = (row: any) => {
    const updatedReasons = selectedReason.filter(
      (reason) => reason.id !== row.id
    );
    const savBtnShow = saveDataBtn.filter(
      (reason: any) => reason.id !== row.id
    );
    setSelectedReason(updatedReasons);
    setSaveDataBtn(savBtnShow);
  };

  const [isRowActive, setIsRowActive] = useState(false);

  const inActiveMark = () => {
    setDelLoader(true);
    setIsRowActive(!isRowActive);
    var getNewData: { [k: string]: any } = [];
    getNewData = rfvData.map((items: any) => {
      if (items.id === modaloc.id) {
        return {
          ...items,
          inActiverow: !items.inActiverow,
        };
      }
      return items;
    });

    var postObj: { [k: string]: any } = {};
    let emrDataSub = EMRData?.emrData[0]?.assessmentForm[0];

    postObj = {
      id: EMRData.id,
      emrID: EMRData.emrID,
      patientId: EMRData.patientId,
      opdEncounterId: EMRData.opdEncounterId,
      emrData: [
        {
          assessmentForm: [
            {
              cheifComaplaints: emrDataSub.cheifComaplaints,
              hpi: emrDataSub.hpi,
              ros: emrDataSub.ros,
              pfsh: emrDataSub.pfsh,
              vitals: emrDataSub.vitals,
              reasonForVisit: getNewData,
              allergeis: emrDataSub.allergeis,
              physicalExamination: emrDataSub.physicalExamination,
              diagnosis: emrDataSub.diagnosis,
              clinicalConditions: emrDataSub.clinicalConditions,
              painScreening: emrDataSub.painScreening,
              treatmentPlan: emrDataSub.treatmentPlan,
              serviceOrders: emrDataSub.serviceOrders,
            },
          ],
        },
      ],
    };

    services
      .create(saveOPEmr, postObj)
      .then((response) => {
        setTimeout(() => {
          setLoading(false);
          setModaloc({ ...modaloc, open: false });
          getReason();
          setDelLoader(false);
          toast.success("Successfully inactivated the record");
        }, 2000);
      })
      .catch((err) => {
        setTimeout(() => {
          console.log(err.message);
          toast.error(
            `${err.response?.data?.statusMessage
              ? err.response.data.statusMessage
              : err.message
            }`
          );
          setDelLoader(false);
        }, 2000);
      });
  };

  const onSubmit = () => {
    setDelLoader(true);
    setLoading(true);
    var postObj: { [k: string]: any } = {};
    var savedData: any[] = [];
    if (EMRData.emrID == null) {
      let reOfSysData: any = [];
      selectedReason.map((val) => {
        reOfSysData.push(val);
      });
      reOfSysData["nurseNotes"] = textAreaData;
      savedData = reOfSysData.map((items: any) => {
        return { ...items, savedReasonData: true, nurseNotes: textAreaData };
      });

      postObj = {
        id: null,
        emrID: null,
        patientId: patientid,
        opdEncounterId: opdEncounterId,
        emrData: [
          {
            assessmentForm: [
              {
                hpi: [],
                painScreening: [],
                allergeis: [],
                diagnosis: [],
                cheifComaplaints: [],
                physicalExamination: [],
                ros: [],
                serviceOrders: [],
                reasonForVisit: savedData,
                vitals: [],
                pfsh: [],
                clinicalConditions: [],
                treatmentPlan: [],
              },
            ],
          },
        ],
      };
    } else {
      let emrDataSub = EMRData?.emrData[0]?.assessmentForm[0];
      savedData = selectedReason.map((items: any) => {
        return { ...items, savedReasonData: true, nurseNotes: textAreaData };
      });
      postObj = {
        id: EMRData.id,
        emrID: EMRData.emrID,
        patientId: EMRData.patientId,
        opdEncounterId: EMRData.opdEncounterId,
        recordedBy: getEmpLoginName,
        emrData: [
          {
            assessmentForm: [
              {
                cheifComaplaints: emrDataSub?.cheifComaplaints,
                hpi: emrDataSub?.hpi,
                ros: emrDataSub?.ros,
                pfsh: emrDataSub?.pfsh,
                vitals: emrDataSub?.vitals,
                reasonForVisit: savedData,
                allergeis: emrDataSub?.allergeis,
                physicalExamination: emrDataSub?.physicalExamination,
                diagnosis: emrDataSub?.diagnosis,
                clinicalConditions: emrDataSub?.clinicalConditions,
                painScreening: emrDataSub?.painScreening,
                treatmentPlan: emrDataSub?.treatmentPlan,
                serviceOrders: emrDataSub?.serviceOrders,
              },
            ],
          },
        ],
      };
    }

    if (selectedReason.length === getLength) {
      toast.error("No Add Any Data In The Record Grid...");

    } else {

      try {
        services
          .create(saveOPEmr, postObj)
          .then((response) => {
            setLoading(false);
            setTimeout(() => {
              if (EMRData.emrID !== null) {
                toast.success("Updated Successfully!");
              } else {
                toast.success("New Recored Added Successfully!");
              }
              getReason();
              setDelLoader(false);
              setSaveDataBtn([]);
              setOpen(false);
            }, 2000);
          })
          .catch((err) => {
            setTimeout(() => {
              console.log(err);
              toast.error(
                `${err.response.data.statusMessage
                  ? err.response.data.statusMessage
                  : err.message
                }`
              );
              setDelLoader(false);
              setOpen(false);
              setSaveDataBtn([]);
            }, 2000);
          });

        getReason();
      }
      catch (err) {
        if (err instanceof Error) {
          console.log(err)
          toast.error(
            `${err.message}`
          );
          setDelLoader(false);
          setSaveDataBtn([]);
          setOpen(false);
        } else {
          console.log(err)
          setDelLoader(false);
          setSaveDataBtn([]);
          setOpen(false);
        }
      } finally {
        setTimeout(() => {
          setDelLoader(false);
          setSaveDataBtn([]);
          setOpen(false);
        }, 2000)

      }
    }
  };

  const [val, setVal] = useState<any>("");

  const selectInput = (e: any) => {
    setVal(e.target.value);
    getReasonVisitSnomed();
  };

  // const getReasonVisitSnomed
  const getReasonVisitSnomed = () => {
    services
      .get(
        snowmedChiefcomplaint +
        `term=${val.toLocaleString()}&state=active&semantictag=finding&acceptability=synonyms&returnlimit=100&refsetid=null&parentid=null&fullconcept=false`
      )
      .then((res) => {
        setReasonForVisitData(
          res.data.map((rfvitems: any) => {
            return {
              ...rfvitems,
              label: rfvitems.conceptFsn,
              value: rfvitems.term,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //for below function we have get all the saved records
  const getReason = async () => {
    try {
      const [emrResponse, rfvResponse] = await Promise.all([
        services.get(getOPEmrData + patientid + "/" + opdEncounterId),
        services.get(
          getOPEmrData + patientid + "/" + opdEncounterId + "/reasonForVisit"
        ),
      ]);
      setEMRData(emrResponse.data);
      setRfvData(rfvResponse.data.reasonForVisit);
      setSelectedReason(rfvResponse.data.reasonForVisit);
      setGetLength(rfvResponse.data.reasonForVisit.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEMRData([]);
      setRfvData([]);
      setSelectedReason([]);
    } finally {
      setLoading(false);
    }
  };

  // when click on check box for mark in Reason for visit class added
  const getRowClassName = (params: any) => {
    return params.row.inActiverow === true ? "disabled-row" : "";
  };

  const handleOpen = () => setOpen(!open);

  //when click on the clear button clear the data
  const ClearData = () => {


    setDelLoader(true);

    try {
      let emrDataSub = EMRData?.emrData[0]?.assessmentForm[0];
      var postObj: { [k: string]: any } = {};
      postObj = {
        id: EMRData.id,
        emrID: EMRData.emrID,
        patientId: EMRData.patientId,
        opdEncounterId: EMRData.opdEncounterId,
        emrData: [
          {
            assessmentForm: [
              {
                cheifComaplaints: emrDataSub.cheifComaplaints,
                hpi: emrDataSub.hpi,
                ros: emrDataSub.ros,
                pfsh: emrDataSub.pfsh,
                vitals: emrDataSub.vitals,
                reasonForVisit: [],
                allergeis: emrDataSub.allergeis,
                physicalExamination: emrDataSub.physicalExamination,
                diagnosis: emrDataSub.diagnosis,
                clinicalConditions: emrDataSub.clinicalConditions,
                painScreening: emrDataSub.painScreening,
                treatmentPlan: emrDataSub.treatmentPlan,
                serviceOrders: emrDataSub.serviceOrders,
              },
            ],
          },
        ],
      };
      services
        .create(saveOPEmr, postObj)
        .then((response) => {
          setLoading(false);

          setTimeout(() => {
            toast.success("Cleared Successfully...");
            getReason();
            setDelLoader(false);
            setSaveDataBtn([]);
            setResetPopup(false)
          }, 2000)

        })
        .catch((err) => {
          setTimeout(() => {
            console.log(err);
            toast.error(
              `${err.response.data.statusMessage
                ? err.response.data.statusMessage
                : err.message
              }`
            );
            setDelLoader(false);
            setResetPopup(false);
            setSaveDataBtn([]);
          }, 2000);
        });
    } catch (err) {
      if (err instanceof Error) {
        setTimeout(() => {
          toast.error(`An Error Occured`)
          setDelLoader(false);
          setResetPopup(false);
          setSaveDataBtn([]);
        }, 2000);
      } else {
        setTimeout(() => {
          setDelLoader(false);
          setResetPopup(false);
          setSaveDataBtn([]);
        }, 2000);
      }
    }
    finally {
      setTimeout(() => {
        setDelLoader(false);
        setResetPopup(false);
        setSaveDataBtn([]);
      }, 2000)
    }
  };

  useEffect(() => {
    getReasonVisitSnomed();
    setLoading(true);

    let emrID = getLocalItem("emrID");

    if (emrID != null || emrID != undefined) {
      setLoading(true);
      services
        .get(getOPEmrData + emrID)
        .then((response) => {
          setEMRData(response.data ? response.data : null);
          setLoading(false);
          setDelLoader(false);
        })
        .catch((err) => {
          console.log(err.message);
          setDelLoader(false);
          setLoading(false);
        });
    } else {
    }
    //get the Reason for visit data from the below link after save
    setLoading(true);
    getReason();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tabVal]);

  return (
    <>
      {alertMsg ? (
        <div>
          <AlertCustomAnimation setAlertMsg={setAlertMsg} />
        </div>
      ) : null}
      {loading ? <Loader /> : ""}
      <div className="min-h-full ">
        <div className="font-bold w-full mx-auto max-w-7xl">
          <h1>Reason For Visit</h1>
        </div>

        <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
          <div className="w-full mx-auto">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full max-w-full px-0 flex-0">
                <div className="relative flex flex-col my-2 bg-white border-0 rounded-2xl px-2">
                  <div className="border-black/12.5 rounded-2xl border border-solid p-4 ">
                    <div className="flex flex-wrap -mx-3 px-2  gap-3">
                      <div className="md:w-1/2 md:flex gap-2 w-full ">
                        <div className="w-full">
                          <ReactSelectBox
                            value={rfvsnomed}
                            options={reasonForVisitData}
                            onChange={selecthandleChange}
                            label="Reason For Visit"
                            isSearchable={true}
                            onSearchInputChange={selectInput}
                            isMultiple={false}
                          />
                        </div>

                        <ActionButton
                          buttonText="Add"
                          handleSubmit={handleSubmit(addDataToGrid)}
                          width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                          disabled={rfvsnomed.label !== "Reason For Visit" ? false : true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col bg-white border-0 rounded-2xl pb-4 px-2">
                  <div className="border-black/12.5 rounded-2xl border border-solid p-2 ">
                    <div className="w-full max-w-full py-2 px-2">
                      <div>
                        <DataGrid
                          rows={selectedReason}
                          columns={columns}
                          getRowId={() => uuidv4()}
                          pageSizeOptions={[10, 20]}
                          checkboxSelection={false}
                          getRowClassName={getRowClassName}
                          isRowSelectable={(params: any) => {
                            return params.row.inActiverow === true;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col bg-white border-0 rounded-2xl pb-4 ">
                  <div className="w-full max-w-full pb-2 px-2">

                    <Textarea
                      label="Nurse Notes"
                      name="referenceComments"
                      value={textAreaData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTextAreaData(e.target.value)}
                      minrows={4}
                    />

                  </div>
                  <div className="px-2 flex items-center justify-end gap-2">
                    <ActionButton
                      // buttonText={EMRData.emrID !== null ? "Update" : "Save"}
                      buttonText={textAreaData || selectedReason.length > 0 ? "Update" : "Save"}
                      handleSubmit={handleSubmit(onSubmit)}
                      width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      disabled={textAreaData || saveDataBtn.length > 0 ? false : true}
                    />


                    {/* <ActionButton
                      buttonText="Reset"
                      width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      handleSubmit={() => setResetPopup(true)}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReactCommonDialog
        open={resetPopup}
        handler={() => setResetPopup(false)}
        popupClose={() => setResetPopup(false)}
        Content={
          <DeletePopupMsg
            btnYesFun={ClearData}
            btnNoFun={() => setResetPopup(false)}
            content={<>you want to Clear this record?</>}
            loader={delLoader}
          />
        }
      />

      {/* Dailog box */}
      <ReactCommonDialog
        open={modaloc.open}
        handler={() => setModaloc({ ...modaloc, open: false })}
        popupClose={() => setModaloc({ ...modaloc, open: false })}
        Content={
          <DeletePopupMsg
            btnYesFun={inActiveMark}
            btnNoFun={handleOpen}
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

      {/* <ReactCommonDialog
        open={open}
        handler={handleOpen}
        popupClose={handleOpen}
        Content={
          <DeletePopupMsg
            btnYesFun={onSubmit}
            btnNoFun={handleOpen}
            content={
              <>
                you want to Save this record?
                <div className="w-full text-gray-500">
                  <small>
                    <strong>Note:</strong> Once you save this record, you unable
                    to delete this record but you mark the record
                  </small>
                </div>
              </>
            }
            loader={delLoader}
          />
        }
      /> */}

      {/* <Dialog
                open={open}
                handler={handleOpen}
                size={"sm"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5"
            >
                <DialogHeader className=" justify-center">
                    <div className="w-100">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            you want to save this record?
                        </div>
                    </div>

                </DialogHeader>
                <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                    <strong>Note:</strong>Once you save this record, you unable to delete this record but you mark the record
                </DialogBody>
                <DialogFooter className="text-center justify-center">
                    <Button variant="gradient" color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600" onClick={onSubmit}>
                        <span>Yes</span>
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-red-500 hover:bg-red-600"
                        color="red"
                        onClick={handleOpen}
                    >
                        <span>No</span>
                    </Button>
                </DialogFooter>
            </Dialog>  */}

      {/* Dailog box */}
      {/* <Dialog
                open={modaloc.open}
                handler={() => setModaloc({ ...modaloc, open: false })}
                size={"sm"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5"
            >
                <DialogHeader className=" justify-center">
                    <div className="w-100">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            you want to Inactive this record?
                        </div>
                    </div>
                </DialogHeader>
                <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                    <strong>Note:</strong>
                    Once you Inactive this record, you mark as a wrong record entered
                </DialogBody>
                <DialogFooter className="text-center justify-center">
                    <Button variant="gradient" color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600" onClick={inActiveMark}>
                        <span>Yes</span>
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-red-500 hover:bg-red-600"
                        color="red"
                        onClick={() => setModaloc({ ...modaloc, open: false })}
                    >
                        <span>No</span>
                    </Button>
                </DialogFooter>
            </Dialog> */}
    </>
  );
}