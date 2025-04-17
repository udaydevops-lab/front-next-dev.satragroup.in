"use client";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import FormPropsTextFields from "@/app/_common/input";
import ControllerSelect from "@/app/_common/select";
import Textarea from "@/app/_common/text-area";
import CheckboxMui from "@/app/check-box";
import {
  getPregnancyTrimester,
  savePregnancy,
  snomedSearchByTermAndSemanticTag,
} from "@/app/utilities/api-urls";
import { jsonParse } from "@/app/utilities/local";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import { Combobox } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Radio } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PregnancyUpdatePop(props: any) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [key1, setKey1] = useState(0);
  const [planComments, setPlanComments] = useState(false);
  const items = [
    {
      value: "trimester1",
      label: "Trimester 1",
    },
    {
      value: "trimester2",
      label: "Trimester 2",
    },
    {
      value: "trimester3",
      label: "Trimester 3",
    },
  ];
  const [showThyroid, setShowThyroid] = useState(false);
  const [diaChecked, setDiaChecked] = useState(false);
  const [data, setData] = useState(props.data);
  const [recordedDate, setrecordedDate] = useState(
    moment(props.data.date, "DD/MM/YYYY")
  );
  const [gestationalDiabetes, setGestationalDiabetes] = useState(
    props.data.gestationalDiabetes
  );
  const [maternalWeight, setMaternalWeight] = useState(
    props.data.maternalWeight
  );
  const [hr, setHr] = useState(props.data.hr);
  const [wt, setWt] = useState(props.data.wt);
  const [limbs, setLimbs] = useState(props.data.limbs);
  const [hc, setHc] = useState(props.data.hc);
  const [length, setLength] = useState(props.data.length);
  const [comments, setComments] = useState(props.data.comments);
  const [thyroid, setThyroid] = useState(props.data.thyroid);
  const [thyroidValues, setThyroidValues] = useState(props.data.thyroidValues);
  const [gestationalDiabetesValues, setGestationalDiabetesValues] = useState(
    props.data.gestationalDiabetesValues
  );
  const [plan, setPlan] = useState(props.data.plan);
  const [planCommentValue, setPlanCommentValue] = useState(
    props.data.planComments
  );
  const [risk, setRisk] = useState(props.data.risk);
  const [responseObject, setResponseObject] = useState({});
  const [trimester, setTrimester] = useState<any>("");
  const handleDiaChange = () => {
    setDiaChecked(!diaChecked);
  };
  const handleThyroidChange = (e: any) => {
    setShowThyroid(true);
    setThyroid(e.target.value);
  };
  const searchParam = useParams();
  const patient_Id = searchParam.patientid;
  const encounterId = searchParam.opdEncounterId;
  const handlePopAdd = () => { };
  const [dataa, setDataa] = useState<any[]>([
    {
      sno: "1",
      display: "display",
    },
  ]);
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 200,
    },
    {
      field: "term",
      headerName: "Display",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params: any) => (
        <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer"
          onClick={() => deleteFindingsRow(params.row)}
        />
      ),
    },
  ];
  const deleteFindingsRow = (data: any) => {
    const filteredData = findingsGridData.filter((item: any) => {
      return item.sno != data.sno;
    });
    filteredData.forEach((item: any, index: number) => {
      item.sno = index + 1
    });
    setFindingGridData(filteredData);
  };
  const handlePlanRadioChange = (e: any) => {
    setPlanComments(true);
    setPlan(e.target.value);
  };
  const [trimesterArray, setTrimesterArray] = useState([]);
  useEffect(() => {
    setTrimester(items.filter((item) => item.label == props.data.trimester)[0]);
    if (props.data.gestationalDiabetes.length > 0) {
      setDiaChecked(true);
    }
    if (props.data.thyroid.length > 0) {
      setShowThyroid(true);
      setKey1((k) => k + 1);
    }
    if (props.data.thyroidValues.length > 0) {
      setThyroidValues(props.data.thyroidValues);
    }
    if (props.data.planComments.length > 0) {
      setPlanComments(true);
    }

    services.get(getPregnancyTrimester + patient_Id).then((response) => {
      setResponseObject(response.data);
      setTrimesterArray(
        response.data.pregnancyRecord.pregnancyRecord.currentPregnancy.trimester
      );
    });
  }, []);
  const capitalize = (name: string) => {
    return name.charAt(0).toUpperCase() + name.substring(1, name.length);
  };
  const [trimesterNumber, setTrimesterNumber] = useState(`trimester${data.id}`);
  const onSave = () => {
    let trimesterArr: any = trimesterArray;
    let arrayFind: any = [];
    findingsGridData.map((item: any, index: number) => {
      let obj = {
        sno: index + 1,
        hierarchy: item.hierarchy,
        isPreferredTerm: item.isPreferredTerm,
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
        activeStatus: item.activeStatus,
        moduleId: item.moduleId,
      };
      arrayFind.push(obj);
    });
    let obj = {
      [trimesterNumber]: {
        maternalWeight: maternalWeight,
        date: moment(recordedDate).format("DD/MM/YYYY"),
        gestationalDiabetes: gestationalDiabetes,
        thyroid: thyroid,
        thyroidValues: thyroidValues,
        details: "",
        fetus: {
          hr: hr,
          wt: wt,
          hc: hc,
          limbs: limbs,
          length: length,
          comments: comments,
        },
        recordedBy: capitalize(jsonParse("loginResponse").employeename),
        findings: arrayFind,
      },
    };
    let ind = -1;
    trimesterArr.map((item: any, index: number) => {
      if (index + 1 == data.id) {
        ind = index;
        setTrimesterNumber(`trimester${data.id}`);
      }
    });
    trimesterArr.splice(ind, 1, obj);

    let postObj = {
      pregnancyId: data.pregnancyId,
      pregnancyRecord: {
        currentPregnancy: {
          trimester: trimesterArr,
          plan: plan,
          planComments: planCommentValue,
          risk: risk,
        },
      },
      patientId: data.patientId,
      opdEncounterId: data.opdEncounterId,
    };
    services
      .create(savePregnancy, postObj)
      .then((response) => {
        toast.success("Saved Successfully");
        props.onLoading();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const [findingsList, setfindingsList] = useState<any>([]);
  const [findingValue, setFindingValue] = useState<any>("");
  const handleFindingsChange = async (e: any) => {
    if (e.target.value.length > 2) {
      axios
        .get(
          snomedSearchByTermAndSemanticTag +
          `term=${e.target.value}&state=both&semantictag=finding&acceptability=all&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
        )
        .then((response) => {
          if (response.data.length > 0) {
            let arr = response.data;
            arr.forEach((item: any, index: number) => {
              item.value = item.conceptId;
              item.label = item.conceptFsn;
            }
            )
            setfindingsList(arr);
          }
        })
        .catch((error) => {
          console.error("Error while fetching data:", error);
        });
    }
  };
  const array: any = [];
  const [targetValue, setTargetValue] = useState("");
  const [findingsGridData, setFindingGridData] = useState<any[]>(
    props.data.findings
  );
  const handleAddObj = () => {
    if (findingsGridData.some((item: any) => item.conceptFsn == findingValue.label)) {
      toast.error("Duplicate entry");
    } else {
      let filteredData: any = findingsList.filter((item: any) => {
        return item.conceptFsn == findingValue.label;
      });
      if (filteredData.length > 0) {
        let object = { sno: findingsGridData.length + 1, ...filteredData[0] };
        setFindingGridData((prevData: any) => [...prevData, object]);
      }
    }
    setFindingValue("");
  };
  return (
    <div className="m-4">
      <ToastContainer />
      <div className="justify-start items-center mt-4  gap-x-10 grid grid-cols-3 gap-10">
        <Select
          primaryColor="blue"
          options={items}
          value={trimester}
          onChange={(e: any) => {
            setTrimester(e);
          }}
          // isDisabled={true}
          placeholder="Trimester"
        />
      </div>
      <Divider className="mt-4" />
      <div className="justify-start items-center grid grid-cols-3 gap-10 mt-4 gap-x-10">
        <div>
          <FormPropsTextFields
            label="Maternal Weight "
            width="100%"
            value={maternalWeight}
            handleChange={(e: any) => setMaternalWeight(sanitizeInput(e.target.value))}
          />
        </div>
        <div>
          <DateInput
            label="Recorded Date"
            value={recordedDate}
            onChange={(e: any) => {
              setrecordedDate(e);
            }}
          />
        </div>
      </div>
      <div className="justify-start grid grid-cols-3 mt-4 gap-10 items-center gap-x-10">
        <div>
          <CheckboxMui
            label="Gestational Diabetes"
            handleChange={handleDiaChange}
            checked={diaChecked}
          />
        </div>
        {diaChecked ? (
          <div>
            <FormPropsTextFields
              label="Values"
              value={gestationalDiabetes}
              handleChange={(e: any) => setGestationalDiabetes(sanitizeInput(e.target.value))}
            />
          </div>
        ) : null}
      </div>
      <Divider className="mt-4" />
      <div className="grid lg:grid-cols-5 gap-4 mt-4 lg:flex lg:justify-start lg:items-center">
        <div className="">Thyroid</div>
        <div className="" key={key1}>
          <Radio
            crossOrigin={undefined}
            name="thyroid"
            label="Hypothyrodism"
            value={"hypothyrodism"}
            defaultChecked={thyroid == "hypothyrodism" ? true : false}
            onChange={handleThyroidChange}
          />
          <Radio
            crossOrigin={undefined}
            name="thyroid"
            label="Hyperthyrodism"
            value={"hyperthyrodism"}
            defaultChecked={thyroid == "hyperthyrodism" ? true : false}
            onChange={handleThyroidChange}
          />
        </div>
        {showThyroid ? (
          <div className="flex justify-start items-start">
            <FormPropsTextFields
              label="Values"
              value={thyroidValues}
              handleChange={(e: any) => setThyroidValues(sanitizeInput(e.target.value))}
            />
          </div>
        ) : null}
      </div>
      <Divider className="mt-4" />
      <div className="mt-4">U/S Details</div>
      <div className="mt-4">Fetus</div>
      <div className="mt-4 grid grid-cols-3 gap-6">
        <div className="">
          <FormPropsTextFields
            value={hr}
            handleChange={(e: any) => setHr(sanitizeInput(e.target.value))}
            label="HR"
          />
        </div>
        <div>
          <FormPropsTextFields
            value={limbs}
            handleChange={(e: any) => setLimbs(sanitizeInput(e.target.value))}
            label="Limbs"
          />
        </div>
        <div className="">
          <FormPropsTextFields
            handleChange={(e: any) => setWt(sanitizeInput(e.target.value))}
            value={wt}
            label="Wt"
          />
        </div>
        <div>
          <FormPropsTextFields
            handleChange={(e: any) => setLength(sanitizeInput(e.target.value))}
            value={length}
            label="Length"
          />
        </div>
        <div>
          <FormPropsTextFields
            value={hc}
            handleChange={(e: any) => setHc(sanitizeInput(e.target.value))}
            label="HC"
          />
        </div>
        <div className="">
          <Textarea
            value={comments}
            onChange={(e: any) => setComments(sanitizeInput(e.target.value))}
            label="Comments"
          />
        </div>
      </div>
      <div className="w-full justify-start mt-4">
        <div className="flex justify-start items-center gap-4">
          <div className="">
            <Select
              primaryColor="blue"
              placeholder="Findings (Snomed Search)"
              onChange={(e: any) => {
                setFindingValue(e);
              }}
              onSearchInputChange={handleFindingsChange}
              isSearchable={true}
              value={findingValue}
              options={findingsList}
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
            />
          </div>
          <div>
            <ActionButton buttonText="Add" handleSubmit={handleAddObj} />
          </div>
        </div>
        <DataGrid
          autoHeight
          rows={findingsGridData}
          columns={columns}
          getRowId={(row) => row.sno}
          pageSizeOptions={[10, 25]}
          checkboxSelection={false}
          slots={{ toolbar: GridToolbar }}
        />
      </div>

      <Divider className="mt-4" />
      <div className="mt-4 justify-start items-center gap-x-6 grid grid-cols-4 gap-2">
        
        <div className="flex justify-center items-center">
        <div className="">Plan</div>
          <Radio
            crossOrigin={undefined}
            name="plan"
            value={"NVD"}
            label="NVD"
            defaultChecked={plan == "NVD"}
            onChange={handlePlanRadioChange}
          />
          <Radio
            crossOrigin={undefined}
            name="plan"
            value={"LSCS"}
            label="LSCS"
            defaultChecked={plan == "LSCS"}
            onChange={handlePlanRadioChange}
          />
        </div>
        {planComments ? (
          <div className="">
            <FormPropsTextFields
              value={planCommentValue}
              handleChange={(e: any) => setPlanCommentValue(sanitizeInput(e.target.value))}
              label="Comments"
            />
          </div>
        ) : null}
        <div className="">
          <FormPropsTextFields
            value={risk}
            handleChange={(e: any) => setRisk(sanitizeInput(e.target.value))}
            label="Risk"
          />
        </div>
      </div>
      <Divider className="mt-4" />
      <div className="mt-4 flex justify-end items-center gap-x-6">
        <ActionButton handleSubmit={onSave} buttonText="Save" />
      </div>
    </div>
  );
}
