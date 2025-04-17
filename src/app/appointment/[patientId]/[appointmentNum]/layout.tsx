"use client"
import React from "react";
import MenuBarFrontDesk from "../../../frontdesk/_components/menu-bar-frontdesk";
import Header from "../../../_components/header";

function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="min-h-full">
        <div>
          <Header heading={"Front Desk Office"} />
          <MenuBarFrontDesk />
          <div className="w-full mx-auto max-w-7xl py-5">
           {children}
          </div>
        </div>
      </div>
    </section>
  );
}
export default AppointmentLayout;
