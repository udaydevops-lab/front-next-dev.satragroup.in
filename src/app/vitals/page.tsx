"use client";
import React, { useEffect, useRef, useState } from "react";
import DateTime from "../_common/date-time-picker";
import Input from "../_common/input";
import { useForm } from "react-hook-form";
import ControllerSelect from "../_common/select";
import Textarea from "../_common/text-area";
import moment from "moment";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import services from "../utilities/services";
import {
  getConfigData,
  getOPEmrData,
  getVitals,
  getVitalsById,
  getVitalsGraphData,
  saveOPEmr,
  saveVitals,
} from "../utilities/api-urls";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { getLocalItem, jsonParse, setLocalItem } from "../utilities/local";
import DateInput from "../_common/date-input";
import { DialogueBox } from "../_common/graph";
import BackIcon from "../_common/common_icons/back-to-home-icon";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ActionButton from "../_common/button";
import VitalsUpdate from "../../../public/pop-up/vitals-update-pop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import Select from "react-tailwindcss-select";
import TickMarkIcon from "../../../public/icons/vitals/tickMark";
import WrongIcon from "../../../public/icons/vitals/wrongMark";
import CheckboxMui from "../check-box";
import { RadioIcon } from "@heroicons/react/24/outline";
import RadioMarkIcon from "../../../public/icons/vitals/radioMark";
import Loader from "../_common/loader";
import dayjs from "dayjs";
import { capitalize } from "@mui/material";
import {
  alphaNumWithFewSymbols,
  alphaNumWithHyphen,
  passwordPattern,
} from "../utilities/validations";
import { sanitizeInput } from "../utilities/sanitizeInput";
import ReactCommonDialog from "../_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "../_commonfeatures/DeletePopupMsg";
import { PencilIcon } from "@heroicons/react/24/solid";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export interface LoginResponse {
  empImage: null | string;
  employeType: null | string;
  employeeid: number;
  employeename: string | null;
  instId: null | string;
  jwtxId: string | null;
  lastLogin: number;
  licenceExpireDate: string | null;
  locationDesc: string | null;
  locationId: number;
  refreshToken: string | null;
  roleId: number;
  rollDesc: string | null;
  serviceEntityDesc: string | null;
  serviceEntityId: number;
  statusFlag: number;
  statusMessage: string | null;
  storeName: string | null;
  token: string | null;
  userId: number;
  username: string | null;
}
export default function Vitals(props: any) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [emrId, setEmrId] = useState(null);
  const [vitalsPopup, setVitalsPopup] = useState<any>({
    popup: false,
  });
  const [id, setId] = useState(null);
  const pathParams = useParams();
  const [bpPositionList, setBpPositionList] = useState([]);
  const [bpBodySiteList, setBpBodySiteList] = useState([]);
  const [temperatureSiteList, setTemperatureSiteList] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [dateTime, setDateTime] = useState(moment());
  const [site, setSite] = useState<any>("");
  const [position, setPosition] = useState<any>("");
  const [siteLocation, setSiteLocation] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState();
  const [systolicbp, setSystolicbp] = useState<any>();
  const [dialosticBp, setDialosticBp] = useState();
  const storedData: any = JSON.parse(getLocalItem("loginResponse")!);
  const rollDesc: any = storedData?.rollDesc.toLowerCase();
  const onEdit = (id: any) => {};
  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 50 },
    {
      field: "vitalsRecordDateTime",
      headerName: "Date Time",
      width: 140,
      renderCell: (params) => (
        <>
          {params.row.vitalsRecordDateTime
            ? moment(params.row.vitalsRecordDateTime).format("DD-MM-YYYY HH:mm")
            : "---"}
        </>
      ),
    },
    {
      field: "recordedBy",
      headerName: "Recorded By",
      width: 110,
      renderCell: (params) => (
        <>{params.row.recordedBy ? capitalize(params.row.recordedBy) : "---"}</>
      ),
    },
    {
      field: "heightInCms",
      headerName: "Height(CMS)",
      width: 110,
      renderCell: (params) => (
        <>{params.row.heightInCms ? params.row.heightInCms : "---"}</>
      ),
    },
    {
      field: "weightInKgs",
      headerName: "Weight(Kgs)",
      width: 100,
      renderCell: (params) => (
        <>{params.row.weightInKgs ? params.row.weightInKgs : "---"}</>
      ),
    },
    {
      field: "systolicBp",
      headerName: "Systolic",
      width: 80,
      renderCell: (params) => (
        <>{params.row.systolicBp ? params.row.systolicBp : "---"}</>
      ),
    },
    {
      field: "dialosticBp",
      headerName: "Diastolic ",
      width: 80,
      renderCell: (params) => (
        <>{params.row.dialosticBp ? params.row.dialosticBp : "---"}</>
      ),
    },
    {
      field: "tempInCelsius",
      headerName: "Temp",
      width: 80,
      renderCell: (params) => (
        <>{params.row.tempInCelsius ? params.row.tempInCelsius : "---"}</>
      ),
    },
    {
      field: "pulse",
      headerName: "Pulse",
      width: 80,
      renderCell: (params) => (
        <>{params.row.pulse ? params.row.pulse : "---"}</>
      ),
    },
    {
      field: "spo2",
      headerName: "SPO%",
      width: 90,
      renderCell: (params) => <>{params.row.spo2 ? params.row.spo2 : "---"}</>,
    },
    {
      field: "respiratoryRate",
      headerName: "R.R ",
      width: 70,
      renderCell: (params) => (
        <>{params.row.respiratoryRate ? params.row.respiratoryRate : "---"}</>
      ),
    },
    {
      field: "reviewStatus",
      headerName: "Reviewed",
      width: 90,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => (
        <>
          {rollDesc == "doctor" ? (
            <>
              {params.row.reviewStatus == true ? (
                <div
                  title="Reviewed"
                  className="transition ease-in-out delay-150"
                >
                  <TickMarkIcon />
                </div>
              ) : (
                <div
                  title="Mark as Reviewed"
                  onClick={() => handleRadioMarkIcon(params.row.id)}
                  style={{ cursor: "pointer" }}
                >
                  <RadioMarkIcon />
                </div>
              )}
            </>
          ) : (
            <>
              {params.row.reviewStatus === true ? (
                <div title="Reviewed">
                  <TickMarkIcon />
                </div>
              ) : (
                <div title="Not Reviewed">
                  <WrongIcon />
                </div>
              )}
            </>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <>
          <button
            className="mr-3"
            onClick={() =>
              // onEdit(params.row.id)
              setVitalsPopup({ ...vitalsPopup, popup: true, data: params.row })
            }
          >
            <PencilIcon className="w-5 h-5 text-blue-500" />
            {/* <DialogueBox
              labelText="Edit"
              content={
                <VitalsUpdate
                  pathParams={pathParams}
                  data={params.row}
                  getVitalsData={getVitalsData}
                />
              }
              size="xl"
            /> */}
          </button>
        </>
      ),
    },
  ];
  const handleRadioMarkIcon = (id: any) => {
    let store = {};
    vitalData.map((item: any) => {
      if (item.id == id) {
        item.reviewStatus = true;
        store = { ...item };
      }
    });
    let postObj = {
      id: id,
      emrID: emrId,
      patientId: Number(pathParams.patientid),
      opdEncounterId: Number(pathParams.opdEncounterId),
      ...store,
    };
    services
      .create(saveVitals, [postObj])
      .then((response: any) => {
        toast.success("Marked as Reviewed!");
        getVitalsData();
        setKey((key) => key + 1);
      })
      .catch((err: any) => {
        console.log(err.message);
        toast.error("Technical Error");
      });
  };
  const getRowId = (row: any) => row.sno;
  const [employeeDetails, setEmployeeDetails] = useState<LoginResponse>({
    empImage: "",
    employeType: "",
    employeeid: 0,
    employeename: getLocalItem("loginResponse")
      ? jsonParse("loginResponse").employeename
      : null,
    instId: "",
    jwtxId: "",
    lastLogin: 0,
    licenceExpireDate: "",
    locationDesc: "",
    locationId: 0,
    refreshToken: "",
    roleId: 0,
    rollDesc: "",
    serviceEntityDesc: "",
    serviceEntityId: 0,
    statusFlag: 0,
    statusMessage: "",
    storeName: "",
    token: "",
    userId: 0,
    username: "",
  });
  const getVitalsData = () => {
    handleDateChange1(moment());
    services
      .get(getVitals + pathParams.patientid + "/" + pathParams.opdEncounterId)
      .then((response: any) => {
        response.data.map((item: any, index: number) => {
          response.data[index].sno = index + 1;
        });
        setVitalData(response.data);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  const handleDateChange1 = (date: any) => {
    setValue("vitalsRecordDateTime", date);
    setDateTime(date);
  };
  const [vitalData, setVitalData] = useState([]);
  const onSubmit = (data: any) => {
    data.snomedMap = {};
    setValue("recordedBy", employeeDetails.employeename);
    data.remarks = remarks;
    data.recordedBy = employeeDetails.employeename;
    data.vitalsRecordDateTime = moment(
      getValues().vitalsRecordDateTime
    ).valueOf();
    data.bmi = getValues().bmi ? getValues().bmi : "";
    data.weightInKgs = getValues().weightInKgs ? getValues().weightInKgs : "";
    data.heightInCms = getValues().heightInCms ? getValues().heightInCms : "";
    data.respiratoryRate = getValues().respiratoryRate
      ? getValues().respiratoryRate
      : "";
    data.pulse = getValues().pulse ? getValues().pulse : "";
    data.tempInCelsius = getValues().tempInCelsius
      ? getValues().tempInCelsius
      : "";
    data.position = position ? position.label : "";
    data.site = site ? site.label : "";
    data.siteLocation = siteLocation ? siteLocation.label : "";
    data.spo2 = getValues().spo2 ? getValues().spo2 : "";
    data.tempInFahrenheit = getValues().tempInFahrenheit
      ? getValues().tempInFahrenheit
      : "";
    data.weightInPounds = getValues().weightInPounds
      ? getValues().weightInPounds
      : "";
    data.dialosticBp = getValues().dialosticBp ? getValues().dialosticBp : "";
    data.systolicBp = getValues().systolicBp ? getValues().systolicBp : "";
    //BMI
    data.snomedMap.loincCodeBmi = getValues().bmi ? "39156-5" : "";
    data.snomedMap.loincDescBmi = getValues().bmi
      ? "Body mass index (BMI) [Ratio]"
      : "";
    //Weight
    data.snomedMap.loincCodeWeightInKgs = getValues().weightInKgs
      ? "29463-7"
      : "";
    data.snomedMap.loincDescWeightInKgs = getValues().weightInKgs
      ? "Body weight"
      : "";
    //Height
    data.snomedMap.loincCodeHeightInCms = getValues().heightInCms
      ? "8302-2"
      : "";
    data.snomedMap.loincDescHeightInCms = getValues().heightInCms
      ? "Body height"
      : "";
    //temperature
    data.snomedMap.loincCodeTempInCelcius = getValues().tempInCelsius
      ? "61008-9"
      : "";
    data.snomedMap.loincDescTempInCelcius = getValues().tempInCelsius
      ? "Body surface temperature"
      : "";
    //Respiratory rate
    data.snomedMap.loincCodeRespRate = getValues().respiratoryRate
      ? "9279-1"
      : "";
    data.snomedMap.loincDescRespRate = getValues().respiratoryRate
      ? "Respiratory rate"
      : "";
    //Heart Rate(Pulse Rate)
    data.snomedMap.loincCodePulse = getValues().pulse ? "8867-4" : "";
    data.snomedMap.loincDescPulse = getValues().pulse ? "Heart rate" : "";
    //Oxygen saturation (02 satur)
    data.snomedMap.loincCodeOxygenSaturatn = getValues().spo2 ? "2708-6" : "";
    data.snomedMap.loincDescOxygenSaturatn = getValues().spo2
      ? "Oxygen saturation in Arterial blood"
      : "";
    //Blood Pressure
    data.snomedMap.loincCodeBP = getValues().systolicBp ? "85354-9" : "";
    data.snomedMap.loincDescBP = getValues().systolicBp
      ? "Blood pressure panel with all children optional"
      : "";

    if (rollDesc == "doctor") {
      data.reviewStatus = true;
    } else {
      data.reviewStatus = false;
    }
    var postObj: { [k: string]: any } = {};
    let localEmrId: null | string = emrId;
    if (localEmrId == null) {
      postObj = {
        id: null,
        emrID: null,
        patientId: Number(pathParams.patientid),
        opdEncounterId: Number(pathParams.opdEncounterId),
        ...data,
      };
    }
    if (
      !getValues().systolicBp &&
      !getValues().bmi &&
      !getValues().dialosticBp &&
      !getValues().hcInCms &&
      !getValues().heightInCms &&
      !getValues().pulse &&
      !getValues().remarks &&
      !getValues().respiratoryRate &&
      !getValues().spo2 &&
      !getValues().tempInCelsius &&
      !getValues().tempInFahrenheit &&
      !getValues().tempInFahrenheit &&
      !getValues().weightInKgs &&
      !getValues().weightInPounds &&
      !position &&
      !site &&
      !siteLocation &&
      !remarks
    ) {
      toast.error("Please enter any one parameter");
    } else {
      setLoading(true);
      services
        .create(saveVitals, [postObj])
        .then((response: any) => {
          toast.success("Saved Successfully!");
          getVitalsData();
          handleCancel();
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error("Technical Error");
        });
    }
  };
  const handleCancel = () => {
    reset({
      heightInCms: "",
      weightInKgs: "",
      weightInPounds: "",
      bmi: "",
      hcInCms: "",
      systolicBp: "",
      dialosticBp: "",
      tempInCelsius: "",
      tempInFahrenheit: "",
      pulse: "",
      spo2: "",
      respiratoryRate: "",
      remarks: "",
    });
    setRemarks("");
    setSite(null);
    setSiteLocation(null);
    setPosition(null);
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 50,
          minRotation: 50,
        },
      },
    },
  };
  const [toDate, setToDate] = useState(moment());
  const [fromDate, setFromDate] = useState(moment());
  const [key, setKey] = useState(0);
  const handleFromDateChange = (e: any) => {
    setFromDate(e);
  };
  const handleToDateChange = (e: any) => {
    setToDate(e);
  };

  let backgroundColor = [
    {
      borderColor: "red",
      backgroundColor: "red",
      yAxisID: "y",
    },
    {
      borderColor: "blue",
      backgroundColor: "blue",
      yAxisID: "y",
    },
    {
      borderColor: "yellow",
      backgroundColor: "yellow",
      yAxisID: "y",
    },
    {
      borderColor: "black",
      backgroundColor: "black",
      yAxisID: "y",
    },
    {
      borderColor: "green",
      backgroundColor: "green",
      yAxisID: "y",
    },
    {
      borderColor: "orange",
      backgroundColor: "orange",
      yAxisID: "y",
    },
    {
      borderColor: "violet",
      backgroundColor: "violet",
      yAxisID: "y",
    },
  ];
  const myDiv: any = useRef();
  const [parameter, setParameter] = useState(null);
  const [params, setParams] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [data, setData] = useState({
    datasets: [],
    labels: [],
  });
  const getGraphData = () => {
    let postObj = {
      fromDate: moment(fromDate).format("YYYY-MM-DD"),
      toDate: moment(toDate).format("YYYY-MM-DD"),
      patientId: Number(pathParams.patientid),
    };
    services
      .create(getVitalsGraphData, postObj)
      .then((response) => {
        let obj = response.data.dataSets;
        let dataSets: any = [];
        if (params.length > 0) {
          params.map((items: any, indexes: number) => {
            obj.map((item: any, index: number) => {
              if (items.value == item.label) {
                let obj = {
                  data: item.data,
                  label: item.label,
                  ...backgroundColor[indexes],
                };
                dataSets.push(obj);
              }
            });
          });
          myDiv.current.scrollIntoView({
            behavior: "smooth",
          });
        } else {
          obj.map((item: any, index: number) => {
            let obj = {
              data: item.data,
              label: item.label,
              ...backgroundColor[index],
            };
            dataSets.push(obj);
          });
        }
        let dataSet = {
          datasets: dataSets,
          labels: response.data.labels,
        };
        setData(dataSet);
        myDiv.current.scrollIntoView({
          behavior: "smooth",
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handleViewGraph=()=>{
    getGraphData()
    handleOpen()
  }
  const handleChange = (data: any) => {
    setParameter(data);
    if (data == null) {
      setParams([]);
    } else {
      setParams(data);
    }
  };

  const handlePulseChange = (e: any) => {
    setPulse(e.target.value);
  };

  const handleChangeSys = (e: any) => {
    setSystolicbp(e.target.value);
    console.log(e.target.value);
  };

  const parameterList = [
    {
      label: "Systolic Bp",
      value: "systolicBp",
    },
    {
      label: "SPO2",
      value: "spo2",
    },
    {
      label: "Diastolic Bp",
      value: "dialosticBp",
    },
    {
      label: "Temperature(C)",
      value: "tempInCelsius",
    },
    {
      label: "Temperature(F)",
      value: "tempInFahrenheit",
    },
    {
      label: "Pulse",
      value: "pulse",
    },
    {
      label: "Respiratory Rate",
      value: "respiratoryRate",
    },
  ];
  const Bmi = () => {
    let heightValue = getValues("heightInCms");
    let weightValue = getValues("weightInKgs");
    if (
      heightValue != null &&
      weightValue != null &&
      heightValue != "" &&
      weightValue != ""
    ) {
      const bmi = (weightValue / heightValue / heightValue) * 10000;
      const bmiV = bmi.toFixed(2);
      setValue("bmi", bmiV);
    }
  };
  const cmsToFeet = (e: any) => {
    let cms = e.target.value;
    if (cms != null) {
      const inches = Math.floor((cms * 0.3937) % 12);
      const feet = Math.floor(cms * 0.0328);
      Bmi();
    }
  };
  const weightToPounds = (e: any) => {
    let weighttopound = e.target.value;
    if (weighttopound != null) {
      const weight = Math.floor(weighttopound / 0.45359237);
      const pound = weight.toFixed(2);
      setValue("weightInPounds", pound);
      Bmi();
    }
  };

  const cToF = (e: any) => {
    if (e.target.value != "") {
      setValue("tempInFahrenheit", ((+e.target.value * 9) / 5 + 32).toFixed(2));
      setValue("tempInCelsius", e.target.value);
    } else {
      setValue("tempInFahrenheit", "");
      setValue("tempInCelsius", "");
    }
  };

  const fToC = (e: any) => {
    if (e.target.value != "") {
      setValue("tempInCelsius", (((+e.target.value - 32) * 5) / 9).toFixed(2));
      setValue("tempInFahrenheit", e.target.value);
    } else {
      setValue("tempInFahrenheit", "");
      setValue("tempInCelsius", "");
    }
  };
  const handlePositionChange = (e: any) => {
    setValue("position", e);
    setPosition(e);
  };
  const handleSiteChange = (e: any) => {
    setValue("site", e);
    setSite(e);
  };
  const handleSiteLocationChange = (e: any) => {
    setValue("siteLocation", e);
  };

  useEffect(() => {
    setValue("vitalsRecordDateTime", moment());
    getVitalsData();
    services
      .get(getConfigData + "BP-Position" + "/0")
      .then((response: any) => {
        const transformedData = response.data.configData.map((item: any) => ({
          value: item.code,
          label: item.desc,
        }));
        setBpPositionList(transformedData);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    services
      .get(getConfigData + "TemperatureSite" + "/0")
      .then((response: any) => {
        const transformedData = response.data.configData.map((item: any) => ({
          value: item.code,
          label: item.desc,
        }));
        setTemperatureSiteList(transformedData);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    services
      .get(getConfigData + "BPBodysite" + "/0")
      .then((response: any) => {
        const transformedData = response.data.configData.map((item: any) => ({
          value: item.code,
          label: item.desc,
        }));
        setBpBodySiteList(transformedData);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    setEmployeeDetails(JSON.parse(getLocalItem("loginResponse")!));
  }, [props.tabVal]);

  return (
    <div className="block">
      {loading ? <Loader /> : ""}

      <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="md:flex py-2 border-b-2 border-blue-gray-50">
          <div className="md:w-2/6">
            <DateTime
              name="vitalsRecordDateTime"
              disableFuture={true}
              label="Date and Time"
              onChange={handleDateChange1}
              inputRef={register("vitalsRecordDateTime")}
              isDisabled={true}
              value={dateTime}
              slotProps={{
                actionBar: {
                  actions: ["today"],
                },
              }}
            />
          </div>
          <div className="md:w-2/6 px-3 my-2">
            <Input
              type="text"
              style={{ textTransform: "capitalize" }}
              value={employeeDetails.employeename!}
              label="Recorded By"
              name="recordedBy"
              inputRef={register("recordedBy", {
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                },
              })}
              shrink={true}
              // disabled={true}
            ></Input>
            {/* <div className="w-full">
              {employeeDetails.employeename &&
                !alphaNumWithHyphen.test(employeeDetails.employeename) && (
                  <div className="text-[11px] text-red-500">
                    Please do not enter special characters
                  </div>
                )}
            </div> */}
          </div>
          <div className="md:w-1/4 px-3 my-2"></div>
          <div className="md:w-1/4 px-3 my-2">
            <ActionButton
              buttonText="View graph"
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={handleViewGraph}
            />

            {/* <ReactCommonDialog
              open={open }
              handler={handleOpen }
              popupClose={handleOpen }
              Content={
                <DeletePopupMsg
                  btnYesFun={ }
                  btnNoFun={ }
                  content={}
                />
              }
            /> */}
            <Dialog
              size="xl"
              open={open}
              handler={handleOpen}
              className="h-5/6 overflow-y-scroll"
            >
              <DialogHeader className="font-semibold flex justify-center items-center">
                <div className="font-semibold flex justify-center items-center">
                  Vitals Graph View
                </div>
                <span
                  className="text-right font-normal text-md text-grey-500 absolute right-5 top-3 cursor-pointer"
                  onClick={handleOpen}
                >
                  X
                </span>
              </DialogHeader>
              <DialogBody className="max-h-200px">
                <>
                  <div className="grid sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-6 mt-3 ps-12">
                    <div>
                      <DateInput
                        value={fromDate}
                        label="From Date"
                        onChange={handleFromDateChange}
                        disableFuture={true}
                      />
                    </div>
                    <div>
                      <DateInput
                        value={toDate}
                        label="To Date"
                        onChange={handleToDateChange}
                        disableFuture={true}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        primaryColor="blue"
                        placeholder="Parameter"
                        onChange={handleChange}
                        value={parameter}
                        isMultiple={true}
                        options={parameterList}
                        classNames={{
                          menuButton: ({ isDisabled }: any) =>
                            `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                              duration-300 focus:outline-none 
                              
                              ${
                                isDisabled
                                  ? "bg-blue-gray-200"
                                  : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                              }`,
                          menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                          listItem: ({ isSelected }: any) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                              isSelected
                                ? `text-white bg-blue-500`
                                : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                            }`,
                        }}
                      />
                    </div>
                    <div className="flex  items-start justify-start">
                      <ActionButton
                        buttonText="Graph"
                        handleSubmit={getGraphData}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      />
                    </div>
                  </div>
                  <div tabIndex={-1} ref={myDiv}>
                    <Line options={options} data={data} />
                  </div>
                </>
              </DialogBody>
            </Dialog>
          </div>
        </div>
        <p className="text-black-500 flex items-center justify-center lg:justify-start font-bold mx-1 text-sm mb-2 mt-3">
          Body Measurement
        </p>
        <div key={key} className=" ">
          <div className="">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-3">
              <div className=" ">
                <Input
                  type="number"
                  name="heightInCms"
                  label="Height(in CMS)"
                  watch={watch}
                  disabled={props.disable}
                  inputRef={register("heightInCms", {
                    onChange: (e: any) => {
                      cmsToFeet(e);
                    },
                  })}
                ></Input>
              </div>
              <div className="">
                <Input
                  type="number"
                  name="weightInKgs"
                  label="Weight(in KGS)"
                  watch={watch}
                  disabled={props.disable}
                  inputRef={register("weightInKgs", {
                    onChange: (e: any) => {
                      weightToPounds(e);
                    },
                  })}
                ></Input>
              </div>
              <div>
                <Input
                  type="number"
                  name="weightInPounds"
                  label="Weight(in Pounds)"
                  watch={watch}
                  disabled={props.disable}
                  inputRef={register("weightInPounds")}
                ></Input>
              </div>
              <div className="">
                <Input
                  type="number"
                  name="bmi"
                  label="BMI"
                  watch={watch}
                  disabled={props.disable}
                  inputRef={register("bmi")}
                ></Input>
              </div>
              <div>
                <Input
                  type="number"
                  name="hcInCms"
                  label="HC in cm's"
                  watch={watch}
                  disabled={props.disable}
                  inputRef={register("hcInCms")}
                ></Input>
              </div>
            </div>
            <p className="text-black-500 flex items-center justify-center lg:justify-start my-3 font-bold text-sm">
              Blood Pressure
            </p>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-3">
              <div className="">
                <Input
                  type="text"
                  name="systolicBp"
                  label="Systolic (MmgHg)"
                  pattern="[a-zA-Z0-9]*"
                  watch={watch}
                  value={systolicbp}
                  disabled={props.disable}
                  inputRef={register("systolicBp", {
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  handleChange={handleChangeSys}
                ></Input>
                <div className="w-full">
                  {systolicbp && !alphaNumWithFewSymbols.test(systolicbp) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Input
                  type="text"
                  name="dialosticBp"
                  label="Diastolic (Mmhg)"
                  watch={watch}
                  value={dialosticBp}
                  disabled={props.disable}
                  pattern="[a-zA-Z0-9]*"
                  handleChange={(e: any) => {
                    setDialosticBp(e.target.value);
                  }}
                  inputRef={register("dialosticBp", {
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                ></Input>
                <div className="w-full">
                  {dialosticBp && !alphaNumWithFewSymbols.test(dialosticBp) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <Select
                  primaryColor="blue"
                  placeholder="Position"
                  onChange={(e: any) => {
                    setPosition(e);
                    handlePositionChange(e);
                  }}
                  isDisabled={props.disable}
                  value={position}
                  options={bpPositionList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                            duration-300 focus:outline-none h-[39px]
                                           
                                            ${
                                              isDisabled
                                                ? "bg-blue-gray-200"
                                                : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                            }`,
                    menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                        isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${
                    position?.label !== undefined
                      ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                      : "text-sm opacity-0 top-10"
                  } 
                                                                                truncate 
                                                                                cursor-default 
                                                                                select-none  
                                                                                absolute transition-all
                                                                               `}
                >
                  Position
                </label>
              </div>
              <div className="relative">
                <Select
                  primaryColor="blue"
                  placeholder="Site"
                  onChange={(e: any) => {
                    setSite(e);
                    handleSiteChange(e);
                  }}
                  isDisabled={props.disable}
                  value={site}
                  options={bpBodySiteList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                            duration-300 focus:outline-none h-[39px]
                                           
                                            ${
                                              isDisabled
                                                ? "bg-blue-gray-200"
                                                : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                            }`,
                    menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                        isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${
                    site?.label !== undefined
                      ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                      : "text-sm opacity-0 top-10"
                  } 
                                                                                truncate 
                                                                                cursor-default 
                                                                                select-none  
                                                                                absolute transition-all
                                                                               `}
                >
                  Site
                </label>
              </div>
            </div>
            <p className="text-black-500 flex items-center justify-center my-3 lg:justify-start font-bold text-sm">
              Temperature
            </p>
            <div className="xl:flex lg:flex  mt-1">
              <div className="xl:w-3/4 lg:w-3/4 ">
                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-3 mt-1">
                  <div className="">
                    <Input
                      type="number"
                      name="tempInCelsius"
                      label="0 C"
                      watch={watch}
                      disabled={props.disable}
                      inputRef={register("tempInCelsius", {
                        onChange: (e: any) => {
                          cToF(e);
                        },
                      })}
                    ></Input>
                  </div>
                  <div>
                    <Input
                      type="number"
                      name="tempInFahrenheit"
                      label="0 F"
                      watch={watch}
                      disabled={props.disable}
                      inputRef={register("tempInFahrenheit", {
                        onChange: (e: any) => {
                          fToC(e);
                        },
                      })}
                    ></Input>
                  </div>
                  <div className="relative my-select">
                    <Select
                      primaryColor="blue"
                      placeholder="Site Location"
                      onChange={(e: any) => {
                        setSiteLocation(e);
                        handleSiteLocationChange(e);
                      }}
                      isDisabled={props.disable}
                      value={siteLocation}
                      options={temperatureSiteList}
                      classNames={{
                        menuButton: ({ isDisabled }: any) =>
                          `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                    duration-300 focus:outline-none h-[39px]
                                                   
                                                    ${
                                                      isDisabled
                                                        ? "bg-blue-gray-200"
                                                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                    }`,
                        menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                        listItem: ({ isSelected }: any) =>
                          `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                            isSelected
                              ? `text-white bg-blue-500`
                              : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                          }`,
                      }}
                    />
                    <label
                      style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                      className={`${
                        siteLocation?.label !== undefined
                          ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                          : "text-sm opacity-0 top-10"
                      } 
                                                                                        truncate 
                                                                                        cursor-default 
                                                                                        select-none  
                                                                                        absolute transition-all
                                                                                       `}
                    >
                      Site Location
                    </label>
                  </div>
                  <div className="">
                    <Input
                      type="number"
                      name="pulse"
                      label="Pulse(bpm)"
                      watch={watch}
                      value={pulse}
                      disabled={props.disable}
                      inputRef={register("pulse")}
                      handleChange={handlePulseChange}
                    ></Input>
                  </div>

                  <div>
                    <Input
                      type="number"
                      name="spo2"
                      label="spO2%"
                      watch={watch}
                      disabled={props.disable}
                      inputRef={register("spo2")}
                    ></Input>
                  </div>
                  <div className="">
                    <Input
                      type="number"
                      name="respiratoryRate"
                      label="Respiratory Rate"
                      watch={watch}
                      disabled={props.disable}
                      inputRef={register("respiratoryRate")}
                    ></Input>
                  </div>
                </div>
              </div>
              <div>
                <div className="xl:ps-6 xl:mt-0 lg:mt-0 lg:ps-6 sm:mt-6 xxs:mt-6 sm:gap-y-6 md:mt-6 w-full cust-textarea -ml-3">
                  <Textarea
                    minRows={20}
                    label="Remarks"
                    name="remarks"
                    value={remarks}
                    disabled={props.disable}
                    onChange={(e: any) =>
                      setRemarks(sanitizeInput(e.target.value))
                    }
                    inputRef={register("remarks")}
                  ></Textarea>
                </div>
              </div>
            </div>
          </div>

          {/* text area start */}

          {/* text area end */}
        </div>
        <div className="flex justify-end py-3">
          <div className="mr-3">
            <ActionButton
              buttonText="Save"
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={handleSubmit(onSubmit)}
            />
          </div>
          <div>
            <ActionButton
              buttonText="Reset"
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={handleSubmit(handleCancel)}
            />
          </div>
        </div>
      </div>

      <div className="px-4 bg-white rounded-curve md:pt-4 py-4 my-4 rounded-curve mx-auto w-full border border-stroke">
        <DataGrid
          autoHeight
          rows={vitalData}
          columns={columns}
          getRowId={getRowId}
          pageSizeOptions={[10, 30, 50, 100]}
          checkboxSelection={false}
          slots={{ toolbar: null }}
        />
      </div>

      <ReactCommonDialog
        open={vitalsPopup.popup}
        handler={() => {
          setVitalsPopup({ ...vitalsPopup, popup: false });
        }}
        popupClose={() => {
          setVitalsPopup({ ...vitalsPopup, popup: false });
        }}
        Content={
          <VitalsUpdate
            pathParams={pathParams}
            data={vitalsPopup.data}
            getVitalsData={getVitalsData}
          />
        }
        dialogtitle="Vitals Entry"
        size="xl"
        
      />
    </div>
  );
}