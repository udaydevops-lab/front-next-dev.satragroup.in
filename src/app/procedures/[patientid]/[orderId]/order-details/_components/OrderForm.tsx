import ActionButton from "@/app/_common/button";
import DateTime from "@/app/_common/date-time-picker";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Radio } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import TickMarkIcon from "../../../../../../../public/icons/vitals/tickMark";
import OrderEventGrid from "./OrderEventGrid";
import { Divider } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import services from "@/app/utilities/services";
import {
  getAllProcedureDoctors,
  getProceduresOrderDetailsByOrderId,
  getProceduresOrderIdDetailsBanner,
  getProcedureTechniciansByDept,
  saveProceduresOrderDetails,
  updateProceduresOrderDetails,
} from "@/app/utilities/api-urls";
import { getList, initialData } from "./utils";
import moment from "moment";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import { toast } from "react-toastify";
import Textarea from "@/app/_common/text-area";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

function OrderForm(props: any) {
  const [performedBy, setPerformedBy] = useState("technician");
  const [arrivalType, setArrivaltype] = useState("walkIn");
  const { patientid, orderId } = useParams();
  const [technicianList, setTechnicianList] = useState<any>([]);
  const [radiologistsList, setRadiologistsList] = useState<any>([]);
  const [formData, setFormData] = useState<any>(initialData);
  const [eventForm, setEventForm] = useState<any>({
    procedureOrderDetailsItemId: null,
    orderId: "",
    event: "",
    eventTime: null,
    recordBy: getLocalItem("loginResponse")
      ? jsonParse("loginResponse").employeename
      : null,
    recordedDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    statusFlag: 1,
  });
  const [examStartedTime, setExamStartedTime] = useState<any>(null);
  const [examCompletedTime, setExamCompletedTime] = useState<any>(null);
  const [type, setType] = useState("");
  const [arrival, setArrival] = useState("");
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(100);
  const getOrderData = () => {
    services
      .get(getProceduresOrderIdDetailsBanner + orderId)
      .then((response) => {
        let data = response.data[0];
        setFormData({
          patientId: data.patientId,
          encounterId: data.opdEncounterId,
          proceduresOrderDetailsId: null,
          orderId: data.orderId,
          departmentCode: data.department,
          departmentDesc: data.departmentDesc,
          modality: "",
          serviceCode: data.serviceCode,
          serviceName: data.serviceDesc,
          accessionNum: data.accessionNum,
          isPerformedTechDoctor: 0,
          technicianName: "",
          doctorName: "",
          isWalkinScheduled: 0,
          comments: " ",
          statusFlag: "1",
          generatedDate: null,
          updatedDate: null,
          generatedBy: "",
          updatedBy: "",
          orderDetailsItemList: [
            {
              procedureOrderDetailsItemId: null,
              orderId: "",
              event: " ",
              eventTime: "",
              recordBy: "",
              recordedDateTime: "",
              statusFlag: 1,
              generatedDate: null,
              updatedDate: null,
              generatedBy: "",
              updatedBy: "",
            },
          ],
        });
      })
      .catch((error) => {
        setFormData(initialData);
      });
  };
  const router = useRouter();
  const handleInterpretation = () => {
    router.push(`/procedures/results/${orderId}/`);
  };
  const getOrderDetails = () => {
    services
      .get(getProceduresOrderDetailsByOrderId + orderId)
      .then((response) => {
        response.data.doctorName = {
          label: response.data.doctorName,
          value: "",
        };
        response.data.technicianName = {
          label: response.data.technicianName,
          value: "",
        };
        setType("");
        setArrival("");
        if (!response.data.isPerformedTechDoctor) {
          setPerformedBy("technician");
          setKey1((k) => k + 1);
        } else {
          setPerformedBy("doctor");
          setKey1((k) => k + 1);
        }
        if (!response.data.isWalkinScheduled) {
          setArrivaltype("walkIn");
          setKey2((k) => k + 1);
        } else {
          setArrivaltype("scheduled");
          setKey2((k) => k + 1);
        }
        setFormData(response.data);
        response.data.orderDetailsItemList.map((item: any) => {
          if (item.event == "Patient Arrived") {
            setEventForm({ ...eventForm, eventTime: moment(item.eventTime) });
          } else if (item.event == "Exam Started") {
            setExamStartedTime(moment(item.eventTime));
          } else if (item.event == "Exam Completed") {
            setExamCompletedTime(moment(item.eventTime));
          }
        });
      })
      .catch((error) => {
        getOrderData();
      });
  };
  const onEventClick = (event: string, dateTime: any) => {
    if (!dateTime) {
      toast.error("Please select event time");
      return;
    }
    let postObj = {
      ...formData,
      doctorName: formData.doctorName?.label,
      technicianName: formData.technicianName?.label,
      orderDetailsItemList: [
        {
          procedureOrderDetailsItemId: null,
          orderId: formData.orderId,
          event: event,
          eventTime: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"),
          recordBy: getLocalItem("loginResponse")
            ? jsonParse("loginResponse").employeename
            : null,
          recordedDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          statusFlag: 1,
          generatedBy: getLocalItem("loginResponse")
            ? jsonParse("loginResponse").employeename
            : null,
        },
      ],
    };
    services
      .create(saveProceduresOrderDetails, postObj)
      .then((response) => {
        toast.success("Event saved successfully");
        getOrderDetails();
      })
      .catch((error) => {
        if (error.response.data.statusMessage) {
          toast.error(error.response.data.statusMessage);
        } else if (error.response.data) {
          toast.error(error.response.data);
        }
      });
  };
  const onUpdate = () => {
    let postObj = {
      proceduresOrderDetailsId: formData.proceduresOrderDetailsId,
      isPerformedTechDoctor: performedBy == "doctor" ? 1 : 0,
      technicianName: formData.technicianName.label,
      doctorName: formData.doctorName?.label,
      isWalkinScheduled: arrivalType == "walkIn" ? 0 : 1,
      comments: formData.comments,
    };
    services
      .create(updateProceduresOrderDetails, postObj)
      .then((response) => {
        toast.success("Updated successfully");
        getOrderDetails();
      })
      .catch((error) => {
        toast.error("Technical error");
      });
  };
  useEffect(() => {
    getList(getAllProcedureDoctors, setRadiologistsList);
    getList(getProcedureTechniciansByDept, setTechnicianList);
    getOrderDetails();
  }, []);
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <h4 className="font-semibold text-gray-700 text-lg">Events</h4>
      <div className="m-2">
        <div className="flex ">
          <div className="w-1/2 gap-4">
            <div className="flex gap-4 ">
              <div>
                <DateTime
                  disableFuture={true}
                  onChange={(e: any) =>
                    setEventForm({ ...eventForm, eventTime: e })
                  }
                  value={eventForm.eventTime}
                  slotProps={{
                    actionBar: {
                      actions: ["today"],
                    },
                  }}
                />
              </div>
              <div className="w-full flex mt-3">
                <ActionButton
                  buttonText={"Patient Arrived"}
                  handleSubmit={() =>
                    onEventClick("Patient Arrived", eventForm.eventTime)
                  }
                  disabled={formData.orderDetailsItemList.some(
                    (item: any) => item.event == "Patient Arrived"
                  )}
                  width="w-3/5 text-white h-[38px]  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
                <div className="">
                  <TickMarkIcon
                    fill={`${formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Patient Arrived"
                    )
                      ? ""
                      : "#ffff"
                      }`}
                  />
                </div>
              </div>

            </div>
            <div className="flex gap-4 mt-4 ">
              <div>
                <DateTime
                  minDate={moment(eventForm.eventTime).utc()}
                  maxDate={moment().utc()}
                  disableFuture={true}
                  onChange={(e: any) => {
                    console.log(moment(e).utc())
                    setExamStartedTime(e)
                  }}
                  value={examStartedTime}
                  slotProps={{
                    actionBar: {
                      actions: ["today"],
                    },
                  }}
                />
              </div>
              <div className="w-full flex mt-3">
                <ActionButton
                  buttonText={"Exam Started"}
                  handleSubmit={() =>
                    onEventClick("Exam Started", examStartedTime)
                  }
                  disabled={
                    !formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Patient Arrived"
                    ) || formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Exam Started"
                    )
                  }
                  width="w-3/5 text-white h-[38px]  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
                <div className="">
                  <TickMarkIcon
                    fill={`${formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Exam Started"
                    )
                      ? ""
                      : "#ffff"
                      }`}
                  />
                </div>
              </div>

            </div>
          </div>
          <div className="w-1/3 ">
            <div className="w-full flex gap-4 mt-2">
              <ActionButton
                buttonText={"Result"}
                width="w-[180px] text-white  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={() => handleInterpretation()} //navigate to Result Entry
                disabled={
                  !formData.orderDetailsItemList.some(
                    (item: any) => item.event == "Patient Arrived"
                  )
                }
              />
              <div className="">
                <TickMarkIcon fill={`${formData.orderDetailsItemList.some(
                  (item: any) => item.event == "Result Entered"
                )
                  ? ""
                  : "#ffff"
                  }`} />
              </div>
            </div>
            {/* <div className="w-full flex gap-4 mt-2">
              <ActionButton
                buttonText={"PACS Viewer"}
                width="w-full text-white  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
              <div className="">
                <TickMarkIcon fill={"#ffff"} />
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 gap-4 mt-4">
            <div className="flex gap-4 ">
              <div>
                <DateTime
                  minDate={moment(examStartedTime).utc()}
                  maxDate={moment().utc()}
                  disableFuture={true}
                  onChange={(e: any) => setExamCompletedTime(e)}
                  value={examCompletedTime}
                  slotProps={{
                    actionBar: {
                      actions: ["today"],
                    },
                  }}
                />
              </div>
              <div className="w-full flex mt-3">
                <ActionButton
                  buttonText={"Exam Completed"}
                  handleSubmit={() =>
                    onEventClick("Exam Completed", examCompletedTime)
                  }
                  disabled={
                    !formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Exam Started"
                    ) || formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Exam Completed"
                    )
                  }
                  width="w-3/5 text-white h-[38px] text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
                <div className="">
                  <TickMarkIcon
                    fill={`${formData.orderDetailsItemList.some(
                      (item: any) => item.event == "Exam Completed"
                    )
                      ? ""
                      : "#ffff"
                      }`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Divider className="my-4" />
      <h4 className="font-semibold text-gray-700 text-lg">Performed By</h4>
      <div className="m-2">
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className=" flex gap-10" key={key1}>
              <div className="">
                <Radio
                  crossOrigin={undefined}
                  label="Technician"
                  name={type}
                  value={"technician"}
                  defaultChecked={performedBy == "technician" ? true : false}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      doctorName: { label: null, value: null },
                    });
                    setType("type");
                    setPerformedBy(e.target.value);
                  }}
                />
              </div>
              <div className="">
                <Radio
                  crossOrigin={undefined}
                  value={"doctor"}
                  defaultChecked={performedBy == "doctor" ? true : false}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      technicianName: { label: null, value: null },
                    });
                    setType("type");
                    setPerformedBy(e.target.value);
                  }}
                  label="Doctor"
                  name={type}
                />
              </div>
              {performedBy == "technician" ? (
                <div className="w-full my-select-options">
                  <ReactSelectBox
                    label="Technician Name"
                    onChange={(e) =>
                      setFormData({ ...formData, technicianName: e })
                    }
                    options={technicianList}
                    value={formData.technicianName}
                  />
                </div>
              ) : (
                <div className="w-full my-select-options">
                  <ReactSelectBox
                    label="Doctor Name"
                    onChange={(e) =>
                      setFormData({ ...formData, doctorName: e })
                    }
                    options={radiologistsList}
                    value={formData.doctorName}
                  />
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-16" key={key2}>
              <div className="">
                <Radio
                  crossOrigin={undefined}
                  label="Walk In"
                  name={arrival}
                  value={"walkIn"}
                  defaultChecked={arrivalType == "walkIn" ? true : false}
                  onChange={(e) => {
                    setArrival("arrival");
                    setTimeout(() => {
                      setArrivaltype(e.target.value);
                    }, 100);
                  }}
                />
              </div>
              <div className="">
                <Radio
                  crossOrigin={undefined}
                  value={"scheduled"}
                  defaultChecked={arrivalType == "scheduled" ? true : false}
                  onChange={(e) => {
                    setArrival("arrival");
                    setTimeout(() => {
                      setArrivaltype(e.target.value);
                    }, 100);
                  }}
                  label="Scheduled"
                  name={arrival}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Textarea
              value={formData.comments}
              onChange={(e: any) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              label="Comments"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end me-2">
        {props?.screenData?.Update &&
          <ActionButton
            buttonText={"Update"}
            handleSubmit={onUpdate}
            width="w-2/12 text-white  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              !formData.orderDetailsItemList.some(
                (item: any) => item.event == "Patient Arrived"
              )
            }
          />
        }
      </div>
      <div className="mt-4 mx-2">
        <OrderEventGrid data={formData.orderDetailsItemList} />
      </div>
    </div>
  );
}
export default roleInfoScreenData(OrderForm, "Od")