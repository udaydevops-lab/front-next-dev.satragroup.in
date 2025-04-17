"use client";
import {
  Checkbox,
  Input,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import ActionButton from "@/app/_common/button";
import Textarea from "@/app/_common/text-area";
import { Radio } from "@material-tailwind/react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormPropsTextFields from "@/app/_common/input";
import { test } from "node:test";
import DateInput from "@/app/_common/date-input";
import { DialogueBox } from "@/app/_common/graph";
import Delete_Icon from "@/app/_common/common_icons/Delete_Icon";
import Check_Icon from "@/app/_common/common_icons/Check_Icon";
import EditIcon from "@/app/_common/common_icons/EditIcon";
import CheckboxMui from "@/app/_common/checkbox";
import Loader from "@/app/_common/loader";
import Cross_Icon from "@/app/_common/common_icons/Cross_Icon";
import axios from "axios";
import {
  getConfigData,
  getMedication,
  // linksContextNotify,
  medicationSave,
  snowmedChiefcomplaint,
  snowmedData,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import moment from "moment";
import { Combobox } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import Add_medication_icon from "@/app/_common/common_icons/Add_medication_icon";
import { getLocalItem, snomedSemanticURL } from "@/app/utilities/local";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
// Define the DataRow type
type DataRow = {
  id: string;
  snomedData: any;
};
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import PrintGrid from "./PrintGrid";
import { alphaNumWithFewSymbols } from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
export default function Medication({ }) {
  const [checkedData, setCheckedData] = useState<any[]>([]);
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [checkedRowsData, setCheckedRowsData] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [drugNameSearchdata, setDrugNameSearchdata] = useState([]);
  const [drugNameSearch, setDrugNameSearch] = useState<any>("");
  const [drugType, setDrugType] = useState<string>("B");
  const [semantic, setSemantic] = useState<string>("real clinical drug");
  const [dosageQTY, setDosageQTY] = useState("");
  const [dosageFormSnomaed, setDosageFormSnomaed] = useState([]);
  const [dosageForm, setDosageForm] = useState<any>("");
  const [dosageFormData, setDosageFormData] = useState([]);
  const [duration, setDuration] = useState([]);
  const [durationVal, setDurationVal] = useState<any>("Period");
  const [routeOfAdministation, setRouteOfAdministation] = useState([]);
  const [routeOfAdministationVal, setRouteOfAdministationVal] =
    useState<any>("");
  const [frequency, setFrequency] = useState<any>("");
  const [frequencyData, setFrequencyData] = useState([]);
  const [days, setDays] = useState("");
  const [rxday, setRxDay] = useState<any>(moment());
  const [instructions, setInstructions] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState([]);
  const [additionalInstructionsVal, setAdditionalInstructionsVal] =
    useState<any>("");
  const [savedData, setSavedData] = useState<any[]>([]);
  const [dataa, setDataa] = useState<any>([]);
  const [previousdataa, setPreviousdataa] = useState<any>([]);
  const [count, setCount] = useState(1);
  const [updatecount, setUpdateCount] = useState(0);
  const [discontinue, setDiscontinue] = useState("");
  const [updatediscontinue, setUpdateDiscontinue] = useState<any>("");
  const [isChecked, setIsChecked] = useState(false);
  const [updatedrugNameSearchVal, setUpdateDrugNameSearchVal] =
    useState<any>("");
  const [updatedrugtype, setUpdateDrugType] = useState("");
  const [updatedosageQTY, setUpdateDosageQTY] = useState("");
  const [updatedosageForm, setUpdateDosageForm] = useState<any>("");
  const [updateduration, setUpdateDuration] = useState<any>("");
  const [updaterxday, setUpdateRxDays] = useState(moment());
  const [updaterouteOfAdministation, setUpdateRouteOfAdministation] =
    useState<any>("");
  const [updatefrequency, setUpdateFrequency] = useState<any>("");
  const [updateDays, setUpdateDays] = useState("");
  const [updateinstructions, setUpdateInstructions] = useState("");
  const [no, setNo] = useState("");
  const [updateadditionalInstructions, setUpdateAdditionalInstructions] =
    useState<any>("");
  const [loading, setLoading] = useState(false);
  const [popupStatus, setPopupStatus] = useState(false);
  const [key, setKey] = useState(1);
  const [selectedDrug, setSelectedDrug] = useState();
  const [snpmadId, setSnpmadId] = useState("");
  const [updateselectedDrug, setUpdateSelectedDrug] = useState();
  const [updateSnpmadId, setUpdateSnpmadId] = useState("");

  const [prevDrugName, setPrevDrugName] = useState<any>("");
  const [prevDrugNameList, setPrevDrugNameList] = useState();
  const [showpopup, setShowPopup] = useState(false);
  const [pushState, setPushState] = useState(true);
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();

  const storedLoginResponse = getLocalItem("loginResponse");
  let empName;
  try {
    empName = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeename
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empName = ""; // Set a default value or handle the error accordingly
  }
  const doctor = empName;

  const getMedicationData = () => {
    services
      .get(`${getMedication}?patientId=${patientid}`)
      .then((response) => {
        const data = response.data;
        const dataWithSerialNumbers = data.map((item: any, index: number) => ({
          ...item,
          id: index + 1,
        }));
        setPreviousdataa(dataWithSerialNumbers);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  useEffect(() => {
    getMedicationData();
    getRouteData();
    getLocalData();
    getFrequencyData();
    Additionalinstructions();
    // if (typeof localStorage !== "undefined") {
    //   const data = getLocalItem("medicationData");
    //   if (data) {
    //     setSavedData(JSON.parse(data));
    //   }
    // }
    const data = setSavedData(savedData);
    services
      .get(getConfigData + "Duration" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          label: item.desc,
          value: item.code,
        }));
        setDuration(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [checkedRows]);

  const Additionalinstructions = async () => {
    try {
      const response = await services.get(snowmedData + "419492006 ");
      const result = response.data.map((item: any) => ({
        label: item.fullySpecifiedName,
        value: item.id,
        activeStatus: item.activeStatus,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setAdditionalInstructions(result);
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getRouteData = async () => {
    try {
      const response = await services.get(snowmedData + "284009009");
      const result = response.data.map((item: any) => ({
        label: item.fullySpecifiedName,
        value: item.id,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setRouteOfAdministation(result);
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getFrequencyData = async () => {
    try {
      const response = await services.get(snowmedData + "307438009");
      const result = response.data.map((item: any) => ({
        value: item.id,
        label: item.fullySpecifiedName,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setFrequencyData(result);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };
  const handleDrugNameSearch = async (e: any) => {
    const searchData = e.target.value;
    if (searchData.length >= 2) {
      const response = await services.get(
        snowmedChiefcomplaint +
        `term=${searchData}&state=active&semantictag=${semantic}&acceptability=synonyms&returnlimit=100&refsetid=null&parentid=null&fullconcept=false`
      );
      const result = response.data.map((item: any) => ({
        value: item.id,
        label: item.conceptFsn,
        activeStatus: 1,
        caseSignificanceId: item.caseSignificanceId,
        conceptFsn: item.conceptFsn,
        conceptId: item.conceptId,
        conceptState: item.conceptState,
        definitionStatus: item.definitionStatus,
        effectiveTime: item.effectiveTime,
        hierarchy: item.hierarchy,
        id: item.id,
        isPreferredTerm: item.isPreferredTerm,
        languageCode: item.languageCode,
        moduleId: item.moduleId,
        term: item.term,
        typeId: item.typeId,
      }));
      setDrugNameSearchdata(result);
    }
  };
  const handleDosageForm = async (e: any) => {
    try {
      const semanticTag = "dose form";
      const search = e.target.value;
      if (search.length >= 1) {
        const response = await services.get(
          snowmedChiefcomplaint +
          `term=${search}&state=active&semantictag=${semanticTag}&acceptability=synonyms&returnlimit=100&refsetid=null&parentid=null&fullconcept=false`
        );

        const result = response.data.map((item: any) => ({
          value: item.id,
          label: item.conceptFsn,
          activeStatus: 1,
          caseSignificanceId: item.caseSignificanceId,
          conceptFsn: item.conceptFsn,
          conceptId: item.conceptId,
          conceptState: item.conceptState,
          definitionStatus: item.definitionStatus,
          effectiveTime: item.effectiveTime,
          hierarchy: item.hierarchy,
          id: item.id,
          isPreferredTerm: item.isPreferredTerm,
          languageCode: item.languageCode,
          moduleId: item.moduleId,
          term: item.term,
          typeId: item.typeId,
        }));
        setDosageFormData(result);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getLocalData = () => {
    const data = savedData;
    setSavedData(data);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S No",
      width: 50,
      renderCell: (params: GridRenderCellParams<DataRow>) =>
        params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    { field: "type", headerName: "Type", width: 50 },
    { field: "drugDesc", headerName: "Drug Details", width: 550 },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params: any) => (
        <>
          <div onClick={() => onEdit(params.row)}>
            <EditIcon />
          </div>
        </>
      ),
    },
    {
      field: "discontinue",
      headerName: "Discontinue",
      width: 120,
      renderCell: (params: any) => (
        <>
          {params.row.isDiscontinue ? (
            <button>
              <Check_Icon />
            </button>
          ) : (
            <button>
              <Cross_Icon />
            </button>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params: any) => (
        <>
          <button onClick={() => onDelete(params.row.id)}>
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </>
      ),
    },
  ];

  const Previouscolumns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "S No",
      width: 50,
      renderCell: (params: GridRenderCellParams<DataRow>) =>
        params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    { field: "type", headerName: "Type", width: 50 },
    {
      field: "rxStartDate",
      headerName: "Rx Date",
      width: 100,
      renderCell: (params: any) => (
        <>{moment(params.row.rxStartDate).format("YYYY-MM-DD")}</>
      ),
    },
    { field: "drugDesc", headerName: "Drug Details", width: 350 },
    { field: "recordedBy", headerName: "Physician", width: 170 },
    {
      field: "select",
      headerName: "Select",
      width: 50,
      renderCell: (params: any) => (
        <>
          <div onClick={() => onPrevToNew(params.row)}>
            <Add_medication_icon />
          </div>
        </>
      ),
    },

    {
      field: "discontinue",
      headerName: "Discontinue",
      width: 90,
      renderCell: (params: any) => (
        <>
          {params.row.isDiscontinue === "1" ? (
            <button>
              <Check_Icon />
            </button>
          ) : (
            <button>
              <Cross_Icon />
            </button>
          )}
        </>
      ),
    },
  ];

  const getRowId = (row: any) => row.id;

  const handleDosageChange = (e: any) => {
    setDosageQTY(e.target.value);
  };

  const handleDurationDays = (e: any) => {
    setDays(e.target.value);
  };
  const handleUpdateDurationDays = (e: any) => {
    setUpdateDays(e.target.value);
  };
  const handleInstructions = (e: any) => {
    setInstructions(sanitizeInput(e.target.value));
  };

  const handleUpdateDosageChange = (e: any) => {
    setUpdateDosageQTY(e.target.value);
  };

  const handleUpdateInstructions = (e: any) => {
    setUpdateInstructions(sanitizeInput(e.target.value));
  };
  const handlesetdrougtype = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrugType(e.target.value); // Update the state with the selected value
    if (e.target.value === "B") {
      setDrugType("B");
      setSemantic("real clinical drug");
    } else {
      setDrugType("G");
      setSemantic("real medicinal product");
    }
  };
  const handlesetUpdatedrougtype = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateDrugType(e.target.value); // Update the state with the selected value
    if (e.target.value === "B") {
      setUpdateDrugType("B");
      setSemantic("real clinical drug");
    } else {
      setUpdateDrugType("G");
      setSemantic("real medicinal product");
    }
  };

  // add functionality
  const handleAdd = () => {
    if (!drugNameSearch) {
      toast.error("Please Add Drug Name.");
    } else if (!dosageQTY) {
      toast.error("Please Add QTY.");
    } else if (!dosageForm) {
      toast.error("Please Add Dosage Form.");
    } else if (!frequency) {
      toast.error("Please Add frequency.");
    } else if (!days) {
      toast.error("Please Add days.");
    } else if (!durationVal) {
      toast.error("Please Add Duration.");
    } else if (!routeOfAdministationVal) {
      toast.error("Please Add Route Of Administation.");
    } else if (!rxday) {
      toast.error("Please Add rxday.");
    } else {
      // Create objData
      const objData = {
        id: uuidv4(),
        drugDesc: drugNameSearch.conceptFsn,
        drugDesc_obj: drugNameSearch,
        type: drugType,
        dosageQnty: dosageQTY,
        doaseFoam: dosageForm,
        doaseFoam_obj: dosageForm,
        conceptId: snpmadId,
        duration: days + durationVal,
        duration_obj: durationVal,
        routeOfAdministration: routeOfAdministationVal.label,
        routeOfAdministration_obj: routeOfAdministationVal,
        rxStartDate: moment(rxday).format("YYYY-MM-DD"),
        frequance: frequency.label,
        frequance_obj: frequency,
        mealtime: additionalInstructionsVal.label,
        mealtime_obj: additionalInstructionsVal,
        instruction: instructions,
        snomedData: selectedDrug,
        statusFlag: 1,
        isDiscontinue: false,
        recordedBy: doctor,
      };
      let newDataaaa = [...dataa, objData];
      setDataa(newDataaaa);
      const finalMerge = newDataaaa.reduce((acc: any, curr: any) => {
        let obj = acc.find(
          (items: any) =>
            items.snomedData.conceptFsn === curr.snomedData.conceptFsn
        );

        if (obj) {
          return acc;
        } else {
          return acc.concat([curr]);
        }
      }, []);
      setDataa(finalMerge);
      setSavedData(finalMerge);

      setDrugType("B");
      setDays("");
      setRxDay(moment());
      setInstructions("");
      setDosageQTY("");
      setDrugNameSearch("");
      setDosageForm("");
      setFrequency("");
      setRouteOfAdministationVal("");
      setFrequency("");
      setKey(count + count);
      setAdditionalInstructionsVal("");
      setDurationVal("Period");
    }
  };
  // edit functionality
  function onEdit(type: any): void {
    setShowPopup(true);
    const durationMain = type.duration;
    const durationNo = durationMain.match(/\d+/g);
    const durationText = durationMain.match(/[a-zA-Z]+/g).join("");

    const getDuration: any = duration.filter((route: any) =>
      route.label.includes(durationText)
    );
    setUpdateDrugType(type.type);
    setUpdateCount(type.id);
    setUpdateDosageForm(type.doaseFoam_obj);
    setUpdateDosageQTY(type.dosageQnty);
    setUpdateDrugNameSearchVal(type.drugDesc_obj);
    setUpdateDuration(getDuration[0].label);
    setUpdateFrequency(type.frequance_obj);
    setUpdateRouteOfAdministation(type.routeOfAdministration_obj);
    setUpdateDiscontinue(type.isDiscontinue);
    setUpdateRxDays(moment(type.rxStartDate));
    setUpdateAdditionalInstructions(type.mealtime_obj);
    setUpdateInstructions(type.instruction);
    setUpdateDays(durationNo);
    setUpdateSelectedDrug(type.snomedData);
    setUpdateSnpmadId(type.conceptId);
  }
  // update functionality
  const handleUpdate = () => {
    const objData = {
      id: updatecount,
      type: updatedrugtype,
      drugDesc: updatedrugNameSearchVal?.conceptFsn || "",
      drugDesc_obj: updatedrugNameSearchVal,
      dosageQnty: updatedosageQTY,
      doaseFoam: updatedosageForm || "",
      doaseFoam_obj: updatedosageForm,
      duration: updateDays + updateduration,
      duration_obj: updateduration?.label || "",
      routeOfAdministration: updaterouteOfAdministation?.label || "",
      routeOfAdministration_obj: updaterouteOfAdministation,
      frequance: updatefrequency,
      frequance_obj: updatefrequency?.label || "",
      instruction: updateinstructions,
      isDiscontinue: updatediscontinue,
      mealtime: updateadditionalInstructions?.label || "",
      mealtime_obj: updateadditionalInstructions,
      statusFlag: 1,
      conceptId: updateSnpmadId,
      snomedData: updateselectedDrug,
    };

    const indexToUpdate = savedData.findIndex(
      (item) => item.id === updatecount
    );
    if (indexToUpdate !== -1) {
      // Update the specific item in the array
      setSavedData((prevSavedData) => {
        const updatedData = [...prevSavedData];
        updatedData[indexToUpdate] = objData;
        return updatedData;
      });

      setShowPopup(false);
    } else {
      // If the item doesn't exist, add it to the array
      setSavedData((prevSavedData) => [...prevSavedData, objData]);
    }

    setPopupStatus(false);
  };

  // delete functionality
  const onDelete = (index: number) => {
    setLoading(true);
    let delComplainfield = dataa.filter((items: any) => items.id !== index);
    setSavedData(delComplainfield);
    setDataa(delComplainfield);
    setLoading(false);
  };

  // save functionality
  const handleSave = () => {
    const final = dataa.map((item: any) => ({
      type: item.type,
      dosageQnty: item.dosageQnty,
      duration: item.duration,
      doaseFoam: item.doaseFoam.label,
      conceptId: item.conceptId,
      routeOfAdministration: item.routeOfAdministration,
      frequance: item.frequance,
      rxStartDate: item.rxStartDate,
      mealtime: item.mealtime,
      instruction: item.instruction,
      statusFlag: 1,
      snomedData: item.snomedData,
      recordedBy: item.recordedBy,
    }));
    let postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      statusFlag: 1,
      opAssessmentMedicationRxSet: final,
    };
    services
      .create(medicationSave, postObj)
      .then((response) => {
        setSavedData([]);
        setDataa([]);
        getMedicationData();
        setKey(key + key);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const handleIsCheckedChange = () => {
    setUpdateDiscontinue(!updatediscontinue);
  };
  const handelRxStartData = (e: any) => {
    setRxDay(e);
  };
  //checkbox fun
  const handleSelectrowIsCheckedChange = (id: number, rowData: any) => {
    // checkedData checkedRows
    if (checkedRows.includes(id)) {
      setCheckedRows(checkedRows.filter((rowId) => rowId !== id));
      setCheckedRowsData(checkedRowsData.filter((row) => row.id !== id));
    } else {
      setCheckedRows([...checkedRows, id]);
      setCheckedRowsData([...checkedRowsData, rowData]);
    }
  };
  //send prev to new row
  const onPrevToNew = async (rowData: any) => {
    const dd: string = rowData.drugDesc
      .replace(/[^a-zA-Z0-9]/g, " ")
      .slice(0, 25);

    const df: string = rowData.doaseFoam
      .replace(/[^a-zA-Z0-9]/g, " ")
      .slice(0, 25);
    const durationMain = rowData.duration;
    const durationNo = durationMain.match(/\d+/g);
    const durationText = durationMain.match(/[a-zA-Z]+/g).join("");
    const getfrequance: string = rowData.frequance.slice(
      0,
      rowData.frequance.length
    );
    const getRoute: string = rowData.routeOfAdministration.slice(
      0,
      rowData.routeOfAdministration.length
    );
    const getmealtime: string = rowData.mealtime?.slice(
      0,
      rowData.mealtime.length
    );
    let hierarchy: any;
    if (rowData.type === "B") {
      hierarchy = "real clinical drug";
    } else {
      hierarchy = "real medicinal product";
    }

    const drougName: any = await services.get(
      snowmedChiefcomplaint +
      `term=${dd}&state=active&semantictag=${hierarchy}&acceptability=synonyms&returnlimit=1&refsetid=null&parentid=null&fullconcept=false`
    );
    const drougName_result = drougName.data.map((item: any) => ({
      value: item.id,
      label: item.conceptFsn,
      activeStatus: 1,
      caseSignificanceId: item.caseSignificanceId,
      conceptFsn: item.conceptFsn,
      conceptId: item.conceptId,
      conceptState: item.conceptState,
      definitionStatus: item.definitionStatus,
      effectiveTime: item.effectiveTime,
      hierarchy: item.hierarchy,
      id: item.id,
      isPreferredTerm: item.isPreferredTerm,
      languageCode: item.languageCode,
      moduleId: item.moduleId,
      term: item.term,
      typeId: item.typeId,
    }));

    const semanticTag = "dose form";
    const getdosageForm: any = await services.get(
      snowmedChiefcomplaint +
      `term=${df}&state=active&semantictag=${semanticTag}&acceptability=synonyms&returnlimit=1&refsetid=null&parentid=null&fullconcept=false`
    );
    const getdosageForm_result = getdosageForm.data.map((item: any) => ({
      value: item.id,
      label: item.conceptFsn,
      activeStatus: 1,
      caseSignificanceId: item.caseSignificanceId,
      conceptFsn: item.conceptFsn,
      conceptId: item.conceptId,
      conceptState: item.conceptState,
      definitionStatus: item.definitionStatus,
      effectiveTime: item.effectiveTime,
      hierarchy: item.hierarchy,
      id: item.id,
      isPreferredTerm: item.isPreferredTerm,
      languageCode: item.languageCode,
      moduleId: item.moduleId,
      term: item.term,
      typeId: item.typeId,
    }));
    const filtered_frequencyData = frequencyData.filter((frequance: any) =>
      frequance.label.includes(getfrequance)
    );
    const filtered_meltime = additionalInstructions.filter((route: any) =>
      route.label.includes(getmealtime)
    );
    const filtered_Route = routeOfAdministation.filter((route: any) =>
      route.label.includes(getRoute)
    );
    const getDuration = duration.filter((route: any) =>
      route.label.includes(durationText)
    );
    const prevsObj = {
      id: rowData.id,
      drugDesc: rowData.drugDesc,
      drugDesc_obj: drougName_result[0],
      type: rowData.type,
      dosageQnty: rowData.dosageQnty,
      doaseFoam: rowData.doaseFoam,
      doaseFoam_obj: getdosageForm_result[0],
      conceptId: rowData.snomedData.conceptId,
      duration: rowData.duration,
      duration_obj: getDuration[0],
      routeOfAdministration: rowData.routeOfAdministration,
      routeOfAdministration_obj: filtered_Route[0],
      rxStartDate: moment(rowData.rxStartDate).format("YYYY-MM-DD"),
      frequance: rowData.frequance,
      frequance_obj: filtered_frequencyData[0],
      mealtime: rowData.mealtime,
      mealtime_obj: filtered_meltime[0],
      instruction: rowData.instruction,
      isDiscontinue: rowData.isDiscontinue,
      snomedData: rowData.snomedData,
      statusFlag: rowData.statusFlag,
    };
    const newData: any = [...dataa];
    newData.push(prevsObj);

    setDataa(newData);
    setSavedData(newData);
  };
  const handleclosePopup = () => {
    setShowPopup(false);
  };
  const onPush = () => { };
  // print grid
  const PrintRecord = () => {
    const printContent = document.getElementById("sectionToPrint");

    if (printContent) {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");

      if (printWindow) {
        // Create a new document inside the print window
        const printDocument = printWindow.document;

        // Clone the content of the element to print
        const clonedContent = printContent.cloneNode(true);

        // Append the cloned content to the new document body
        printDocument.body.appendChild(clonedContent);

        // Trigger the print dialog in the new window
        printWindow.print();

        // Close the new window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      } else {
        console.error("Failed to open new window for printing");
      }
    } else {
      console.error("Section to print not found");
    }
  };

  return (
    <>
      <div id="sectionToPrint" className="hidden w-full">
        <PrintGrid printData={dataa} />
      </div>

      {loading ? <Loader /> : ""}
      <div className=" w-full">
        <div className=" w-full bg-white rounded-curve">
          <Tabs value="1" className="z-0">
            <TabsHeader>
              <Tab value={"1"}>New Rx</Tab>
              <Tab value={"2"}>Previous Rx</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value={"1"} className="px-0">
                <div key={key}>
                  <div className=" w-full ">
                    <div className="relative flex gap-x-8 mb-2">
                      <div className="md:w-2/6">
                        <Radio
                          crossOrigin={undefined}
                          value="B"
                          name="type"
                          label="Brand"
                          checked={drugType === "B"} // Set the checked state based on the current value
                          onChange={handlesetdrougtype}
                        />
                        <Radio
                          crossOrigin={undefined}
                          value="G"
                          name="type"
                          label="Generic"
                          checked={drugType === "G"} // Set the checked state based on the current value
                          onChange={handlesetdrougtype}
                        />
                      </div>

                      <div className="md:w-4/6 relative my-select">
                        <Select
                          placeholder="Drug Name Search"
                          primaryColor="blue"
                          value={drugNameSearch}
                          options={drugNameSearchdata}
                          isClearable={true}
                          onSearchInputChange={(e: any) => {
                            handleDrugNameSearch(e);
                          }}
                          isSearchable={true}
                          onChange={(e: any) => {
                            setDrugNameSearch(e);
                            setSelectedDrug(e);
                            setSnpmadId(e.conceptId);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" w-full mb-4  md:flex flex-wrap ">
                    <div className="md:w-1/4 px-3 my-2">
                      <FormPropsTextFields
                        label="Dosage QTY"
                        handleChange={handleDosageChange}
                        value={dosageQTY}
                        type="number"
                        className="!rounded-[8px]"
                        containerProps={{
                          className: "!rounded-[8px]",
                        }}
                      />
                      <div className="w-full">
                        {dosageQTY &&
                          !alphaNumWithFewSymbols.test(dosageQTY) && (
                            <div className="text-[11px] text-red-500">
                              Please do not enter special characters
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="md:w-1/4 px-3 my-2 relative my-select">
                      <Select
                        placeholder="Dosage Form"
                        primaryColor="blue"
                        value={dosageForm}
                        options={dosageFormData}
                        onSearchInputChange={(e: any) => {
                          handleDosageForm(e);
                        }}
                        isSearchable={true}
                        onChange={(e: any) => {
                          setDosageForm(e);
                        }}
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
                    </div>
                    <div className="md:w-2/4 ps-3 my-2 relative my-select">
                      <Select
                        placeholder="Frequency"
                        primaryColor="blue"
                        value={frequency}
                        options={frequencyData}
                        isSearchable={true}
                        onChange={(e: any) => {
                          setFrequency(e);
                        }}
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
                    </div>
                    <div className="md:w-1/4 px-3 my-2 flex ">
                      <div className="relative flex w-full max-w-[24rem]">
                        <Input
                          crossOrigin
                          type="number"
                          label="Days"
                          //   color="blue"
                          name="Days"
                          value={days}
                          className=" !rounded-[8px] !rounded-r-none "
                          containerProps={{
                            className: "!min-w-0 rounded-lg  rounded-r-none",
                          }}
                          onChange={handleDurationDays}
                        />
                        <Menu placement="bottom-start">
                          <MenuHandler>
                            <Button
                              ripple={false}
                              variant="text"
                              color="blue-gray"
                              className="flex h-10 w-[80px] items-center gap-2 rounded-l-none 
border border-l-0 border-blue-gray-200
bg-blue-gray-500/10 pl-3 capitalize text-sm font-normal"
                            >
                              {/* {countryCallingCode} */}
                              {durationVal}
                            </Button>
                          </MenuHandler>
                          <MenuList className="max-h-[20rem] max-w-[18rem]">
                            {duration.map((list: any, index: number) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={list.value}
                                  className="flex items-center gap-2 capitalize"
                                  onClick={() => {
                                    setDurationVal(list.label);
                                  }}
                                >
                                  {list.label}
                                </MenuItem>
                              );
                            })}
                          </MenuList>
                        </Menu>
                      </div>
                    </div>
                    <div className="md:w-1/4 px-3 my-2 relative my-select">
                      <Select
                        placeholder="Route Of Administation"
                        primaryColor="blue"
                        isSearchable={true}
                        value={routeOfAdministationVal}
                        options={routeOfAdministation}
                        onChange={(e: any) => {
                          setRouteOfAdministationVal(e);
                        }}
                        classNames={{
                          menuButton: ({ isDisabled }: any) =>
                            `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                              duration-300 focus:outline-none h-[40px]
                             
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
                    </div>
                    <div className="md:w-1/4 px-3 my-2">
                      <DateInput
                        label="Rx Start Data"
                        value={rxday}
                        onChange={handelRxStartData}
                        className={"h-[39px] !rounded-[8px]"}
                        containerProps={{
                          className: "!rounded-[8px]",
                        }}
                      />
                    </div>
                    <div className="md:w-1/4 ps-3 my-2 relative my-select">
                      <Select
                        placeholder="Additional Instructions"
                        primaryColor="blue"
                        value={additionalInstructionsVal}
                        options={additionalInstructions}
                        onChange={(e: any) => {
                          setAdditionalInstructionsVal(e);
                        }}
                        classNames={{
                          menuButton: ({ isDisabled }: any) =>
                            `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                              duration-300 focus:outline-none rounded-[8px] h-[40px]
                             
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
                    </div>

                    <div className="md:w-full pl-3 my-2" key={key}>
                      <Textarea
                        label="Instructions"
                        onChange={handleInstructions}
                        value={instructions}
                      />
                    </div>

                    <div className="md:w-full text-right">
                      <ActionButton
                        buttonText="ADD"
                        handleSubmit={handleAdd}
                       width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      />
                    </div>
                  </div>

                  <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                    <DataGrid
                      rows={dataa}
                      columns={columns}
                      getRowId={getRowId}
                      pageSizeOptions={[10, 20]}
                      checkboxSelection={false}
                      slots={{ toolbar: null }}
                    />
                  </div>
                  <div className="md:w-full justify-end flex text-right gap-2 mt-4">
                    <div className="mr-1 inline-block">
                      <ActionButton
                        buttonText="SAVE"
                        handleSubmit={handleSubmit(handleSave)}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      />
                    </div>
                    <div title="ABDM context push">
                      <ActionButton
                        buttonText="Push"
                        handleSubmit={onPush}
                        disabled={pushState}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        
                      />
                    </div>
                    <div className="ml-1 inline-block">
                      <ActionButton
                        buttonText="PRINT"
                        handleSubmit={PrintRecord}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={"2"}>
                <div
                  className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
                  key={key}
                >
                  <DataGrid
                    rows={previousdataa}
                    columns={Previouscolumns}
                    getRowId={getRowId}
                    pageSizeOptions={[10, 20]}
                  />
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
      {showpopup ? (
        <div className="overlay z-50">
          <div className="popup ">
            <div className="w-full">
              <h2 className="font-bold md:mx-auto w-full flex justify-between">
                Update Drug Details
                <span
                  className="text-right cursor-pointer"
                  onClick={handleclosePopup}
                >
                  X
                </span>
              </h2>
              <div className="w-full md:flex flex-wrap py-2">
                <div className="md:w-2/6">
                  <Radio
                    crossOrigin={undefined}
                    value="B"
                    name="updatedrugtype"
                    label="Brand"
                    checked={updatedrugtype === "B"} // Set the checked state based on the current value
                    onChange={handlesetUpdatedrougtype}
                  />
                  <Radio
                    crossOrigin={undefined}
                    value="G"
                    name="updatedrugtype"
                    label="Generic"
                    checked={updatedrugtype === "G"} // Set the checked state based on the current value
                    onChange={handlesetUpdatedrougtype}
                  />
                </div>

                <div className="md:w-4/6 relative my-select">
                  <Select
                    placeholder="Drug Name Search"
                    primaryColor="blue"
                    value={updatedrugNameSearchVal}
                    options={drugNameSearchdata}
                    isClearable={true}
                    onSearchInputChange={(e: any) => {
                      handleDrugNameSearch(e);
                    }}
                    isSearchable={true}
                    onChange={(e: any) => {
                      setUpdateDrugNameSearchVal(e);
                    }}
                  />
                </div>
              </div>

              <div className=" w-full mb-4 px-3 md:flex flex-wrap py-2">
                <div className="md:w-1/4 px-3 my-2">
                  <FormPropsTextFields
                    label="Dosage QTY"
                    type="number"
                    handleChange={handleUpdateDosageChange}
                    value={updatedosageQTY}
                  />
                </div>

                <div className="md:w-1/4 px-3 my-2 relative my-select">
                  <Select
                    placeholder="Dosage Form"
                    primaryColor="blue"
                    value={updatedosageForm}
                    options={dosageFormData}
                    onSearchInputChange={(e: any) => {
                      handleDosageForm(e);
                    }}
                    isSearchable={true}
                    onChange={(e: any) => {
                      setUpdateDosageForm(e);
                    }}
                  />
                </div>

                <div className="md:w-2/4 px-3 my-2 relative my-select">
                  <Select
                    placeholder="Frequency"
                    primaryColor="blue"
                    value={updatefrequency}
                    options={frequencyData}
                    isSearchable={true}
                    onChange={(e: any) => {
                      setUpdateFrequency(e);
                    }}
                  />
                </div>
                <div className="md:w-1/4 px-3 my-2 flex ">
                  <Input
                    crossOrigin
                    type="number"
                    label="Days"
                    // color="blue"
                    name="Days"
                    value={updateDays}
                    className=" !rounded-[8px] !rounded-r-none "
                    containerProps={{
                      className: "!min-w-0 rounded-lg  rounded-r-none",
                    }}
                    onChange={handleUpdateDurationDays}
                  />
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button
                        ripple={false}
                        variant="text"
                        color="blue-gray"
                        className="flex h-10 w-[80px] items-center gap-2 rounded-l-none 
border border-l-0 border-blue-gray-200
bg-blue-gray-500/10 pl-3 capitalize text-sm font-normal"
                      >
                        {/* {countryCallingCode} */}
                        {updateduration}
                      </Button>
                    </MenuHandler>
                    <MenuList className="max-h-[20rem] max-w-[18rem]">
                      {duration.map((list: any, index: number) => {
                        return (
                          <MenuItem
                            key={index}
                            value={list.value}
                            className="flex items-center gap-2 capitalize"
                            onClick={() => {
                              setUpdateDuration(list.label);
                            }}
                          >
                            {list.label}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                </div>

                <div className="md:w-1/4 px-3 my-2 relative my-select">
                  <Select
                    placeholder="Route Of Administation"
                    primaryColor="blue"
                    isSearchable={true}
                    value={updaterouteOfAdministation}
                    options={routeOfAdministation}
                    onChange={(e: any) => {
                      setUpdateRouteOfAdministation(e);
                    }}
                  />
                </div>

                <div className="md:w-1/4 px-3 my-2">
                  <DateInput value={updaterxday} />
                </div>

                <div className="md:w-1/4 ps-3 my-2 relative my-select">
                  <Select
                    placeholder="Additional Instructions"
                    primaryColor="blue"
                    value={updateadditionalInstructions}
                    options={additionalInstructions}
                    onChange={(e: any) => {
                      setUpdateAdditionalInstructions(e);
                    }}
                  />
                </div>

                <div className="md:w-1/4  my-2">
                  <CheckboxMui
                    label="Discontinue"
                    handleChange={handleIsCheckedChange}
                    checked={updatediscontinue}
                  />
                </div>

                <div className="md:w-3/4  my-2">
                  <Textarea
                    label="Instructions"
                    onChange={handleUpdateInstructions}
                    value={updateinstructions}
                  />
                </div>

                <div className="mb-3 flex justify-end gap-x-3">
                  <ActionButton
                    buttonText="UPDATE"
                    handleSubmit={handleUpdate}
                    width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
