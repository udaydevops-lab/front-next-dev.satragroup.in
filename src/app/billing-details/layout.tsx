"use client"
import React from "react";
import Header from "../_components/header";
const MenuBarFrontDesk = dynamic(
  () => import("../frontdesk/_components/menu-bar-frontdesk")
);
import FrontDeskAuth from "../_commonfeatures/protectedRoute/FrontDeskAuth";
import dynamic from "next/dynamic";

function BillingDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="min-h-full">
        <div>
          <Header heading={"Front Desk Office"} />
          <MenuBarFrontDesk />
          <div>
           {children}
          </div>
        </div>
      </div>
    </section>
  );
}
export default BillingDetailsLayout;
