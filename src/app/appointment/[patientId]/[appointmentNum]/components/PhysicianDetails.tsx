"use client";
import DateInput from "@/app/_common/date-input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import {
  bookAppointment,
  getAllDepartments,
  getAppointmentDetailsByApptNo,
  getDepartmentPrac,
  getDoctorAvailableSlots,
  getTimeSlots,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { Switch } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Slots from "./Slots";
import { toast } from "react-toastify";
import { getMasterData, getSlotTiming } from "./Utils";
import { useParams, useRouter } from "next/navigation";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ActionButton from "@/app/_common/button";
import { getHeaderResponse } from "@/app/_commonfeatures/header";

function PhysicianDetails({ formData, setFormData, setIsOpen,ageValue }: any) {
  const [resourceTypeList, setResourceTypeList] = useState<any>([]);
  const [resourceList, setResourceList] = useState<any>([]);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [priorityList, setPriorityList] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [slotData, setSlotData] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState<any>(
    moment().format("YYYY/MM/DD")
  );
  const [selectedSlot, setSelectedSlot] = useState<any>({ date: "", time: "" });
  const [key1, setKey1] = useState(0);
  const getDepartmentList = () => {
    services
      .get(getAllDepartments)
      .then((response) => {
        const transformedData = response.data.map((item: any) => ({
          value: item.departmentCode,
          label: item.departmentDescription,
        }));
        setDepartmentList(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // we cannot book in this date range
  const [unavailableTimes, setUnavailableTimes] = useState({
    fromTime: "",
    toTime: "",
  });
  //slot duration
  const [durationMinutes, setDurationMinutes] = useState(0);
  const handleDepartment = (data: any) => {
    setFormData({
      ...formData,
      physicianDetails: {
        ...formData.physicianDetails,
        department: data,
        resource: "",
      },
    });
    getResourceDept(data);
  };
  const getResourceDept = (data: any) => {
    services
      .get(getDepartmentPrac + data.value + "/1")
      .then((response) => {
        const transformedData = response.data.map((item: any) => ({
          value: item.employeeId,
          label: item.lastName,
        }));
        setResourceList(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  //Booked slots for a particular resource(Dr)
  const [bookedArray, setBookedArray] = useState([]);
  const getDoctorAvailability = (resource: any, resourceType: any) => {
    services
      .get(
        `${getDoctorAvailableSlots}fromDate=${moment(currentDate).format(
          "YYYY-MM-DD"
        )}&toDate=${moment(currentDate)
          .add(4, "days")
          .format(
            "YYYY-MM-DD"
          )}&resourceType=${resourceType}&resource=${resource}`
      )
      .then((response) => {
        const data = response.data;
        let arr: any = [];
        data.map((item: any) => {
          // let obj={
          //     firstName:item.firstName,
          //     lastName:item.lastName,
          //     appointmentStartTime:item.appointmentStartTime
          // }
          arr.push(item);
        });
        setBookedArray(arr);
        setKey1((k) => k + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Two api calls when selected doctor (resource)
  // 1. Time slots and duration splitting
  //.2. Booked time slots for that resource
  const handleResource = (data: any, resourceType?: any) => {
    if (!resourceType) {
      setFormData({
        ...formData,
        physicianDetails: {
          ...formData.physicianDetails,
          resource: data,
        },
      });
    }
    const resource = data.label;
    const resourceTypeVal =
      formData.physicianDetails.resourceType.label || resourceType?.label;
    //1st call to get total slots
    services
      .get(
        `${getTimeSlots}resourceType=${resourceTypeVal}&resource=${data.label}`
      )
      .then((response) => {
        let data = response.data;
        let availableArr: any = [];
        data.map((item: any) => {
          if (item.resourceStatus == "Available") {
            setDurationMinutes(item.slotDuration);
            const slots = getSlotTiming(
              item.resourceSchedulerFromDateTime.split(" ")[1],
              item.resourceSchedulerToDateTime.split(" ")[1],
              item.slotDuration
            );
            availableArr.push(...slots);
          } else if (item.resourceStatus == "Not Available") {
            const unavailableTimes = {
              fromTime: item.resourceSchedulerFromDateTime.split(" ")[1],
              toTime: item.resourceSchedulerToDateTime.split(" ")[1],
              fromDate: item.resourceSchedulerFromDate,
              toDate: item.resourceSchedulerToDate,
            };
            setUnavailableTimes(unavailableTimes);
          }
        });
        setSlotData(availableArr);
        //2nd call to get booked slots
        getDoctorAvailability(resource, resourceTypeVal);
      })
      .catch((err) => {
        toast.error(err.response.data.statusMessage);
      });
  };
  useEffect(() => {
    getMasterData("ResourceType", setResourceTypeList);
    getDepartmentList();
    getMasterData("Appointment_priority", setPriorityList);
    getMasterData("Appointment_status", setStatusList);
  }, []);
  useEffect(() => {
    setKey1((k) => k + 1);
    handleResource(formData.physicianDetails.resource);
  }, [currentDate]);
  const { appointmentNum } = useParams();
  const [apptId, setApptId] = useState(0);
  const getAppointmentsDetails = () => {
    services
      .get(getAppointmentDetailsByApptNo + appointmentNum)
      .then((response) => {
        const data = response.data;
        setApptId(data.id);
        const date = data.appointmentStartTime.split(" ");
        handleSlotClick(moment(date[0]).format("YYYY/MM/DD"), date[1]);
        setFormData({
          patientData: {
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            dateOfBirth: data.dob,
            ageOfPatient: data.age,
            gender: { value: data.gender, label: data.gender } as any,
            mobile: data.mobile,
            mrnSelect:data.mrn? { label: data.mrn,value:data.patientId }:"",
            patientId: data.patientId,
          },
          physicianDetails: {
            resourceType: {
              value: data.resourceType,
              label: data.resourceType,
            } as any,
            department: {
              value: data.department,
              label: data.department,
            } as any,
            resource: { value: data.resource, label: data.resource } as any,
            priority:data.priority? { value: data.priority, label: data.priority } as any:'',
            status: {
              value: data.appoinmentStatus,
              label: data.appoinmentStatus,
            } as any,
            appointmentType: "New",
          },
        });
        handleResource(
          { value: data.resource, label: data.resource },
          {
            value: data.resourceType,
            label: data.resourceType,
          }
        );
        setCurrentDate(moment(data.appointmentDate).format("YYYY/MM/DD"));
        setDisableUpdate(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addMinutesToDate = (dateString: string, minutes: number) => {
    let date = new Date(dateString); // Convert to Date object
    date.setMinutes(date.getMinutes() + minutes); // Add 45 minutes
    return date;
  };
  const handleSave = () => {
    if (appointmentNum == "0") {
      if (
        (selectedSlot && !selectedSlot.date) ||
        (selectedSlot && !selectedSlot.time) ||
        !selectedSlot
      ) {
        toast.error("Please Select a slot");
        return;
      }
    }
    let postObj = {
      id: apptId == 0 ? null : apptId,
      patientId: formData.patientData.patientId
        ? formData.patientData.patientId
        : null,
      firstName: formData.patientData.firstName,
      middleName: formData.patientData.middleName,
      lastName: formData.patientData.lastName,
      age: formData.patientData.ageOfPatient,
      dob: moment(formData.patientData.dateOfBirth).format("YYYY-MM-DD"),
      gender: formData.patientData.gender.label,
      appointmentNumber: appointmentNum != "0" ? appointmentNum : null,
      mobile: formData.patientData.mobile,
      appointmentDate: moment(selectedSlot.date).format("YYYY-MM-DD"),
      duration: durationMinutes,
      appointmentStartTime: moment(
        `${selectedSlot.date} ${selectedSlot.time}`
      ).format("YYYY-MM-DD HH:mm:ss"),
      appointmentEndTime: moment(
        addMinutesToDate(
          `${selectedSlot.date} ${selectedSlot.time}`,
          durationMinutes
        )
      ).format("YYYY-MM-DD HH:mm:ss"),
      resourceType: formData.physicianDetails.resourceType.label,
      resource: formData.physicianDetails.resource.label,
      appontmentType: formData.physicianDetails.appointmentType,
      appoinmentStatus: formData.physicianDetails.status.label,
      department: formData.physicianDetails.department.label,
      priority: formData.physicianDetails.priority.label,
      mrn: formData.patientData.mrnSelect.label,
      opdEncounterNumber: null,
    };
    setDisableUpdate(true);
    services
      .create(bookAppointment, postObj, getHeaderResponse())
      .then((response) => {
        setDisableUpdate(false);
        if (appointmentNum == "0") {
          toast.success(response.data.statusMessage);
        } else {
          toast.success("Status updated successfully");
        }
        setTimeout(()=>{
          router.push(`/appointment/0/${response.data.appointmentNum}`)
        },2000)
        handleResource(formData.physicianDetails.resource);
      })
      .catch((err) => {
        setDisableUpdate(false);
        toast.error(err.response.data.statusMessage);
      });
  };
  const [slotOpen, setSlotOpen] = useState(false);
  const handleSlotClick = async (date: any, time: any) => {
    if (selectedSlot?.date === date && selectedSlot?.time === time) {
      setSelectedSlot({ date: "", time: "" });
    } else {
      if (!formData.patientData.firstName && appointmentNum == "0") {
        toast.error("Please enter patient details");
        setTimeout(() => {
          handleClose();
        }, 500);
        return;
      }
      setSelectedSlot({ date, time });
    }
  };
  useEffect(() => {
    if (appointmentNum !== "0") {
      setIsOpen(true);
      getAppointmentsDetails();
    }
  }, []);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const handleSwitch = (e: any) => {
    setDisableUpdate(false);
    setFormData({
      ...formData,
      physicianDetails: {
        ...formData.physicianDetails,
        appointmentType: e.target.checked ? "followUp" : "New",
      },
    });
  };
  const [disableUpdate, setDisableUpdate] = useState(true);
  const handleClose = () => {
    setSlotOpen(false);
  };
  const router=useRouter()
  return (
    <div>
      <div className="px-4 p-2  mt-2 bg-white rounded-curve md:pt-6 pb-6 rounded-curve mx-auto w-full border border-stroke">
        <div className="grid grid-cols-5 gap-4">
          <ReactSelectBox
            value={formData.physicianDetails.resourceType}
            options={resourceTypeList}
            onChange={(data: any) => {
              if (
                data?.label !== formData.physicianDetails.resourceType?.label
              ) {
                setDisableUpdate(false);
                setFormData({
                  ...formData,
                  physicianDetails: {
                    ...formData.physicianDetails,
                    resourceType: data,
                  },
                });
              }
            }}
            label="Resource Type"
          />
          <ReactSelectBox
            value={formData.physicianDetails.department}
            options={departmentList}
            isSearchable={true}
            onChange={(data: any) => {
              if (data?.label !== formData.physicianDetails.department?.label) {
                setDisableUpdate(false);
                handleDepartment(data);
              }
            }}
            label="Department"
          />
          <ReactSelectBox
            value={formData.physicianDetails.resource}
            options={resourceList}
            isSearchable={true}
            onChange={(data: any) => {
              if (
                data?.label !== formData.physicianDetails.resourceType?.label
              ) {
                setDisableUpdate(false);
                handleResource(data);
              }
            }}
            label="Resource"
          />
          <ReactSelectBox
            value={formData.physicianDetails.priority}
            options={priorityList}
            onChange={(data: any) => {
              if (data?.label !== formData.physicianDetails.priority?.label) {
                setDisableUpdate(false);
                setFormData({
                  ...formData,
                  physicianDetails: {
                    ...formData.physicianDetails,
                    priority: data,
                  },
                });
              }
            }}
            label="Priority"
          />
          <div className="flex justify-center items-center gap-4">
            <div>New</div>
            <div>
              <Switch
                {...label}
                checked={
                  formData.physicianDetails.appointmentType == "followUp"
                }
                onClick={handleSwitch}
              />
            </div>
            <div>Follow up</div>
          </div>
          <ReactSelectBox
            value={appointmentNum !== "0"?formData.physicianDetails.status:{label:'Booked',value:'booked'}}
            options={statusList}
            onChange={(data: any) => {
              if (data?.label !== formData.physicianDetails.status?.label) {
                setDisableUpdate(false);
                setFormData({
                  ...formData,
                  physicianDetails: {
                    ...formData.physicianDetails,
                    status: data,
                  },
                });
              }
            }}
            isDisabled={appointmentNum == "0"}
            label="Status"
          />
          {appointmentNum == "0" && (
            <ActionButton
              buttonText="Slot Selection"
              disabled={!formData.physicianDetails.resource.label}
              handleSubmit={() => setSlotOpen(true)}
              width="w-[130px] text-white text-[12px] h-[42px] !bg-blue-500 hover:bg-[#006AC9] border-[#006AC9]"
            />
          )}
        </div>
        {appointmentNum != "0" && (
          <div className="flex justify-end gap-3">
            <ActionButton
              buttonText="Update"
              disabled={disableUpdate}
              handleSubmit={handleSave}
              width="w-[130px] text-white text-[12px] h-[42px] !bg-blue-500 hover:bg-[#006AC9] border-[#006AC9]"
            />
            <ActionButton
              buttonText="New Appointment"
              disabled={appointmentNum=='0'}
              handleSubmit={()=>{
                router.push('/appointment/0/0')
              }}
              width="w-[130px] text-white text-[12px] h-[42px] !bg-blue-500 hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        )}
        <ReactCommonDialog
          Content={
            <div key={key1} className="">
              <div className="col-span-1 mb-4 w-1/4">
                <DateInput
                  disableFuture={true}
                  value={moment(currentDate)}
                  label="Select Date"
                  onChange={(e: any) => {
                    setCurrentDate(moment(e).format("YYYY/MM/DD"));
                  }}
                />
              </div>
              <Slots
                currentDate={currentDate}
                slotData={slotData}
                unavailableTimes={unavailableTimes}
                bookedArray={bookedArray}
                handleClose={handleClose}
                selectedSlot={selectedSlot}
                handleSave={handleSave}
                handleSlotClick={handleSlotClick}
              />
            </div>
          }
          handler={() => {}}
          open={slotOpen}
          popupClose={() => setSlotOpen(false)}
          dialogtitle="Select a Slot"
          size="xl"
        />
      </div>
    </div>
  );
}

export default PhysicianDetails;
