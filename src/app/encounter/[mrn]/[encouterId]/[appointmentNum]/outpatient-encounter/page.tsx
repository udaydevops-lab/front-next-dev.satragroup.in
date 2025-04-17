"use client";
import React, { useState, useEffect, useRef } from "react";
import Input from "../../../../../_common/input";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ActionButton from "@/app/_common/button";
import { useForm } from "react-hook-form";
import user from "../../../../../../../public/images/profile.jpg";
import { v4 as uuidv4 } from "uuid";
import {
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  Radio,
} from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import {
  getConfigData,
  getAllDepartments,
  getDepartmentPrac,
  getTriage,
  searchDoctorFee,
  cancelEncounter,
  createEncounter,
  updateEncounter,
  getEncounterDetailsById,
  getServiceItems,
  getPatientImgById,
  getPatientDetailsById,
} from "../../../../../utilities/api-urls";
import Textarea from "@/app/_common/text-area";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import moment from "moment";
import Loader from "@/app/_common/loader";
import Invoice from "@/app/_common/invoice";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SearchUpdatePatient from "@/app/patient/search-update-patient/page";
import GenerateSearchPatient from "@/app/_common/generate-search-patient";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import services from "@/app/utilities/services";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TrashIcon } from "@heroicons/react/24/solid";
import { alphaNumWithFewSymbols } from "@/app/utilities/validations";
import { decryptToken } from "@/app/_commonfeatures/Token";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import GenerateBill from "@/app/generate-bill/page";
import NoScreenData from "@/app/_common/NoScreenData";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";

