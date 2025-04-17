"use client";
import React, { useEffect, useState } from "react";
import TechnicianMapGrid from "./_components/TechnicianMapGrid";
import ActionButton from "@/app/_common/button";
import { TabPageTitle } from "@/app/lab/_component";
import { getMainGridColumns } from "./_components/Utils";
import services from "@/app/utilities/services";
import { getAllProcedureTechnicianMapping } from "@/app/utilities/api-urls";

const ProceduresTechnicianMapping = () => {
  const [formData, setFormData] = useState({
    popUp: false,
    action: "new", ///new||update
    department: "",
    technicians: null,
    formGrid: [],
    loader: false,
  });
  const [gridData, setGridData] = useState<any>([]);
  const handleEdit = (row: any) => {
    const data = row.technicianList;
    const techniciansList = data.map((item: any) => ({
      value: item.empId,
      label: item.technicianName,
    }));
    setFormData({
      ...formData,
      department: { value: row.departmentCode, label: row.departmentDesc } as any,
      action: "update",
      popUp: true,
      technicians:techniciansList,
      formGrid: row.technicianList,
    });
  };
  const getAllData = () => {
    services.get(getAllProcedureTechnicianMapping).then((response) => {
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
        <TabPageTitle title="Technician Mapping" />
        <div>
          <div className="flex w-full gap-4">
            <div className="w-1/2 newSelect"></div>
            <div className="w-1/2 flex gap-4 justify-end">
              <ActionButton
                buttonText="New"
                handleSubmit={() => {
                  setFormData({
                    ...formData,
                    technicians: null,
                    department: "",
                    formGrid: [],
                    action: "new",
                    popUp: true,
                  });
                }}
                width="w-[220px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <TechnicianMapGrid
          columns={getMainGridColumns(handleEdit)}
          gridData={gridData}
          formData={formData}
          getAllData={getAllData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default ProceduresTechnicianMapping;
