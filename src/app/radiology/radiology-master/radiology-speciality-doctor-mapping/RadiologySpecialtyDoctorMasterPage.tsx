"use client";
import { TabPageTitle } from "@/app/lab/_component";
import React, { useEffect, useReducer } from "react";
import RadiologyDoctorMasterForm from "./components/RadiologyDoctorMasterForm";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import RadiologyDoctorCreation from "./components/RadiologyDoctorCreation";
import {
  RadiologyDoctorMasterReducer,
  RadiologyInitialState,
} from "./components/RadiologyDoctorMasterReducer";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { PencilIcon } from "@heroicons/react/24/solid";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import { ApiRequestMethod } from "@/app/_commonfeatures/ApiRequestFun";
import {
  getAllRadiologyDoctorMapping,
  getRadiologyDoctors,
  getRadiologySpeciality,
} from "@/app/utilities/api-urls";

const RadiologySpecialtyDoctorMasterPage = () => {
  const [state, dispatch] = useReducer(
    RadiologyDoctorMasterReducer,
    RadiologyInitialState
  );

  const changeConvertIntoselectKey = (data: any) => {
    const result: any = data.map((list: any) => {
      return {
        ...list,
        label: list.specialityDescription
          ? list.specialityDescription
          : list.firstName,
        value: list.specialityCode ? list.specialityCode : list.employeeId,
      };
    });
    return result;
  };

  const getApiesData = async (keyName: string, apieUrl: any) => {
    const response: any = await ApiRequestMethod({
      method: "GET",
      url: apieUrl,
    });
    let data: any = response?.data?.data ? response?.data?.data : [];
    const convertIntoselectkeys: any = changeConvertIntoselectKey(data);
    console.log("dfsdf", convertIntoselectkeys);
    dispatch({
      type: "getApis",
      payload: {
        [`${keyName}`]: convertIntoselectkeys,
      },
    });
  };

  const editDetails = (data: any) => {
    let newArr: [] = data.technicianList.map((item: any) => {
      return {
        id: Math.random(),
        specialityCode: item.radSpecialityCode,
        specialityDescription: item.radSpecialityDesc,
        departmentCode: item.departmentCode,
        departmentDesc: item.departmentDesc,
        firstName: item.doctorName,
        empId: item.empId,
        value: item?.empId,
        label: item?.doctorName,
        radDocMapId: item?.radDocMapId,
      };
    });
    dispatch({
      type: "fieldVal",
      payload: {
        rowData: data,
      },
    });
    dispatch({
      type: "dialogPop",
      payload: {
        open: true,
      },
    });
    let radiologySpecialtyData = state?.getAppApi?.radspecDd.filter(
      (item: any) => item.label === data.radSpecialityDesc
    )[0];

    dispatch({
      type: "fieldVal",
      payload: {
        radDocMapId: data?.radDocMapId,
        radSpecialtySearch: {
          value: radiologySpecialtyData.value,
          label: radiologySpecialtyData.label,
        },
        radDeptDoctorsSearch: data.technicianList.map((item: any) => ({
          ...item,
          value: item?.empId,
          label: item?.doctorName,
        })),
        addListValues: newArr,
      },
    });
  };

  const updateUserStatusflag = async (id: any, status: any) => { };

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 90 },
    { field: "radSpecialityDesc", headerName: "Specialty", width: 320 },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 150,
      renderCell: (params: any) => {
        return moment(params.row.generatedDate).format("DD-MM-YYYY");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: any) => (
        <PencilIcon
          className="text-blue-500 w-10 h-5 cursor-pointer"
          onClick={() => editDetails(params.row)}
        />
      ),
    },
  ];

  const getAllGridData = async () => {
    const response: any = await ApiRequestMethod({
      method: "GET",
      url: getAllRadiologyDoctorMapping,
    });
    dispatch({
      type: "getApis",
      payload: {
        radDoctorGriddata: response?.data?.data,
      },
    });
  };

  useEffect(() => {
    getApiesData("radspecDd", getRadiologySpeciality);
    getApiesData("radDeptDocDd", getRadiologyDoctors);
    getAllGridData();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-between mt-2">
        <TabPageTitle title="Radiology Specialty - Doctor Mapping" />
        <RadiologyDoctorMasterForm state={state} dispatch={dispatch} />
      </div>
      <div className="w-full px-3 pb-3 pt-1 mt-5 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem">
        <ReactCommonDialog
          dialogtitle={"Radiology Specialty - Doctor Mapping"}
          open={state.popup.open}
          size={"lg"}
          handler={() => {
            // dispatch({
            //   type: "dialogPop",
            //   payload: {
            //     open: false,
            //   },
            // });
          }}
          popupClose={() => {
            dispatch({
              type: "dialogPop",
              payload: {
                open: false,
              },
            });
          }}
          Content={
            <RadiologyDoctorCreation
              state={state}
              dispatch={dispatch}
              getAllGridData={getAllGridData}
            />
          }
        />
        <div className="data-grid-newThem mt-2">
          <ReactDatagrid
            rows={state.getAppApi.radDoctorGriddata}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};

export default RadiologySpecialtyDoctorMasterPage;
