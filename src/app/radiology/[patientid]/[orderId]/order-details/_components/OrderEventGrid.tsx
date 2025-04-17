import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React from 'react'

export default function OrderEventGrid({data}:any) {
  const columns: GridColDef[] = [
    { field: "sno", headerName: "SNO", width: 150,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
     },
    {
      field: "event",
      headerName: "Event",
      width: 200,
    },
    {
      field: "eventTime",
      headerName: "Event Time",
      width: 200,
      renderCell: (params: any) => (
        <>
           {params.row.eventTime?moment(params.row.eventTime).format("YYYY-MM-DD HH:mm"):""}
        </>
    ),
    },
    {
      field: "recordBy",
      headerName: "Recorded By",
      width: 150,
    },
    {
      field: "recordedDateTime",
      headerName: "Recorded Date Time",
      width: 200,
      renderCell: (params: any) => (
        <>
           {params.row.recordedDateTime?moment(params.row.recordedDateTime).format("YYYY-MM-DD HH:mm"):""}
        </>
    ),
    }
  ];
  return (
    <div>
        <div className="data-grid-newThem">
        <ReactDatagrid rows={data} columns={columns} />
      </div>
    </div>
  )
}
