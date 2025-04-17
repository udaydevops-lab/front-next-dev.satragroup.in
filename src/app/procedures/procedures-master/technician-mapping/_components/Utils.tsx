import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";

export const getMainGridColumns = (handleEdit: (data: any) => void) => {
  return [
    { field: "id", headerName: "S.no", width: 90 },
    { field: "departmentDesc", headerName: "Department", width: 320 },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 150,
      renderCell: (params: any) => {
        return moment(params.row.generatedDate).format("DD-MM-YYYY");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: any) => (
        <PencilIcon
          className="text-blue-500 w-10 h-5 cursor-pointer"
            onClick={() => handleEdit(params.row)}
        />
      ),
    },
  ] as GridColDef[];
};

export const getFormGridColumns = (deleteList: (data: any) => void) => {
  return [
    { field: "id", headerName: "S.no", width: 90 },
    {
      field: "departmentDesc",
      headerName: "Department",
      width: 300,
    },
    { field: "technicianName", headerName: "Technician", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params: any) => (
        <>
          <div
            className="cursor-pointer"
            onClick={() => {
              deleteList(params.row);
            }}
          >
            <TrashIcon className="w-5 h-5 text-red-500" />
          </div>
        </>
      ),
    },
  ] as GridColDef[];
};
export const techList = [
  {
    label: "Raju",
    value: 1,
  },
  {
    label: "Mahesh",
    value: 2,
  },
  {
    label: "Harish",
    value: 3,
  },
  {
    label: "Pavan",
    value: 4,
  },
  {
    label: "Vasudev",
    value: 5,
  },
  {
    label: "Laxmi",
    value: 6,
  },
  {
    label: "Praveen",
    value: 7,
  },
];
