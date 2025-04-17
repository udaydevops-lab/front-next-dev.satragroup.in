"use client";

import CircularShadedButton from "@/app/frontdesk/dashboard/_components/circular_shaded_button";
import DashboardSummaryComponent from "@/app/frontdesk/dashboard/_components/dashboard-summary";
import DashboardStaticData from "@/app/frontdesk/dashboard/_components/dashboardStaticData";
import VerticalComponent from "@/app/frontdesk/dashboard/_components/vertical-line";
import React from "react";
import search from "../../../../public/images/doctor-dashboard/search.png";
import report from "../../../../public/images/doctor-dashboard/report.png";
import calendar from "../../../../public/images/doctor-dashboard/calendar.png";
import calendar_1 from "../../../../public/images/doctor-dashboard/calender_1.png";
import outpatient from "../../../../public/images/doctor-dashboard/outpatient.png";
import carecontext from "../../../../public/images/doctor-dashboard/carecontext.png";
import HomeIcon from "public/images/home.png";
import { useRouter, usePathname, useParams } from "next/navigation";
import DashboardSummaryDoctorComponent from "./dashboard-summary-doctor";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import healthconsentrequest from "../../../../public/images/doctor-dashboard/healthconsentrequest.png";

export default function MenuBarDoctor() {
  // language data passing here by contextapi
  const { menuStatus, getLanData } = PatientDatadataAuth();

  const router = useRouter();
  const pathname = usePathname();
  const pathParams = useParams();
  const isActive = (href: any) => {
    return pathname === href ? true : "";
  };
  const pushTo = (type: string) => {
    switch (type) {
      case "doctor-dashboard":
        router.push("/doctor/dashboard");
        break;
      case "results-view":
        if (pathname != `/doctor/dashboard`) {
          router.push(
            `/emr/${pathParams.patientid}/${pathParams.opdEncounterId}/results-view`
          );
        } else {
          router.push(`/emr/0/0/results-view`);
        }
        break;

      case "carecontext":
        router.push(`/emr/${pathParams.patientid?pathParams.patientid:0}/${pathParams.opdEncounterId?pathParams.opdEncounterId:0}/abha-linking-token-doctor`);
        break;
      case "ot-schedule":
        router.push("");
        break;
      case "abha-health-id":
        router.push("/abha/abha-health-id");
        break;
      case "search-update-patient":
        router.push("/patient/search-update-patient");
        break;
      case "dept-wise-physician-list":
        router.push("/dept-wise-doctors-list");
        break;
      case "linking-token":
        router.push("/abha-linking-token");
        break;
      case "hiu-consent-request":
        router.push("/hiu/new-consent-request-doctor");
        break;
      default:
        break;
    }
  };

  return (
    <div className="sticky top-0 z-999  min-h-full">
      <div className="w-full mx-auto max-w-7xl">
        <div className="relative">
          <div className="menu-wrapp px-4 bg-white rounded-lg md:pt-2 p-2  mx-auto w-full border border-stroke">
            <div>
              {/* Card stats  */}
              <div
                className={`flex flex-wrap items-center ${menuStatus ? "pointer-events-none" : "pointer-events-auto"
                  }`}
              >
                <div className="flex flex-wrap md:flex-shrink-0">
                  <div className="max-w-md mx-3 module-elips-wrapper ">
                    <div className="relative w-auto flex-initial">
                      <CircularShadedButton
                        icon={HomeIcon}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.doctordashboard
                        }
                        status={isActive("/doctor/dashboard")}
                        onButtonClick={() => {
                          pushTo("doctor-dashboard");
                        }}
                      />
                    </div>
                  </div>
                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto flex-initial">
                      <CircularShadedButton
                        icon={search}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.ehrsearch
                        }
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("ehr-search");
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={report}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.resultsview
                        }
                        status={isActive(
                          `/emr/${pathParams.patientid}/${pathParams.opdEncounterId}/results-view`
                        )}
                        onButtonClick={() => {
                          pushTo("results-view");
                        }}
                      />
                    </div>
                  </div>
                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto flex-initial">
                      <CircularShadedButton
                        icon={calendar}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.doctorcalender
                        }
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("ot-schedule");
                        }}
                      />
                    </div>
                  </div> */}

                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto flex-initial">
                      <CircularShadedButton
                        icon={calendar_1}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.theatrescheduler
                        }
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("ot-schedule");
                        }}
                      />
                    </div>
                  </div>

                  <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto flex-initial">
                      <CircularShadedButton
                        icon={outpatient}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.opdappointments
                        }
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("ot-schedule");
                        }}
                      />
                    </div>
                  </div> */}

                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={outpatient}
                        info={
                          getLanData?.topheader &&
                          getLanData.topheader?.inpatients
                        }
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("result-view");
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={carecontext}
                        // info={
                        //   getLanData?.topheader &&
                        //   getLanData.topheader?.carecontext
                        // }
                        info="Carecontext"
                        status={isActive(`/emr/${pathParams.patientid?pathParams.patientid:0}/${pathParams.opdEncounterId?pathParams.opdEncounterId:0}/abha-linking-token-doctor`)}
                        onButtonClick={() => {
                          pushTo("carecontext");
                        }}
                      />
                    </div>
                  </div>

                  <div className="max-w-md mx-3 module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={healthconsentrequest}
                        info={"Health Consent Request"}
                        status={isActive("/hiu/new-consent-request-doctor")}
                        onButtonClick={() => {
                          pushTo("hiu-consent-request");
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="max-w-md mx-3 module-elips-wrapper">
                      <div className="relative w-auto  flex-initial">
                        <div
                          className="img-cnfig text-blue text-sm p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all "
                          onClick={() => {
                            pushTo("linking-token");
                          }}
                        >
                          CC
                        </div>
                      </div>
                    </div> */}
                </div>
                <div className="flex flex-1"></div>
                {/* <div className="flex-2 innermenuset flex flex-wrap  flex-row">
                  <VerticalComponent />
                  <DashboardSummaryDoctorComponent getLanData={getLanData} />
                  <DashboardStaticData />
                </div> */}
                <div className="flex-2 innermenuset flex flex-wrap flex-row">
                  <VerticalComponent />
                  <DashboardSummaryComponent getLanData={getLanData} />
                  <DashboardStaticData />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
