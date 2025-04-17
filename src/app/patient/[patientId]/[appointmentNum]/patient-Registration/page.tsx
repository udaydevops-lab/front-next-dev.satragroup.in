"use client";
import React, { useState, useEffect } from "react";
import DateInput from "../../../../_common/date-input";
import Input from "../../../../_common/input";
import { useForm } from "react-hook-form";
import services from "../../../../utilities/services";
import ActionButton from "../../../../_common/button";
import moment from "moment";
import Checkbox from "../../../../_common/checkbox";
import ErrorMessage from "../../../../_common/error_message";
import Label from "../../../../_common/label";
import DocumentUpload from "../../../../_common/document-upload";
import {
  getAppointmentDetailsByApptNo,
  getConfigData,
  getPatientDetailsById,
  getPatientImgById,
  getPatientProfileByAadhaarMobile,
  getPatientProfileByAbhaAddress,
  saveNormalRegistration,
  updatePatient,
} from "../../../../utilities/api-urls";
import { emailPattern } from "../../../../utilities/validations";
import { CalculateAge } from "../../../../_common/date1";
import Image from "next/image";
import user from "../../../../../../public/images/profile.jpg";
import Loader from "@/app/_common/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import Select from "react-tailwindcss-select";
import PatientConsent from "@/app/patient-consent/page";
import GenerateSearchPatient from "@/app/_common/generate-search-patient";
import SearchUpdatePatient from "@/app/patient/search-update-patient/page";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getLocalItem, removeLocalItem, setLocalItem } from "@/app/utilities/local";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { ClassNames } from "@emotion/react";
import UpdateEmailPopUp from "@/app/abha-profile/_components/UpdateEmailPopUp";
import UpdateMobilePopUp from "@/app/abha-profile/_components/UpdateMobilePopUp";
import UpdateNewMobile from "./_components/UpdateNewMobile";

