import * as React from "react";
import { DataGrid, GridColDef ,GridToolbar} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

export interface RowData {
  id: number;
  name: string;
  age: string;
  city: string;
  gender: string;
}

export interface DataTableProps {
  data: RowData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DataGridComponent: React.FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 ,
    renderCell: (params: any) => (
      <>
        <button
          style={{ marginRight: 10 ,textDecoration:"underlined"}}
          onClick={() => handleRowClick(params)}
        >
          {params.value}
        </button>
      </>
    ),},
    { field: "age", headerName: "Age", width: 150 },
    { field: "city", headerName: "City", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <button
            style={{ marginRight: 10 }}
            onClick={() => onEdit(params.row.id)}
          >
            Edit
          </button>
          <button onClick={() => onDelete(params.row.id)}>Delete</button>
        </>
      ),
    },
  ];
  const router = useRouter()
const handleRowClick=(params:any) =>{
  router.replace("/patient/patient-Registration")
}

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={data} columns={columns} pageSizeOptions={[10,20]} checkboxSelection   slots={{ toolbar: GridToolbar }}/>
    </div>
  );
};

export default DataGridComponent;
