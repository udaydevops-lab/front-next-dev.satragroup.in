"use client";
import ActionButton from "@/app/_common/button";
import DocumentUpload from "@/app/_common/document-upload";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import {
  SaveLocationsByService,
  UpdateLocationsByService,
  getConfigData,
  getEntity,
  getReferalsearchString,
} from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import {
  allowOnlyNumbers,
  allowspacepattern,
  alphaNumWithFewSymbols,
  alphaNumWithHyphen,
  websitepattern,
} from "@/app/utilities/validations";
import { Button, Input } from "@material-tailwind/react";
import Image from "next/image";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";

interface LocationPopprops {
  feilds: any;
  setFeilds: Dispatch<SetStateAction<any>>;
  selectedRowId: any;
  getGridData: any;
  topScroll: any;
}
const LocationPop: React.FC<LocationPopprops> = ({
  feilds,
  setFeilds,
  selectedRowId,
  getGridData,
  topScroll,
}) => {
  const [locationTypeSubList, setLocationTypeSubList] = useState<any>([]);
  const [locationTypeList, setLocationTypeList] = useState<any>([]);
  const [enityList, setEnityList] = useState<any>([]);
  const [referalLocationList, setReferalLocationList] = useState<any>([]);
  const [key, setKey] = useState(99);
  const [loader, setLoader] = useState(false);

  // headers
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = getHeaderResponse();

  //get location type sub
  const getLocationTypeSub = async () => {
    try {
      const response = await services.get(
        getConfigData + "locationSubTypeSub" + "/0"
      );
      const transformedData = response.data.configData;
      setLocationTypeSubList(transformedData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //get location type
  const getLocationType = async () => {
    try {
      const response = await services.get(
        getConfigData + "LocationSubType" + "/0"
      );
      const transformedData = response.data.configData.map((item: any) => ({
        ...item,
        value: item.code,
        label: item.desc,
      }));
      setLocationTypeList(transformedData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // convert image to Base64
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // setfeild image
  const handleDocumentUpload = async (e: any) => {
    let image: any = await toBase64(e.target.files[0]);
    if (image) {
      setFeilds({
        ...feilds,
        locationImage: image,
      });
    }
  };

  // save and Update button functionality
  const handelSave = () => {
    setLoader(true);
    const postObj = {
      locationId:
        feilds.locationId && feilds.locationId ? feilds.locationId : "",
      licenseNum: feilds.licenseNum,
      locationCode: feilds.locationCode,
      locationImage: feilds.locationImage ?? null,
      locationSubType:
        feilds.locationSubType.label !== "Location Sub Type"
          ? feilds.locationSubType.label
          : "",
      locationType:
        feilds.locationType.label !== "Location Type"
          ? feilds.locationType.label
          : "",
      locationWebsite: feilds.locationWebsite,
      locationDesc: feilds.locationDesc,
      serviceEntityId: feilds.organiZation.value,
      organiZation:
        feilds.organiZation.label !== "Organization"
          ? feilds.organiZation.label
          : "",
      referalLocation:
        feilds.referalLocation.label !== "Referal Location"
          ? feilds.referalLocation.label
          : "",
      statusFlag: 1,
      masterAddressTbl: {
        state: feilds.state,
        pincodeId: feilds.pincodeId,
        city: feilds.city,
        country: feilds.country,
        district: feilds.district,
        houseNo: feilds.houseNo,
        mandal: feilds.mandal,
        mobile: feilds.mobile,
        location: feilds.location,
      },
    };

    const url =
      feilds.locationId && feilds.locationId
        ? UpdateLocationsByService
        : SaveLocationsByService;

    const message =
      feilds.locationId && feilds.locationId
        ? "Successfully Updated the Record"
        : "Successfully Added the Record";

    services
      .create(url, postObj, headers)
      .then((response) => {
        setTimeout(() => {
          setLoader(false);
          if(response.data.statusMessage){
            toast.success(response.data.statusMessage);
          }
          getGridData();
          handelCancel();
        }, 2000);
      })
      .catch((err) => {
        setTimeout(() => {
          console.log(err);
          setLoader(false);
          if (err.response.data.statusMessage) {
            toast.error(err.response.data.statusMessage);
          }
          
        }, 1000);
      });
  };

  // reset button functionality
  const handelCancel = () => {
    const num = Math.floor(Math.random() * 999);
    setFeilds({
      organiZation: getHeaderResponse().serviceEntityId? {
            label: getHeaderResponse().serviceEntityDesc,
            value: getHeaderResponse().serviceEntityId,
          }:{label:"Organization*"},
      locationType: { label: "Location Type" },
      locationSubType: { label: "Location Sub Type" },
      referalLocation: { label: "Referal Location" },
      locationCode: "",
      locationDesc: "",
      licenseNum: "",
      pincodeId: "",
      country: "",
      mobile: "",
      district: "",
      state: "",
    });
    setKey(num);
  };

  // input feilds onchange functionality
  const handelNumberFeilds = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue.replace(/\D/g, ""), 10);
    if (!isNaN(numericValue)) {
      setFeilds({ ...feilds, [e.target.name]: numericValue });
    } else {
      setFeilds({ ...feilds, [e.target.name]: "" });
    }
  };

  // input feilds onchange functionality
  const handelFeilds = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeilds({
      ...feilds,
      [e.target.name]: sanitizeInput(e.target.value),
    });
  };

  // pincode onchange functionality
  const handelPincode = async (e: any) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue.replace(/\D/g, ""), 10);
    if (!isNaN(numericValue)) {
      setFeilds({
        ...feilds,
        pincodeId: numericValue,
      });
    } else {
      console.log("HI");
      setFeilds({
        ...feilds,
        pincodeId: "",
      });
    }

    if (e.target.value.length === 6) {
      services
        .get(getConfigData + "Pincode/0/" + e.target.value)
        .then((response: any) => {
          setFeilds({
            ...feilds,
            country: response.data.configData.output1[0].desc,
            district: response.data.configData.output2[0].desc,
            state: response.data.configData.output3[0].desc,
            pincodeId: e.target.value,
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  // Enity data getting  functionality
  const getEnityData = async () => {
    try {
      const response = await services.get(getEntity);
      const transformedData = response.data.map((item: any) => ({
        ...item,
        value: item.id,
        label: item.desc,
      }));
      setEnityList(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Referal search String Data getting functionality
  const getReferalsearchStringData = async () => {
    try {
      const search = feilds.district.toLowerCase();
      const response = await services.get(
        `${getReferalsearchString}?search=${search}`
      );
      const transformedData = response.data.map((item: any) => ({
        ...item,
        value: item.locationDesc,
        label: item.locationDesc,
      }));
      setReferalLocationList(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLocationTypeSub();
    getLocationType();
    getEnityData();
    getReferalsearchStringData();
  }, [feilds.district]);

  useEffect(()=>{
    if(getHeaderResponse().serviceEntityId){
      setFeilds({ ...feilds, organiZation: {
        label: getHeaderResponse().serviceEntityDesc,
        value: getHeaderResponse().serviceEntityId,
      } });
    }else{
      setFeilds({ ...feilds, organiZation: "" });
    }
  },[])
  return (
    <>
      <div className="px-4 bg-white md:py-3 mx-auto w-full" ref={topScroll}>
        <div className="w-full flex" key={key}>
          <div className="w-1/6 md: px-3 upload-usericon flex flex-wrap content-start justify-around overflow-hidden">
            {feilds.locationImage ? (
              <img
                src={feilds.locationImage}
                alt=""
                className="rounded-full w-30 h-30 object-cover"
              />
            ) : (
              <Image
                src="/images/hospetallogo.png"
                alt="photo"
                width={120}
                height={120}
                className="rounded-full w-30 h-30 object-cover"
              />
            )}
            <div className="pt-2 ">
              <DocumentUpload
                labelContent="Attach"
                name="profilePhoto"
                handleChange={handleDocumentUpload}
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>
          <div className="w-5/6 ps-3">
            <div className="w-full mb-4 grid grid-cols-4 gap-4 ">
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.locationCode}
                  type="text"
                  label="Location code"
                  name="locationCode"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                />
                {feilds.locationCode &&
                  typeof feilds.locationCode === "string" &&
                  !alphaNumWithHyphen.test(feilds.locationCode) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.locationDesc}
                  type="text"
                  label="Location Description"
                  name="locationDesc"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (!/^[a-zA-Z0-9_ ]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.locationDesc &&
                  typeof feilds.locationDesc === "string" &&
                  !allowspacepattern.test(feilds.locationDesc) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.licenseNum}
                  type="text"
                  label="Licence No"
                  name="licenseNum"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (!alphaNumWithFewSymbols.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.licenseNum &&
                  typeof feilds.licenseNum === "string" &&
                  !alphaNumWithHyphen.test(feilds.licenseNum) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  crossOrigin
                  value={feilds.locationWebsite}
                  type="text"
                  label="Website"
                  name="locationWebsite"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (!alphaNumWithFewSymbols.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {/* {feilds.locationWebsite &&
                  typeof feilds.locationWebsite === "string" &&
                  !websitepattern.test(feilds.locationWebsite) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )} */}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.pincodeId}
                  label="Pincode"
                  name="pincodeId"
                  onChange={handelPincode}
                  maxLength={6}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (
                      e.target.value.length > 5 ||
                      e.key == "E" ||
                      e.key == "e"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.pincodeId &&
                  typeof feilds.pincodeId === "string" &&
                  !alphaNumWithHyphen.test(feilds.pincodeId) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  crossOrigin
                  value={feilds.houseNo}
                  type="text"
                  label="Address"
                  name="houseNo"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                />
                {feilds.houseNo &&
                  typeof feilds.houseNo === "string" &&
                  !alphaNumWithFewSymbols.test(feilds.houseNo) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  crossOrigin
                  value={feilds.location}
                  type="text"
                  label="Street"
                  name="location"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                />
                {feilds.location &&
                  typeof feilds.location === "string" &&
                  !alphaNumWithFewSymbols.test(feilds.location) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  crossOrigin
                  value={feilds.city}
                  type="text"
                  label="City / Town"
                  name="city"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (
                      !allowspacepattern.test(e.key) ||
                      e.key == "?" ||
                      e.key == "-" ||
                      e.key == "_" ||
                      allowOnlyNumbers.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.city &&
                  typeof feilds.city === "string" &&
                  !allowspacepattern.test(feilds.city) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  crossOrigin
                  value={feilds.mandal}
                  type="text"
                  label="Mandal"
                  name="mandal"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (
                      !allowspacepattern.test(e.key) ||
                      e.key == "?" ||
                      e.key == "-" ||
                      e.key == "_" ||
                      allowOnlyNumbers.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.mandal &&
                  typeof feilds.mandal === "string" &&
                  !allowspacepattern.test(feilds.mandal) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.district}
                  type="text"
                  label="District"
                  name="district"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (
                      !allowspacepattern.test(e.key) ||
                      e.key == "?" ||
                      e.key == "-" ||
                      e.key == "_" ||
                      allowOnlyNumbers.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.district &&
                  typeof feilds.district === "string" &&
                  !allowspacepattern.test(feilds.district) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.state}
                  type="text"
                  label="State"
                  name="state"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  onKeyPress={(e: any) => {
                    if (
                      !allowspacepattern.test(e.key) ||
                      e.key == "?" ||
                      e.key == "-" ||
                      e.key == "_" ||
                      allowOnlyNumbers.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  color="blue"
                />
                {feilds.state &&
                  typeof feilds.state === "string" &&
                  !allowspacepattern.test(feilds.state) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.country}
                  type="text"
                  label="Country"
                  name="country"
                  onChange={handelFeilds}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                  onKeyPress={(e: any) => {
                    if (
                      !allowspacepattern.test(e.key) ||
                      e.key == "?" ||
                      e.key == "-" ||
                      e.key == "_" ||
                      allowOnlyNumbers.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {feilds.country &&
                  typeof feilds.country === "string" &&
                  !alphaNumWithHyphen.test(feilds.country) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
            </div>
            <div className="w-full grid mb-4 grid-cols-2 gap-4">
              <div className="w-full  ">
                <Input
                  required={true}
                  crossOrigin
                  value={feilds.mobile}
                  label="Contact No"
                  name="mobile"
                  onChange={handelNumberFeilds}
                  maxLength={10}
                  containerProps={{
                    className: "!min-w-0",
                  }}
                  color="blue"
                />
                {feilds.mobile &&
                  typeof feilds.mobile === "string" &&
                  !alphaNumWithHyphen.test(feilds.mobile) && (
                    <div className="absolute text-xs ml-1 text-red-500">
                      Please do not enter special characters!
                    </div>
                  )}
              </div>
              <div className=" w-full ">
                <div className="relative my-select">
                  <ReactSelectBox
                    value={feilds.organiZation}
                    options={enityList}
                    isSearchable={true}
                    isMultiple={false}
                    label="Organization*"
                    isDisabled={!getHeaderResponse().isSuperAdmin}
                    onChange={(e: any) => {
                      setFeilds({
                        ...feilds,
                        organiZation: e,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="w-full ">
                <div className="relative my-select">
                  <ReactSelectBox
                    value={feilds.locationType}
                    options={locationTypeList}
                    isSearchable={true}
                    isMultiple={false}
                    label="Location Type"
                    onChange={(e: any) => {
                      setFeilds({
                        ...feilds,
                        locationType: e,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="w-full ">
                <div className="relative my-select">
                  <ReactSelectBox
                    value={feilds.locationSubType}
                    options={locationTypeSubList}
                    isSearchable={true}
                    isMultiple={false}
                    label="Location Sub Type"
                    onChange={(e: any) => {
                      setFeilds({
                        ...feilds,
                        locationSubType: e,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="w-full ">
                <div className="relative my-select">
                  <ReactSelectBox
                    value={feilds.referalLocation}
                    options={referalLocationList}
                    isSearchable={true}
                    isMultiple={false}
                    label="Referal Location"
                    onChange={(e: any) => {
                      setFeilds({
                        ...feilds,
                        referalLocation: e,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='"w-full pb-4 text-center flex justify-end gap-4'>
          <ActionButton
            buttonText={loader ? (
              <>
                <div className='w-full flex justify-center items-center'>
                  <div className="innerBtnloader"></div>
                  </div>
              </>
            ) : (
              <>{feilds.locationId && feilds.locationId ? "Update" : "Save"}</>
            )}
            handleSubmit={handelSave}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              // feilds.organiZation.label !== "Organization*" &&
              feilds?.locationCode &&
              alphaNumWithHyphen.test(feilds?.locationCode) &&
              feilds?.locationDesc &&
              allowspacepattern.test(feilds?.locationDesc) &&
              feilds?.licenseNum &&
              alphaNumWithHyphen.test(feilds?.licenseNum) &&
              feilds?.pincodeId &&
              alphaNumWithHyphen.test(feilds?.pincodeId) &&
              feilds?.country &&
              feilds?.mobile &&
              alphaNumWithHyphen.test(feilds?.mobile) &&
              feilds?.district &&
              feilds?.state
                ? false
                : true
            }
          />

          <ActionButton
            buttonText="Reset"
            handleSubmit={handelCancel}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>
    </>
  );
};

export default LocationPop;
