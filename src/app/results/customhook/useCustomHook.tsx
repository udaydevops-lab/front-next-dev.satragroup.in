import services from "@/app/utilities/services";
import { useState } from "react";


const UseCustomHook = () => {

    const [patientD, setPatientD] = useState<any>({})

    const getPatientData = async (url: any) => {
        await services.get(url).then(
            (res) => {
                setPatientD(res.data);
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    };


    return { getPatientData, patientD }
}

export default UseCustomHook