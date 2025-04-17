"use client"
import { getPatientDetailsById } from "@/app/utilities/api-urls"
import { getLocalItem } from "@/app/utilities/local"
import services from "@/app/utilities/services"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const useLoginResponse = () => {

    const { patientid } = useParams();

    //loggedDetalls from loginResponse in Localstorage
    const [loggedDetalls, setLoggedDetails] = useState<any>(JSON.parse(getLocalItem('loginResponse')!))

    // for Due Date take the patient dob
    const [patinetDob, setPatientDob] = useState<any>()

    const getPatientDob = () => {

        // get the dob by patient id below api
        services.get(getPatientDetailsById + patientid)
            .then((res) => {
                setPatientDob(res.data.patData.dateOfBirth)
            })
            .catch((err) => console.log(err))

    }

    useEffect(() => {
        getPatientDob();
    }, [])

    return (
        { loggedDetalls, patinetDob, setPatientDob }
    )
}

export default useLoginResponse