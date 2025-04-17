"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridToolbar,
} from "@mui/x-data-grid";
import Input from "../../_common/input";
import { useForm } from "react-hook-form";
import services from "../../utilities/services";
import ActionButton from "../../_common/button";
import Title from "../../_common/title";
import { savePatientSearch } from "../../utilities/api-urls";
import DateInput from "../../_common/date-input";
import moment from "moment";
import { Button } from "@material-tailwind/react";
import Loader from "../../_common/loader";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
interface RowData {
  id: number;
  Patientid: number;
  Patientname: string;
  aadharnumb: number;
  age: number;
  gender: string;
  phonenumb: number;
  healthid: number;
}

export default function SearchUpdatePatient(props: any) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({});

  const [searchList, setSearchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate1, setSelectedDate1] = React.useState("");
  const [searchButton, setSearchButton] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [dataa, setDataa] = useState([]);
  const [key, setKey] = useState(2);

  const handleDateChange1 = (date: any) => {
    setSelectedDate1(date);
  };

  const formatAge = (age: string) => {
    const regex = /(\d+) Years/;
    const match = age?.match(regex);
    if (match && match[1]) {
      return match[1] + " Years";
    }
    return age;
  };

  const maskingAadhar = (aadharVal: any) => {
    if (typeof aadharVal !== "string" || aadharVal.length < 12) {
      return aadharVal;
    }
    const maskedAadhar =
      aadharVal.substring(0, 8).replace(/./g, "* ") + aadharVal.substring(8);
    return maskedAadhar;
  };

  const columns: GridColDef[] = [
    { field: "mrn", headerName: "Patient Id", width: 145 },
    {
      field: "fullName",
      headerName: "Patient Name",
      width: 200,
    },
    {
      field: "ageOfPatient",
      headerName: "Age",
      width: 90,
      renderCell: (params: any) => formatAge(params.row.ageOfPatient),
    },
    { field: "genderDesc", headerName: "Gender", width: 150 },
    {
      field: "aadharNo",
      headerName: "Aadhar Number",
      width: 200,
      renderCell: (params: any) => maskingAadhar(params.row.aadharNo),
    },
    { field: "primaryContactNum", headerName: "Phone Number", width: 140 },
    { field: "healthId", headerName: "ABHA Number", width: 160 },
    {
      field: "view",
      headerName: "Action",
      width: 140,
      cellClassName: 'sticky-column',
      headerClassName: 'sticky-column-header',
      renderCell: (params: any) => (
        <div >
          <ActionButton
          buttonText="View"
          handleSubmit={() => viewPopup(params.row.patientId)}
          width="w-[80px] text-white  text-[14px]  !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
       </div>
      ),
    },
  ];

  // context get intliize here

  const onSubmit = (data: any) => {
    setLoading(true);
    let postObj = {
      abhaAddress: data.abhaaddress,
      abhaId: data.abhaId,
      contactNo: data.contactNo,
      dob: "",
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      mrn: data.mrn,
      nationalIdNo: data.nationalIdNo,
    };
    services
      .create(savePatientSearch, postObj)
      .then((response) => {
        console.log(response)
        setDataa(response.data);
        setLoading(false);
        setMessage("Saved successfully!!");
        setAlertColor("success");
        setAlertMsg(true);
      })
      .catch((err) => {
        toast.error("No data found");
        setLoading(false);
        console.log(err.message);
      });
  };

  const getRowId = (row: any) => row.patientId;
  const clearForm = () => {
    reset();
    setKey((k) => k + 1);
    setSelectedDate1("");
  };

  const router = useRouter();

  //get single data from data grid click event
  const { setPatientData, patientData } = PatientDatadataAuth();
  const [viewBtn, setViewBtn] = useState(false);
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setPatientData(params.row);
    setViewBtn(true);
  };

  const viewPopup = (data: any) => {
    if (props.screen == "patReg") {
      router.replace(`/patient/${data}/0/patient-Registration`);
      props.popupclose(false);
    } else if (props.screen == "opdEncounter") {
      router.replace(`/encounter/${data}/0/0/outpatient-encounter`);
      props.popupclose(false);
    } else if (props.screen == "linkingToken") {
      props.patSearchById(data)
      props.popupclose(false);
    }else if (props.screen == "appointment") {
      router.replace(`/appointment/${data}/0`);
      props.patSearchById(data)
      props.popupclose(false);
    }
  };

  return (
    <div className="block">
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>Patient Search </h1>
      </div>
      <div
        key={key}
        className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
      >
        <div className=" md:flex py-0 gap-4 my-3">
          <div className="md:w-1/4 ">
            <Input
              type="text"
              name="firstName"
              watch={watch}
              label="First Name"
              required={false}
              inputRef={register("firstName", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              handleKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="mb-6"
            ></Input>
          </div>
          <div className="md:w-1/4">
            <Input
              type="text"
              name="middleName"
              watch={watch}
              label="Middle Name"
              inputRef={register("middleName", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              handleKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="mb-6"
            ></Input>
          </div>
          <div className="md:w-1/4">
            <Input
              type="text"
              name="lastName"
              watch={watch}
              label="Last Name"
              inputRef={register("lastName", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              handleKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="mb-6"
            ></Input>
          </div>

          <div className="md:w-1/4">
            <DateInput
              disableFuture={true}
              label="Date Of Birth"
              name="dob"
              value={selectedDate1}
              onChange={handleDateChange1}
            />
          </div>
        </div>



        <div className=" md:flex py-0 my-3 gap-4">
          <div className="md:w-1/4 ">
            <Input
              type="number"
              name="contactNo"
              watch={watch}
              label="Phone Number"
              inputRef={register("contactNo", {
                required: false,
              })}
              handleKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 9) {
                  e.preventDefault();
                }
              }}
              className="mb-6"
            ></Input>
          </div>
          <div className="md:w-1/4">
            <Input
              type="text"
              name="mrn"
              watch={watch}
              label="MRN"
              inputRef={register("mrn", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              className="mb-6"
            ></Input>
          </div>

          <div className="md:w-1/4">
            <Input
              type="text"
              name="nationalIdNo"
              watch={watch}
              label="National Type ID Number"
              inputRef={register("nationalIdNo", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              className="mb-6"
            ></Input>
          </div>
          <div className="md:w-1/4">
            <Input
              type="text"
              name="abhaId"
              watch={watch}
              label="ABHA Number"
              inputRef={register("abhaId", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              className="mb-6"
            ></Input>
          </div>
        </div>


        <div className="md:flex py-0 gap-4">
          <div className="md:w-1/4">
            <Input
              type="text"
              name="abhaaddress"
              watch={watch}
              label="ABHA Address"
              inputRef={register("abhaaddress", {
                required: false,
                onChange: (e) => {
                  const inputValue = e.target.value;
                  e.target.value = sanitizeInput(inputValue);
                }
              })}
              className="mb-6"
            ></Input>
          </div>
          <div className="md:w-3/4 flex gap-4">
            <ActionButton
              buttonText="SEARCH"
              handleSubmit={handleSubmit(onSubmit)}
              disabled={searchButton}
              width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
            <ActionButton
              buttonText="RESET"
              handleSubmit={clearForm}
              disabled={searchButton}
              width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>


        </div>
      </div>

      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>Search Results</h1>
      </div>

      <div className="px-4 bg-white rounded-curve md:pt-6 pb-3 rounded-curve mx-auto w-full border border-stroke">

        <DataGrid
          rows={dataa}
          columns={columns}
          getRowId={getRowId}
          pageSizeOptions={[10, 20]}
          onRowClick={handleRowClick}
          checkboxSelection={false}
          sx={{
           "& .MuiDataGrid-columnHeaders": {
      position: "sticky",
      top: 0,
      backgroundColor: "#fff",
      zIndex: 100,
    },

    // Make specific column sticky (e.g., col1)
    "& .MuiDataGrid-cell[data-field='view']": {
      position: "sticky",
      left: 0,
      backgroundColor: "#fff",
      zIndex: 1,
    },
    "& .MuiDataGrid-columnHeader[data-field='view']": {
      position: "sticky",
      left: 0,
      backgroundColor: "#fff",
      zIndex: 101,
    },
          }}
        />
      </div>
      {viewBtn ? (
        <>
          {/* <ActionButton
            buttonText="VIEW"
            handleSubmit={() => props.popupclose(false)}
            width="fit-content"
          /> */}

          {/* <div className="w-full items-end justify-end px-4 py-2 mb-3">
            <button
              onClick={() => viewPopup(patientData.patientId)}
              className="float-right middle none center rounded-lg bg-blue-500 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85]e"
              data-ripple-light="true"
            >
              View
            </button>
          </div> */}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
