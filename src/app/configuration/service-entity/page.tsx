"use client";
import ActionButton from "@/app/_common/button";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import ServiceEntityForm from "./components/service-entity-form";
import services from "@/app/utilities/services";
import {
  changeStatus,
  createServiceEntity,
  deleteServiceEntity,
  getAllServiceEntity,
  getConfigData,
} from "@/app/utilities/api-urls";
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { getLocalItem } from "@/app/utilities/local";
import DateInput from "@/app/_common/date-input";
import moment from "moment";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Loader from "@/app/_common/loader";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { error } from "console";
import {
  allowOnlyNumbers,
  allowspacepattern,
  alphaNumWithFewSymbols,
  alphaNumWithHyphen,
  gstPattern,
  panNoPattern,
} from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ParameterHeading from "../component/ParameterHeading";
import { Checkbox } from "@mui/material";
import CheckboxMui from "@/app/check-box";

export default function ServiceEntity() {
  const getLabel = (value: any, label: String) => {
    return (
      <label
        style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
        className={`${value?.label !== undefined
          ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
          : "text-sm opacity-0 top-10"
          } 
        truncate 
        cursor-default 
        select-none  
        absolute transition-all
        `}
      >
        {label}
      </label>
    );
  };
  const classSelect = {
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
  };
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = {
    userId: loginResponse?.userId,
    roleId: loginResponse?.roleId,
    employeename: loginResponse?.employeename,
    employeeid: loginResponse?.employeeId,
    "Access-Control-Allow-Origin": "*",
  };
  const myDiv: any = useRef();
  interface ServiceEntityFormData {
    serviceEntityCode: string;
    serviceEntityDesc: string ;
    effectiveStart: any;
    effectiveEnd: any;
    bedCount: string ;
    userCount: string ;
    locationCount: string ;
    licenseType: any;
    serviceEntityType: any;
    serviceEntityTypeDesc: any;
    serviceEntityId: number | null;
    statusFlag: number | null;
    panNo: string;
    gstNo: string;
    billingGstIncluded:number;
    masterAddressTbl: {
      pincodeId: string;
      houseNo: string ;
      location: string ;
      city: string ;
      country: string;
      state: string ;
      district: string;
      mobile: string;
      contactNum: string ;
    };
  }
  const initialState = {
    serviceEntityCode: "",
    serviceEntityDesc: "",
    serviceEntityTypeDesc:"",
    serviceEntityType: null,
    effectiveStart: moment().format("YYYY-MM-DD"),
    effectiveEnd: moment().format("YYYY-MM-DD"),
    bedCount: "",
    userCount: "",
    locationCount: "",
    licenseType: "",
    serviceEntityId: null,
    statusFlag: 1,
    panNo: "",
    gstNo:"",
    billingGstIncluded:loginResponse?.billingGstIncluded,
    masterAddressTbl: {
      pincodeId: "",
      houseNo: "",
      location: "",
      city: "",
      country: "",
      state: "",
      district: "",
      mobile: "",
      contactNum: "",
    },
  };
  const [entityData, setEntityData] = useState<any>([]);
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 30 },
    {
      field: "serviceEntityCode",
      headerName: "Service Entity code",
      width: 150,
    },
    {
      field: "serviceEntityDesc",
      headerName: "Service Entity Description",
      width: 200,
    },
    {
      field: "mobile",
      headerName: "Mobile Number",
      width: 120,
    },
    {
      field: "serviceEntityTypeDesc",
      headerName: "Service Entity Type",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag == 1 ? (
            <button onClick={() => handleEditIcon(params.row)}>
              <PencilIcon className="text-blue-500 w-5 h-5" />
            </button>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag == 1 ? (
            <div
              title="Active"
              onClick={(e: any) => handleIcons(params.row, "flag")}
              className="cursor-pointer"
            >
              <ActiveIcon />
            </div>
          ) : (
            <div
              title="Inactive"
              onClick={(e: any) => handleIcons(params.row, "flag")}
              className="cursor-pointer"
              style={{ cursor: "cursor-pointer" }}
            >
              <InactiveIcon />
            </div>
          )}
        </>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      renderCell: (params: any) => (
        <>
          <div className="flex justify-center items-center">
            <TrashIcon
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => handleIcons(params.row, "delete")}
            />
          </div>
        </>
      ),
    },
  ];
  const [paramData, setParamData] = useState({});
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [popText, setPopText] = useState("");
  const [serviceEntityTypeList, setServiceEntityTypeList] = useState<any[]>([]);
  const [licenceTypeList, setLicenceTypeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isToDateDisabled, setIsToDateDisabled] = useState(true);
  const [actionType, setActionType] = useState("Save");
  const [formData, setFormData] = useState<ServiceEntityFormData>(initialState);
  const getAllEntityData = () => {
    services
      .get(getAllServiceEntity)
      .then((response) => {
        let arr = response.data.body;
        arr.map((item: any, index: number) => {
          item.id = index + 1;
        });
        setEntityData(arr);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const getMasterData = () => {
    services
      .get(getConfigData + "serviceType/0")
      .then((response) => {
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setServiceEntityTypeList(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
    services
      .get(getConfigData + "LicenceType/0")
      .then((response) => {
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setLicenceTypeList(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const [saveupdateLoader, setSaveupdateLoader] = useState<any>(false)
  const onSave = () => {
    if (!formData.serviceEntityCode) {
      toast.error("Please Enter Service Entity Code");
    } else if (!formData.serviceEntityDesc) {
      toast.error("Please Enter Service Entity Description");
    } else if (!formData.masterAddressTbl?.pincodeId&& !allowOnlyNumbers.test(formData.masterAddressTbl?.pincodeId)) {
      toast.error("Please Enter Pin Code");
    } else if (!formData.masterAddressTbl?.city) {
      toast.error("Please Enter City");
    } else if (!formData.masterAddressTbl?.mobile) {
      toast.error("Please Enter Mobile Number");
    } else if (!formData.locationCount) {
      toast.error("Please Enter Location Count");
    } else if (!formData.userCount) {
      toast.error("Please Enter User Count");
    } else if (!formData.bedCount) {
      toast.error("Please Enter Bed Count");
    } else if (!formData.licenseType) {
      toast.error("Please Select License Type");
    } else if (!formData.effectiveStart) {
      toast.error("Please Select From Date");
    } else if (formData.gstNo&&!gstPattern.test(formData.gstNo)) {
      toast.error("Please Enter Valid GST No.");
    } else if (formData.panNo&&!panNoPattern.test(formData.panNo)) {
      toast.error("Please Enter Valid PAN No.");
      //Differece of effective start time and end time should not be zero (as Trial=30days, Standard=1 year, perpetual=10years)
    }else if (moment(formData.effectiveEnd).diff(moment(formData.effectiveStart),'days')===0) {
      toast.error("Please Select From Date");
    }  else {
      let postObj: ServiceEntityFormData = initialState;
      postObj.serviceEntityType = formData.serviceEntityType?.value!;
      postObj.serviceEntityTypeDesc = formData.serviceEntityType?.label!;
      postObj.licenseType = formData.licenseType?.value!;
      postObj.statusFlag = formData.statusFlag!;
      postObj.masterAddressTbl.pincodeId = formData.masterAddressTbl.pincodeId;
      postObj.masterAddressTbl.houseNo = formData.masterAddressTbl.houseNo;
      postObj.masterAddressTbl.location = formData.masterAddressTbl.location;
      postObj.masterAddressTbl.city = formData.masterAddressTbl.city;
      postObj.masterAddressTbl.country = formData.masterAddressTbl.country;
      postObj.masterAddressTbl.contactNum =
        formData.masterAddressTbl.contactNum;
      postObj.masterAddressTbl.state = formData.masterAddressTbl.state;
      postObj.masterAddressTbl.district = formData.masterAddressTbl.district;
      postObj.masterAddressTbl.mobile = formData.masterAddressTbl.mobile;
      postObj.bedCount = formData.bedCount;
      postObj.userCount = formData.userCount;
      postObj.locationCount = formData.locationCount;
      postObj.effectiveStart = formData.effectiveStart;
      postObj.effectiveEnd = formData.effectiveEnd;
      postObj.serviceEntityCode = formData.serviceEntityCode;
      postObj.serviceEntityDesc = formData.serviceEntityDesc;
      postObj.serviceEntityId = formData.serviceEntityId;
      postObj.gstNo = formData.gstNo;
      postObj.panNo = formData.panNo;
      postObj.billingGstIncluded=formData.billingGstIncluded
      setLoading(true);
      setSaveupdateLoader(true);
      services
        .create(createServiceEntity, postObj, headers)
        .then((response) => {
          setLoading(false);
          toast.success("Saved Successfully");
          setIsToDateDisabled(true);
          getAllEntityData();
          setFormData({
            serviceEntityCode: "",
            serviceEntityDesc: "",
            serviceEntityTypeDesc:"",
            serviceEntityType: null,
            effectiveStart: moment().format("YYYY-MM-DD"),
            effectiveEnd: moment().format("YYYY-MM-DD"),
            bedCount: "",
            userCount: "",
            locationCount: "",
            licenseType: "",
            serviceEntityId: null,
            statusFlag: 1,
            panNo: "",
            gstNo:"",
            billingGstIncluded:loginResponse?.billingGstIncluded,
            masterAddressTbl: {
              pincodeId: "",
              houseNo: "",
              location: "",
              city: "",
              country: "",
              state: "",
              district: "",
              mobile: "",
              contactNum: "",
            },
          });
          setActionType("Save");
          setKey1((k:any) => k + 1);
          setSaveupdateLoader(false);
        })
        .catch((err) => {
          setLoading(false);
          if(err.response.data.statusMessage){
            toast.error(err.response.data.statusMessage)
          }else{
            toast.error("Technical Error");
          }
          setTimeout(() => {
            toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
            setSaveupdateLoader(false);
          }, 2000);
        });
    }
  };
  const handleFromDateChange = (e: any, key: any) => {
    setFormData({ ...formData, licenseType: key });
    if (e.value === "LT004") {
      setIsToDateDisabled(false);
    } else {
      setIsToDateDisabled(true);
    }
    if (key && key.value !== "LT004") {
      const filteredData = licenceTypeList.filter(
        (item: any) => item.value == key.value
      )[0];
      setFormData({
        ...formData,
        licenseType: key,
        effectiveStart: moment(e).format("YYYY-MM-DD"),
        effectiveEnd: moment(e)
          .add(filteredData.Days, "days")
          .format("YYYY-MM-DD"),
      });
    } else if (key.value === "LT004") {
      setFormData({
        ...formData,
        licenseType: key,
        effectiveStart: moment(e).format("YYYY-MM-DD"),
      });
      setIsToDateDisabled(false);
    } else {
      toast.error("Please Select Licence Type");
      setFormData({
        ...formData,
        licenseType: key,
        effectiveStart: null,
      });
    }
  };
  const handlePinCodeChange = (e: any) => {
    setFormData({
      ...formData,
      masterAddressTbl: {
        ...formData.masterAddressTbl,
        pincodeId: e.target.value,
      },
    });
    if (e.target.value.length == 6) {
      services
        .get(getConfigData + "Pincode/0/" + e.target.value)
        .then((response) => {
          setFormData({
            ...formData,
            masterAddressTbl: {
              ...formData.masterAddressTbl,
              pincodeId: e.target.value,
              country: response.data.configData.output1[0].desc,
              state: response.data.configData.output3[0].desc,
              district: response.data.configData.output2[0].desc,
            },
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  const handleMasterAddress = (e: any, key: any) => {
    setFormData({
      ...formData,
      masterAddressTbl: {
        ...formData.masterAddressTbl,
        [key]: sanitizeInput(e.target.value)
      },
    });
  };
  const filteredData = (data: any, key: string) => {
    return data.filter((item: any) => item.value == key)[0];
  };
  const [key1, setKey1] = useState(0);
  const handleEditIcon = async (data: ServiceEntityFormData) => {
    if (data.licenseType === "LT004") {
      setIsToDateDisabled(false);
    } else if (data.licenseType !== "LT004") {
      setIsToDateDisabled(true);
    }
    setFormData(initialState);
    data.serviceEntityType = await filteredData(
      serviceEntityTypeList,
      data.serviceEntityType
    );
    data.licenseType = await filteredData(licenceTypeList, data.licenseType);
    setFormData(data);
    setActionType("Update");
    myDiv.current.scrollIntoView({
      behavior: "smooth",
    });
    // getAllEntityData();
  };
  const handleLicenceChange = (e: any) => {
    setFormData({ ...formData, licenseType: e });
    if (e.value === "LT004") {
      setIsToDateDisabled(false);
    } else {
      setIsToDateDisabled(true);
    }
  };
  const handleIcons = (data: any, type: string) => {
    handleOpen();
    setParamData(data);
    setType(type);
    if (type == "flag") {
      setPopText(data.statusFlag == 1 ? "inactive" : "active");
    } else if (type == "delete") {
      setPopText("delete");
    }
  };
  const handleOpen = () => setOpen(!open);
  const handleDelete = (data: any) => {
    setLoading(true);
    services
      .create(deleteServiceEntity ,{serviceEntityId:data.serviceEntityId})
      .then((res) => {
        setLoading(false);
        toast.success("Service Entity Deleted Successfully");
        handleOpen();
        getAllEntityData();
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical Error");
        handleOpen();
      });
  };
  const handleYesButton = (data: any, type: string) => {
    if (type === "flag") {
      handleStatusFlag(data);
    } else if (type === "delete") {
      handleDelete(data);
    }
  };
  const handleStatusFlag = (data: any) => {
    let flag = data.statusFlag == 1 ? 0 : 1;
    setLoading(true);
    services
      .get(changeStatus + data.serviceEntityId + "/" + flag)
      .then((response) => {
        setLoading(false);
        toast.success(
          `Successfully ${data.statusFlag == 0 ? "Activated" : "Inactivated"
          } Service Entity`
        );
        handleOpen();
        getAllEntityData();
      })
      .catch((error) => {
        handleOpen();
        setLoading(false);
        toast.error("Technical Error");
      });
  };
  const handleCancel = () => {
    setIsToDateDisabled(true);
    setFormData(initialState);
    setActionType("Save");
  };
  useEffect(() => {
    getMasterData();
    getAllEntityData();
  }, []);
  return (
    <div>
      {loading ? <Loader /> : ""}
      <div
        ref={myDiv}
        tabIndex={-1}
        key={key1}
        className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
      >
        <ParameterHeading title="Service Entity" />

        <div className="grid grid-cols-4 gap-6 my-3">
          <div>
            <Input
              required={true}
              label="Service Entity Code"
              color="blue"
              crossOrigin={undefined}
              value={formData.serviceEntityCode}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  serviceEntityCode: sanitizeInput(e.target.value),
                })
              }
            ></Input>
            {formData.serviceEntityCode &&
              typeof formData.serviceEntityCode === "string" &&
              !alphaNumWithHyphen.test(formData.serviceEntityCode) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              required={true}
              label="Service Entity Description"
              color="blue"
              crossOrigin={undefined}
              value={formData.serviceEntityDesc}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  serviceEntityDesc: sanitizeInput(e.target.value),
                })
              }
              onKeyPress={(e: any) => {
                if (!/^[a-zA-Z_ ]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            ></Input>
            {formData.serviceEntityDesc &&
              typeof formData.serviceEntityDesc === "string" &&
              !allowspacepattern.test(formData.serviceEntityDesc) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div className="relative">
            <Select
              primaryColor="blue"
              placeholder="Service Entity Type"
              onChange={(e: any) => {
                setFormData({ ...formData, serviceEntityType: e });
              }}
              options={serviceEntityTypeList}
              isSearchable={true}
              value={formData.serviceEntityType}
              classNames={classSelect}
            />
            {getLabel(formData.serviceEntityType, "Service Entity Type")}
          </div>
          <div>
            <Input
              label="Pin Code"
              required={true}
              color="blue"
              type="number"
              crossOrigin={undefined}
              onChange={handlePinCodeChange}
              value={formData.masterAddressTbl?.pincodeId}
              onKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 5 || e.key == "E" || e.key == "e") {
                  e.preventDefault();
                }
              }}
            ></Input>
            {formData.masterAddressTbl?.pincodeId &&
              typeof formData.masterAddressTbl?.pincodeId === "string" &&
              !alphaNumWithHyphen.test(
                formData.masterAddressTbl?.pincodeId
              ) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="House No"
              crossOrigin={undefined}
              color="blue"
              value={formData.masterAddressTbl?.houseNo}
              onChange={(e) => handleMasterAddress(e, "houseNo")}
            ></Input>

            {formData.masterAddressTbl?.houseNo &&
              typeof formData.masterAddressTbl?.houseNo === "string" &&
              !alphaNumWithFewSymbols.test(
                formData.masterAddressTbl?.houseNo
              ) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="Street"
              crossOrigin={undefined}
              color="blue"
              value={formData.masterAddressTbl?.location}
              onChange={(e) => handleMasterAddress(e, "location")}
            ></Input>
            {formData.masterAddressTbl?.location &&
              typeof formData.masterAddressTbl?.location === "string" &&
              !allowspacepattern.test(formData.masterAddressTbl?.location) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="City"
              required={true}
              color="blue"
              crossOrigin={undefined}
              value={formData.masterAddressTbl?.city}
              onChange={(e) => handleMasterAddress(e, "city")}
            ></Input>
            {formData.masterAddressTbl?.city &&
              typeof formData.masterAddressTbl?.city === "string" &&
              !allowspacepattern.test(formData.masterAddressTbl?.city) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="Country"
              required={true}
              color="blue"
              crossOrigin={undefined}
              value={formData.masterAddressTbl?.country}
              onChange={(e) => handleMasterAddress(e, "country")}
            ></Input>
            {formData.masterAddressTbl?.country &&
              typeof formData.masterAddressTbl?.country === "string" &&
              !allowspacepattern.test(formData.masterAddressTbl?.country) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="State"
              required={true}
              color="blue"
              crossOrigin={undefined}
              value={formData.masterAddressTbl?.state}
              onChange={(e) => handleMasterAddress(e, "state")}
            ></Input>
            {formData.masterAddressTbl?.state &&
              typeof formData.masterAddressTbl?.state === "string" &&
              !allowspacepattern.test(formData.masterAddressTbl?.state) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="District"
              required={true}
              color="blue"
              crossOrigin={undefined}
              value={formData.masterAddressTbl?.district}
              onChange={(e) => handleMasterAddress(e, "district")}
            ></Input>
            {formData.masterAddressTbl?.district &&
              typeof formData.masterAddressTbl?.district === "string" &&
              !allowspacepattern.test(formData.masterAddressTbl?.district) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="Mobile Number"
              required={true}
              color="blue"
              type="number"
              crossOrigin={undefined}
              onKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 9 || e.key == "E" || e.key == "e") {
                  e.preventDefault();
                }
              }}
              value={formData.masterAddressTbl?.mobile}
              onChange={(e) => handleMasterAddress(e, "mobile")}
            ></Input>
            {formData.masterAddressTbl?.mobile &&
              typeof formData.masterAddressTbl?.mobile === "string" &&
              !allowOnlyNumbers.test(formData.masterAddressTbl?.mobile) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="Contact Number / Land Line"
              crossOrigin={undefined}
              color="blue"
              type="number"
              value={formData.masterAddressTbl?.contactNum}
              onChange={(e) => handleMasterAddress(e, "contactNum")}
              onKeyPress={(e: any) => {
                if (
                  e.target.value.length > 9 ||
                  e.key === "e" ||
                  e.key === "E"
                ) {
                  e.preventDefault();
                }
                if (
                  !/^[0-9]$/.test(e.key) ||
                  e.key === "Backspace" ||
                  e.key === "Delete"
                )
                  return;
              }}
            ></Input>
            {formData.masterAddressTbl?.contactNum &&
              typeof formData.masterAddressTbl?.contactNum === "string" &&
              !alphaNumWithHyphen.test(
                formData.masterAddressTbl?.contactNum
              ) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div className="relative">
            <Select
              primaryColor="blue"
              placeholder="Licence Type*"
              onChange={(e: any) =>
                handleFromDateChange(moment(formData.effectiveStart), e)
              }
              options={licenceTypeList}
              isSearchable={true}
              value={formData.licenseType}
              classNames={classSelect}
            />
            {getLabel(formData.licenseType, "Licence Type")}
          </div>
          <div>
            <DateInput
              disableFuture={true}
              onChange={(e: any) =>
                handleFromDateChange(e, formData.licenseType)
              }
              value={moment(formData.effectiveStart)}
              label="From Date"
            />
          </div>
          <div>
            <DateInput
              disableFuture={true}
              disabled={isToDateDisabled}
              onChange={(e: any) => {
                setFormData({
                  ...formData,
                  effectiveEnd: moment(e).format("YYYY-MM-DD"),
                });
              }}
              value={moment(formData.effectiveEnd)}
              label="To Date"
            />
          </div>
          <div>
            <Input
              label="Location Count"
              required={true}
              type="number"
              color="blue"
              crossOrigin={undefined}
              value={formData.locationCount}
              onChange={(e: any) =>
                setFormData({ ...formData, locationCount: e.target.value })
              }
            ></Input>
            {formData.locationCount &&
              typeof formData.locationCount === "string" &&
              !allowOnlyNumbers.test(formData.locationCount) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="User Count"
              type="number"
              required={true}
              color="blue"
              crossOrigin={undefined}
              value={formData.userCount}
              onChange={(e: any) =>
                setFormData({ ...formData, userCount: e.target.value })
              }
            ></Input>
            {formData.userCount &&
              typeof formData.userCount === "string" &&
              !allowOnlyNumbers.test(formData.userCount) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="Bed Count"
              type="number"
              color="blue"
              required={true}
              crossOrigin={undefined}
              value={formData.bedCount}
              onChange={(e: any) =>
                setFormData({ ...formData, bedCount: e.target.value })
              }
            ></Input>
            {formData.bedCount &&
              typeof formData.bedCount === "string" &&
              !allowOnlyNumbers.test(formData.bedCount) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please do not enter special characters!
                </div>
              )}
          </div>
          <div>
            <Input
              label="PAN No."
              type="text"
              color="blue"
              required
              crossOrigin={undefined}
              value={formData.panNo}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  panNo: sanitizeInput(e.target.value.toUpperCase()),
                })
              }
              onKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 9) {
                  e.preventDefault();
                }
              }}
            ></Input>
            {formData.panNo && !panNoPattern.test(formData.panNo) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please enter valid Pan number !
              </div>
            )}
          </div>
          <div>
            <Input
              label="GST No."
              type="text"
              required
              color="blue"
              crossOrigin={undefined}
              value={formData.gstNo}
              onChange={(e: any) =>
                setFormData({ ...formData, gstNo: e.target.value })
              }
              onKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 14) {
                  e.preventDefault();
                }
              }}
            ></Input>
            {formData.gstNo && !gstPattern.test(formData.gstNo) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please enter valid GST number !
              </div>
            )}
          </div>
          <div className="ps-2">
            <CheckboxMui
              label="GST Included on Bill"
              checked={formData.billingGstIncluded !== 0}
              handleChange={() =>
                setFormData({
                  ...formData,
                  billingGstIncluded:
                    formData.billingGstIncluded == 0 ? 1 : 0,
                })
              }
            />
          </div>
        </div>
        <div className="mt-3 flex gap-6 justify-end item-end">
          <ActionButton
            buttonText={
              saveupdateLoader ? (
                <div className="w-full flex justify-center items-center">
                  <div className="innerBtnloader"></div>
                </div>
              ) : (
                actionType
              )
            }
            handleSubmit={onSave}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              formData.bedCount &&
              formData.serviceEntityCode &&
              formData.serviceEntityDesc &&
              formData.licenseType &&
              formData.masterAddressTbl?.pincodeId &&
              formData.masterAddressTbl?.city &&
              formData.masterAddressTbl?.country &&
              formData.masterAddressTbl?.state &&
              formData.masterAddressTbl?.district &&
              formData.masterAddressTbl?.mobile &&
              formData.userCount &&
              formData.locationCount &&
              formData.panNo &&
              formData.gstNo
                ? false
                : true
            }
          />
          <ActionButton
            buttonText="Reset"
            backgroundColor="red"
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={handleCancel}
          />
        </div>
      </div>
      <div className=" data-grid-newThem mt-0 px-4 my-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="">
          <ReactDatagrid
            rows={entityData}
            toolsRequired={true}
            columns={columns}
          />
        </div>
        {/* <DataGrid
          autoHeight
          rows={entityData}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection={false}
          initialState={{
            ...entityData.initialState,
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          density="compact"
        /> */}
      </div>

      <ReactCommonDialog
        open={open}
        handler={handleOpen}
        popupClose={handleOpen}
        Content={
          <DeletePopupMsg
            btnYesFun={() => handleYesButton(paramData, type)}
            btnNoFun={handleOpen}
            content={"Do you want to Delete this record?"}
            loader={loading}
          />
        }
      />
    </div>
  );
}
