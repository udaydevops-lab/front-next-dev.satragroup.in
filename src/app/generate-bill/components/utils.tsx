import { getLoginResponse } from "@/app/_commonfeatures/header";
import { GridColDef } from "@mui/x-data-grid";

export const getServiceColumns = () => {
  const loginResp = getLoginResponse();
  if (loginResp.billingGstIncluded == 0) {
    return [
      {
        field: "id",
        headerName: "S.No",
        width: 30,
      },
      {
        field: "servicename",
        headerName: "Service name",
        width: 250,
      },
      {
        field: "charge",
        headerName: "Charge",
        width: 70,
      },
      {
        field: "discount",
        headerName: "Discount",
        width: 70,
      },
      {
        field: "gst",
        headerName: `GST`,
        width: 40,
      },
      {
        field: "netAmount",
        headerName: "Net Amt.",
        width: 70,
      },
    ] as GridColDef[];
  } else {
    return [
      {
        field: "id",
        headerName: "S.No",
        width: 30,
      },
      {
        field: "servicename",
        headerName: "Service name",
        width: 250,
      },
      {
        field: "charge",
        headerName: "Charge",
        width: 70,
      },
      {
        field: "discount",
        headerName: "Discount",
        width: 70,
      },
      {
        field: "netAmount",
        headerName: "Net Amt.",
        width: 70,
      },
    ] as GridColDef[];
  }
};
