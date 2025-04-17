"use client";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useState, useEffect, Fragment } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DialogueBox } from "@/app/_common/graph";
import ConsentRequestForm from "../consent-request-form/page";
import ReportData from "../report-data/page";
import {
  getAllConsentList,
  deleteConsentRecord,
  hlthInfconsentRequest,
  consentView,
  getHipDataByconsentId,
} from "@/app/utilities/api-urls";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  Button,
} from "@material-tailwind/react";
import services from "@/app/utilities/services";
import moment from "moment";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import dayjs from "dayjs";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ActionButton from "@/app/_common/button";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import { initialConsentData } from "./_components/utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loader from "@/app/_common/loader";
import Title from "@/app/_common/title";
import { Tooltip } from "@mui/material";
import { ArrowDownTrayIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ConsentRequestFormNew from "../consent-request-form-new/page";
import NewReportData from "../new-report-data/page";
import { Transition } from "@headlessui/react";
import { getContentWithoutBorders } from "../consent-request-form-new/_components/utils";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function NewConsentRequest(props: any) {
  const [consetListData, setConsetListData] = useState<any>([]);
  const { selectHeaderDate } = PatientDatadataAuth();
  const [modaloc, setModaloc] = useState<any>({
    open: false,
    contextViewpop: false,
    newContexform: false,
  });
  const [formTitle, setFormTitle] = useState("Consent Request Form");
  const [loading, setLoading] = useState(false);
  const [consentResData, setConsentResData] = useState<any>(initialConsentData);
  const [reRender, setReRender] = useState(false);
  const [type, setType] = useState("save");
  const initialFormData = {
    purpose: "",
    healthId: "",
    hiTypes: [],
    dateRangeFrom: moment(),
    dateRangeTo: moment(),
    dateErraiseAt: null,
    updatedDateRangeFrom: null,
    updatedDateRangeTo: null,
    updatedDateErraiseAt: null
  };
  const [filters, setFilters] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    purpose: "",
    healthId: "",
    hiTypes: [],
    updatedHiTypes: [],
    dateRangeFrom: null,
    dateRangeTo: null,
    dateErraiseAt: null,
    updatedDateRangeFrom: null,
    updatedDateRangeTo: null,
    updatedDateErraiseAt: null
  });
  const handleFilters = (data: any) => {
    data.updatedHiTypes = data.updatedHiTypes ? data.updatedHiTypes : [];
    let arr: any = [];
    if (data.updatedHiTypes && data.updatedHiTypes.length > 0) {
      data.updatedHiTypes.map((item: any) => {
        if (item == "DiagnosticReport") {
          arr.push("diagnostic");
        }
        if (item == "DischargeSummary") {
          arr.push("discharge");
        }
        if (item == "HealthDocumentRecord") {
          arr.push("health");
          arr.push("artifact");
          arr.push("record artifact");
        }
        if (item == "ImmunizationRecord") {
          arr.push("immunization");
        }
        if (item == "OPConsultation") {
          arr.push("consultation");
        }
        if (item == "Prescription") {
          arr.push("prescription");
        }
        if (item == "WellnessRecord") {
          arr.push("wellness");
        }
      });
    }
    return arr;
  };
  const handleAddressClick = (data: any) => {
    setType("view");
    setFormTitle("Consent Request");
    data.purpose = {
      value: "CAREMGT",
      label: "Care Management",
    };
    data.healthId = data.healthId.replace("@sbx", "");
    data.hiTypes = data.hiTypes ? data.hiTypes : [];
    data.updatedHiTypes = data.updatedHiTypes ? data.updatedHiTypes : [];
    setFormData(data);
    setModaloc({
      ...modaloc,
      newContexform: true,
    });
  };
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 50,
      renderCell: (params: any) => {
        const rowNumber = consetListData.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    // { field: "consentId", headerName: "Consent ID", width: 120,renderCell: (params: any) => (
    //   <div className="underline cursor-pointer text-[#0000FF]">{params.row.consentId === null ? "" : params.row.consentId}</div>
    // ), },
    {
      field: "healthId",
      headerName: "ABHA Address",
      width: 150,
      renderCell: (params: any) => (
        <div
          onClick={() => handleAddressClick(params.row)}
          className="underline cursor-pointer text-[#0000FF]"
        >
          {params.row.healthId === null ? "" : params.row.healthId}
        </div>
      ),
    },
    {
      field: "consentStatus",
      headerName: "Request Status",
      width: 120,
      renderCell: (params: any) => (
        <>{params.row.consentStatus === null ? "" : params.row.consentStatus}</>
      ),
    },
    {
      field: "createdDate",
      headerName: "Consent Created On",
      width: 150,
      renderCell: (params: any) => (
        <>
          {params.row.createdDate &&
            moment(params.row.createdDate).format("DD-MM-YYYY HH:mm")}
        </>
      ),
    },
    {
      field: "consentGrantedOn",
      headerName: "Consent Granted On",
      width: 160,
      renderCell: (params: any) => (
        <>
          {params.row.consentGrantedOn &&
            moment(params.row.consentGrantedOn).format("DD-MM-YYYY HH:mm")}
        </>
      ),
    },
    {
      field: "consentRevokeOn",
      headerName: "Consent Revoked On",
      width: 150,
      renderCell: (params: any) => (
        <>
          {params.row.consentRevokeOn &&
            moment(params.row.consentRevokeOn).format("DD-MM-YYYY HH:mm")}
        </>
      ),
    },
    {
      field: "consentDeniedOn",
      headerName: "Consent Denied On",
      width: 140,
      renderCell: (params: any) => (
        <>
          {params.row.consentDeniedOn &&
            moment(params.row.consentDeniedOn).format("DD-MM-YYYY HH:mm")}
        </>
      ),
    },
    {
      field: "dateErraiseAt",
      headerName: "Consent Expiry On",
      width: 140,
      renderCell: (params: any) => (
        <>
          {params.row.dateErraiseAt &&
            moment(params.row.dateErraiseAt).format("DD-MM-YYYY HH:mm")}
        </>
      ),
    },
    {
      field: "fetchData",
      headerName: "View",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div
          className={`${params.row.consentStatus === "GRANTED"
            ? ""
            : " hover:cursor-not-allowed"
            }`}
        >
          {/* <ActionButton
          disabled={params.row.consentStatus === "GRANTED"?false:true}
            buttonText="Download data"
            width="w-2/3 text-white  text-[11px] h-[30px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9] px-4"
            handleSubmit={() =>
              handleFetchData(params.row.consentKeyHolder, params.row.consentId)
            }
          /> */}
          <Tooltip placement="right" title="View">
            <EyeIcon
              className={`w-5 h-5 ${params.row.consentStatus === "GRANTED"
                ? "cursor-pointer text-blue-700"
                : "pointer-events-none !cursor-not-allowed  text-blue-100"
                }`}
              onClick={() => {
                setAbhaAdress(params.row.healthId)
                setHipsInfo([])
                getAllHipsByconsentId(params.row.consentRequestId)
              }
                // setOpen(true)
                // getCosentDatabyid(
                //   params.row.consentKeyHolder,
                //   params.row.consentId,
                //   params.row
                // )
              }
            />
          </Tooltip>
        </div>
      ),
    },
    // {
    //   field: "showData",
    //   headerName: "Actions",
    //   width: 100,
    //   renderCell: (params: any) => (
    //     <>
    //       {params.row.consentStatus === "GRANTED" ? (
    //         <>
    //           {/* <DialogueBox
    //                             className={"items-center text-xs"}
    //                             label={"View"}
    //                             size={"xl"}
    //                             btnsize="5px"
    //                             buttonColor="blue"
    //                             classNameDialogue="h-[30rem] overflow-scroll "
    //                             content={<ReportData data={params.row} />}
    //                         /> */}
    //           <ActionButton
    //             buttonText="VIEW"
    //             disabled={params.row.disabled}
    //             width="w-auto text-white  text-[12px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
    //             handleSubmit={() => {
    //               console.log(params.row);
    //               setModaloc({
    //                 ...modaloc,
    //                 contextViewpop: true,
    //               });

    //             //   getCosentDatabyid(params.row.consentId);
    //             }}
    //           />
    //         </>
    //       ) : (
    //         <>
    //           <ActionButton
    //             buttonText="VIEW"
    //             disabled={true}
    //             width="w-auto text-white  text-[12px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
    //           />
    //           {/* <button className="px-5 py-2 bg-blue-gray-300 cursor-not-allowed rounded-lg mt-2 mb-2 text-white">
    //                             VIEW
    //                         </button> */}
    //         </>
    //       )}
    //     </>
    //   ),
    // },
    {
      field: "delete",
      headerName: "Delete",
      width: 60,
      renderCell: (params: any) => (
        <>
          {props?.screenData.Delete === 1 ?
            <button>
              <TrashIcon
                // onClick={() => deleteRecord(params.row.consentId)}
                onClick={() =>
                  setModaloc({ ...modaloc, open: true, id: params.row.consentId })
                }
                className="w-5 h-5 text-red-500"
              />
            </button>
            : null
          }
        </>
      ),
    },
    // {
    //   field: "hipName",
    //   headerName: "Entity Name",
    //   width: 100,

    // },
  ];
  const [abhaAdress, setAbhaAdress] = useState("")
  const getDate: any = dayjs(selectHeaderDate).format("YYYY-MM-DD");

  // get the consent save data
  const getConsentResult = async () => {
    setLoading(true);
    await services
      .get(getAllConsentList + getDate) //moment().subtract(2, 'days').format("YYYY-MM-DD"))
      .then((response: any) => {
        setLoading(false);
        // let ConsentGrantedData = response.data.filter(
        //   (data: any) =>
        //     data.consent_status === "GRANTED" || "DENIED" || "REVOKED"
        // );
        const ConsentDataWithSno = response.data;
        setConsetListData(ConsentDataWithSno);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        toast.error("Error fetching data, please try again");
      });
  };

  // delete the consent data
  const deleteRecord = () => {
    // setModaloc({ ...modaloc, open: true, id: params.row.consentId })
    services
      .get(deleteConsentRecord + modaloc.id)
      .then((response: any) => {
        toast.success(`${modaloc.id} - Deleted Successfully`);
        setModaloc({ ...modaloc, open: false });
        getConsentResult();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };
  // getCosentDatabyid
  let count = 0;
  const getCosentDatabyid = (val: any, consentId: any, data: any) => {
    setLoading(true);
    services
      .get(consentView + `${consentId}`)
      .then((res: any) => {
        if (res.data.length > 0) {
          let filters: any = handleFilters(data);
          let arr: any = [];
          filters.map((item: any) => {
            res.data.map((item1: any) => {
              if (item1.title) {
                if (item1.title.toLowerCase().includes(item)) {
                  arr.push(item1);
                }
              } else if (item1.title == null) {
                arr.push(item1);
              }
            });
          });
          setConsentResData(arr);
          setModaloc({
            ...modaloc,
            contextViewpop: true,
          });
        } else if (count < 1) {
          count++;
          handleFetchData(val, consentId, data);
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000)
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data?.statusMessage) {
          toast.error(
            `${JSON.parse(error.response.data.statusMessage).code} ${JSON.parse(error.response.data.statusMessage).message
            }`
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  // save the consent data
  const handleFetchData = (val: any, consentId: any, data: any) => {
    let postObj = {
      consentKeyHolder: val,
      consentId: data.consentId,
    };
    setLoading(true);
    setConsentResData([]);
    services
      .create(hlthInfconsentRequest, postObj)
      .then((response: any) => {
        getCosentDatabyid(val, consentId, data);
        // getConsentResult();
        if (response.data.saveId) {
          toast.success("Data requested from HIU or HIP");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.log(error.message);
        if (error.response.data.statusMessage) {
          toast.error(error.response.data.statusMessage)
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };

  const [open, setOpen] = useState(false);
  const [hipsInfo, setHipsInfo] = useState<any>([])
  const getAllHipsByconsentId = (consentRequestId: any) => {
    setLoading(true)
    setOpen(true)
    services.get(getHipDataByconsentId + consentRequestId).then((response) => {
      if (Array.isArray(response.data)) {
        setHipsInfo(response.data)
      }
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
      setHipsInfo([])
    })
  }

  useEffect(() => {
    getConsentResult();
  }, [getDate, reRender]);

  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }

  return (
    <>
      <div className={props?.screenData.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
          <div className="font-semibold mt-4 ms-4">
            Health Consent Request
          </div>

          <div className="min-h-full rounded-curve border border-stroke bg-white p-4 mb-3 mt-4">
            {loading ? <Loader /> : ""}
            <div className="flex gap-4 justify-end">
              <ActionButton
                buttonText="New Consent Request"
                width="w-auto text-white  text-[12px] h-[38px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={() => {
                  setType("save");
                  setFormTitle("Consent Request Form");
                  setFormData(initialFormData);
                  setModaloc({
                    ...modaloc,
                    newContexform: true,
                  });
                }}
              />
              <ActionButton
                buttonText={
                  <Tooltip placement="top" title={"Refresh data"}>
                    <RefreshIcon />
                  </Tooltip>
                }
                width="w-auto text-white  text-[12px] h-[38px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setReRender(!reRender);
                  }, 10000);
                }}
              />
              {/* <DialogueBox
                        label="New Consent Request"
                        content={<ConsentRequestForm />}
                        size={"xl"}
                        btnsize={"sm"}
                        buttonColor="blue"
                        className="py-3 text-center flex justify-center"
                    /> */}
            </div>
            <div className="mt-4 ">
              <ReactDatagrid rows={consetListData} columns={columns} />
            </div>

            {/*
                ========= Delete Section Alert Popup ==========
            */}

            <Dialog
              open={modaloc.open}
              handler={() => setModaloc({ ...modaloc, open: false })}
              size={"xs"}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
              }}
              className="py-5 max-w-[430px]"
            >
              <DialogHeader className=" justify-center">
                <div className="w-100">
                  <div className="text-center text-[20px] text-blue-500">
                    Are you sure,
                  </div>
                  <div className="text-center text-[20px] text-blue-500">
                    Do you want to Delete this Service?
                  </div>
                  {/* {loader ? <>
                            <div className='text-center w-full'>
                                <div className='loader inline-block'></div>
                                <p className='text-center'>Processing...</p>
                            </div>

                        </> : <>

                        </>} */}
                </div>
              </DialogHeader>
              <DialogFooter className="text-center justify-center">
                <Button
                  variant="gradient"
                  color="blue"
                  className="mr-2 bg-blue-500 hover:bg-blue-600"
                  onClick={deleteRecord}
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

          {/**New context form */}
          <ReactCommonDialog
            open={modaloc.newContexform}
            size={"xl"}
            dialogtitle={formTitle}
            handler={() => { }}
            popupClose={() =>
              setModaloc({
                ...modaloc,
                newContexform: false,
              })
            }
            Content={
              // <ConsentRequestForm
              //   type={type}
              //   formData={formData}
              //   getConsentResult={getConsentResult}
              // />
              <ConsentRequestFormNew
                type={type}
                formData={formData}
                getConsentResult={getConsentResult}
                setModaloc={setModaloc}
                modaloc={modaloc}
              />
            }
          // contextViewpop
          />

          {/**view consent */}

          <Transition.Root className={"!z-10"} show={open} as="div">

            <Dialog
              open={open}
              title=""
              className="relative z-50"
              handler={() => setOpen}
            >
              <>
                {loading ? <Loader /> : ""}
                <Transition.Child
                  as={"div"}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className=" fixed inset-y-0 right-0 flex max-w-full pl-10">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <div className="flex h-full flex-col bg-white shadow-xl">
                          <div className="flex-1 overflow-x-hidden overflow-y-scroll sm:px-4">
                            <div className="sticky flex items-start justify-between mt-4 shrink-0 p-4  bg  !bg-[#006AC9] text-white antialiased font-sans text-2xl font-semibold leading-snug mb-0 " onClick={() => setOpen(false)}>
                              Consent List
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className="relative p-2 text-gray-400 hover:text-gray-500"
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="absolute -inset-0.5 z-50">
                                    <XMarkIcon className="w-6 h-6 " />
                                  </span>
                                </button>
                              </div>
                            </div>
                            <div className="mt-5 ms-2">
                              <span className="font-semibold">ABHA Address :</span> {abhaAdress}
                            </div>
                            <hr />
                            <div className="mt-5">
                              {hipsInfo?.map((item: any, index: number) => {
                                return (<div key={index} className="mt-4">
                                  {getContentWithoutBorders({
                                    consentId: item.consentId,
                                    hipName: item.hipName,
                                    status: item.status,
                                  })}
                                  <div className="relative -right-60 bottom-8">
                                    <ActionButton
                                      buttonText={"View"}
                                      disabled={item.status != "GRANTED"}
                                      width="flex justify-center items-center w-[50px] text-white  text-[12px] h-[28px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                      handleSubmit={() => {
                                        getCosentDatabyid(
                                          item.consentKeyHolder,
                                          item.consentId,
                                          item
                                        )
                                      }}
                                    />
                                  </div>
                                  <hr />
                                </div>)
                              })}
                            </div>
                            <ReactCommonDialog
                              open={modaloc.contextViewpop}
                              size={"xl"}
                              handler={() => {
                                setModaloc({
                                  ...modaloc,
                                  contextViewpop: false,
                                });
                              }}
                              popupClose={() => {
                                setModaloc({
                                  ...modaloc,
                                  contextViewpop: false,
                                });
                              }}
                              Content={<NewReportData data={consentResData} />}
                            // contextViewpop
                            />
                          </div>
                        </div>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </>
            </Dialog>
          </Transition.Root>
        </div>
      </div>
    </>
  );
}

export default roleInfoScreenData(NewConsentRequest, "Hc")