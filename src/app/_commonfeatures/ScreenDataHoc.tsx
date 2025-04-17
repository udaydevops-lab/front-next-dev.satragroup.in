"use client"
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { getLocalItem } from '../utilities/local';

const roleInfoScreenData = <P extends object>(Component: NextPage<P>, screenCode: any) => {
    const WithScreenData = (props: any) => {
        const [screenData, setScreenData] = useState({
            Print: 0,
            Save: 0,
            Update: 0,
            View: 0,
            Delete: 0,
        });
        useEffect(() => {
            const fetchData = async () => {
                const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
                // console.log(loginResponse.username === "maheshm")
                if (loginResponse.isSuperAdmin) {
                    let obj = {
                        isSuperAdmin: true,
                        Print: 1,
                        Save: 1,
                        Update: 1,
                        View: 1,
                        Delete: 1,
                    }
                    // console.log(obj)
                    setScreenData(obj);
                } else {
                    const privilegesArray: any = getLocalItem('roleInfo');
                    const privilegesData = JSON.parse(privilegesArray)
                    if (privilegesArray && privilegesArray.length > 0) {
                        const privilegesInfo = privilegesData[0].rolePrivileges
                        const res = privilegesInfo.filter((screen: any) => screen.txScreen === screenCode);
                        // console.log(res[0])
                        setScreenData(res[0]);
                    } else {
                        console.error('rolePrivileges is not an array or does not exist.');
                    };
                }
            };
            fetchData()
        }, [screenCode]);
        return <Component {...props} screenData={screenData} />;
    };
    return WithScreenData;
};

export default roleInfoScreenData;
