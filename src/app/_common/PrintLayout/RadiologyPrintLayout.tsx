"use client";
import Image from "next/image";
import {
    getAllDepartments,
    getPatientDetails,
    getRadiologyDetailsByOrderId,
    gethospitalDetials,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { getLocalItem } from "@/app/utilities/local";

const RadiologyPrintlayout = (props: any) => {
    const [patientData, setPatientData] = useState<any>();
    const [addressDetails, setAddressDetails] = useState<any>({});
    const { orderId } = useParams();
    const getPatientData = async () => {
        // let patientID = `${mrn ? patientid : props.patientid}`
        // let opdEncounterID = `${mrn ? opdEncounterId : props.opdEncounterId}`

        const response = await services.get(`${getRadiologyDetailsByOrderId}${orderId}`);
        console.log(response.data)
        let patientdata = response.data.patientId;
        let opdEncounterIdData = response.data.encounterId;
        let orderdata = response.data.orderId;
        const data = await services.get(
            getPatientDetails + patientdata + "/" + opdEncounterIdData + "/" + orderdata
        );
        const deportmentData: any = await services.get(getAllDepartments);

        setPatientData(data.data);
    };

    const getHsopitalDetails = () => {
        const serviceEntityId = JSON.parse(
            getLocalItem("loginResponse")!
        ).serviceEntityId;
        const locationId = JSON.parse(getLocalItem("loginResponse")!).locationId;

        let Obj = {
            serviceEntityId: serviceEntityId,
            locationId: locationId,
        };

        services
            .create(gethospitalDetials, Obj)

            .then((res: any) => {
                // alert(res)
                setAddressDetails(res.data);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getPatientData();
        getHsopitalDetails();
    }, []);

    return (
        <>
            <div
                style={{
                    backgroundImage:
                        "https://t3.ftcdn.net/jpg/01/21/31/92/360_F_121319236_vD7vnEdgeP0OAuBmwuNGLgX47ehFvDuh.jpg",
                    float: "left",
                    marginBottom: "15px",
                    borderBottom: "1px solid #000000",
                    width: "100%",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        position: "relative",
                        zIndex: "10",
                        padding: "10px",
                    }}
                >
                    <div style={{ width: "67%", marginRight: "2%", float: "left" }}>
                        <h3
                            style={{
                                textTransform: "capitalize",
                                marginBottom: "10px",
                                marginTop: "3px",
                            }}
                        >
                            {addressDetails?.decryptedServiceEntityDesc}
                        </h3>
                        <p style={{ textTransform: "capitalize", margin: "1px" }}>
                            House No : {addressDetails?.locationDetails?.houseNo}, Location :{" "}
                            {addressDetails?.locationDetails?.location}
                        </p>
                        {/* <p style={{ textTransform: "capitalize", margin: "1px" }}>Address 2</p> */}
                        <p style={{ textTransform: "capitalize", margin: "1px" }}>
                            City: {addressDetails?.locationDetails?.city},&nbsp; District :{" "}
                            {addressDetails?.locationDetails?.district},&nbsp; State:{" "}
                            {addressDetails?.locationDetails?.state},&nbsp; Pin:
                            {addressDetails?.locationDetails?.pincodeId},&nbsp; Country :{" "}
                            {addressDetails?.locationDetails?.country}
                        </p>
                        <p style={{ display: "inline-block", margin: "1px" }}>
                            Contact: {addressDetails?.locationDetails?.mobile} &nbsp; Website:{" "}
                            {addressDetails?.locationDetails?.locationWebsite}
                        </p>
                    </div>
                    <div style={{ textAlign: "right", width: "28%", float: "left" }}>
                        {/* <img
                            src="/images/login/logo.png"
                            alt="Satra"
                            width="100"
                            height="50"
                            style={{
                                position: "relative",
                                zIndex: "10"
                            }}
                            id="myImage"
                        // onLoad={props.onloadFun}
                        /> */}
                        <svg
                            version="1.0"
                            xmlns="http://www.w3.org/2000/svg"
                            width="100.000000pt"
                            height="40.000000pt"
                            viewBox="0 0 240.000000 64.000000"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <g fill="#173883" stroke="none">
                                <path
                                    d="M0 0 C1.29210136 0.00212242 1.29210136 0.00212242 2.61030579 0.00428772 C5.36133294 0.00988485 8.11227869 0.02243679 10.86328125 0.03515625 C12.72851445 0.04017162 14.59374892 0.04473446 16.45898438 0.04882812 C21.03128136 0.05985333 25.6035175 0.07711598 30.17578125 0.09765625 C30.17578125 3.39765625 30.17578125 6.69765625 30.17578125 10.09765625 C13.84078125 10.59265625 13.84078125 10.59265625 -2.82421875 11.09765625 C-3.15421875 12.08765625 -3.48421875 13.07765625 -3.82421875 14.09765625 C-3.07325928 14.11223877 -2.3222998 14.12682129 -1.54858398 14.1418457 C1.88086787 14.21669223 5.3093852 14.31323279 8.73828125 14.41015625 C9.91970703 14.43271484 11.10113281 14.45527344 12.31835938 14.47851562 C18.60226851 14.67213748 23.69999954 14.86441067 29.17578125 18.09765625 C31.51352156 21.60426672 31.53236465 23.31259113 31.61328125 27.47265625 C31.67322266 29.15488281 31.67322266 29.15488281 31.734375 30.87109375 C30.98006362 35.22816506 29.68924628 36.43224008 26.17578125 39.09765625 C22.93983151 39.7749464 19.79389528 39.68113786 16.5 39.5859375 C15.57484085 39.57886276 14.6496817 39.57178802 13.69648743 39.5644989 C10.75125122 39.5365844 7.80793952 39.47385182 4.86328125 39.41015625 C2.86265773 39.38506955 0.86200431 39.36225703 -1.13867188 39.34179688 C-6.03459191 39.28676733 -10.92907943 39.20051526 -15.82421875 39.09765625 C-15.82421875 36.12765625 -15.82421875 33.15765625 -15.82421875 30.09765625 C-4.60421875 29.76765625 6.61578125 29.43765625 18.17578125 29.09765625 C17.68078125 27.61265625 17.68078125 27.61265625 17.17578125 26.09765625 C16.35376221 26.06325439 15.53174316 26.02885254 14.68481445 25.9934082 C10.95106173 25.82339264 7.22015742 25.61717736 3.48828125 25.41015625 C2.19470703 25.35666016 0.90113281 25.30316406 -0.43164062 25.24804688 C-1.67880859 25.17392578 -2.92597656 25.09980469 -4.2109375 25.0234375 C-5.35780029 24.96583252 -6.50466309 24.90822754 -7.6862793 24.84887695 C-11.69529372 23.88912146 -13.26595961 22.27374026 -15.82421875 19.09765625 C-16.453125 15.94140625 -16.453125 15.94140625 -16.38671875 12.59765625 C-16.38800781 11.49421875 -16.38929687 10.39078125 -16.390625 9.25390625 C-15.71332205 5.47969397 -14.51299676 3.79131407 -11.82421875 1.09765625 C-7.87657605 -0.21822465 -4.11332519 -0.02534648 0 0 Z "
                                    fill="#173884"
                                    transform="translate(15.82421875,24.90234375)"
                                />
                                <path
                                    d="M0 0 C1.47668858 0.0133035 2.95331108 0.03716415 4.4296875 0.0703125 C5.18378906 0.07933594 5.93789062 0.08835937 6.71484375 0.09765625 C8.57826004 0.1212438 10.44151343 0.15711531 12.3046875 0.1953125 C12.73289795 0.99638428 13.1611084 1.79745605 13.60229492 2.62280273 C15.21385805 5.63678487 16.82607719 8.65041425 18.4387207 11.66381836 C19.13233725 12.96023028 19.82570318 14.25677632 20.51879883 15.5534668 C21.52356781 17.43314654 22.52921064 19.31235598 23.53515625 21.19140625 C23.86079559 21.80051849 24.18643494 22.40963074 24.52194214 23.03720093 C26.77718719 27.24458781 29.09623355 31.41061906 31.4855957 35.54321289 C32.3046875 37.1953125 32.3046875 37.1953125 32.3046875 39.1953125 C30.03547214 39.33020641 27.7639808 39.42725245 25.4921875 39.5078125 C23.59533203 39.59482422 23.59533203 39.59482422 21.66015625 39.68359375 C20.55285156 39.52246094 19.44554687 39.36132812 18.3046875 39.1953125 C17.85029297 38.37482422 17.39589844 37.55433594 16.92773438 36.70898438 C15.55671827 33.96932466 15.55671827 33.96932466 12.8527832 33.53588867 C11.90491943 33.52017822 10.95705566 33.50446777 9.98046875 33.48828125 C8.95244141 33.45927734 7.92441406 33.43027344 6.86523438 33.40039062 C5.79337891 33.39458984 4.72152344 33.38878906 3.6171875 33.3828125 C2.53373047 33.35767578 1.45027344 33.33253906 0.33398438 33.30664062 C-2.34281233 33.24768035 -5.01797065 33.21146587 -7.6953125 33.1953125 C-8.3553125 35.1753125 -9.0153125 37.1553125 -9.6953125 39.1953125 C-14.6453125 39.1953125 -19.5953125 39.1953125 -24.6953125 39.1953125 C-22.9720748 34.88721825 -21.02378372 30.86109625 -18.8515625 26.77734375 C-18.48180298 26.0788884 -18.11204346 25.38043304 -17.7310791 24.66081238 C-16.95238591 23.19188864 -16.17237215 21.72366428 -15.39111328 20.25610352 C-14.19494663 18.0071246 -13.00546891 15.75469441 -11.81640625 13.50195312 C-11.05769409 12.07270297 -10.29859295 10.64365922 -9.5390625 9.21484375 C-9.18380493 8.54089066 -8.82854736 7.86693756 -8.46252441 7.17256165 C-4.76315061 0.25175215 -4.76315061 0.25175215 0 0 Z M3.3046875 12.1953125 C1.3246875 16.1553125 -0.6553125 20.1153125 -2.6953125 24.1953125 C1.5946875 24.1953125 5.8846875 24.1953125 10.3046875 24.1953125 C7.3346875 18.2553125 7.3346875 18.2553125 4.3046875 12.1953125 C3.9746875 12.1953125 3.6446875 12.1953125 3.3046875 12.1953125 Z "
                                    fill="#173884"
                                    transform="translate(69.6953125,24.8046875)"
                                />
                                <path
                                    d="M0 0 C1.48831242 0.00667405 2.97660807 0.01863442 4.46484375 0.03515625 C5.22345703 0.03966797 5.98207031 0.04417969 6.76367188 0.04882812 C8.64326246 0.06064945 10.52281274 0.07858547 12.40234375 0.09765625 C12.90161377 1.04084717 13.40088379 1.98403809 13.9152832 2.95581055 C15.77572152 6.46956259 17.63796037 9.98235772 19.50073242 13.49487305 C20.30525729 15.01251788 21.1092998 16.53041853 21.9128418 18.04858398 C23.07082088 20.23619649 24.23055653 22.42286991 25.390625 24.609375 C25.74699539 25.28352951 26.10336578 25.95768402 26.47053528 26.65226746 C27.96414867 29.46398964 29.48323716 32.22901921 31.15307617 34.94067383 C32.40234375 37.09765625 32.40234375 37.09765625 32.40234375 39.09765625 C30.13312839 39.23255016 27.86163705 39.3295962 25.58984375 39.41015625 C23.69298828 39.49716797 23.69298828 39.49716797 21.7578125 39.5859375 C20.65050781 39.42480469 19.54320312 39.26367188 18.40234375 39.09765625 C17.94794922 38.27716797 17.49355469 37.45667969 17.02539062 36.61132812 C15.65437452 33.87166841 15.65437452 33.87166841 12.95043945 33.43823242 C12.00257568 33.42252197 11.05471191 33.40681152 10.078125 33.390625 C9.05009766 33.36162109 8.02207031 33.33261719 6.96289062 33.30273438 C5.89103516 33.29693359 4.81917969 33.29113281 3.71484375 33.28515625 C2.63138672 33.26001953 1.54792969 33.23488281 0.43164062 33.20898438 C-2.24515608 33.1500241 -4.9203144 33.11380962 -7.59765625 33.09765625 C-7.90703125 33.90203125 -8.21640625 34.70640625 -8.53515625 35.53515625 C-9.59765625 38.09765625 -9.59765625 38.09765625 -10.59765625 39.09765625 C-12.9507918 39.17037366 -15.30599293 39.18136493 -17.66015625 39.16015625 C-18.95050781 39.15113281 -20.24085938 39.14210937 -21.5703125 39.1328125 C-22.56933594 39.12121094 -23.56835938 39.10960937 -24.59765625 39.09765625 C-23.07495942 33.81004966 -20.67615174 29.34643579 -17.97265625 24.59765625 C-17.53187744 23.81463135 -17.09109863 23.03160645 -16.63696289 22.22485352 C-15.2957892 19.84609975 -13.94719596 17.47167133 -12.59765625 15.09765625 C-11.79665256 13.67981315 -10.99585896 12.26185132 -10.1953125 10.84375 C-4.11434249 0.11168139 -4.11434249 0.11168139 0 0 Z M3.40234375 12.09765625 C1.42234375 16.05765625 -0.55765625 20.01765625 -2.59765625 24.09765625 C1.69234375 24.09765625 5.98234375 24.09765625 10.40234375 24.09765625 C7.43234375 18.15765625 7.43234375 18.15765625 4.40234375 12.09765625 C4.07234375 12.09765625 3.74234375 12.09765625 3.40234375 12.09765625 Z "
                                    fill="#173884"
                                    transform="translate(188.59765625,24.90234375)"
                                />
                                <path
                                    d="M0 0 C16.17 0 32.34 0 49 0 C47 5 47 5 44 10 C37.565 10.495 37.565 10.495 31 11 C31 20.24 31 29.48 31 39 C26.38 39 21.76 39 17 39 C17 29.76 17 20.52 17 11 C12.71 10.67 8.42 10.34 4 10 C1.0554063 6.46648756 0 4.58282062 0 0 Z "
                                    fill="#173883"
                                    transform="translate(86,25)"
                                />
                                <path
                                    d="M0 0 C6.0271652 -0.21828767 11.36237932 -0.30106967 17 2 C20.93210303 6.06317313 21.29899514 10.29929913 21.2109375 15.71484375 C20.89842208 19.10042746 19.97111504 21.24043894 18 24 C16.02740955 25.053037 14.02880819 26.05982059 12 27 C12.86625 27.78246094 13.7325 28.56492187 14.625 29.37109375 C15.75012962 30.39308649 16.8751226 31.41522966 18 32.4375 C18.57234375 32.95376953 19.1446875 33.47003906 19.734375 34.00195312 C21.17519579 35.3141292 22.58985784 36.65490904 24 38 C24 38.33 24 38.66 24 39 C10.8472281 40.06644096 10.8472281 40.06644096 6.7265625 37.6875 C5.0066234 35.87873775 3.51911424 33.97910049 2 32 C0.69489109 30.78154822 -0.6396373 29.59393736 -2 28.4375 C-2.66 27.86644531 -3.32 27.29539062 -4 26.70703125 C-5.35053665 25.55432712 -6.70480764 24.40598599 -8.0625 23.26171875 C-9.72333541 21.85871464 -11.36380848 20.43166758 -13 19 C-13 18.67 -13 18.34 -13 18 C-12.15236084 17.96241577 -12.15236084 17.96241577 -11.28759766 17.92407227 C-8.73316258 17.80820044 -6.1791045 17.68543463 -3.625 17.5625 C-2.73554688 17.52318359 -1.84609375 17.48386719 -0.9296875 17.44335938 C-0.07890625 17.40146484 0.771875 17.35957031 1.6484375 17.31640625 C2.82672119 17.26141968 2.82672119 17.26141968 4.02880859 17.20532227 C6.07523496 17.109109 6.07523496 17.109109 8 16 C7.67 14.68 7.34 13.36 7 12 C3.04 11.67 -0.92 11.34 -5 11 C-3.47903372 7.19758429 -1.85989732 3.63525385 0 0 Z "
                                    fill="#ED1B23"
                                    transform="translate(138,25)"
                                />
                                <path
                                    d="M0 0 C0.99 0.33 1.98 0.66 3 1 C3 2.32 3 3.64 3 5 C5.31 5 7.62 5 10 5 C10 5.66 10 6.32 10 7 C8 8.625 8 8.625 6 10 C6.33 11.65 6.66 13.3 7 15 C6.113125 14.62875 5.22625 14.2575 4.3125 13.875 C0.59173995 12.89215772 -0.67438135 13.23937836 -4 15 C-3.67 13.02 -3.34 11.04 -3 9 C-4.32 8.34 -5.64 7.68 -7 7 C-7 6.34 -7 5.68 -7 5 C-5.02 4.67 -3.04 4.34 -1 4 C-0.67 2.68 -0.34 1.36 0 0 Z "
                                    fill="#ED1C24"
                                    transform="translate(223,26)"
                                />
                                <path
                                    d="M0 0 C0.66 0 1.32 0 2 0 C2.33 0.99 2.66 1.98 3 3 C5.01508358 3.73323796 5.01508358 3.73323796 7 4 C6.67 4.99 6.34 5.98 6 7 C5.34 7 4.68 7 4 7 C4.66 8.65 5.32 10.3 6 12 C4.63875 11.690625 4.63875 11.690625 3.25 11.375 C-0.11027897 10.9872755 -1.24075815 11.19588033 -4 13 C-3.67 11.35 -3.34 9.7 -3 8 C-3.99 7.34 -4.98 6.68 -6 6 C-6 5.34 -6 4.68 -6 4 C-4.35 3.67 -2.7 3.34 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z "
                                    fill="#ED1C24"
                                    transform="translate(233,11)"
                                />
                                <path
                                    d="M0 0 C0.66 0 1.32 0 2 0 C2.33 1.32 2.66 2.64 3 4 C4.65 4 6.3 4 8 4 C8 4.66 8 5.32 8 6 C7.484375 6.45375 6.96875 6.9075 6.4375 7.375 C5.7259375 8.179375 5.7259375 8.179375 5 9 C5.22757731 11.16299211 5.22757731 11.16299211 6 13 C5.2575 12.62875 4.515 12.2575 3.75 11.875 C1.05716353 10.70484137 1.05716353 10.70484137 -1.3125 11.875 C-2.1478125 12.431875 -2.1478125 12.431875 -3 13 C-2.67 11.02 -2.34 9.04 -2 7 C-2.99 6.67 -3.98 6.34 -5 6 C-5 5.34 -5 4.68 -5 4 C-3.35 4 -1.7 4 0 4 C0 2.68 0 1.36 0 0 Z "
                                    fill="#ED1C24"
                                    transform="translate(213,11)"
                                />
                                <path
                                    d="M0 0 C0.99 0.33 1.98 0.66 3 1 C3 1.66 3 2.32 3 3 C3.99 2.67 4.98 2.34 6 2 C6 2.99 6 3.98 6 5 C5.34 5 4.68 5 4 5 C4.33 6.32 4.66 7.64 5 9 C4.401875 8.814375 3.80375 8.62875 3.1875 8.4375 C0.83591238 7.77906313 0.83591238 7.77906313 -2 9 C-1.67 7.68 -1.34 6.36 -1 5 C-1.99 4.67 -2.98 4.34 -4 4 C-3.34 3.34 -2.68 2.68 -2 2 C-1.34 2.33 -0.68 2.66 0 3 C0 2.01 0 1.02 0 0 Z "
                                    fill="#ED1C24"
                                    transform="translate(223,0)"
                                />
                            </g>
                        </svg>
                    </div>
                </div>

                <img
                    src="https://t3.ftcdn.net/jpg/01/21/31/92/360_F_121319236_vD7vnEdgeP0OAuBmwuNGLgX47ehFvDuh.jpg"
                    style={{
                        width: "100%",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        zIndex: "9",
                        height: "100%",
                        objectFit: "fill",
                    }}
                    alt=""
                />
            </div>

            <div className="w-full">
                <div
                    style={{
                        width: "100%",
                        float: "left",
                        marginBottom: "0px",
                        borderBottom: "1px solid #ccc",
                        paddingBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            float: "left",
                            marginBottom: "5px",
                            display: "flex",
                        }}
                    >
                        <div style={{ width: "40%", marginRight: "5%", float: "left" }}>
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Enc No: </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {patientData?.MRN}{" "}
                            </span>
                        </div>
                        <div style={{ width: "55%", float: "left", display: "flex" }}>
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Patient Name: </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {patientData?.patientName}
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            float: "left",
                            marginBottom: "8px",
                            textTransform: "capitalize",
                        }}
                    >
                        <div
                            style={{
                                width: "40%",
                                marginRight: "5%",
                                float: "left",
                                display: "flex",
                            }}
                        >
                            <span style={{ width: "auto", float: "left" }}>
                                <b>opd Enc No: </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                {" "}
                                &nbsp; {patientData?.opdEncounterNo}
                            </span>
                        </div>
                        <div style={{ width: "55%", float: "left", display: "flex" }}>
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Age: </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {patientData?.ageOfPatient}
                            </span>
                        </div>
                    </div>

                    <div style={{ width: "100%", float: "left", marginBottom: "8px" }}>
                        <div
                            style={{
                                width: "40%",
                                marginRight: "5%",
                                float: "left",
                                display: "flex",
                            }}
                        >
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Department: </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {patientData?.departmentDesc}{" "}
                            </span>
                        </div>



                        <div style={{ width: "55%", float: "left", display: "flex" }}>
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Date: </b>
                            </span>
                            <span
                                style={{
                                    width: "auto",
                                    float: "left",
                                    textTransform: "capitalize",
                                }}
                            >
                                &nbsp;{" "}
                                {moment(patientData?.generatedDate).format(
                                    "DD-MM-YYYY h:mm A"
                                )}
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            float: "left",
                            marginBottom: "8px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                width: "40%",
                                marginRight: "5%",
                                float: "left",
                                display: "flex",
                            }}
                        >
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Ordered Id : </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {patientData?.orderId}
                            </span>
                        </div>

                        <div style={{ width: "55%", float: "left", display: "flex" }}>
                            <div style={{ width: "50%", float: "left", display: "flex" }}>
                                <span style={{ width: "auto", float: "left" }}>
                                    <b>Doctor: </b>
                                </span>
                                <span style={{ width: "auto", float: "left" }}>
                                    &nbsp; {patientData?.orderBy}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            float: "left",
                            marginBottom: "8px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                marginRight: "5%",
                                float: "left",
                                display: "flex",
                            }}
                        >
                            <span style={{ width: "auto", float: "left" }}>
                                <b>Service Name : </b>
                            </span>
                            <span style={{ width: "auto", float: "left" }}>
                                &nbsp; {props?.serviceName}
                            </span>
                        </div>

                        <div style={{ width: "55%", float: "left", display: "flex" }}>


                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full">{props.content}</div>

            <div
                style={{
                    width: "100%",
                    float: "right",
                    marginTop: "100px",
                    textAlign: "right",
                }}
            >
                <span> {patientData?.doctor}</span>
            </div>
        </>
    );
};

export default RadiologyPrintlayout;
