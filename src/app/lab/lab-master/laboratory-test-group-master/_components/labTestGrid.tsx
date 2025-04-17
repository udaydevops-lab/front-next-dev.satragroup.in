"use client"

import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { FC } from 'react'
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import moment from 'moment';
import services from '@/app/utilities/services';
import { statusActiveInActive } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';

interface DataTest {
  gridData: any;
  testGroupEditById: any;
  getAllgridData: any;
}

const LabTestGrid: FC<DataTest> = ({ gridData,testGroupEditById,getAllgridData }) => {

  //Main Table columns info
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "testGroupServiceName",
      headerName: "Service Name",
      width: 250,
    
    },
    {
      field: "testGroupServiceCode",
      headerName: "Service Code",
      width: 120,
  
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      renderCell: (params) => (
        <>
          {
            params.row.statusFlag && params.row.statusFlag === 1
              ?
              <div className='text-green-600'>Active</div>
              :
              <div className='text-red-600'>Inactive</div>
          }
        </>
      )

    },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 110,
      renderCell: (params) => (
        <>
          {params.row.generatedDate && moment(params.row.generatedDate).format("DD-MM-YYYY")}
        </>
      )
    },
    {
      field: "updatedDate",
      headerName: "Modified Date",
      width: 110,
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
      width: 140,
  },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <>
          <div className='w-[100px] flex items-center mt-2 justify-end gap-4'>
            {params.row.statusFlag === 0 ? "" :
              <div>
        
                <PencilIcon className='w-5 h-5 cursor-pointer text-blue-500' onClick={(e) => testGroupEditById(params.row)} />
              </div>
            }
            <div onClick={(e: any) => handleActive(params.row)}>
              {params.row.statusFlag && params.row.statusFlag === 1
                ?
                <ActiveIcon/> : <InactiveIcon/>
              }
            </div>
          </div>
        </>
      ),
    },
   
  ];

   //Active and Inactive
   const handleActive = (row: any) => {
    let message =
      row.statusFlag == "1" ? "InActived Successfully" : "Actived Successfully";
    let id = row.labTestgroupHeaderId;
    let statusFlag = row.statusFlag == "1" ? "0" : "1";
    services
      .create(
        `${statusActiveInActive}labTestgroupHeaderId=${id}&StatausFlag=${statusFlag}`,
        {}
      )
      .then((response) => {
        toast.success(message);
        getAllgridData()

      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };


  return (
    <>
       <div className="px-4 m-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="data-grid-newThem">  
        <ReactDatagrid rows={gridData} columns={columns}/>
        </div>
        </div>
    </>
  )
}

export default LabTestGrid