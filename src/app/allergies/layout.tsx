"use client";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBarFrontDesk from "../frontdesk/_components/menu-bar-frontdesk";
import Header from "../_components/header";
import Footer from "../_components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function AllergiesLayout({
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
          <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6">
          {children}
          </div>
        </div>
      </div>
    </section>
  );
}
