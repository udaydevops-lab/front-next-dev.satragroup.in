"use client";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import DocumentUpload from "@/app/_common/document-upload";
import CheckboxMui from "@/app/check-box";
import {
  changeEmpStatus,
  deleteEmployee,
  getAllDepartments,
  getAllEmployeeList,
  getConfigData,
  getDoctorData,
  getLocationDropDown,
  getRoleDropDown,
  getServiceEntityDropDown,
  saveEmployee,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Radio,
} from "@material-tailwind/react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-tailwindcss-select";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { getLocalItem } from "@/app/utilities/local";
import { toast } from "react-toastify";
import Loader from "@/app/_common/loader";
import { Divider } from "@mui/material";
import {
  aadhaarPattern,
  allowspacepattern,
  alphaNumWithHyphen,
  emailPattern,
  namePattern,
  panNoPattern,
  thirteenDigitPattern,
} from "@/app/utilities/validations";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UseErrorMessage from "@/app/_commonfeatures/UseErrorMessage";
import FormPropsTextFields from "@/app/_common/input";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ParameterHeading from "../component/ParameterHeading";

export default function EmployeeCreation() {
  const myDiv: any = useRef();
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
  };
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = getHeaderResponse()
  const [isHod, setIsHod] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDoctor, setIsDoctor] = useState("yes");
  const [profileImage, setProfileImage] = useState("");
  const [user, setUser] = useState("");
  const [titleList, setTitleList] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [bloodGroupList, setBloodGroupList] = useState([]);
  const [empCatList, setEmpCatList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [serviceEntityList, setServiceEntityList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [actionType, setActionType] = useState("Save");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [popText, setPopText] = useState("");
  const [paramData, setParamData] = useState({});
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const { errorMsg, setErrorMessage, clearErrorMessage } = UseErrorMessage();
  const initialState: any = {
    employeCode: "",
    employeType: "",
    employeeId: null,
    title: "",
    emailId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: moment().format("YYYY-MM-DD"),
    bloodGroup: "",
    dateOfJoining: moment().format("YYYY-MM-DD"),
    priContactNum: "",
    aadharNo: "",
    panNo: "",
    serviceEntityId: "",
    isHodFlag: 0,
    isDoctor: "yes",
    empCategory: "",
    roleId: "",
    imageData: "",
    employeeAssignDeptSet: null,
    employeeAssignLocationSet: null,
    statusFlag: 1,
  };

  const [formData, setFormData] = useState(initialState);
  const handleIsHod = () => {
    setIsHod(!isHod);
  };
  const handleIsActive = () => {
    setIsActive(!isActive);
  };
  const handleisDoctor = (e: any) => {
    setIsDoctor(e.target.value);
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

  const handleYesButton = (data: any, type: string) => {
    if (type === "flag") {
      handleStatusFlag(data);
    } else if (type === "delete") {
      handleDelete(data);
    }
  };

  const [loader, setLoader] = useState<any>(false)

  const handleStatusFlag = (data: any) => {
    let flag = data.statusFlag == 1 ? 0 : 1;
    setLoading(true);
    services
      .get(changeEmpStatus + data.employeeId + "/" + flag)
      .then((response) => {
        setLoading(false);
        toast.success(
          `Successfully ${data.statusFlag == 0 ? "Activated" : "Inactivated"
          } Service Entity`
        );
        handleOpen();
        getAllData();
      })
      .catch((error) => {
        handleOpen();
        setLoading(false);
        toast.error("Technical Error");
      });
  };

  const handleDelete = (data: any) => {
    setLoading(true);
    services
      .create(`${deleteEmployee}${data.employeeId}`, {})
      .then((res) => {
        setLoading(false);
        toast.success("Employee Deleted Successfully");
        handleOpen();
        getAllData();
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical Error");
        handleOpen();
      });
  };
  const handleProfileUpload = async (e: any) => {
    let image: any = await toBase64(e.target.files[0]);
    setProfileImage(image);
    setFormData({ ...formData, imageData: image });
  };
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getMasterData = () => {
    services.get(getConfigData + "Title/0").then((response) => {
      response.data.configData.map((item: any) => {
        item.label = item.desc;
        item.value = item.code;
      });
      setTitleList(response.data.configData);
    });
    services.get(getConfigData + "Gender/0").then((response) => {
      response.data.configData.map((item: any) => {
        item.label = item.desc;
        item.value = item.code;
      });
      setGenderList(response.data.configData);
    });
    services.get(getConfigData + "BloodGroup/0").then((response) => {
      response.data.configData.map((item: any) => {
        item.label = item.desc;
        item.value = item.code;
      });
      setBloodGroupList(response.data.configData);
    });
    services.get(getConfigData + "EmployeeCategory/0").then((response) => {
      response.data.configData.map((item: any) => {
        item.label = item.desc;
        item.value = item.code;
      });
      setRoleList;
      setEmpCatList(response.data.configData);
    });
    services.get(getRoleDropDown).then((response) => {
      response.data.map((item: any) => {
        item.label = item.desc;
        item.value = item.id;
      });
      setRoleList(response.data);
    });
    services.get(getServiceEntityDropDown).then((response) => {
      response.data.map((item: any) => {
        item.label = item.desc;
        item.value = item.id;
      });
      setServiceEntityList(response.data);
    });
    services.get(getAllDepartments).then((response) => {
      response.data.map((item: any) => {
        item.label = item.departmentDescription;
        item.value = item.departmentCode;
      });
      const filteredData = response.data.filter(
        (item: any) => item.departmentDescription !== null
      );
      setDepartmentList(filteredData);
    });
  };
  const [serviceEntity, setServiceEntity] = useState<any>("");
  const handleServEntChange = (e: any) => {
    setServiceEntity(e);
    setFormData({ ...formData, serviceEntity: e });
    services.get(getLocationDropDown + e.value).then((response) => {
      response.data.map((item: any) => {
        item.label = item.desc;
        item.value = item.id;
      });
      setLocationList(response.data);
      setFormData({ ...formData, employeeAssignLocationSet: null });
    });
  };
  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 210,
    },
    {
      field: "roleDes",
      headerName: "Role",
      width: 180,
    },
    {
      field: "priContactNum",
      headerName: "Mobile",
      width: 180,
    },
    {
      field: "generatedDate",
      headerName: "Created On",
      width: 130,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
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
      width: 100,
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
      width: 90,
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
  const filteredData = (data: any, key: string) => {
    return data.filter((item: any) => item.value == key)[0];
  };
  const handleEditIcon = async (data: any) => {
    setFormData(initialState);
    setProfileImage("");
    setIsHod(false);
    services
      .get(getDoctorData + data.employeeId, headers)
      .then(async (response) => {
        let res = response.data[0].empData;
        let responseData = response.data[0].empData;
        responseData.serviceEntityId = await filteredData(
          serviceEntityList,
          res.serviceEntityId
        );
        setServiceEntity(responseData.serviceEntityId);
        responseData.employeeId = response.data[0].employeeId;
        responseData.title = filteredData(titleList, res.title);
        responseData.gender = filteredData(genderList, res.gender);
        responseData.bloodGroup = filteredData(bloodGroupList, res.bloodGroup);
        responseData.empCategory = filteredData(empCatList, res.empCategory);
        let deptarray: any = [];
        res.employeeAssignDeptSet.map((id: any) => {
          let obj = filteredData(departmentList, id);
          deptarray.push(obj);
        });
        if (Object.keys(deptarray).length > 0) {
          responseData.employeeAssignDeptSet = deptarray;
        } else {
          responseData.employeeAssignDeptSet = [];
        }
        setIsHod(
          responseData.isHodFlag && responseData.isHodFlag == 1 ? true : false
        );
        handleisDoctor({
          target: {
            value:
              responseData.isDoctor && responseData.isDoctor == 1
                ? "yes"
                : "no",
          },
        });
        setKey1((k) => k + 1);

        setProfileImage(responseData.imageData);
        responseData.roleId = await filteredData(roleList, res.roleId);
        setFormData(responseData);
        myDiv.current.scrollIntoView({
          behavior: "smooth",
        });
        services
          .get(getLocationDropDown + responseData.serviceEntityId.id)
          .then((response) => {
            response.data.map((item: any) => {
              item.label = item.desc;
              item.value = item.id;
            });
            setLocationList(response.data);
            let locArray: any = [];
            res.employeeAssignLocationSet.map((id: any) => {
              let obj = filteredData(response.data, id);
              locArray.push(obj);
              responseData.employeeAssignLocationSet = locArray;
              setFormData(responseData);
            });
          })
          .catch((err) => {
            responseData.employeeAssignLocationSet = [];
          });
      })
      .catch((error) => {
        toast.error("Technical Error in Getting Employee Data");
        setFormData(initialState);
      });
    setFormData(data);
    setActionType("Update");
  };
  const [gridData, setGridData] = useState<any>([]);
  const getAllData = () => {
    services.get(getAllEmployeeList, headers).then((response) => {
      response.data.map((item: any, index: number) => {
        item.sno = index + 1;
      });
      setGridData(response.data);
    });
  };
  const onSubmit = () => {
    if (!formData.employeCode) {
      toast.error("Please Enter Employee Code");
    } else if (!formData.employeType) {
      toast.error("Please Enter Employee Type");
    } else if (!formData.title.value) {
      toast.error("Please Select Title");
    } else if (!formData.firstName) {
      toast.error("Please Enter First Name");
    } else if (!formData.lastName) {
      toast.error("Please Enter Last Name");
    } else if (!formData.gender.value) {
      toast.error("Please Select Gender");
    } else if (!formData.dateOfBirth) {
      toast.error("Please Enter Date Of Birth");
    } else if (!formData.bloodGroup.value) {
      toast.error("Please Select Blood Group");
    } else if (!formData.empCategory.value) {
      toast.error("Please Select Employee Category");
    } else if (!serviceEntity.value) {
      toast.error("Please Select Service Entity");
    } else if (!formData.employeeAssignLocationSet) {
      toast.error("Please Select Location");
    } else if (!formData.roleId.value) {
      toast.error("Please Select Role");
    } else if (!formData.dateOfJoining) {
      toast.error("Please Enter Date Of Joining");
    } else if (!formData.priContactNum) {
      toast.error("Please Enter Mobile Number");
    } else if (!formData.employeeAssignDeptSet) {
      toast.error("Please Select Department");
    } else if (!formData.aadharNo) {
      toast.error("Please Enter Aadhaar Number");
    } else if (!formData.imageData) {
      toast.error("Please Select Image");
    } else {
      let postObj = initialState;
      postObj.employeCode = formData.employeCode;
      postObj.employeType = formData.employeType;
      postObj.employeeId = formData.employeeId;
      postObj.title = formData.title.value;
      postObj.emailId = formData.emailId;
      postObj.firstName = formData.firstName;
      postObj.middleName = formData.middleName;
      postObj.lastName = formData.lastName;
      postObj.gender = formData.gender.value;
      postObj.dateOfBirth = formData.dateOfBirth;
      postObj.bloodGroup = formData.bloodGroup.value;
      postObj.dateOfJoining = formData.dateOfJoining;
      postObj.priContactNum = formData.priContactNum;
      postObj.aadharNo = formData.aadharNo;
      postObj.panNo = formData.panNo;
      postObj.serviceEntityId = serviceEntity.value;
      postObj.isHodFlag = isHod ? 1 : 0;
      postObj.empCategory = formData.empCategory.value;
      postObj.roleId = formData.roleId.value;
      postObj.isDoctor = isDoctor === "yes" ? 1 : 0;
      postObj.imageData = formData.imageData;
      let locArray: any = [];
      formData.employeeAssignLocationSet.map((item: any, index: number) => {
        item[index] = item.value;
        locArray[index] = item.value;
      });
      postObj.employeeAssignLocationSet = locArray;
      let deptArray: any = [];
      formData.employeeAssignDeptSet.map((item: any, index: number) => {
        item[index] = item.value;
        deptArray[index] = item.value;
      });
      postObj.employeeAssignDeptSet = deptArray;
      postObj.statusFlag = formData.statusFlag;
      postObj.fileType = "image/jpg";
      setLoading(true);
      services
        .create(saveEmployee, postObj, headers)
        .then((response) => {
          toast.success("Employee Saved Successfully");
          setFormData({
            employeCode: "",
            employeType: "",
            employeeId: null,
            title: "",
            emailId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            dateOfBirth: moment().format("YYYY-MM-DD"),
            bloodGroup: "",
            dateOfJoining: moment().format("YYYY-MM-DD"),
            priContactNum: "",
            aadharNo: "",
            panNo: "",
            serviceEntityId: "",
            isHodFlag: null,
            empCategory: "",
            roleId: "",
            imageData: "",
            employeeAssignDeptSet: null,
            employeeAssignLocationSet: null,
            statusFlag: 1,
          });
          setProfileImage("");
          setLoading(false);
          setActionType("Save");
          setIsDoctor("yes");
          setKey1((k) => k + 1);
          setIsHod(false);
          getAllData();
        })
        .catch((error) => {
          setLoading(false);
          if (error.response?.data?.statusMessage) {
            toast.error(error.response.data.statusMessage);
          } else {
            toast.error("Technical Error in Saving Employee Data");
          }
        });
    }
  };
  const handleReset = () => {
    setFormData(initialState);
    setIsHod(false);
    setActionType("Save");
    setIsDoctor("yes");
    setIsHod(false);
    setProfileImage("");
    setKey1((k) => k + 1);
  };
  const [key1, setKey1] = useState(0);
  const handleOpen = () => setOpen(!open);
  useEffect(() => {
    getMasterData();
    getAllData();
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
        <ParameterHeading
          title="Employee Creation"
        />

        <div className="grid grid-cols-5 gap-6 my-3">
          <div className="flex justify-between">
            <div>
              <CheckboxMui
                label="is HOD"
                handleChange={handleIsHod}
                checked={isHod}
              />
            </div>
          </div>
        </div>
        <Divider className="my-3" />
        <div className="grid grid-cols-11 gap-3">
          <div className="flex items-center">Doctor</div>
          <Radio
            crossOrigin={undefined}
            name="isDoctor"
            label="Yes"
            checked={isDoctor == "yes" ? true : false}
            value={"yes"}
            onChange={(e: any) => handleisDoctor(e)}
          />
          <Radio
            crossOrigin={undefined}
            name="isDoctor"
            checked={isDoctor == "no" ? true : false}
            label="No"
            value={"no"}
            onChange={(e: any) => handleisDoctor(e)}
          />
        </div>
        <Divider className="my-3" />
        <div className="flex gap-6">
          <div className="w-1/6 md: px-3 mt-6 upload-usericon flex flex-wrap content-start justify-around overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-25 h-25 object-cover"
              />
            ) : (
              <Image
                src="/images/profile.jpg"
                alt="photo"
                width={60}
                height={60}
                className="rounded-full w-30 h-30 object-cover"
              />
            )}
            <div className="pt-2 ">
              <DocumentUpload
                labelContent="Attach"
                name="profilePhoto"
                handleChange={handleProfileUpload}
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 my-6 w-5/6">
            <div>
              <Input
                color="blue"
                required={true}
                label="Employee Code"
                crossOrigin={undefined}
                value={formData.employeCode}
                onChange={(e: any) => {
                  setFormData({ ...formData, employeCode: sanitizeInput(e.target.value) });
                  clearErrorMessage({ ...errorMsg, employeCode: "" });
                  if (
                    formData.employeCode &&
                    !alphaNumWithHyphen.test(formData.employeCode)
                  ) {
                    setErrorMessage({
                      ...errorMsg,
                      employeCode: "Please do not enter special characters!",
                    });
                  }
                }}
              />
              {errorMsg && (
                <div className="absolute text-xs ml-1 text-red-500">
                  {errorMsg.employeCode}
                </div>
              )}
            </div>
            <div>
              <Input
                color="blue"
                required={true}
                label="Employee Type"
                crossOrigin={undefined}
                value={formData.employeType}
                onChange={(e: any) => {
                  setFormData({ ...formData, employeType: sanitizeInput(e.target.value) });
                  clearErrorMessage({ ...errorMsg, employeType: "" });
                  if (
                    formData.employeType &&
                    !alphaNumWithHyphen.test(formData.employeType)
                  ) {
                    setErrorMessage({
                      ...errorMsg,
                      employeType: "Please do not enter special characters!",
                    });
                  }
                }}
              />
              {errorMsg && (
                <div className="absolute text-xs ml-1 text-red-500">
                  {errorMsg.employeType}
                </div>
              )}
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Title*"
                onChange={(e: any) => {
                  setFormData({ ...formData, title: e });
                }}
                options={titleList}
                isSearchable={true}
                value={formData.title}
                classNames={classSelect}
              />
              {getLabel(formData.title, "Title")}
            </div>
            <div>
              <Input
                color="blue"
                required={true}
                label="First Name"
                crossOrigin={undefined}
                value={formData.firstName}
                onChange={(e: any) => {
                  setFormData({ ...formData, firstName: sanitizeInput(e.target.value) });
                }}
              />
              {formData.firstName && !namePattern.test(formData.firstName) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter alphabets only !
                </div>
              )}
            </div>
            <div>
              <Input
                color="blue"
                label="Middle Name"
                crossOrigin={undefined}
                value={formData.middleName}
                onChange={(e: any) =>
                  setFormData({ ...formData, middleName: sanitizeInput(e.target.value) })
                }
              />
              {formData.middleName &&
                !namePattern.test(formData.middleName) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Please enter alphabets only !
                  </div>
                )}
            </div>
            <div>
              <Input
                required={true}
                label="Last Name"
                color="blue"
                crossOrigin={undefined}
                value={formData.lastName}
                onChange={(e: any) =>
                  setFormData({ ...formData, lastName: sanitizeInput(e.target.value) })
                }
              />
              {formData.lastName && !namePattern.test(formData.lastName) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter alphabets only !
                </div>
              )}
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Gender*"
                onChange={(e: any) => {
                  setFormData({ ...formData, gender: e });
                }}
                options={genderList}
                isSearchable={true}
                value={formData.gender}
                classNames={classSelect}
              />
              {getLabel(formData.gender, "Gender")}
            </div>
            <div>
              <DateInput
                disableFuture={true}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: moment(e).format("YYYY-MM-DD"),
                  })
                }
                value={moment(formData.dateOfBirth)}
                label="Date Of Birth"
              />
            </div>
            <div>
              <DateInput
                disableFuture={true}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    dateOfJoining: moment(e).format("YYYY-MM-DD"),
                  })
                }
                value={moment(formData.dateOfJoining)}
                label="Date Of Joining"
              />
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Blood Group *"
                onChange={(e: any) => {
                  setFormData({ ...formData, bloodGroup: e });
                }}
                options={bloodGroupList}
                isSearchable={true}
                value={formData.bloodGroup}
                classNames={classSelect}
              />
              {getLabel(formData.bloodGroup, "Blood Group")}
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Employee Category *"
                onChange={(e: any) => {
                  setFormData({ ...formData, empCategory: e });
                }}
                options={empCatList}
                isSearchable={true}
                value={formData.empCategory}
                classNames={classSelect}
              />
              {getLabel(formData.empCategory, "Employee Category")}
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Service Entity*"
                onChange={(e: any) => handleServEntChange(e)}
                options={serviceEntityList}
                isSearchable={true}
                value={serviceEntity}
                classNames={classSelect}
              />
              {getLabel(formData.serviceEntityId, "Service Entity")}
            </div>
            <div className="relative col-span-2">
              <Select
                primaryColor="blue"
                placeholder="Location *"
                onChange={(e: any) => {
                  setFormData({ ...formData, employeeAssignLocationSet: e });
                }}
                options={locationList}
                isSearchable={true}
                isMultiple={true}
                isClearable
                value={formData.employeeAssignLocationSet}
                classNames={classSelect}
              />
              <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${formData.employeeAssignLocationSet?.length > 0
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                  : "text-sm opacity-0 top-10"
                  } 
            truncate 
            cursor-default 
            select-none  
            absolute transition-all
            `}
              >
                Location
              </label>
            </div>
            <div className="relative">
              <Select
                primaryColor="blue"
                placeholder="Role *"
                onChange={(e: any) => {
                  setFormData({ ...formData, roleId: e });
                }}
                options={roleList}
                isSearchable={true}
                value={formData.roleId}
                classNames={classSelect}
              />
              {getLabel(formData.roleId, "Role")}
            </div>
            <div className="relative col-span-2">
              <Select
                primaryColor="blue"
                placeholder="Department *"
                onChange={(e: any) => {
                  setFormData({ ...formData, employeeAssignDeptSet: e });
                }}
                options={departmentList}
                classNames={classSelect}
                isSearchable={true}
                isMultiple={true}
                isClearable={true}
                value={formData.employeeAssignDeptSet}
                formatGroupLabel={(data) => (
                  <div
                    className={`py-2 text-xs flex items-center justify-between`}
                  >
                    <span className="font-bold">{data.label}</span>
                    <span className="bg-gray-200 h-5  p-1.5 flex items-center justify-center rounded-full">
                      {data.options.length}
                    </span>
                  </div>
                )}
              />
              <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${formData.employeeAssignDeptSet?.length > 0
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
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
            <div>
              <Input
                required={true}
                color="blue"
                type="number"
                label="Primary Contact Number"
                crossOrigin={undefined}
                value={formData.priContactNum}
                onKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 9) {
                    e.preventDefault();
                  }
                }}
                onChange={(e: any) =>
                  setFormData({ ...formData, priContactNum: e.target.value })
                }
              ></Input>
            </div>
            <div className="relative">
              <FormPropsTextFields
                required={true}
                color="blue"
                label="Aadhaar Number"
                crossOrigin={undefined}
                type={showPassword ? "password" : "text"}
                value={formData.aadharNo}
                autoFocus={false}
                handleKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 11) {
                    e.preventDefault();
                  }
                }}
                handleChange={(e: any) =>
                  setFormData({ ...formData, aadharNo: e.target.value })
                }
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
              {formData.aadharNo &&
                thirteenDigitPattern.test(formData.aadharNo) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Please enter valid Aadhaar number !
                  </div>
                )}
            </div>
            <div>
              <Input
                label="Pan No."
                color="blue"
                crossOrigin={undefined}
                value={formData.panNo}
                onKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 9) {
                    e.preventDefault();
                  }
                }}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    panNo: sanitizeInput(e.target.value.toUpperCase()),
                  })
                }
              />
              {formData.panNo && !panNoPattern.test(formData.panNo) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter valid Pan number !
                </div>
              )}
            </div>
            <div>
              <Input
                label="Email"
                color="blue"
                crossOrigin={undefined}
                value={formData.emailId}
                onChange={(e: any) =>
                  setFormData({ ...formData, emailId: sanitizeInput(e.target.value) })
                }
              />
              {formData.emailId && !emailPattern.test(formData.emailId) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter valid email address
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-6 justify-end item-end">
          <ActionButton
            buttonText={actionType}
            handleSubmit={onSubmit}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              formData.employeCode !== "" &&
                formData.employeType !== "" &&
                formData.firstName !== "" &&
                formData.lastName !== "" &&
                formData.priContactNum !== "" &&
                formData.aadharNo !== "" &&
                formData.gender !== "" &&
                formData.title !== "" &&
                formData.empCategory !== "" &&
                formData.bloodGroup !== "" &&
                formData.roleId !== "" &&
                serviceEntity !== "" &&
                formData.employeeAssignDeptSet !== "" &&
                formData.employeeAssignLocationSet !== ""
                ? false
                : true
            }
          />
          <ActionButton
            buttonText="Reset"
            backgroundColor="red"
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={handleReset}
          />
        </div>
      </div>
      <div className="px-3 my-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <ReactDatagrid
          rows={gridData}
          columns={columns}
        />
      </div>

      <ReactCommonDialog
        open={open}
        handler={handleOpen}
        popupClose={handleOpen}
        Content={
          <DeletePopupMsg
            btnYesFun={() => handleYesButton(paramData, type)}
            btnNoFun={handleOpen}
            content={`Do you want to ${popText} this record?`}
            loader={loading}
          />
        }
      />

    </div>
  );
}
