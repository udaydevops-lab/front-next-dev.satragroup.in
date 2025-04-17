"use client";
import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import { GridColDef } from "@mui/x-data-grid";
import React, { FC } from "react";

interface DataTest {
  fields: any;
  setFields: any;
  serviceList: any;
  key1: any;
  setkey1: any;
  onUpdateSubmit: any;
  laboratoryServices: any;
  setLaboratoryServicesGrid: any;
  setLaboratoryServices: any;
  handleLabServiceAdd: any;
  laboratoryServicesGrid: any;
  handlelaboratoryServicesItemRemove: any;
  handleSave: any;
  handleClear: any;
  handlelaboratoryServicesItemDelete: any;
}
const LabTestPopup: FC<DataTest> = ({
  fields,
  setFields,
  setLaboratoryServicesGrid,
  handleLabServiceAdd,
  onUpdateSubmit,
  serviceList,
  key1,
  laboratoryServices,
  setkey1,
  setLaboratoryServices,
  laboratoryServicesGrid,
  handlelaboratoryServicesItemRemove,
  handleClear,
  handleSave,
  handlelaboratoryServicesItemDelete,
}) => {

  const handleservicename = (e: any) => {
    setFields({
      ...fields,
      servicename: e,
      servicecode: e.serviceCode,
      department: e.departmentDesc,
      speciality: e.superSpecialityDesc,
    });
  };
  const handlelabService = (e: any) => {};

  //laboratory Services Grid coloums info
  const columns: GridColDef[] = [
    {
      field: "sequenceOrderIdUi",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "serviceDesc",
      headerName: "laboratory Services Name",
      width: 450,
    },
    {
      field: "order",
      headerName: "Order",
      width: 100,
      renderCell: (params: any) => (
        <div className="flex flex-col">
        {params.row.sequenceOrderIdUi !== 1 && (
        <ExpandLessIcon
          className="cursor-pointer"
          onClick={() => onUpArrow(params.row.sequenceOrderIdUi)}
        />
      )}
      {params.row.sequenceOrderIdUi !== laboratoryServicesGrid.length && (
        <ExpandMore
          className="cursor-pointer"
          onClick={() => onDownArrow(params.row.sequenceOrderIdUi)}
          />
          
      )}
    </div>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row.labTestGroupItemId && params.row.labTestGroupItemId ? (
            <TrashIcon
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() =>
                handlelaboratoryServicesItemDelete(
                  params.row,
                  fields.labTestgroupHeaderId
                )
              }
            />
          ) : (
            <TrashIcon
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => handlelaboratoryServicesItemRemove(params.row)}
            />
          )}
        </>
      ),
    },
  ];

  //Up Arrow
  const onUpArrow = (sequenceOrderIdUi: any) => {
    const indexUp = laboratoryServicesGrid.findIndex(
      (item: any) => item.sequenceOrderIdUi === sequenceOrderIdUi
    );
  
    // Check if the index is within the bounds
    if (indexUp > 0) {
      const paramArray = [...laboratoryServicesGrid];
      const obj1 = paramArray[indexUp];
      paramArray[indexUp] = paramArray[indexUp - 1];
      paramArray[indexUp - 1] = obj1;
  
      // Update sequenceOrderIdUi for all items
      paramArray.forEach((item: any, index: any) => {
        item.sequenceOrderIdUi = index + 1;
      });
  
      setLaboratoryServicesGrid(paramArray);
      setkey1((k: any) => k + 1);
    }
  };

  //Down Arrow
  const onDownArrow = (sequenceOrderIdUi: any) => {
    const indexDown = laboratoryServicesGrid.findIndex(
      (item: any) => item.sequenceOrderIdUi === sequenceOrderIdUi
    );
  
    // Check if the index is within the bounds
    if (indexDown < laboratoryServicesGrid.length - 1) {
      const paramArray = [...laboratoryServicesGrid];
      const obj1 = paramArray[indexDown];
      paramArray[indexDown] = paramArray[indexDown + 1];
      paramArray[indexDown + 1] = obj1;
  
      // Update sequenceOrderIdUi for all items
      paramArray.forEach((item: any, index: any) => {
        item.sequenceOrderIdUi = index + 1;
      });
  
      setLaboratoryServicesGrid(paramArray);
      setkey1((k: any) => k + 1);
    }
  };
  

  return (
    <>
      <div className="w-full ">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <ReactSelectBox
              isSearchable={true}
              value={fields.servicename}
              options={serviceList}
              onChange={(e) => handleservicename(e)}
              label="Test Group Service Name"
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              value={fields.servicecode}
              label="Service Code"
              disabled={true}
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              value={fields.department}
              label="Department"
              disabled={true}
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              value={fields.speciality}
              label="Speciality"
              disabled={true}
            />
          </div>
        </div>
        <div className="w-full flex gap-4 mt-4">
          <div className="w-2/4">
            <ReactSelectBox
              isSearchable={true}
              value={laboratoryServices}
              options={serviceList}
              onChange={(e) => setLaboratoryServices(e)}
              label="Laboratory Services"
            />
          </div>
          <div className="w-2/4">
            <ActionButton
              buttonText="ADD"
              handleSubmit={() => handleLabServiceAdd(laboratoryServices)}
              width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
             
            />
          </div>
        </div>
        <div className="w-full mt-4">
          <div className="px-4 m-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
            <div className="data-grid-newThem">
              <ReactDatagrid rows={laboratoryServicesGrid} columns={columns} />
            </div>
          </div>
        </div>
        <div className="w-full flex gap-4 justify-end mt-4">
          {fields.labTestgroupHeaderId && fields.labTestgroupHeaderId ? (
            <ActionButton
              buttonText="UPDATE"
              handleSubmit={onUpdateSubmit}
              width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
          ) : (
            <ActionButton
              buttonText="SAVE"
              handleSubmit={handleSave}
              disabled={laboratoryServicesGrid.length>0?false:true}
              width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
          )}
          {fields.labTestgroupHeaderId?null:
          <ActionButton
            buttonText="CLEAR"
            handleSubmit={handleClear}
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />}
        </div>
      </div>
    </>
  );
};

export default LabTestPopup;
