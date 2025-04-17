"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
//import { Option, Radio, Select } from "@material-tailwind/react";
import { Input, Radio } from "@material-tailwind/react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import services from "@/app/utilities/services";
import DateInput from "@/app/_common/date-input";
import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import Textarea from "@/app/_common/text-area";
import { getLocalItem } from "@/app/utilities/local";
import {
  getAllDepartments,
  getConfigData,
  getDepartmentPrac,
  getDoctorData,
  getReferralOrder,
  referral_Order,
} from "@/app/utilities/api-urls";
import Loader from "@/app/_common/loader";
import PatientHeader from "../_components/patient-header";
import { toast } from "react-toastify";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";

export default function Referrals(props: any) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm();
  const [dropdown, setDropdown] = useState(true);
  const [physician, setPhysician] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState<any>("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorContactNo, setDoctorContactNo] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<any>("");
  const [referralDate, setReferralDate] = useState<any>(moment());
  const [departmentlist, setDepartmentlist] = useState<any>([]);
  const [departmentval, setDepartmentval] = useState<any>("");
  const [doctor, setDoctor] = useState<any>("");
  const [referredPhysicianData, setReferredPhysicianData] = useState<any>("");
  const [referalOrderlist, setReferalOrderlist] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorname, setSelectedDoctorname] = useState<any>("");
  const [selectedDoctornameList, setSelectedDoctornameList] = useState<any>([]);
  const [selectedReferral, setSelectedReferral] = useState("Internal Doctor");
  const [referralOrderId, setReferralOrderId] = useState(null);
  const [key, setKey] = useState(88);
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const storedLoginResponse = getLocalItem("loginResponse");
  let empId;
  try {
    empId = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeeid
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empId = ""; // Set a default value or handle the error accordingly
  }
  const DoctorId = empId;
  const handleInternalChange = () => {
    setDropdown(!dropdown);
    setSelectedReferral("Internal Doctor");
  };
  const handleExternalChange = () => {
    setDropdown(false);
    setSelectedReferral("External Doctor");
  };

  let dempartMentListData: any[];
  const getDeportmentData = () => {
    services
      .get(getAllDepartments)
      .then((response) => {
        setLoading(false);
        const result = response.data.map((item: any) => ({
          ...item,
          value: item.departmentCode,
          label: item.departmentDescription,
        }));
        dempartMentListData = result;
        setDepartmentlist(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  const getDoctorInfo = async () => {
    try {
      const response = await services.get(getDoctorData + DoctorId);
      const result = response.data[0];
      if (
        !result.empData.priContactNum ||
        !result.licenceNum ||
        !result.departmentName
      ) {
        toast.error("Employee information is missing, Please contact admin");
        setLoading(false);
        return;
      }

      const ReferredPhysicianName = `${result.empData.firstName} ${result.empData.lastName}`;

      const department: any = dempartMentListData?.filter(
        (item: any) => item.value === result.departmentName
      );

      const departmentDescription = department[0]?.label;
      // setDoctorDepartment(departmentDescription);
      setPhysician(ReferredPhysicianName);
      setDoctorContactNo(result.empData.priContactNum);
      setDoctorLicense(result.licenceNum);
      setReferredPhysicianData(result);
    } catch (error: any) {
      console.error(error.message);
      toast.error("Employee information is missing, Please contact admin");
      setLoading(false);
    }
  };

  const getReferalOrderData = () => {
    services
      .get(getConfigData + "ReferralPriority" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.code,
          label: item.desc,
        }));
        setReferalOrderlist(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  const headers: any = {
    serviceEntityId: getLocalItem("serviceEntityId"),
    locationId: getLocalItem("locationId"),
    "Access-Control-Allow-Origin": "*",
  };
  const handledepartmentDropdown = async (e: any) => {
    setDepartmentval(e);
    await services
      .get(getDepartmentPrac + e.value + "/1", headers)
      .then((response) => {
        setLoading(false);
        const result = response.data.map((item: any) => ({
          ...item,
          value: item.employeeId,
          label: item.lastName,
        }));
        setSelectedDoctornameList(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  const handelclear = () => {
    setKey(key + key);
    reset();
    setDepartmentval("");
    setSelectedReferral("Internal Doctor");
    setReferralDate(moment());
    setPriority("");
    setSelectedDoctorname("");
    setDropdown(true);
  };
  // Your custom logic to determine if the form is valid
  const isFormValid = () => {
    let doctordata =
      selectedReferral === "Internal Doctor" ? selectedDoctorname : doctor;

    return (
      isValid && !!departmentval && !!referralDate && !!priority && !!doctordata
    );
  };

  const handelReferalOrder = () => {
    setLoading(true);
    let postObj = {
      referralOrderId: referralOrderId,
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      departmentCode: departmentval.label,
      physician: physician,
      doctorName:
        selectedReferral === "Internal Doctor"
          ? selectedDoctorname.label
          : doctor,
      priority: priority.label,
      licenseNum: doctorLicense,
      reasonForReferral: reason,
      referralDate: moment(referralDate).format("YYYY-MM-DD"),
      isInternal: selectedReferral === "Internal Doctor" ? "1" : "0",
    };
    services
      .create(referral_Order, postObj, headers)
      .then((res: any) => {
        setLoading(false);
        toast.success("success");
        handelclear();
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
        toast.error("Something went wrong");
      });
  };
  const backToEMR = () => {
    router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
  };
  const getData = async () => {
    services
      .get(`${getReferralOrder}/${patientid}/${opdEncounterId}`)
      .then((response) => {
        let data = response.data[0];
        setPriority(
          referalOrderlist.filter(
            (item: any) => item.label === data.priority
          )[0]
        );
        let deptData = departmentlist.filter(
          (item: any) => item.label == data.departmentCode
        )[0];
        setDepartmentval(deptData ? deptData : "");
        deptData ? handledepartmentDropdown(deptData) : "";
        services
          .get(getDepartmentPrac + deptData.value + "/1", headers)
          .then((response) => {
            setLoading(false);
            const result = response.data.map((item: any) => ({
              ...item,
              value: item.employeeId,
              label: item.lastName,
            }));
            let dataa = result.filter(
              (item: any) => item.label == data.doctorName
            )[0];
            setSelectedDoctorname(dataa);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
        setDoctor(data.isInternal=="0"?data?.doctorName:"");
        setReason(data?.reasonForReferral);
        let DoctNam = selectedDoctornameList.filter(
          (item: any) => item.label == data.doctorName
        )[0];
        setSelectedDoctorname(data.isInternal=="1"?DoctNam:"");
        setReferralOrderId(data?.referralOrderId);
        setReferralDate(moment(data?.referralDate));
      });
  };
  useEffect(() => {
    getDeportmentData();
    getReferalOrderData();
    getDoctorInfo();
  }, []);
  useEffect(() => {
    getData();
  }, [departmentlist]);
  return (
    <>
      {loading ? <Loader /> : ""}
      <div className="block">
        <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
          <h1 className="w-full">
            <span className="w-3/4 float-left"></span>Referal Order
            <span
              className=" w-1/4 float-right text-right cursor-pointer text-blue-600	"
              onClick={backToEMR}
            >
              Back
            </span>
          </h1>
        </div>
        <PatientHeader />
        <div className="w-full md:px-3 my-2 rounded-curve bg-white p-2 px-4">
          <div className=" w-full bg-white mt-4 md:flex flex-wrap" key={key}>
            <div className="md:w-2/6 ps-3 my-2 ">
              <div className="relative">
                <ReactSelectBox
                  value={departmentval}
                  options={departmentlist}
                  onChange={handledepartmentDropdown}
                  isSearchable={true}
                  isMultiple={false}
                  label="Department"
                />
              </div>
            </div>
            <div className="md:w-2/6 ps-3 my-2 relative">
              <DateInput
                label="Date Of Referral"
                onChange={(e: any) => setReferralDate(e)}
                value={referralDate}
              />
            </div>
            <div className="md:w-2/6 ps-3 my-2 ">
              <div className="relative">
                <ReactSelectBox
                  value={priority}
                  options={referalOrderlist}
                  onChange={(e: any) => {
                    setPriority(e);
                  }}
                  isSearchable={true}
                  isMultiple={false}
                  label="Referral Priority"
                />
              </div>
            </div>
            <div className="md:w-4/6 ps-3 my-2 relative flex flex-wrap">
              <div className="md:w-1/2">
                <Radio
                  crossOrigin={undefined}
                  name="referral"
                  label="Internal Doctor"
                  value={"Internal Doctor"}
                  onChange={handleInternalChange}
                  defaultChecked={selectedReferral === "Internal Doctor"}
                />
              </div>
              <div className="md:w-1/2">
                <Radio
                  crossOrigin={undefined}
                  name="referral"
                  label="External Doctor"
                  value={"External Doctor"}
                  onChange={handleExternalChange}
                  defaultChecked={selectedReferral === "External Doctor"}
                />
              </div>
            </div>
            {dropdown ? (
              <div className="md:w-2/6 ps-3 my-2 ">
                <div className="relative">
                  <ReactSelectBox
                    value={selectedDoctorname}
                    options={selectedDoctornameList}
                    isSearchable={true}
                    onChange={(e: any) => {
                      setSelectedDoctorname(e);
                    }}
                    isMultiple={false}
                    label="Referral to Physician"
                  />
                </div>
              </div>
            ) : (
              <div className="md:w-2/6 ps-3 my-2 relative">
                <FormPropsTextFields
                  label="Doctor Name"
                  handleChange={(e: any) =>
                    setDoctor(sanitizeInput(e.target.value))
                  }
                  value={doctor}
                />
              </div>
            )}
            <div className="md:w-2/6 ps-3 my-2 relative">
              <FormPropsTextFields
                label="Referred by Physician"
                handleChange={(e: any) =>
                  setPhysician(sanitizeInput(e.target.value))
                }
                value={physician}
                className="pointer-events-none !bg-[#eceff1]"
              />
            </div>
            <div className="md:w-2/6 ps-3 my-2 relative">
              <FormPropsTextFields
                label="Referred by Physician Department"
                handleChange={(e: any) =>
                  setDoctorDepartment(sanitizeInput(e.target.value))
                }
                value={doctorDepartment}
                className="pointer-events-none !bg-[#eceff1]"
              />
            </div>
            <div className="md:w-2/6 ps-3 my-2 relative">
              <FormPropsTextFields
                label="Referred by License no."
                handleChange={(e: any) =>
                  setDoctorLicense(sanitizeInput(e.target.value))
                }
                value={doctorLicense}
                className="pointer-events-none !bg-[#eceff1]"
              />
            </div>
            <div className="md:w-2/6 ps-3 my-2 relative ">
              <FormPropsTextFields
                type="number"
                label="Referred by Contact no"
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 9) {
                    e.preventDefault();
                  }
                }}
                handleChange={(e: any) => setDoctorContactNo(e.target.value)}
                value={doctorContactNo}
                className="pointer-events-none !bg-[#eceff1]"
              />
            </div>
            <div className="md:w-2/6 ps-3 my-2 relative">
              <Textarea
                label="Reason for Referral"
                minRows={1}
                onChange={(e: any) => setReason(sanitizeInput(e.target.value))}
                handleBlur={(e: any) =>
                  setReason(sanitizeInput(e.target.value))
                }
                value={reason}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 p-4">
            <ActionButton
              buttonText="SAVE"
              handleSubmit={handelReferalOrder}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={!isFormValid()}
            />
            <ActionButton
              buttonText="RESET"
              backgroundColor="red"
              handleSubmit={handelclear}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        </div>
      </div>
    </>
  );
}