"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  getAllAppointmentDetail,
  getAllEncounterTriageDtls,
  getAllEncounterTriageDts,
} from "../../../app/utilities/api-urls";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import eventBus from "@/app/utilities/eventbus";
import {
  DASHBOARD_BAR_CHART,
  DASHBOARD_PIE_CHART,
  DASHBOARD_SUMMARY,
} from "@/app/utilities/constants";
import services from "@/app/utilities/services";
import Piechart from "@/app/frontdesk/dashboard/_components/piechart";
import Barchart from "@/app/frontdesk/dashboard/_components/barchart";
import { useRouter } from "next/navigation";
import Loader from "@/app/_common/loader";
import GridIcon from "../../../../public/icons/grid-icon";
import ChartIcon from "../../../../public/icons/chart-icon";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { getLocalItem } from "@/app/utilities/local";
import dayjs from "dayjs";
import moment from "moment";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

const Page = (props: any) => {
  const [dataa, setDataa] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { setEncounterpatientData, setRollDesc, selectHeaderDate } =
    PatientDatadataAuth();
  let rollDesc: string | null = null; // Initialize to null or an appropriate default value
  const loginResponse = getLocalItem("loginResponse");
  if (loginResponse) {
    const parsedResponse = JSON.parse(loginResponse);
    rollDesc = parsedResponse.rollDesc;
  } else {
  }

  let getDate: any = dayjs(selectHeaderDate).format("YYYY-MM-DD");
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
      width: 75,
      renderCell: (params: any) => {
        if (
          params.row.ageOfPatient?.match(/\d+ Years,\d+ Months and \d+ Days/)
        ) {
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
        } else if (params.row.ageOfPatient == "") {
          return "--";
        } else {
          return params.row.ageOfPatient + "Years";
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
    { field: "opdcountername", headerName: "OPD Counter Name", width: 150 },
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
    { field: "encounterStatus", headerName: "Triage Status", width: 120 },
  ];

  const router = useRouter();
  const handleRowClick = (params: any) => {
    setRollDesc(rollDesc);
    setEncounterpatientData(params.row);
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
  }, [getDate]);

  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }

  return (
    <div className="min-h-full ">
      {loading ? <Loader /> : ""}
      <div className="w-full mx-auto max-w-7xl md:py-6 2xl:py-6 position-relative">
        <Tabs value="22" orientation="vertical">
          {/* <TabsHeader className="d-icon-view-wrap">
            <Tab value="22" className="mt-2">
              <div className="items-center gap-2 tabH">
                <GridIcon /> */}
          {/* Grid View */}
          {/* </div>
            </Tab>
            <Tab value="11">
              <div className="items-center gap-2 tabH">
                <ChartIcon /> */}
          {/* Chart View */}
          {/* </div>
            </Tab>
          </TabsHeader> */}
          <TabsBody>
            {/* <TabPanel value="11" className="p-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-auto 2xl:gap-7.5">
                {/* Chart One */}
            {/* <div className="rounded-curve border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <Piechart /> */}
            {/* </div> */}
            {/* Chart Two */}
            {/* <div className="rounded-curve  border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <Barchart />
                </div>
              </div>
            </TabPanel> */}
            <TabPanel value="22" className="p-0">
              <div className="grid grid-cols-12 gap-4  m-0 p-0 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <div className="col-span-12 xl:col-span-12">
                  <div className="rounded-curve  border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="flex flex-col">
                      <DataGrid
                        autoHeight
                        rows={dataa}
                        columns={columns}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 20]}
                        checkboxSelection={false}
                        slots={{ toolbar: GridToolbar }}
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

export default roleInfoScreenData(Page, "Nd")