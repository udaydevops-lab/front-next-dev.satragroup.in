"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../_common/input";
import CustomRadio from "../../_common/custom-radio";
import {
  getConfigData,
  getPatDetails,
  searchByHealthId,
  searchByMobile,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import axios from "axios";
import Select from "../../_common/select";
import ActionButton from "@/app/_common/button";
import { Button } from "@material-tailwind/react";
import moment from "moment";
import Loader from "@/app/_common/loader";
import { error } from "console";
import { getLocalItem } from "@/app/utilities/local";
interface DropdownProps {
  options: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <select
      className="block w-full p-2 border rounded shadow"
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
export default function KnowYourAbha() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
    control,
  } = useForm();
  const options: string[] = ["Male", "Female", "Transgender"];
  const [loading, setLoading] = useState(true);
  const [genderData, setGenderData] = useState([]);
  const [status, setStatus] = useState("Y");
  const [HealthId, setHealthId] = useState("");
  const [AbhaData, setAbhaData] = useState({
    abhaAddress: "",
    ageOfPatient: "",
    dateOfBirth: 0,
    firstName: "",
    gender: "",
    patientId: 0,
    primaryContactNum: "",
  });
  const [details, setDetails] = useState({});

  useEffect(() => {
    setLoading(true);
    services
      .get(getConfigData + "gender" + "/0")
      .then((response) => {
        setLoading(false);
        setGenderData(response.data.configData);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, []);

  const genderList = [
    {
      id: "F",
      value: "Female",
    },
    {
      id: "M",
      value: "Male",
    },
  ];

  const handleChangeStatus = (e: any) => {
    setStatus(e.target.value);
    if (e.target.value === "Y") {
      reset([""]);
      setHealthId("");
    } else {
      setValue("name", "");
      setHealthId("");
      reset({ name: "" });
    }
  };

  const handleData = (data: any) => {
    setDetails(data);
    if (status === "Y") {
      let postObj = {
        healthId: data.abhaNumber,
      };
      setLoading(true);
      services
        .create(searchByHealthId, postObj, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization:
              `Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
          },
        })
        .then((response) => {
          setLoading(false);
          setLoading(true);
          services
            .get(getPatDetails + response.data.healthIdNumber, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization:
                  `Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
              },
            })
            .then((response) => {
              setLoading(false);
              setAbhaData(response.data[0]);
            })
            .catch((err) => {
              setLoading(false);
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } else if (status === "N") {
      let postObj = {
        name: data.fullName,
        yearOfBirth: data.dateOfBirth,
        gender: data.genderId,
        mobile: data.mobileNumber,
      };
      setLoading(true);
      services
        .create(searchByMobile, postObj, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization:
              `Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
          },
        })
        .then((response) => {
          setLoading(false);
          setAbhaData(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <div className="min-h-full ">
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3  max-w-7xl mx-auto w-full">
        <h1>Know your ABHA</h1>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="pb-3 mx-auto w-full">
          <div className="mb-4 -mx-3 md:flex">
            <div className="md:w-1/4 px-3 my-2">
              <div className="col-span-2 p-4 rounded-curve-inner  bg-white shadow-default">
                <CustomRadio
                  handleChange={handleChangeStatus}
                  required={true}
                  name="radiocheck"
                  value={status}
                  control={control}
                  listItems={[
                    { id: "Y", name: "By HealthID / ABHA Address" },
                    { id: "N", name: "By Demographics" },
                  ]}
                />
              </div>
              <div className="">
                {status === "Y" ? (
                  <div className="col-span-2 p-4 rounded-curve-inner mt-4 bg-white shadow-default">
                    <p className="font-bold">By ABHA Details</p>
                    <div className="py-2">
                      <Input
                        type="text"
                        label="ABHA Address / ABHA Number"
                        name="abhaAddress"
                        watch={watch}
                        inputRef={register("abhaNumber", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="px-2">
                        <ActionButton
                          buttonText="Register"
                          handleSubmit={handleSubmit(handleData)}
                          width="fit-content"
                        />
                      </div>
                      <div className="px-2">
                        <Button className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded">
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="know-your-abha-form col-span-2 p-4 rounded-curve-inner mt-4 bg-white shadow-default">
                    <p className="font-bold">By Demographics</p>
                    <div className="py-2">
                      <Input
                        type="text"
                        label="Enter Full Name"
                        name="fullName"
                        watch={watch}
                        inputRef={register("fullName", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="py-2">
                      <Select
                        control={control}
                        label="Gender *"
                        name="genderId"
                        listItems={genderList}
                        required={true}
                        keyValue="id"
                        displayValue="value"
                      />
                    </div>
                    <div className="py-2">
                      <Input
                        type="text"
                        label="Enter Date of Birth"
                        name="dateOfBirth"
                        watch={watch}
                        inputRef={register("dateOfBirth", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="py-2">
                      <Input
                        size="md"
                        type="text"
                        label="Enter Mobile Number"
                        name="mobileNumber"
                        watch={watch}
                        inputRef={register("mobileNumber", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="px-2">
                        <ActionButton
                          buttonText="Register"
                          handleSubmit={handleSubmit(handleData)}
                          width="fit-content"
                        />
                      </div>
                      <div className="px-2">
                        <Button className="full lg cursor-pointer flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded">
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-3/4 px-3 my-2 bg-white rounded-curve-inner md:pt-3 pb-3 border border-stroke">
              <p>Details</p>
              <div className="mb-4 -mx-3 md:flex py-5">
                <div className="md:w-1/4 px-3">
                  <p className="text-gray-500">Patient Name</p>{" "}
                  <p className="font-bold">
                    {AbhaData.firstName ? AbhaData.firstName : "MaXXX XXXXXXX"}
                  </p>
                </div>
                <div className="md:w-1/4 px-3">
                  <p className="text-gray-500">Gender / Age</p>{" "}
                  <p className="font-bold">
                    {" "}
                    Male /{" "}
                    {AbhaData.ageOfPatient ? AbhaData.ageOfPatient : "23"}
                  </p>
                </div>
                <div className="md:w-1/4 px-3">
                  <p className="text-gray-500">Mobile Number</p>{" "}
                  <p className="font-bold">
                    {AbhaData.primaryContactNum
                      ? AbhaData.primaryContactNum
                      : "+91-XXXXX XXXXX"}
                  </p>
                </div>
              </div>
              <div className="mb-4 -mx-3 md:flex py-5">
                <div className="md:w-1/4 px-3">
                  <p className="text-gray-500">Date Of Birth</p>{" "}
                  <p className="font-bold">
                    {AbhaData.dateOfBirth
                      ? moment(AbhaData.dateOfBirth).format("DD-MM-YYYY")
                      : "10-12-2000"}
                  </p>
                </div>
                <div className="md:w-3/4 px-3">
                  <p className="text-gray-500">Address</p>{" "}
                  <p className="font-bold">Hno: 3-67/2.90</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
