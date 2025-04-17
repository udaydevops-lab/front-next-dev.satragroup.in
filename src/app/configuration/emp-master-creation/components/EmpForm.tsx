import ActionButton from "@/app/_common/button";
import React, { useEffect } from "react";
import { handleReset } from "./initialData";
import { addLabelAndValue, toBase64 } from "./utils";
import { getLocationDropDown } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import Image from "next/image";
import DocumentUpload from "@/app/_common/document-upload";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Input } from "@material-tailwind/react";
import DateInput from "@/app/_common/date-input";
import moment from "moment";
import CheckboxMui from "@/app/check-box";
import {
  emailPattern,
  namePattern,
  panNoPattern,
} from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { toast } from "react-toastify";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import esign from "../../../../../public/images/esign.png"
import profile from "../../../../../public/images/profile.jpg"
export default function EmpForm({
  formData,
  setFormData,
  onSave,
  titleList,
  genderList,
  bloodGroupList,
  empCatList,
  empProfileList,
  organizationList,
  facilityList,
  departmentList,
  designationList,
  setFacilityList,
  myDiv,
  actionsData,
  setActionsData,
  isSaveEnabled,
}: any) {
  const handleUpload = async (e: any) => {
    let image: any = await toBase64(e.target.files[0]);
    setFormData({ ...formData, [e.target.name]: image });
  };
  const handleOrgChange = (e: any) => {
    if(e.value){
    setFormData({ ...formData, organization: e });
    // to load facility after selecting organization
    let obj = { ...formData, organization: e };
    setFormData({ ...obj, primaryFacility: "" });
    services.get(getLocationDropDown + e.value).then((response) => {
      setFacilityList(addLabelAndValue(response.data));
    });
  }
  };
  useEffect(() => {
    if(getHeaderResponse().serviceEntityId){
      handleOrgChange({
        label: getHeaderResponse().serviceEntityDesc,
        value: getHeaderResponse().serviceEntityId,
      })
    }else{
      setFormData({ ...formData, organization: "" });
    }
      
  }, []);
  return (
    <div>
      <div
        ref={myDiv}
        tabIndex={-1}
        className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
      >
        <div className="font-bold">
          <h1 className="">Employee Details</h1>
        </div>
        <div className="mt-6 lg:flex md:flex sm:block">
          <div className="w-1/5">
            <div className="w-full p-2 ps-0 overflow-hidden">
              <div className=" md: upload-usericon flex flex-wrap content-start justify-around overflow-hidden">
                <div className="w-full text-md pb-3  mt-2">Employee Image
                   {/* <span className="text-red-700">*</span> */}
                </div>
                {formData.imageData ? (
                  <img
                    src={formData.imageData}
                    alt=""
                    className="rounded-full w-25 h-25 object-cover"
                  />
                ) : (
                  <Image
                    src={profile}
                    alt="photo"
                    width={60}
                    height={60}
                    className="rounded-full w-30 h-30 object-cover"
                  />
                )}
                <div className="pt-2 ">
                  <DocumentUpload
                    labelContent="Attach"
                    name="imageData"
                    handleChange={handleUpload}
                    accept="image/png, image/jpeg, image/jpg"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="w-[85%] mx-auto mt-3 pt-3">
                <hr />
              </div>
              <div className="mt-3upload-signicon flex flex-wrap content-start justify-around overflow-hidden">
                <div className="w-full text-md pt-3 pb-3">Employee Signature 
                  {/* <span className="text-red-700">*</span> */}
                  </div>
                {formData.eSignature ? (
                  <img
                    src={formData.eSignature}
                    alt=""
                    className="w-[83%] h-[50px] object-cover"
                  />
                ) : (
                  <Image
                    src={esign}
                    alt="photo"
                    width={60}
                    height={60}
                    className="w-30 h-30 object-cover"
                  />
                )}
              </div>
              <div className="pt-2">
                <DocumentUpload
                  labelContent="Attach"
                  name="eSignature"
                  handleChange={handleUpload}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
            </div>
          </div>
          <div className="w-4/5 gap-6 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2">
            <div>
              <ReactSelectBox
                value={formData.title}
                options={titleList}
                onChange={(e: any) => setFormData({ ...formData, title: e })}
                label={"Select Title*"}
              />
            </div>
            <div>
              <Input
                color="blue"
                required={true}
                value={formData.firstName}
                crossOrigin={undefined}
                onChange={(e:any) =>{
                  if(e.target.value.length>32){
                     e.preventDefault()
                     return 
                  }
                  setFormData({
                    ...formData,
                    firstName: sanitizeInput(e.target.value),
                  })}
                }
                label="First Name"
              ></Input>
              {formData.firstName && !namePattern.test(formData.firstName) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter alphabets only !
                </div>
              )}
            </div>
            <div>
              <Input
                value={formData.middleName}
                color="blue"
                onChange={(e) =>
                  {if(e.target.value.length>32){
                    e.preventDefault()
                    return 
                 }
                  setFormData({
                    ...formData,
                    middleName: sanitizeInput(e.target.value),
                  })
                }}
                crossOrigin={undefined}
                label="Middle Name"
              ></Input>
              {formData.middleName &&
                !namePattern.test(formData.middleName) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Please enter alphabets only !
                  </div>
                )}
            </div>
            <div>
              <Input
                color="blue"
                value={formData.lastName}
                crossOrigin={undefined}
                onChange={(e) =>
                  {if(e.target.value.length>32){
                    e.preventDefault()
                    return 
                 }
                  setFormData({
                    ...formData,
                    lastName: sanitizeInput(e.target.value),
                  })
                }}
                label="Last Name"
                required={true}
              ></Input>
              {formData.lastName &&
                !namePattern.test(formData.lastName) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Please enter alphabets only !
                  </div>
                )}
            </div>
            <div>
              <ReactSelectBox
                value={formData.gender}
                options={genderList}
                onChange={(e) => setFormData({ ...formData, gender: e })}
                label={"Select Gender*"}
              />
            </div>
            <div>
              <DateInput
                disableFuture={true}
                value={moment(formData.dateOfBirth)}
                label="Date of Birth"
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    dateOfBirth: moment(e).format("YYYY-MM-DD"),
                  });
                }}
              />
            </div>
            <div>
              <ReactSelectBox
                value={formData.bloodGroup}
                options={bloodGroupList}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e })}
                label={"Select Bloood Group*"}
              />
            </div>
            <div>
              <DateInput
                disableFuture={true}
                value={moment(formData.dateOfJoining)}
                label="Date of joining"
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    dateOfJoining: moment(e).format("YYYY-MM-DD"),
                  });
                }}
              />
            </div>
            <div>
              <ReactSelectBox
                value={formData.empCategory}
                options={empCatList}
                onChange={(e: any) => {
                  setFormData({ ...formData, empCategory: e });
                }}
                label={"Employee Category*"}
              />
            </div>
            <div>
              {/* <Input
                color="blue"
                value={formData.serviceEntityDesc}
                crossOrigin={undefined}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceEntityDesc: sanitizeInput(e.target.value),
                  })
                }
                label="Organization"
                required
              ></Input> */}
              <ReactSelectBox
                value={formData.organization}
                options={organizationList}
                onChange={(e) => {
                  handleOrgChange(e);
                }}
                isDisabled={getHeaderResponse().serviceEntityId}
                label={"Organization*"}
              />
            </div>
            <div>
              {/* <Input
                color="blue"
                value={formData.locationDesc}
                crossOrigin={undefined}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    locationDesc: sanitizeInput(e.target.value),
                  })
                }
                label="Primary Facility"
                required
              ></Input> */}
              <ReactSelectBox
                value={formData.primaryFacility}
                options={facilityList}
                onChange={(e) => {
                  setFormData({ ...formData, primaryFacility: e });
                }}
                label={"Primary Facility*"}
              />
            </div>
            <div>
              <Input
                color="blue"
                value={formData.emailId}
                crossOrigin={undefined}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailId: sanitizeInput(e.target.value),
                  })
                }
                label="Email ID"
                required
              ></Input>
              {formData.emailId && !emailPattern.test(formData.emailId) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter valid email address
                </div>
              )}
            </div>
            <div>
              <Input
                color="blue"
                required={true}
                type="text"
                value={formData.aadharNo}
                crossOrigin={undefined}
                onChange={(e) =>
                  {const sanitizedValue = e.target.value.replace(/[^0-9]/g, "")
                  setFormData({
                    ...formData,
                    aadharNo: sanitizeInput(sanitizedValue),
                  })}
                }
                label="Aadhar No"
                onKeyPress={(e: any) => {
                  if (!/^[0-9]$/.test(e.key)||e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 11) {
                    e.preventDefault();
                  }
                }}
              ></Input>
            </div>
            <div>
              <Input
                color="blue"
                type="text"
                value={formData.priContactNum}
                onChange={(e) =>
                  {const sanitizedValue = e.target.value.replace(/[^0-9]/g, "")
                  setFormData({
                    ...formData,
                    priContactNum: sanitizeInput(sanitizedValue),
                  })}
                }
                crossOrigin={undefined}
                label="Primary Contact No."
                required={true}
                onKeyPress={(e: any) => {
                  if (!/^[0-9]$/.test(e.key)||e.key === "Backspace" || e.key === "Delete") return;
                  if (e.target.value.length > 9) {
                    e.preventDefault();
                  }
                }}
              ></Input>
            </div>
            <div>
              <Input
                onChange={(e) =>
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
                value={formData.panNo}
                color="blue"
                crossOrigin={undefined}
                label="PAN No."
              ></Input>
              {formData.panNo && !panNoPattern.test(formData.panNo) && (
                <div className="absolute text-xs ml-1 text-red-500">
                  Please enter valid Pan number !
                </div>
              )}
            </div>
            <div>
              <ReactSelectBox
                value={formData.employeType}
                options={empProfileList}
                onChange={(e) => setFormData({ ...formData, employeType: e })}
                label={"Employee Profile Type*"}
              />
            </div>
            <div>
              <Input
                color="blue"
                onChange={(e:any) =>
                  {if(e.target.value.length>16){
                     e.preventDefault()
                     return
                  }
                  setFormData({
                    ...formData,
                    licenceNum: sanitizeInput(e.target.value),
                  })}
                }
                value={formData.licenceNum}
                crossOrigin={undefined}
                label="HIP-ID / Licence No."
              ></Input>
            </div>
            <div>
              <ReactSelectBox
                value={formData.employeeAssignDeptSet}
                options={departmentList}
                onChange={(e: any) => {
                  setFormData({ ...formData, employeeAssignDeptSet: e });
                }}
                label={"Department*"}
                isSearchable={true}
              />
            </div>
            <div>
              <ReactSelectBox
                value={formData.designation}
                options={designationList}
                onChange={(e: any) => {
                  setFormData({ ...formData, designation: e });
                }}
                label={"Designation*"}
                isSearchable={true}
              />
            </div>
            <div>
              <Input
                color="blue"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: sanitizeInput(e.target.value),
                  })
                }
                disabled={actionsData.actionType == "Save" ? false : true}
                value={formData.username}
                crossOrigin={undefined}
                label="Username"
                required
              ></Input>
            </div>
            <div>
              <CheckboxMui
                label="Is Active"
                checked={formData.isActive == 0 ? true : false}
                handleChange={() => {
                  setFormData({
                    ...formData,
                    isActive: formData.isActive == 0 ? 1 : 0,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-6 justify-end item-end">
          {isSaveEnabled ? (
            <ActionButton
              buttonText={actionsData.actionType}
              disabled={true}
              width="w-[110px] py-3"
            />
          ) : (
            <ActionButton
              buttonText={actionsData.actionType}
              handleSubmit={onSave}
              width="w-[110px] py-3"
              disabled={
                // formData.imageData &&
                  // formData.eSignature &&
                  formData.title &&
                  formData.lastName &&
                  namePattern.test(formData.lastName) &&
                  namePattern.test(formData.middleName) &&
                  formData.firstName && namePattern.test(formData.firstName) &&
                  formData.gender &&
                  formData.dateOfBirth &&
                  formData.bloodGroup &&
                  formData.dateOfJoining &&
                  formData.empCategory &&
                  formData.organization &&
                  formData.primaryFacility &&
                  formData.emailId && emailPattern.test(formData.emailId)&&
                  formData.aadharNo.length==12 &&
                  formData.priContactNum .length==10&&
                  // panNoPattern.test(formData.panNo)&&
                  formData.employeType&&
                  formData.employeeAssignDeptSet &&
                  formData.username &&
                  formData.designation
                  ? false
                  : true
              }
            />
          )}
          <ActionButton
            buttonText="Reset"
            width="w-[110px] py-3 "
            handleSubmit={() => {
              handleReset(setFormData, setActionsData);
            }}
          />
        </div>
      </div>
    </div>
  );
}
