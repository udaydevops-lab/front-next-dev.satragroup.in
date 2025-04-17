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
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import TimerIcon from "../triage-activity/_components/TimerIcon";
import StopTimerIcon from "../triage-activity/_components/StopTimerIcon";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { toast } from "react-toastify";

function PatientHeader(props: any) {
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const { mrn, encouterId } = useParams();
  const [patientData, setPatientData] = useState<any>();
  const [startTimer, setStartTimer] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currTime, setCurrTime] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [startTime, setStartTime] = useState<any>("");
  const [endTime, setEndTime] = useState("");
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
      // Now you can use the employeename variable
    }
  }
  const getPatientData = async () => {
    const patId = patientid !== undefined ? patientid : mrn;
    const encId = opdEncounterId !== undefined ? opdEncounterId : encouterId;
    const data = await services.get(
      getPatientDetails + patId + "/" + encId
    );
    const deportmentData: any = await services.get(getAllDepartments);

    setPatientData(data.data);
    props.setData({mobileNumber:data.data.primaryContactNum})
    setLocalItem("gender",data.data.genderDesc.toLowerCase())
    const department = deportmentData.data.filter(
      (list: any) => list.departmentCode === data.data.department
    );
    setDepartmentName(department[0].departmentDescription);
  };
  // departmentDescription

  const startTimerFun = () => {
    setTimerRunning(true);
    let obj = {
      patientId: patientid,
      activityByRole: "doctor activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 1,
      activityTransaction: "emr",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setStartTimer(false);
        props.setDisable(false);
        setStartTime(moment().format("DD-MM-YYYY HH:mm"));
        toast.success("Start time saved successfully");
        getTime();
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Technical error in saving capture time");
      });
  };
  const stopTimerFun = () => {
    setTimerRunning(false);
    setStartTimer(true);
    let obj = {
      patientId: patientid,
      activityByRole: "doctor activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 0,
      activityTransaction: "emr",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setEndTime(moment(obj.time).format("DD-MM-YYYY HH:mm"));
        toast.success("End Time Saved Successfully");
        getTime();
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Technical error in capturing end time");
      });
  };

  const getTime = () => {
    services
      .get(getActivityCaptureTime + patientid + "/" + opdEncounterId)
      .then((response) => {
        if (response.data.length > 0) {
          const filteredData = response.data.filter(
            (item: any) => item.activityByRole === "doctor activity"
          );
          if (filteredData.length > 0) {
            let data = filteredData[0];
            if (data.startTime != null && data.endTime != null) {
              setShowTimer(false);
              setStartTime(moment(data.startTime).format("DD-MM-YYYY HH:mm"));
              setEndTime(moment(data.endTime).format("DD-MM-YYYY HH:mm"));
              props.setDisable(false);
            } else if (data.startTime != null && data.endTime == null) {
              setStartTime(moment(data.startTime).format("DD-MM-YYYY HH:mm"));
              setShowTimer(true);
              setStartTimer(false);
              props.setDisable(false);
            } else {
              setShowTimer(true);
              setStartTimer(true);
              props.setDisable(true);
            }
          } else {
            setStartTimer(true);
            setShowTimer(true);
            props.setDisable(true);
          }
        } else {
          setStartTimer(true);
          setShowTimer(true);
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

          {rollDesc === "doctor" ? (
            <>
              <span>
                {showTimer ? (
                  <>
                    {startTimer ? (
                      <div
                        className="float-right"
                        title="start time"
                        onClick={startTimerFun}
                        style={{ cursor: "pointer" }}
                      >
                        <TimerIcon />
                      </div>
                    ) : (
                      <span
                        className="float-right"
                        title="end time"
                        onClick={stopTimerFun}
                        style={{ cursor: "pointer" }}
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
                <span className="float-right pe-6 ">
                  <span className="font-bold">Start time : </span> {startTime}
                </span>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* doctor info */}
      <div className="flex">
        <div className="cust-t-g2 w-full py-1 px-3 text-sm text-blue-600 rounded-lg my-2">
          <span className="capitalize">
            {patientData?.opdEncounterNo} |{" "}
            {moment(patientData?.opdEncounterTime).format("DD-MM-YYYY HH:mm")} |{" "}
            {patientData?.visitType ? patientData?.visitType : "New Visit"}{" "}
            {departmentName ? "|" : ""} {departmentName}{" "}
            {patientData?.doctor ? "|" : ""} {patientData?.doctor}
          </span>
        </div>
      </div>
    </>
  );
}

export default PatientHeader;