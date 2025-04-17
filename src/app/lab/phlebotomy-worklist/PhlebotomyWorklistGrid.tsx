import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { GridColDef } from '@mui/x-data-grid';
import React from 'react'
import { phlebotomyData } from '../_component/labJsonData';
import Link from 'next/link';
import moment from 'moment';

const PhlebotomyWorklistGrid = ({ state, gridData }: any) => {
    const getAge = (ageOfPatient: any) => {
        if (ageOfPatient?.match(/\d+ Years,\d+ Months and \d+ Days/)) {
          const text = ageOfPatient;
          const numberRegex = /\d+ Years/;
          const monthRegex = /\d+ Months/;
          const dayRegex = /\d+ Days/;
          const dayMatch = text?.match(dayRegex);
          const monthMatch = text?.match(monthRegex);
          const matches = text?.match(numberRegex);
          let extractedNumber: any;
          if (matches && matches.length > 0 && parseInt(matches[0]) > 0) {
            extractedNumber = parseInt(matches[0]);
            let constCate = `${extractedNumber} Year${extractedNumber>1?'s':''}`;
            return constCate;
          } else if (
            monthMatch &&
            matches.length > 0 &&
            parseInt(matches[0]) == 0 &&
            parseInt(monthMatch[0]) > 0
          ) {
            extractedNumber = parseInt(monthMatch[0]);
            let constCate = `${extractedNumber} Month${extractedNumber>1?'s':''}`;
            return constCate;
          } else if (parseInt(monthMatch[0]) == 0 && parseInt(matches[0]) == 0) {
            extractedNumber = parseInt(dayMatch[0]);
            let constCate = `${extractedNumber} Day${extractedNumber>1?'s':''}`;
            return constCate;
          }
        } else if (ageOfPatient == "") {
          return "";
        } else {
          return ageOfPatient + `Year${ageOfPatient>1?'s':''}`;
        }
    };
    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 40,
            // renderCell: (params) => {
            //     const number = gridData.indexOf(params.row) + 1
            //     return number
            // }
        },
        { field: "MRN", headerName: "Patient MRN", width: 150 },
        { field: "patientName", headerName: "Patient Name", width: 160 },
        {
            field: "orderId", headerName: "Lab Order Id", width: 180, renderCell: (params: any) => (
                <>
                    <Link href={`/lab/phlebotomy-worklist/${params.row.labOrderId}`} className='underline cursor-pointer text-[15px] text-blue-500'>{params.row.labOrderId}</Link>
                </>
            ),
        },
        { field: "ageOfPatient", headerName: "Age", width: 120 ,renderCell: (params: any) => (
            <>
                {getAge(params.row.ageOfPatient)}
            </>
        ),},
        { field: "genderDesc", headerName: "Gender", width: 80 },
        { field: "doctor", headerName: "Ordering Dr", width: 140 },
        {
            field: "generatedDate", headerName: "Ordering Date & Time", width: 160,
            renderCell: (params: any) => (
                <>{moment(params.row.generatedDate).format("DD-MM-YYYY HH:mm")}</>
            ),
        },
        { field: "status", headerName: "Sample Status", width: 120 },
        { field: "billNumber", headerName: "Bill No", width: 160 },
        // { field: "billdate", headerName: "Bill Date", width: 120 },
    ];

    return (
        <div className='data-grid-newThem'>
            <ReactDatagrid
                rows={gridData}
                columns={columns1}
            />
        </div>
    )
}

export default PhlebotomyWorklistGrid
