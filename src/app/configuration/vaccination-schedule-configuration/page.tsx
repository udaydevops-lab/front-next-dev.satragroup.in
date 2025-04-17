"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import services from "@/app/utilities/services";
import {
  getConfigData,
  vaccinationList,
  saveImmunizationMaster,
  getImmunizationMaster,
} from "@/app/utilities/api-urls";
import Input from "@/app/_common/input";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";

export default function VaccinationScheduleConfiguration(props: any) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [immunizationData, setImmunizationData] = useState<any>([]);
  const [immuDropdownData, setImmuDropdownData] = useState<any>([]);
  const [selectedImmuData, setSelectedImmuData] = useState<any>({});
  const [genderData, setGenderData] = useState<any>([]);
  const [durationData, setDurationData] = useState<any>([]);
  const [selectedDurationData, setSelectedDurationData] = useState<any>({});
  const [selectedGenderData, setSelectedGenderData] = useState<any>({});
  const [schePeriod, setSchePeriod] = useState<any>("");

  const fetchApisData = () => {
    services
      .get(getImmunizationMaster)
      .then((response) => {
        let immunizationValues = response.data.map((item: any) => {
          let obj = {
            value: item.immunizationCode,
            label: item.immunizationDesc,
          };
          return obj;
        });
        response.data.map((item1: any, index: any) => {
          const matchingItem = immunizationValues.find(
            (item2: any) => item2.value === item1.immunizationCode
          );
          setSelectedImmuData((prevSelectedImmuData: any) => {
            return {
              ...prevSelectedImmuData,
              [`sel${index + 1}`]: matchingItem,
            };
          });
          return { ...item1, ...({ matchingItem } || {}) };
        });
        let genderValues = response.data.map((item: any) => {
          let obj = {
            value: item.genderCode,
            label: item.gender,
          };
          return obj;
        });
        response.data.map((item1: any, index: any) => {
          const matchingItem = genderValues.find(
            (item2: any) => item2.value === item1.genderCode
          );
          setSelectedGenderData((prevSelectedGenData: any) => {
            return {
              ...prevSelectedGenData,
              [`sel${index + 1}`]: matchingItem,
            };
          });
          return { ...item1, ...({ matchingItem } || {}) };
        });
        setImmunizationData(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    services
      .get(vaccinationList)
      .then((response) => {
        const transformedData = response.data.content.map((item: any) => ({
          ...item,
          value: item.immunizationCode,
          label: item.immunizationDesc,
        }));
        setImmuDropdownData(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });

    services
      .get(getConfigData + "Gender" + "/0")
      .then((response) => {
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setGenderData(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });

    services
      .get(getConfigData + "Duration" + "/0")
      .then((response) => {
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setDurationData(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns: GridColDef[] = [
    { field: "immunizationId", headerName: "Terminology", width: 100 },
    { field: "immunizationCode", headerName: "Immunization Code", width: 160 },
    {
      field: "immunizationDesc",
      headerName: "Immunization Description",
      width: 360,
      renderCell: (params: any) => (
        <>
          <Select
            primaryColor="blue"
            placeholder="Immunization Description"
            options={immuDropdownData}
            value={selectedImmuData[`sel${params.row.immunizationId}`]}
            onChange={(e: any) => {
              setSelectedImmuData({
                ...selectedImmuData,
                [`sel${params.row.immunizationId}`]: e,
              });
            }}
          />
        </>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 200,
      renderCell: (params: any) => (
        <>
          <Select
            primaryColor="blue"
            placeholder="Gender"
            options={genderData}
            value={selectedGenderData[`sel${params.row.immunizationId}`]}
            onChange={(e: any) => {
              setSelectedGenderData({
                ...selectedGenderData,
                [`sel${params.row.immunizationId}`]: e,
              });
            }}
          />
        </>
      ),
    },
    {
      field: "schedulePeriod",
      headerName: "Schedule Period",
      width: 350,
      renderCell: (params: any) => (
        <div className="flex gap-x-2">
          <Input
            type="text"
            label=""
            name="code"
            watch={watch}
            handleChange={(e: any) => {
              setSchePeriod({
                ...schePeriod,
                [`sel${params.row.immunizationId}`]: e.target.value,
              });
            }}
            value={schePeriod[`sel${params.row.immunizationId}`]}
          />
          <Select
            primaryColor="blue"
            placeholder="Duration"
            options={durationData}
            value={selectedDurationData[`sel${params.row.immunizationId}`]}
            onChange={(e: any) => {
              setSelectedDurationData({
                ...selectedDurationData,
                [`sel${params.row.immunizationId}`]: e,
              });
            }}
          />
        </div>
      ),
    },
  ];

  const handleSelectionChange = (newSelection: any) => {};

  const saveVaccination = () => {
    let postObj = {};
    services
      .create(saveImmunizationMaster, postObj)
      .then((response: any) => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchApisData();
  }, []);
  return (
    <>
      <div className="bg-white rounded-curve md:pt-b pb-3 rounded-curve mx-auto w-full border border-stroke">
        <h1 className="font-bold text-md p-4">
          Vaccination Schedule Configuration
        </h1>
        <div className="pl-3 pr-3">
          <DataGrid
            className="maindata-grid"
            rows={immunizationData}
            columns={columns}
            getRowId={(row) => row.immunizationId}
            pageSizeOptions={[10, 20]}
            slots={{}}
            onRowSelectionModelChange={handleSelectionChange}
          />
        </div>
        <div className="flex justify-end p-4 space-x-4">
          <ActionButton
            buttonText="Save"
            handleSubmit={saveVaccination}
            width="fit-content"
          />
          <ActionButton
            buttonText="Clear"
            // handleSubmit={clearForm}
            color="red"
            width="fit-content"
          />
        </div>
      </div>
    </>
  );
}