function EncounterOutpatient(props: any) {
  // const {mrn,encouterid}=useParams()
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers: any = {
    locationId: loginResponse?.locationId,
    serviceEntityId: loginResponse?.serviceEntityId,
    "Access-Control-Allow-Origin": "*",
  };
  const onDelete = (data: any): void => {
    let delSelectedRow = serviceTypeArray.filter(
      (items: any) => items.id !== data.id
    );
    setServiceTypeArray(delSelectedRow);
    if (delSelectedRow.length > 0) {
      setDisableSaveEnct(true)
    } else {
      setDisableSaveEnct(false)
    }
    const hasNullOpdEncounterSerId = delSelectedRow.some(
      (item: any) => item.opdEncounterSerId === null
    );
    setEnableGenerateBill(hasNullOpdEncounterSerId);
  };

  const { mrn, encouterid } = useParams();
  let patientid = mrn;
  let opdEncounterId = encouterid;

  const [patcategory, setPatcategory] = useState([]);
  const [ratetype, setRatetype] = useState([]);
  const [EncounterType, setEncounterType] = useState([]);
  const [departmentList, setDepartmentlist] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [payerName, setPayerName] = useState([]);
  const [programCode, setProgramCode] = useState([]);
  const [insurancePlanType, setInsurancePlanType] = useState([]);
  const [planType, setPlanType] = useState([]);
  const [coverageType, setCoverageType] = useState([]);
  const [key, setKey] = useState(99);
  const [serviceTypeList, setServiceTypeList] = useState<any>([]);
  const [serviceItem, setServiceItem] = useState<any>([]);
  const [patCatDD, setPatCatDD] = useState<any>("");
  const [ratTyDD, setRatTyDD] = useState<any>("");
  const [triCoDD, setTriCoDD] = useState<any>("");
  const [encTyDD, setEncTyDD] = useState<any>("");
  const [payNameDD, setPayNameDD] = useState<any>("");
  const [polNuIP, setPolNuIP] = useState("");
  const [corpIP, setCorpIP] = useState("");
  const [polInsIP, setPolInsIP] = useState("");
  const [proCodDD, setProCodDD] = useState<any>("");
  const [insPlanDD, setInsPlanDD] = useState<any>("");
  const [covTyDD, setCovTyDD] = useState<any>("");
  const [planTypDD, setPlanTypDD] = useState<any>("");
  const [relationDD, setRelationDD] = useState<any>("");
  const [credLimIP, setCredLimIP] = useState("");
  const [refLetIP, setRefLetIP] = useState("");
  const [custGrpRB, setCustGrpRB] = useState("Self");
  const [apptTimRB, setApptTimRB] = useState("");
  const [deptDD, setDeptDD] = useState<any>("");
  const [vistTyprRD, setVistTyprRD] = useState("");
  const [doctNameDD, setDoctNameDD] = useState<any>("");
  const [encounterClassDD, setEncounterClassDD] = useState<any>({
    code: "AMB",
    display: "ambulatory",
  });
  const [exterRefDetTA, setExterRefDetTA] = useState("");
  const [referralRB, setReferralRB] = useState("");
  const [selectedDoctorname, setSelectedDoctorname] = useState<any>([]);
  const [triagecounter, setTriagecounter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchpopup, setSearchPopup] = useState(false);
  const [customerGroup, setCustomerGroup] = useState("Self");
  const [reasonForCancellation, setReasonForCancellation] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [serviceTypeData, setServiceTypeData] = useState<any>("");
  const [selectedServiceItem, setSelectedServiceItem] = useState<any>("");
  const [hideGenerateBill, setHideGenerateBill] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [addedServices, setAddedServices] = useState({
    opdEncounterSerId: null,
    patientPrefix: null,
    patientId: 0,
    patientName: "",
    prefixCode: "",
    titleDes: "",
    superSpecialityDesc: "",
    serviceDesc: "",
    serviceCode: "",
    remarks: null,
    department: "",
    opdEncounterId: null,
    servicePktRateId: "",
    printIssuedTo: null,
    isPrint: 0,
    serviceDtls: null,
    servicePktRate: null,
    superSpeciality: "",
    encounterType: null,
    servicePrice: "",
    quantity: null,
    confirmedQty: null,
    serviceAvail: null,
    cancelFlag: 1,
    paymentFlag: 1,
    outstandingFlag: 1,
    captureFrom: null,
    serviceAlias: null,
    billid: null,
    orderId: null,
    orderFrom: null,
    isDoctorFlag: 1,
    basePrice: "",
    ageOfPatient: "",
    gendeDesc: "",
    reason: null,
    primaryContactNum: "",
    serviceName: "",
    serviceType: "",
    serviceTypeDesc: "",
    serviceCount: null,
    locationDesc: null,
    billId: null,
    billNumber: null,
    cpoeType: null,
    departmentDesc: null,
    containerName: "",
    containerCode: "",
    specimen: "",
    specimenCode: "",
    isCultureSensitive: 0,
  });
  const [existingEncounterDetails, setExistingEncounterDetails] =
    useState<any>();

  const [enableGenerateBill, setEnableGenerateBill] = useState(true);
  const [reasonForCancelDD, setReasonForCancelDD] = useState<any>("");
  const [disableSaveEnct, setDisableSaveEnct] = useState(true);
  const [patValues, setPatValues] = useState<any>({});
  const [saveResponse, setSaveResponse] = useState<any>({});
  const searchParams = useParams();
  const patientId = searchParams.mrn;
  const encountId = searchParams.encouterId;
  const shouldFetchData = useRef(true);
  const [profileImage, setProfileImage] = useState("");
  const [completePatData, setCompletePatData] = useState<any>({
    patientName: "",
    patientId: "",
    mrn: ""
  });

  const handledepartmentDropdown = (e: any) => {
    setDeptDD(e);
    setLoading(true);
    setDoctNameDD("");
    setSelectedDoctorname([]);
    services
      .get(getDepartmentPrac + e.value + "/1", headers)
      .then((response) => {
        setLoading(false);
        const transformedData = response.data.map((item: any) => ({
          value: item.employeeId,
          label: item.lastName,
        }));
        setSelectedDoctorname(transformedData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  const handleDoctCharges = (e: any) => {
    setDoctNameDD(e);
    let employeeName = selectedDoctorname.filter(
      (data: any) => data.label === e.label
    )[0].label;
    services
      .get(
        searchDoctorFee +
        deptDD.value +
        "/" +
        employeeName +
        "/" +
        ratTyDD.value
      )
      .then((response) => {
        setLoading(false);
        response.data.map((item: any, index: any) => {
          const newObject = {
            id: serviceTypeArray.length + 1,
            servicetype: item.serviceType,
            serviceTypeDesc: item.serviceTypeDesc,
            servicecode: item.code,
            servicename: item.serviceDesc,
            opdEncounterSerId: null,
            charge: item.finalAmount,
            orderId: "",
            orderFrom: "ENCOUNTER",
            billNumber: "",
            billId: 0,
          };

          const duplicateServiceType = "ST1001";
          if (
            newObject.servicetype === duplicateServiceType &&
            serviceTypeArray.some(
              (item: any) => item.servicetype === duplicateServiceType
            )
          ) {
            toast.error(
              "You cannot add two consultation services with the same type"
            );
          } else {
            setServiceTypeArray((prevData: any) => [...prevData, newObject]);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };

  const {
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { handleSubmit: handleSubmit1 } = useForm();

  const columns: GridColDef[] = [
    {
      field: "#",
      headerName: "#",
      width: 120,
      renderCell: (params) => (
        <>
          <Checkbox
            crossOrigin
            onClick={() => getRowData(params.row)}
            checked={params.row.isActive === true ? true : false}
            disabled={params.row.billNumber !== "" ? true : false}
          />
        </>
      ),
    },
    { field: "serviceTypeDesc", headerName: "Service Type", width: 200 },
    { field: "servicecode", headerName: "Service Code", width: 140 },
    { field: "servicename", headerName: "Service Name", width: 320 },
    { field: "charge", headerName: "Charges", width: 100 },
    { field: "billNumber", headerName: "Bill Number", width: 160 },

    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <>
          {params.row.opdEncounterSerId ? null : <button className="text-center" onClick={() => onDelete(params.row)}>
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>}

        </>
      ),
    },
  ];

  const [serviceTypeArray, setServiceTypeArray] = useState<any>([
    {
      id: "1",
      servicetype: "",
      servicecode: "",
      servicename: "",
      charge: "",
      billNumber: "",
      billId: 0,
      department: "",
      departmentDesc:""
    },
  ]);

  const getRowData = (data: any) => {
    let GetData = serviceTypeArray.map((list: any) => {
      
      if (list.id === data.id) {
        return {
          ...list,
          isActive: !list.isActive,
        };
      }
      return list;
    });
    setServiceTypeArray(GetData);

    let result: any = GetData.filter((list: any) => list.isActive === true);
    setSelectedRowIds(result);
  };
  const handleAddRow = () => {
    const inx = serviceTypeArray.findIndex((item: any) => item.servicecode == selectedServiceItem.serviceCode)
    if (inx > -1) {
      toast.error('Cannot add the same service twice');
      return;
    }
    const indexOfType = serviceTypeList.findIndex(
      (option: any) => option.value === getValues("servicetype").code
    );
    const indexOfserviceType = serviceTypeList.findIndex(
      (option: any) => option.code === getValues("servicetype").code
    );
    if (
      indexOfType !== -1 &&
      indexOfserviceType !== -1 &&
      indexOfserviceType !== -1
    ) {
      const newObject = {
        id: serviceTypeArray.length + 1,
        servicetype: serviceTypeList[indexOfserviceType].code,
        serviceTypeDesc: serviceTypeList[indexOfserviceType].desc,
        servicecode: selectedServiceItem.serviceCode,
        servicename: selectedServiceItem.serviceDesc,
        containerName: selectedServiceItem.containerName,
        containerCode: selectedServiceItem.containerCode,
        specimen: selectedServiceItem.specimen,
        specimenCode: selectedServiceItem.specimenCode,
        isCultureSensitive: selectedServiceItem.isCultureSensitive,
        charge: selectedServiceItem.basePrice,
        opdEncounterSerId: null,
        orderFrom: "ENCOUNTER",
        billNumber: "",
        billId: 0,
        patientId:
          patientData?.patientId ||
          existingEncounterDetails?.opdEncounerPractionerList[0].patientId ||
          patientId,
        cpoeType: selectedServiceItem.serviceTypeDesc === 'Procedures' ? selectedServiceItem.serviceTypeDesc : selectedServiceItem.departmentDesc,
        departmentDesc: selectedServiceItem?.departmentDesc,
        superSpecialityDesc: selectedServiceItem?.superSpecialityDesc,
        department: selectedServiceItem?.department,
        superSpeciality: selectedServiceItem?.superSpeciality,
      };
      const duplicateServiceType = "ST1001";
      if (
        newObject.servicetype === duplicateServiceType &&
        serviceTypeArray.some(
          (item: any) => item.servicetype === duplicateServiceType
        )
      ) {
        toast.error(
          "You cannot add two consultation services with the same type"
        );
        return
      } else {
        setServiceTypeArray((prevData: any) => [...prevData, newObject]);
        setDisableSaveEnct(false)
        if (encountId !== '0') {
          setEnableGenerateBill(true)
        }
      }
    }
  };

  const handleServiceTypeChange = (e: any) => {
    setSelectedServiceItem("");
    setServiceTypeData(e);
    setLoading(true);
    services
      .get(getServiceItems + e.code)
      .then((response) => {
        setLoading(false);
        const transformedData = response.data.map((item: any) => ({
          ...item,
          value: item.serviceCode,
          label: item.serviceDesc,
        }));
        setServiceItem(transformedData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
    setValue("servicetype", e);
  };

  const ShowGenerateBill = () => {

    if (!selectedRowIds.every((item: any) => item?.opdEncounterSerId)) {
      toast.error('Please save/update encounter before generating bill')
      return
    }
    if (selectedRowIds.length == 0) {
      toast.warning("Select the services for which you want to generate bill");
    } else {
      setHideGenerateBill(false);
    }

  };

  const handleServiceItemChange = (e: any) => {
    setSelectedServiceItem(e);
    setValue("serviceitem", e);
  };

  const handleCustomerGroup = (e: any) => {
    setCustGrpRB(e.target.value);
    setCustomerGroup(e.target.value);
  };

  const generateSearchP = () => {
    setSearchPopup(true);
  };

  const handleOpen = () => setOpen(!open);

  const { patientData, setPatientData } = PatientDatadataAuth();
  const {appointmentNum}=useParams()
  const saveEncounter: any = (data: any) => {
    let obj = JSON.parse(getLocalItem("loginResponse")!);
    let ServiceDtlsList = serviceTypeArray.map((val: any) => {
      let serviceValues: {
        patientId: number | null;
        patientName: string | null;
        serviceCode: string;
        serviceDesc: string;
        servicePrice: string;
        serviceType: string | null;
        serviceTypeDesc: string | null;
        opdEncounterSerId: number | null;
        superSpeciality: string | null;
        superSpecialityDesc: string | null;
        orderId: string | null;
        orderFrom: string | null;
        billId: number | null;
        billNumber: string | null;
        cpoeType: string | null;
        departmentDesc: string | null;
        department: string | null;
        containerName: string | null,
        containerCode: string | null,
        specimen: string | null,
        specimenCode: string | null,
        isCultureSensitive: number | null,
      } = { ...addedServices };
      (serviceValues.patientId =
        patientData?.patientId || patValues?.patinentId || patientId),
        (serviceValues.patientName =
          patientData?.patientName || patValues?.patientName),
        (serviceValues.specimen = val.specimen),
        (serviceValues.specimenCode = val.specimenCode),
        (serviceValues.containerName = val.containerName),
        (serviceValues.isCultureSensitive = val.isCultureSensitive),
        (serviceValues.containerCode = val.containerCode),
        (serviceValues.serviceCode = val.servicecode),
        (serviceValues.serviceDesc = val.servicename),
        (serviceValues.servicePrice = val.charge),
        (serviceValues.serviceType = val.servicetype),
        (serviceValues.serviceTypeDesc = val.serviceTypeDesc),
        (serviceValues.opdEncounterSerId = val.opdEncounterSerId
          ? val.opdEncounterSerId
          : null),
        (serviceValues.billId = val.billId ? val.billId : null),
        (serviceValues.superSpeciality = val.superSpeciality
          ? val.superSpeciality
          : null),
        (serviceValues.orderFrom = val.orderFrom ? val.orderFrom : null),
        (serviceValues.superSpecialityDesc = val.superSpecialityDesc
          ? val.superSpecialityDesc
          : null),
        (serviceValues.billNumber = val.billNumber ? val.billNumber : null);
      serviceValues.orderId = val.orderId ? val.orderId : null;
      serviceValues.cpoeType = val.cpoeType ? val.cpoeType : null;
      serviceValues.departmentDesc = val.departmentDesc
        ? val.departmentDesc
        : null;
      serviceValues.department = val.department ? val.department : null;
      return serviceValues;
    });
    
    if (encountId === "0") {
      let postObj = {
        opdEncounterId: null,
        appointmentNumner:appointmentNum,
        isOpAppointment:appointmentNum!='0'?true:false,
        patientId:
          patientData?.patientId ||
          existingEncounterDetails?.opdEncounerPractionerList[0].patientId ||
          patientId,
        locationId: obj?.locationId,
        serviceEntityId: headers.serviceEntityId,
        referalName: null,
        patientCategory: patCatDD?.value,
        referalSource: referralRB,
        comments: exterRefDetTA,
        triageCounter: triCoDD?.value,
        encounterType: null, //encTyDD?.value,
        rateType: ratTyDD?.value,
        encounterClass: encounterClassDD?.code,
        reasonForVisit: "",
        details: "",
        isVip: 1,
        alias: "",
        walkinScheduled: apptTimRB == "Wakin" ? 1 : 0,
        unassignedPatient: 0,
        remarks: "",
        reopenReason: "",
        rosterStatusFlag: 1,
        statusFlag: 1,
        prefix: "",
        generatedDate: "",
        updatedDate: "",
        recordedBy: getLocalItem("loginResponse")
          ? jsonParse("loginResponse").employeename
          : "",
        opdEncounerPractionerTbl: [
          {
            opdPractionerId: null,
            patientId:
              patientData?.patientId || patValues?.patinentId || patientId,
            department: deptDD?.value,
            departmentDesc: deptDD?.label,
            empId: doctNameDD?.value,
            doctor: doctNameDD?.label,
            visitType: vistTyprRD,
            statusFlag: 1,
          },
        ],
        encounerpayerPlainList: [
          {
            payerName: payNameDD?.value,
            programCode: proCodDD?.value,
            insurancePlanType: insPlanDD?.value,
            planType: planTypDD?.value,
            corporate: corpIP,
            opdEncounerPayerId: null,
            patientId:
              patientData?.patientId || patValues?.patinentId || patientId,
            customerGroup: custGrpRB,
            masterCustomer: "",
            policyNo: polNuIP,
            policyInsurer: polInsIP,
            creditLimit: credLimIP,
            relationShip: relationDD?.value,
            validUpto: "",
            refLetterNo: refLetIP,
            alNo: data.altNo,
            statusFlag: 1,
            activePayerFlag: 1,
            coverageType: covTyDD?.value,
          },
        ],
        encounterServiceDtlsList: ServiceDtlsList,
      };
      services
        .create(createEncounter, postObj)
        .then((response) => {
          setEnableGenerateBill(false);
          toast.success("Encounter created successfully");
          setTimeout(() => {
            router.push(
              `/encounter/${response.data.patientId}/${response.data.opdEncounterId}/${appointmentNum}/outpatient-encounter`
            );
          }, 1000)
          setSelectedRowIds([])
          localStorage.removeItem("fullName");
          setDisableSaveEnct(true);
          setSaveResponse(response.data);
        })
        .catch((err) => {
          toast.error("Please try after sometime");
          console.log(err.message);
        });
    } else {
      let postObj = {
        opdEncounterId: encountId,
        patientId:
          patientData?.patientId ||
          existingEncounterDetails?.opdEncounerPractionerList[0]?.patientId,
        locationId: obj.locationId,
        serviceEntityId: headers.serviceEntityId,
        referalName: null,
        patientCategory: patCatDD?.value,
        referalSource: referralRB,
        comments: exterRefDetTA,
        triageCounter: triCoDD?.value,
        encounterType: encTyDD?.value,
        rateType: ratTyDD?.value,
        encounterClass: "AMB",
        reasonForVisit: "",
        details: "",
        isVip: 1,
        alias: "",
        walkinScheduled: apptTimRB == "Wakin" ? 1 : 0,
        unassignedPatient: 0,
        remarks: "",
        reopenReason: "",
        rosterStatusFlag: 1,
        statusFlag: 1,
        prefix: "",
        generatedDate: "",
        updatedDate: "",
        opdEncounerPractionerTbl: [
          {
            opdPractionerId:
              existingEncounterDetails?.opdEncounerPractionerList[0]
                ?.opdPractionerId,
            patientId:
              patientData?.patientId ||
              existingEncounterDetails?.opdEncounerPractionerList[0]?.patientId,
            department: deptDD?.value,
            empId: doctNameDD?.value,
            visitType: vistTyprRD,
            statusFlag: 1,
          },
        ],
        encounerpayerPlainList: [
          {
            payerName: payNameDD?.value,
            programCode: proCodDD?.value,
            insurancePlanType: insPlanDD?.value,
            planType: planTypDD?.value,
            corporate: corpIP,
            opdEncounerPayerId:
              existingEncounterDetails?.opdEncounterPayerPlanList[0]
                ?.opdEncounerPayerId,
            patientId:
              patientData?.patientId ||
              existingEncounterDetails?.opdEncounerPractionerList[0]?.patientId,
            customerGroup: custGrpRB,
            masterCustomer: "",
            policyNo: polNuIP,
            policyInsurer: polInsIP,
            creditLimit: credLimIP,
            relationShip: relationDD?.value,
            validUpto: "",
            refLetterNo: refLetIP,
            alNo: data.altNo,
            statusFlag: 1,
            activePayerFlag: 1,
            coverageType: covTyDD?.value,
          },
        ],
        encounterServiceDtlsList: ServiceDtlsList,
      };
      services
        .create(updateEncounter, postObj)
        .then((response) => {
          toast.success("Encounter updated successfully");
          router.push(
            `/encounter/${response.data.patientId}/${response.data.opdEncounterId}/${appointmentNum}/outpatient-encounter`
          );
          setSelectedRowIds([])
          services
            .get(getEncounterDetailsById + encountId)
            .then((response) => {
              setEnableGenerateBill(false);
              let arr = response.data?.opdEncounterServiceDtlsList
                .map((val: any, index: any) => {
                  const obj = {
                    id: index + 1,
                    serviceTypeDesc: val?.serviceTypeDesc,
                    servicetype: val?.serviceType,
                    servicecode: val.serviceId,
                    servicename: val?.serviceDesc,
                    charge: val?.service_price,
                    opdEncounterSerId: val?.opdEncounterSerId,
                    orderId: val?.orderId,
                    billNumber: val.billNumber ? val.billNumber : "",
                    billId: val.billId ? val.billId : null,
                    isActive: false,
                    patientId: patientData?.patientId,
                    cpoeType: val.cpoeType?.cpoeType,
                    departmentDesc: val?.departmentDesc,
                    superSpecialityDesc: val?.superSpecialityDesc,
                    department: val?.department,
                    superSpeciality: val?.superSpeciality,
                  };
                  return obj;
                })
                .filter((item: any) => item !== null);
              setServiceTypeArray(arr);
              setDisableSaveEnct(true)
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((err) => {
          toast.error("Please try after sometime");
          console.log(err.message);
        });
    }
  };
  let router = useRouter();
  const clearForm = () => {
    setKey((k) => k + 90);
    setCustomerGroup("Self");
    setCustGrpRB("Self");
    setReasonForCancellation([]);
    setPatCatDD("");
    setRatTyDD("");
    setTriCoDD("");
    setEncTyDD("");
    setPayNameDD("");
    setProCodDD("");
    setInsPlanDD("");
    setCovTyDD("");
    setPlanTypDD("");
    setRelationDD("");
    setSelectedServiceItem("");
    setServiceTypeData("");
    setDoctNameDD("");
    setDeptDD("");
    setPolNuIP("");
    setCorpIP("");
    setPolInsIP("");
    setCredLimIP("");
    setRefLetIP("");
    setCustGrpRB("Self");
    setExterRefDetTA("");
    setPatientData({});
    setServiceTypeArray([]);
    router.replace("/encounter/0/0/0/outpatient-encounter");
  };

  const canceledEncounter = () => {
    let postObj = {
      opdEncounterId: searchParams.encouterId,
      patientId: searchParams.mrn,
      reason: reasonForCancelDD.value,
    };
    services
      .create(cancelEncounter, postObj)
      .then(() => {
        toast.success("Encounter cancelled successfully.");
        setLoading(false);
        router.push("/frontdesk/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  const handleBillResponse = () => {
    services
      .get(getEncounterDetailsById + encountId)
      .then((response) => {
        let arr = response.data?.opdEncounterServiceDtlsList
          .map((val: any, index: any) => {
            const obj = {
              ...val,
              id: index + 1,
              serviceTypeDesc: val?.serviceTypeDesc,
              servicetype: val?.serviceType,
              servicecode: val.serviceId,
              servicename: val?.serviceDesc,
              charge: val?.service_price,
              opdEncounterSerId: val?.opdEncounterSerId,
              orderId: val?.orderId,
              billNumber: val.billNumber ? val.billNumber : "",
              billId: val.billId ? val.billId : null,
              isActive: false,
              department:val?.department,
              departmentDesc:val?.departmentDesc,
            };
            //console.log(obj)
            return obj;
          })
          .filter((item: any) => item !== null);
        setServiceTypeArray(arr);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    setServiceTypeArray([]);
    setLoading(true);
    if (shouldFetchData.current) {
      services
        .get(getTriage, headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.map((item: any) => ({
            value: item.code,
            label: item.counterName,
          }));
          setTriagecounter(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "PlanType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setPlanType(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "MasterPatientCategory-Type" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.desc,
          }));
          setPatcategory(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "InsurancePlanType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setInsurancePlanType(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "PatientRelationship" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setRelationship(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });

      services
        .get(getConfigData + "ProgramCode" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setProgramCode(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "MasterRateType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.desc,
          }));
          setRatetype(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "PayerName" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setPayerName(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "EncounterType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setEncounterType(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });

      services
        .get(getConfigData + "EncounterClass" + "/0", headers)
        .then((response) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });

      services
        .get(getConfigData + "MasterServiceType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            ...item,
            value: item.code,
            label: item.desc,
          }));
          let filteredData = transformedData.filter(
            (data: any) => data.ptType === "op" || data.ptType === "all"
          );
          // hide pharmacy and consumables suggested by srusvin sir in review meeting (12/2/24)
          let remPharAndCons = filteredData.filter(
            (data: any) => data.code !== "ST1005" && data.code !== "ST1006"
          );
          setServiceTypeList(remPharAndCons);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "CoverageType" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setCoverageType(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getAllDepartments)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.map((item: any) => ({
            value: item.departmentCode,
            label: item.departmentDescription,
          }));
          setDepartmentlist(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
      services
        .get(getConfigData + "ReasonForCancellation" + "/0", headers)
        .then((response) => {
          setLoading(false);
          const transformedData = response.data.configData.map((item: any) => ({
            value: item.code,
            label: item.display,
          }));
          setReasonForCancellation(transformedData);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } else {
      shouldFetchData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEncounterData = async () => {
    if (patientId !== "0") {
      services
        .get(getPatientImgById + patientId)
        .then((response: any) => {
          if (response.data === "patientId not found") {
            setProfileImage("");
          } else {
            setProfileImage(response.data.imagesDocument ?
              "data:image/jpeg;base64," + response.data.imagesDocument : ""
            );
          }
        })
        .catch((error: any) => {
          console.log(error.message);
        });

      services
        .get(getPatientDetailsById + patientId)
        .then((response: any) => {
          setCompletePatData(response.data);
          setPatCatDD({
            ...patCatDD,
            value: response.data.patData.patientCategory,
            label: response.data.patData.patientCategoryDesc,
          });
        })
        .catch((error: any) => {
          console.log(error.message);
        });
    }
    if (patientData?.isAlive === false) {
      setDisableSaveEnct(true);
    }
    if (encountId !== "0") {
      //   setPatValues((JSON.parse(decryptToken(getLocalItem("encounterPatData")!))));
      const encryptedData = getLocalItem("encounterPatData");
      if (encryptedData) {
        try {
          const decryptedData = decryptToken(encryptedData);
          if (decryptedData) {
            const parsedData = JSON.parse(decryptedData);
            setPatValues(parsedData);
          }
        } catch (error) {
          // Handle JSON parsing error or decryption error
        }
      }
      const response = await services
        .get(getEncounterDetailsById + encountId)
      // .then((response) => {
      setEnableGenerateBill(false);
      setExistingEncounterDetails(response.data);

      setExterRefDetTA(
        response.data?.opdEncouterDetails?.opdEncouterDetails?.comments
      );
      let EnctType = EncounterType.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncouterDetails?.opdEncouterDetails
            ?.encounterType
      );
      setEncTyDD(EnctType[0]);
      let RateType = ratetype.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncouterDetails?.opdEncouterDetails?.rateType
      );
      setRatTyDD(RateType[0]);
      let PatientCategory = patcategory.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncouterDetails?.opdEncouterDetails
            ?.patientCategory
      );
      setPatCatDD(PatientCategory[0]);
      let TriageCounter = triagecounter.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncouterDetails?.opdEncouterDetails
            ?.triageCounter
      );
      setTriCoDD(TriageCounter[0]);
      let empId = await response.data?.opdEncounerPractionerList[0]?.empId;
      // let Department: any = departmentList.filter(
      //   (val: any) =>
      //     val.value ===
      //     response.data?.opdEncounerPractionerList[0]?.department
      // );
      let Department: any = {
        value: response?.data?.opdEncounerPractionerList[0]?.department,
        label: response?.data?.opdEncounerPractionerList[0]?.departmentDesc
      }

      setDeptDD(Department);
      if (Department.value !== "") {
        services
          .get(getDepartmentPrac + Department.value + "/1", headers)
          .then((response) => {
            setLoading(false);
            const transformedData = response.data.map((item: any) => ({
              value: item.employeeId,
              label: item.lastName,
            }));
            let DoctorName = transformedData.filter(
              (val: any) => val.value === parseInt(empId)
            );
            setDoctNameDD(DoctorName[0]);
            setSelectedDoctorname(transformedData);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      }
      setCustGrpRB(
        response.data.opdEncounterPayerPlanList[0].customerGroup
      );
      response.data?.opdEncounterPayerPlanList[0]?.customerGroup == "Self"
        ? setCustomerGroup("Self")
        : setCustomerGroup("Insurance");
      let PayerName = payerName.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.payerName
      );
      setPayNameDD(PayerName[0]);
      setPolNuIP(response.data?.opdEncounterPayerPlanList[0]?.policyNo);
      setCorpIP(response.data?.opdEncounterPayerPlanList[0]?.corporate);
      setPolInsIP(
        response.data?.opdEncounterPayerPlanList[0]?.policyInsurer
      );
      let ProgramCode = programCode.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.programCode
      );
      setProCodDD(ProgramCode[0]);
      let InsurancePlan = insurancePlanType.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.insurancePlanType
      );
      setInsPlanDD(InsurancePlan[0]);
      let CoverageType = coverageType.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.coverageType
      );
      setCovTyDD(CoverageType[0]);
      let PlanType = planType.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.planType
      );
      setPlanTypDD(PlanType[0]);
      let Relation = relationship.filter(
        (val: any) =>
          val.value ===
          response.data?.opdEncounterPayerPlanList[0]?.relationShip
      );
      setRelationDD(Relation[0]);
      setCredLimIP(
        response.data?.opdEncounterPayerPlanList[0]?.creditLimit
      );
      setRefLetIP(response.data?.opdEncounterPayerPlanList[0]?.refLetterNo);
      let arr = response.data?.opdEncounterServiceDtlsList
        .map((val: any, index: any) => {
          const obj = {
            id: index + 1,
            serviceTypeDesc: val?.serviceTypeDesc,
            servicetype: val?.serviceType,
            servicecode: val.serviceId,
            servicename: val?.serviceDesc,
            charge: val?.service_price,
            opdEncounterSerId: val?.opdEncounterSerId,
            orderId: val?.orderId,
            orderFrom: val?.orderFrom,
            billNumber: val.billNumber ? val.billNumber : "",
            billId: val.billId ? val.billId : null,
            isActive: false,
            department:val?.department,
            departmentDesc:val?.departmentDesc,
          };
          return obj;
        })
        .filter((item: any) => item !== null);
      setServiceTypeArray(arr);
      // })
      // .catch((error) => {
      //   console.log(error.message);
      // });
      let obj = {
        patientId: patientId,
        opdEncounterId: encountId,
      };
      setSaveResponse(obj);
    }
  }

  useEffect(() => {
    fetchEncounterData();
  }, [encountId, ratetype, patientId]);

  //console.log(props?.screenData)
  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div>

      <ReactCommonDialog
        open={searchpopup}
        handler={() => setSearchPopup(false)}
        popupClose={() => setSearchPopup(false)}
        Content={<SearchUpdatePatient
          screen={"opdEncounter"}
          popupclose={setSearchPopup}
        />}
        size={'xl'}
      />
      {/* <GenerateSearchPatient
        open={searchpopup}
        setOpen={setSearchPopup}
        size={"xl"}
        content={
          <SearchUpdatePatient
            screen={"opdEncounter"}
            popupclose={setSearchPopup}
          />
        }
      /> */}
      {loading ? <Loader /> : ""}
      <ToastContainer />

      {hideGenerateBill ? (
        <>
          <div className="font-bold px-2 md:pt-1 pb-1 flex mx-auto w-full justify-between my-4">
            <h1 className="mt-2">Outpatient Encounter</h1>
            <div className="en-autocomplteGserch flex items-center justify-end ml-4 pl-4">
              <ActionButton
                buttonText=" Advanced Search"
                handleSubmit={generateSearchP}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
          <div className="px-0 md:flex">
            <div className="md:w-1/4 px-2">
              <div className="profile-wrap justify-center mb-3">
                <div
                  className="card w-auto mx-auto bg-white dark:bg-slate-850 py-1 rounded-2xl"
                  style={{ minHeight: "350px" }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt=""
                      width={160}
                      height={160}
                      className="mx-auto rounded-full "
                    />
                  ) : (
                    <Image
                      src={user}
                      alt="photo"
                      width={160}
                      height={160}
                      className="mx-auto rounded-full "
                    />
                  )}
                  <div className="text-center mt-3 text-2xl font-medium capitalize">
                    {patientId !== "0"
                      ? completePatData?.patData?.fullName
                      : ""}
                  </div>
                  <div className="text-center my-1 font-bold text-sm capitalize">
                    {patientId !== "0"
                      ? completePatData?.patData?.ageOfPatient
                      : ""}{" "}
                    / {completePatData?.patData?.genderDesc}
                  </div>
                  {patValues?.appointmentNumber && (
                    <>
                      <div className="text-center font-normal mt-2 text-xs">
                        Appointment No.
                      </div>
                      <div className="text-center  text-1xl font-medium capitalize">
                        {patValues?.appointmentNumber
                          ? patValues?.appointmentNumber
                          : "XXXXXX"}
                      </div>
                    </>
                  )}
                  {patValues?.practitioner && (
                    <>
                      <div className="text-center font-normal mt-2 text-xs">
                        Physician / Department
                      </div>
                      <div className="text-center  text-1xl font-medium capitalize">
                        {patValues?.practitioner
                          ? patValues.practitioner
                          : "XXXXXX"}
                        &nbsp;/&nbsp;
                        {patValues?.department
                          ? patValues.department
                          : "XXXXXX"}
                      </div>
                    </>
                  )}

                  <hr className="mt-3" />
                  <div className="flex px-4 pt-3">
                    <div className="w-1/2 text-center text-sm hidden">
                      Time :
                      <span className="font-bold">
                        {moment(patValues?.appointmentTime).format("LT")
                          ? moment(patValues?.appointmentTime).format("LT")
                          : "Time"}
                      </span>
                    </div>
                    <div className="w-0 border border-gray-300 hidden"></div>
                    <div className="w-1/2 text-center text-sm hidden">
                      Date :
                      <span className="font-bold">
                        {moment(patValues?.appointmentTime).format("DD/MM/YYYY")
                          ? moment(patValues?.appointmentTime).format(
                            "DD/MM/YYYY"
                          )
                          : "DD/MM/YYYY"}
                      </span>
                    </div>
                  </div>
                  <div className="flex px-4 pt-3">
                    <div className="w-32 text-left text-sm">Patient Id</div>
                    <div className="w-0 border border-gray-300"></div>
                    <div className="w-2/3 text-left ml-2 text-sm">
                      {patientId !== "0" ? completePatData?.mrn : ""}
                    </div>
                  </div>
                  <div className="flex px-4 pt-3">
                    <div className="w-32 text-left text-sm">Encounter No</div>
                    <div className="w-0 border border-gray-300"></div>
                    <div className="w-2/3 text-left ml-2 text-sm">
                      {encountId !== "0"
                        ? existingEncounterDetails?.opdEncouterDetails
                          ?.opdEncouterDetails?.opdEncounterNo
                        : existingEncounterDetails?.opdEncouterDetails
                          ?.opdEncouterDetails?.opdEncounterNo
                          ? `${existingEncounterDetails.opdEncouterDetails?.opdEncouterDetails?.opdEncounterNo}`
                          : null}
                    </div>
                  </div>
                  <div className="flex px-4 pt-3">
                    <div className="w-32 text-left text-sm">Date & Time</div>
                    <div className="w-0 border border-gray-300"></div>
                    <div className="w-2/3 text-left ml-2 text-sm">
                      {encountId !== "0"
                        ? moment(
                          existingEncounterDetails?.opdEncouterDetails?.opdEncouterDetails?.updatedDate ??
                          existingEncounterDetails?.opdEncouterDetails?.opdEncouterDetails?.generatedDate
                        ).format("DD-MM-YYYY hh:mm A")
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-3/4 px-2">
              <div className="relative flex w-full min-w-0 p-4 bg-white dark:bg-slate-850  rounded-2xl ">
                <div className="w-full">
                  <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-3 xl:grid-cols-3">
                    <div className="relative flex flex-col p-2 ">
                      <Select
                        isSearchable={true}
                        primaryColor="blue"
                        options={patcategory}
                        placeholder="Patient Category"
                        value={patCatDD}
                        onChange={(e: any) => {
                          setPatCatDD(e);
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
                      <label
                        style={{
                          fontSize: "10px",
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                        className={`${patCatDD?.label !== undefined
                          ? " bg-white py-[1px] px-[6px] opacity-100 -top-[3px] left-[15px]"
                          : "text-sm opacity-0 top-10"
                          } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                      >
                        Patient Category
                      </label>
                    </div>
                    <div className="relative flex flex-col p-2">
                      <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Rate Type"
                        options={ratetype}
                        value={ratTyDD}
                        onChange={(e: any) => {
                          setRatTyDD(e);
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
                      <label
                        style={{
                          fontSize: "10px",
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                        className={`${ratTyDD?.label !== undefined
                          ? " bg-white py-[1px] px-[6px] opacity-100 -top-[3px] left-[15px]"
                          : "text-sm opacity-0 top-10"
                          } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                      >
                        Rate Type
                      </label>
                    </div>

                    <div className="relative flex flex-col p-2">
                      <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Triage Counter"
                        options={triagecounter}
                        value={triCoDD}
                        onChange={(e: any) => {
                          setTriCoDD(e);
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
                      <label
                        style={{
                          fontSize: "10px",
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                        className={`${triCoDD?.label !== undefined
                          ? " bg-white py-[1px] px-[6px] opacity-100 -top-[3px] left-[15px]"
                          : "text-sm opacity-0 top-10"
                          } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                      >
                        Triage Counter
                      </label>
                      {errors.triageCounter &&
                        errors.triageCounter.type === "required" && (
                          <div className="text-xs text-red-700 float-right">
                            required
                          </div>
                        )}
                    </div>
                  </div>

                  {/* <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
                    
                  </div> */}
                  <div className="mb-0  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-22">
                    <div className="relative flex flex-row gap-x-3" key={key}>
                      <b className="ml-2 mr-14 mt-2">Appointment Type: </b>
                      <Radio
                        crossOrigin={undefined}
                        label="Walkin"
                        name="appointmentType"
                        defaultChecked
                        value={"Walkin"}
                        onChange={(e) => {
                          setApptTimRB(e.target.value);
                        }}
                      />
                      <Radio
                        crossOrigin={undefined}
                        label="Scheduled"
                        name="appointmentType"
                        value={"Scheduled"}
                        onChange={(e) => {
                          setApptTimRB(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:flex py-4">
                <div className="md:w-1/2 relative flex mr-2">
                  <div className="w-full">
                    <div className="relative flex flex-col h-full min-w-0">
                      <div className="relative flex flex-col h-full min-w-0 p-4 bg-white dark:bg-slate-850 rounded-2xl">
                        <p className="mb-1 pl-2" key={key}>
                          <b className="mr-8">Visit Type</b>
                          <Radio
                            crossOrigin={undefined}
                            name="type"
                            label="New"
                            value={"New"}
                            defaultChecked
                            onChange={(e) => {
                              setVistTyprRD(e.target.value);
                            }}
                          />
                          <Radio
                            crossOrigin={undefined}
                            name="type"
                            label="Follow Up"
                            value={"Follow Up"}
                            onChange={(e) => {
                              setVistTyprRD(e.target.value);
                            }}
                          />
                        </p>

                        <div className=" grid gap-y-4 gap-x-2 ">
                          <div className="relative flex flex-col p-2">
                            <Select
                              isSearchable={true}
                              primaryColor="blue"
                              placeholder="Department"
                              options={departmentList}
                              value={deptDD}
                              isDisabled={encountId !== "0" ? true : false}
                              onChange={handledepartmentDropdown}
                              classNames={{
                                menuButton: ({ isDisabled }: any) =>
                                  `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                                    duration-300 focus:outline-none h-[39px]
                                                                   
                                                                    ${isDisabled
                                    ? "bg-blue-gray-50 border-blue-gray-200 border-transparent"
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
                              style={{
                                fontSize: "10px",
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                              className={`${deptDD?.label !== undefined
                                ? " bg-white py-[1px] px-[6px] opacity-100 -top-[3px] left-[15px]"
                                : "text-sm opacity-0 top-10"
                                } 
                                                                                                        truncate 
                                                                                                        cursor-default 
                                                                                                        select-none  
                                                                                                        absolute transition-all
                                                                                                       `}
                            >
                              Department
                            </label>
                          </div>
                          <div className="relative flex flex-col px-2 my-select">
                            <Select
                              isSearchable={true}
                              primaryColor="blue"
                              placeholder="Doctor"
                              options={selectedDoctorname}
                              value={doctNameDD}
                              isDisabled={encountId !== "0" ? true : false}
                              onChange={handleDoctCharges}
                              classNames={{
                                menuButton: ({ isDisabled }: any) =>
                                  `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                                    duration-300 focus:outline-none h-[39px]
                                                                   
                                                                    ${isDisabled
                                    ? "bg-blue-gray-50 border-blue-gray-200 border-transparent"
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
                              style={{
                                fontSize: "10px",
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                              className={`${doctNameDD?.label !== undefined
                                ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                                : "text-sm opacity-0 top-10"
                                } 
                                                                                                        truncate 
                                                                                                        cursor-default 
                                                                                                        select-none  
                                                                                                        absolute transition-all
                                                                                                       `}
                            >
                              Doctor
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 px-2">
                  <div className="relative w-full  min-w-0 p-4 bg-white dark:bg-slate-850  rounded-2xl ">
                    <div className="mb-2">
                      <p className="mb-1 pl-2" key={key}>
                        <b className="mr-8">Referral</b>
                        <Radio
                          crossOrigin={undefined}
                          name="referral"
                          label="Internal"
                          value={"Internal"}
                          defaultChecked
                          onChange={(e: any) => {
                            setReferralRB(e.target.value);
                          }}
                        />
                        <Radio
                          crossOrigin={undefined}
                          name="referral"
                          label="External"
                          value={"External"}
                          onChange={(e) => {
                            setReferralRB(e.target.value);
                          }}
                        />
                      </p>
                      <div className="relative flex px-2">
                        <Textarea
                          label="Referral Comments"
                          minRows={3}
                          placeholder="External Referral Details"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
                            const inputValue = sanitizeInput(sanitizeInput(e.target.value));
                            if (
                              alphaNumWithFewSymbols.test(inputValue) === false
                            ) {
                              const sanitizedValue = inputValue.replace(
                                /[^a-zA-Z0-9\/,. -]/g,
                                ""
                              );
                              setExterRefDetTA(sanitizedValue);
                            } else {
                              setExterRefDetTA(inputValue);
                            }
                          }}
                          value={exterRefDetTA !== "" ? exterRefDetTA : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap  -mx-2" key={key}>
            <div className="w-full max-w-full px-3 flex-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white border-0  dark:bg-slate-850  rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4">
                  <p>
                    <b className="mr-14">Customer Group</b>
                    <Radio
                      onChange={handleCustomerGroup}
                      crossOrigin={undefined}
                      name="customerGroup"
                      label="Self"
                      value="Self"
                      checked={custGrpRB == "Self" ? true : false}
                      defaultChecked
                    />
                    <Radio
                      crossOrigin={undefined}
                      name="customerGroup"
                      label="Insurance"
                      value="Insurance"
                      onChange={handleCustomerGroup}
                      checked={custGrpRB == "Insurance" ? true : false}
                    />
                  </p>
                  {customerGroup == "Insurance" && (
                    <>
                      <div className="mb-4 mt-4 grid gap-y-10 gap-x-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Payer Name"
                            options={payerName}
                            value={payNameDD}
                            onChange={(e: any) => {
                              setPayNameDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${payNameDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Payer Name
                          </label>
                        </div>
                        <div className="relative flex flex-col">
                          <Input
                            type="text"
                            label="Policy Number"
                            name="policyNo"
                            watch={watch}
                            handleChange={(e: any) => {
                              const inputValue = e.target.value;
                              if (
                                /^[a-zA-Z0-9-]*$/.test(inputValue) === false
                              ) {
                                const sanitizedValue = inputValue.replace(
                                  /[^a-zA-Z0-9\/,. -]/g,
                                  ""
                                );
                                setPolNuIP(sanitizeInput(sanitizedValue));
                              } else {
                                setPolNuIP(sanitizeInput(inputValue));
                              }
                            }}
                            value={polNuIP}
                            pattern="[a-zA-Z0-9-]*"
                          />
                        </div>
                        <div className="relative flex flex-col">
                          <Input
                            type="text"
                            label="Corporate"
                            name="corporate"
                            watch={watch}
                            handleChange={(e: any) => {
                              const inputValue = e.target.value;
                              if (
                                /^[a-zA-Z0-9-]*$/.test(inputValue) === false
                              ) {
                                const sanitizedValue = inputValue.replace(
                                  /[^a-zA-Z0-9\/,. -]/g,
                                  ""
                                );
                                setCorpIP(sanitizeInput(sanitizedValue));
                              } else {
                                setCorpIP(sanitizeInput(inputValue));
                              }
                            }}
                            value={corpIP}
                          />
                        </div>
                        <div className="relative flex flex-col">
                          <Input
                            type="text"
                            label="Policy Insurer"
                            name="policyInsurer"
                            watch={watch}
                            handleChange={(e: any) => {
                              const inputValue = e.target.value;
                              if (
                                /^[a-zA-Z0-9-]*$/.test(inputValue) === false
                              ) {
                                const sanitizedValue = inputValue.replace(
                                  /[^a-zA-Z0-9\/,. -]/g,
                                  ""
                                );
                                setPolInsIP(sanitizeInput(sanitizedValue));
                              } else {
                                setPolInsIP(sanitizeInput(inputValue));
                              }
                            }}
                            value={polInsIP}
                          />
                        </div>
                      </div>
                      <div className="mb-4 mt-4 grid gap-y-10 gap-x-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Program Code"
                            options={programCode}
                            value={proCodDD}
                            onChange={(e: any) => {
                              setProCodDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${proCodDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Program Code
                          </label>
                        </div>
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Insurance Plan Type"
                            options={insurancePlanType}
                            value={insPlanDD}
                            onChange={(e: any) => {
                              setInsPlanDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${insPlanDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Insurance Plan Type
                          </label>
                        </div>
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Coverage Type"
                            options={coverageType}
                            value={covTyDD}
                            onChange={(e: any) => {
                              setCovTyDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${covTyDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Coverage Type
                          </label>
                        </div>
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Plan Type"
                            options={planType}
                            value={planTypDD}
                            onChange={(e: any) => {
                              setPlanTypDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${planTypDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Plan Type
                          </label>
                        </div>
                      </div>
                      <div className="mb-4 mt-4 grid gap-y-10 gap-x-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="relative flex flex-col my-select">
                          <Select
                            isSearchable={true}
                            primaryColor="blue"
                            placeholder="Relationship"
                            options={relationship}
                            value={relationDD}
                            onChange={(e: any) => {
                              setRelationDD(e);
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
                          <label
                            style={{
                              fontSize: "10px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${relationDD?.label !== undefined
                              ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                              : "text-sm opacity-0 top-10"
                              } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                          >
                            Relationship
                          </label>
                        </div>

                        <div className="relative flex flex-col">
                          <Input
                            type="text"
                            label="Credit Limit"
                            name="creditLimit"
                            watch={watch}
                            handleChange={(e: any) => {
                              const inputValue = e.target.value;
                              if (
                                alphaNumWithFewSymbols.test(inputValue) ===
                                false
                              ) {
                                const sanitizedValue = inputValue.replace(
                                  /[^a-zA-Z0-9\/,. -]/g,
                                  ""
                                );
                                setCredLimIP(sanitizeInput(sanitizedValue));
                              } else {
                                setCredLimIP(sanitizeInput(inputValue));
                              }
                            }}
                            value={credLimIP}
                          />
                        </div>
                        <div className="relative flex flex-col">
                          <Input
                            type="text"
                            label="Ref Letter No"
                            name="refLetterNo"
                            watch={watch}
                            handleChange={(e: any) => {
                              const inputValue = e.target.value;
                              if (
                                alphaNumWithFewSymbols.test(inputValue) ===
                                false
                              ) {
                                const sanitizedValue = inputValue.replace(
                                  /[^a-zA-Z0-9\/,. -]/g,
                                  ""
                                );
                                setRefLetIP(sanitizeInput(sanitizedValue));
                              } else {
                                setRefLetIP(sanitizeInput(inputValue));
                              }
                            }}
                            value={refLetIP}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap mt-4 -mx-3">
            <div className="w-full max-w-full px-3 flex-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white border-0  dark:bg-slate-850  rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4">
                  <div className="mt-2 mb-2 grid gap-y-10 gap-x-2 md:grid-cols-4 xl:grid-cols-4">
                    <div className="relative flex flex-col px-2 my-select">
                      <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Service Type"
                        options={serviceTypeList}
                        value={serviceTypeData}
                        onChange={handleServiceTypeChange}
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
                        style={{
                          fontSize: "10px",
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                        className={`${serviceTypeData?.label !== undefined
                          ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                          : "text-sm opacity-0 top-10"
                          } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                      >
                        Service Type
                      </label>
                    </div>
                    <div className="relative flex flex-col  my-select">
                      <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Service Item"
                        options={serviceItem}
                        value={selectedServiceItem}
                        onChange={handleServiceItemChange}
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
                        style={{
                          fontSize: "10px",
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                        className={`${selectedServiceItem?.label !== undefined
                          ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                          : "text-sm opacity-0 top-10"
                          } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                      >
                        Service Item
                      </label>
                    </div>
                    <ActionButton
                      buttonText="Add"
                      handleSubmit={handleSubmit(handleAddRow)}
                      width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9] ml-2"
                    />
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <ReactDatagrid
                    rows={serviceTypeArray}
                    columns={columns}
                  />

                </div>
              </div>
            </div>
          </div>
          <div className=" flex justify-end gap-x-6 mt-4">
            <div className="float-right  w-3/4 mt-1">
              <div className=" flex items-center justify-end gap-x-4 ">
                <>
                  <ActionButton
                    disabled={enableGenerateBill}
                    buttonText="GENERATE BILL"
                    handleSubmit={ShowGenerateBill}
                    width="w-[140px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  />

                  {/* <ActionButton
                    disabled={disableSaveEnct}
                    buttonText={
                      encountId === "0" ? "SAVE ENCOUNTER" : "UPDATE ENCOUNTER"
                    }
                    handleSubmit={handleSubmit1(saveEncounter)}
                  /> */}
                  {/* Show SAVE button if res.Save is 1 and encountId is "0" */}
                  {props.screenData.Save === 1 && encountId === "0" && (
                    <ActionButton
                      disabled={disableSaveEnct}
                      buttonText="SAVE ENCOUNTER"
                      handleSubmit={handleSubmit1(saveEncounter)}
                      width="w-[160px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                  )}
                  {props.screenData.Update === 0 && encountId !== "0" && (
                    <ActionButton
                      disabled={true}
                      buttonText="SAVE ENCOUNTER"
                      width="w-[160px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                  )}

                  {/* Show UPDATE button if res.Update is 1 and encountId is not "0" */}
                  {props.screenData.Update === 1 && encountId !== "0" && (
                    <ActionButton
                      disabled={disableSaveEnct}
                      buttonText="UPDATE ENCOUNTER"
                      handleSubmit={handleSubmit1(saveEncounter)}
                      width="w-[160px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                  )}


                  <ActionButton
                    buttonText="CANCEL ENCOUNTER"
                    handleSubmit={handleSubmit(handleOpen)}
                    width="w-[155px] text-white  text-[11px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  />

                  {open ? (
                    <div>
                      <Dialog
                        open={open}
                        handler={handleOpen}
                        size={"sm"}
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0.9, y: -100 },
                        }}
                        className="py-5"
                      >
                        <DialogBody>
                          <Select
                            primaryColor="blue"
                            placeholder="Reason for Cancellation"
                            options={reasonForCancellation}
                            value={reasonForCancelDD}
                            onChange={(e: any) => setReasonForCancelDD(e)}
                          />
                        </DialogBody>
                        <DialogFooter>
                          <ActionButton
                            buttonText="CANCEL ENCOUNTER"
                            handleSubmit={handleSubmit1(canceledEncounter)}
                            width="w-[150px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                          />
                        </DialogFooter>
                      </Dialog>
                    </div>
                  ) : (
                    ""
                  )}

                  <ActionButton
                    buttonText="RESET"
                    handleSubmit={clearForm}
                    width="w-[140px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  />
                </>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5">
          {/* <Accordion expanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="font-semibold text-lg text-gray-700">
                Generate Bill
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Invoice
                  patientName={completePatData?.patData?.fullName}
                  department={deptDD?.label}
                  specialty={doctNameDD?.label}
                  mrn={completePatData?.mrn}
                  getSelectedItems={selectedRowIds}
                  patientId={mrn}
                  encounterId={saveResponse.opdEncounterId}
                  opdEncounterId={opdEncounterId}
                  handleBillResponse={handleBillResponse}
                  hideGenerateBill={setHideGenerateBill}
                />
              </Typography>
            </AccordionDetails>
          </Accordion> */}
          {/* <GenerateBill
          patientName={completePatData?.patData?.fullName}
          mrn={completePatData?.mrn}
          getSelectedItems={selectedRowIds}
          patientId={completePatData?.mrn}
          encounterId={saveResponse.opdEncounterId}
          handleBillResponse={handleBillResponse}
          hideGenerateBill={setHideGenerateBill}
          /> */}
          <GenerateBill
            patientName={completePatData?.patData?.fullName}
            mrnNo={completePatData?.mrn || " "}
            getSelectedItems={selectedRowIds}
            handleBillResponse={handleBillResponse}
            hideGenerateBill={setHideGenerateBill}
            setSelectedRowIds={setSelectedRowIds}
          />
        </div>
      )}
    </div>
  );
}

export default roleInfoScreenData(EncounterOutpatient, "En")