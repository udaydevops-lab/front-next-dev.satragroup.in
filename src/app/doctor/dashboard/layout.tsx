"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBarDoctor from "../_components/menu-bar-doctor";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import WithDoctorAuth from "@/app/_commonfeatures/protectedRoute/WithDoctorAuth";
import { useEffect, useLayoutEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const DoctorDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // const getRload = () => {
  //   window.location.reload()
  // }
  // useEffect(() => {
  //   return () => getRload()
  // }, [])

  return (
    <section>
      <div className="min-h-full ">
        <div>
          <Header heading={"Doctor Dashboard"} />
          <MenuBarDoctor />
          {children}
        </div>
      </div>
    </section>
  );
}
export default WithDoctorAuth(DoctorDashboardLayout)