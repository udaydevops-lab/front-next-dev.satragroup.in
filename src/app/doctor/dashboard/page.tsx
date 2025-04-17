"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  getAllAppointmentDetail,
  getAllEncounterTriageDtls,
  getAllEncounterTriageDts,
} from "../../../app/utilities/api-urls";

// const DataGrid = dynamic(() => import('@/app/_components/DataGrid/DataGrid'))

import eventBus from "@/app/utilities/eventbus";
import {
  DASHBOARD_BAR_CHART,
  DASHBOARD_PIE_CHART,
  DASHBOARD_SUMMARY,
} from "@/app/utilities/constants";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import services from "@/app/utilities/services";
import Piechart from "@/app/frontdesk/dashboard/_components/piechart";
import Barchart from "@/app/frontdesk/dashboard/_components/barchart";
import { useRouter } from "next/navigation";
import moment from "moment";
import GridIcon from "../../../../public/icons/grid-icon";
import ChartIcon from "../../../../public/icons/chart-icon";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import axios from "axios";
import dayjs from "dayjs";
import { Stack } from "@mui/material";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";

function Page(props: any) {

  const [dataa, setDataa] = useState<any>([]);
  const [dataa1, setDataa1] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { setEncounterpatientData, selectHeaderDate, setRollDesc } =
    PatientDatadataAuth();
  let rollDesc: string | null = null; // Initialize to null or an appropriate default value
  const loginResponse = getLocalItem("loginResponse") ?? "";
  if (loginResponse) {
    const parsedResponse = JSON.parse(loginResponse);
    rollDesc = parsedResponse.rollDesc;
  } else {
    // Handle the case where "loginResponse" is not available or not a valid JSON object
  }

  // TEST DATA
  // const pieData = {
  //   labels: ["Waiting for Consult", "Completed"],
  //   datasets: [
  //     {
  //       data: [120, 70],
  //       backgroundColor: ["#fd79a8", "#a29bfe"],
  //       hoverBackgroundColor: ["#e84393", "#6c5ce7"],
  //       // borderWidth: 1,
  //       // borderColor: 'black',
  //     },
  //   ],
  // };
  // const barData = {
  //   labels: ["Walkin", "Appointment Visits", "No show", "Cancelled"],
  //   datasets: [
  //     {
  //       data: [40, 25, 10, 5],
  //       backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
  //       hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
  //       borderRadius: 16,
  //       barThickness: 8,
  //     },
  //   ],
  // };

  let getDate: any = dayjs(selectHeaderDate).format("YYYY-MM-DD");
  // let getChangeDate = moment(getDate)._i

  // const deno = async()=>{
  //   const response = await axios.get(
  //     `https://jsonplaceholder.typicode.com/photos`,
  //   );
  //   setDataa1(response.data)
  // }

  const generateUniqueIds = (data: any) => {
    // Use a map to store unique ids
    const idMap = new Map();
    let nextId = 1;

    // Generate unique ids for rows that don't have them
    return data.map((row: any) => {
      if (!row.id) {
        let generatedId;

        // Generate a unique id that doesn't exist in the map
        do {
          generatedId = nextId++;
        } while (idMap.has(generatedId));

        // Store the generated id in the map
        idMap.set(generatedId, true);

        // Assign the generated id to the row
        row.id = generatedId;
      }

      return row;
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
      renderCell: (params) => {
        const rowNumber = dataa.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "opdEncounterNo",
      headerName: "Encounter No",
      width: 130,
      renderCell: (params: any) => (
        <>
          <button
            style={{
              marginRight: 10,
              textDecoration: "underlined",
              cursor: "pointer",
              color: "blue",
            }}
            onClick={() => handleRowClick(params)}
          >
            {params.value}
          </button>
        </>
      ),
    },
    { field: "mrn", headerName: "MRN", width: 125, headerAlign: "center" },
    {
      field: "healthId",
      headerName: "ABHA Number",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>{params.row.healthId.length > 0 ? params.row.healthId : "---"}</>
      ),
    },
    { field: "lastName", headerName: "Patient Name", width: 150 },
    {
      field: "age",
      headerName: "Age",
      width: 70,
      align: "center",
      renderCell: (params: any) => {
        if (params.row.ageOfPatient != "") {
          const text = params.row.ageOfPatient;
          const numberRegex = /\d+ Years/;
          const monthRegex = /\d+ Months/;
          const dayRegex = /\d+ Days/;
          const dayMatch = text?.match(dayRegex);
          const monthMatch = text?.match(monthRegex);
          const matches = text?.match(numberRegex);
          let extractedNumber: any;
          if (matches && matches.length > 0 && parseInt(matches[0]) > 0) {
            extractedNumber = parseInt(matches[0]);
            let constCate = `${extractedNumber} Years`;
            return constCate;
          } else if (
            monthMatch &&
            matches.length > 0 &&
            parseInt(matches[0]) == 0 &&
            parseInt(monthMatch[0]) > 0
          ) {
            extractedNumber = parseInt(monthMatch[0]);
            let constCate = `${extractedNumber} Months`;
            return constCate;
          } else if (
            parseInt(monthMatch[0]) == 0 &&
            parseInt(matches[0]) == 0
          ) {
            extractedNumber = parseInt(dayMatch[0]);
            let constCate = `${extractedNumber} Days`;
            return constCate;
          }
        } else {
          return "--";
        }
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
      renderCell: (params: any) => {
        let gender = `${params.row.gender === "G1001"
          ? "Male"
          : params.row.gender === "G1002"
            ? "Female"
            : "Others"
          }`;
        return gender;
      },
    },
    {
      field: "opdEncounterTime",
      headerName: "Encounter DateTime",
      width: 160,
      renderCell: (params: any) => {
        return moment(params.row.opdEncounterTime).format("DD-MM-YYYY hh:ss");
      },
    },
    { field: "departmentDesc", headerName: "Department", width: 120 },
    { field: "doctor", headerName: "Practitioner", width: 130 },
    {
      field: "triageCategory",
      headerName: "Triage Category",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>
          {params.row.triageCategory !== undefined
            ? params.row.triageCategory
            : "---"}
        </>
      ),
    },
    {
      field: "encounterStatus",
      headerName: "Encounter Status",
      width: 120,
    },
  ];

  const router = useRouter();
  const handleRowClick = (params: any) => {
    setRollDesc(rollDesc);
    setEncounterpatientData(params.row);
    setLocalItem("pat", params.row.patientId.toString())
    router.push(
      `/emr/${params.row.patientId}/${params.row.opdEncounterId}/emrCaseSheet`
    );
  };

  const getRowId = (row: any) => row.patientId;

  useEffect(() => {
    let headers = {
      "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      empId: JSON.parse(getLocalItem("loginResponse")!).employeeid,
      rollDesc: JSON.parse(getLocalItem("loginResponse")!).rollDesc,
    };

    services
      .get(getAllEncounterTriageDtls + `?generatedDate=${getDate}`, headers)
      .then((response) => {
        const dataWithIds = generateUniqueIds(response.data);
        setDataa(dataWithIds);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    // Publishing Test Data
    // eventBus.dispatch(DASHBOARD_BAR_CHART, barData);
    // eventBus.dispatch(DASHBOARD_PIE_CHART, pieData);

    // Dummy Data Publish
    // setInterval(() => {
    //     let total = Math.floor(Math.random() * 1000) + 1;
    //     let walkins = Math.floor(Math.random() * 500) + 1;
    //     let appointmentsVisiteds = Math.floor(Math.random() * 500) + 1;
    //     let noShow = Math.floor(Math.random() * 500) + 1;
    //     let cancelled = Math.floor(Math.random() * 500) + 1;
    //     let completed = Math.floor(Math.random() * 500) + 1;

    //     const pieData = {
    //         labels: ["Waiting for Consult", "Completed"],
    //         datasets: [
    //             {
    //                 data: [Number(walkins + appointmentsVisiteds), Number(completed)],
    //                 backgroundColor: ["#fd79a8", "#a29bfe"],
    //                 hoverBackgroundColor: ["#e84393", "#6c5ce7"],
    //                 // borderWidth: 1,
    //                 // borderColor: 'black',
    //             },
    //         ],
    //     };
    //     const barData = {
    //         labels: ["Walkin", "Appointment Visits", "No show", "Cancelled"],
    //         datasets: [
    //             {
    //                 data: [
    //                     Number(walkins),
    //                     Number(appointmentsVisiteds),
    //                     Number(noShow),
    //                     Number(cancelled),
    //                 ],
    //                 backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
    //                 hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
    //                 borderRadius: 16,
    //                 barThickness: 8,
    //             },
    //         ],
    //     };

    //     eventBus.dispatch(DASHBOARD_BAR_CHART, barData);
    //     eventBus.dispatch(DASHBOARD_PIE_CHART, pieData);

    //     eventBus.dispatch(DASHBOARD_SUMMARY, {
    //         total: completed + Number(walkins) + Number(appointmentsVisiteds),
    //         consultationcompleted: completed,
    //         waiting: Number(walkins) + Number(appointmentsVisiteds),
    //     });
    // }, 5000);
    // deno()
  }, [getDate]);
  console.log(props?.screenData?.View)
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }

  return (
    <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative">
      <div className="min-h-full rounded-curve border border-stroke bg-white p-2 mb-3">
        <Tabs value="22" orientation="vertical">
          {/* <TabsHeader className="d-icon-view-wrap">
            <Tab value="22" className="mt-2">
              {/* <div className="items-center gap-2 tabH">
                <GridIcon /> */}
          {/* Grid View */}
          {/* </div> */}
          <></>
          {/* </Tab> */}
          {/* <Tab value="11"> */}
          <></>
          {/* <div className="items-center gap-2 tabH">
                <ChartIcon /> */}
          {/* Chart View */}
          {/* </div> */}
          {/* </Tab> */}
          {/* </TabsHeader> */}
          <TabsBody>
            {/* <TabPanel value="11">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-auto 2xl:gap-7.5">
                {/* Chart One */}
            {/* <div className="rounded-curve border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <Piechart />
                </div> */}
            {/* Chart Two */}
            {/* <div className="rounded-curve  border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <Barchart />
                </div> */}
            {/* </div> */}
            {/* </TabPanel> */}
            <TabPanel value="22">
              <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="col-span-12 xl:col-span-12">
                  <div className="">
                    <div className="flex flex-col">
                      <ReactDatagrid
                        rows={dataa}
                        columns={columns}
                      />

                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
}

export default roleInfoScreenData(Page, "DD")
