"use client";
import DateInput from "@/app/_common/date-input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Input } from "@material-tailwind/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import services from "@/app/utilities/services";
import { getConfigData, savePatientSearch } from "@/app/utilities/api-urls";
import { Divider } from "@mui/material";
import ActionButton from "@/app/_common/button";
function WithoutMrnForm({
  formData,
  handleDateChange,
  ageValue,
  setFormData,
  generateSearchP,
  patSearchById,
}: any) {
  const [genderList, setGenderList] = useState<any>([]);
  const getGender = () => {
    services.get(getConfigData + "Gender" + "/0").then((response) => {
      const data = response.data.configData.map((item: any) => {
        return {
          label: item.desc,
          value: item.code,
        };
      });
      setGenderList(data);
    });
  };
  useEffect(() => {
    getGender();
  }, []);
  const [patList, setPatList] = useState<any>([]);
  const handleInputChange = (e: any) => {
    let obj = {
      abhaAddress: "",
      abhaId: "",
      contactNo: "",
      dob: "",
      firstName: "",
      lastName: "",
      middleName: "",
      mrn: e.target.value,
      nationalIdNo: "",
    };
    services
      .create(savePatientSearch, obj)
      .then((response) => {
        const data = response.data.map((item: any) => {
          let obj = {
            label: item.mrn,
            value: item.patientId,
          };
          return obj;
        });
        setPatList(data);
      })
      .catch((err) => {});
  };
  return (
    <div>
      <div className=" mt-2 bg-white rounded-curve md:pt-3 pb-2 rounded-curve mx-auto w-full border border-stroke">
        <div className="flex  justify-start gap-4 m-4">
          <div className="w-[235px]">
            <ReactSelectBox
              value={formData.patientData.mrnSelect}
              options={patList}
              onChange={(data: any) => {
                setFormData({
                  ...formData,
                  patientData: {
                    ...formData.patientData,
                    mrnSelect: data,
                  },
                });
                setTimeout(() => {
                  patSearchById(data.value);
                }, 1000);
              }}
              height={200}
              onSearchInputChange={handleInputChange}
              isSearchable={true}
              label="Search MRN"
            />
          </div>
          <ActionButton
            buttonText="Advanced Search"
            handleSubmit={generateSearchP}
          />
        </div>
        <Divider className="mx-4" />
        <div className="grid grid-cols-5 gap-4 m-4">
          <Input
            color="blue"
            required={true}
            value={formData.patientData.firstName}
            crossOrigin={undefined}
            onChange={(e: any) => {
              setFormData({
                ...formData,
                patientData: {
                  ...formData.patientData,
                  firstName: e.target.value,
                },
              });
            }}
            label="First Name"
          ></Input>
          <Input
            color="blue"
            value={formData.patientData.middleName}
            crossOrigin={undefined}
            onChange={(e: any) => {
              setFormData({
                ...formData,
                patientData: {
                  ...formData.patientData,
                  middleName: e.target.value,
                },
              });
            }}
            label="Middle Name"
          ></Input>
          <Input
            color="blue"
            required={true}
            value={formData.patientData.lastName}
            crossOrigin={undefined}
            onChange={(e: any) => {
              setFormData({
                ...formData,
                patientData: {
                  ...formData.patientData,
                  lastName: e.target.value,
                },
              });
            }}
            label="Last Name"
          ></Input>
          <DateInput
            label="Date Of Birth"
            value={moment(formData.patientData.dateOfBirth)}
            onChange={handleDateChange}
            disableFuture={true}
          />
          <Input
            color="blue"
            crossOrigin={undefined}
            label="Age"
            value={formData.patientData.ageOfPatient}
            onChange={(e) => {
              // setFormData({
              //   ...formData,
              //   patientData: {
              //     ...formData.patientData,
              //     ageOfPatient: ageValue,
              //   },
              // });
            }}
            type="text"
          ></Input>
          <ReactSelectBox
            value={formData.patientData.gender}
            options={genderList}
            onChange={(data: any) => {
              setFormData({
                ...formData,
                patientData: {
                  ...formData.patientData,
                  gender: data,
                },
              });
            }}
            label="Gender"
          />
          <Input
            color="blue"
            crossOrigin={undefined}
            label="Mobile"
            required={true}
            value={formData.patientData.mobile}
            onChange={(e) => {
              setFormData({
                ...formData,
                patientData: {
                  ...formData.patientData,
                  mobile: e.target.value,
                },
              });
            }}
            type="text"
            onKeyPress={(e: any) => {
              if (
                !/^[0-9]$/.test(e.key) ||
                e.key === "Backspace" ||
                e.key === "Delete"
              )
                e.preventDefault();
              if (e.target.value.length > 9) {
                e.preventDefault();
              }
            }}
          ></Input>
        </div>
        {/* {appointmentNum != "0" && (
          <div className="flex justify-end m-4 gap-3">
            <ActionButton
              buttonText="Update"
              disabled={false}
              handleSubmit={()=>{}}
              width="w-[130px] text-white text-[12px] h-[42px] !bg-blue-500 hover:bg-[#006AC9] border-[#006AC9]"
            />
            <ActionButton
              buttonText="New Appointment"
              disabled={false}
              handleSubmit={()=>{}}
              width="w-[130px] text-white text-[12px] h-[42px] !bg-blue-500 hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default WithoutMrnForm;
