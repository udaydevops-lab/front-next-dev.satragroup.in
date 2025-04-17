"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

import Image from "next/image";
import user from "../../public/images/ABHAImages/user.jpg";
import qrCodeScanning from "../../public/images/ABHAImages/qrCodeScanning.png";
import patientIdCard from "../../public/images/ABHAImages/patientIdCard.png";
import ActionButton from "../../_common/button";
import services from "../../utilities/services";
import {
  getPatientProfileByAadhaarMobile,
  getPatientQRCodeByAadharMobile,
  getPatientIdCardByAadhaarMobile,
} from "../../utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import Loader from "@/app/_common/loader";
import FrontDeskAuth from "@/app/_commonfeatures/protectedRoute/FrontDeskAuth";

const AbhaLogin = (props: any) => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [QRData, setQRData] = useState({
    image: "",
  });

  useEffect(() => {
    setLoading(true);
    let postObj = {
      "X-Token": getLocalItem("abhaLoginToken"),
    };
    services
      .create(getPatientProfileByAadhaarMobile, postObj)
      .then((response) => {
        setLoading(false);
        let profileData = JSON.stringify(response.data);
        if (typeof localStorage !== "undefined") {
          setLocalItem("profileData", profileData);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .create(getPatientQRCodeByAadharMobile, postObj)
      .then((response) => {
        setLoading(false);
        setQRData(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .create(getPatientIdCardByAadhaarMobile, postObj) ///write condition accroding to new-abha-profile
      .then((response) => {
        setLoading(false);
        const link = document.createElement("a");
        link.setAttribute(
          "href",
          "data:application/pdf;base64," + response.data.doc
        );
        link.setAttribute("download", "ABHA_HealthCard.pdf");
        link.click();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full mx-auto max-w-7xl py-4 md:py-2 2xl:py-2">
      {loading ? <Loader /> : ""}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="rounded-curve  col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div>
            {/* -------- */}
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
              <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                <div className="text-stone-400">ABHA Number</div>
                <div className="font-sans">+91 XXXX XXX XXX</div>
              </div>

              <div className="col-span-12 bg-blue px-5 pt-7.5 pb-5 dark:bg-boxdark sm:px-7.5  xl:col-span-4">
                <div className="text-stone-400">ABHA Address</div>
                <div className="font-sans">user1@cpm</div>
              </div>
              <div className=" col-span-12 -blue px-5 pt-7.5 pb-5 sm:px-7.5  xl:col-span-4">
                <div className="text-stone-400">Name</div>
                <div className="font-sans">1234-1234-1234</div>
              </div>
            </div>

            {/* -------- */}
          </div>
        </div>

        <div className="rounded-curve   col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5  xl:col-span-4">
          <div>
            <div id="chartTwo" className="-ml-5 py-5">
              Chart Two
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
            >
              <Tab label="Profile" {...a11yProps(0)} />
              <Tab label="QR Code" {...a11yProps(1)} />
              <Tab label="ABHA Card" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="rounded-curve  col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                    <div>
                      <Image
                        src={user}
                        alt="photo"
                        width={120}
                        height={120}
                        className="w-32 rounded-full border-2"
                      />
                    </div>
                    <div style={{ marginTop: "20px" }}>Lalith Goswani</div>
                    <div style={{ width: "100px", marginTop: "20px" }}>
                      <ActionButton buttonText="Register" />
                    </div>
                  </div>
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-8">
                    <div className="w-full">
                      <div className="block w-full overflow-x-auto">
                        <div className="space-x-6 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            Gender
                          </div>
                          <div className="w-3/6 px-4 py-2 text-slate-900">
                            Male
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            Date of Birth
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            07/21/1989
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            Mobile
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            90998787765
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            Address
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            2-1-23/4, Vijaya Colony, Madhapur, Hyderabad
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            Email
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            lalith@gmail.com
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            ABHA Number
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            1234-1234-1234
                          </div>
                        </div>

                        <div className="space-x-5 hidden sm:flex">
                          <div className="w-1/6 px-4 py-2 text-stone-400">
                            ABHA Address
                          </div>
                          <div className="w-3/56 px-4 py-2 text-slate-900">
                            lalith92@cpm
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="rounded-curve  col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                    <div>
                      {QRData ? (
                        <Image
                          src={"data:image/png;base64," + QRData.image}
                          alt="qrCodeScanning"
                          width={120}
                          height={120}
                        />
                      ) : (
                        <Image
                          src={qrCodeScanning}
                          alt="qrCodeScanning"
                          width={120}
                          height={120}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className="rounded-curve  col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                  <div className="col-span-12-blue px-5 pt-7.5 pb-5 sm:px-7.5 xl:col-span-4">
                    <div>
                      <Image
                        src={patientIdCard}
                        alt="qrCodeScanning"
                        width={120}
                        height={120}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default FrontDeskAuth(AbhaLogin);
