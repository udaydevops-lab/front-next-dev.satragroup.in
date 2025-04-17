import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import React, { useState } from "react";
import { GridProps, getContent } from "./utils";
import { GridColDef } from "@mui/x-data-grid";
import PopUp from "./popUp";
import moment from "moment";
import services from "@/app/utilities/services";
import { getMoreDetails } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function GridField({ data, getGridData }: GridProps) {
  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "mrn",
      headerName: "Patient MRN",
      width: 150,
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      width: 180,
    },
    {
      field: "serviceDesc",
      headerName: "Service Name",
      width: 150,
    },
    {
      field: "labOrderId",
      headerName: "Lab order ID",
      width: 170,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      width: 150,
      renderCell: (params: any) => (
        <div
          className="underline cursor-pointer text-blue-300"
          onClick={() => router.push(`/lab/laboratory-worklist/${params.row.patientId}/${params.row.encounterId}/${params.row.orderId}/result`)}
        >
          {params.row.orderId}
        </div>
      ),
    },
    {
      field: "accessionNum",
      headerName: "Accession No ",
      width: 130,
      renderCell: (params: any) => (
        <div
          className="underline cursor-pointer text-blue-300"
          onClick={() => handleAcc(params.row)}
        >
          {params.row.accessionNum}
        </div>
      ),
    },
    {
      field: "containerName",
      headerName: "Container",
      width: 120,
    },
    {
      field: "orderDateTime",
      headerName: "Order Date&Time",
      width: 170,
      renderCell: (params: any) => (
        <div>{params.row.orderDateTime && moment(params.row.orderDateTime).format("DD/MM/YYYY HH:mm")}</div>
      ),
    },
    {
      field: "collectionStatus",
      headerName: "Order Status",
      width: 150,
    },
    {
      field: "moreDetails",
      headerName: "More Details",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <Tooltip
          content={
            billId == params.row.orderId ? billDetails : "View Details"
          }
          className="border text-black border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
          placement="left"
        >
          <div>
            <EyeIcon
              onClick={() => getBillDetails(params.row)}
              className="cursor-pointer"
              width={25}
              height={20}
            />
          </div>
        </Tooltip>
      ),
    },
  ];
  const [billDetails, setBillDetails] = useState<any>(<></>);
  const [billId, setBillId] = useState("");
  const getBillDetails = (data: any) => {
    services
      .get(getMoreDetails + data.labOrderId + "/" + data.orderId)
      .then((response) => {
        response.data.collectedDate=response.data.collectedDate?moment(response.data.collectedDate).format("YYYY-MM-DD HH:mm"):null
        response.data.recievedDate=response.data.recievedDate?moment(response.data.recievedDate).format("YYYY-MM-DD HH:mm"):null
        setBillDetails(getContent(response.data));
        setBillId(data.orderId);
      })
      .catch((error) => {
        toast.error("Technical error");
      });
  };
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  const [formData, setFormData] = useState<any>({});
  const handleAcc = (data: any) => {
    setFormData(data);
    handleOpen();
  };
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="data-grid-newThem h-[400px]">
        <ReactDatagrid rows={data} columns={columns} />
      </div>
      <div>
        <PopUp
          state={formData}
          setState={setFormData}
          handleOpen={handleOpen}
          open={open}
          getGridData={getGridData}
        />
      </div>
    </div>
  );
}

export default GridField;
