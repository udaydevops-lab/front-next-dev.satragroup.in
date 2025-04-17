"use client";
import ActionButton from "@/app/_common/button";
import { TabPageTitle } from "@/app/lab/_component";
import React, { useEffect, useState } from "react";
import DoctorMappingGrid from "./_components/DoctorMappingGrid";
import { PencilIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { GridColDef } from "@mui/x-data-grid";
import services from "@/app/utilities/services";
import { getAllProceduresDoctormapping } from "@/app/utilities/api-urls";
import { Options } from "react-tailwindcss-select/dist/components/type";

const ProceduresSpecialtyDoctorMapping = () => {
  const [formData, setFormData] = useState({
    popUp: false,
    action: "new", ///new||update
    doctorsList: [] as Options,
    departmentList: [] as Options,
    department: "",
    doctors: null,
    formGrid: [],
    loader:false
  });
  const [gridData, setGridData] = useState<any>([]);
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 90 },
    { field: "departmentDesc", headerName: "Department", width: 320 },
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
          onClick={() => handleEdit(params.row)}
        />
      ),
    },
  ];
  const handleEdit = (row: any) => {
    const data = row.technicianList;
    const doctorsList = data.map((item: any) => ({
      value: item.empId,
      label: item.doctorName,
    }));
    setFormData({
      ...formData,
      department: { value: row.departmentCode, label: row.departmentDesc } as any,
      action: "update",
      popUp: true,
      doctors:doctorsList,
      formGrid: row.technicianList,
    });
  };
  const getAllData = () => {
    services.get(getAllProceduresDoctormapping).then((response) => {
      let data = response.data;
      let arr: any = [];
      data.forEach((item: any) => {
        let obj = {
          ...item.technicianList[0],
          technicianList: item.technicianList,
        };
        arr.push(obj);
      });
      setGridData(arr);
    });
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <div>
      <div className="w-full flex justify-between mt-2">
        <TabPageTitle title="Specialty - Doctor Mapping" />
        <div>
          <div className="flex w-full gap-4">
            <div className="w-1/2 newSelect"></div>
            <div className="w-1/2 flex gap-4 justify-end">
              <ActionButton
                buttonText="New"
                handleSubmit={() => {
                  setFormData({ ...formData,doctors: null,department:"",formGrid:[], action: "new", popUp: true });
                }}
                width="w-[220px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <DoctorMappingGrid
          columns={columns}
          gridData={gridData}
          formData={formData}
          getAllData={getAllData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default ProceduresSpecialtyDoctorMapping;
