"use client"
import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function AbhaLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="min-h-full ">
        <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6">
          {children}
        </div>
      </div>
    </section>
  );
}
