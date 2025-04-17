'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Badge } from "@mui/material";
import eventBus from "../../../utilities/eventbus";
import { Margarine } from "next/font/google";
import DataGrid from "@/app/_components/DataGrid/DataGrid";
import { DASHBOARD_BAR_CHART, DASHBOARD_PIE_CHART } from "@/app/utilities/constants";
import Piechart from "./piechart";
import Barchart from "./barchart";

export default function HeaderComponent() {
  const [headerData, setHeaderData] = useState({
    headerTitle: "Header Title",
    name: "Name",
    image: "",
    designation: "Designation",
  });
  eventBus.on("headerData", (data) => {
    setHeaderData(data);
  });
  //tab start
  //kept for tabs of tables
  const tabsContainer: HTMLElement = document.querySelector(
    "#tabs"
  ) as HTMLElement;

  if (tabsContainer) {
    const tabTogglers: NodeListOf<HTMLAnchorElement> =
      tabsContainer.querySelectorAll("a");
    tabTogglers.forEach(function (toggler: HTMLAnchorElement) {
      toggler.addEventListener("click", function (e: Event) {
        e.preventDefault();

        let tabName: string | null = this.getAttribute("href");

        const tabContents: HTMLElement = document.querySelector(
          "#tab-contents"
        ) as HTMLElement;

        for (let i = 0; i < tabContents.children.length; i++) {
          (tabTogglers[i].parentElement as HTMLElement).classList.remove(
            "border-t",
            "border-r",
            "border-l",
            "-mb-px",
            "bg-white"
          );
          tabContents.children[i].classList.remove("hidden");
          if ("#" + tabContents.children[i].id === tabName) {
            continue;
          }
          tabContents.children[i].classList.add("hidden");
        }
        (e.target as HTMLElement).parentElement?.classList.add(
          "border-t",
          "border-r",
          "border-l",
          "-mb-px",
          "bg-white"
        );
      });
    });
  } else {
    console.error("#tabs element not found!");
  }
  //tab end
  eventBus.on("header", (data) => {
    setHeaderData(data);
  });
  const pieData = {
    labels: ['Mathematics', 'Statistics', 'Computer Science'],
    datasets: [
      {
        data: [13, 16, 29],
        backgroundColor: ['#55efc4', '#a29bfe', '#fd79a8'],
        hoverBackgroundColor: ['#00b894', '#6c5ce7', '#e84393'],
        // borderWidth: 1,
        // borderColor: 'black',
      },
    ]
  }
  const barData = {
    labels: ['Burger', 'Pizza', 'Sandwich'],
    datasets: [
      {
        label: 'Burger',
        data: [3, 6, 9],
        backgroundColor: '#55efc4',
        hoverBackgroundColor: '#00b894',
        // borderColor: 'black',
        // borderWidth: 1,
        barThickness: 35
      },
      {
        label: 'Pizza',
        data: [10, 5, 3],
        backgroundColor: '#a29bfe',
        hoverBackgroundColor: '#6c5ce7',
        // borderColor: 'black',
        // borderWidth: 1,
        barThickness: 35
      },
      {
        label: 'Sandwich',
        data: [2, 15, 6],
        backgroundColor: '#fd79a8',
        hoverBackgroundColor: '#e84393',
        // borderColor: 'black',
        // borderWidth: 1,
        barThickness: 35
      }
    ]
  }
  useEffect(() => {
    eventBus.dispatch(DASHBOARD_BAR_CHART, barData);
    eventBus.dispatch(DASHBOARD_PIE_CHART, pieData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const barData1: any = {
    labels: ['Lab', 'Radiology'],
    datasets: [
      {
        data: [200, 300],
        backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
        hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
        borderRadius: 16,
        barThickness: 8,
      },
    ],
  };

  const pieData1 = {
    labels: ['Total Performed', 'Total Not Performed', 'Total Received'],
    datasets: [
      {
        data: [200, 100, 50],
        backgroundColor: ['#ff9f40', '#ffcd56', '#36a2eb']
      }
    ]
  }

  let initialData = {};
  return (
    // <!-- ===== Main Content Start ===== -->

    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">



      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-auto 2xl:gap-7.5">
        {/* Chart One */}
        <div className="rounded-curve rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex justify-center">
          <Piechart graphData={pieData1} />
        </div>
        {/* Chart Two */}
        <div className="rounded-curve rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex justify-center">
          <Barchart graphData={barData1} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/*  ====== Chart One Start */}
        <div className="rounded-curve col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div>
            <div id="chartOne" className="-ml-5 py-5">
              Chart One
            </div>
          </div>
        </div>
        {/* <!-- ====== Chart One End --> */}

        {/* <!-- ====== Chart Two Start --> */}
        <div className="rounded-curve col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5  xl:col-span-4">
          <div>
            <div id="chartTwo" className="-ml-5 py-5">
              Chart Two
            </div>
          </div>
        </div>
        {/* <!-- ====== Chart Two End --> */}

        {/* <!-- ====== Table One Start --> */}
        <div className="col-span-12 xl:col-span-12">
          <div className="">
            <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
              Tab Tables
            </h4>
            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Source
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Visitors
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Revenues
                  </h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Sales
                  </h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Conversion
                  </h5>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src="./images/brand/brand-01.svg" alt="Brand" />
                  </div>
                  <p className="hidden font-medium text-black dark:text-white sm:block">
                    Google
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black dark:text-white">3.5K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$5,768</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black dark:text-white">590</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">4.8%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src="./images/brand/brand-02.svg" alt="Brand" />
                  </div>
                  <p className="font-medium hidden text-black dark:text-white sm:block">
                    Twitter
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black dark:text-white">2.2K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$4,635</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black dark:text-white">467</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">4.3%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src="./images/brand/brand-03.svg" alt="Brand" />
                  </div>
                  <p className="hidden font-medium text-black dark:text-white sm:block">
                    Github
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black dark:text-white">2.1K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$4,290</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black dark:text-white">420</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">3.7%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src="./images/brand/brand-04.svg" alt="Brand" />
                  </div>
                  <p className="hidden font-medium text-black dark:text-white sm:block">
                    Vimeo
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black dark:text-white">1.5K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$3,580</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black dark:text-white">389</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">2.5%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src="./images/brand/brand-05.svg" alt="Brand" />
                  </div>
                  <p className="hidden font-medium text-black dark:text-white sm:block">
                    Facebook
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-black dark:text-white">1.2K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="font-medium text-meta-3">$2,740</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-black dark:text-white">230</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="font-medium text-meta-5">1.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Data Grid Imported starts here */}
        <div className="col-span-12 xl:col-span-12">
          <div className="">
            <div className="flex flex-col">
              <DataGrid />
            </div>
          </div>
        </div>
        {/* Data Grid Imported end here */}
        {/* <!-- ====== Table One End --> */}
      </div>
    </div>
    // <!-- ===== Main Content End ===== -->
  );
}
