"use client";
import CircularShadedButton from "@/app/frontdesk/dashboard/_components/circular_shaded_button";
import DashboardSummaryComponent from "@/app/frontdesk/dashboard/_components/dashboard-summary";
import DashboardStaticData from "@/app/frontdesk/dashboard/_components/dashboardStaticData";
import VerticalComponent from "@/app/frontdesk/dashboard/_components/vertical-line";
import React from "react";
import addEncounter from "public/images/add-encounter.png";
import EnterIDimage from "public/images/EnterID.png";
import idimage from "public/images/ID.png";
import HomeIcon from "public/images/home.png";
import { useRouter, usePathname } from "next/navigation";
import DashboardSummaryNurseComponent from "./dashboard-summary-nurse";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";

export default function MenuBarNurse() {
  const { getLanData } = PatientDatadataAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (href: any) => {
    return pathname === href ? true : "";
  };
  const pushTo = (type: string) => {
    switch (type) {
      case "nurse-dashboard":
        router.push("/nurse/dashboard");
        break;
      case "ehr-search":
        router.push("/");
        break;
      case "ot-schedule":
        router.push("/");
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
      default:
        break;
    }
  };
  return (
    <div className="sticky top-0 z-999  min-h-full">
      <div className="w-full mx-auto max-w-7xl">
        <div className="relative">
          <div className="menu-wrapp px-4 bg-white md:pt-2 p-2 rounded-lg mx-auto w-full border border-stroke">
            <div>
              {/* Card stats  */}
              <div className="flex flex-wrap items-center">
                <div className="flex flex-wrap md:flex-shrink-0">
                  <div className="max-w-md mx-3 module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={HomeIcon}
                        info={"Nurse Dashboard"}
                        onButtonClick={() => {
                          pushTo("nurse-dashboard");
                        }}
                        status={isActive("/nurse/dashboard")}
                      />
                    </div>
                  </div>
                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={addEncounter}
                        info={"EHR Search"}
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("ehr-search");
                        }}
                      />
                    </div>
                  </div> */}

                  {/* <div className="max-w-md mx-3  module-elips-wrapper">
                    <div className="relative w-auto  flex-initial">
                      <CircularShadedButton
                        icon={idimage}
                        info={"OT Schedule"}
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
                        icon={EnterIDimage}
                        info={"Result View"}
                        status={isActive("/")}
                        onButtonClick={() => {
                          pushTo("result-view");
                        }}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="flex flex-1"></div>
                <div className="innermenuset flex flex-wrap flex-row">
                  {/* <VerticalComponent /> */}
                  {/* <DashboardSummaryNurseComponent getLanData={getLanData} />
                  <DashboardStaticData /> */}
                </div>
                <div className="flex-2 innermenuset flex flex-wrap flex-row">
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
  );
}
