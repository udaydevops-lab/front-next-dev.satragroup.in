"use client";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Tooltip,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { useParams, useRouter } from "next/navigation";
import Select from "react-tailwindcss-select";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Box, Divider } from "@mui/material";
import React, { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import axios from "axios";
import DateInput from "@/app/_common/date-input";
import {
  snowmedData,
  saveFavourites,
  saveDiagnosis,
  saveFixedDiagnosis,
  saveActive,
  deleteDiagnosis,
  deleteFavourite,
  getFindByDiagnosis,
  getFixedDiagnosis,
  snomedSearchByTermAndSemanticTag,
  getFavouriteDiagnosis,
} from "@/app/utilities/api-urls";
import { url } from "inspector";
import services from "@/app/utilities/services";
import moment from "moment";
import CheckboxMui from "@/app/_common/checkbox";
import DiagnosisSearchTable from "./component/DiagnosisSearchTable";
import {
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { DiagnosisForm } from "./component";
import MainSection from "./component/MainSection";
import { DeleteFavourite } from "./component/DeleteFavourite";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function Diagnosis(props: any) {
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const storedLoginResponse = getLocalItem("loginResponse");
  let data;

  try {
    data = storedLoginResponse ? JSON.parse(storedLoginResponse) : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    data = ""; // Set a default value or handle the error accordingly
  }

  let doctor = data?.employeename;
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = {
    userId: loginResponse?.userId,
    roleId: loginResponse?.roleId,
    employeename: loginResponse?.employeename,
    employeeid: loginResponse?.employeeid,
    locationId: loginResponse?.locationId,
    serviceEntityId: loginResponse?.serviceEntityId,
    username: loginResponse?.username,
    "Access-Control-Allow-Origin": "*",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const initialTableData: TableData[] = [
    {
      sno: 1,
      description: "",
      conceptId: "",
      fullySpecifiedName: "",
      onSetDate: "",
      diagnosisType: "",
      comments: "",
    },
  ];
  type TableData = {
    [key: string]: any;
  };

  const [popupOpenFav, setPopupOpenFav] = useState<any>(false);
  const [popupFavId, setPopupFavId] = useState<any>("");
  const [getFavouriteDiagnosisId, setFavouriteDiagnosisId] = useState(null);
  const [dataa, setDataa] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newDataa, setNewDataa] = useState<any[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [fixedDataa, setFixedDataa] = useState<any>([]);
  const [favoriteDataa, setFavoriteDataa] = useState<any>([]);
  const [sno, setSno] = useState<any>(0);
  const [search, setSearch] = useState<any>("");
  const [searchListMain, setSearchListMain] = useState<any>([]);
  const [snomedData, setSnomedData] = useState<any>({});
  const [consentId, setConsentId] = useState<any>("");
  const [diagnosisType, setDiagnosisType] = useState<any>({});
  const [diagnosisTypeData, setDiagnosisTypeData] = useState([]);
  const [diagnosisTypeDataMain, setDiagnosisTypeDataMain] = useState([]);
  const [tableData, setTableData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(moment());

  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();

  // diagnosis search select functionality
  const handleSearchInputChange = async (e: any) => {
    let searchData = e.target.value;
    const semantic = "disorder";
    if (searchData) {
      try {
        const response = await services.get(
          `${snomedSearchByTermAndSemanticTag}term=${searchData}&state=both&semantictag=${semantic}&acceptability=all&returnlimit=200&refsetid=null&parentid=null&fullconcept=false`
        );

        var result: any = [];
        response.data.map((item: any) => {
          let obj = {
            value: item.term.replace(/\(qualifier value\)/g, "").trim(),
            label: item.term.replace(/\(qualifier value\)/g, "").trim(),
            hierarchy: item.hierarchy,
            isPreferredTerm: 1,
            conceptState: item.conceptState,
            conceptFsn: item.conceptFsn,
            definitionStatus: item.definitionStatus,
            conceptId: item.conceptId,
            languageCode: item.languageCode,
            typeId: item.typeId,
            term: item.term,
            caseSignificanceId: item.caseSignificanceId,
            id: item.id,
            effectiveTime: item.effectiveTime,
            activeStatus: 0,
            moduleId: item.moduleId,
          };
          result.push(obj);
        });
        setSearchListMain(result);
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    }
  };
  // getting snomed data for Diagnosis Type
  const getDiagnosisType = async () => {
    try {
      const data = await services.get(snowmedData + 106229004);
      const results = data.data.map((item: any) => ({
        value: item.id.replace(/\(qualifier value\)/g, "").trim(),
        label: item.fullySpecifiedName
          .replace(/\(qualifier value\)/g, "")
          .trim(),
        definitionStatusId: item.definitionStatusId,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        effectiveTime: item.effectiveTime,
        activeStatus: 1,
        moduleId: item.moduleId,
      }));

      setDiagnosisTypeData(results);
    } catch (error) {
      console.log(error);
    }
  };

  // getting old Diagnosis Data
  const getFindByDiagnosisData = async () => {
    await services
      .get(getFindByDiagnosis + patientid + "/" + opdEncounterId)
      .then((response) => {
        let getType = response.data.map((list: any) => {
          return {
            label: list.diagnosisType,
            value: list.diagnosisType,
          };
        });
        getType.map((list: any, rowIndex: any) => {
          setDiagnosisType((prev: any) => {
            return {
              ...prev,
              [`sel${rowIndex}`]: {
                label: list.label,
                value: list.value,
              },
            };
          });
        });

        setDataa(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  // ---------------------------Get fixed data ---------------------------
  const getFixedDiagnosisData = async () => {
    await services
      .get(getFixedDiagnosis + patientid + "/" + opdEncounterId)
      .then((response) => {
        let uniqueData = response.data.reduce((acc: any, curr: any) => {
          let Obj = acc.find(
            (inner: any) =>
              inner.fixedDiagnosisDescription === curr.fixedDiagnosisDescription
          );
          if (Obj) {
            return acc;
          } else {
            return acc.concat([curr]);
          }
        }, []);
        setFixedDataa(uniqueData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  let changeValfixedData = fixedDataa.map((list: any) => {
    return {
      comments: list.comments,
      diagnosisCode: list.fixedDiagnosisCode,
      diagnosisDescriptrion: list.fixedDiagnosisDescription,
      diagnosisStatus: list.fixeddiagnosisStatus,
      diagnosisType: list.fixedDiagnosisType,
      documentDate: list.documentDate,
    };
  });

  let getFinalMerge = dataa.map((largeData: any) => {
    let merge = changeValfixedData.find(
      (lowData: any) =>
        largeData.diagnosisDescriptrion === lowData.diagnosisDescriptrion
    );

    return {
      ...largeData,
      ...(merge || {}),
    };
  });

  //------------------------------- get favourite Data --------------------------
  const getFavouriteDiagnosisData = () => {
    services
      .get(getFavouriteDiagnosis, headers)
      .then((response) => {
        let uniqueData = response.data.reduce((acc: any, curr: any) => {
          let Obj = acc.find(
            (inner: any) =>
              inner.snowmedDescriptrion === curr.snowmedDescriptrion
          );
          if (Obj) {
            return acc;
          } else {
            return acc.concat([curr]);
          }
        }, []);
        setFavoriteDataa(uniqueData);
        setFavouriteDiagnosisId(response.data[0].userFavouritesId);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  // adding date to table row
  const handleDateChange = (date: Date, id: any, columnName: any) => {
    const defaultDate = moment().toDate(); // You can customize this default date
    // Set the selected date to either the chosen date or the default date
    const selectedDate = date ? date : defaultDate;
    setSelectedDate(selectedDate);

    const updatedData = dataa.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [columnName]: selectedDate,
        };
      }
      return row;
    });

    setDataa(updatedData);
  };

  const [key1, setKey1] = useState(10);
  const [savingData, setSavingData] = useState(true);
  const [isDateInputDisabled, setIsDateInputDisabled] = useState(false);

  // add functionality
  const handleAddDiagnosis = () => {
    if (!search) {
      toast.error("Diagnosis search should not be Empty");
    } else {
      const isDuplicate = dataa.some(
        (item) => item.diagnosisDescriptrion === search.conceptFsn
      );
      if (isDuplicate) {
        toast.error("Diagnosis already exists in the table");
      } else {
        const obj = {
          isNew: true,
          id: uuidv4(),
          diagnosisCode: search.conceptId,
          diagnosisDescriptrion: search.conceptFsn,
          patientId: patientid,
          diagnosisType: diagnosisType,
          opdEncounterId: opdEncounterId,
          comments: "",
          onSetDate: "",
          documentDate: moment().format("YYYY-MM-DD"),
          diagnosisStatus: "",
          isFixedDiagnosis: 1,
          isActive: 1,
          statusFlag: 1,
          snomedData: snomedData,
          conceptId: snomedData.conceptId,
          version: 1,
        };
        setSearch("");
        const newObj: any = [...dataa];
        newObj.push(obj);
        setDataa(newObj);
        setTableData([...tableData, obj]);

        //new data
        const newDataObj: any = [...newDataa];
        newDataObj.push(obj);
        setNewDataa(newDataObj);
      }
    }
  };

  //---------------Diagnosis type functionality --------------------
  const handleDiagnosisType = (e: React.ChangeEvent<HTMLInputElement>) => {
    var result: any;
    const inputValue = e.target.value;
    if (inputValue.length > 2) {
      result = diagnosisTypeData.filter((item: any) =>
        item.label.includes(inputValue)
      );
    }
    setDiagnosisTypeDataMain(result);
  };

  // main table delete functionality
  const onAddDelete = (rowId: any) => {
    // Filter the data to remove the row with the matching rowId

    try {
      const response = axios.put(
        deleteDiagnosis + patientid + "/" + opdEncounterId + "/" + sno
      );
      const updatedData = dataa.filter((row: any) => row.sno !== rowId);
      setDataa(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  //----------------------adding to fixed diagnosis------------------------
  const handleAddtoFixed = async (item: any, index: any) => {
    try {
      const result = {
        fixedDiagnosisCode: item.diagnosisCode,
        fixedDiagnosisDescription: item.diagnosisDescriptrion,
        patientId: item.patientId,
        fixedDiagnosisType: item.diagnosisType,
        opdEncounterId: item.opdEncounterId,
        isActive: 1,
        comments: item.comments,
        onSetDate: moment(item.onSetDate).format("YYYY-MM-DD"),
        documentDate: item.documentDate,
        diagnosisStatus: item.diagnosisStatus,
        isFixedDiagnosis: item.isFixedDiagnosis,
        statusFlag: 1,
        snomedData: item.snomedData,
        conceptId: item.snomedData.conceptId,
        version: item.version,
        isAdded: 1,
      };
      let postObj = {
        patientId: patientid,
        opdEncounterId: opdEncounterId,
        finalFixeddiagnosisSet: [result],
      };

      services
        .create(saveFixedDiagnosis, postObj)
        .then((response: any) => {
          toast.success("Added to Fixed Diagnosis Successfully");
          setFixedDataa(dataa);
          getFixedDiagnosisData();
        })
        .catch((error: any) => {
          console.log(error, "ERROR");
          if (error !== undefined) {
            toast.error(`${error.message}`);

          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentsChange = (value: string, id: any, columnName: any) => {
    const updatedData = dataa.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [columnName]: value,
        };
      }
      return row;
    });

    setDataa(
      updatedData.map((list: any) => {
        return {
          ...list,
          isRowSelect: false,
        };
      })
    );
  };

  //save function on favstore
  const [getMulti, setGetMulti] = useState<any>([]);
  const handlefavstore = (data: any) => {
    let getMultiIds = [...getMulti, data.diagnosisId];
    let stringArray = Array.from(new Set(getMultiIds));
    setGetMulti([...getMulti, data.diagnosisId]);
    let postObj: any = {
      snowmedCode: data.diagnosisCode
        .replace(/\(qualifier value\)/g, "")
        .trim(),
      snowmedDescriptrion: data.diagnosisDescriptrion
        .replace(/\(qualifier value\)/g, "")
        .trim(),
      snomedTerm: data.snomedData.term
        .replace(/\(qualifier value\)/g, "")
        .trim(),
      userFavouritesId: null,
    };
    services
      .create(saveFavourites, postObj, headers)
      .then((response) => {
        toast.success("Added To  MyFavourite Successfully");
        getFavouriteDiagnosisData();
      })
      .catch((err: any) => {
        console.error("Error while saving:", err);
        if (err !== undefined) {
          toast.error(`${err.message}`);
        }
      });
  };

  // save diagnostic function
  const onSubmit = (data: any) => {
    setIsDateInputDisabled(true);
    setSavingData(true); // Set saving state to true before saving data
    // Filter objects with isNew set to true
    const newDiagnoses: any = dataa.filter(
      (dataa: any) => dataa.isNew === true
    );

    const result = newDiagnoses.map((item: any) => ({
      diagnosisCode: item.diagnosisCode,
      diagnosisDescriptrion: item.diagnosisDescriptrion,
      patientId: item.patientId,
      diagnosisType: item.diagnosisType,
      opdEncounterId: item.opdEncounterId,
      isActive: 1,
      isAdded: 1,
      comments: item.comments,
      onSetDate: moment(selectedDate).format("YYYY-MM-DD"),
      documentDate: item.documentDate,
      diagnosisStatus: item.diagnosisStatus,
      isFixedDiagnosis: item.isFixedDiagnosis,
      statusFlag: 1,
      snomedData: item.snomedData,
      conceptId: item.conceptId,
      version: item.version,
    }));

    let postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      recordedBy: doctor,
      finaldiagnosisSet: result,
    };

    services
      .create(saveDiagnosis, postObj,headers)
      .then((res) => {
        toast.success("success");
        setSavingData(false);
        getFindByDiagnosisData();
      })
      .then((err) => {
        console.error("Error while saving:", err);
        if (err !== undefined) {
          toast.error("Getting error, Please try again!");
        }
      });
  };

  //------------------- popup open when Active click ----------------
  const handleOpen = () => setOpen(!open);

  //----------------------- Active the icon in main table --------------------------------
  
  const [delLoader,setDelLoader]=useState<any>(false)

  const handelActive = async (index: any, data: any, row: any) => {
    setDelLoader(true)
    let diagnosisId = data.diagnosisId;
    const updatedDataa = dataa.map((item: any, currentIndex: number) => {
      if (currentIndex === index) {
        return {
          ...item,
          isActive: 0,
        };
      }
      return item;
    });

    setDataa(updatedDataa);

    // Filter out the selected row and add it to fixedDataa state
    const selectedRow = updatedDataa.find(
      (item: any, currentIndex: number) => currentIndex === index
    );

    if (selectedRow) {
      setFixedDataa((prevFixedDataa: any) => [...prevFixedDataa, selectedRow]);
      setIsAdded(true);
    }

    try {
      
      // Assuming diagnosisId, patientid, and opdEncounterId are available here
      const diagnosisUrl =
        saveActive + diagnosisId + "/" + patientid + "/" + opdEncounterId;
      const response = await services.create(diagnosisUrl, data);
      
      setTimeout(() => {
        // Actions to be taken after the delay
        setDelLoader(false);
        toast.success("Successfully updated the record");
      }, 2000);
    } catch (err:any) {
      setTimeout(() => {
        console.error(err);
        toast.error(`${err.response?.data?.statusMessage ? err.response.data.statusMessage : err.message}`);
        setDelLoader(false);
      }, 2000);
    }
  };
  useEffect(() => {
    getDiagnosisType();
    getFindByDiagnosisData();
    getFixedDiagnosisData();
    getFavouriteDiagnosisData();
  }, []);

  //------------------------------- Active delete -------------------------------
  const onDelete = (params: any) => {
    let deleteData = dataa.filter((item: any) => item.id !== params.id);
    setDataa(deleteData);
  };

  const handleAddtoDiagnosis = async (row: any) => {
    // getting snomed code and object
    const search = row.snowmedCode;
    const semantic = "disorder";
    const response = await services.get(
      `${snomedSearchByTermAndSemanticTag}term=${search}&state=both&semantictag=${semantic}&acceptability=all&returnlimit=500&refsetid=null&parentid=null&fullconcept=false`
    );

    // Initialize result as an empty array

    // Use map to transform items and create the result array
    const transformedData = response.data.map((item: any) => ({
      value: item.term,
      label: item.conceptFsn,
      hierarchy: item.hierarchy,
      isPreferredTerm: 1,
      conceptState: item.conceptState,
      conceptFsn: item.conceptFsn,
      definitionStatus: item.definitionStatus,
      conceptId: item.conceptId,
      languageCode: item.languageCode,
      typeId: item.typeId,
      term: item.term,
      caseSignificanceId: item.caseSignificanceId,
      id: item.id,
      effectiveTime: item.effectiveTime,
      activeStatus: 0,
      moduleId: item.moduleId,
    }));
    const result = transformedData.filter(
      (list: any) =>
        list.term === row.snomedTerm &&
        list.conceptFsn === row.snowmedDescriptrion
    );

    // Log the transformed data
    const obj = {
      isNew: true,
      id: uuidv4(),
      diagnosisCode: row.snowmedCode,
      diagnosisDescriptrion: row.snowmedDescriptrion,
      patientId: patientid,
      diagnosisType: diagnosisType,
      opdEncounterId: opdEncounterId,
      comments: "",
      onSetDate: "",
      documentDate: moment().format("YYYY-MM-DD"),
      diagnosisStatus: "",
      isFixedDiagnosis: 1,
      isActive: 1,
      statusFlag: 1,
      snomedData: result[0],
      conceptId: result[0].conceptId,
      version: 1,
    };

    const newObj: any = [...dataa, obj].reduce((acc: any, curr: any) => {
      let Obj = acc.find(
        (inner: any) =>
          inner.diagnosisDescriptrion === curr.diagnosisDescriptrion
      );
      if (Obj) {
        return acc;
      } else {
        return acc.concat([curr]);
      }
    }, []);

    setDataa(newObj);
    setTableData([...tableData, obj]);

    //new data
    const newDataObj: any = [...newDataa];
    newDataObj.push(obj);
    setNewDataa(newDataObj);
  };

  const handleAddtodiag = (row: any, rowIndex: any) => {
    const obj = {
      isNew: true,
      id: uuidv4(),
      diagnosisCode: row.fixedDiagnosisCode,
      diagnosisDescriptrion: row.fixedDiagnosisDescription,
      patientId: patientid,
      diagnosisType: diagnosisType,
      opdEncounterId: opdEncounterId,
      comments: "",
      onSetDate: "",
      documentDate: moment().format("YYYY-MM-DD"),
      diagnosisStatus: "",
      isFixedDiagnosis: 1,
      isActive: 1,
      statusFlag: 1,
      snomedData: row.snomedData,
      conceptId: row.snomedData.conceptId,
      version: 1,
      isAdded: 1,
    };
    const newObj: any = [...dataa, obj];

    setDataa(newObj);
    setSearch("");
  };

  const openpopupFav = (id: any) => {
    setPopupOpenFav(!popupOpenFav);
    setPopupFavId(id);
  };

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }

  return (
    <div>

      <Tabs value="1">
        <TabsHeader>
          <Tab value={"1"}>Diagnosis</Tab>
          <Tab value={"2"}>Fixed Diagnosis</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value={"1"}>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
              <div className="mb-4 -mx-3 md:flex py-2 relative">
                <Select
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                    duration-300 focus:outline-none 
                   
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
                  placeholder=" Diagnosis Search "
                  primaryColor="blue"
                  value={search}
                  options={searchListMain}
                  isSearchable={true}
                  onSearchInputChange={(e: any) => handleSearchInputChange(e)}
                  onChange={(e: any) => {
                    setSearch(e);
                    setConsentId(e.conceptId);
                    setSnomedData(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${search?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Diagnosis Search
                </label>
                <div className="md:w-1/6 px-6">
                  <ActionButton
                    buttonText="ADD"
                    handleSubmit={handleSubmit(handleAddDiagnosis)}
                    width="w-full py-3"
                  />
                </div>

                <div className="md:w-1/6 px-2">
                  <ActionButton
                    buttonText="My Favourites"
                    handleSubmit={() => {
                      getFavouriteDiagnosisData();

                      handleOpen();
                    }}
                    width="w-full py-1"
                  />
                  <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={setOpen}>
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                              as={Fragment}
                              enter="transform transition ease-in-out duration-500 sm:duration-700"
                              enterFrom="translate-x-full"
                              enterTo="translate-x-0"
                              leave="transform transition ease-in-out duration-500 sm:duration-700"
                              leaveFrom="translate-x-0"
                              leaveTo="translate-x-full"
                            >
                              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                  <div className="flex-1 overflow-y-auto sm:px-6">
                                    <div className="flex items-start justify-between mt-8">
                                      <Dialog.Title className="text-lg font-medium text-gray-900">
                                        My Favourites List
                                      </Dialog.Title>
                                      <div className="ml-3 flex h-7 items-center">
                                        <button
                                          type="button"
                                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                          onClick={() => setOpen(false)}
                                        >
                                          <span className="absolute -inset-0.5 z-1000">
                                            <XMarkIcon className="w-5 h-5 " />
                                          </span>
                                        </button>
                                      </div>
                                    </div>

                                    <div className="mt-18">
                                      <div className="flow-root w-full relative">
                                        {favoriteDataa &&
                                          favoriteDataa.length > 0 ? (
                                          favoriteDataa.map(
                                            (item: any, inx: number) => (
                                              <>
                                                <div className="w-full flex gap-4 p-2 border mt-2">
                                                  <div className="w-11/12">
                                                    <p className="text-sm text-blue-400">
                                                      Code: {item.snowmedCode}
                                                    </p>
                                                    <p className="text-sm">
                                                      Description:
                                                      {item.snowmedDescriptrion
                                                        .replace(
                                                          /\(qualifier value\)/g,
                                                          ""
                                                        )
                                                        .trim()}
                                                    </p>
                                                  </div>
                                                  <div className="w-1/12 relative">
                                                    <div className="absolute right-0 top-1">
                                                      <PlusCircleIcon
                                                        className="w-7 h-7 cursor-pointer text-blue-600"
                                                        onClick={() => {
                                                          handleAddtoDiagnosis(
                                                            item
                                                          );
                                                          toast.success(
                                                            "Added Successfully to Diagnosis"
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div
                                                    style={{ marginTop: "7px" }}
                                                  >
                                                    <button
                                                      onClick={() =>
                                                        openpopupFav(
                                                          item.userFavouritesId
                                                        )
                                                      }
                                                    >
                                                      <TrashIcon className="text-red-500 w-5 h-5" />
                                                    </button>
                                                  </div>
                                                </div>
                                              </>
                                            )
                                          )
                                        ) : (
                                          <p>No Data</p>
                                        )}
                                      </div>
                                    </div>

                                    <DeleteFavourite
                                      popupOpenFav={popupOpenFav}
                                      popupFavId={popupFavId}
                                      getFavouriteDiagnosisData={
                                        getFavouriteDiagnosisData
                                      }
                                      setPopupOpenFav={setPopupOpenFav}
                                    />
                                  </div>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </div>
              </div>

              <Divider className="mt-6" />
              {/* main table start */}
              <DiagnosisSearchTable
                dataa={getFinalMerge}
                diagnosisType={diagnosisType}
                diagnosisTypeData={diagnosisTypeData}
                handleDiagnosisType={handleDiagnosisType}
                setDiagnosisType={setDiagnosisType}
                setDataa={setDataa}
                handleCommentsChange={handleCommentsChange}
                handleDateChange={handleDateChange}
                handleAddtoFixed={handleAddtoFixed}
                key1={key1}
                setKey1={setKey1}
                handlefavstore={handlefavstore}
                handelActive={handelActive}
                savingData={savingData}
                onDelete={onDelete}
              />

              <div className=" flex items-center justify-end gap-x-6 ">
                <div className="md:w-1/4 gap-x-6 justify-end flex px-3 my-2">
                  <div className="w-full flex justify-end gap-6 mt-4 text-right">
                    {/* <Tooltip content="Please Select Diagnosis Type in Table it is mandatory"> */}
                    <div>
                      {props?.screenData?.Save === 1 &&
                        <ActionButton
                          buttonText="SAVE"
                          handleSubmit={handleSubmit(onSubmit)}
                          width="w-[120px] py-3"
                        />
                      }
                    </div>
                    {/* </Tooltip> */}

                    <div className="w-full flex justify-end gap-6  text-right">
                      <ActionButton buttonText="SIGN" width="w-[120px] py-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={"2"} className="px-0">
            <div className="">
              <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                {/* fixed table start */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>S.NO</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>onSet Date</TableCell>
                        <TableCell>Document Date</TableCell>
                        <TableCell>Add to Diagnosis</TableCell>
                      </TableRow>
                      {fixedDataa.map(
                        (row: any, rowIndex: number, params: any) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{rowIndex + 1}</TableCell>
                            <TableCell className="px-1 py-0">
                              {row.fixedDiagnosisCode}
                            </TableCell>
                            <TableCell className="px-1 py-0">
                              {row.fixedDiagnosisDescription}
                            </TableCell>
                            <TableCell className="px-1 py-0">
                              {row.comments}
                            </TableCell>
                            <TableCell className="date-inputt">
                              <DateInput
                                disableFuture={true}
                                value={
                                  dataa[rowIndex]?.onSetDate
                                    ? moment(dataa[rowIndex]?.onSetDate)
                                    : moment()
                                }
                                onChange={(e: any) =>
                                  handleDateChange(e, row.id, "onSetDate")
                                }
                                label="On SetDate"
                                format="DD-MM-YYYY"
                              />
                            </TableCell>
                            <TableCell className="px-1 py-0">
                              {moment().format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell>
                              <div className="py-2 px-4 cursor-pointer ">
                                <PlusIcon
                                  style={{
                                    width: "30px",
                                    justifyContent: "center",
                                  }}
                                  className={`${row.isFixedDiagnosis === 0
                                    ? "text-red-900"
                                    : "text-green-900"
                                    }`}
                                  onClick={() => {
                                    handleAddtodiag(row, rowIndex);
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* fixed table end */}
              </div>
            </div>
          </TabPanel>
        </TabsBody>
      </Tabs>


      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto sm:px-6">
                        <div className="flex items-start justify-between mt-8">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            My Favourites List
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5 z-1000">
                                <XMarkIcon className="w-5 h-5 " />
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-18">
                          <div className="flow-root w-full relative">
                            {favoriteDataa &&
                              favoriteDataa.length > 0 ? (
                              favoriteDataa.map(
                                (item: any, inx: number) => (
                                  <>
                                    <div className="w-full flex gap-4 p-2 border mt-2">
                                      <div className="w-11/12">
                                        <p className="text-sm text-blue-400">
                                          Code: {item.snowmedCode}
                                        </p>
                                        <p className="text-sm">
                                          Description:
                                          {item.snowmedDescriptrion
                                            .replace(
                                              /\(qualifier value\)/g,
                                              ""
                                            )
                                            .trim()}
                                        </p>
                                      </div>
                                      <div className="w-1/12 relative">
                                        <div className="absolute right-0 top-1">
                                          <PlusCircleIcon
                                            className="w-7 h-7 cursor-pointer text-blue-600"
                                            onClick={() => {
                                              handleAddtoDiagnosis(
                                                item
                                              );
                                              toast.success(
                                                "Added Successfully to Diagnosis"
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{ marginTop: "7px" }}
                                      >
                                        <button
                                          onClick={() =>
                                            openpopupFav(
                                              item.userFavouritesId
                                            )
                                          }
                                        >
                                          <TrashIcon className="text-red-500 w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )
                              )
                            ) : (
                              <p>No Data</p>
                            )}
                          </div>
                        </div>

                        <DeleteFavourite
                          popupOpenFav={popupOpenFav}
                          popupFavId={popupFavId}
                          getFavouriteDiagnosisData={
                            getFavouriteDiagnosisData
                          }
                          setPopupOpenFav={setPopupOpenFav}
                        />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default roleInfoScreenData(Diagnosis, "DIAG")