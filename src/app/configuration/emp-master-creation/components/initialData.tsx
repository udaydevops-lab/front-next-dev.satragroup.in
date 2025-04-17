import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { getLocalItem } from "@/app/utilities/local";
import moment from "moment";

export const initialFormData: any = {
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
  empCategory: "",
  roleId: "",
  organization:getHeaderResponse().serviceEntityId? {
    label: getHeaderResponse().serviceEntityDesc,
    value: getHeaderResponse().serviceEntityId,
  }:"",
  employeType: "",
  designation: "",
  designationCode: "",
  designationDesc: "",
  eSignature: "",
  // primaryFacility: JSON.parse(getLocalItem('loginResponse')!)?.locationDesc,
  primaryFacility: '',
  locationId:'',// JSON.parse(getLocalItem('loginResponse')!)?.locationId,
  locationDesc:'',// JSON.parse(getLocalItem('loginResponse')!)?.locationDesc,
  isActive: 0,
  licenceNum: "",
  imageData: "",
  employeeAssignDeptSet: "",
  statusFlag: 1,
  fileType: "image/jpg",
  username: "",
  userProfilesDto: {
    userId: null,
    username: null,
    isEmpidAsUsername: 1,
    tempPwd: null,
    confirmPassword: null,
    // serviceEntityId: JSON.parse(getLocalItem('loginResponse')!)?.serviceEntityId,
    serviceEntityId: "",
    locationId: null,
    // serviceEntityDesc: JSON.parse(getLocalItem('loginResponse')!)?.serviceEntityDesc,
    // locationDesc: JSON.parse(getLocalItem('loginResponse')!)?.locationDesc,
    serviceEntityDesc:'',
    locationDesc: '',
    isDefaultPassword: 1,
    userProfileGroupList: [],
    userProfileLocationSet: [],
    statusFlag: 1,
    generatedBy: null,
  },
};
export const actions: any = {
  actionType: "Save",
  loading: false,
  open: false,
};
export const handleReset = (setFormData: any, setActionsData: any) => {
  setFormData(initialFormData);
  setActionsData(actions);
};
