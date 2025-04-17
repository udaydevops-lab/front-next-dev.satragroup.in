"use client";
import { TabPageTitle } from "@/app/lab/_component";
import React, { useEffect, useState } from "react";
import OrderMainPage from "./_components/OrderMainPage";
import Link from "next/link";
import { getOrderIdDetails } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { useParams } from "next/navigation";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function RadiologyOrderDetails(props: any) {
  const title = "Order Details";
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div>
      <div className="">
        <div className="ms-3 mt-3 flex justify-between">
          <TabPageTitle title={title} />
          <div className="mt-2">
            <Link
              href={"/radiology/radiology-opworklist"}
              className="cursor-pointer text-white text-[14px] me-4 py-2 px-6 rounded-lg bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            >
              Back
            </Link>
          </div>
        </div>
        <div className={props?.screenData?.Update === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
          <OrderMainPage />
        </div>
      </div>
    </div>
  );
}

export default roleInfoScreenData(RadiologyOrderDetails, "Od")