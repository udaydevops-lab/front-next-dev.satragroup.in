import BackIcon from "@/app/_common/common_icons/back-to-home-icon";
import DateInput from "@/app/_common/date-input";
import { DialogueBox } from "@/app/_common/graph";
import ControllerSelect from "@/app/_common/select";
import Textarea from "@/app/_common/text-area";
import { Button } from "@material-tailwind/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useForm } from "react-hook-form";
import Input from "../../src/app/_common/input";
import services from "@/app/utilities/services";
import {
    getConfigData,
    getOPEmrData,
    saveOPEmr,
    saveVitals,
} from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateTime from "@/app/_common/date-time-picker";
import Select from "react-tailwindcss-select";
import Loader from "@/app/_common/loader";
import ActionButton from "@/app/_common/button";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { ReactSelectBox } from "@/app/_commonfeatures";

export default function VitalsUpdate(props: any) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();
    const [data, setData] = useState(props.data);
    const [dateAndTime, setDateAndTime] = useState(
        moment(data.vitalsRecordDateTime)
    );
    const [emrId, setEmrId] = useState(null)
    const [temperatureSiteList, setTemperatureSiteList] = useState<any>([]);
    const [bpBodySiteList, setBpBodySiteList] = useState<any>([]);
    const [bpPositionList, setBpPositionList] = useState<any>([]);
    const [vitalsData, setVitalsData] = useState([{}]);
    const [pathParams, setPathParams] = useState(props.pathParams);
    const [remarks, setRemarks] = useState(props.data.remarks);
    const [position, setPosition] = useState<any>("");
    const [site, setSite] = useState<any>("");
    const [siteLocation, setSiteLocation] = useState<any>("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setValue(
            "vitalsRecordDateTime",
            moment(data.vitalsRecordDateTime)
        );
        setValue("heightInCms", data.heightInCms);
        setValue("weightInKgs", data.weightInKgs);
        setValue("weightInPounds", data.weightInPounds);
        setValue("bmi", data.weightInKgs);
        setValue("hcInCms", data.hcInCms);
        setValue("systolicBp", data.systolicBp);
        setValue("dialosticBp", data.dialosticBp);
        setValue("position", data.position);
        data.position ? setPosition({
            label: data.position
        }) : "";
        data.site ? setSite({
            label: data.site
        }) : "";
        data.siteLocation ? setSiteLocation({
            label: data.siteLocation
        }) : "";
        setValue("site", data.site);
        setValue("tempInCelsius", data.tempInCelsius);
        setValue("tempInFahrenheit", data.tempInFahrenheit);
        setValue("pulse", data.pulse);
        setValue("spo2", data.spo2);
        setValue("respiratoryRate", data.respiratoryRate);
        setValue("siteLocation", data.siteLocation);
        setValue("remarks", data.remarks);
        setValue("recordedBy", data.recordedBy);
        setRemarks(data.remarks);
        services
            .get(getConfigData + "TemperatureSite" + "/0")
            .then((response: any) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setTemperatureSiteList(transformedData);
            })
            .catch((err: any) => {
                toast.error("Technical Error")
            });
        services
            .get(getConfigData + "BPBodysite" + "/0")
            .then((response: any) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setBpBodySiteList(transformedData);
            })
            .catch((err: any) => {
                toast.error("Technical Error")
            });
        services
            .get(getConfigData + "BP-Position" + "/0")
            .then((response: any) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setBpPositionList(transformedData);
            })
            .catch((err: any) => {
                console.log(err.message);
            });
    }, [emrId]);

    const storedData: any = JSON.parse(getLocalItem("loginResponse")!);
    const rollDesc: any = storedData?.rollDesc.toLowerCase();

    const [updateLoader, setUpdateLoader] = useState<any>(false)

    const onSubmit = (obj: any) => {
        setUpdateLoader(true)
        data.remarks = remarks;
        data.bmi = getValues().bmi ? getValues().bmi : ""
        data.vitalsRecordDateTime = getValues().vitalsRecordDateTime ? new Date(getValues().vitalsRecordDateTime).getTime() : ""
        data.weightInKgs = getValues().weightInKgs ? getValues().weightInKgs : ""
        data.heightInCms = getValues().heightInCms ? getValues().heightInCms : ""
        data.respiratoryRate = getValues().respiratoryRate ? getValues().respiratoryRate : ""
        data.pulse = getValues().pulse ? getValues().pulse : ""
        data.tempInCelsius = getValues().tempInCelsius ? getValues().tempInCelsius : ""
        data.position = position ? position.label : ""
        data.site = site ? site.label : ""
        data.siteLocation = siteLocation ? siteLocation.label : ""
        data.spo2 = getValues().spo2 ? getValues().spo2 : ""
        data.tempInFahrenheit = getValues().tempInFahrenheit ? getValues().tempInFahrenheit : ""
        data.weightInPounds = getValues().weightInPounds ? getValues().weightInPounds : ""
        data.dialosticBp = getValues().dialosticBp ? getValues().dialosticBp : ""
        data.systolicBp = getValues().systolicBp ? getValues().systolicBp : ""

        if (rollDesc == "doctor") {
            data.reviewStatus = true;
        } else {
            data.reviewStatus = false;
        }
        let postObj = {
            id: data.id,
            emrID: null,
            patientId: Number(pathParams.patientid),
            opdEncounterId: Number(pathParams.opdEncounterId),
            ...data
        };
        if (!getValues().systolicBp && !getValues().bmi && !getValues().dialosticBp && !getValues().hcInCms && !getValues().heightInCms && !getValues().pulse && !getValues().remarks && !getValues().respiratoryRate && !getValues().spo2 && !getValues().tempInCelsius && !getValues().tempInFahrenheit
            && !getValues().tempInFahrenheit && !getValues().weightInKgs && !getValues().weightInPounds && !position && !site && !siteLocation && !remarks
        ) {
            toast.error("Please enter any one parameter")
        }
        else {
            setLoading(true);
            services
                .create(saveVitals, [postObj])
                .then((response: any) => {
                    toast.success("Updated Successfully!");
                    setTimeout(() => {
                        handleCancel();
                        setLoading(false);
                        setUpdateLoader(false)
                        props.getVitalsData();
                        setValue("recordedBy", data.recordedBy);
                    }, 2000)

                })
                .catch((err) => {
                    setTimeout(() => {
                        console.log(err);
                        setUpdateLoader(false)
                        toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`);
                    }, 2000);
                });
        }

    };
    const handleCancel = () => {
        reset({
            vitalsRecordDateTime: "",
            heightInCms: "",
            weightInKgs: "",
            weightInPounds: "",
            bmi: "",
            hcInCms: "",
            systolicBp: "",
            dialosticBp: "",
            tempInCelsius: "",
            tempInFahrenheit: "",
            pulse: "",
            spo2: "",
            respiratoryRate: "",
            remarks: "",
        });
        setSite(null);
        setSiteLocation(null);
        setPosition(null);
        setRemarks("")
    };
    const handlePositionChange = (e: any) => {
        setValue("position", e);
    };
    const handleSiteChange = (e: any) => {
        setValue("site", e);
    };
    const handleSiteLocationChange = (e: any) => {
        setValue("siteLocation", e);
    };
    const fToC = (e: any) => {
        if (e.target.value != "") {
            setValue("tempInCelsius", (((+e.target.value - 32) * 5) / 9).toFixed(2));
            setValue("tempInFahrenheit", e.target.value);
        } else {
            setValue("tempInFahrenheit", "");
            setValue("tempInCelsius", "");
        }
    };
    const cmsToFeet = (e: any) => {
        let cms = e.target.value;
        if (cms != null) {
            const inches = Math.floor((cms * 0.3937) % 12);
            const feet = Math.floor(cms * 0.0328);
            Bmi();
        }
    };
    const Bmi = () => {
        let heightValue = getValues("heightInCms");
        let weightValue = getValues("weightInKgs");
        if (
            heightValue != null &&
            weightValue != null &&
            heightValue != "" &&
            weightValue != ""
        ) {
            const bmi = (weightValue / heightValue / heightValue) * 10000;
            const bmiV = bmi.toFixed(2);
            setValue("bmi", bmiV);
        }
    };
    const weightToPounds = (e: any) => {
        let weighttopound = e.target.value;
        if (weighttopound != null) {
            const weight = Math.floor(weighttopound / 0.45359237);
            const pound = weight.toFixed(2);
            setValue("weightInPounds", pound);
            Bmi();
        }
    };
    const cToF = (e: any) => {
        if (e.target.value != "") {
            setValue("tempInFahrenheit", ((+e.target.value * 9) / 5 + 32).toFixed(2));
            setValue("tempInCelsius", e.target.value);
        } else {
            setValue("tempInFahrenheit", "");
            setValue("tempInCelsius", "");
        }
    };
    const handleDateChange1 = (date: any) => {
        setDateAndTime(date);
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setValue("vitalsRecordDateTime", date);
    };
    return (
        <div>
            <ToastContainer />
            <div className="block">
                {loading ? <Loader /> : ""}

                <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                    <div className="-mx-3 md:flex py-2 border-b-2 border-blue-gray-50 ">
                        <div className="md:w-2/6 px-3">
                            <DateTime
                                name="vitalsRecordDateTime"
                                onChange={handleDateChange1}
                                inputRef={register("vitalsRecordDateTime")}
                                value={dateAndTime}
                            />
                        </div>
                        <div className="md:w-2/6 px-3 my-2">
                            <Input
                                type="text"
                                value={data.recordedBy}
                                label="Recorded By"
                                inputRef={register("recordedBy",
                                    {
                                        onChange: (e) => {
                                            const inputValue = e.target.value;
                                            e.target.value = sanitizeInput(inputValue);
                                        }
                                    }
                                )}
                                shrink={true}
                                disabled={true}
                            ></Input>
                        </div>
                        <div className="md:w-1/4 px-3 my-2"></div>
                    </div>
                    <p className="text-black-500 flex items-center justify-center lg:justify-start font-bold text-sm mb-2 mt-3">
                        Body Measurement
                    </p>
                    <div className="">
                        <div className="">
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-6">
                                <Input
                                    type="number"
                                    name="heightInCms"
                                    label="Height(in CMS)"
                                    watch={watch}
                                    inputRef={register("heightInCms", {
                                        onChange: (e: any) => {
                                            cmsToFeet(e);
                                        },
                                    })}
                                ></Input>
                                <Input
                                    type="number"
                                    name="weightInKgs"
                                    label="Weight(in KGS)"
                                    watch={watch}
                                    inputRef={register("weightInKgs", {
                                        onChange: (e: any) => {
                                            weightToPounds(e);
                                        },
                                    })}
                                ></Input>
                                <Input
                                    type="number"
                                    name="weightInPounds"
                                    label="Weight(in Pounds)"
                                    watch={watch}
                                    inputRef={register("weightInPounds")}
                                ></Input>
                                <Input
                                    type="number"
                                    name="bmi"
                                    label="BMI"
                                    watch={watch}
                                    inputRef={register("bmi")}
                                ></Input>
                                <Input
                                    type="number"
                                    name="hcInCms"
                                    label="HC in cm's"
                                    watch={watch}
                                    inputRef={register("hcInCms")}
                                ></Input>
                            </div>

                            <p className="text-black-500 flex items-center justify-center lg:justify-start font-bold text-sm my-3">
                                Blood Pressure
                            </p>
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-6">
                                <div className="">
                                    <Input
                                        type="text"
                                        name="systolicBp"
                                        label="Systolic (MmgHg)"
                                        watch={watch}
                                        inputRef={register("systolicBp", {
                                            onChange: (e) => {
                                                const inputValue = e.target.value;
                                                e.target.value = sanitizeInput(inputValue);
                                            }
                                        })}
                                    ></Input>
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        name="dialosticBp"
                                        label="Diastolic (Mmhg)"
                                        watch={watch}
                                        inputRef={register("dialosticBp",
                                            {
                                                onChange: (e) => {
                                                    const inputValue = e.target.value;
                                                    e.target.value = sanitizeInput(inputValue);
                                                }
                                            }
                                        )}
                                    ></Input>
                                </div>
                                <div className="relative">
                                    <ReactSelectBox
                                        value={position}
                                        options={bpPositionList}
                                        onChange={(e: any) => {
                                            setPosition(e);
                                            handlePositionChange(e);
                                        }}
                                        label={"Position"}
                                    />
                                    {/* <Select
                                        primaryColor="blue"
                                        placeholder="Position"
                                        onChange={(e: any) => {
                                            setPosition(e);
                                            handlePositionChange(e);
                                        }}
                                        value={position}
                                        options={bpPositionList}
                                        classNames={{
                                            menuButton: ({ isDisabled }: any) =>
                                                `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                duration-300 focus:outline-none h-[39px]
                                               
                                                ${isDisabled
                                                    ? "bg-blue-gray-200"
                                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                }`,
                                            menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                                    ? `text-white bg-blue-500`
                                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                                }`,
                                        }}
                                    />
                                    <label
                                        style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                                        className={`${position?.label !== undefined
                                            ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                                            : "text-sm opacity-0 top-10"
                                            } 
                                                                                    truncate 
                                                                                    cursor-default 
                                                                                    select-none  
                                                                                    absolute transition-all
                                                                                   `}
                                    >
                                        Position
                                    </label> */}
                                </div>
                                <div className="relative">
                                    <ReactSelectBox
                                        value={site}
                                        options={bpBodySiteList}
                                        onChange={(e: any) => {
                                            setSite(e);
                                            handleSiteChange(e);
                                        }}
                                        label={"Site"}
                                    />
                                    {/* <Select
                                        primaryColor="blue"
                                        placeholder="Site"
                                        onChange={(e: any) => {
                                            setSite(e);
                                            handleSiteChange(e);
                                        }}
                                        value={site}
                                        options={bpBodySiteList}
                                        classNames={{
                                            menuButton: ({ isDisabled }: any) =>
                                                `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                duration-300 focus:outline-none h-[39px]
                                               
                                                ${isDisabled
                                                    ? "bg-blue-gray-200"
                                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                }`,
                                            menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                                    ? `text-white bg-blue-500`
                                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                                }`,
                                        }}
                                    />
                                    <label
                                        style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                                        className={`${site?.label !== undefined
                                            ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                                            : "text-sm opacity-0 top-10"
                                            } 
                                                                                    truncate 
                                                                                    cursor-default 
                                                                                    select-none  
                                                                                    absolute transition-all
                                                                                   `}
                                    >
                                        Site
                                    </label> */}
                                </div>
                            </div>
                            <p className="text-black-500 flex items-center justify-center my-3 lg:justify-start font-bold text-sm">
                                Temperature
                            </p>
                            <div className="xl:flex lg:flex  mt-1">
                                <div className="xl:w-3/4 lg:w-3/4">
                                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-6">
                                        <div className="">
                                            <Input
                                                type="number"
                                                name="tempInCelsius"
                                                label="0 C"
                                                watch={watch}
                                                inputRef={register("tempInCelsius", {
                                                    onChange: (e: any) => {
                                                        cToF(e);
                                                    },
                                                })}
                                            ></Input>
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                name="tempInFahrenheit"
                                                label="0 F"
                                                watch={watch}
                                                inputRef={register("tempInFahrenheit", {
                                                    onChange: (e: any) => {
                                                        fToC(e);
                                                    },
                                                })}
                                            ></Input>
                                        </div>
                                        <div className="relative">
                                            <ReactSelectBox
                                                value={siteLocation}
                                                options={temperatureSiteList}
                                                onChange={(e: any) => {
                                                    setSiteLocation(e);
                                                    handleSiteLocationChange(e);
                                                }}
                                                label={"Site Location"}
                                            />
                                            {/* <Select
                                                primaryColor="blue"
                                                placeholder="Site Location"
                                                onChange={(e: any) => {
                                                    setSiteLocation(e);
                                                    handleSiteLocationChange(e);
                                                }}
                                                value={siteLocation}
                                                options={temperatureSiteList}
                                                classNames={{
                                                    menuButton: ({ isDisabled }: any) =>
                                                        `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                        duration-300 focus:outline-none h-[39px]
                                                       
                                                        ${isDisabled
                                                            ? "bg-blue-gray-200"
                                                            : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                        }`,
                                                    menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                                                    listItem: ({ isSelected }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                                            ? `text-white bg-blue-500`
                                                            : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                                        }`,
                                                }}
                                            />
                                            <label
                                                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                                                className={`${siteLocation?.label !== undefined
                                                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                                                    : "text-sm opacity-0 top-10"
                                                    } 
                                                                                            truncate 
                                                                                            cursor-default 
                                                                                            select-none  
                                                                                            absolute transition-all
                                                                                           `}
                                            >
                                                Site Location
                                            </label> */}
                                        </div>
                                        <div className="">
                                            <Input
                                                type="number"
                                                name="pulse"
                                                label="Pulse(bpm)"
                                                watch={watch}
                                                inputRef={register("pulse")}
                                            ></Input>
                                        </div>
                                        <div className="">
                                            <Input
                                                type="number"
                                                name="spo2"
                                                label="spO2%"
                                                watch={watch}
                                                inputRef={register("spo2")}
                                            ></Input>
                                        </div>
                                        <div className="">
                                            <Input
                                                type="number"
                                                name="respiratoryRate"
                                                label="Respiratory Rate"
                                                watch={watch}
                                                inputRef={register("respiratoryRate", {
                                                })}
                                            ></Input>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="xl:ps-6 xl:mt-0 lg:mt-0 lg:ps-6 sm:mt-6 xxs:mt-6 sm:gap-y-6 md:mt-6 w-full cust-textarea">
                                        <Textarea
                                            minRows={20}
                                            label="Remarks"
                                            name="remarks"
                                            value={remarks}
                                            inputRef={register("remarks")}
                                            onChange={(e: any) => {
                                                setRemarks(sanitizeInput(e.target.value));
                                                setValue("remarks", sanitizeInput(e.target.value));
                                            }}
                                        ></Textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end py-4">
                        <div className="mr-3">
                            <ActionButton
                                buttonText={
                                    updateLoader ?
                                        <div className='w-full flex justify-center items-center'>
                                            <div className='innerBtnloader'></div>
                                        </div> :
                                        "Update"
                                }
                                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={handleSubmit(onSubmit)}

                            />
                        </div>
                        <div className="ml-3">
                            <ActionButton
                                buttonText="Reset"
                                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={handleSubmit(handleCancel)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
