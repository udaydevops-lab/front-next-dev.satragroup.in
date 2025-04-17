"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBarFrontDesk from "../../../../../frontdesk/_components/menu-bar-frontdesk";
import Header from "../../../../../_components/header";
import Footer from "../../../../../_components/footer";
import Wholepages from "../_components/wholepages";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function MedicationLayout1({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="min-h-full ">
        <div>
          <Header />
          <MenuBarFrontDesk />
          <Wholepages />
          <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
