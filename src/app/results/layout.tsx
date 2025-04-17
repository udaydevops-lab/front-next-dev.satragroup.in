"use client"
import Header from "@/app/_components/header";
import MenuBarDoctor from "@/app/doctor/_components/menu-bar-doctor";
import MenuBarFrontDesk from "@/app/frontdesk/_components/menu-bar-frontdesk";
import React from "react";
import FrontDeskAuth from "../_commonfeatures/protectedRoute/FrontDeskAuth";


const ResultsViewLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section>
      <div className="min-h-full">
        <div>
          <Header />
          <MenuBarFrontDesk />
          <div className="w-full mx-auto max-w-7xl pb-4 pt-0 md:pb-6 2xl:pb-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FrontDeskAuth(ResultsViewLayout)