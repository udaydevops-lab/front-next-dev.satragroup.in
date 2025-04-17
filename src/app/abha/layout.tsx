"use client";
import React from "react";
import dynamic from "next/dynamic";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import FrontDeskAuth from "../_commonfeatures/protectedRoute/FrontDeskAuth";
const MenuBarFrontDesk = dynamic(() => import('../frontdesk/_components/menu-bar-frontdesk'))


function AbhaLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="min-h-full">
        <div>
          <Header heading={"Front Desk Office"} />
          <MenuBarFrontDesk />
          {children}
        </div>
      </div>
    </section>
  );
}

export default FrontDeskAuth(AbhaLayout);
