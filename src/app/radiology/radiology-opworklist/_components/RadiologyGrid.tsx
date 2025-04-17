import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { getContent } from "./RadiologyUtils";
import { RadiologyGridProps } from "./RadiologyInterfaces";
import { useRouter } from "next/navigation";
import moment, { duration } from "moment";
import services from "@/app/utilities/services";
import { getRadiologyMoreDetails } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";

function RadiologyGridField({ data }: RadiologyGridProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 50 },
    {
      field: "MRN",
      headerName: "Patient MRN",
      width: 140,
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      width: 140,
    },
    {
      field: "serviceDesc",
      headerName: "Service Name",
      width: 300,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      width: 180,
      renderCell: (params: any) => (
        <div
          className="underline cursor-pointer text-blue-500"
          onClick={() => handleAcc(params.row)}
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
        // <div
        //   className="underline cursor-pointer text-blue-500"
        //   onClick={() => handleAcc(params.row)}
        // >
        <>
          {params.row.accessionNum}
        </>
        //  </div>
      ),
    },
    {
      field: "superSpecialityDesc",
      headerName: "Speciality",
      width: 120,
    },
    {
      field: "dateAndTime",
      headerName: "Order Date&Time",
      width: 150,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY HH:mm")}</>
      ),
    },
    {
      field: "status",
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
          content={billId == params.row.orderId ? billDetails : "View Details"}
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
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  const [formData, setFormData] = useState<any>({});
  const handleAcc = (data: any) => {
    router.push(`/radiology/${0}/${data.orderId}/order-details`); //should pass patId and encounter Id
    setFormData(data);
    handleOpen();
  };
  const [billDetails, setBillDetails] = useState<any>(<></>);
  const [billId, setBillId] = useState("");
  const getBillDetails = (data: any) => {
    services
      .get(getRadiologyMoreDetails + data.orderId + "/" + data.status)
      .then((response) => {
        setBillId(data.orderId);
        let obj = JSON.parse(response.data.allServiceDetails);
        obj.billDate = moment(obj.billDate).format("YYYY-MM-DD HH:mm");
        if (response.data.allRadiologyOrderDataByParentId.length > 0) {
          let recordedBy =
            response.data.allRadiologyOrderDataByParentId[0].recordBy;
          obj.recordedBy = recordedBy;
          obj.recordedDateTime = moment(
            response.data.allRadiologyOrderDataByParentId[0].recordedDateTime
          ).format("YYYY-MM-DD HH:mm");
        }
        setBillDetails(getContent({ row: obj }));
      })
      .catch((error) => {
        toast.error("Technical error");
      });
  };
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="data-grid-newThem">
        <ReactDatagrid rows={data} columns={columns} />
      </div>
    </div>
  );
}

export default RadiologyGridField;
