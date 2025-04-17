"use client";
import Image from "next/image";
import { Radio, ThemeProvider, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import FormPropsTextFields from "../../_common/input";
import { useForm } from "react-hook-form";
import ActionButton from "../../_common/button";
import NewAlert from "../../_common/new-alert";
import OtpField from "../../_common/otp-field";
import abhaloginImg from "../../images/doctor-with-steth.jpg";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  abhaGenerateOTP,
  abhaSubmitOTP,
  resendAbhaLoginOtp,
  searchByHealthId,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { useRouter } from "next/navigation";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import Loader from "@/app/_common/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AadhaarLogin from "./AadhaarLogin";
import AadharNologin from "./AadharNologin";
import MobileNologin from "./MobileNologin";
import Qrlogin from "./Qrlogin";
import NewAhba from "./NewAhba";
import AbhaActiveInactive from "./AbhaActiveInactive";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function AbhaLogin(props: any) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [checkedMobile, setCheckedMobile] = useState(false);
  const [checkedAadhaar, setCheckedAadhaar] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [generate, setGenerate] = useState(true);
  const [otpFromChild, setOtpFromChild] = useState("");
  const [alertMsg, setAlertMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [healthId, setHealthId] = useState();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(99);
  const [tabVal, setTabVal] = useState("ABHA no address");
  const [aadhaarSeconds, setAadhaarSeconds] = useState(0)
  const [aadhaarResend, setAadhaarResend] = useState(true);
  const [aadhaarsendBtn, setAadhaarsendBtn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const handlechangeAadhaar = () => {
    setCheckedAadhaar(!checkedAadhaar);
    if (checkedAadhaar) {
      setAadhaar("Aadhaar");
    } else {
      setAadhaar("");
    }
  };
  handleSubmit((formData) => { });

  const handlechangeMobile = () => {
    setCheckedMobile(!checkedMobile);
    if (checkedMobile) {
      setMobile("Mobile");
    } else {
      setAadhaar("");
    }
  };
  let auth: string = checkedAadhaar ? "AADHAAR_OTP" : "MOBILE_OTP"; //if nothing is selected otp is sent to Aadhaar
  const onGenerateOTP = (data: any) => {
    setHealthId(data.healthId);
    const postObj: { healthid: string; authMethod: string } = {
      healthid: data.healthId,
      authMethod: data.auth,
    };
    services
      .create(abhaGenerateOTP, postObj)
      .then((response) => {
        if (
          response.data ===
          "Error in generating authToken, abha server may be down"
        ) {
          toast.error("Error in generating authToken, abha server may be down");
        }
        if (response.data.txnId) {
          setLoading(false);
          let obj = {
            healthid: postObj.healthid,
          };
          toast.success("OTP sent Successfully");
          setShowOTPField(true);
          setAadhaarSeconds(59);
          setAadhaarResend(true);
          setAadhaarsendBtn(false)
          if (typeof window !== "undefined") {
            setLocalItem("txnId", response.data.txnId);
          }
        } else {
          toast.error(response.data.details[0].message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical error");
        console.log(error.message);
      });
  };
  const txnID: string | null =
    typeof window !== "undefined" ? getLocalItem("txnId") : null;
  var obj: { [k: string]: any } = {};
  obj.txnId = txnID;

  const onSubmitOTP = () => {
    if (otpFromChild.length === 6) {
      obj.otp = window.btoa(otpFromChild);
      obj.healthId = healthId;
      setLoading(true);
      services
        .create(abhaSubmitOTP, obj)
        .then((response: any) => {
          setLoading(false);
          if (response.data) {
            setLocalItem("abhaLoginToken", response.data.token);
            setLocalItem("patientId", response.data.patientId);
            router.push("/abha-profile");
          } else {
            toast.error(JSON.parse(response.data).details[0].message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          toast.error(error.response.data?.details[0]?.message)
        });
    } else {
      toast.error("Please enter 6 digit number");
    }
  };
  useEffect(() => {
    localStorage.removeItem("txnId");
    localStorage.removeItem("abhaLoginToken");
    setGenerate(true);
  }, []);
  const handleInputChange = (e: any) => {
    if (e.target.value.length > 0) {
      setValue("healthId", e.target.value);
      setGenerate(false);
    } else {
      setGenerate(true);
    }
  };

  const handleResend = (data: any) => {
    onGenerateOTP(data)
    // setLoading(true);
    // const postObj: { txnId: string | null; authMethod: string } = {
    //   txnId: getLocalItem("txnId"),
    //   authMethod: data.auth,
    // };
    // services
    //   .create(resendAbhaLoginOtp, postObj)
    //   .then((response) => {
    //     setLoading(false);
    //     if (response.data.txnId) {
    //       setLocalItem("txnId", response.data.txnId);
    //     } else {
    //       toast.error(response.data.details[0].message);
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err.message);
    //   });
  };
  const clearForm = () => {
    reset();
    setShowOTPField(false);
    setValue("healthId", "");
    setAadhaarsendBtn(true)
    setKey((k) => k + 90);
  };
  const otpStatus = () => { };
  // const data = [
  //   {
  //     label: "Aadhaar",
  //     value: "aadhaar",
  //     desc: <AadhaarLogin
  //       FormPropsTextFields={FormPropsTextFields}
  //       handleInputChange={handleInputChange}
  //       register={register}
  //       Radio={Radio}
  //       Button={Button}
  //       handleSubmit={handleSubmit}
  //       onGenerateOTP={onGenerateOTP}
  //       generate={generate}
  //       showOTPField={showOTPField}
  //       OtpField={OtpField}
  //       handleResend={handleResend}
  //       setOtpFromChild={setOtpFromChild}
  //       otpStatus={otpStatus}
  //       ActionButton={ActionButton}
  //       onSubmitOTP={onSubmitOTP}
  //       clearForm={clearForm}
  //     />,
  //   },
  //   {
  //     label: "ABHA Address",
  //     value: "aBHAAddress",
  //     desc: `Because it's about motivating the doers. Because I'm here
  //     to follow my dreams and inspire other people to follow their dreams, too.`,
  //   },
  // ]

  const tabData = [
    {
      label: "ABHA",
      value: "ABHA no address",
    },
    {
      label: "Aadhaar",
      value: "Aadhaar No",
    },
    {
      label: "Mobile",
      value: "Mobile No",
    },
    ...(isAdmin ? [
      {
        label: "ABHA Actions",
        value: "activeInactive",
      }
    ] : []),
  ];
  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <ThemeProvider>
        <main className="">
          {loading ? <Loader /> : ""}
          <div className="flex-1 p-0">
            <div className=" grid gap-2 grid-cols-2 min-h-full bg-white rounded-curve">
              <div className="w-auto hidden md:flex lg:flex abhalogin-wrap ">
                <Image className="abhaloginimg" src={abhaloginImg} alt="icon" />
              </div>
              <div className="w-full bg-white pt-2 p-1 ">
                <h2 className="mb-8 text-2xl font-semibold text-center text-gray-700 dark:text-white" >
                  ABHA Verification
                </h2>
                {/* tabs code start */}
                <Tabs value={tabVal}>
                  <TabsHeader>
                    {tabData.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setTabVal(value)}>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                  <TabsBody>
                    {tabData.map(({ value }) => (
                      <TabPanel key={value} value={value}>
                        {tabVal === "ABHA no address" && (
                          // // v1 version code
                          // <AadhaarLogin
                          //   FormPropsTextFields={FormPropsTextFields}
                          //   handleInputChange={handleInputChange}
                          //   register={register}
                          //   Radio={Radio}
                          //   Button={Button}
                          //   handleSubmit={handleSubmit}
                          //   onGenerateOTP={onGenerateOTP}
                          //   generate={generate}
                          //   showOTPField={showOTPField}
                          //   OtpField={OtpField}
                          //   handleResend={handleResend}
                          //   setOtpFromChild={setOtpFromChild}
                          //   otpStatus={otpStatus}
                          //   ActionButton={ActionButton}
                          //   onSubmitOTP={onSubmitOTP}
                          //   clearForm={clearForm}
                          //   getValues={getValues}
                          //   key={key}
                          //   aadhaarSeconds={aadhaarSeconds}
                          //   setAadhaarSeconds={setAadhaarSeconds}
                          //   aadhaarResend={aadhaarResend}
                          //   setAadhaarResend={setAadhaarResend}
                          //   aadhaarsendBtn={aadhaarsendBtn}
                          // />

                          // v3 version code
                          <NewAhba />
                        )}
                        {tabVal === "Aadhaar No" && <AadharNologin />}
                        {tabVal === "Mobile No" && <MobileNologin />}
                        {tabVal === "activeInactive" && isAdmin && <AbhaActiveInactive />}
                        {/* {tabVal === "qr scan" && <Qrlogin />} */}
                      </TabPanel>
                    ))}
                  </TabsBody>
                </Tabs>

                {/* tabs code end */}

                <div
                  key={key}
                  className="grid grid-cols-6 gap-4 sm-grid-cols-10 md-grid-cols-10"
                >
                  <div className="col-start-2 col-span-4 py-2 columns-4xl lg-px-8 px-2">
                    {/* <h2 className="mb-8 text-2xl font-semibold text-left text-gray-700 dark:text-white">
                    ABHA Login
                  </h2> */}
                    {/* <Tabs value="html" className="max-w-[40rem]">
                  <TabsHeader
                    className="bg-transparent"
                    indicatorProps={{
                      className: "bg-gray-900/10 shadow-none !text-gray-900",
                    }}
                  >
                    {data.map(({ label, value }) => (
                      <Tab key={value} value={value}>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                  <TabsBody>
                    {data.map(({ value, desc }) => (
                      <TabPanel key={value} value={value}>
                        {desc}
                      </TabPanel>
                    ))}
                  </TabsBody>
                </Tabs> */}
                    {/* <form method="POST" className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
                  <div className="card w-auto mx-auto bg-white dark:bg-slate-850 py-3 rounded-2xl">
                    <div className="relative input-width">
                      <FormPropsTextFields
                        crossOrigin={undefined}
                        type="text"
                        handleChange={handleInputChange}
                        label="ABHA Number/Address"
                        {...register("healthId")}
                        required={true}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-blue-200 rounded-lg focus:outline-blue-200 focus:border-blue-500"
                      />
                      <span className="demo text-blue-gray-700 absolute right-5 inset-y-1/4 flex items-center">
                        @sbx
                      </span>
                    </div>

                    <div className="mx-auto grid mt-6">
                      <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Authorization Type :
                      </label>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <Radio
                          crossOrigin={undefined}
                          {...register("auth")}
                          label="Mobile"
                          value={"Mobile_OTP"}
                        />
                      </div>
                      <div className="md:w-1/2 px-3">
                        <Radio
                          crossOrigin={undefined}
                          {...register("auth")}
                          name="auth"
                          label="Aadhaar"
                          value={"Aadhar_OTP"}
                        />
                      </div>
                    </div>
                    <div className="mx-auto grid ">
                      <Button
                        onClick={handleSubmit(onGenerateOTP)}
                        type="submit"
                        disabled={generate}
                        className="full lg cursor-pointer  px-4 block mb-4 transition w-full text-center rounded   !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      >
                        Generate OTP
                      </Button>
                    </div>
                    {showOTPField ? (
                      <div className="flex flex-col space-y-16">
                        <OtpField
                          onResendOTP={handleSubmit(handleResend)}
                          setOtpFromChild={setOtpFromChild}
                          otpStatus={otpStatus}
                        />
                      </div>
                    ) : null}
                    {showOTPField ? (
                      <div className="mt-4">
                        <div className="flex gap-4 w-full">
                          <ActionButton
                            buttonText="Login"
                            handleSubmit={onSubmitOTP}
                            width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                          />
                          <ActionButton
                            buttonText="Reset"
                            handleSubmit={clearForm}
                            width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </form> */}



                    {/* <AadhaarLogin
                    FormPropsTextFields={FormPropsTextFields}
                    handleInputChange={handleInputChange}
                    register={register}
                    Radio={Radio}
                    Button={Button}
                    handleSubmit={handleSubmit}
                    onGenerateOTP={onGenerateOTP}
                    generate={generate}
                    showOTPField={showOTPField}
                    OtpField={OtpField}
                    handleResend={handleResend}
                    setOtpFromChild={setOtpFromChild}
                    otpStatus={otpStatus}
                    ActionButton={ActionButton}
                    onSubmitOTP={onSubmitOTP}
                    clearForm={clearForm}
                  /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
}

export default roleInfoScreenData(AbhaLogin, "Al")