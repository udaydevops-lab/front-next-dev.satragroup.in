"use client";
import React, { useEffect, useState } from "react";
import Select from "../_common/select";
import { useForm } from "react-hook-form";
import ActionButton from "../_common/button";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  getAllDepartments,
  getDepartmentPrac,
  getPhysBasedOnDept,
} from "../utilities/api-urls";
import services from "../utilities/services";
import { getLocalItem } from "../utilities/local";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  DatePicker,
  LocalizationProvider,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loader from "../_common/loader";
import NewAutocomplete from "../_common/new-autocomplete";
import { getHeaderResponse } from "../_commonfeatures/header";

export default function DeptWisePhysicianLayout() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
    control,
  } = useForm();
  const [departmentlist, setDepartmentlist] = useState([]);
  const [selectedPractioner, setSelectedPractioner] = useState([]);
  const [selectedPractionerList, setSelectedPractionerList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(2);
  useEffect(() => {
    setLoading(true);
    services
      .get(getAllDepartments)
      .then((response) => {
        setLoading(false);
        setDepartmentlist(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    getPractValues(deptCode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptCode]);
  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 100 },
    { field: "departmentName", headerName: "Department Name", width: 120 },
    { field: "doctorName", headerName: "Physician Name", width: 120 },
    { field: "licenceNum", headerName: "License Number", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "practitionerRole", headerName: "Practitioner Role", width: 100 },
    { field: "opdCalendarDays", headerName: "OPD Calender Days", width: 100 },
    {
      field: "apptCalendar",
      headerName: "Appt.Calendar",
      width: 100,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker />
        </LocalizationProvider>
      ),
    },
  ];
  const headers = getHeaderResponse();

  const handledepartmentDropdown = (selectedValue: any) => {
    if (selectedValue) {
      let val = selectedValue[0]?.departmentCode;
      setDeptCode(val);
      setSelectedDepartment(selectedValue);
    }
  };

  const getPractValues = (deptCode: string) => {
    setLoading(true);
    services
      .get(getDepartmentPrac + deptCode + "/1", headers)
      .then((response) => {
        setLoading(false);
        setSelectedPractionerList(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  const handlepractionerDropdown = (selectedValue: any) => {
    if (selectedValue) {
      let val = selectedValue[0]?.lastName;
      setSelectedPractioner(val);
    }
  };

  const submitData = () => {
    setLoading(true);
    services
      .get(getPhysBasedOnDept + deptCode + "&physician=" + selectedPractioner)
      .then((response) => {
        setLoading(false);
        setSearchData(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  const clearForm = () => {
    reset();
    setKey((k) => k + 1);
  };
  return (
    <div className="block">
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>Department Wise Physicians Search</h1>
      </div>
      <div className="w-full mx-auto px-3">
        <div key={key} className="bg-gray-100 w-full mx-auto">
          <div className="px-4 bg-white rounded-curve md:pt-3 mb-4 rounded-curve mx-auto w-full border border-stroke">
            <div className="-mx-3 md:flex py-2">
              <div className="md:w-1/4 px-3 my-2">
                <NewAutocomplete
                  options={departmentlist}
                  getSelectedItems={handledepartmentDropdown}
                  label="Department"
                  desc="departmentDescription"
                />
              </div>
              <div className="md:w-1/4 px-3 my-2">
                <NewAutocomplete
                  options={selectedPractionerList}
                  getSelectedItems={handlepractionerDropdown}
                  label="Practitioner"
                  desc="lastName"
                />
                {/* <Select
                  control={control}
                  label="Practitioner"
                  name="practitioner"
                  listItems={selectedPractionerList}
                  handleChange={handlepractionerDropdown}
                  required={true}
                  keyValue="lastName"
                  displayValue="lastName"
                /> */}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-x-6 pb-4">
              <ActionButton
                buttonText="Search"
                handleSubmit={submitData}
                width="fit-content"
              />
              <ActionButton
                buttonText="RESET"
                handleSubmit={clearForm}
                color="red"
                width="fit-content"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-100 w-full mx-auto">
          <div className="flex flex-wrap  -mx-3">
            <div className="w-full max-w-full px-3 flex-0 mb-4 ">
              <div className="p-4 bg-white rounded-curve  rounded-curve mx-auto w-full border border-stroke">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid">
                  <h5 className="mb-0 dark:text-white">
                    <div>
                      <DataGrid
                        autoHeight
                        rows={searchData}
                        columns={columns}
                        pageSizeOptions={[10, 20]}
                        checkboxSelection
                        slots={{ toolbar: GridToolbar }}
                      />
                    </div>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
