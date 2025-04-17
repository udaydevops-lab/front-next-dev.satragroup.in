"use client";
import React, { useEffect, useRef, useState } from "react";
import { addLabelAndValue, getList } from "./components/utils";
import services from "@/app/utilities/services";
import {
  getAllDepartments,
  getServiceEntityDropDown,
  saveEmployee,
} from "@/app/utilities/api-urls";
import {
  actions,
  handleReset,
  initialFormData,
} from "./components/initialData";
import EmpGrid from "./components/EmpGrid";
import EmpForm from "./components/EmpForm";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import { toast } from "react-toastify";
import moment from "moment";

export default function EmpMasterCreation(props: any) {
  const myDiv: any = useRef();
  const [titleList, setTitleList] = useState<any>([]);
  const [genderList, setGenderList] = useState<any>([]);
  const [bloodGroupList, setBloodGroupList] = useState<any>([]);
  const [empCatList, setEmpCatList] = useState<any>([]);
  const [empProfileList, setEmpProfileList] = useState<any>([]);
  const [organizationList, setOrganizationList] = useState<any>([]);
  const [facilityList, setFacilityList] = useState<any>([]);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [designationList, setDesignationList] = useState<any>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [actionsData, setActionsData] = useState<any>(actions);
  const [reRender, setRerender] = useState(0);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  //Drop down data
  const getAllMasterData = async () => {
    getList("Title", setTitleList);
    getList("Gender", setGenderList);
    getList("BloodGroup", setBloodGroupList);
    getList("EmployeeCategory", setEmpCatList);
    getList("Designation", setDesignationList);
    getList("EmployeeProfileType", setEmpProfileList);
    services.get(getServiceEntityDropDown).then((response) => {
      setOrganizationList(addLabelAndValue(response.data));
    });
    services.get(getAllDepartments).then((response) => {
      let data = addLabelAndValue(response.data);
      //some department values are null in response data
      const filteredData = data.filter(
        (item: any) => item.departmentDescription !== null
      );
      setDepartmentList(filteredData);
    });
  };
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = {
    userId: loginResponse?.userId,
    roleId: "",
    employeename: loginResponse?.employeename,
    employeeid: loginResponse?.employeeId,
    locationId: loginResponse?.locationId,
    serviceEntityId: loginResponse?.serviceEntityId,
  };
  const saveEmp = () => {
    // if (!formData.imageData) {
    //   toast.error("Please Upload Image");
    // } 
    // else if (!formData.eSignature) {
    //   toast.error("Please Upload Signature");
    // }
    //  else 
     if (!formData.title) {
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
    } else if (!formData.dateOfJoining) {
      toast.error("Please Enter Date Of Joining");
    } else if (!formData.empCategory.value) {
      toast.error("Please Select Employee Category");
    } else if (!formData.organization.value) {
      toast.error("Please Select Organisation");
    } else if (!formData.primaryFacility.value) {
      toast.error("Please Select Primary Facility");
    } else if (!formData.emailId) {
      toast.error("Please Enter Email ID");
    } else if (!formData.aadharNo) {
      toast.error("Please Enter Aadhaar Number");
    } else if (!formData.priContactNum) {
      toast.error("Please Enter Contact Number");
    } 
    // else if (!formData.panNo) {
    //   toast.error("Please Enter PAN Number");
    // } 
    else if (!formData.employeType) {
      toast.error("Please Select Employee Profile");
    } 
    // else if (!formData.licenceNum) {
    //   toast.error("Please Enter HIP Licence Number");
    // } 
    else if (!formData.employeeAssignDeptSet) {
      toast.error("Please Select Department");
    } else if (!formData.designation) {
      toast.error("Please Select Designation");
    } else if (moment(formData.dateOfJoining).diff(formData.dateOfBirth, 'years') < 18) {
      toast.error("Age should be greater than 18");
      return
    } else {
      setIsSaveEnabled(true);

      let data = { ...formData };
      let postObj = { ...formData };
      postObj.employeeId = data.employeeId;
      postObj.title = data.title.value;
      postObj.gender = data.gender.value;
      postObj.bloodGroup = data.bloodGroup.value;
      postObj.organization = data.organization.value;
      // postObj.serviceEntityId = data.serviceEntityId;
      postObj.serviceEntityId = data.organization.value;
      postObj.empCategory = data.empCategory.value;
      // postObj.primaryFacility = data.primaryFacility;
      postObj.primaryFacility = data.primaryFacility.label;
      postObj.employeType = data.employeType.value;
      postObj.employeTypeDesc = data.employeType.label;
      postObj.designationCode = data.designation.value;
      postObj.designationDesc = data.designation.label;
      postObj.eSignature = data.eSignature;
      postObj.imageData = data.imageData;
      postObj.employeeAssignDeptSet = [
        data.employeeAssignDeptSet.value +
        "-" +
        data.employeeAssignDeptSet.label,
      ];
      // postObj.serviceEntityDesc = data.serviceEntityDesc;
      postObj.serviceEntityDesc = data.organization.label;
      // postObj.locationId = data.locationId;
      // postObj.locationDesc = data?.locationDesc;
      postObj.locationId = data.primaryFacility.value;
      postObj.locationDesc = data.primaryFacility.label;
      postObj.departmentDescription = data.employeeAssignDeptSet.label;
      postObj.userProfilesDto = {
        ...data.userProfilesDto,
        userId: data.userId,
        username: data.username,
        // serviceEntityId: data.serviceEntityId,
        // locationId: data.locationId,
        // serviceEntityDesc: data.serviceEntityDesc,
        // locationDesc: data?.locationDesc,
        serviceEntityId: data.organization.value,
        locationId: data.primaryFacility.value,
        serviceEntityDesc: data.organization.label,
        locationDesc: data.primaryFacility.label,
        generatedBy: jsonParse("loginResponse").employeename
      };
      delete postObj.designation;
      delete postObj.username;
      services
        .create(saveEmployee, postObj, headers)
        .then((response) => {
          moveToUserTab(response.data)
          toast.success(response.data.statusMessage);
          setIsSaveEnabled(false);
          handleReset(setFormData, setActionsData);
          setRerender((prev) => prev + 1);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.statusMessage ? error?.response?.data?.statusMessage : "Technical Error");
          setIsSaveEnabled(false);
          console.log(error)
        });
    }
  };
  //actionsData.actionType
  const moveToUserTab = (data: any) => {
    if (actionsData.actionType.toLowerCase() === "save") {
      props.handleTabClick("user_master", "")
      props.setEmpData(data)
    }
  }

  useEffect(() => {
    //   console.log("LOGINRESP", JSON.parse(getLocalItem('loginResponse')!))
    const serviceEntity = JSON.parse(getLocalItem('loginResponse')!)?.serviceEntityDesc
    const serviceEntityId = JSON.parse(getLocalItem('loginResponse')!)?.serviceEntityId
    if (serviceEntity) {
      setFormData({
        ...formData,
        serviceEntityDesc: serviceEntity,
        serviceEntityId: serviceEntityId,
      })
    }
    getAllMasterData();
  }, []);
  return (
    <div>
      {/* Form */}
      <EmpForm
        titleList={titleList}
        organizationList={organizationList}
        genderList={genderList}
        facilityList={facilityList}
        bloodGroupList={bloodGroupList}
        empCatList={empCatList}
        empProfileList={empProfileList}
        departmentList={departmentList}
        designationList={designationList}
        formData={formData}
        setFacilityList={setFacilityList}
        setFormData={setFormData}
        onSave={saveEmp}
        actionsData={actionsData}
        setActionsData={setActionsData}
        myDiv={myDiv}
        isSaveEnabled={isSaveEnabled}
      />
      {/* Grid Data */}
      <div className="px-4 mt-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <EmpGrid
          titleList={titleList}
          organizationList={organizationList}
          genderList={genderList}
          bloodGroupList={bloodGroupList}
          empCatList={empCatList}
          empProfileList={empProfileList}
          departmentList={departmentList}
          designationList={designationList}
          actionsData={actionsData}
          setActionsData={setActionsData}
          setFormData={setFormData}
          myDiv={myDiv}
          reRender={reRender}
          setFacilityList={setFacilityList}
        />
      </div>
    </div>
  );
}
