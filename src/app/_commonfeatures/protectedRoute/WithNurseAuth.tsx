"use client"
import { NextPage } from "next";
import { useEffect } from "react";
import { getResponseRole } from "../header";
import { redirect } from "next/navigation";

const WithNurseAuth = <P extends object>(Component: NextPage<P>) => {
    const WithNurseAuth: NextPage<P> = (props) => {
        const responseRole = getResponseRole()
        let isAuthenticated = responseRole?.Role === "Nurse" ? true : false

        useEffect(() => {
            // console.log("NurseAuth", isAuthenticated, responseRole)
            if (!isAuthenticated) {
                redirect('/')
            }
        }, []);

        if (!isAuthenticated) {
            return null
        }
        return <Component {...props} />
    }
    return WithNurseAuth
}

export default WithNurseAuth