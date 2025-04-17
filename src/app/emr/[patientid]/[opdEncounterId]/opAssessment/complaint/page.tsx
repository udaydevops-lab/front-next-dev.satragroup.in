"use client";

import ActionButton from "@/app/_common/button";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import {
  deleteChiefComplaint,
  getConfigData,
  getOpassmentapi,
  saveOpAssessmentData,
  snowmedChiefcomplaint,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { alphaNumWithHyphen } from "@/app/utilities/validations";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import { getLocalItem } from "@/app/utilities/local";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import InactiveIcon from "../../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../../public/icons/wellness-record/active-icon";
import moment from "moment";
import { ReactSelectBox } from "@/app/_commonfeatures";
import UseErrorMessage from "@/app/_commonfeatures/UseErrorMessage";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";

function Complaint(props: any) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { patientid, opdEncounterId } = useParams();

  // language data passing here by contextapi
  const { getLanData } = PatientDatadataAuth();

  const [durationList, setDurationList] = useState([]);

  // here increase the row data by id
  const [numIncr, setNumIncr] = useState(0);

  // show the chiefcompdata (snomed)
  const [chiefcompdata, setChiefcompdata] = useState<any>([]);

  // set the data storage by the field
  const [complainFeild, setComplainField] = useState({
    days: "",
    time: "",
    comments: "",
    recordedby: "",
    recorddatetime: new Date().toLocaleString(),
  });

  // when we click on the add button the store in this state
  const [store, setStore] = useState<any[]>([]);
  // gridshow states
  const [gridDatatable, setGridDatatable] = useState<any>([]);

  // start get the employee register name states
  const [employeename, setEmployeename] = useState<string | null>(null);

  const [snomedcomval, setSnomedcomval] = useState<any>({
    opt: "",
  });
  const { errorMsg, setErrorMessage, clearErrorMessage } = UseErrorMessage();

  // // get the selected row data
  // const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

  // const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
  //     setSelectionModel(newSelectionModel);
  // };

  // modal dialog open and closed
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
      // renderCell: (params) => {
      //   const rowNumber = gridDatatable.indexOf(params.row) + 1;
      //   return rowNumber;
      // },
    },
    {
      field: "cheifComplaints",
      headerName: getLanData?.complaint && getLanData.complaint?.chefcomplaint,
      width: 280,
    },
    {
      field: "duration",
      headerName: getLanData?.complaint && getLanData.complaint?.duration,
      width: 100,
    },
    {
      field: "comments",
      headerName: getLanData?.complaint && getLanData.complaint?.comments,
      width: 120,
    },
    {
      field: "recordedBy",
      headerName: getLanData?.complaint && getLanData.grid?.recordedby,
      width: 120,
    },
    {
      field: "recorddatetime",
      headerName: getLanData?.complaint && getLanData.grid?.datetime,
      width: 180,
    },

    {
      field: "actions",
      headerName: getLanData?.complaint && getLanData.grid?.actiion,
      width: 80,
      renderCell: (params: any) => (
        <>
          {!params.row.opAssessmentCompLId ? (
            <>
              <div
                className="text-center cursor-pointer"
                onClick={() =>
                  onDelete(gridDatatable.indexOf(params.row), params.row)
                }
              >
                <TrashIcon className="text-red-500 w-5 h-5" />
              </div>
            </>
          ) : (
            <>
              <div className="cursor-pointer">
                {params.row.statusFlag === 0 ? (
                  <InactiveIcon />
                ) : (
                  <ActiveIcon
                    className="cursor-pointer"
                    onClick={(e: any) => {
                      // inActiveMerMisstionPopup(e, params.row)
                      setModaloc({
                        ...modaloc,
                        open: true,
                        opAssessmentCompLId: params.row.opAssessmentCompLId,
                      });
                    }}
                  />
                )}
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  // here onchage function for store all the data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setComplainField({ ...complainFeild, [e.target.name]: e.target.value });

    clearErrorMessage({ ...errorMsg, comments: "" });
    if (
      complainFeild.comments &&
      !alphaNumWithHyphen.test(complainFeild.comments)
    ) {
      setErrorMessage({
        ...errorMsg,
        comments: "Please do not enter special characters!",
      });
    }
  };

  const [delLoader,setDelLoader]=useState<any>(false)
  const inActiveMark = () => {
    setDelLoader(true)
    let url: any =
      deleteChiefComplaint +
      `opAssessmentCompLId=${modaloc.opAssessmentCompLId}&patientId=${patientid}&opdEncounterId=${opdEncounterId}`;

    services
      .create(url, {})
      .then((res) => {
        setTimeout(() => {
          setDelLoader(false)
          getTheComplainSaveData();
          toast.success("Successfully inactivated the record");
          setModaloc({ ...modaloc, open: false });
        }, 2000);
        
      })
      .catch((err) => {
        setTimeout(() => {
          console.log(err);
        toast.error(`${err.response.data.statusMessage?err.response.data.statusMessage:err.message}`);
          setDelLoader(false)
          setModaloc({ ...modaloc, open: false });
        }, 2000);
        
      });
  };

  //select the snomed search value function here
  const selectInput = async (e: any) => {
    if (e.target.value.length > 2) {
      await services
        .get(
          snowmedChiefcomplaint +
          `term=${e.target.value.toLocaleString()}&state=active&semantictag=finding&acceptability=synonyms&returnlimit=1000&refsetid=null&parentid=null&fullconcept=false`
        )
        .then((res) => {
          setChiefcompdata(
            res.data.map((list: any) => ({
              ...list,
              label: list.conceptFsn,
              value: list.term,
            }))
          );
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  // pass the selected snomed value object data in the select box in map method
  const selecthandleChange = (data: any) => {
    setSnomedcomval({
      ...snomedcomval,
      opt: data,
    });
  };

  // here the delete the addComplainFeild in this function
  function onDelete(index: any, result: any): void {
    const newGridDatatable = [...gridDatatable];
    newGridDatatable.splice(index, 1);
    setGridDatatable(newGridDatatable);
    setStore(newGridDatatable.filter((list: any) => !list.opAssessmentCompLId));
  }

  // here the addComplainFeild function
  const addComplainFeild = () => {
    if (snomedcomval.opt === "") {
      toast.error("Please do not leave blank snomed val fields...");
    } else {
      setNumIncr(numIncr + 1);
      let objData: any = {
        statusFlag: 1,
        days: complainFeild.days,
        time: complainFeild.time,
        comments: complainFeild.comments,
        term: snomedcomval.opt.term,
        recordedBy: employeename,
        recorddatetime: complainFeild.recorddatetime,
        duration: `${complainFeild.days} ${complainFeild.time}`,
        id: snomedcomval.opt.id,
        cheifComplaints: snomedcomval.opt.conceptFsn,
        conceptId: snomedcomval.opt.conceptId,
        snomedData: snomedcomval.opt,
        isActive: false,
        isSave: false,
      };

      const storeData: any = [...store, objData];

      const uniqDatareslt = storeData.reduce((acc: any, ccmpl: any) => {
        let obj = acc.find(
          (c: any) =>
            c.cheifComplaints === ccmpl.cheifComplaints &&
            c.duration === ccmpl.duration &&
            c.comments === ccmpl.comments
        );
        if (obj) {
          toast.error(`you have enter  Same values again, please be awair`);

          return acc;
        } else {
          return acc.concat([ccmpl]);
        }
      }, []);

      setStore(uniqDatareslt);

      // prev val and curr val merge and unique val
      let mergPrevCurr = [...gridDatatable, ...uniqDatareslt].reduce(
        (acc: any, ccmpl: any) => {
          let obj = acc.find(
            (c: any) =>
              c.cheifComplaints === ccmpl.cheifComplaints &&
              c.duration === ccmpl.duration &&
              c.comments === ccmpl.comments
          );
          if (obj) {
            return acc;
          } else {
            return acc.concat([ccmpl]);
          }
        },
        []
      );

      setGridDatatable(mergPrevCurr);

      setComplainField({
        days: "",
        time: "",
        comments: "",
        recordedby: "",
        recorddatetime: moment().format("DD-MM-YYYY,HH:mm"),
      });
      setTimesData("Period");
      setSnomedcomval({
        opt: "",
      });
    }
  };

  const localLoginRes =
    typeof localStorage !== "undefined"
      ? JSON.parse(getLocalItem("loginResponse") ?? "")
      : null;
  const headers = {
    userId: localLoginRes?.userId,
    roleId: localLoginRes?.roleId,
    serviceEntityId: localLoginRes?.serviceEntityId,
    locationId: localLoginRes?.locationId,
    employeename: localLoginRes?.employeename,
    employeeid: localLoginRes?.employeeid,
    "Access-Control-Allow-Origin": "*",
    ContentType: "multipart/form-data",
  };
  // save the total store data in this section
  const complaintSave = async () => {
    let saveObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      recordedBy: employeename,
      statusFlag: 1,
      opAssessmentComplaintSet: store,
    };
    if (store.length > 0) {
      await services
        .create(saveOpAssessmentData, saveObj, headers)
        .then((res) => {
          toast.success("Successfully Added Chief Complaint Record");
          getTheComplainSaveData();
          setStore([]);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Currently No Any New Data Added...");
    }
  };

  // this function is used for get the duration and snomed typed value function
  const getDurationTime = async () => {
    try {
      services
        .get(getConfigData + "Duration" + "/0")
        .then((res: any) => {
          // pass the duration label and value states on select map
          const selTimes = res.data.configData.map((list: any) => {
            return {
              ...list,
              label: list.desc,
              value: list.desc,
            };
          });
          setDurationList(selTimes);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // this is for first time show period and then come the period option and select
  const [timesData, setTimesData] = useState<any>("Period");

  // when click on check box for mark in Reason for visit class added
  const getRowClassName = (params: any) => {
    return params.row.statusFlag === 0 ? "disabled-row" : "";
  };

  // get the complainsave data api
  const getTheComplainSaveData = () => {
    services
      .get(
        getOpassmentapi +
        `patientId=${patientid}&opdEncounterId=${opdEncounterId}`
      )
      .then((res: any) => {
        let getFilter = res.data
          .map((list: any) => {
            return {
              ...list,
              recordedBy: list.recordedBy,
              recorddatetime: moment(list.recordedDateAndtime).format(
                "DD-MM-YYYY,HH:mm"
              ),
              cheifComplaints: list.complientdesc,
            };
          })
          .reduce((acc: any, ccmpl: any) => {
            let obj = acc.find(
              (c: any) =>
                c.cheifComplaints === ccmpl.cheifComplaints &&
                c.duration === ccmpl.duration &&
                c.comments === ccmpl.comments
            );
            if (obj) {
              return acc;
            } else {
              return acc.concat([ccmpl]);
            }
          }, []);
        setGridDatatable(
          getFilter.map((list: any) => {
            return {
              days: list.days,
              time: list.time,
              comments: list.comments,
              term: list.term,
              recordedBy: list.recordedBy,
              recorddatetime: list.recorddatetime,
              duration: list.duration,
              id: list.id,
              cheifComplaints: list.cheifComplaints,
              conceptId: list.conceptId,
              opAssessmentCompLId: list.opAssessmentCompLId,
              statusFlag: list.statusFlag,
            };
          })
        );
      });
  };

  useEffect(() => {
    getDurationTime();
    getTheComplainSaveData();
    // Check if localStorage is defined (i.e., running on the client side)
    if (typeof window !== "undefined" && window.localStorage) {
      const loginResponse = getLocalItem("loginResponse");
      if (loginResponse) {
        const parsedResponse = JSON.parse(loginResponse);
        setEmployeename(parsedResponse.employeename);
      }
    }
  }, [employeename]);
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <div className="mb-4  md:flex gap-4">
          <div className="sm:w-full md:w-1/3 mt-2 relative">
            <div className="my-select">
              <ReactSelectBox
                value={snomedcomval.opt}
                options={chiefcompdata}
                onChange={selecthandleChange}
                isSearchable={true}
                onSearchInputChange={selectInput}
                isMultiple={false}
                label={
                  getLanData?.complaint && getLanData.complaint?.chefcomplaint
                }
              />
            </div>
          </div>
          <div className="sm:w-full lg:w-2/3 mt-2 relative ">
            <div className="sm:block md:flex gap-4 w-full">
              <div className="w-1/3 flex">
                <div className="relative flex w-full max-w-[24rem]">
                  <Input
                    type="number"
                    crossOrigin={false}
                    name="days"
                    color="blue"
                    label={
                      getLanData?.complaint && getLanData.complaint?.duration
                    }
                    value={complainFeild.days}
                    onChange={handleChange}
                    className=" !rounded-[8px] !rounded-r-none border-top focus:border-t-0"
                    containerProps={{
                      className:
                        "!min-w-0 rounded-lg  rounded-r-none !border-r-0",
                    }}
                  />
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button
                        ripple={false}
                        variant="text"
                        color="blue"
                        className="flex h-10 items-center gap-2 rounded-l-none 
                                            border border-l-0 border-blue-gray-200
                                             bg-blue-gray-500/10 pl-3 capitalize text-blue-gray-500 text-sm font-normal"
                      >
                        {/* {countryCallingCode} */}
                        {timesData}
                      </Button>
                    </MenuHandler>
                    <MenuList className="max-h-[20rem] max-w-[18rem]">
                      {durationList.map((list: any, index: number) => {
                        return (
                          <MenuItem
                            key={index}
                            value={list.value}
                            className="flex items-center gap-2 capitalize"
                            onClick={() => {
                              setTimesData(list.value);
                              setComplainField({
                                ...complainFeild,
                                time: list.label,
                              });
                            }}
                          >
                            {list.label}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                </div>
              </div>
              <div className="w-2/3 flex gap-4">
                <div className="md:w-3/4">
                  <Input
                    crossOrigin={true}
                    color="blue"
                    label={
                      getLanData?.complaint && getLanData.complaint?.comments
                    }
                    name="comments"
                    pattern="[a-zA-Z0-9]*"
                    value={complainFeild.comments}
                    onChange={(e) => setComplainField({ ...complainFeild, comments: sanitizeInput(e.target.value) })}
                    className="focus:border-t-0"
                  />

                  {errorMsg && (
                    <div className="absolute text-xs mt-1 ml-1 text-red-500">
                      {errorMsg.comments}
                    </div>
                  )}
                </div>
                <div className="md:w-1/4">
                  <ActionButton
                    buttonText={getLanData?.btn && getLanData.btn?.add}
                    // handleSubmit={handleSubmit(handleAdd)}
                    handleSubmit={addComplainFeild}
                    disabled={
                      errorMsg.comments === "" &&
                        complainFeild.comments !== "" &&
                        snomedcomval.opt !== "Chief Complaint *"
                        ? false
                        : true
                    }
                    height="h-10"
                    width="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
          {/* <DataGrid
          rows={gridDatatable}
          columns={columns}
          getRowId={() => uuidv4()}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[15]}
          // getRowClassName={getRowClassName}
          density="compact"
        // className="mostly-customized-scrollbar"
        /> */}

          <ReactDatagrid
            rows={gridDatatable}
            columns={columns}
            getRowClassName={getRowClassName}
          />
        </div>
        <div className="w-full py-5 flex justify-end">
          {props?.screenData?.Save === 1 &&
            <ActionButton
              buttonText={getLanData?.btn && getLanData.btn?.save}
              handleSubmit={handleSubmit(complaintSave)}
              width="w-[120px] py-3"
              disabled={store.length > 0 ? false : true}
            />
          }
        </div>

        {/* Dailog box */}

        <Dialog
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
            Once you Inactive this record, you cannot rollback
          </DialogBody>
          <DialogFooter className="text-center justify-center">
            <Button
              variant="gradient"
              color="blue"
              className="mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={inActiveMark}
            >
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
        </Dialog>
      </div>
    </>
  );
}

export default roleInfoScreenData(Complaint, "CPT")