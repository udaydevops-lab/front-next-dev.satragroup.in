import { getLocalItem } from "../utilities/local";

export const getHeaderResponse = () => {
    const loginResponse = getLoginResponse();
    return {
        userId: loginResponse?.userId,
        roleId: loginResponse?.roleId,
        employeename: loginResponse?.employeename,
        employeeid: loginResponse?.employeeId,
        locationId: loginResponse?.locationId,
        locationDesc: loginResponse?.locationDesc,
        serviceEntityDesc: loginResponse?.serviceEntityDesc,
        serviceEntityId: loginResponse?.serviceEntityId,
        isSuperAdmin: loginResponse?.isSuperAdmin,
        "Access-Control-Allow-Origin": "*",
    };
}

export const getLoginResponse = () => {
    return JSON.parse(getLocalItem("loginResponse")!);
}

export const getResponseRole = () => {
    const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
    return { Role: loginResponse?.rollDesc ? loginResponse?.rollDesc : null }
}