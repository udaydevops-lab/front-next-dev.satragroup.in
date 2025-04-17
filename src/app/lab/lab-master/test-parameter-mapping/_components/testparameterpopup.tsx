import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { Input } from "@material-tailwind/react";
import React, { FC, useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { GridColDef } from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import services from "@/app/utilities/services";
import { DeleteTestGroup } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";

interface Dataparam {
  fields: any;
  setFields: any;
  labservicelist: any;
  getLabServiceNameData: any;
  setParameterData: any;
  handleLabServiceNameChange: any;
  setLabServiceList: any;
  btntxt: any;
  setBtntxt: any;
  labparamList: any;
  parameterData: any;
  onSaveSubmit: any;
  onUpdateSubmit: any;
  handleClear: any;
  setkey1: any;
  handleSearchInputChange: any;
  key1: any;
  handleAdd: any;
}

const Testparameterpopup: FC<Dataparam> = ({
  fields,
  setFields,
  labservicelist,
  handleSearchInputChange,
  getLabServiceNameData,
  labparamList,
  onSaveSubmit,
  onUpdateSubmit,
  setParameterData,
  handleLabServiceNameChange,
  setkey1,
  handleAdd,
  handleClear,
  key1,
  parameterData,
  setLabServiceList,
  btntxt,
  setBtntxt,
}) => {
  // popup table columns
  const columns1: GridColDef[] = [
    {
      field: "sequenceOrderIdUi",
      headerName: "SNo",
      width: 150,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "parameter", headerName: "Parameter", width: 600 },
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
          {params.row.sequenceOrderIdUi !== parameterData.length && (
            <ExpandMore
              className="cursor-pointer"
              onClick={() => onDownArrow(params.row.sequenceOrderIdUi)}
            />

          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions ",
      width: 100,
      renderCell: (params: any) => (
        <>
          {!params.row.assignLabParameterItemId ? (
            <TrashIcon
              className="text-red-500 w-5 h-5 cursor-pointer"
              onClick={() => handlenewDelete(params.row)}
            />
          ) : (
            <TrashIcon
              className="text-red-500 w-5 h-5 cursor-pointer"
              onClick={() => handleDelete(params.row)}
            />
          )}
        </>
      ),
    },
  ];


  const onUpArrow = (sequenceOrderIdUi: any) => {
    const indexUp = parameterData.findIndex((item: any) => item.sequenceOrderIdUi == sequenceOrderIdUi);
    if (indexUp <= 0) return; // Prevent moving the first item up

    const paramArray = [...parameterData]; // Create a shallow copy
    const obj1 = paramArray[indexUp];
    paramArray[indexUp] = paramArray[indexUp - 1];
    paramArray[indexUp - 1] = obj1;
    paramArray.forEach((item: any, index: number) => {
      item.sequenceOrderIdUi = index + 1;
    });

    setParameterData(paramArray);
    setkey1((k: any) => k + 1);
  };

  // Function to handle moving a row down
  const onDownArrow = (sequenceOrderIdUi: any) => {
    const indexDown = parameterData.findIndex((item: any) => item.sequenceOrderIdUi == sequenceOrderIdUi);
    if (indexDown >= parameterData.length - 1) return; // Prevent moving the last item down

    const paramArray = [...parameterData]; // Create a shallow copy
    const obj1 = paramArray[indexDown];
    paramArray[indexDown] = paramArray[indexDown + 1];
    paramArray[indexDown + 1] = obj1;
    paramArray.forEach((item: any, index: number) => {
      item.sequenceOrderIdUi = index + 1;
    });

    setParameterData(paramArray);
    setkey1((k: any) => k + 1);
  };


  // //popup table UpArrow
  // const onUpArrow = (id: any) => {
  //   const indexUp = parameterData.findIndex((item: any) => item.id == id);
  //   const obj1 = parameterData[indexUp];
  //   const paramArray = parameterData;
  //   paramArray[indexUp] = paramArray[indexUp - 1];
  //   paramArray[indexUp - 1] = obj1;
  //   paramArray.map((item: any, index: any) => {
  //     item.id = index + 1;
  //   });
  //   setParameterData(paramArray);
  //   setkey1((k: any) => k + 1);
  // };

  // //popup table Down Arrow
  // const onDownArrow = (id: any) => {
  //   const indexDown = parameterData.findIndex((item: any) => item.id == id);
  //   const obj1 = parameterData[indexDown];
  //   const paramArray = parameterData;
  //   paramArray[indexDown] = paramArray[indexDown + 1];
  //   paramArray[indexDown + 1] = obj1;
  //   paramArray.map((item: any, index: any) => {
  //     item.id = index + 1;
  //   });
  //   setParameterData(paramArray);
  //   setkey1((k: any) => k + 1);
  // };

  // Delete function before save
  const handlenewDelete = (row: any) => {
    const data = parameterData.filter(
      (list: any) => list.rowid !== row.rowid
    );
    setParameterData(data)
  };

  // Delete function After save
  const handleDelete = (row: any) => {
    let HeaderId: any = fields.assignLabParameterHeaderId;
    let ItemId: any = row.assignLabParameterItemId;
    const obj = {};
    services
      .create(
        `${DeleteTestGroup}assignLabParameterHeaderId=${HeaderId}&assignLabParameterItemId=${ItemId}`,
        obj
      )
      .then((res) => {
        toast.success("successfully deleted");
        const updatedParameterData = parameterData.filter(
          (item: any) => item.assignLabParameterItemId !== ItemId
        );
        setParameterData(updatedParameterData);
      })
      .catch((err) => {
        toast.error("failed to delete");
        console.log(err);
      });
  };

  useEffect(() => {
    getLabServiceNameData();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap">
        <div className="w-1/2 p-2 newSelect">
          <ReactSelectBox
            options={labservicelist}
            label="Laboratory Service Name*"
            value={fields?.LabServicename}
            onChange={handleLabServiceNameChange}
            isSearchable={true}
            isDisabled={btntxt === "UPDATE" ? true : false}
          />
        </div>
        <div className="w-1/2 p-2">
          <Input
            label="Service Code"
            name="servicecode"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            value={fields?.servicecode}
          />
        </div>
        <div className="w-1/2 p-2">
          <Input
            label="Department"
            name="department"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            value={fields?.department}
          />
        </div>

        <div className="w-1/2 p-2">
          <Input
            label="Speciality"
            name="speciality"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            value={fields?.speciality}
          />
        </div>
        <div className="w-1/2 p-2 newSelect">
          <ReactSelectBox
            options={labparamList}
            label="Laboratory Parameter Name*"
            value={fields?.labParamname}
            onSearchInputChange={(e: any) => handleSearchInputChange(e)}
            onChange={(e: any) => {
              console.log("Laboratory Parameter Name", e)
              setFields({
                ...fields,
                labParamname: e,
              });
            }}
            isSearchable={true}
          />
        </div>

        <div className="w-1/2 p-2">
          <ActionButton
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            buttonText={"ADD"}
            handleSubmit={handleAdd}
            disabled={
              fields?.LabServicename && fields?.labParamname ? false : true
            }
          />
        </div>
      </div>
      <div className="data-grid-newThem mt-6" key={key1}>
        <ReactDatagrid rows={parameterData} columns={columns1} />
      </div>
      <div className="px-2 mt-4 flex items-center justify-end gap-4">
        {btntxt === "SAVE" ? (
          <ActionButton
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            buttonText={"SAVE"}
            handleSubmit={onSaveSubmit}
            disabled={parameterData.length > 0 ? false : true}
          />
        ) : (
          <ActionButton
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            buttonText={"UPDATE"}
            handleSubmit={onUpdateSubmit}
            disabled={parameterData.length > 0 ? false : true}
          />
        )}
        {btntxt === "UPDATE"?null:
          <ActionButton
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            buttonText={"CLEAR"}
            handleSubmit={handleClear}
          />
        }
      </div>
    </div>
  );
};

export default Testparameterpopup;
