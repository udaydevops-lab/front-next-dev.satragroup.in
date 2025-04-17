import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, SetStateAction, useState } from "react";
// import ActiveIcon from "../../../../../../public/icons/wellness-record/active-icon";
// import InactiveIcon from "../../../../../../public/icons/wellness-record/inactive-icon";
import { PencilIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import services from "@/app/utilities/services";
import { getEditID, statusFlagActive } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { speciallity } from "@/app/lab/_component/labJsonData";

interface Dataparam {
  paramFieldsClear: any;
  griddata: any;
  openPopup: any;
  setGridData: Dispatch<SetStateAction<any>>;
  handleSearch: any;
  handleChange: any;
  setFields: any;
  fields: any;
  btntxt: any;
  handleEdit: any;
  setbtntxt:Dispatch<SetStateAction<any>>
}
const RadiologyEquipgrid: React.FC<Dataparam> = ({
  griddata,
  handleEdit,
  openPopup,
  fields,
  btntxt,
  setbtntxt,
  setGridData,
  handleSearch,
  setFields,
  handleChange,
}) => {
 
  //Main Page Table
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
   
    {
      field: "serviceDesc",
      headerName: " Description",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 200,
      renderCell: (params: any) => (
        <div
          className="cursor-pointer"
          onClick={() => handleStatus(params.row, griddata)}
        >
          {params.row.statusFlag === 0 ? "InActive" : "Active"}
        </div>
      ),
    },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 200,
      renderCell: () => moment().format("DD-MM-YYYY"),
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      width: 200,
    },
    {
      field: "lastModifiedBy",
      headerName: "Last Modified By",
      width: 200,
    },
    {
      field: "Edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params: any) => (
        <div className="w-full flex  items-center">
          <div className="flex justify-center">
            <PencilIcon
              onClick={() => handleEdit(params.row)}
              className="w-5 h-5px-2 py-1 cursor-pointer text-blue-500"
            />
          </div>

          {/* <div onClick={(e: any) => handleActive(params.row)}>
            {params.row.statusFlag === 0 ? <InactiveIcon /> : <ActiveIcon />}
          </div> */}
        </div>
      ),
    },
  ];

  //handle status
  const handleStatus = (param: any, data: any) => {
    let index = data.findIndex((item: any) => item.sno == param.sno);
    data[index].status = !data[index].status;
  };

  //handle Edit
 
  const handleActive = (row: any) => {
    // let message =
    //   row.statusFlag == "1" ? "InActived Successfully" : "Actived Successfully";
    // let id = row.assignLabParameterHeaderId;
    // let statusFlag = row.statusFlag == "1" ? "0" : "1";
    // services
    //   .create(
    //     `${statusFlagActive}statusFlag=${statusFlag}&assignLabParameterHeaderId=${id}`,
    //     {}
    //   )
    //   .then((response) => {
    //     toast.success(message);
    //   })
    //   .catch((err: any) => {
    //     console.log(err.message);
    //   });
    // handleSearch();
  };

  return (
    <div className="px-4 m-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="data-grid-newThem">
        <ReactDatagrid rows={griddata} columns={columns} />
      </div>
    </div>
  );
};

export default RadiologyEquipgrid;
