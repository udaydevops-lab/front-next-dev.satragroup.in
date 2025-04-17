import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  radiologyResultEntryBulkVerify,
  verifyLabResultEntry,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface BulkVerifyGridProps {
  gridData: any;
  verifyedBy: any;
  verifyedByVal: any;
  setVerifyedByVal: any;
  getAllresultVerifyGridData: any;
}

const BulkVerifyGrid: FC<BulkVerifyGridProps> = ({
  gridData,
  verifyedBy,
  verifyedByVal,
  setVerifyedByVal,
  getAllresultVerifyGridData,
}) => {
  //  const [verifyedByData, SetVerifyedByData] = useState<any>()
  const [selectedRows, setSelectedRows] = useState<any>([]);
  let headers = getHeaderResponse();
  const router = useRouter();
  //grid columns info
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S No",
      width: 50,
      renderCell: (params) => {
        const rowNumber = gridData.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      width: 130,
    },
    {
      field: "patientMrn",
      headerName: "Patient MRN",
      width: 130,
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      width: 220,
    },
    {
      field: "speciality",
      headerName: "Speciality",
      width: 150,
    },

    {
      field: "orderId",
      headerName: "Order Id",
      width: 160,
      renderCell: (params: any) => (
        <div
          className="underline cursor-pointer text-[15px] text-blue-500"
          onClick={() =>
            // router.push(
            //   `/lab/laboratory-worklist/${params.row.patientId}/${params.row.encounterId}/${params.row.orderId}/result`
            // )
            router.push(`/radiology/results/${params.row.orderId}/`)
          }
        >
          {params.row.orderId}
        </div>
      ),
    },
    {
      field: "accessionNum",
      headerName: "Accession No",
      width: 140,
    },

    {
      field: "orderDateTime",
      headerName: "Order Date & Time",
      width: 130,
      renderCell: (params: any) => (
        <>
          {params.row.examCompletedDateTime
            ? moment(params.row.examCompletedDateTime).format(
              "DD-MM-YYYY HH:mm"
            )
            : null}
        </>
      ),
    },

    {
      field: "generatedBy",
      headerName: "Recorded By",
      width: 120,
    },
    {
      field: "resultEntryStatus",
      headerName: "Status",
      width: 120,
    },
  ];

  // row id
  const getRowId = (row: any) => row.radiologyEnryHeaderId;

  // when click on check box for mark in Reason for visit class added
  const getRowClassName = (params: any) => {
    return params.row.isActive === 0 ? "disabled-row" : "";
  };
  // Function to handle the 'Verify' button click
  const handelVerify = () => {
    if (selectedRows?.length === 0) {
      toast.error("Please select the checkbox to be verified");
    } else if (!verifyedByVal) {
      toast.error("Please select the verified by");
    } else {
      const postObj = selectedRows.map((item: any) => ({
        orderId: item.orderId,
        radiologyEnryHeaderId: item.radiologyEnryHeaderId,
        verifiedBy: verifyedByVal.label,
      }));

      console.log(postObj);
      services
        .create(radiologyResultEntryBulkVerify, postObj, headers)
        .then((res) => {
          toast.success("successfully verified the records");
          getAllresultVerifyGridData();
        })
        .catch((error) => {
          console.log(error);
          toast.error("something went wrong please try again");
        });
    }
  };

  // Function to handle row selection
  const handleRowSelection = (newSelection: any) => {
    const selectedRowData = newSelection.map((id: any) =>
      gridData.find((row: any) => getRowId(row) === id)
    );
    setSelectedRows(selectedRowData);
  };

  // Function to determine if a row is selectable based on its status
  const isRowSelectable = (params: any) => {
    return params?.row?.resultEntryStatus?.toLowerCase() !== "result verified";
    //resultEntryStatus": "Result Verified",
  };
  return (
    <div className="w-full bg-white px-3 pb-6 rounded-md">
      <div className="data-grid-newThem">
        <DataGrid
          rows={gridData}
          columns={columns}
          getRowId={getRowId}
          pageSizeOptions={[10, 20]}
          getRowClassName={getRowClassName}
          className="px-0"
          checkboxSelection={true}
          onRowSelectionModelChange={(newSelection) =>
            handleRowSelection(newSelection)
          }
          isRowSelectable={isRowSelectable}
          density="compact"
          autoHeight
        />
      </div>
      <div className="w-full flex justify-between gap-4 mt-4">
        <div className="w-[250px]">
          <ReactSelectBox
            value={verifyedByVal}
            options={verifyedBy}
            onChange={(e: any) => setVerifyedByVal(e)}
            label={"Verified By"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full newBtn-theme">
            <ActionButton
              buttonText="Bulk Verify"
              handleSubmit={handelVerify}
              width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
          <div className="w-full newBtn-theme">
            <ActionButton
              buttonText="Clear"
              // handleSubmit={resetFun}
              width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkVerifyGrid;
