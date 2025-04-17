import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import InactiveIcon from "../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../public/icons/wellness-record/active-icon";

export const getMainColumns = (
  handleToggle: (data: any) => void,
  editRow: (data: any) => void
) => {
  return [
    {
      field: "id",
      headerName: "S.no",
      width: 70,
    },
    {
      field: "procedureParameterDescription",
      headerName: "Parameter Name",
      width: 400,
    },
    {
      field: "procedureParameterCode",
      headerName: "Parameter Code",
      width: 250,
    },
    {
      field: "orderingDr",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <div className='flex gap-4 items-center w-[80px] justify-end'>
            <div className='flex justify-center'>
                {params.row.statusFlag === 1 ?
                    <PencilIcon
                        onClick={(e: any) => editRow(params.row)}
                        className="w-5 h-5 cursor-pointer text-blue-500"
                    />

                    : ""}
            </div>
            <div className="cursor-pointer" onClick={(e: any) => handleToggle(params.row)}>
                {params.row.statusFlag === 0 ? (
                    <InactiveIcon />
                ) : (
                    <ActiveIcon />
                )}
            </div>
        </div>

    ),
    },
  ] as GridColDef[];
};
export const getFormColumns = (deleteRow: (data: any) => void) => {
  return [
    {
      field: "id",
      headerName: "S.no",
      width: 70,
    },
    {
      field: "terminologyType",
      headerName: "Terminology Type",
      width: 250,
    },
    {
      field: "terminologyDesc",
      headerName: "Terminology Code-Description",
      width: 400,
    },
    {
      field: "orderingDr",
      headerName: "Actions",
      width: 90,
      renderCell: (params: any) => (
        <>
          <div className="cursor-pointer flex justify-center gap-3">
            <div
              className="cursor-pointer"
              onClick={() => {
                deleteRow(params.row);
              }}
            >
              <TrashIcon className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </>
      ),
    },
  ] as GridColDef[];
};
export const resultTypeList: any = [
  { label: "Number", value: "number" },
  { label: "String", value: "string" },
  { label: "Multiline rich textbox", value: "textbox" },
  { label: "Images", value: "file" },
  { label: "List", value: "list" },
];
