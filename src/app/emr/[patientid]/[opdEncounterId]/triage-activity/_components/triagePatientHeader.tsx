"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import services from "@/app/utilities/services";
import {
  getActivityCaptureTime,
  getAllDepartments,
  getPatientDetails,
  timer,
} from "@/app/utilities/api-urls";
import moment from "moment";
import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
} from "@/app/utilities/local";
import TimerIcon from "../../triage-activity/_components/TimerIcon";
import StopTimerIcon from "../../triage-activity/_components/StopTimerIcon";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ActionButton from "@/app/_common/button";
import { toast } from "react-toastify";
import PatientHeader from "../../_components/patient-header";

function TriagePatientHeader(props: any) {
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const [patientData, setPatientData] = useState<any>();
  const [startTimer, setStartTimer] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currTime, setCurrTime] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [startTime, setStartTime] = useState<any>("");
  const [endTime, setEndTime] = useState("");
  const [isEmrIdPresent, setIsEmrIdPresent] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const storedData: any = JSON.parse(getLocalItem("loginResponse")!);
  const rollDesc: any = storedData?.rollDesc.toLowerCase();
  const pathname = usePathname();
  const { setMenuStatus } = PatientDatadataAuth();
  var loginResponseJson = getLocalItem("loginResponse");
  if (loginResponseJson !== null) {
    var loginResponse = JSON.parse(loginResponseJson);
    if (loginResponse && loginResponse.employeename) {
      var employeename = loginResponse.employeename;
    }
  }

  const getPatientData = async () => {
    const data = await services.get(
      getPatientDetails + patientid + "/" + opdEncounterId
    );
    const deportmentData: any = await services.get(getAllDepartments);

    setPatientData(data.data);
    const department = deportmentData.data.filter(
      (list: any) => list.departmentCode === data.data.department
    );
    setDepartmentName(department[0].departmentDescription);
  };
  const startTimerFun = () => {
    setMenuStatus(true);
    setTimerRunning(true);
    let obj = {
      patientId: patientid,
      activityByRole: "nurse activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 1,
      activityTransaction: "triage",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setStartTimer(false);
        setStartTime(moment(obj.time).format("YYYY-MM-DD HH:mm"));
        props.setDisable(false);
        getTime();
        toast.success("Start time saved successfully");
      })
      .catch((error) => {
        toast.error("Technical error in saving capture time");
      });
  };
  const stopTimerFun = () => {
    setTimerRunning(false);
    let obj = {
      patientId: patientid,
      activityByRole: "nurse activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 0,
      activityTransaction: "triage",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setEndTime(moment(obj.time).format("YYYY-MM-DD HH:mm:ss.SSS"));
        toast.success("Capture Time Saved Successfully");
        getTime();
      })
      .catch((err) => {
        toast.error("Technical error capturing end time");
      });
  };
  const getTime = () => {
    services
      .get(getActivityCaptureTime + patientid + "/" + opdEncounterId)
      .then((response) => {
        if (response.data.length > 0) {
          const filteredData = response.data.filter(
            (item: any) => item.activityByRole == "nurse activity"
          );
          if (filteredData.length > 0) {
            let data = filteredData[0];
            if (data.startTime != null && data.endTime != null) {
              setIsEmrIdPresent(true);
              setStartTime(moment(data.startTime).format("YYYY-MM-DD HH:mm"));
              setEndTime(moment(data.endTime).format("YYYY-MM-DD HH:mm"));
              props.setDisable(false);
            } else if (data.startTime != null && data.endTime == null) {
              setStartTime(moment(data.startTime).format("YYYY-MM-DD HH:mm"));
              setIsEmrIdPresent(false);
              setStartTimer(false);
              props.setDisable(false);
            }
          } else {
            setIsEmrIdPresent(false);
            setStartTimer(true);
            props.setDisable(true);
          }
        } else {
          setStartTimer(true);
          setIsEmrIdPresent(false);
          props.setDisable(true);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  useEffect(() => {
    getPatientData();
    getTime();
  }, []);

  if (rollDesc == "doctor") {
    props.setDisable(false);
    return <PatientHeader setDisable={props.setDisable} />;
  } else {
    return (
      <>
        {/* Patient info */}
        <div className="flex">
          <div className="cust-t-g1 w-full py-1 px-3 text-sm text-blue-600 rounded-lg ">
            <span className="capitalize">
              {patientData?.middleName} | {patientData?.mrn} |{" "}
              {patientData?.genderDesc} | {patientData?.ageOfPatient}{" "}
              {patientData?.healthId ? "|" : ""} {patientData?.healthId}{" "}
              {patientData?.abhaAddress ? "|" : ""} {patientData?.abhaAddress}
            </span>
            {rollDesc == props.rollDesc ? (
              <>
                <span>
                  {!isEmrIdPresent ? (
                    <>
                      {startTimer ? (
                        <div
                          className="float-right"
                          onClick={startTimerFun}
                          style={{ cursor: "pointer" }}
                          title="Start Time"
                        >
                          <TimerIcon />
                        </div>
                      ) : (
                        <span
                          className="float-right"
                          onClick={stopTimerFun}
                          style={{ cursor: "pointer" }}
                          title="End Time"
                        >
                          <div className="timer-icon">
                            <StopTimerIcon />
                          </div>
                        </span>
                      )}
                    </>
                  ) : null}
                </span>
                {endTime.length > 0 ? (
                  <span className="float-right pe-6">
                    <span className="font-bold">End time :</span> {endTime}
                  </span>
                ) : null}
                {startTime && startTime.length > 0 ? (
                  <span className="float-right pe-6">
                    <span className="font-bold">Start time : </span> {startTime}
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
        <div></div>
        {/* doctor info */}
        <div className="flex">
          <div className="cust-t-g2 w-full py-1 px-3 text-sm text-blue-600 rounded-lg my-2">
            <span className="capitalize">
              {patientData?.opdEncounterNo} |{" "}
              {moment(patientData?.opdEncounterTime).format("DD-MM-YYYY HH:mm")}{" "}
              | {patientData?.visitType ? patientData?.visitType : "New Visit"}{" "}
              {departmentName ? "|" : ""} {departmentName}{" "}
              {patientData?.doctor ? "|" : ""} {patientData?.doctor}
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default TriagePatientHeader;
