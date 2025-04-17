import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";

export default function OrderGrid({ data }: any) {
  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 200 },
    {
      field: "departmentDesc",
      headerName: "Department",
      width: 200,
    },
    // {
    //   field: "specialityDesc",
    //   headerName: "Speciality",
    //   width: 200,
    // },
    // {
    //   field: "modality",
    //   headerName: "Modality",
    //   width: 150,
    // },
    {
      field: "serviceDesc",
      headerName: "Service Name",
      width: 200,
    },
    {
      field: "accessionNum",
      headerName: "Accession No ",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
  ];
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="data-grid-newThem">
        <ReactDatagrid rows={data} columns={columns} />
      </div>
      {/* <div className="grid grid-cols-2">
        <div>
          <h4 className="font-semibold text-gray-700 text-lg">Instructions to Technician</h4>
          <ul className="ms-5" style={{listStyleType:"initial"}}>
            <li> */}
      {/* Please be aware that radiology should be done to his legs */}
      {/* </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 text-lg">Instructions to Patient</h4>
          <ul className="ms-5" style={{listStyleType:"initial"}}>
            <li>
                {/* Please make sure you are not drunk during X ray  */}
      {/* </li>
          </ul>
        // </div> */}
      {/* </div> */}

    </div>
  );
}
