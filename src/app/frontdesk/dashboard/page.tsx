"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  getAllAppointmentDetail,
  getAllEncounterTriageDts,
  getPatientDetailsCount,
  getPatientEncounterCount,
  getAllEncounterTriageDtls,
  getQueueStatusDetails,
  getAppointmentGrid,
} from "../../../app/utilities/api-urls";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { DocumentIcon } from "@heroicons/react/24/solid";

import GridIcon from "../../../../public/icons/grid-icon";
import ChartIcon from "../../../../public/icons/chart-icon";
import carecontext from "../../../../public/images/doctor-dashboard/carecontext.png";
const Piechart = dynamic(() => import("./_components/piechart"));
const Barchart = dynamic(() => import("./_components/barchart"));
import PatientRegister from "public/images/patient-registeration.png";
// const DataGrid = dynamic(() => import('@/app/_components/DataGrid/DataGrid'))

import eventBus from "@/app/utilities/eventbus";
import {
  DASHBOARD_BAR_CHART,
  DASHBOARD_PIE_CHART,
  DASHBOARD_SUMMARY,
} from "@/app/utilities/constants";
import services from "@/app/utilities/services";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import FilterIcon from "../../../../public/icons/filter-icon";
import NoFilterIcon from "../../../../public/icons/nofilter-icon";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import dayjs from "dayjs";
import { Tooltip } from "@material-tailwind/react";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import { decryptToken, encryptToken } from "@/app/_commonfeatures/Token";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import { toast } from "react-toastify";
import NoScreenData from "@/app/_common/NoScreenData";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import Image from "next/image";
const Page = (props: any) => {
  const [dataa, setDataa] = useState<any[]>([]);
  const [queueData, setQueueData] = useState<any>([]);
  const [apptData,setApptData]=useState([])
  const { selectHeaderDate } = PatientDatadataAuth();
  const [tabType, setTabType] = useState<string>("Queue");

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

  const queueColumns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 40,
    },
    {
      field: "mrn",
      headerName: "MRN",
      width: 140,
      renderCell: (params: any) => (
        <>
          {params.row.setQueueStatus == "Queued" ? (
            <button
              style={{
                marginRight: 10,
                textDecoration: "underlined",
                cursor: "pointer",
                color: "blue",
              }}
              onClick={() => handleQueueRowClick(params)}
            >
              {params.value}
            </button>
          ) : (
            params.row.mrn
          )}
        </>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 160,
    },
    {
      field: "genderDesc",
      headerName: "Gender",
      width: 80,
    },
    {
      field: "primaryContactNum",
      headerName: "Contact Number",
      width: 130,
    },
    {
      field: "abhaAddress",
      headerName: "Abha Address",
      width: 170,
    },
    {
      field: "healthId",
      headerName: "ABHA Number",
      width: 160,
    },
    {
      field: "queueNo",
      headerName: "Queue No",
      width: 90,
    },
    {
      field: "generatedDate",
      headerName: "Date & Time",
      width: 160,
      renderCell: (params: any) => {
        return moment(params.row.generatedDate).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      field: "setQueueStatus",
      headerName: "Status",
      // width: 200,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      // renderCell: (params) => {
      //     const rowNumber = dataa.indexOf(params.row) + 1;
      //     return rowNumber;
      // },
    },
    {
      field: "opdEncounterNo",
      headerName: "Encounter No",
      width: 140,
    },
    {
      field: "mrn",
      headerName: "MRN",
      width: 140,
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
    { field: "healthId", headerName: "ABHA Number", width: 160 },
    { field: "lastName", headerName: "Name", width: 180,
      renderCell: (params: any) => (
        <>
          {params.value}
        </>
      ),
     },
    { field: "departmentDesc", headerName: "Department", width: 120 },
    { field: "doctor", headerName: "Practitioner", width: 140 },
    {
      field: "opdEncounterTime",
      headerName: "Encounter Date & Time",
      width: 160,
      renderCell: (params: any) => {
        return moment(params.row.opdEncounterTime).format("DD-MM-YYYY HH:mm");
      },
    },

    { field: "encounterStatus", headerName: "Status", width: 120 },
    {
      field: "uploadDocument",
      headerName: "Upload Doc",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div
            onClick={() => {
              router.push(
                `/document/${params.row.patientId}/${params.row.opdEncounterId}/health-document`
              );
            }}
          >
            {/* DOC */}
            <Tooltip content="View Health Document" className="bg-blue-600">
              <DocumentIcon className="w-5 h-5 ml-5 text-blue-400 cursor-pointer" />
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "careContext",
      headerName: "Care context",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              setLocalItem("pat", params.row.patientId.toString());
              router.push(
                `/abha/${params.row.patientId}/${params.row.opdEncounterId}/new-abha-linking-token`
              );
            }}
          >
            <Image src={carecontext} width={25} height={50} alt="icon" />
          </div>
        );
      },
    },
  ];
  const appointmentColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
    },
    {
      field: "appointmentNumber",
      headerName: "Appointment Number",
      width: 180,
      renderCell: (params: any) => (
        <>
          <button
            style={{
              marginRight: 10,
              textDecoration: "underlined",
              cursor: "pointer",
              color: "blue",
            }}
            onClick={() => {
                handleRowClick(params)
                router.push(`/appointment/0/${params.value}`)
            }}
          >
            {params.value}
          </button>
        </>
      ),
    },
    {
      field: "mrn",
      headerName: "MRN",
      width: 140,
      renderCell: (params: any) => (
        <>
          <button
            style={{
              marginRight: 10,
              textDecoration: "underlined",
              cursor: "pointer",
              color: "blue",
            }}
            onClick={() => {
                handleRowClick(params)
                const patId=params.row.patientId?params.row.patientId:"0"
                const apptNo=params.row.appointmentNumber?params.row.appointmentNumber:"0"
                router.push(`/encounter/${patId}/0/${apptNo}/outpatient-encounter`);
            }}
          >
            {params.value}
          </button>
        </>
      )
    },
    { field: "lastName", headerName: "Name", width: 190 },
    { field: "department", headerName: "Department", width: 120 },
    { field: "resource", headerName: "Practitioner", width: 140 },
    {
      field: "appointmentStartTime",
      headerName: "Appointment Date Time",
      width: 200,
      renderCell: (params: any) => {
        return moment(params.row.appointmentStartTime).format("DD-MM-YYYY HH:mm");
      },
    },
    {
        field: "appoinmentStatus",
        headerName: "Appointment Status",
        width: 150,
    },
    {
      field: "patientReg",
      headerName: "Patient Reg.",
      width: 200,
      renderCell: (params: any) => {
        return (
          <>{!params.row.mrn&&<div
            className="cursor-pointer"
            onClick={() => {
              // setLocalItem("pat", params.row.patientId.toString());
              router.push(
                `/patient/0/${params.row.appointmentNumber}/patient-Registration`
              );
            }}
          >
            <Image src={PatientRegister} width={25} height={50} alt="icon" />
          </div>}</>
        );
      },
  },
  ];

  const router = useRouter();
  const handleQueueRowClick = (params: any) => {
    router.push(`/encounter/${params.row.patientId}/0/outpatient-encounter`);
  };
  const handleRowClick = (params: any) => {
    // Define the type of the object parameter
    interface MyObject {
      patientId: number;
      opdEncounterId: number;
      lastName: string;
      gender: string;
      dateOfBirth: number;
      ageOfPatient: string;
      healthId: string;
      generatedDate: number;
      mrn: string;
      department: string;
      opdEncounterTime: number;
      opdEncounterNo: string;
      referalSource: string;
      reasonForVisit: string;
      visitType: string;
      encounterStatus: string;
      doctor: string;
      departmentDesc: string;
      triageCounter: string;
      id: number;
    }

    // Example usage
    const data: any = params.row ? JSON.stringify(params.row) : null;
    const myObject: MyObject = { ...data };
    const serializedObject = JSON.stringify(myObject);
    const encryptedData = encryptToken(serializedObject);

    if (encryptedData !== null) {
      setLocalItem("encounterPatData", encryptedData);
    } else {
    }
    const apptNo=params.row.appointmentNumber?params.row.appointmentNumber:"0"
    router.push(
      `/encounter/${params.row.patientId}/${params.row.opdEncounterId}/${apptNo}/outpatient-encounter`
    );
  };

  const getRowId = (row: any) => row.patientId;
  const [isOpen, setIsOpen] = useState(false);
  const handleGridOptions = () => {
    setIsOpen(!isOpen);
  };

  let getDate: any = dayjs(selectHeaderDate).format("YYYY-MM-DD");

  let loginResp;
  try {
    loginResp = JSON.parse(getLocalItem("loginResponse")!);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const headers = {
    empId: loginResp?.employeeid,
    rollDesc: loginResp?.rollDesc,
  };

  useEffect(() => {
    // Ensure you retrieve and parse the local storage item correctly

    services
      .get(getQueueStatusDetails + getDate)
      .then((response) => {
        let data = response.data.map((item: any, index: any) => ({
          ...item,
          sno: index + 1,
        }));
        setQueueData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    services
      .get(getAllEncounterTriageDtls + `?generatedDate=${getDate}`, headers)
      .then((response) => {
        const dataWithIds = generateUniqueIds(response.data);
        setDataa(dataWithIds);
      })
      .catch((err) => {
        console.log(err.message);
      });
      services
      .get(getAppointmentGrid + `${getDate}`, headers)
      .then((response) => {
        const dataWithIds = generateUniqueIds(response.data);
        setApptData(dataWithIds);
      })
      .catch((err) => {
        console.log(err.message);
      });
    // Publishing Test Data

    // Dummy Data Publish

    const getGraphData = () => {
      services
        .get(getPatientEncounterCount + moment().format("YYYY-MM-DD"))
        .then((response) => {})
        .catch((err) => {
          console.log(err.message);
        });

      services
        .get(getPatientDetailsCount + moment().format("YYYY-MM-DD"))
        .then((response) => {})
        .catch((err) => {
          console.log(err.message);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDate]);

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className="min-h-full">
      <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative">
        <div className="min-h-full rounded-curve border border-stroke bg-white  ">
          <Tabs value="22" orientation="vertical">
            {/* <TabsHeader className="d-icon-view-wrap">
              <Tab value="22" className="mt-2">
                <div className="items-center gap-2 tabH">
                  <GridIcon /> */}
            {/* Grid View */}
            {/* </div> */}
            {/* </Tab>
              <Tab value="11">
                <div className="items-center gap-2 tabH">
                  <ChartIcon /> */}
            {/* Chart View */}
            {/* </div>
              </Tab>
            </TabsHeader> */}
            <TabsBody>
              {/* <TabPanel value="11"> */}
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-auto 2xl:gap-7.5"> */}
              {/* Chart One */}
              {/* <div className="rounded-curve border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <Piechart />
                  </div> */}
              {/* Chart Two */}
              {/* <div className="rounded-curve  border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <Barchart />
                  </div>
                </div>
              </TabPanel> */}
              <TabPanel value="22">
                {/* <a
                                    className="grid-filter-toggle"
                                    title="Filter options"
                                    href="javascript:void(0)"
                                    onClick={handleGridOptions}
                                >
                                    {isOpen ? <NoFilterIcon /> : <FilterIcon />}
                                </a> */}
                <div className="grid grid-cols-12 gap-4 md:gap-6  2xl:gap-7.5">
                  <div className="col-span-12 xl:col-span-12">
                    <div className="rounded-curve  bg-white  sm:px-7.5">
                      <div className="flex flex-col grid-min-h">
                        <Tabs value="1">
                          <TabsHeader>
                            <Tab
                              value={"1"}
                              onClick={() => setTabType("Queue")}
                            >
                              Queue
                            </Tab>
                            <Tab
                              value={"2"}
                              onClick={() => setTabType("Encounter")}
                            >
                              Encounter
                            </Tab>
                            <Tab
                              value={"3"}
                              onClick={() => setTabType("Appointment")}
                            >
                              Appointment
                            </Tab>
                          </TabsHeader>
                          <div>
                            <TabsBody>
                              <TabPanel value={"1"} className="px-0 pb-0">
                                <ReactDatagrid
                                  rows={queueData}
                                  columns={queueColumns}
                                />
                              </TabPanel>
                              <TabPanel value={"2"} className="px-0 pb-0">
                                <ReactDatagrid rows={dataa} columns={columns} />
                              </TabPanel>
                              <TabPanel value={"3"} className="px-0 pb-0">
                                <ReactDatagrid rows={apptData} columns={appointmentColumns} />
                              </TabPanel>
                            </TabsBody>
                          </div>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default roleInfoScreenData(Page, "Fdd");
