import { getConfigData } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { capitalize } from "@mui/material";
import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";

export const initialFormData = {
  patientData: {
    patientId:"",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: moment().format("YYYY/MM/DD"),
    ageOfPatient: "",
    gender: "",
    mobile: "",
    mrn:'',
    opdEncounterNumber:'',
    mrnSelect:''
  },
  physicianDetails: {
    resourceType: "",
    department: "",
    resource: "",
    priority: "",
    status: "",
    appointmentType: "New",
  },
};

export const getSlotTiming = (startTime: any, endTime: any, interval = 15) => {
  const slots = [];
  // Parse the start and end time into hours and minutes
  let [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Ensure that the start time is before the end time
  while (
    startHours < endHours ||
    (startHours === endHours && startMinutes <= endMinutes)
  ) {
    // Format the time as HH:MM and push to slots array
    let formattedTime = `${String(startHours).padStart(2, "0")}:${String(
      startMinutes
    ).padStart(2, "0")}`;
    slots.push(formattedTime);
    // Add interval (e.g., 30 minutes)
    startMinutes += interval;
    if (startMinutes >= 60) {
      startMinutes -= 60;
      startHours++;
    }
  }
  return slots;
};

export const getMasterData = (def: string, setState: any) => {
  services
    .get(getConfigData + def + "/0")
    .then((response) => {
      setState(response.data.configData);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const checkTimeAvailability = (unavailableTimes: any, time: any) => {
  const [targetHours, targetMinutes] = time.split(":").map(Number);
  const [startHours, startMinutes] = unavailableTimes.fromTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes] = unavailableTimes.toTime.split(":").map(Number);

  const target = targetHours * 60 + targetMinutes;
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;

  if (start <= end) {
    return target >= start && target <= end;
  } else {
    // Handles overnight cases (e.g., 10:00 PM - 5:00 AM)
    return target >= start || target <= end;
  }
};
export const isDateBetween = (
  targetDate: any,
  time: any,
  unavailableTimes: any
) => {
  // Convert target date (YYYY-MM-DD) to a Unix timestamp (milliseconds)
  const targetUnix = new Date(targetDate).getTime();

  // If start and end timestamps are the same, target must match exactly
  if (unavailableTimes.fromDate === unavailableTimes.toDate) {
    if (targetUnix === unavailableTimes.fromDate) {
      return checkTimeAvailability(unavailableTimes, time);
    } else {
      return false;
    }
  }
  if (
    targetUnix >= unavailableTimes.fromDate &&
    targetUnix <= unavailableTimes.toDate
  ) {
    return checkTimeAvailability(unavailableTimes, time);
  }
  return false;
};

export const isBooked = (bookedArray: any, date: string, time: string) => {
  if (bookedArray.length == 0) {
    return null;
  }
  const dateTime = moment(`${date} ${time}:00`).format("YYYY-MM-DD HH:mm:ss");
  let flag = false;
  let obj: any = {};
  bookedArray.map((item: any) => {
    if (item.appointmentStartTime.includes(dateTime)) {
      flag = true;
      obj = item;
    }
  });
  if (flag) {
    return obj;
  }
  return null;
};
export const getContent = (params: any,router:any) => {
  return (
    <div className="group-hover:bg-gray-200 rounded-md">
      <table className="w-full border-none">
        {Object.entries(params).map(([key, value]) => {
          return (
            <tr key={key} className="group-hover:bg-gray-200">
              <th className="border-none text-start  text-[11px] text-gray-800 group-hover:text-gray-600 rounded-lg">
                {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
              </th>
              <span className="px-2">:</span>
              <th className="text-start overflow-hidden ms-2 border-none text-[11px] text-gray-800 group-hover:text-gray-600">
                {key === "apt" ? (
                  <div
                    className="cursor-pointer text-blue-600  group-hover:text-blue-400"
                  >
                    {value as any}
                  </div>
                ) : (
                  value as any
                )}
              </th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};


// Function to handle the edit appointment action
const handleEditAppointment = (appointmentNumber: any) => {
  console.log("Edit appointment:", appointmentNumber);
  // Redirect to appointment update page or open a modal for editing
};
