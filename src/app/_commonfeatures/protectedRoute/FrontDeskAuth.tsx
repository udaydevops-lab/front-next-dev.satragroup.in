"use client"
import { NextPage } from 'next'
import React, { useEffect } from 'react'
import { getResponseRole } from '../header'
import { redirect } from 'next/navigation'

const FrontDeskAuth = <P extends object>(Component: NextPage<P>) => {
    const FrontDeskAuth: NextPage<P> = (props) => {
        const responseRole = getResponseRole()
        let isAuthenticated = responseRole?.Role === 'Front Office' || responseRole?.Role === 'ADMIN' ? true : false;

        useEffect(() => {
            // console.log("FrontDeskAuth", isAuthenticated, responseRole)

            if (!isAuthenticated) {
                redirect('/')
            }
        }, [])
        if (!isAuthenticated) {
            return null
        }
        return <Component {...props} />
    }
    return FrontDeskAuth
}

export default FrontDeskAuth
