"use client";
import React, { useEffect, useState } from "react";
import ControllerSelect from "../_common/select";
import { useForm } from "react-hook-form";
import DateInput from "../_common/date-input";
import { Radio } from "@material-tailwind/react";
import FormPropsTextFields from "../_common/input";
import Textarea from "../_common/text-area";
import Title from "../_common/title";
import ActionButton from "../_common/button";
import {
  getAllDepartments,
  getConfigData,
  getDepartmentPrac,
  referral_Order,
} from "../utilities/api-urls";
import services from "../utilities/services";
import moment from "moment";
import { getLocalItem } from "../utilities/local";
import { useParams, useRouter } from "next/navigation";
import Loader from "../_common/loader";
import Select from "react-tailwindcss-select";
import { sanitizeInput } from "../utilities/sanitizeInput";

export default function OpdReferrals(props: any) {
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
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const [dropdown, setDropdown] = useState(true);
  const [physician, setPhysician] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorContactNo, setDoctorContactNo] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<any>("");
  const [referralDate, setReferralDate] = useState<Date | null>(null);
  const [departmentlist, setDepartmentlist] = useState([]);
  const [departmentval, setDepartmentval] = useState<any>("");
  const [doctor, setDoctor] = useState("");
  const [referalOrderVal, setReferalOrderVal] = useState("");
  const [referalOrderlist, setReferalOrderlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorname, setSelectedDoctorname] = useState<any>("");
  const [selectedDoctornameList, setSelectedDoctornameList] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState("Internal Doctor");
  const [key, setKey] = useState(88);
  const handleInternalChange = () => {
    setDropdown(!dropdown);
    setSelectedReferral("Internal Doctor");
  };
  const handleExternalChange = () => {
    setDropdown(false);
    setSelectedReferral("External Doctor");
  };
  const getDeportmentData = () => {
    services
      .get(getAllDepartments)
      .then((response) => {
        setLoading(false);
        const result = response.data.map((item: any) => ({
          value: item.departmentCode,
          label: item.departmentDescription,
        }));

        setDepartmentlist(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
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
  useEffect(() => {
    getDeportmentData();
    getReferalOrderData();
  }, []);
  const headers: any = {
    serviceEntityId: getLocalItem("serviceEntityId"),
    locationId: getLocalItem("locationId"),
    "Access-Control-Allow-Origin": "*",
  };
  const handledepartmentDropdown = (e: any) => {
    setDepartmentval(e);
    services
      .get(getDepartmentPrac + e.value + "/1", headers)
      .then((response) => {
        setLoading(false);
        const result = response.data.map((item: any) => ({
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
    setReferralDate(null);
    setPriority("");
    setSelectedDoctorname("");
  };

  const handelReferalOrder = () => {
    const postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      departmentCode: doctorDepartment,
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
      .create(referral_Order, postObj)
      .then((response) => {
        props.handleOuterClose();
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <>
      {loading ? <Loader /> : ""}
      <div className=" w-full bg-white mt-4 md:flex flex-wrap" key={key}>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <Select
            placeholder="Department"
            primaryColor="blue"
            value={departmentval}
            options={departmentlist}
            onChange={handledepartmentDropdown}
            isSearchable={true}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <DateInput
            label="Date Of Referral"
            onChange={(e: any) => setReferralDate(e)}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <Select
            placeholder="Referral Priority"
            primaryColor="blue"
            value={priority}
            options={referalOrderlist}
            onChange={(e: any) => {
              setPriority(e);
            }}
          />
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
          <div className="md:w-2/6 ps-3 my-2 relative">
            <Select
              placeholder="Referral to Physician"
              primaryColor="blue"
              value={selectedDoctorname}
              options={selectedDoctornameList}
              isSearchable={true}
              onChange={(e: any) => {
                setSelectedDoctorname(e);
              }}
            />
          </div>
        ) : (
          <div className="md:w-2/6 ps-3 my-2 relative">
            <FormPropsTextFields
              label="Doctor Name"
              handleChange={(e: any) => {
                setDoctor(sanitizeInput(e.target.value));
              }}
            />
          </div>
        )}
        <div className="md:w-2/6 ps-3 my-2 relative">
          <FormPropsTextFields
            label="Referred by Physician"
            handleChange={(e: any) => setPhysician(sanitizeInput(e.target.value))}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <FormPropsTextFields
            label="Referred by Phys Department"
            handleChange={(e: any) => setDoctorDepartment(sanitizeInput(e.target.value))}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <FormPropsTextFields
            label="Referred by License no."
            handleChange={(e: any) => setDoctorLicense(sanitizeInput(e.target.value))}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <FormPropsTextFields
            label="Referred by Contact no."
            handleChange={(e: any) => setDoctorContactNo(sanitizeInput(e.target.value))}
          />
        </div>
        <div className="md:w-2/6 ps-3 my-2 relative">
          <Textarea
            label="Reason for Referral"
            minRows={1}
            handleBlur={(e: any) => setReason(sanitizeInput(e.target.value))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 p-4">
        <ActionButton buttonText="Save" handleSubmit={handelReferalOrder} />
        <ActionButton buttonText="Clear" handleSubmit={handelclear} />
      </div>
    </>
  );
}
