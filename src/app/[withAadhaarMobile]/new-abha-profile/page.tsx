"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import "react-toastify/dist/ReactToastify.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

import Image from "next/image";
import ActionButton from "../../_common/button";
import services from "../../utilities/services";
import { useParams, useRouter } from "next/navigation";

import {
  getPatientQRCodeByAadharMobile,
  getExistingPatient,
  updateExistingPatient,
  deleteAbha,
  getPatientProfileImage,
  updateAbhaAddressByMrn,
  getPatientProfileByAadhaarMobile,
  getPatientProfileByAbhaAddress,
  getPatientIdCardByAadhaarMobile,
  getPatientIdCardByAbhaAddress,
  getQrByAbhaNumAbhaAddress,
} from "../../utilities/api-urls";
import Loader from "../../_common/loader";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Tooltip,
} from "@material-tailwind/react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { LinkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import moment from "moment";
import { getLocalItem, setLocalItem } from "../../utilities/local";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
function AbhaProfile(props: any) {
  const router = useRouter();
  const [value, setValue] = React.useState(0);
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
    ABHANumber: "",
    healthId: "",
    abhaNumber: "",
    abhaAddress: "",
    fullName: "",
    preferredAbhaAddress: "",
  });
  const [phrAddress, setPhrAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(0);
  const [completeResp, setCompleteResp] = useState<any>([]);
  const [QRData, setQRData] = useState("");
  const [existingPatientData, setExistingPatientData] = useState([]);
  const [patientData, setPatientData] = useState<any>([]);
  const [patientMrn, setPatientMrn] = useState<any>("");
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  // const [reRender, setReRender] = useState(true);

  const handleProfileData = () => {
    let data = {
      ...profileData,
      mrn:
        completeResp && completeResp[0] && completeResp[0].mrn
          ? completeResp[0].mrn
          : "",
    };
    data.healthIdNumber = data.abhaNumber || data.ABHANumber
    data.healthId = data.preferredAbhaAddress || data.abhaAddress
    setLocalItem("patType", withAadhaarMobile.toString())
    setLocalItem("profileData", JSON.stringify(data));
    router.push(`/patient/${patientId}/0/patient-Registration`);
  };

  const handleTableData = (profileData: any) => {
    let gender = profileData.gender == "M" ? "G1001" : "G1002";
    let name = profileData.fullName || profileData.name
    let healthId = profileData.ABHANumber || profileData.abhaNumber
    services
      .get(
        getExistingPatient +
        gender +
        "/" +
        name +
        "/" +
        profileData.yearOfBirth +
        "-" +
        profileData.monthOfBirth +
        "-" +
        profileData.dayOfBirth +
        "/" +
        healthId
      )
      .then((response) => {
        setCompleteResp(response.data);
        setPatientData(response.data);
        setPatientMrn(response.data[0].mrn);
        if (response.data[0].healthId) {
          setPatientId(response.data[0].patientId);
          toast.success(`ABHA Number ${response.data[0].healthId} mapped with patient id ${response.data[0].mrn}`)
          localStorage.removeItem("fullName");
          setLocalItem("fullName", response.data[0].fullName);
        } else {
          setExistingPatientData(response.data);
          setPatientData(response.data);
          setPatientMrn(response.data[0].mrn);
          handleOpen();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [abhaCardData, setAbhaCardData] = useState("");
  const handlePatientIdCard = () => {
    let postObj = {};
    if (withAadhaarMobile == "1") {
      postObj = {
        "x-token": getLocalItem("abhaLoginToken"),
      };
    } else {
      postObj = {
        loginHint: withAadhaarMobile,
        "x-token": getLocalItem("abhaLoginToken"),
      };
    }
    setAbhaCardData("");
    setLoading(true);
    services
      .create(
        withAadhaarMobile == "1"
          ? getPatientIdCardByAadhaarMobile
          : getPatientIdCardByAbhaAddress,
        postObj
      )
      .then((response) => {
        setLoading(false);
        // const link = document.createElement("a");
        // link.setAttribute(
        //   "href",
        //   "data:application/pdf;base64," + response.data.doc
        // );
        setAbhaCardData(response.data);
        // link.setAttribute("download", "ABHA_HealthCard.pdf");
        // link.click();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const rows = [
    {
      id: 1,
      status: "Status1",
      orderDetails: "Order Details1",
    },
  ];
  const phrAddresscolumns: GridColDef[] = [
    {
      field: "id",
      headerName: "S No",
      width: 150,
    },
    {
      field: "name",
      headerName: "ABHA Address",
      width: 300,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "mrn",
      headerName: "Patient Id",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 180,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 90,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <>{params.row.gender == "G1001" ? "Male" : "Female"}</>
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "DOB",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <>{moment(params.row.dateOfBirth).format("DD/MM/YYYY")}</>
      ),
    },
    {
      field: "primaryContactNum",
      headerName: "Mobile No.",
      width: 110,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "healthId",
      headerName: "ABHA Number",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex justify-center item-center">
          <div>{params.row.healthId ? params.row.healthId : "-"}</div>
        </div>
      ),
    },
    {
      field: "link",
      headerName: "Link",
      width: 50,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <LinkIcon
            title="link ABHA Number"
            fontSize={"small"}
            className=" "
            onClick={() => handleLinkIcon(params.row)}
          />
        </>
      ),
    },
  ];

  const handleLinkIcon = (row: any) => {
    let putObj = {
      patientId: row.patientId,
      healthId: profileData.healthIdNumber,
    };
    services
      .create(updateExistingPatient, putObj)
      .then((response) => {
        handleOpen();
        toast.success(response.data.statusMessage);
        setPatientId(row.patientId);
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  };
  const DeleteRecord = () => {
    setModaloc({ ...modaloc, open: true });
  };

  const DeleteABHA = () => {
    let postObj = {
      "X-Token": getLocalItem("abhaLoginToken"),
    };
    setLoading(true);
    services
      .create(deleteAbha, postObj)
      .then((response) => {
        setLoading(false);
        setModaloc({ ...modaloc, open: false });
        toast.success("ABHA deleted successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  //Number and email/photo Update
  // const [popState, setPopState] = useState(false);
  // const [title, setTitle] = useState("Confirm");
  // const [popContent, setPopContent] = useState(<></>);
  // const [popSize, setPopSize] = useState<any>("md");
  // const handleMobileEdit = (type?: string) => {
  //   if (type && type == "mobile") {
  //     setPopState(!popState);
  //     setPopSize("md")
  //     setTitle("Confirm")
  //     setPopContent(
  //       <UpdateMobilePopUp
  //         setReRender={setReRender}
  //         setTitle={setTitle}
  //         reRender={reRender}
  //         handleMobileEdit={() => handleMobileEdit("close")}
  //         setPopSize={setPopSize}
  //       />
  //     );
  //   } else if (type && type == "email") {
  //     setPopState(!popState);
  //     setPopSize("md")
  //     setTitle("Confirm")
  //     setPopContent(
  //       <UpdateEmailPopUp
  //         reRender={reRender}
  //         setReRender={setReRender}
  //         setTitle={setTitle}
  //         handleMobileEdit={() => handleMobileEdit("close")}
  //         profileData={profileData}
  //         setPopSize={setPopSize}
  //       />
  //     );
  //   } else {
  //     setPopState(false);
  //   }
  // };

  // update ABHA in Update in Patient Registration
  const { withAadhaarMobile } = useParams();
  const getRowId = (row: any) => row.id;
  useEffect(() => {
    setLoading(true);
    let postObj = {};
    if (withAadhaarMobile == "1") {
      postObj = {
        "x-token": getLocalItem("abhaLoginToken"),
      };
    } else {
      postObj = {
        loginHint: withAadhaarMobile,
        "x-token": getLocalItem("abhaLoginToken"),
      };
    }

    services
      .create(
        withAadhaarMobile == "1"
          ? getPatientProfileByAadhaarMobile
          : getPatientProfileByAbhaAddress,
        postObj
      )
      .then((response) => {
        setLoading(false);
        let profileDataResp = response.data;
        setProfileData(profileDataResp);
        if (typeof localStorage !== "undefined") {
          setLocalItem("txnId", response.data.txnId);
        }
        setLocalItem("healthIdNumber", response.data.abhaNumber);
        let abhaNumber = response.data.abhaNumber || response.data.ABHANumber
        services
          .get(getPatientProfileImage + abhaNumber)
          .then((response: any) => {
            let completeResp = {
              ...profileDataResp,
              profilePhoto: response.data.profilePhoto,
            };
            setProfileData(completeResp);
            const phrAddressresult = completeResp?.phrAddress.map(
              (list: any, index: number) => {
                return { id: index + 1, name: list };
              }
            );
            setPhrAddress(phrAddressresult);
          });
        handleTableData(profileDataResp);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
    services
      .create(
        withAadhaarMobile != "abha-number"
          ? getPatientQRCodeByAadharMobile
          : getQrByAbhaNumAbhaAddress,
        postObj
      )
      .then((response) => {
        setLoading(false);
        setQRData("data:image/png;base64," + response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    handlePatientIdCard();
  }, [setLoading]);

  useEffect(() => {
    const updateAbhaAddressByMrnFun = () => {
      // updateAbhaAddressByMrn
      let postMrnObj = {
        mrn: patientMrn,
        abhaAddress: profileData.preferredAbhaAddress || profileData.abhaAddress,
      };
      if (postMrnObj.abhaAddress && patientMrn) {
        services
          .create(updateAbhaAddressByMrn, postMrnObj)
          .then((response) => {
            console.log("Successfuly updated healthId");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.message);
          });
      }
    };
    updateAbhaAddressByMrnFun();
  }, [profileData, patientMrn]);
  const handleDownload = () => {
    var a = document.createElement("a");
    a.href = "data:image/png;base64," + abhaCardData;
    a.download = "ABHA_Card";
    a.click();
  };
  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className="w-full mx-auto max-w-7xl py-4 md:py-2 2xl:py-2">

      {loading ? <Loader /> : ""}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="rounded-curve  col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 mb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
          <div>
            {/* -------- */}
            <div className="mt-4 grid grid-cols-12 gap-4 md:gap-6  2xl:gap-7.5">
              <div className="col-span-12-blue px-5  sm:px-7.5 xl:col-span-4">
                <div className="text-gray-500">ABHA Number</div>
                <div className="font-sans  py-3">
                  {profileData.abhaNumber || profileData.ABHANumber}

                  {/* 18-2035-7980-4796 for tcl testing*/}
                </div>
              </div>

              <div className="col-span-12 bg-blue px-5  dark:bg-boxdark sm:px-7.5  xl:col-span-4">
                <div className="text-gray-500">ABHA Health Address</div>
                <div className="font-sans flex gap-4  py-3">
                  <span>
                    {profileData.abhaAddress ||
                      profileData.preferredAbhaAddress}
                  </span>
                  <Tooltip content="Primary ABHA Health Address">
                    <CheckBadgeIcon className=" w-6 h-6 text-green-700" />
                  </Tooltip>
                  {/* bhanu123456@sbx fro tcl testing */}
                </div>
              </div>
              <div className=" col-span-12 -blue px-5 sm:px-7.5  xl:col-span-4">
                <div className="text-gray-500">Name</div>
                <div className="font-sans py-3">
                  {profileData.name || profileData.fullName}
                  {/* Bhanuchander for tcl testing */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className="bg-white"
            >
              <Tab className="font-bold" label="Profile" {...a11yProps(0)} />
              <Tab className="font-bold" label="QR Code" {...a11yProps(1)} />
              <Tab className="font-bold" label="ABHA Card" {...a11yProps(2)} />
              {/* As requested by Abdm to comment */}
              {/* <Tab
                className="font-bold"
                label="Delete ABHA"
                {...a11yProps(3)}
              /> */}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div className="-mx-3 md:flex py-2">
                <div className="md:w-1/3 px-3 my-2">
                  <div className="profile-wrap justify-center">
                    <div className="card w-auto mx-auto bg-white dark:bg-slate-850 py-3 rounded-2xl">
                      <Image
                        className="abhaprofileImg w-32 mx-auto rounded-full border-8 bborder-gray-600"
                        src={
                          "data:image/png;base64," + profileData.profilePhoto
                        }
                        alt="photo"
                        width={120}
                        height={120}
                      />
                      {/* <Image
                        src={users}
                        className="abhaprofileImg w-32 mx-auto rounded-full border-8 bborder-gray-600"
                        alt="photo"
                        width={120}
                        height={120}
                      /> for tcl testing  */}
                      <div className="my-3 text-center mt-2 text-2xl font-medium">
                        {" "}
                        {profileData.name}
                        {/* Bhanuchander for tcl testing*/}
                      </div>
                      <div className="my-3 text-center mt-2 text-md font-bold flex justify-center items-center gap-x-2">
                        <div>
                          <Dialog
                            open={open}
                            size="lg"
                            handler={handleOpen}
                            animate={{
                              mount: { scale: 1, y: 0 },
                              unmount: { scale: 0.9, y: -100 },
                            }}
                          >
                            <DialogHeader>
                              There is/are existing patient(s) with this entry
                            </DialogHeader>
                            <DialogBody>
                              <DataGrid
                                autoHeight
                                rows={existingPatientData}
                                columns={columns}
                                getRowId={(row: any) => row.patientId}
                                pageSizeOptions={[10, 30, 50, 100]}
                                slots={{ toolbar: GridToolbar }}
                                density="compact"
                              />
                            </DialogBody>
                            <DialogFooter className="px-4 py-2 border-b-2 border-gray-300">
                              <ActionButton
                                buttonText="Close"
                                handleSubmit={handleOpen}
                                width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                              />
                            </DialogFooter>
                          </Dialog>
                        </div>
                        {patientId === 0 ? (
                          <ActionButton
                            buttonText="Register"
                            handleSubmit={handleProfileData}
                            width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                          />
                        ) : (
                          <div>
                            {completeResp[0].mrn}
                            <span title="Edit details">
                              <EditIcon
                                onClick={handleProfileData}
                                style={{
                                  cursor: "pointer",
                                  width: "30px",
                                  height: "18px",
                                  marginTop: "-3px",
                                }}
                              />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 px-3 my-2">
                  <div className="w-full">
                    {/* ====================== */}
                    <ul className="mt-4 flex flex-wrap text-sm font-medium text-gray-700 dark:text-white sm:text-base w-full">
                      <li className="my-1 flex w-1/4 items-center">Gender</li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.gender}
                      </li>
                      <li className="my-1 flex w-1/4 items-center">
                        Date of Birth
                      </li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.dayOfBirth}/{profileData.monthOfBirth}/
                        {profileData.yearOfBirth}
                        {/* 1987-10-06 for tcl testing */}
                      </li>
                      <li className="my-1 flex w-1/4 items-center">Mobile</li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.mobile}
                        {/* <span title="Edit details">
                          <EditIcon
                            onClick={() => handleMobileEdit("mobile")}
                            style={{
                              cursor: "pointer",
                              width: "30px",
                              height: "18px",
                              marginTop: "-3px",
                            }}
                          />
                        </span> */}
                        {/* 9948543032 for tcl testing */}
                      </li>
                      <li className="my-1 flex w-1/4 items-center">Address</li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.address}, {profileData.pincode}
                        {/* C/O ,Venkateshwarlu Flat Number 504,
                        Siddi Vinayaka Thirtha Apartment Officers Colony,
                        Sainathapuram Opposite To Water Tank A S Rao Nagar Malkajgiri for tcl testing */}
                      </li>
                      <li className="my-1 flex w-1/4 items-center">Email</li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.email}
                        {/* <span title="Edit details">
                          <EditIcon
                            onClick={() => handleMobileEdit("email")}
                            style={{
                              cursor: "pointer",
                              width: "30px",
                              height: "18px",
                              marginTop: "-3px",
                            }}
                          />
                        </span> */}
                        {/* s.bhanu2000@gmail.com for tcl testing */}
                      </li>
                      <li className="my-1 flex w-1/4 items-center">
                        ABHA Number
                      </li>
                      <li className="my-1 flex w-2/3 items-center">
                        {profileData.abhaNumber || profileData.ABHANumber}
                        {/* 18-2035-7980-4796 for tcl testing*/}
                      </li>
                      {/* <li className="my-1 flex w-1/4 items-center">
                        ABHA Address
                      </li> */}
                      <li className="my-1 flex w-2/3 items-center ">
                        {/* {profileData.healthId} */}
                        {/* {phrAddress?.map((list: any, index: number) => (
                          <span key={index} className="pe-2">
                            {list}
                            {index < phrAddress.length - 1 && "," + " "}
                          </span>
                        ))} */}

                        {/* {phrAddress && <DataGrid
                          rows={phrAddress}
                          columns={phrAddresscolumns}
                          getRowId={getRowId}
                          pageSizeOptions={[10, 20]}
                          className="px-0"
                          density="compact"
                        />
                        } */}
                        {/* bhanu123456 for tcl testing*/}
                      </li>
                      <li></li>
                      {/* <li className="my-1 flex w-2/3 items-center text-md mt-3  text-blue-500">
                        KYC AND LINK Mode
                      </li> */}
                      <li>.</li>
                      {/* <div className="flex w-full">
                        <li className="my-1 flex w-1/3 items-center">
                          <Radio
                            crossOrigin={undefined}
                            {...register("auth")}
                            name="auth"
                            label="DEMOGRAPHICS"
                            value={"Aadhar_OTP"}
                          />
                        </li>
                        <li className="my-1 flex w-1/3 items-center">
                          <Radio
                            crossOrigin={undefined}
                            {...register("auth")}
                            label="MOBILE OTP"
                            value={"Mobile_OTP"}
                          />
                        </li>
                        <li className="my-1 flex w-1/4 items-center">
                          <ActionButton color="red" buttonText="Share" />
                        </li>
                      </div> */}
                    </ul>
                  </div>
                  {/* <div className="w-full">
                    <h2>ABHA Address</h2>
                    {phrAddress && (
                      <DataGrid
                        rows={phrAddress}
                        columns={phrAddresscolumns}
                        getRowId={getRowId}
                        pageSizeOptions={[10, 20]}
                        className="px-0"
                        density="compact"
                      />
                    )}
                  </div> */}
                </div>
              </div>
              {/* <div style={{ marginLeft: "1060px" }}>
                <ActionButton
                  buttonText="Linking Token"
                  handleSubmit={() => router.push("/abha-linking-token")}
                />
              </div> */}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                    <div>
                      <Image
                        src={QRData}
                        alt="photo"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue pt-7.5 pb-5">
                    <div style={{ cursor: "pointer" }}>
                      {/* <Image
                        src={patientIdCard}
                        alt="qrCodeScanning"
                        width={120}
                        height={120}
                        onClick={handlePatientIdCard}
                      /> */}
                      {/* <ActionButton
                        buttonText={"Download"}
                        width="w-[150px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handlePatientIdCard}
                      /> */}

                      <div className="">
                        {abhaCardData ? (
                          <>
                            <div className="flex justify-center ps-16">
                              <ActionButton
                                buttonText={"Download"}
                                width="w-[120px] text-white  text-[12px] h-[34px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={() => handleDownload()}
                              />
                            </div>
                            <div>
                              <object
                                data={`data:image/png;base64,${abhaCardData}`}
                                type="image/png"
                                width="1000"
                                height="600"
                              >
                                <div>ABHA Card</div>
                              </object>
                            </div>
                          </>
                        ) : (
                          <>{loading ? <Loader /> : ""}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          {/* As requested by Abdm to comment */}
          {/* <CustomTabPanel value={value} index={3}>
            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span>Would you like to delete your ABHA..?</span>
                      <span style={{ cursor: "pointer" }}>
                        <ActionButton
                          buttonText="Delete"
                          handleSubmit={DeleteRecord}
                          width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel> */}
          <Dialog
            open={modaloc.open}
            handler={() => setModaloc({ ...modaloc, open: false })}
            size={"sm"}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
            className="py-5"
          >
            <DialogHeader className=" justify-center">
              <div className="w-100">
                <div className="text-center text-[20px] text-blue-500">
                  Are you sure,
                </div>
                <div className="text-center text-[20px] text-blue-500">
                  you want to delete your ABHA?
                </div>
              </div>
            </DialogHeader>
            <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
              <strong>Note:</strong>
              Once you delete, your ABHA will be deleted permanently
            </DialogBody>
            <DialogFooter className="text-center justify-center">
              <Button
                variant="gradient"
                color="blue"
                className="mr-2 bg-blue-500 hover:bg-blue-600"
                onClick={DeleteABHA}
              >
                <span>Yes</span>
              </Button>
              <Button
                variant="gradient"
                className="bg-red-500 hover:bg-red-600"
                color="red"
                onClick={() => setModaloc({ ...modaloc, open: false })}
              >
                <span>No</span>
              </Button>
            </DialogFooter>
          </Dialog>
          {/* <div>
            <ReactCommonDialog
              dialogtitle={title}
              open={popState}
              popupClose={handleMobileEdit}
              handler={() => {}}
              size={popSize}
              Content={popContent}
            />
          </div> */}
        </Box>
      </div>
    </div>
  );
}
export default roleInfoScreenData(AbhaProfile, "Ap")