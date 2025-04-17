"use client"
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { FC, } from 'react'


interface DataBlockUser {
  EmptableData: any;
}
const BlockUserGrid : FC<DataBlockUser> =({EmptableData}) =>{

    const columns: GridColDef[] = [
      {
        field: "sno", headerName: "S.No", width: 140, 
      //   renderCell: (params) => {
      //     const rowNumber = EmptableData.indexOf(params.row) + 1;
      //     return rowNumber;
      // },
       },
      {
        field: "blockActiveStatus",
        headerName: "Status",
        width: 140,
      },
      {
        field: "resonForBlock",
        headerName: "Reason",
        width: 140,
      },
      {
        field: "blockedRemarks",
        headerName: "Remarks",
        width: 140,
      },
      {
        field: "generatedDate",
        headerName: "Date Time",
        width: 140,
        renderCell: (params: any) => (
          <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
        ),
      },
      {
        field: "generatedBy",
        headerName: "Done By User",
        width: 140,
      },
    ];
  
  return (
    <div>
    <h1 className="font-bold ms-2">Status History</h1>
      <div className="data-grid-newThem my-3">
        <ReactDatagrid rows={EmptableData} columns={columns} />
          </div>
  </div>
  )
}

export default BlockUserGrid