function Icon({ id, open }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function PatientRegistration(props: any) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const searchParams = useParams();
  let patientId: any = searchParams.patientId;

  const [key, setKey] = useState(99);
  const [patientCategoryData, setPatientCategoryData] = useState<any>([]);
  const [genderData, setGenderData] = useState<any>([]);
  const [patientsourcedropdown, setPatientsourcedropdown] = useState<any>([]);
  const [nokrelationshipdropdown, setNokrelationshipdropdown] = useState<any>(
    []
  );
  const [religiondropdown, setReligiondropdown] = useState<any>([]);
  const [languagedropdown, setLanguagedropdown] = useState<any>([]);
  const [maritalstatusdropdown, setMaritalstatusdropdown] = useState<any>([]);
  const [nationalIdType, setNationalIdType] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [newMrnNo, setNewMrnNo] = useState("");
  const [patientCondition, setPatientCondition] = useState(true);

  const [check, setCheck] = useState<any>(null);
  const [selectedDate, setSelectedDate] = React.useState<any>();
  const [selectedDate1, setSelectedDate1] = React.useState(moment());
  const [profileImage, setProfileImage] = useState("");
  const [disableABHAFields, setDisableABHAFields] = useState(false);
  const [patientTypeDropDown, setPatientTypeDropDown] = useState<any>([]);
  const [copyAddress, setCopyAddress] = useState(false);
  const [profilePic, setProfilePic] = useState<any>([]);
  const [ageValue, setAgeValue] = useState("");
  const [pincodeResponse, setPincodeResponse] = useState<any>([]);
  const [genderVal, setGenderVal] = useState<any>(null);
  const [patCalVal, setPatCalVal] = useState<any>("");
  const [patTypeVal, setPatTypeVal] = useState<any>("");
  const [patSrcVal, setPatSrcVal] = useState<any>("");
  const [orgDonVal, setOrgDonVal] = useState<any>("");
  const [nokRelVal, setNokRelVal] = useState<any>("");
  const [religionVal, setReligionVal] = useState<any>("");
  const [langVal, setLangVal] = useState<any>("");
  const [maritalStatVal, setMaritalStatVal] = useState<any>("");
  const [searchpopup, setSearchPopup] = useState(false);
  const [nationalIdValues, setNationalIdValues] = useState<any>([]);
  const [disabledPreAdd, setDisabledPreAdd] = useState(false);
  const [nationalIdVal, setNationalIdVal] = useState<any>({
    value: "ADN",
    label: "Adhaar number",
  });
  const [loading, setLoading] = useState(false);
  const [openAcc, setOpenAcc] = React.useState(0);
  const [openAcc1, setOpenAcc1] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);

  const headers = {
    serviceEntityId:
      typeof window !== "undefined"
        ? JSON.parse(getLocalItem("loginResponse") ?? "").serviceEntityId
        : null,
    locationId:
      typeof window !== "undefined"
        ? JSON.parse(getLocalItem("loginResponse") ?? "").locationId
        : null,
    "Access-Control-Allow-Origin": "*",
  };

  const handleOpenAcc = (value: any) =>
    setOpenAcc(openAcc === value ? 0 : value);
  const handleOpenAcc1 = (value: any) =>
    setOpenAcc1(openAcc1 === value ? 0 : value);

  const handleDateChange = (e: any) => {
    setSelectedDate(e);
    let calculateAge = CalculateAge(e);
    let ageVal =
      calculateAge.years +
      " Years," +
      calculateAge.months +
      " Months and " +
      calculateAge.days +
      " Days";
    setAgeValue(ageVal);
  };

  const handleChangeForPatientCategory = (event: any) => {
    setPatCalVal(event);
    patientCategoryData.map((data: any) => {
      if (event.value === data.value) {
        const transformedData = data.output.map((item: any) => ({
          value: item.code,
          label: item.desc,
        }));
        setPatientTypeDropDown(transformedData);
      }
    });
  };

  const handleChangeCheckBox = (e: any) => {
    if (e.target.name === "copyAddress") {
      setCopyAddress(e.target.checked);
      if (e.target.checked === true) {
        setDisabledPreAdd(true);
        setValue("mailPincode", getValues("permPincode"));
        setValue("mailStreet", getValues("permStreet"));
        setValue("mailLocation", getValues("permLocation"));
        setValue("mailCity", getValues("permCity"));
        setValue("mailCountryId", getValues("permCountryId"));
        setValue("mailStateId", getValues("permStateId"));
        setValue("mailDistrictId", getValues("permDistrictId"));
      } else {
        setDisabledPreAdd(false);
        setValue("mailPincode", "");
        setValue("mailStreet", "");
        setValue("mailLocation", "");
        setValue("mailCity", "");
        setValue("mailCountryId", "");
        setValue("mailStateId", "");
        setValue("mailDistrictId", "");
      }
    }
  };

  const [storeData, setStoreData] = useState<any>();
  const onSubmit = (data: any) => {
    let profileValues = {
      patientImageDocumentId: null,
      patImgDocuDesId: null,
      fileName: profilePic.name,
      fileType: profilePic.type || "image/jpeg",
      imgStr: profileImage,
      fileSize: profilePic.size,
      masterPatDocumentTbl: {
        patDocumentId: 1,
        patDocumentDesc: null,
        patDocumentCode: null,
        statusFlag: null,
      },
      documentId: "PROFILE_PIC",
      opdEncounterId: null,
      patientId: patientId === "0" ? null : parseInt(patientId),
      statusFlag: 1,
      patientImageDocumentTblList: null,
      transientImageDocuDtoCollection: null,
      imagesDocument: null,
      generatedDate: null,
    };
    let fullName: string =
      data.firstName + " " + `${data.middleName?data.middleName:""}` + " " + data.lastName;
    fullName = fullName.replace(/\s+/g, " ").trim();
    let postObj = {
      patientId: patientId === "0" ? null : parseInt(patientId),
      isTemp: 0,
      apptNumber:appointmentNum!="0"?appointmentNum:null,
      isOpAppointment:appointmentNum!="0"?true:false,
      patientRegId: null,
      transactionBy: null,
      prefix: null,
      ageOfPatient: ageValue,
      title: null,
      titleDesc: null,
      firstName: data.firstName,
      middleName: data.middleName?data.middleName:"",
      lastName: data.lastName,
      fullName: fullName,
      gender: genderVal?.value,
      genderDesc: genderVal?.label,
      dateOfBirth: selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      bloodGroup: null,
      bloodGroupDesc: null,
      nationalIdType: nationalIdVal?.value,
      nationalIdTypeDesc: nationalIdVal?.label,
      nationality: null,
      patientType: patTypeVal?.value,
      patientTypeDesc: patTypeVal?.label,
      primaryContactNum: data.primaryContactNum,
      nationalIdNo: data.nationalIdNum,
      emergencyContactNum: data.emergencyContactNum,
      emailId: data.emailId,
      patientCategory: patCalVal?.value,
      patientCategoryDesc: patCalVal?.label,
      patRegisTypeDesc: null,
      patientSource: patSrcVal?.value,
      patientSourceDesc: patSrcVal?.label,
      ambulance: null,
      statusFlag: 1,
      additionalDetailsFlag: 0,

      transientImageDocuDto: profileImage !== "" ? profileValues : null,
      transientPatientAddressTbl: {
        patAddrId: null,
        mailStreet: data.mailStreet,
        mailCity: data.mailCity,
        mailPincode: data.mailPincode,
        mailLocation: data.mailLocation,
        mailHsno: "",
        district: data.mailDistrictId,
        state: data.mailStateId,
        country: data.mailCountryId,
        permaHsno: "",
        permDistrict: data.permDistrictId,
        permState: data.permStateId,
        permCountry: data.permCountryId,
        permLocation: data.permLocation,
        isPermaAddr: copyAddress ? 1 : 0,
        permStreet: data.permStreet,
        permCity: data.permCity,
        permPincode: data.permPincode,
      },
      patientAddressTbl: null,
      patRegisTypeId: null,
      prefixId: null,
      referalSourceDesc: null,
      organDonor: orgDonVal?.value,
      healthId: data.healthId,
      abhaAddress: data.healthIdAddress,
      aadharNo: null,
      masterhospitalLocationTbl: null,
      generatedDate: null,
      updatedDate: null,
      version: null,
      serviceEntityId: headers.serviceEntityId,
      locationId: headers.locationId,
      generatedId: null,
      generatedBy: null,
      ipAddress: null,
      updatedBy: null,
      patientNationalDtlsTbl: nationalIdValues,
      registrationdate: selectedDate1
        ? moment(selectedDate1).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      fatherName: data.fatherName,
      motherName: data.motherName,
      secondaryContactNo: data.secondaryContactNo,
      nokRelationCode: nokRelVal ? nokRelVal.value : "",
      nokRelationDesc: nokRelVal ? nokRelVal.label : "",
      nextOfKinName: data.nextofkinName,
      nokContact: data.nokContact,
      religion: religionVal ? religionVal.value : "",
      religionDesc: religionVal ? religionVal.label : "",
      language: langVal ? langVal.value : "",
      languageDesc: langVal ? langVal.label : "",
      maritalStatus: maritalStatVal ? maritalStatVal.value : "",
      maritalStatusDesc: maritalStatVal ? maritalStatVal.label : "",
      spouseName: data.spouseName,
      patSourceName: data.patSourceName,
      patSourceEmail: data.patSourceEmail,
      patSourceAddress: data.patSourceAddress,
      isAlive: patientCondition,
    };

    if (patientId === "0") {
      setOpen(true);
      setStoreData(postObj);
    } else {
      setOpen(false);
      setStoreData("");
      services
        .create(
          patientId === "0" ? saveNormalRegistration : updatePatient,
          postObj
        )
        .then((response) => {
          setLoading(false);
          toast.success(
            `${patientId === "0"
              ? "Saved Successfully"
              : "Updated successfully!!"
            }`
          );
          setIsUpdateMobDisabled(false)
          // router.push(`/patient/${patientId}/patient-Registration`)
        })
        .catch((err: any) => {
          if (err.message) {
            toast.error("Please try after sometime");
          }
          setLoading(false);
          console.log(err.message);
        });
    }
  };
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleProfileUpload = async (e: any) => {
    let image: any = await toBase64(e.target.files[0]);
    setProfileImage(image);
    setProfilePic(e.target.files[0]);
  };

  const handlePermPincode = (e: any) => {
    if (e.target.value?.length == 6) {
      services
        .get(getConfigData + "Pincode/0/" + e.target.value)
        .then((response) => {
          setPincodeResponse(response.data.configData);
          setValue("permCountryId", response.data.configData.output1[0].desc);
          setValue("permDistrictId", response.data.configData.output2[0].desc);
          setValue("permStateId", response.data.configData.output3[0].desc);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleMailPincode = (e: any) => {
    if (e.target.value?.length == 6 && copyAddress == false) {
      services
        .get(getConfigData + "Pincode/0/" + e.target.value)
        .then((response) => {
          setValue("mailCountryId", response.data.configData.output1[0].desc);
          setValue("mailDistrictId", response.data.configData.output2[0].desc);
          setValue("mailStateId", response.data.configData.output3[0].desc);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (copyAddress == true) {
      setValue("mailCountryId", pincodeResponse.output1[0].desc);
      setValue("mailDistrictId", pincodeResponse.output2[0].desc);
      setValue("mailStateId", pincodeResponse.output3[0].desc);
    }
  };

  const organList: any = [
    {
      label: "Yes",
      value: "Yes",
    },
    {
      label: "No",
      value: "No",
    },
  ];

  // const PrintRecord = () => { };

  const clearForm = () => {
    reset();
    setKey((k) => k + 90);
    setProfileImage("");
    setSelectedDate(moment());
    setGenderVal("");
    setPatCalVal("");
    setPatTypeVal("");
    setPatSrcVal("");
    setOrgDonVal("");
    setNationalIdVal("");
    setNokRelVal("");
    setReligionVal("");
    setLangVal("");
    setMaritalStatVal("");
    setCopyAddress(false);
    setNationalIdValues([]);
    setAgeValue("");
    router.replace("/patient/0/0/patient-Registration");
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const generateSearchP = () => {
    setSearchPopup(true);
  };
  const {appointmentNum} = useParams();
  const getAppointMentDetails=()=>{
    services.get(getAppointmentDetailsByApptNo + appointmentNum).then((response)=>{
      let data=response.data
      setValue("firstName", data.firstName);
      setValue("middleName", data.middleName);
      setValue("lastName", data.lastName);
      setValue("primaryContactNum", data.mobile);
      setSelectedDate(moment(data.dob))
      setAgeValue(data.age)
      setGenderVal({value:data.gender,label:data.gender})
    }).catch((err)=>{
      
    })
  }
  useEffect(()=>{
    if(appointmentNum!='0'){
      getAppointMentDetails()
    }
  },[])
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "sno",
      width: 100,
      headerClassName: "GridColDef-header",
    },
    {
      field: "nationalIdDesc",
      headerName: "Identifier Type ID",
      width: 400,
      headerClassName: "GridColDef-header",
    },

    {
      field: "nationalIdNo",
      headerName: "National Id No",
      width: 300,
      headerClassName: "GridColDef-header",
      renderCell: (params: any) => (
        <>
          {params.row.nationalIdNo.substring(0, 8).replace(/./g, "* ") +
            params.row.nationalIdNo.substring(8)}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              DeleteRow(params.row);
            }}
          >
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </>
      ),
    },
  ];

  const DeleteRow = (row: any) => {
    const updatedRows = nationalIdValues.filter(
      (dataRow: any) => dataRow.sno !== row.sno
    );
    setNationalIdValues(updatedRows);
  };
  const router = useRouter();
  const handelNewEncounter = () => {
    if (newMrnNo !== "") {
      setLocalItem("mrnNumber", newMrnNo);
    }
   const appNo=appointmentNum!='0'?appointmentNum:'0'
    router.push(`/encounter/${patientId}/0/${appNo}/outpatient-encounter`);
  };

  const handleNationalIdValues = () => {
    if (getValues("nationalIdNum")?.length == 0) {
      toast.warning("Please add some values");
    } else if (getValues("nationalIdNum")?.length > 3) {
      const newObj = {
        sno: nationalIdValues?.length + 1,
        nationalIdCode: nationalIdVal.value,
        nationalIdDesc: nationalIdVal.label,
        value: getValues("nationalIdNum"),
        nationalIdNo: getValues("nationalIdNum"), //.substring(0, 8).replace(/./g, '* ') + getValues("nationalIdNum").substring(8),
      };
      setNationalIdValues((prevData: any) => [...prevData, newObj]);
      setValue("nationalIdNum", "");
    }
  };

  const fetchData = async () => {
    try {
      let details: any = await services.get(getPatientDetailsById + patientId);
      setPatientCondition(details.data.isAlive ? details.data.isAlive : true);
      setCheck(details.data.patData);
      setNewMrnNo(details.data.mrn);
      setLocalItem("fullName", details.data.patData?.fullName);
      setGenderVal({
        ...genderVal,
        value: details?.data?.patData?.gender,
        label: details?.data?.patData?.genderDesc,
      });
      setPatCalVal({
        ...patCalVal,
        value: details?.data?.patData?.patientCategory,
        label: details?.data?.patData?.patientCategoryDesc,
      });
      setPatTypeVal({
        ...patTypeVal,
        value: details?.data?.patData?.patientType,
        label: details?.data?.patData?.patientTypeDesc,
      });
      setNokRelVal({
        ...nokRelVal,
        value: details?.data?.patData?.nokRelationCode,
        label: details?.data?.patData?.nokRelationDesc,
      });
      setReligionVal({
        ...religionVal,
        value: details?.data?.patData?.religion,
        label: details?.data?.patData?.religionDesc,
      });
      setLangVal({
        ...langVal,
        value: details?.data?.patData?.language,
        label: details?.data?.patData?.languageDesc,
      });
      setMaritalStatVal({
        ...maritalStatVal,
        value: details?.data?.patData?.maritalStatus,
        label: details?.data?.patData?.maritalStatusDesc,
      });
      if (details.data.patData.patientType != null) {
        let output: any = patientCategoryData.map((data: any, index: any) => {
          let getResut = data.output.map((list: any) => {
            return list;
          });
          return {
            value: getResut[index].code,
            label: getResut[index].desc,
          };
        });
        setPatientTypeDropDown(output);
      }
      setPatSrcVal({
        ...patSrcVal,
        value: details?.data?.patData?.patientSource,
        label: details?.data?.patData?.patientSourceDesc,
      });

      let nationalIdData = details.data.patData?.patientNationalDtlsTbl?.map(
        (item: any, index: any) => ({
          ...item,
          sno: index + 1,
        })
      );
      setNationalIdValues(nationalIdData == undefined ? [] : nationalIdData);
      let organListResp = organList.filter(
        (data: any) => data.value === details.data.patData?.organDonor
      )[0];
      setOrgDonVal(organListResp);
      setValue("patientId", details?.data?.patientId);
      setSelectedDate1(moment(details?.data?.generatedDate));
      setValue("firstName", details?.data?.patData?.firstName);
      setValue("lastName", details?.data?.patData?.lastName);
      setValue("middleName", details?.data?.patData?.middleName);
      setSelectedDate(moment(details?.data?.patData?.dateOfBirth));
      setAgeValue(details.data.patData.ageOfPatient);
      setValue("fatherName", details?.data?.patData?.fatherName);
      setValue("motherName", details?.data?.patData?.motherName);
      setValue("primaryContactNum", details?.data?.patData?.primaryContactNum);
      setValue(
        "emergencyContactNum",
        details?.data?.patData?.emergencyContactNum
      );
      setValue("emailId", details?.data?.patData?.emailId);
      setValue("healthId", details?.data?.patData?.healthId);
      setValue(
        "healthIdAddress",
        details.data.patData.healthIdAddress
          ? details.data.patData.healthIdAddress
          : details.data.abhaAddress
      );
      setValue(
        "mailPincode",
        details?.data?.patData?.transientPatientAddressTbl?.mailPincode
      );
      setValue(
        "permPincode",
        details?.data?.patData?.transientPatientAddressTbl?.permPincode
      );
      handlePermPincode({
        target: {
          name: "permPincode",
          value: getValues().permPincode,
        },
      });
      setValue(
        "permaHsno",
        details?.data?.patData?.transientPatientAddressTbl?.permaHsno
      );
      setValue(
        "permStreet",
        details?.data?.patData?.transientPatientAddressTbl?.permStreet
      );
      setValue(
        "permCity",
        details?.data?.patData?.transientPatientAddressTbl?.permCity
      );
      setValue(
        "permDistrictId",
        details?.data?.patData?.transientPatientAddressTbl?.permDistrict
      );
      setValue(
        "permStateId",
        details?.data?.patData?.transientPatientAddressTbl?.permState
      );
      setValue(
        "permCountryId",
        details?.data?.patData?.transientPatientAddressTbl?.permCountry
      );
      setValue(
        "permLocation",
        details?.data?.patData?.transientPatientAddressTbl?.permLocation
      );
      setValue(
        "mailHsno",
        details?.data?.patData?.transientPatientAddressTbl?.mailHsno
      );
      setValue(
        "mailStreet",
        details?.data?.patData?.transientPatientAddressTbl?.mailStreet
      );
      setValue(
        "mailCity",
        details?.data?.patData?.transientPatientAddressTbl?.mailCity
      );
      setValue(
        "mailLocation",
        details?.data?.patData?.transientPatientAddressTbl?.mailLocation
      );
      setValue(
        "mailDistrictId",
        details?.data?.patData?.transientPatientAddressTbl?.district
      );
      setValue(
        "mailStateId",
        details?.data?.patData?.transientPatientAddressTbl?.state
      );
      setValue(
        "mailCountryId",
        details?.data?.patData?.transientPatientAddressTbl?.country
      );
      setValue("nokContact", details?.data?.patData?.nokContact);
      setValue("nextofkinName", details?.data?.patData?.nextOfKinName);
      setValue(
        "secondaryContactNo",
        details?.data?.patData?.secondaryContactNo
      );
      setValue("spouseName", details?.data?.patData?.spouseName);
      setValue("patSourceName", details?.data?.patData?.patSourceName);
      setValue("patSourceEmail", details?.data?.patData?.patSourceEmail);
      setValue("patSourceAddress", details?.data?.patData?.patSourceAddress);
      if (details?.data?.patData?.transientImageDocuDto?.imgStr !== "") {
        setProfileImage(details?.data?.patData?.transientImageDocuDto?.imgStr);
      } else {
        services
          .get(getPatientImgById + patientId)
          .then((response: any) => {
            setProfileImage(
              "data:image/jpeg;base64," + response.data.imagesDocument
            );
          })
          .catch((error: any) => {
            console.log(error.message);
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
const [proData,setProData]=useState<any>(null)
  useEffect(() => {
    let ProfileData =
    typeof window !== "undefined"
      ? JSON.parse(getLocalItem("profileData")!)
      : null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("profileData");
  }
    if (patientId != "0") {
      if (ProfileData != null) {
        setProData(ProfileData)
        setDisableABHAFields(true);
      }
      fetchData();
      // getAbhaData()
    }else{    
    if (ProfileData != null) {
      setProData(ProfileData)
      console.log("ProData",ProfileData,proData)
      let dob = moment(
        ProfileData.monthOfBirth +
        "-" +
        ProfileData.dayOfBirth +
        "-" +
        ProfileData.yearOfBirth
      );
      handleDateChange(dob);
      if (Object.keys(ProfileData)?.length > 0) {
        setDisableABHAFields(true);
        setValue("firstName", ProfileData.firstName);
        setValue("middleName", ProfileData.middleName);
        setValue("lastName", ProfileData.lastName);
        setValue("permPincode", ProfileData.pincode);
        setValue("healthId", ProfileData.healthIdNumber);
        setValue("healthIdAddress", ProfileData.healthId);
        setNewMrnNo(ProfileData.mrn)
        handlePermPincode({
          target: {
            name: "permPincode",
            value: ProfileData.pincode,
          },
        });
        setValue("emailId", ProfileData.email);
        setValue("primaryContactNum", ProfileData.mobile);
        setProfileImage("data:image/jpeg;base64," + ProfileData.profilePhoto);
      }
    }
  }
    const fetchDataAndProcess = async () => {
      setLoading(true);
      try {
        await services
          .get(getConfigData + "MasterPatientCategory-Type" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setPatientCategoryData(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "Gender" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setGenderData(transformedData);
            if (ProfileData?.gender) {
              let genderval = ProfileData.gender === "M" ? "Male" : "Female";
              let genderValue = transformedData.filter(
                (data: any) => data.label === genderval
              )[0];
              setGenderVal(genderValue);
            }
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "MasterPatientSource" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setPatientsourcedropdown(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "NokRelationTbl" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setNokrelationshipdropdown(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "Religion" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setReligiondropdown(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "Language" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setLanguagedropdown(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "Maritalstatus" + "/0", headers)
          .then((response: any) => {
            const transformedData = response.data.configData.map(
              (item: any) => ({
                ...item,
                value: item.code,
                label: item.desc,
              })
            );
            setMaritalstatusdropdown(transformedData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });

        await services
          .get(getConfigData + "IdentifierTypeCode" + "/0", headers)
          .then((response: any) => {
            setNationalIdType(response.data.configData);
          })
          .catch((error: any) => {
            console.log(error.message);
          });
        // if (ProfileData) {
        // } else {
        //   if (patientId != "0") {
        //     await fetchData();
        //   }
        // }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
      }
    };
    fetchDataAndProcess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);
  const [profileData, setProfileData] = useState({
    profilePhoto: "",
    name: "",
    gender: "",
    age: 0,
    address: "",
    mobile: "",
    email: "",
    dayOfBirth: "",
    monthOfBirth: "",
    yearOfBirth: "",
    bloodGroup: "",
    pincode: "",
    healthIdNumber: "",
    healthId: "",
  });
  const getAbhaData=()=>{
    let postObj = {
      "x-token": getLocalItem("abhaLoginToken"),
    };
    services
      .create(getLocalItem("patType") == "1"
        ? getPatientProfileByAadhaarMobile
        : getPatientProfileByAbhaAddress , postObj)
      .then((response) => {
        // removeLocalItem("abhaLoginToken");
        let profileDataResp = response.data;
        setValue("primaryContactNum", profileDataResp.mobile)
        setValue("emailId", profileDataResp.email)
        setProData(profileDataResp)
        setKey1((k)=>k+1)
    })
    .catch((err) => {
      setLoading(false);
      console.log(err.message);
    });
  }
  const [popState, setPopState] = useState(false);
  const [title, setTitle] = useState("Confirm");
  const [popContent, setPopContent] = useState(<></>);
  const [popSize, setPopSize] = useState<any>("md");
  const [key1,setKey1] = useState(Math.random());
  const [isUpdateMobDisabled,setIsUpdateMobDisabled]=useState(true);
  const handleInfoUpdate = (type?: string) => {
    if (type && type == "mobile") {
      setPopState(!popState);
      setTitle("Confirm")
      setPopContent(
        <UpdateNewMobile
          getAbhaData={()=>getAbhaData()}
          setTitle={setTitle}
          setValue={setValue}
          getValues={getValues}
          handleMobileEdit={() => handleInfoUpdate("close")}
          setPopSize={setPopSize}
        />
      );
    } else if (type && type == "email") {
      setPopState(!popState);
      setTitle("Confirm")
      setPopContent(
        <UpdateEmailPopUp
          getAbhaData={getAbhaData}
          setTitle={setTitle}
          handleMobileEdit={() => handleInfoUpdate("close")}
          profileData={proData}
          setPopSize={setPopSize}
        />
      );
    } else {
      setPopState(false);
    }
  };
  return (
    <div className="block">
      <GenerateSearchPatient
        open={searchpopup}
        setOpen={setSearchPopup}
        size={"xl"}
        content={
          <SearchUpdatePatient screen={"patReg"} popupclose={setSearchPopup} />
        }
      />
      {loading ? <Loader /> : ""}
      <div>
        <ReactCommonDialog
          open={open}
          handler={handleOpen}
          popupClose={handleOpen}
          Content={<PatientConsent
            data={storeData}
            setOpen={setOpen}
            patientId={patientId}
            saveRegData={check}
          />}
          size="xl"
        />
         <div>
            <ReactCommonDialog
              dialogtitle={title}
              open={popState}
              popupClose={handleInfoUpdate}
              handler={() => {}}
              size={popSize}
              Content={popContent}
            />
          </div>
      </div>

      <div className="font-bold px-4 md:pt-1 pb-1 mx-auto w-full flex justify-between my-4">
        <h1 className="mt-2">Patient Registration</h1>
        <div className="en-autocomplteGserch flex items-center justify-end ml-4 pl-4">
          <ActionButton
            buttonText=" Advanced Search"
            handleSubmit={generateSearchP}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>

      <div
        id="sectionToPrint"
        key={key}
        className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
      >
        <form>
          <div className="-mx-3 md:flex pt-2">
            <div className="md:w-1/4 px-3">
              <div className="upload-usericon flex items-center flex-col overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt=""
                    className="rounded-full w-30 h-30 object-cover"
                  />
                ) : (
                  <Image
                    src={user}
                    alt="photo"
                    width={120}
                    height={120}
                    className="rounded-full w-30 h-30 object-cover"
                  />
                )}

                <div className="pt-2">
                  <DocumentUpload
                    labelContent="Attach"
                    name="profilePhoto"
                    handleChange={handleProfileUpload}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
                {/* <div className="mt-3">
                  {proData? <ActionButton
                    buttonText={"Update Photo in ABHA"}
                    width="w-[140px] text-white !bg-[#006AC9] text-[11px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={()=>handleInfoUpdate("email")}
                  />:""}
                </div> */}
                <div className="p-2">
                  <div className="flex gap-2 text-gray-700">
                    <div>
                      <Label labelName="Patient Id:" />
                    </div>
                    <div className="ml-7">
                      {patientId !== "0" ? newMrnNo : "-"}
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-700">
                    <div>
                      <Label labelName="Registration Date:" />
                    </div>
                    <div className="ml-2">
                      {patientId !== "0"
                        ? moment(selectedDate1).format("DD-MM-YYYY")
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-700 flex">
                    Status:
                    <div className="ml-5">
                      {patientCondition ? "Alive" : "Deceased"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-3/4 px-2">
              <div className="md:flex py-2 gap-4">
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    label="First Name "
                    name="firstName"
                    watch={watch}
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}
                    required={true}
                    // disabled={disableABHAFields}
                    inputRef={register("firstName", {
                      required: true,
                      maxLength: 20,
                      minLength: 1,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        const properCaseValue = inputValue
                          .split(" ")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ");
                        e.target.value = sanitizeInput(properCaseValue);
                      },
                    })}
                    type="text"
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                  ></Input>
                  {errors.firstName && errors.firstName.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                  {errors.firstName &&
                    errors.firstName.type === "maxLength" && (
                      <ErrorMessage message="Enter upto 20 characters" />
                    )}
                  {errors.firstName &&
                    errors.firstName.type === "minLength" && (
                      <ErrorMessage message="Min Length should be 1" />
                    )}
                  {errors.firstName && errors.firstName.type === "pattern" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="text"
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}                    label="Middle Name"
                    name="middleName"
                    watch={watch}
                    // disabled={disableABHAFields}
                    inputRef={register("middleName", {
                      pattern: /^[a-zA-Z' ]+$/,
                      minLength: 1,
                      maxLength: 20,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        const properCaseValue = inputValue
                          .split(" ")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ");
                        e.target.value = sanitizeInput(properCaseValue);
                      },
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                  ></Input>
                  {errors.middleName &&
                    errors.middleName.type === "pattern" && (
                      <ErrorMessage message={"Please Enter Valid Name!!"} />
                    )}
                  {errors.middleName &&
                    errors.middleName.type === "maxLength" && (
                      <ErrorMessage message="Max Length should be 20" />
                    )}
                  {errors.middleName &&
                    errors.middleName.type === "minLength" && (
                      <ErrorMessage message="Min Length should be 3" />
                    )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    label="Last Name "
                    name="lastName"
                    required={true}
                    watch={watch}
                    // disabled={disableABHAFields}
                    inputRef={register("lastName", {
                      required: true,
                      pattern: /^[a-zA-Z' ]+$/,
                      minLength: 1,
                      maxLength: 20,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        const properCaseValue = inputValue
                          .split(" ")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ");
                        e.target.value = sanitizeInput(properCaseValue);
                      },
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1] rounded-md pointer-events-none' : ''}`}                  ></Input>
                  {errors.lastName && errors.lastName.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                  {errors.lastName && errors.lastName.type === "pattern" && (
                    <ErrorMessage message="Please Enter Valid Name!!" />
                  )}
                  {errors.lastName && errors.lastName.type === "maxLength" && (
                    <ErrorMessage message="Max Length should be 20" />
                  )}
                  {errors.lastName && errors.lastName.type === "minLength" && (
                    <ErrorMessage message="Min Length should be 1" />
                  )}
                </div>
                <div className="relative md:w-1/4 my-1 mb-0 my-select">
                  <Select
                    primaryColor="blue"
                    placeholder="Gender *"
                    options={genderData}
                    isDisabled={disableABHAFields}
                    value={genderVal}
                    onChange={(e: any) => {
                      setGenderVal(e);
                    }}
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
                        `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                        }`,
                    }}
                  />
                  <label
                    style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                    className={`${genderVal?.label !== undefined
                      ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                      : "text-sm opacity-0 top-10"
                      } 
                                                                                                          truncate 
                                                                                                          cursor-default 
                                                                                                          select-none  
                                                                                                          absolute transition-all
                                                                                                         `}
                  >
                    Gender
                  </label>
                  {errors.genderId && errors.genderId.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                </div>
              </div>
              <div className="md:flex py-2 gap-4">
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="text"
                    label="ABHA Number"
                    name="healthId"
                    // disabled={disableABHAFields}
                    watch={watch}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;

                      if (/^[0-9-]$/.test(e.key)) {
                        if (
                          e.target.value.length === 2 ||
                          e.target.value.length === 7 ||
                          e.target.value.length === 12
                        ) {
                          e.target.value = e.target.value + "-";
                        }
                        if (e.target.value.length > 16) {
                          e.preventDefault();
                        }
                      } else {
                        // Prevent entry of alphabets and symbols
                        e.preventDefault();
                      }
                    }}
                    inputRef={register("healthId", {
                      required: false,
                      maxLength: 20,
                      pattern: /^[0-9 -]+$/,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}                  ></Input>
                  {errors.healthId && errors.healthId.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                  {errors.healthId && errors.healthId.type === "maxLength" && (
                    <ErrorMessage message="Please enter a valid ABHA Number" />
                  )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="text"
                    label="ABHA Address"
                    name="healthIdAddress"
                    watch={watch}
                    // disabled={disableABHAFields}
                    inputRef={register("healthIdAddress", {
                      required: false,
                      maxLength: 50,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}
                  ></Input>
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <DateInput
                    label="Date Of Birth"
                    value={selectedDate}
                    onChange={handleDateChange}
                    disableFuture={true}
                    disabled={disableABHAFields}
                    className={`relative w-full h-10 !rounded-[8px] cust-date-control ${disableABHAFields ? ' h-10 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}
                  />
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    label="Age"
                    // disabled={disableABHAFields}
                    name="ageOfPatient"
                    watch={watch}
                    value={ageValue}
                    inputRef={register("ageOfPatient", {
                      required: false,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    className={`mb-6 ${disableABHAFields ? ' h-11 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none' : ''}`}
                  ></Input>
                </div>
              </div>
              {proData?
              <div className="grid grid-cols-4 gap-4">
                <div className=" my-1 h-10 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none">
                  <Input
                    label="ABHA registered mobile"
                    value={proData?.mobile}
                    className="mb-6"
                  ></Input>
                </div>
                <div className="my-1 h-10 mb-0 !bg-[#ECEFF1]  rounded-md pointer-events-none">
                  <Input
                    value={proData?.email}
                    label="ABHA registered email"
                    className="mb-6 bg-blue-gray-100"
                  ></Input>
                </div>
                <div className=" my-1 mb-0">
                    <ActionButton
                    buttonText={"Update Mobile / Email in ABHA"}
                    width="w-full text-white !bg-[#006AC9] text-[12px] h-[42px] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={()=>handleInfoUpdate("mobile")}
                    disabled={isUpdateMobDisabled}
                  />
                </div>
                {/* <div className=" my-1 mb-0">
                    <ActionButton
                    buttonText={"Update Email / Photo in ABHA"}
                    width="w-full text-white !bg-[#006AC9] text-[12px] h-[42px] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={()=>handleInfoUpdate("email")}
                  />
                </div> */}
              </div>:""}
              <div key={key1} className="md:flex py-2 gap-4">
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="number"
                    name="primaryContactNum"
                    watch={watch}
                    inputRef={register("primaryContactNum", {
                      required: true,
                    })}
                    maxLength={10}
                    label="Primary Contact Number *"
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (e.target.value.length > 9) {
                        e.preventDefault();
                      }
                    }}
                    className="mb-6"
                  ></Input>
                  {errors.primaryContactNum && errors.primaryContactNum.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    label="Email"
                    type="text"
                    name="emailId"
                    watch={watch}
                    inputRef={register("emailId", {
                      required: false,
                      pattern: emailPattern,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    className="mb-6"
                  ></Input>

                  {errors.emailId && errors.emailId.type === "pattern" && (
                    <div className="text-xs mt-1 ml-1 text-red-500">
                      <ErrorMessage message="Please Enter valid Email !!" />
                    </div>
                  )}
                  {errors.emailId && errors.emailId.type === "maxLength" && (
                    <ErrorMessage message="Max Length should be 60" />
                  )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="text"
                    label="Father Name"
                    name="fatherName"
                    watch={watch}
                    inputRef={register("fatherName", {
                      pattern: /^[a-zA-Z' ]+$/,
                      minLength: 3,
                      maxLength: 40,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        const properCaseValue = inputValue
                          .split(" ")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ");
                        e.target.value = sanitizeInput(properCaseValue);
                      },
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                    className="mb-6"
                  ></Input>
                  {errors.fatherName && errors.fatherName.type === "pattern" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                  {errors.fatherName && errors.fatherName.type === "minLength" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                  {errors.fatherName && errors.fatherName.type === "maxLength" && (
                    <ErrorMessage message={"Please Enter upto 40 characters!!"} />
                  )}
                </div>
                <div className="md:w-1/4 my-1 mb-0">
                  <Input
                    type="text"
                    label="Mother Name"
                    name="motherName"
                    watch={watch}
                    inputRef={register("motherName", {
                      pattern: /^[a-zA-Z' ]+$/,
                      minLength: 3,
                      maxLength: 40,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        const properCaseValue = inputValue
                          .split(" ")
                          .map(
                            (word: any) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ");
                        e.target.value = sanitizeInput(properCaseValue);
                      },
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                    className="mb-6"
                  ></Input>

                  {errors.motherName && errors.motherName.type === "pattern" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                  {errors.motherName && errors.motherName.type === "minLength" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                  {errors.motherName && errors.motherName.type === "maxLength" && (
                    <ErrorMessage message={"Please Enter Upto 40 Characters!!"} />
                  )}
                </div>
              </div>
              <div className="md:flex py-2 gap-4">
                <div className="md:w-1/5 my-1 mb-0">
                  <Input
                    type="number"
                    label="Emergency Contact No"
                    autoComplete="off"
                    name="emergencyContactNum"
                    watch={watch}
                    inputRef={register("emergencyContactNum", {
                      required: false,
                      maxLength: 10,
                      minLength: 10,
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (e.target.value.length > 9) {
                        e.preventDefault();
                      }
                    }}
                    className="mb-6"
                    containerProps={{
                      className: "!min-w-0"
                    }}
                  ></Input>
                  {errors.emergencyContactNum &&
                    errors.emergencyContactNum.type === "maxLength" && (
                      <ErrorMessage message="Please enter 10 digit number" />
                    )}
                  {errors.emergencyContactNum &&
                    errors.emergencyContactNum.type === "minLength" && (
                      <ErrorMessage message="Please enter 10 digit number" />
                    )}
                </div>
                <div className="relative md:w-1/5 my-1 mb-0 my-select">
                  <Select
                    primaryColor="blue"
                    placeholder="Patient Category *"
                    options={patientCategoryData}
                    value={patCalVal}
                    onChange={handleChangeForPatientCategory}
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
                        `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                        }`,
                    }}
                  />
                  <label
                    style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                    className={`${patCalVal?.label !== undefined
                      ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
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
                  {errors.patientCategoryId &&
                    errors.patientCategoryId.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
                <div className="relative md:w-1/5 my-1 mb-0 my-select">
                  <Select
                    primaryColor="blue"
                    placeholder="Patient Type *"
                    options={patientTypeDropDown}
                    value={patTypeVal}
                    onChange={(e: any) => {
                      setPatTypeVal(e);
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
                        `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                        }`,
                    }}
                  />
                  <label
                    style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                    className={`${patTypeVal?.label !== undefined
                      ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                      : "text-sm opacity-0 top-10"
                      } 
                                                                                              truncate 
                                                                                              cursor-default 
                                                                                              select-none  
                                                                                              absolute transition-all
                                                                                             `}
                  >
                    Patient Type
                  </label>
                  {errors.patientTypeDesc &&
                    errors.patientTypeDesc.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
                <div className="relative md:w-1/5 my-1 mb-0 my-select">
                  <Select
                    primaryColor="blue"
                    placeholder="Patient Source *"
                    options={patientsourcedropdown}
                    value={patSrcVal}
                    onChange={(e: any) => {
                      setPatSrcVal(e);
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
                        `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                        }`,
                    }}
                  />
                  <label
                    style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                    className={`${patSrcVal?.label !== undefined
                      ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                      : "text-sm opacity-0 top-10"
                      } 
                                                                                              truncate 
                                                                                              cursor-default 
                                                                                              select-none  
                                                                                              absolute transition-all
                                                                                             `}
                  >
                    Patient Source
                  </label>
                  {errors.patientSourceId &&
                    errors.patientSourceId.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
                <div className="relative md:w-1/5 my-1 mb-0 my-select">
                  <Select
                    primaryColor="blue"
                    placeholder="Organ Donor *"
                    options={organList}
                    value={orgDonVal}
                    onChange={(e: any) => {
                      setOrgDonVal(e);
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
                        `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                          ? `text-white bg-blue-500`
                          : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                        }`,
                    }}
                  />
                  <label
                    style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                    className={`${orgDonVal?.label !== undefined
                      ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                      : "text-sm opacity-0 top-10"
                      } 
                                                                                              truncate 
                                                                                              cursor-default 
                                                                                              select-none  
                                                                                              absolute transition-all
                                                                                             `}
                  >
                    Organ Donor
                  </label>
                  {errors.organDonor && errors.organDonor.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 border border-gray-300 p-3 overflow-y-visible">
            <div className=" md:flex py-2 items-center gap-4 mb-3">
              <div className="relative md:w-1/4 my-select">
                <Select
                  primaryColor="blue"
                  placeholder="National ID Type *"
                  options={nationalIdType}
                  value={nationalIdVal}
                  isSearchable={true}
                  onChange={(e: any) => {
                    setNationalIdVal(e);
                  }}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                            duration-300 focus:outline-none 
                                                            ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: `absolute !text-start  z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700`,
                    listItem: ({ isSelected }: any) =>
                      `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `!text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${nationalIdVal?.label !== undefined
                    ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                >
                  National ID Type
                </label>
                {errors.nationalIdVal &&
                  errors.nationalIdVal.type === "required" && (
                    <ErrorMessage message="Required !!" />
                  )}
              </div>
              <div className="md:w-1/4  relative">
                <Input
                  label="National ID No"
                  name="nationalIdNum"
                  autoComplete="off"
                  watch={watch}
                  inputRef={register("nationalIdNum", {
                    required: false,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  type={showPassword ? "password" : "number"}
                  handleKeyPress={(e: any) => {
                    if (nationalIdVal.value === "ADN") {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (e.target.value.length === 12) {
                        setValue("nationalIdNum", e.target.value);
                      }
                      if (e.target.value.length > 11) {
                        e.preventDefault();
                      }
                    } else {
                      setValue("nationalIdNum", e.target.value);
                    }
                  }}
                  className="mb-6"
                />
                <div
                  className="absolute top-2 right-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <VisibilityOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  )}
                </div>
              </div>
              <div className="md:w-1/6">
                <ActionButton
                  buttonText={"ADD"}
                  handleSubmit={handleNationalIdValues}
                  width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              </div>
            </div>
            <div>
              <ReactDatagrid
                rows={nationalIdValues}
                columns={columns}
              />
            </div>
          </div>
          <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
            <h1 style={{ color: "#455a64", fontSize: "1.25rem" }}>
              Present Address
            </h1>
          </div>
          <hr></hr>
          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-2 my-1">
              <Input
                type="number"
                label="Pincode"
                name="permPincode"
                watch={watch}
                inputRef={register("permPincode", {
                  required: true,
                  onChange: handlePermPincode,
                  minLength: 6,
                  maxLength: 6,
                })}
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 5) {
                    e.preventDefault();
                  }
                }}
                className="mb-6"
              ></Input>
              {errors.mailPincode && errors.mailPincode.type === "required" && (
                <ErrorMessage message="Please Enter valid Pincode !!" />
              )}

              {errors.mailPincode &&
                errors.mailPincode.type === "minLength" && (
                  <ErrorMessage message="Please Enter valid Pincode !!" />
                )}
              {errors.mailPincode &&
                errors.mailPincode.type === "maxLength" && (
                  <ErrorMessage message="Please Enter valid Pincode !!" />
                )}
            </div>
            <div className="md:w-1/4 px-2 my-1">
              <Input
                type="text"
                name="permStreet"
                watch={watch}
                inputRef={register("permStreet", {
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    const properCaseValue = inputValue
                      .split(" ")
                      .map(
                        (word: any) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ");
                    e.target.value = sanitizeInput(properCaseValue);
                  },
                })}
                label="House No/ Street Name"
                className="mb-6"
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                    e.preventDefault();
                  }
                }}
              ></Input>
            </div>
            <div className="md:w-1/4 px-2 my-1">
              <Input
                label="Location"
                name="permLocation"
                watch={watch}
                inputRef={register("permLocation", {
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    e.target.value = sanitizeInput(inputValue);
                  },
                })}
                type="text"
                className="mb-6"
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                    e.preventDefault();
                  }
                }}
              ></Input>
            </div>
            <div className="md:w-1/4 px-2 my-1">
              <Input
                label="City"
                name="permCity"
                watch={watch}
                type="text"
                inputRef={register("permCity", {
                  pattern: /^[a-zA-Z]+$/,
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    e.target.value = sanitizeInput(inputValue);
                  },
                })}
                className="mb-6"
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                    e.preventDefault();
                  }
                }}
              ></Input>
            </div>
          </div>
          <div className="-mx-3 md:flex">
            <div className="md:w-1/4 px-2 my-1">
              <Input
                label="District "
                name="permDistrictId"
                watch={watch}
                required={true}
                inputRef={register("permDistrictId", {
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    e.target.value = sanitizeInput(inputValue);
                  },
                })}
                type="text"
                className="mb-6"
              ></Input>

              {errors.permDistrictId &&
                errors.permDistrictId.type === "required" && (
                  <ErrorMessage message="Required !!" />
                )}
            </div>
            <div className="md:w-1/4 px-2 my-1">
              <Input
                label="State "
                name="permStateId"
                watch={watch}
                required={true}
                inputRef={register("permStateId", {
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    e.target.value = sanitizeInput(inputValue);
                  },
                })}
                type="text"
                disable={true}
              // className="mb-6 pointer-events-none !bg-[#eceff1] !border-transparent"
              ></Input>

              {errors.permStateId && errors.permStateId.type === "required" && (
                <ErrorMessage message="Required !!" />
              )}
            </div>
            <div className="md:w-1/4 px-2 my-1">
              <Input
                label="Country "
                name="permCountryId"
                required={true}
                watch={watch}
                inputRef={register("permCountryId", {
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    e.target.value = sanitizeInput(inputValue);
                  },
                })}
                type="text"
              // className="mb-6 pointer-events-none !bg-[#eceff1] !border-transparent"
              ></Input>

              {errors.permCountryId &&
                errors.permCountryId.type === "required" && (
                  <ErrorMessage message="Required !!" />
                )}
            </div>
          </div>

          <Accordion open={openAcc === 1} icon={<Icon id={1} open={openAcc} />}>
            <AccordionHeader
              className="font-semibold px-4 md:pt-3 pb-3 mx-auto w-full"
              onClick={() => handleOpenAcc(1)}
            >
              Permanent Address
            </AccordionHeader>
            <AccordionBody>
              <div className="md:flex py-0">
                <div className="md:w-1/4 px-2 my-1">
                  <Checkbox
                    label="Same As Present Address"
                    handleChange={handleChangeCheckBox}
                    inputRef={register("copyAddress")}
                    checked={copyAddress}
                  />
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    type="number"
                    label="Pincode"
                    name="mailPincode"
                    watch={watch}
                    inputRef={register("mailPincode", {
                      required: false,
                      onChange: handleMailPincode,
                      minLength: 6,
                      maxLength: 6,
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (e.target.value.length > 5) {
                        e.preventDefault();
                      }
                    }}
                    disabled={disabledPreAdd}
                    className="mb-6"
                  ></Input>
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    label="House No/Street Name"
                    name="mailStreet"
                    watch={watch}
                    inputRef={register("mailStreet", {
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    className="mb-6"
                    disabled={disabledPreAdd}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                  ></Input>
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    label="Location"
                    name="mailLocation"
                    inputRef={register("mailLocation", {
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    watch={watch}
                    className="mb-6"
                    disabled={disabledPreAdd}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                  ></Input>
                </div>
              </div>
              <div className="md:flex py-1">
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    type="text"
                    label="City"
                    name="mailCity"
                    watch={watch}
                    inputRef={register("mailCity", {
                      pattern: /^[a-zA-Z]+$/,
                      maxLength: 30,
                      minLength: 2,
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    handleKeyPress={(e: any) => {
                      if (e.key === "Backspace" || e.key === "Delete") return;
                      if (/^[a-zA-Z0-9\/,. -]+$/.test(e.key) === false) {
                        e.preventDefault();
                      }
                    }}
                    disabled={disabledPreAdd}
                    className="mb-6"
                  ></Input>
                  {errors.mailCity && errors.mailCity.type === "pattern" && (
                    <ErrorMessage message="Please Enter valid City !!" />
                  )}
                  {errors.mailCity && errors.mailCity.type === "maxLength" && (
                    <ErrorMessage message="Please Enter valid City !!" />
                  )}
                  {errors.mailCity && errors.mailCity.type === "minLength" && (
                    <ErrorMessage message="Please Enter valid City !!" />
                  )}
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    label="District *"
                    name="mailDistrictId"
                    watch={watch}
                    inputRef={register("mailDistrictId", {
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    className="mb-6"
                    disabled={disabledPreAdd}
                  ></Input>

                  {errors.mailDistrictId &&
                    errors.mailDistrictId.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    label="State *"
                    name="mailStateId"
                    watch={watch}
                    inputRef={register("mailStateId", {
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    className="mb-6"
                    disabled={disabledPreAdd}
                  ></Input>

                  {errors.mailStateId &&
                    errors.mailStateId.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
                <div className="md:w-1/4 px-2 my-1">
                  <Input
                    label="Country *"
                    name="mailCountryId"
                    watch={watch}
                    inputRef={register("mailCountryId", {
                      onChange: (e) => {
                        const inputValue = e.target.value;
                        e.target.value = sanitizeInput(inputValue);
                      },
                    })}
                    type="text"
                    className="mb-6"
                    disabled={disabledPreAdd}
                  ></Input>

                  {errors.mailCountryId &&
                    errors.mailCountryId.type === "required" && (
                      <ErrorMessage message="Required !!" />
                    )}
                </div>
              </div>
            </AccordionBody>
          </Accordion>
        </form>

        <Accordion open={openAcc1 === 1} icon={<Icon id={1} open={openAcc1} />}>
          <AccordionHeader
            className="font-semibold px-4 md:pt-3 pb-3 mx-auto w-full"
            onClick={() => handleOpenAcc1(1)}
          >
            Additional Details
          </AccordionHeader>
          <AccordionBody>
            <div className="md:flex py-0">
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  label="NOK Contact"
                  name="nokContact"
                  watch={watch}
                  inputRef={register("nokContact", {
                    minLength: 10,
                    maxLength: 10,
                  })}
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (e.target.value.length > 9) {
                      e.preventDefault();
                    }
                  }}
                  type="number"
                  className="mb-6"
                ></Input>
                {errors.nokContact &&
                  errors.nokContact.type === "maxLength" && (
                    <ErrorMessage message="Please enter 10 digit number" />
                  )}
                {errors.nokContact &&
                  errors.nokContact.type === "minLength" && (
                    <ErrorMessage message="Please enter 10 digit number" />
                  )}
              </div>
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  type="text"
                  label="Next Of Kin(NOK)name"
                  name="nextofkinName"
                  watch={watch}
                  inputRef={register("nextofkinName", {
                    pattern: /^[a-zA-Z' ]+$/,
                    maxLength: 40,
                    minLength: 2,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                      e.preventDefault();
                    }
                  }}
                  className="mb-6"
                ></Input>
                {errors.nextofkinName &&
                  errors.nextofkinName.type === "pattern" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                {errors.nextofkinName &&
                  errors.nextofkinName.type === "maxLength" && (
                    <ErrorMessage message="Please enter upto 40 characters" />
                  )}
                {errors.nextofkinName &&
                  errors.nextofkinName.type === "minLength" && (
                    <ErrorMessage message="Please enter upto 40 characters" />
                  )}
              </div>
              <div className="relative md:w-1/4 px-2 my-1 my-select">
                <Select
                  primaryColor="blue"
                  placeholder="NOK Relationship"
                  options={nokrelationshipdropdown}
                  value={nokRelVal}
                  onChange={(e: any) => {
                    setNokRelVal(e);
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
                      `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${nokRelVal?.label !== undefined
                    ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                >
                  NOK Relationship
                </label>
              </div>
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  label="Secondary contact no"
                  name="secondaryContactNo"
                  watch={watch}
                  type="number"
                  inputRef={register("secondaryContactNo", {
                    minLength: 10,
                    maxLength: 10,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (e.target.value.length > 9) {
                      e.preventDefault();
                    }
                  }}
                  className="mb-6"
                ></Input>
                {errors.secondaryContactNo &&
                  errors.secondaryContactNo.type === "maxLength" && (
                    <ErrorMessage message="Please enter 10 digit Number" />
                  )}
                {errors.secondaryContactNo &&
                  errors.secondaryContactNo.type === "minLength" && (
                    <ErrorMessage message="Please enter 10 digits Number" />
                  )}
              </div>
            </div>
            <div className="md:flex py-2">
              <div className="relative md:w-1/4 px-2 my-1 my-select">
                <Select
                  primaryColor="blue"
                  placeholder="Religion"
                  options={religiondropdown}
                  value={religionVal}
                  onChange={(e: any) => {
                    setReligionVal(e);
                  }}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                duration-300 focus:outline-none 
                                                ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: `absolute !text-start  z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700`,
                    listItem: ({ isSelected }: any) =>
                      `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `!text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${religionVal?.label !== undefined
                    ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                >
                  Religion
                </label>
              </div>
              <div className="relative md:w-1/4 px-2 my-1 my-select">
                <Select
                  primaryColor="blue"
                  placeholder="Language"
                  options={languagedropdown}
                  value={langVal}
                  onChange={(e: any) => {
                    setLangVal(e);
                  }}
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                duration-300 focus:outline-none 
                                                ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: `absolute !text-start  z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700`,
                    listItem: ({ isSelected }: any) =>
                      `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `!text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${langVal?.label !== undefined
                    ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                                                                    truncate 
                                                                                                    cursor-default 
                                                                                                    select-none  
                                                                                                    absolute transition-all
                                                                                                   `}
                >
                  Language
                </label>
              </div>
              <div className="relative md:w-1/4 px-2 my-1 my-select">
                <Select
                  primaryColor="blue"
                  placeholder="Marital Status"
                  options={maritalstatusdropdown}
                  value={maritalStatVal}
                  onChange={(e: any) => {
                    setMaritalStatVal(e);
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
                      `block transition duration-200 px-28 py-2 ml-[-105px] cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${maritalStatVal?.label !== undefined
                    ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                    : "text-sm opacity-0 top-10"
                    } 
truncate 
  cursor-default 
 select-none  
 absolute transition-all
                                                                        `}
                >
                  Marital Status
                </label>
              </div>
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  type="text"
                  label="Spouse Name"
                  name="spouseName"
                  watch={watch}
                  inputRef={register("spouseName", {
                    pattern: /^[a-zA-Z' ]+$/,
                    minLength: 3,
                    maxLength: 40,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                      e.preventDefault();
                    }
                  }}
                  className="mb-6"
                ></Input>
                {errors.spouseName && errors.spouseName.type === "pattern" && (
                  <ErrorMessage message={"Please Enter Valid Name!!"} />
                )}
                {errors.spouseName &&
                  errors.spouseName.type === "minLength" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
                {errors.spouseName &&
                  errors.spouseName.type === "maxLength" && (
                    <ErrorMessage message={"Please Enter upto characters!!"} />
                  )}
              </div>
            </div>

            <div className="md:flex py-0">
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  type="text"
                  label="Pt.Source Name"
                  name="patSourceName"
                  watch={watch}
                  inputRef={register("patSourceName", {
                    pattern: /^[a-zA-Z0-9' ]+$/,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (/^[a-zA-Z\s']$/.test(e.key) === false) {
                      e.preventDefault();
                    }
                  }}
                  className="mb-6"
                ></Input>
                {errors.patSourceName &&
                  errors.patSourceName.type === "pattern" && (
                    <ErrorMessage message={"Please Enter Valid Name!!"} />
                  )}
              </div>
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  type="text"
                  label="Pt Source Email"
                  name="patSourceEmail"
                  watch={watch}
                  inputRef={register("patSourceEmail", {
                    pattern: /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  className="mb-6"
                ></Input>
                {errors.patSourceEmail &&
                  errors.patSourceEmail.type === "pattern" && (
                    <div className="text-xs mt-1 ml-1 text-red-500">
                      <ErrorMessage message="Please Enter valid Email !!" />
                    </div>
                  )}
              </div>
              <div className="md:w-1/4 px-2 my-1">
                <Input
                  type="text"
                  label="Patient Source Address"
                  name="patSourceAddress"
                  watch={watch}
                  inputRef={register("patSourceAddress", {
                    onChange: (e) => {
                      const inputValue = e.target.value;
                      e.target.value = sanitizeInput(inputValue);
                    },
                  })}
                  className="mb-6"
                  // /^[a-zA-Z0-9\/,. ]+$/</div>
                  handleKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (/^[a-zA-Z0-9\/,.\- ]+$/.test(e.key) === false) {
                      e.preventDefault();
                    }
                  }}
                ></Input>
              </div>
            </div>
          </AccordionBody>
        </Accordion>

        <div className="mt-5 flex items-center justify-end gap-4">
          {patientId != "0" ? (
            <>
              <ActionButton
                buttonText={"SHOW CONSENT"}
                handleSubmit={() => setOpen(true)}
                width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </>
          ) : (
            <></>
          )}

          <ActionButton
            buttonText={"NEW ENCOUNTER"}
            handleSubmit={handelNewEncounter}
            width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              patientId === "0" || patientCondition === false ? true : false
            }
          />

          <ActionButton
            buttonText={patientId === "0" ? "REGISTER" : "UPDATE"}
            handleSubmit={handleSubmit(onSubmit)}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />

          {/* <ActionButton
            buttonText="PRINT FORM"
            width="w-full text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={PrintRecord}
          /> */}
          <ActionButton
            buttonText="RESET"
            handleSubmit={clearForm}
            // width="fit-content"
            width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>
    </div>
  );
}