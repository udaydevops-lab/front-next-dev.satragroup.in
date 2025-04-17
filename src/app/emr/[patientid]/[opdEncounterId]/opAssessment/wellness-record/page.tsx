"use client";
import ActionButton from "@/app/_common/button";
import CheckboxMui from "@/app/_common/checkbox";
import DateInput from "@/app/_common/date-input";
import {
  abdmNotify,
  getConfigData,
  getWellnessRecord,
  inactiveDietTypeRowRecord,
  inactiveGeneralRowRecord,
  inactivePhysicalActivityRowRecord,
  inactiveTobaccoTypeRowRecord,
  inactiveWomenRowRecord,
  saveWellnessRecord,
  snomedLoincSearch,
  snowmedData,
} from "@/app/utilities/api-urls";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import Delete from "@mui/icons-material/Delete";
import { Dialog, Divider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActiveIcon from "../../../../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../../../../public/icons/wellness-record/inactive-icon";
import UpArrowIcon from "../../../../../../../public/icons/wellness-record/up-arrow-icon";
import { TrashIcon } from "@heroicons/react/24/solid";
import { alphaNumWithFewSymbols } from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function WellnessRecord(props: any) {
  const [physicalActivity, setPhysicalActivity] = useState<any>("");
  const [generalAssesment, setGeneralAssesment] = useState<any>();
  const [generalAssesmentList, setGeneralAssesmentList] = useState<any>([]);
  const [womenObservation, setWomenObservation] = useState<any>("");
  const [womenObservationList, setWomenObservationList] = useState<any>([]);
  const [physicalActivityList, setPhysicalActivityList] = useState([]);
  const [phyData, setPhyData] = useState<any[]>([]);
  const [genData, setGenData] = useState<any[]>([]);
  const [womenData, setWomenData] = useState<any[]>([]);
  const [phyValue, setPhyValue] = useState("");
  const [genValue, setGenValue] = useState("");
  const [womenValue, setWomenValue] = useState("");
  const [phyUnits, setPhyUnits] = useState<any>("");
  const [genUnits, setGenUnits] = useState<any>("");
  const [womenUnits, setWomenUnits] = useState<any>("");
  const [lmpDate, setLmpDate] = useState(moment());
  const [ageOfMenarche, setAgeOfMenacrchy] = useState("");
  const [phyRespoArray, setPhyRespoArray] = useState<any[]>([]);
  const [genRespoArray, setGenRespoArray] = useState<any[]>([]);
  const [womenRespoArray, setWomenRespoArray] = useState<any[]>([]);
  const [pushState, setPushState] = useState(true);
  const [uomList, setUomList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState<any>({});
  const [string, setString] = useState("");
  const pathParams = useParams();
  const patientid = pathParams.patientid;
  const opdEncounterId = pathParams.opdEncounterId;
  const [tobaccoBehaviour, setTobaccoBehaviour] = useState<any>("");
  const [tobaccoBehaviourList, setTobaccoBehaviourList] = useState<any>([]);
  const [tobaccoRespList, setTobaccoRespList] = useState<any[]>([]);
  const [dietRespList, setDietRespList] = useState<any[]>([]);
  const [dietTypeObservation, setDietTypeObservation] = useState<any>("");
  const [dietTypeObservationList, setDietTypeObservationList] = useState<any>(
    []
  );
  const [tobaccoValue, setTobaccoValue] = useState("");
  const [dietValue, setDietValue] = useState("");
  const [tobaccoData, setTobaccoData] = useState<any[]>([]);
  const [dietData, setDietData] = useState<any[]>([]);

  useEffect(() => {
    getAllTablesData();
    getDietTypeList();
    getToboccoList();
    getUom();
  }, []);
  const truncate = (string: string) => {
    if (string.length > 25) {
      return string.substring(0, 25) + "...";
    } else {
      return string;
    }
  };

  //Inactive functions

  const handleInactive = (params: any, type: string) => {
    handleOpen();
    switch (type) {
      case "women":
        setRowData(params);
        setString(type);
        break;
      case "general":
        setRowData(params);
        setString(type);
        break;
      case "physical":
        setRowData(params);
        setString(type);
        break;
      case "dietType":
        setRowData(params);
        setString(type);
        break;
      case "tobacco":
        setRowData(params);
        setString(type);
        break;
      default:
        break;
    }
  };
  const handleInactiveSubmit = () => {
    switch (string) {
      case "women":
        inActiveWomenMark(rowData);
        break;
      case "general":
        inActiveGenMark(rowData);
        break;
      case "physical":
        inActivePhyMark(rowData);
        break;
      case "dietType":
        inActiveDietMark(rowData);
        break;
      case "tobacco":
        inActiveTobaccoMark(rowData);
        break;
      default:
        break;
    }
    handleOpen();
  };

  const inActivePhyMark = (params: any) => {
    services
      .create(
        inactivePhysicalActivityRowRecord +
        patientid +
        "/" +
        opdEncounterId +
        "/" +
        params.id +
        "/0",
        {}
      )
      .then((response) => {
        getAllTablesData();
        toast.success("Successfully inactivated the record");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const inActiveGenMark = (params: any) => {
    services
      .create(
        inactiveGeneralRowRecord +
        patientid +
        "/" +
        opdEncounterId +
        "/" +
        params.id +
        "/0",
        {}
      )
      .then((response) => {
        getAllTablesData();
        toast.success("Successfully inactivated the record");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const inActiveWomenMark = (params: any) => {
    services
      .create(
        inactiveWomenRowRecord +
        patientid +
        "/" +
        opdEncounterId +
        "/" +
        params.id +
        "/0",
        {}
      )
      .then((response) => {
        getAllTablesData();
        toast.success("Successfully inactivated the record");
      })
      .catch((error) => {
        console.log(error.message);
      });
    getAllTablesData();
  };
  const inActiveDietMark = (params: any) => {
    services
      .create(
        inactiveDietTypeRowRecord +
        patientid +
        "/" +
        opdEncounterId +
        "/" +
        params.id +
        "/0",
        {}
      )
      .then((response) => {
        getAllTablesData();
        toast.success("Successfully inactivated the record");
      })
      .catch((error) => {
        console.log(error.message);
      });
    getAllTablesData();
  };
  const inActiveTobaccoMark = (params: any) => {
    services
      .create(
        inactiveTobaccoTypeRowRecord +
        patientid +
        "/" +
        opdEncounterId +
        "/" +
        params.id +
        "/0",
        {}
      )
      .then((response) => {
        getAllTablesData();
        toast.success("Successfully inactivated the record");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Grid Columns
  const columns1: GridColDef[] = [
    { field: "sno", headerName: "S No", width: 70 },
    {
      field: "loincName",
      headerName: "Observations (Physical Activity)",
      width: 220,
      renderCell: (params: any) => (
        <span title={params?.row?.snomedData?.LONG_COMMON_NAME}>
          {truncate(params?.row?.snomedData?.LONG_COMMON_NAME)}
        </span>
      ),
    },
    {
      field: "value",
      headerName: "Value/Comment",
      width: 120,
    },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "recordedDate",
      headerName: "Record Date Time",
      width: 170,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime).format("DD/MM/YYYY HH:mm")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex justify-center items-center gap-1">
          {params.row.newRow == true ? (
            <div className="flex justify-center items-center">
              <TrashIcon
                className="w-5 h-5 text-red-500"
                onClick={() => phyDelete(params.row)}
              />
            </div>
          ) : (
            <>
              {params.row.isActive == 1 ? (
                <div
                  title="Active"
                  onClick={(e: any) => handleInactive(params.row, "physical")}
                  className="cursor-pointer"
                >
                  <ActiveIcon />
                </div>
              ) : (
                <div title="Inactive" style={{ cursor: "not-allowed" }}>
                  <InactiveIcon />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  const columns2: GridColDef[] = [
    { field: "sno", headerName: "S No", width: 70 },
    {
      field: "loincName",
      headerName: "Observations (General Assessment)",
      width: 220,
      renderCell: (params: any) => (
        <span title={params.row.snomedData.LONG_COMMON_NAME}>
          {truncate(params.row.snomedData.LONG_COMMON_NAME)}
        </span>
      ),
    },
    {
      field: "value",
      headerName: "Value/Comment",
      width: 120,
    },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "recordedTime",
      headerName: "Record Date Time",
      width: 170,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime).format("DD/MM/YYYY HH:mm")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex justify-center items-center gap-1">
          {params.row.newRow == true ? (
            <div>
              <TrashIcon
                className="w-5 h-5 text-red-500"
                onClick={() => genDelete(params.row)}
              />
            </div>
          ) : (
            <>
              {params.row.isActive == 1 ? (
                <div
                  title="Active"
                  onClick={(e: any) => handleInactive(params.row, "general")}
                  className="cursor-pointer"
                >
                  <ActiveIcon />
                </div>
              ) : (
                <div title="Inactive" style={{ cursor: "not-allowed" }}>
                  <InactiveIcon />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  const columns3: GridColDef[] = [
    { field: "sno", headerName: "S No", width: 70 },
    {
      field: "loincName",
      headerName: "Observations",
      width: 220,
      renderCell: (params: any) => (
        <span title={params.row.snomedData.LONG_COMMON_NAME}>
          {truncate(params.row.snomedData.LONG_COMMON_NAME)}
        </span>
      ),
    },
    {
      field: "value",
      headerName: "Value/Comment",
      width: 120,
    },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "recordedTime",
      headerName: "Record Date Time",
      width: 170,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime).format("DD/MM/YYYY HH:mm")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex justify-center items-center gap-1">
          {params.row.newRow == true ? (
            <div>
              <TrashIcon
                className="w-5 h-5 text-red-500"
                onClick={() => womenDelete(params.row)}
              />
            </div>
          ) : (
            <>
              {params.row.isActive == 1 ? (
                <div
                  title="Active"
                  onClick={(e: any) => handleInactive(params.row, "women")}
                  className="cursor-pointer"
                >
                  <ActiveIcon />
                </div>
              ) : (
                <div title="Inactive" style={{ cursor: "not-allowed" }}>
                  <InactiveIcon />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  const columns4: GridColDef[] = [
    { field: "sno", headerName: "S No", width: 70 },
    {
      field: "loincName",
      headerName: "Observations",
      width: 220,
      renderCell: (params: any) => (
        <span title={params.row.snomedData.fullySpecifiedName}>
          {truncate(params.row.snomedData.fullySpecifiedName)}
        </span>
      ),
    },
    {
      field: "value",
      headerName: "Value/Comment",
      width: 120,
    },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "recordedTime",
      headerName: "Record Date Time",
      width: 170,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime).format("DD/MM/YYYY HH:mm")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex justify-center items-center gap-1">
          {params.row.newRow == true ? (
            <div>
              <TrashIcon
                className="w-5 h-5 text-red-500"
                onClick={() => dietDelete(params.row)}
              />
            </div>
          ) : (
            <>
              {params.row.isActive == 1 ? (
                <div
                  title="Active"
                  onClick={(e: any) => handleInactive(params.row, "dietType")}
                  className="cursor-pointer"
                >
                  <ActiveIcon />
                </div>
              ) : (
                <div title="Inactive" style={{ cursor: "not-allowed" }}>
                  <InactiveIcon />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  const columns5: GridColDef[] = [
    { field: "sno", headerName: "S No", width: 70 },
    {
      field: "loincName",
      headerName: "Observations",
      width: 220,
      renderCell: (params: any) => (
        <span title={params.row.snomedData.fullySpecifiedName}>
          {truncate(params.row.snomedData.fullySpecifiedName)}
        </span>
      ),
    },
    {
      field: "value",
      headerName: "Value/Comment",
      width: 120,
    },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    {
      field: "recordedTime",
      headerName: "Record Date Time",
      width: 170,
      renderCell: (params: any) => (
        <>{moment(params.row.recordedTime).format("DD/MM/YYYY HH:mm")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex justify-center items-center gap-1">
          {params.row.newRow == true ? (
            <div>
              <TrashIcon
                className="w-5 h-5 text-red-500"
                onClick={() => tobaccoDelete(params.row)}
              />
            </div>
          ) : (
            <>
              {params.row.isActive == 1 ? (
                <div
                  title="Active"
                  onClick={(e: any) => handleInactive(params.row, "tobacco")}
                  className="cursor-pointer"
                >
                  <ActiveIcon />
                </div>
              ) : (
                <div title="Inactive" style={{ cursor: "not-allowed" }}>
                  <InactiveIcon />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  //Delete Functions
  const phyDelete = (row: any) => {
    const filteredData = phyData.filter((item: any) => item.sno != row.sno);
    let array: any = [];
    filteredData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        units: item.units,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        value: item.value,
        newRow: item.newRow,
        isActive: item.isActive,
        recordedBy: item.recordedBy,
        recordedDateTime: item.recordDateTime,
      };
      array.push(obj);
    });
    setPhyData(array);
  };
  const genDelete = (row: any) => {
    const filteredData = genData.filter((item: any) => item.sno != row.sno);
    let array: any = [];
    filteredData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        units: item.units,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        value: item.value,
        newRow: item.newRow,
        isActive: item.isActive,
        recordedBy: item.recordedBy,
        recordedDateTime: item.recordDateTime,
      };
      array.push(obj);
    });
    setGenData(array);
  };
  const womenDelete = (row: any) => {
    const filteredData = womenData.filter((item: any) => item.sno != row.sno);
    let array: any = [];
    filteredData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        units: item.units,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        value: item.value,
        newRow: item.newRow,
        isActive: item.isActive,
        recordedBy: item.recordedBy,
        recordedDateTime: item.recordDateTime,
      };
      array.push(obj);
    });
    setWomenData(array);
  };
  const dietDelete = (row: any) => {
    const filteredData = dietData.filter((item: any) => item.sno != row.sno);
    let array: any = [];
    filteredData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        snomedId: item.snomedId,
        snomedData: item.snomedData,
        dietTypeObservation: item.dietTypeObservation,
        value: item.value,
        newRow: item.newRow,
        isActive: item.isActive,
        recordedBy: item.recordedBy,
        recordedDateTime: item.recordDateTime,
      };
      array.push(obj);
    });
    setDietData(array);
  };
  const tobaccoDelete = (row: any) => {
    const filteredData = tobaccoData.filter((item: any) => item.sno != row.sno);
    let array: any = [];
    filteredData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        snomedId: item.snomedId,
        snomedData: item.snomedData,
        value: item.value,
        newRow: item.newRow,
        isActive: item.isActive,
        recordedBy: item.recordedBy,
        recordedDateTime: item.recordDateTime,
      };
      array.push(obj);
    });
    setTobaccoData(array);
  };

  const getRowId = (row: any) => row.sno;

  //Get look up List(Autocomplete List)

  const getUom = () => {
    services
      .get(getConfigData + "UnitOfMeasure" + "/0")
      .then((response) => {
        let array: any = [];
        response.data.configData.map((item: any, index: number) => {
          let obj = {
            label: item.desc,
            value: item.code,
          };
          array.push(obj);
        });
        setUomList(array);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getPhyList = (term: any) => {
    services
      .get(
        `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=1000&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${term}&timing=ALL`
      )
      .then((response) => {
        let arr = response.data;
        setPhyRespoArray(response.data);
        let arr1: any = [];
        arr.map((item: any, index: number) => {
          let obj = {
            value: item.LOINC_NUMBER,
            label: item.LONG_COMMON_NAME,
          };
          arr1.push(obj);
        });
        setPhysicalActivityList(arr1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getGenList = (term: string) => {
    services
      .get(
        `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=20&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${term}&timing=ALL`
      )
      .then((response) => {
        let arr = response.data;
        setGenRespoArray(response.data);
        let arr1: any = [];
        arr.map((item: any, index: number) => {
          let obj = {
            value: item.LOINC_NUMBER,
            label: item.LONG_COMMON_NAME,
          };
          arr1.push(obj);
        });
        setGeneralAssesmentList(arr1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getWomenList = (term: any) => {
    services
      .get(
        `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=20&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${term}&timing=ALL`
      )
      .then((response) => {
        let arr = response.data;
        setWomenRespoArray(response.data);
        let arr1: any = [];
        arr.map((item: any, index: number) => {
          let obj = {
            value: item.LOINC_NUMBER,
            label: item.LONG_COMMON_NAME,
          };
          arr1.push(obj);
        });
        setWomenObservationList(arr1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getDietTypeList = () => {
    services
      .get(snowmedData + "230092000")
      .then((response) => {
        let arr = response.data;
        let arr1: any = [];
        setDietRespList(response.data);
        arr.map((item: any, index: number) => {
          let obj = {
            value: item.id,
            label: item.fullySpecifiedName.substring(
              0,
              item.fullySpecifiedName.indexOf("(")
            ),
          };
          arr1.push(obj);
        });
        setDietTypeObservationList(arr1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getToboccoList = () => {
    services
      .get(snowmedData + "365981007")
      .then((response) => {
        let arr = response.data;
        let arr1: any = [];
        setTobaccoRespList(response.data);
        arr.map((item: any, index: number) => {
          let obj = {
            value: item.id,
            label: item.fullySpecifiedName.substring(
              0,
              item.fullySpecifiedName.indexOf("(")
            ),
          };
          arr1.push(obj);
        });
        setTobaccoBehaviourList(arr1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  //Tables (5 tables) Data
  const getAllTablesData = () => {
    services
      .get(getWellnessRecord + patientid + "/" + opdEncounterId)
      .then((response) => {
        let physicalActivity = response.data.physyicalSet;
        physicalActivity.forEach((item: any, i: number) => {
          item.sno = i + 1;
          item.newRow = false;
          item.lonicNumber = item.snomedData.LOINC_NUMBER;
        });
        if (response.data.womenWellnessSet != null) {
          let womenActivity = response.data.womenWellnessSet;
          womenActivity.forEach((item: any, i: number) => {
            item.sno = i + 1;
            item.newRow = false;
            item.lonicNumber = item.snomedData.LOINC_NUMBER;
          });
          setWomenData(womenActivity);
        }
        let genActivity = response.data.generalSet;
        genActivity.forEach((item: any, i: number) => {
          item.sno = i + 1;
          item.newRow = false;
          item.lonicNumber = item.snomedData.LOINC_NUMBER;
        });
        setPhyData(physicalActivity);
        let dietType = response.data.dietTypeObservationSet;
        dietType.forEach((item: any, i: number) => {
          item.sno = i + 1;
          item.newRow = false;
          item.lonicNumber = item.snomedData.LOINC_NUMBER;
        });
        setDietData(dietType);
        let tobacco = response.data.SmokingBehaviorSet;
        tobacco.forEach((item: any, i: number) => {
          item.sno = i + 1;
          item.newRow = false;
          item.lonicNumber = item.snomedData.LOINC_NUMBER;
        });
        setTobaccoData(tobacco);
        setGenData(genActivity);
        setAgeOfMenacrchy(response.data.womenWellnessSet[0].ageOfMenarche);
        setLmpDate(
          moment(moment(response.data.womenWellnessSet[0].lmp, "DD/MM/YYYY"))
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  //Handle change functions
  const handleGenAssesmentSearchChange = (e: any) => {
    setGeneralAssesment(e.target.value);
    if (e.target.value.length > 2) {
      getGenList(e.target.value);
    }
  };
  const handleWomenObsSearchChange = (e: any) => {
    setWomenObservation(e.target.value);
    if (e.target.value.length > 2) {
      getWomenList(e.target.value);
    }
  };
  const handlePhySearchChange = (e: any) => {
    setPhysicalActivity(e.target.value);
    if (e.target.value.length > 2) {
      getPhyList(e.target.value);
    }
  };
  const handleValueChange1 = (e: any) => {
    setPhyValue(sanitizeInput(e.target.value));
  };
  const handleGenValueChange = (e: any) => {
    setGenValue(sanitizeInput(e.target.value));
  };
  const handlePhyUnits = (e: any) => {
    setPhyUnits(e);
  };
  const handleDietTypeObsSearchChange = (e: any) => {
    setTobaccoBehaviour(e);
  };
  const handleTobaccoSearchChange = (e: any) => {
    setTobaccoBehaviour(e);
  };
  const capitalize = (name: string) => {
    return name.charAt(0).toUpperCase() + name.substring(1, name.length);
  };

  //Add button function

  const handlePhyAdd = () => {
    if (
      phyData.some((item: any) => item.lonicNumber == physicalActivity.value)
    ) {
      toast.error("Duplicate entry");
    } else {
      const filteredData = phyRespoArray.filter(
        (item: any) => item.LOINC_NUMBER == physicalActivity.value
      );
      let object: any = {};
      object.sno = phyData.length + 1;
      object.value = phyValue;
      object.units = phyUnits.label;
      object.lonicNumber = physicalActivity.value;
      object.snomedData = filteredData[0];
      object.newRow = true;
      object.isActive = 1;
      (object.recordedBy = capitalize(jsonParse("loginResponse").employeename)),
        (object.recordedDateTime = moment().format("YYYY-MM-DD HH:mm:ss")),
        setPhyData((prevData: any) => [...prevData, object]);
      setPhyValue("");
      setPhysicalActivity(null);
      setPhyUnits(null);
    }
  };

  const handleGenAdd = () => {
    if (
      genData.some((item: any) => item.lonicNumber == generalAssesment.value)
    ) {
      toast.error("Duplicate entry");
    } else {
      const filteredData = genRespoArray.filter(
        (item: any) => item.LOINC_NUMBER == generalAssesment.value
      );
      let object: any = {};
      object.sno = genData.length + 1;
      object.value = genValue;
      object.units = genUnits.label;
      object.lonicNumber = generalAssesment.value;
      object.snomedData = filteredData[0];
      object.isActive = 1;
      object.newRow = true;
      (object.recordedBy = capitalize(jsonParse("loginResponse").employeename)),
        (object.recordedDateTime = moment().format("YYYY-MM-DD HH:mm:ss")),
        setGenData((prevData: any) => [...prevData, object]);
      setGenValue("");
      setGeneralAssesment(null);
      setGenUnits(null);
    }
  };
  const handleWomenAdd = () => {
    if (
      womenData.some((item: any) => item.lonicNumber == womenObservation.value)
    ) {
      toast.error("Duplicate entry");
    } else {
      const filteredData = womenRespoArray.filter(
        (item: any) => item.LOINC_NUMBER == womenObservation.value
      );
      let object: any = {};
      object.sno = womenData.length + 1;
      object.value = womenValue;
      object.units = womenUnits.label;
      object.newRow = true;
      object.isActive = 1;
      object.lonicNumber = womenObservation.value;
      (object.ageOfMenarche = ageOfMenarche),
        (object.lmp = moment(lmpDate).format("YYYY-MM-DD"));
      object.snomedData = filteredData[0];
      object.recordedBy = capitalize(jsonParse("loginResponse").employeename);
      object.recordedDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      setWomenData((prevData: any) => [...prevData, object]);
      setWomenValue("");
      setWomenObservation(null);
      setWomenUnits(null);
    }
  };

  const handleDietAdd = () => {
    if (
      dietData.some(
        (item: any) => item.lonicNumber == dietTypeObservation.value
      )
    ) {
      toast.error("Duplicate entry");
    } else {
      const filteredData = dietRespList.filter(
        (item: any) => item.id == dietTypeObservation.value
      );
      let object: any = {};
      object.sno = dietData.length + 1;
      (object.dietTypeObservation = dietTypeObservation.label),
        (object.value = dietValue);
      object.lonicNumber = dietTypeObservation.value;
      filteredData[0].LOINC_NUMBER = object.lonicNumber;
      filteredData[0].ShortName = filteredData[0].fullySpecifiedName;
      object.snomedData = filteredData[0];
      object.newRow = true;
      object.isActive = 1;
      object.recordedBy = capitalize(jsonParse("loginResponse").employeename);
      object.recordedDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      setDietData((prevData: any) => [...prevData, object]);
      setDietTypeObservation("");
      setDietValue("");
      setKey1((k) => k + 1);
    }
  };
  const handleTobaccoAdd = () => {
    if (
      tobaccoData.some(
        (item: any) => item.lonicNumber == tobaccoBehaviour.value
      )
    ) {
      toast.error("Duplicate entry");
    } else {
      const filteredData = tobaccoRespList.filter(
        (item: any) => item.id == tobaccoBehaviour.value
      );
      let object: any = {};
      object.sno = tobaccoData.length + 1;
      object.tobacoSmokingBehaviour = tobaccoBehaviour.label;
      object.value = tobaccoValue;
      object.lonicNumber = tobaccoBehaviour.value;
      filteredData[0].ShortName = filteredData[0].fullySpecifiedName;
      filteredData[0].LOINC_NUMBER = object.lonicNumber;
      object.snomedData = filteredData[0];
      object.newRow = true;
      object.isActive = 1;
      object.recordedBy = capitalize(jsonParse("loginResponse").employeename);
      object.recordedDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      setTobaccoData((prevData: any) => [...prevData, object]);
      setTobaccoBehaviour("");
      setTobaccoValue("");
      setKey2((k) => k + 1);
    }
  };

  //Save function

  const onSave = () => {
    let physicalActivitySet: any = [];
    phyData.map((item: any) => {
      let obj = {
        value: item.value,
        units: item.units,
        recordedDateTime: item.recordedDateTime,
        recordedBy: item.recordedBy,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        statusFlag: 1,
        isActive: 1,
      };
      physicalActivitySet.push(obj);
    });
    let generalWellnesSet: any = [];
    genData.map((item: any) => {
      let obj = {
        value: item.value,
        units: item.units,
        recordedDateTime: item.recordedDateTime,
        recordedBy: item.recordedBy,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        statusFlag: 1,
        isActive: 1,
      };
      generalWellnesSet.push(obj);
    });
    let womenWellnesSet: any = [];
    if (getLocalItem("gender") && getLocalItem("gender") != "male") {
      womenData.map((item: any) => {
        let obj = {
          value: item.value,
          units: item.units,
          recordedDateTime: item.recordedDateTime,
          recordedBy: item.recordedBy,
          lonicNumber: item.lonicNumber,
          lmp: item.lmp,
          ageOfMenarche: item.ageOfMenarche,
          snomedData: item.snomedData,
          statusFlag: 1,
          isActive: 1,
        };
        womenWellnesSet.push(obj);
      });
    }
    let dietTypeSet: any = [];
    dietData.map((item: any) => {
      let obj = {
        value: item.value,
        dietTypeObservation: item.dietTypeObservation,
        recordedDateTime: item.recordedDateTime,
        recordedBy: item.recordedBy,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        statusFlag: 1,
        isActive: 1,
      };
      dietTypeSet.push(obj);
    });
    let tobaccoSet: any = [];
    tobaccoData.map((item: any) => {
      let obj = {
        value: item.value,
        tobacoSmokingBehaviour: item.tobacoSmokingBehaviour,
        recordedDateTime: item.recordedDateTime,
        recordedBy: item.recordedBy,
        lonicNumber: item.lonicNumber,
        snomedData: item.snomedData,
        statusFlag: 1,
        isActive: 1,
      };
      tobaccoSet.push(obj);
    });
    if (phyData.length == 0) {
      toast.error("Please Enter Physical Activity Records");
    } else if (genData.length == 0) {
      toast.error("Please Enter General Assessment Records");
    } else if (dietData.length == 0) {
      toast.error("Please Enter Diet Observation Records");
    } else if (tobaccoData.length == 0) {
      toast.error("Please Enter Smoking Behaviour Records");
    } else {
      let postObj = {
        patientId: Number(patientid),
        opdEncounterId: Number(opdEncounterId),
        recordedBy: capitalize(jsonParse("loginResponse").employeename),
        opAssessmentWellnessDetails: {
          patientId: Number(patientid),
          opdEncounterId: Number(opdEncounterId),
          physicalActivitySet: physicalActivitySet,
          generalWellnesSet: generalWellnesSet,
          womenWellnesSet:
            getLocalItem("gender") == "male" ? null : womenWellnesSet,
          tobacoSmokingBehaviorSet: tobaccoSet,
          dietTypeObservationSet: dietTypeSet,
        },
      };
      services
        .create(saveWellnessRecord, postObj)
        .then((response) => {
          toast.success("Saved Successfully");
          setPhyData([]);
          setWomenData([]);
          setGenData([]);
          getAllTablesData();
        })
        .catch((error) => {
          console.log(error.message);
          toast.error("Error saving record");
        });
    }
  };
  const getRowClassName = (params: any) => {
    return params.row.isActive === 1 ? "" : "disabled-row";
  };
  const handleOpen = () => setOpen(!open);
  const [openAcc, setOpenAcc] = React.useState(1);

  const handleOpenAcc = (value: any) =>
    setOpenAcc(openAcc === value ? 0 : value);
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(40);
  const [phyColor, setPhyColor] = useState(``);
  const handleReset = () => {
    setPhyData([]);
    setWomenData([]);
    setGenData([]);
    setDietData([]);
    setTobaccoData([]);
  };
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>

      <div className="accordion-custom">
        <Accordion
          open={openAcc === 1}
          icon={<UpArrowIcon id={1} open={openAcc} />}
        >
          <AccordionHeader
            onClick={() => {
              setPhyColor(`bg-blue-grey-200`);
              handleOpenAcc(1);
            }}
            className={`text-md ${phyColor}`}
          >
            Physical Activity
          </AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-8 gap-6 mt-2">
              <div className="col-span-3 my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="Physical Activity / Observation (LOINC search)"
                  onChange={(e: any) => {
                    setPhysicalActivity(e);
                  }}
                  onSearchInputChange={handlePhySearchChange}
                  isSearchable={true}
                  value={physicalActivity}
                  options={physicalActivityList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${physicalActivity?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  Physical Activity / Observation (LOINC search)
                </label>
              </div>
              <div className="col-span-2">
                <Input
                  label="Value/Comment"
                  color="blue"
                  crossOrigin={undefined}
                  value={phyValue}
                  onChange={handleValueChange1}
                ></Input>
                <div className="w-full">
                  {phyValue && !alphaNumWithFewSymbols.test(phyValue) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex justify-end items-center my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="Units                    "
                  onChange={handlePhyUnits}
                  isSearchable={true}
                  value={phyUnits}
                  options={uomList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${phyUnits?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  Units
                </label>
              </div>
              <div className=" flex justify-end items-center">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handlePhyAdd}
                  width="w-[120px] py-3"
                />
              </div>
            </div>
            <div className="mt-3">
              <DataGrid
                rows={phyData}
                columns={columns1}
                getRowId={getRowId}
                autoHeight
                getRowClassName={getRowClassName}
                isRowSelectable={(params: any) => params.row.isActive === 1}
                pageSizeOptions={[10, 20]}
                checkboxSelection={false}
                slots={{ toolbar: null }}
              />
            </div>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={openAcc === 2}
          icon={<UpArrowIcon id={2} open={openAcc} />}
        >
          <AccordionHeader onClick={() => handleOpenAcc(2)} className="text-md">
            General Assessment
          </AccordionHeader>
          <AccordionBody>
            <div className="grid grid-cols-8 gap-6 mt-2">
              <div className="col-span-3 my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="General Assessment (LOINC search)"
                  onChange={(e: any) => {
                    setGeneralAssesment(e);
                  }}
                  isSearchable={true}
                  onSearchInputChange={handleGenAssesmentSearchChange}
                  value={generalAssesment}
                  options={generalAssesmentList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${generalAssesment?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  General Assessment (LOINC search)
                </label>
              </div>
              <div className="col-span-2">
                <Input
                  label="Value/Comment"
                  color="blue"
                  crossOrigin={undefined}
                  value={genValue}
                  onChange={handleGenValueChange}
                ></Input>
                <div className="w-full">
                  {genValue && !alphaNumWithFewSymbols.test(genValue) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex justify-end items-center my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="Units"
                  isSearchable={true}
                  onChange={(e: any) => {
                    setGenUnits(e);
                  }}
                  value={genUnits}
                  options={uomList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${genUnits?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  Units
                </label>
              </div>
              <div className=" flex justify-end items-center">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handleGenAdd}
                  width="w-[120px] py-3"
                />
              </div>
            </div>
            <div className="mt-3 border-5 border-spacing-3 border-grey-600 rounded-lg">
              <DataGrid
                rows={genData}
                columns={columns2}
                getRowId={getRowId}
                autoHeight
                getRowClassName={getRowClassName}
                isRowSelectable={(params: any) => {
                  return params.row.isActive === true;
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection={false}
                slots={{ toolbar: null }}
              />
            </div>
          </AccordionBody>
        </Accordion>
        {getLocalItem("gender") && getLocalItem("gender") == "male" ? null : (
          <>
            <Accordion
              open={openAcc === 3}
              icon={<UpArrowIcon id={3} open={openAcc} />}
            >
              <AccordionHeader
                onClick={() => handleOpenAcc(3)}
                className="text-md"
              >
                Women observation
              </AccordionHeader>
              <AccordionBody>
                <div className="grid grid-cols-8 gap-6 mt-3">
                  <div className="font-bold text-md mt-3 col-span-3">
                    Women Wellness
                  </div>
                  <div className="col-span-2">
                    <DateInput
                      label="LMP"
                      value={lmpDate}
                      onChange={(e: any) => setLmpDate(e)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Age of menarche"
                      crossOrigin={undefined}
                      required={true}
                      color="blue"
                      value={ageOfMenarche}
                      onChange={(e: any) =>
                        setAgeOfMenacrchy(sanitizeInput(e.target.value))
                      }
                    ></Input>
                    <div className="w-full">
                      {ageOfMenarche &&
                        !alphaNumWithFewSymbols.test(ageOfMenarche) && (
                          <div className="text-[11px] text-red-500">
                            Please do not enter special characters
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-6 mt-3">
                  <div className="col-span-3 my-select Select-is-open relative">
                    <Select
                      primaryColor="blue"
                      placeholder="Observation (LOINC search)"
                      onChange={(e: any) => {
                        setWomenObservation(e);
                      }}
                      value={womenObservation}
                      isSearchable={true}
                      onSearchInputChange={handleWomenObsSearchChange}
                      options={womenObservationList}
                      classNames={{
                        menuButton: ({ isDisabled }: any) =>
                          `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                          duration-300 focus:outline-none h-[39px]
                         
                          ${isDisabled
                            ? "bg-blue-gray-200"
                            : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                          }`,
                        menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                        listItem: ({ isSelected }: any) =>
                          `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                            ? `text-white bg-blue-500`
                            : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                          }`,
                      }}
                    />
                    <label
                      style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                      className={`${womenObservation?.label !== undefined
                        ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                        : "text-sm opacity-0 top-10"
                        } 
                                                              truncate 
                                                              cursor-default 
                                                              select-none  
                                                              absolute transition-all
                                                             `}
                    >
                      Observation (LOINC search)
                    </label>
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Value/Comment"
                      color="blue"
                      crossOrigin={undefined}
                      onChange={(e: any) =>
                        setWomenValue(sanitizeInput(e.target.value))
                      }
                      value={womenValue}
                    ></Input>
                    <div className="w-full">
                      {womenValue && !alphaNumWithFewSymbols.test(womenValue) && (
                        <div className="text-[11px] text-red-500">
                          Please do not enter special characters
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end items-center my-select Select-is-open relative">
                    <Select
                      primaryColor="blue"
                      placeholder="Units"
                      onChange={(e: any) => {
                        setWomenUnits(e);
                      }}
                      value={womenUnits}
                      options={uomList}
                      classNames={{
                        menuButton: ({ isDisabled }: any) =>
                          `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                          duration-300 focus:outline-none h-[39px]
                         
                          ${isDisabled
                            ? "bg-blue-gray-200"
                            : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                          }`,
                        menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                        listItem: ({ isSelected }: any) =>
                          `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                            ? `text-white bg-blue-500`
                            : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                          }`,
                      }}
                    />
                    <label
                      style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                      className={`${womenUnits?.label !== undefined
                        ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                        : "text-sm opacity-0 top-10"
                        } 
                                                              truncate 
                                                              cursor-default 
                                                              select-none  
                                                              absolute transition-all
                                                             `}
                    >
                      Units
                    </label>
                  </div>
                  <div className="flex justify-end items-center">
                    <ActionButton
                      buttonText="ADD"
                      handleSubmit={handleWomenAdd}
                      width="w-[120px] py-3"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <DataGrid
                    rows={womenData}
                    columns={columns3}
                    getRowId={getRowId}
                    autoHeight
                    getRowClassName={getRowClassName}
                    isRowSelectable={(params: any) => {
                      return params.row.isActive === true;
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection={false}
                    slots={{ toolbar: null }}
                  />
                </div>
              </AccordionBody>
            </Accordion>
          </>
        )}
        <Accordion
          open={openAcc === 4}
          icon={<UpArrowIcon id={4} open={openAcc} />}
        >
          <AccordionHeader onClick={() => handleOpenAcc(4)} className="text-md">
            Life Style
          </AccordionHeader>
          <AccordionBody>
            <div className="font-bold text-md">Diet Type Observation</div>
            <div className="grid grid-cols-8 gap-6 mt-2">
              <div className="col-span-3 my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="Diet Type Observation"
                  onChange={(e: any) => setDietTypeObservation(e)}
                  value={dietTypeObservation}
                  isSearchable={true}
                  onSearchInputChange={handleDietTypeObsSearchChange}
                  options={dietTypeObservationList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${dietTypeObservation?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  Diet Type Observation
                </label>
              </div>
              <div className="col-span-2" key={key1}>
                <Input
                  label="Value/Comment"
                  color="blue"
                  crossOrigin={undefined}
                  value={dietValue}
                  onChange={(e: any) =>
                    setDietValue(sanitizeInput(e.target.value))
                  }
                ></Input>
                <div className="w-full">
                  {dietValue && !alphaNumWithFewSymbols.test(dietValue) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handleDietAdd}
                  width="w-[120px] py-3"
                />
              </div>
            </div>
            <div className="mt-3 border-5 border-spacing-3 border-grey-600 rounded-lg">
              <DataGrid
                rows={dietData}
                columns={columns4}
                getRowId={getRowId}
                autoHeight
                getRowClassName={getRowClassName}
                isRowSelectable={(params: any) => {
                  return params.row.isActive === true;
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection={false}
                slots={{ toolbar: null }}
              />
            </div>
            <Divider className="mt-5" />
            <div className="font-bold text-md mt-3">
              Tobacco smoking behaviour
            </div>
            <div className="grid grid-cols-8 gap-6 mt-2">
              <div className="col-span-3 my-select relative">
                <Select
                  primaryColor="blue"
                  placeholder="Tobacco smoking behaviour"
                  onSearchInputChange={handleTobaccoSearchChange}
                  onChange={(e: any) => setTobaccoBehaviour(e)}
                  isSearchable={true}
                  value={tobaccoBehaviour}
                  options={tobaccoBehaviourList}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                      duration-300 focus:outline-none h-[39px]
                     
                      ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${tobaccoBehaviour?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                          truncate 
                                                          cursor-default 
                                                          select-none  
                                                          absolute transition-all
                                                         `}
                >
                  Tobacco smoking behaviour
                </label>
              </div>
              <div className="col-span-2" key={key2}>
                <Input
                  label="Value/Comment"
                  color="blue"
                  crossOrigin={undefined}
                  value={tobaccoValue}
                  onChange={(e: any) =>
                    setTobaccoValue(sanitizeInput(e.target.value))
                  }
                ></Input>
                <div className="w-full">
                  {tobaccoValue && !alphaNumWithFewSymbols.test(tobaccoValue) && (
                    <div className="text-[11px] text-red-500">
                      Please do not enter special characters
                    </div>
                  )}
                </div>
              </div>
              <div className=" flex justify-end items-center">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handleTobaccoAdd}
                  width="w-[120px] py-3"
                />
              </div>
            </div>
            <div className="mt-3 border-5 border-spacing-3 border-grey-600 rounded-lg">
              <DataGrid
                rows={tobaccoData}
                columns={columns5}
                getRowId={getRowId}
                autoHeight
                getRowClassName={getRowClassName}
                isRowSelectable={(params: any) => {
                  return params.row.isActive === true;
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection={false}
                slots={{ toolbar: null }}
              />
            </div>
          </AccordionBody>
        </Accordion>
        <div className="flex justify-end gap-4 mt-4">
          <div>
            {props?.screenData?.Save === 1 &&
              <ActionButton
                handleSubmit={onSave}
                buttonText="Save"
                width="w-[120px] py-3"
              />
            }
          </div>
          <div>
            <ActionButton
              buttonText="Reset"
              handleSubmit={handleReset}
              width="w-[120px] py-3 bg-red-500 hover:bg-red-600"
            />
          </div>
          <div>
            <Dialog open={open}>
              <DialogHeader className=" justify-center">
                <div className="w-100">
                  <div className="text-center text-[20px] text-blue-500">
                    Are you sure,
                  </div>
                  <div className="text-center text-[20px] text-blue-500">
                    you want to Inactive this record?
                  </div>
                </div>
              </DialogHeader>
              <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                <strong>Note:</strong>
                {"Once you Inactive this record, you can't undo the changes"}
              </DialogBody>
              <DialogFooter className="text-center justify-center">
                <Button
                  variant="gradient"
                  color="blue"
                  className="mr-2 bg-blue-500 hover:bg-blue-600"
                  onClick={handleInactiveSubmit}
                >
                  <span>Yes</span>
                </Button>
                <Button
                  variant="gradient"
                  className="bg-red-500 hover:bg-red-600"
                  color="red"
                  onClick={handleOpen}
                >
                  <span>No</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}


export default roleInfoScreenData(WellnessRecord, "WR")