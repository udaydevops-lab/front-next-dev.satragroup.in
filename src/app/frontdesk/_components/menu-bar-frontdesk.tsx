"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import HomeIcon from "public/images/home.png";
import addEncounter from "public/images/add-encounter.png";
import EnterIDimage from "public/images/EnterID.png";
import idimage from "public/images/ID.png";
import Search_1image from "public/images/Search-1.png";
import stethoscopeimage from "public/images/stethoscope.png";
import PatientRegister from "public/images/patient-registeration.png";
import report from "../../../../public/images/doctor-dashboard/report.png";
import scanqr from "../../../../public/images/doctor-dashboard/scanqr.png";
import DashboardSummaryComponent from "../dashboard/_components/dashboard-summary";
import healthconsentrequest from "../../../../public/images/doctor-dashboard/healthconsentrequest.png";
import masterdata from "../../../../public/images/doctor-dashboard/masterdata.png";
import VerticalComponent from "../dashboard/_components/vertical-line";
import carecontext from "../../../../public/images/doctor-dashboard/carecontext.png";
import CircularShadedButton from "../dashboard/_components/circular_shaded_button";

import DashboardStaticData from "../dashboard/_components/dashboardStaticData";
import { useRouter, usePathname, useParams } from "next/navigation";
import moment from "moment";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import services from "@/app/utilities/services";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import ReportIcon from "public/images/report.png";
import BillIcon from "public/images/bill.png";
import OPIcon from "public/images/op.png";
function MenuBarFrontDesk() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const [currTime, setCurrTime] = useState(moment());
  const { getLanData } = PatientDatadataAuth();
  const [realtimeData, setRealtimeData] = useState({});

  useEffect(() => {
    // var sse: any = new EventSource('http://10.10.10.97:8005/subscribe?subId=123');//, { withCredentials: true });
    // function getRealtimeData(data: any) {
    //     setRealtimeData(data);
    // }
    // sse.onopen = (e: any) => {
    // };
    // sse.addEventListener('message', (event: any) => {
    //     const eventData = JSON.parse(event.data);
    //     let data = eventData.message.replace(/=/g, ':')
    //         .replace(/(\w+)(?=\s*[:,])/g, '"$1"');
    //     );
    // });
    // sse.onmessage = (e: any) => {
    //     const eventData = JSON.parse(e.data);
    //     getRealtimeData(eventData);
    // };
    // sse.onerror = () => {
    //     sse.close();
    // };
    // return () => {
    //     sse.close();
    // };
  }, []);
  const pathParams = useParams();
  const isActive = (path: any) => {
    if (path === lastSegment) {
      return true;
    } else {
      return pathname === path ? true : "";
    }
    // status={isActive('/abha/abha-health-id')}
  };

  const pushTo = (type: string) => {
    switch (type) {
      case "outpatient-encounter":
        router.push("/encounter/0/0/0/outpatient-encounter");
        break;
      case "frontdesk-dashboard":
        router.push("/frontdesk/dashboard");
        break;
      case "abha-login":
        router.push("/abha/login");
        break;
      case "new-abha-health-id":
        router.push("/abha/new-abha-health-id");
        break;
      case "search-update-patient":
        router.push("/patient/search-update-patient");
        break;
      case "dept-wise-physician-list":
        router.push("/dept-wise-doctors-list");
        break;
      case "patient-registration":
        router.push("/patient/0/0/patient-Registration");
        break;
      case "results":
        router.push("/results");
        break;
      case "hiu-consent-observation":
        router.push("/hiu/consent-observation");
        break;
      case "hiu-consent-form":
        router.push("/hiu/consent-request-form");
        break;
      case "hiu-discharge-summary":
        router.push("/hiu/discharge-summary");
        break;
      case "hiu-immunization":
        router.push("/hiu/immunization-record");
        break;
      case "hiu-consent-request":
        router.push("/hiu/new-consent-request");
        break;
      case "hiu-prescription":
        router.push("/hiu/prescription");
        break;
      case "hiu-report":
        router.push("/hiu/report-data");
        break;
      case "masterdata":
        // setTabActive(pathname)
        router.push("/configuration/all_master");
        break;
      case "md-report":
        // setTabActive(pathname)
        router.push("/configuration/cpoe_master");
        break;
      case "reports":
        router.push("/reports");
        break;
      case "billing-details":
        router.push("/billing-details/bill-worklist");
        break;
      case "op-recept":
        router.push("/op-recept");
        break;
      case "carecontext":
        router.push(`/abha/${pathParams.patientid ? pathParams.patientid : 0}/${pathParams.opdEncounterId ? pathParams.opdEncounterId : 0}/new-abha-linking-token`);
        break;
      case "scan-qr":
        router.push("/scan-qr");
        break;
      case "appointment":
        router.push("/appointment/0/0");
        break;
      default:
        break;
    }
  };

  // fetch the page links here and get the output with boolean
  const tabActive = (href: any) => pathname === href;

  const menubarLinks = [
    {
      pageName: "HCR",
      pageLink: "/hiu/new-consent-request",
      tooltipInfo: "HCR",
    },
    {
      pageName: "MD",
      pageLink: "/configuration/all_master",
      tooltipInfo: "Master Data",
    },
  ];

  return (
    <div>
      <div className="sticky top-0 min-h-full module-header-wrapper z-999">
        <div className="w-full mx-auto max-w-7xl">
          <div className="relative">
            <div className="menu-wrapp px-4 bg-white rounded-lg md:pt-2 p-2  mx-auto w-full border border-stroke">
              <div>
                <div className="flex flex-wrap items-center">
                  <div className="flex flex-wrap md:flex-shrink-0">
                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={HomeIcon}
                          info={"Home Dashboard"}
                          status={isActive("/frontdesk/dashboard")}
                          onButtonClick={() => {
                            pushTo("frontdesk-dashboard");
                          }}
                        />
                      </div>
                    </div>
                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={addEncounter}
                          info={"New Encounter"}
                          status={isActive("outpatient-encounter")}
                          onButtonClick={() => {
                            pushTo("outpatient-encounter");
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={idimage}
                          info={"Create ABHA Number"}
                          status={isActive("/abha/create-abha")}
                          onButtonClick={() => {
                            pushTo("abha-health-id");
                          }}
                        />
                      </div>
                    </div> */}

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto flex-initial">
                        <CircularShadedButton
                          icon={EnterIDimage}
                          info={"ABHA Verification"}
                          status={isActive("/abha/login")}
                          onButtonClick={() => {
                            pushTo("abha-login");
                          }}
                        />
                      </div>
                    </div>



                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                                <CircularShadedButton
                                                    onButtonClick={() => {
                                                        pushTo("search-update-patient");
                                                    }}
                                                    icon={Search_1image}
                                                    info={"Search Patient"}
                                                    status={isActive("/patient/search-update-patient")}
                                                />
                                            </div>
                                        </div> */}

                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                                <CircularShadedButton
                                                    icon={stethoscopeimage}
                                                    info={"Dept. wise Physician List"}
                                                    status={isActive("/dept-wise-doctors-list")}
                                                    onButtonClick={() => {
                                                        pushTo("dept-wise-physician-list");
                                                    }}
                                                />
                                            </div>
                                        </div> */}
                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={report}
                          info={"Results Entry"}
                          status={isActive("results")}
                          onButtonClick={() => {
                            pushTo("results");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={PatientRegister}
                          info={"Patient Registration"}
                          status={isActive("/patient/0/0/patient-Registration")}
                          onButtonClick={() => {
                            pushTo("patient-registration");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={healthconsentrequest}
                          info={"Health Consent Request"}
                          status={isActive("/hiu/new-consent-request")}
                          onButtonClick={() => {
                            pushTo("hiu-consent-request");
                          }}
                        />
                      </div>
                    </div>

                    {/* Apha login context */}
                    <div className="max-w-md mx-3  module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={carecontext}
                          // info={
                          //   getLanData?.topheader &&
                          //   getLanData.topheader?.carecontext
                          // }
                          info="Carecontext"
                          status={isActive(`/abha/${pathParams.patientid ? pathParams.patientid : 0}/${pathParams.opdEncounterId ? pathParams.opdEncounterId : 0}/abha-linking-token`)}
                          onButtonClick={() => {
                            pushTo("carecontext");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={masterdata}
                          info={"Master Data"}
                          status={isActive("/configuration/all_master")}
                          onButtonClick={() => {
                            pushTo("masterdata");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto flex-initial">
                        <CircularShadedButton
                          icon={ReportIcon}
                          info={"Reports"}
                          status={isActive("/reports")}
                          onButtonClick={() => {
                            pushTo("reports");
                          }}
                          />
                        </div>
                      </div>
                     <div className="max-w-md mx-3 module-elips-wrapper">
                       <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={idimage}
                          info={"Create New ABHA"}
                          status={isActive("/abha/new-abha-health-id")}
                          onButtonClick={() => {
                            pushTo("new-abha-health-id");
                          }}
                        />
                      </div>
                    </div>
                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto flex-initial">
                        <CircularShadedButton
                          icon={BillIcon}
                          info={"OP Bill details"}
                          status={isActive("/billing-details/bill-worklist")}
                          onButtonClick={() => {
                            pushTo("billing-details");
                          }}
                          />
                        </div>
                      </div>
                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <CircularShadedButton
                          icon={scanqr}
                          info={"Share Profile QR"}
                          status={isActive("scan-qr")}
                          onButtonClick={() => {
                            pushTo("scan-qr");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto flex-initial">
                        <CircularShadedButton
                          icon={OPIcon}
                          info={"OP Receipt"}
                          status={isActive("/op-recept")}
                          onButtonClick={() => {
                            pushTo("op-recept");
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto flex-initial">
                        <CircularShadedButton
                          icon={OPIcon}
                          info={"Appointment"}
                          status={isActive("/appointment/0/0")}
                          onButtonClick={() => {
                            pushTo("appointment");
                          }}
                        />
                      </div>
                    </div>

                    {/* {menubarLinks.map((items: any) => (
                      <>
                        <div className="max-w-md mx-3 module-elips-wrapper">
                          <div className="relative w-auto  flex-initial">
                            <Tooltip
                              title={items.tooltipInfo}
                              color="primary"
                              placement="top"
                              arrow
                            >
                              <Link
                                href={items.pageLink}
                                className={`${
                                  tabActive(items.pageLink)
                                    ? "img-cnfig-active text-white"
                                    : "text-blue"
                                } img-cnfig 
                                                                 p-2 text-sm hover:text-white bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all`}
                              >
                                {items.pageName}
                              </Link>
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    ))} */}

                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                           
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all " onClick={() => {
                                                        pushTo("hiu-consent-observation");
                                                    }}>
                                                HCO
                                            </div>
                                        </div> */}
                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all " onClick={() => {
                                                        pushTo("hiu-consent-form");
                                                    }}>
                                                HCF
                                            </div>
                                            </div>
                                        </div> */}
                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all " onClick={() => {
                                                        pushTo("hiu-discharge-summary");
                                                    }}>
                                                HDS
                                            </div>
                                            </div>
                                        </div> */}
                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all "onClick={() => {
                                                        pushTo("hiu-immunization");
                                                    }}>HI
                                            </div>
                                            </div>
                                        </div> */}

                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all "onClick={() => {
                                                        pushTo("hiu-prescription");
                                                    }}>HP
                                            </div>
                                            </div>
                                        </div> */}
                    {/* <div className="max-w-md mx-3 module-elips-wrapper">
                                            <div className="relative w-auto  flex-initial">
                                            <div className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all "onClick={() => {
                                                        pushTo("hiu-report");
                                                    }}>HRD
                                            </div>
                                            </div>
                                        </div> */}
                  </div>
                  <div className="flex flex-1"></div>
                  <div className="innermenuset flex flex-wrap flex-row">
                    {/* <VerticalComponent /> */}
                    <DashboardSummaryComponent getLanData={getLanData} />
                    <DashboardStaticData />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBarFrontDesk;
