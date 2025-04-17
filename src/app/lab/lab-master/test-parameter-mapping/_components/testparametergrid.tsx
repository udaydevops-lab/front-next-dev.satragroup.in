import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { PencilIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import InactiveIcon from "../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../public/icons/wellness-record/active-icon";
import moment from "moment";
import { toast } from "react-toastify";
import services from "@/app/utilities/services";
import { statusFlagActive } from "@/app/utilities/api-urls";

interface Dataparam {
  gridData: any;
  handleEdit: any;
  handleSearch: any;
  getgridData: any;
}
const Testparametergrid: React.FC<Dataparam> = ({
  gridData,
  handleEdit,
  getgridData,
  handleSearch,
}) => {
  const columns1: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "serviceCode",
      headerName: "Service Code",
      width: 120,
    },
    {
      field: "serviceDesc",
      headerName: "Service Description",
      width: 300,
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      renderCell: (params: any) => (
        <div
          className="cursor-pointer"
          onClick={() => handleStatus(params.row, gridData)}
        >
          {params.row.statusFlag === 0 ? (
            <div className="text-red-600">Inactive</div>
          ) : (
            <div className="text-green-600">Active</div>
          )}
        </div>
      ),
    },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 110,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "updatedDate",
      headerName: "Modified Date",
      width: 100,
      renderCell: (params: any) => (
        <>
          {params.row.updatedDate &&
            moment(params.row.updatedDate).format("DD-MM-YYYY")}
        </>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Recorded By",
      width: 130,
  },

    {
      field: "Edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params: any) => (
        <div className='w-[100px] flex items-center mt-2 justify-end gap-4'>
          {/* <div className="flex justify-center"> */}
            {params.row.statusFlag === 0 ? (
              ""
            ) : (
              <PencilIcon
                onClick={() => handleEdit(params.row)}
                className="w-5 h-5px-2 py-1 cursor-pointer text-blue-500"
              />
            )}
          {/* </div> */}

          <div onClick={(e: any) => handleActive(params.row)}>
            {params.row.statusFlag === 0 ? <InactiveIcon /> : <ActiveIcon />}
          </div>
        </div>
      ),
    },
  ];

  //handle status
  const handleStatus = (param: any, data: any) => {
    let index = data.findIndex((item: any) => item.sno == param.sno);
    data[index].status = !data[index].status;
  };

  //handle Active
  const handleActive = (row: any) => {
    let message =
      row.statusFlag == 1 ? "InActived Successfully" : "Actived Successfully";
    let id = row.assignLabParameterHeaderId;
    let statusFlag = row.statusFlag == 1 ? 0 : 1;
    services
      .create(
        `${statusFlagActive}statusFlag=${statusFlag}&assignLabParameterHeaderId=${id}`,
        {}
      )
      .then((response) => {
        toast.success(message);
        getgridData();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    handleSearch();
  };

  return (
    <div>
      <div className="px-4 m-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="data-grid-newThem">
          <ReactDatagrid rows={gridData} columns={columns1} />
        </div>
      </div>
    </div>
  );
};

export default Testparametergrid;
