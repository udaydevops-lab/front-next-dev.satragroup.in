"use client";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckboxMui from "@/app/check-box";
import Emblem from "../../../public/icons/national-health-authority/emblem";
import ActionButton from "../_common/button";
import services from "../utilities/services";
import { useParams, useRouter } from "next/navigation";
import { saveNormalRegistration } from "../utilities/api-urls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLocalItem } from "../utilities/local";

export default function PatientConsent(props: any) {
  const [isAbdmCreate, setIsAbdmCreate] = useState(false);
  const [isVoluntary, setIsVoluntary] = useState(false);
  const [isAbhaLinked, setIsAbhaLinked] = useState(false);
  const [isAuthorizeToShare, setIsAuthorizeToShare] = useState(false);
  const [isHealthProcess, setIsHealthProcess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  // const [isConfirmedPurpose, setIsConfirmedPurpose] = useState(false);

  const handleAbdmCreate = () => {
    setIsAbdmCreate(!isAbdmCreate);
  };
  const handleVoluntary = () => {
    setIsVoluntary(!isVoluntary);
  };
  const handleAbhaLinked = () => {
    setIsAbhaLinked(!isAbhaLinked);
  };
  const handleAuthorizeToShare = () => {
    setIsAuthorizeToShare(!isAuthorizeToShare);
  };
  const handleHealthProcess = () => {
    setIsHealthProcess(!isHealthProcess);
  };
  const handleConfirmed = () => {
    setIsConfirmed(!isConfirmed);
  };
  // const handleConfirmedPurpose = () => {
  //   setIsConfirmedPurpose(!isConfirmedPurpose);
  // };

  const params = useParams();
  let patId = params.patientId;

  const router = useRouter();
const {appointmentNum}=useParams()
  const onSave = () => {
    let postObj = {
      isAbdmCreate: isAbdmCreate,
      isVoluntary: isVoluntary,
      isAbhaLinked: isAbhaLinked,
      isAuthorizeToShare: isAuthorizeToShare,
      isHealthProcess: isHealthProcess,
      isConfirmed: isConfirmed,
      // isConfirmedPurpose: isConfirmedPurpose,
    };

    let ret: any = { ...props.data, ...postObj };
    // if (postObj.isConfirmed && postObj.isConfirmedPurpose) {
    if (postObj.isConfirmed) {
      if (patId === "0") {
        services
          .create(saveNormalRegistration, ret)
          .then((response: any) => {
            toast.success("Saved Successfully");
            const appNo=appointmentNum!='0'?appointmentNum:'0'
            router.push(
              `/patient/${response.data.patientId}/${appNo}/patient-Registration`
            );
          })
          .catch((err: any) => {
            console.log(err);
            if (err.response.data.status === 500) {
              toast.error("Please try after sometime");
            }
            if (err.response.status === 400)
              toast.error(err.response.data.statusMessage);
          });
      }
    } else {
    }
  };
  const [loginResponse, setLoginResponse] = useState<any>("");
  useEffect(() => {
    if (
      getLocalItem("loginResponse") !== null &&
      getLocalItem("loginResponse") !== undefined &&
      getLocalItem("loginResponse") !== ""
    ) {
      let val = JSON.parse(getLocalItem("loginResponse")!);
      setLoginResponse(val?.employeename);
    }
    if (props.saveRegData) {
      setIsAbdmCreate(props.saveRegData.isAbdmCreate);
      setIsVoluntary(props.saveRegData.isVoluntary);
      setIsAbhaLinked(props.saveRegData.isAbhaLinked);
      setIsAuthorizeToShare(props.saveRegData.isAuthorizeToShare);
      setIsHealthProcess(props.saveRegData.isHealthProcess);
      setIsConfirmed(props.saveRegData.isConfirmed);
      // setIsConfirmedPurpose(props.saveRegData.isConfirmedPurpose);
    }
  }, []);
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={`rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5
      
      `}
    >
      <ToastContainer />
      <div className="items-center">
        <div className="grid grid-cols-4">
          <div className="text-3xl col-span-3 mt-2 text-left">
            <div>
              <b>Consent Request</b>
            </div>
          </div>
          <div className="-mt-14 -mb-10 ps-20">
            <Emblem />
          </div>
        </div>
      </div>
      <Divider className="mt-5 mb-5" />
      <TableContainer className="h-[300px] overflow-y-auto overflow-x-hidden">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="text-left text-sm">I hereby declare that:</div>
                <div className="flex">
                  <div
                    className={`${patId != "0" ? "pointer-events-none" : ""} `}
                  >
                    <CheckboxMui
                      label=""
                      handleChange={handleVoluntary}
                      checked={isVoluntary}
                      disable={isVoluntary}
                    />
                  </div>
                  <div className="mt-3 text-left">
                    I am voluntarily sharing my Aadhaar Number / Virtual ID
                    issued by the Unique Identification Authority of India
                    <b>(“UIDAI”)</b>, and my dempgraphic information for the
                    purpose of creating an Ayushman Bharat Health Account number
                    (<b>“ABHA number”</b>) and Ayushman Bharat Health Account
                    address (<b>“ABHA Address”</b>). I authorize NHA to use my
                    Aadhaar number / Virtual ID for performing Aadhaar based
                    authentication with UIDAI as per the provisions of the
                    Aadhaar (Targeted Delivery of Financial and other Subsidies,
                    Benefits and Services) Act, 2016 for the aforesaid purpose.
                    I understand that UIDAI will share my e-KYC details, or
                    response of “Yes” with NHA upon successful authentication.
                  </div>
                </div>
                <div className="flex">
                  <div
                    className={`${patId != "0" ? "pointer-events-none" : ""} `}
                  >
                    <CheckboxMui
                      label=""
                      handleChange={handleAbdmCreate}
                      checked={isAbdmCreate}
                    />
                  </div>
                  <div className="mt-3 text-left">
                    I intend to create Ayushman Bharat Health Account Number (
                    <b>“ABHA number”</b>) and Ayushman Bharat Health Account
                    address (<b>“ABHA Address”</b>) using document other than
                    Aadhaar. (Click here to proceed further)
                  </div>
                </div>
                <div className="flex">
                  <div
                    className={`${patId != "0" ? "pointer-events-none" : ""} `}
                  >
                    <CheckboxMui
                      label=""
                      handleChange={handleAbhaLinked}
                      checked={isAbhaLinked}
                    />
                  </div>
                  <div className="mt-3 text-left">
                    I consent to usage of my ABHA address and ABHA number for
                    linking of my legacy (past) health records and
                    those which will be generated during this encounter.
                  </div>
                </div>
                <div className="flex">
                  <div
                    className={`${patId != "0" ? "pointer-events-none" : ""} `}
                  >
                    <CheckboxMui
                      label=""
                      handleChange={handleAuthorizeToShare}
                      checked={isAuthorizeToShare}
                    />
                  </div>
                  <div className="mt-3 text-left">
                    I authorize the sharing of all my health records with
                    healthcare provider(s) for the purpose of providing
                    healthcare services to me during this encounter.
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <div
                      className={`${patId != "0" ? "pointer-events-none" : ""
                        } `}
                    >
                      <CheckboxMui
                        label=""
                        handleChange={handleHealthProcess}
                        checked={isHealthProcess}
                      />
                    </div>
                    <div className="mt-3 text-left">
                      I consent to the anonymization and subsequent use of my
                       health records for public health purposes.
                    </div>
                  </div>
                  <div className="ml-10">
                    <div className="flex">
                      <div
                        className={`${patId != "0" ? "pointer-events-none" : ""
                          } `}
                      >
                        <CheckboxMui
                          label=""
                          handleChange={handleConfirmed}
                          checked={isConfirmed}
                        />
                      </div>
                      <div className="mt-3 text-left">
                        I, {capitalize(loginResponse)}, confirm that I have duly
                        informed and explained the beneficiary of the contents
                        of consent for aforementioned purposes.
                      </div>
                    </div>
                    {/* <div className="flex">
                      <div
                        className={`${patId != "0" ? "pointer-events-none" : ""
                          } `}
                      >
                        <CheckboxMui
                          label=""
                          handleChange={handleConfirmedPurpose}
                          checked={isConfirmedPurpose}
                        />
                      </div>
                      <div className="mt-3 text-left">
                        I,{" "}
                        {`${props.saveRegData
                            ? props.saveRegData?.firstName
                            : props.data?.firstName
                          } ${props.saveRegData
                            ? props.saveRegData?.middleName
                            : props.data?.middleName
                          } ${props.saveRegData
                            ? props.saveRegData?.lastName
                            : props.data?.lastName
                          }`}
                        , have been explained about the consent as stated above
                        and hereby provide my consent for the aforementioned
                        purposes.
                      </div>
                    </div> */}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-6 justify-end flex gap-6">
        {patId === "0" ? (
          <>
            <ActionButton
              buttonText="I Agree"
              // color={isConfirmed && isConfirmedPurpose ? "blue" : "gray"}
              color={isConfirmed ? "blue" : "gray"}
              handleSubmit={onSave}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              // disabled={isConfirmed && isConfirmedPurpose ? false : true}
              disabled={isConfirmed ? false : true}
            />
          </>
        ) : (
          <></>
        )}
        <div className="">
          <ActionButton
            buttonText="Cancel"
            handleSubmit={() => props.setOpen(false)}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>
    </div>
  );
}
