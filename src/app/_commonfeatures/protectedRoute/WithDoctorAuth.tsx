"use client"
import { NextPage } from "next";
import { redirect } from 'next/navigation';
import { useEffect } from "react";
import { getResponseRole } from "../header";


const WithDoctorAuth = <P extends object>(Component: NextPage<P>) => {
    const WithDoctorAuth: NextPage<P> = (props) => {
        const responseRole = getResponseRole()
        const isAuthenticated = responseRole?.Role === "DOCTOR" ? true : false;

        useEffect(() => {
            // console.log("WithDoctorAuth", isAuthenticated, responseRole)

            if (!isAuthenticated) {
                redirect("/")
            }
        }, []);
        if (!isAuthenticated) {
            return null
        }
        return <Component {...props} />
    }
    return WithDoctorAuth;
}

export default WithDoctorAuth