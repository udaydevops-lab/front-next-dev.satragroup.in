"use client";
import React, { useEffect, useState } from "react";
import ConfigurationMasterForm from "./_components/ConfigurationMasterForm";
import ConfigurationMasterGrid from "./_components/ConfigurationMasterGrid";
import { InstallState } from "./_components/utilities";
import ConfigurationMasterTotalGrid from "./_components/ConfigurationMasterTotalGrid";
import { Divider } from "@mui/material";
import { LabPagetitle } from "@/app/lab/_component";
import services from "@/app/utilities/services";
import { editConfigurationMaster, getConfigurationMaster, saveConfigurationMaster, statusConfigurationMaster } from "@/app/utilities/api-urls";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { toast } from "react-toastify";
import ConfigurationMasterValueForm from "./_components/ConfigurationMasterValueForm";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ActionButton from "@/app/_common/button";

const ConfigurationMaster = () => {
    const [data, setData] = useState<any>(InstallState);
    const [popup, setPopup] = useState<any>(false);
    const [activePopup, setActivePopup] = useState<any>(false);
    const [activePopupInfo, setActivePopupInfo] = useState<any>();
    const headers = getHeaderResponse()

    // Check if configName and configType are filled
    const isConfigValid = data.configName && data.configType;
    // Check if all rows are complete (no empty values in required fields)
    const isRowsValid = data.configDef.ipcolumns.every((row: any) =>
        row.columnName &&
        row.columnType &&
        row.controlType &&
        row.isMandatory
    );
    // Final condition: Button is disabled if either configName/configType are empty or any row is incomplete
    const isSaveDisabled = !isConfigValid || !isRowsValid;

    const handelSave = async () => {
        const configDefData = data.configDef.ipcolumns.map((list: any) => ({
            columnName: list.columnName,
            columnType: list.columnType?.label,
            controlType: list.controlType?.label,
            isMandatory: list.isMandatory?.label,
            masterDataCode: list.masterDataCode?.label,
            statusFlag: list.statusFlag,
        }));

        const postObj = {
            configId: data?.configId,
            configName: data?.configName,
            configType: data?.configType,
            isDef: 1,
            statusFlag: 1,
            configDef: { ipcolumns: configDefData },
        };

        try {
            const saveResponse = await services.create(saveConfigurationMaster, postObj, headers);
            toast.success(saveResponse?.data?.statusMessage ? saveResponse?.data?.statusMessage : "Successfully Created Configuration Master");
            const res = await services.get(getConfigurationMaster);

            setData((prevData: any) => ({
                ...prevData,
                configData: res?.data,
                configId: null,
                configName: "",
                configType: [],
                remorks: [],
                link: { label: "Link" },
                linkData: [],
                isDef: 1,
                key: Date.now(),
                configDef: {
                    ipcolumns: [
                        {
                            id: Date.now(),
                            columnName: "",
                            columnType: "",
                            controlType: "",
                            isMandatory: "",
                            masterDataCode: "",
                            statusFlag: 1,
                            status: Date.now(),
                        },
                    ],
                    opcolumns: [],
                },
            }));
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong, please try again");
        }
    };

    const handelReset = () => {
        setData((prevData: any) => ({
            ...prevData,
            configId: null,
            configName: "",
            configType: [],
            remorks: [],
            link: { label: "Link" },
            linkData: [],
            isDef: 1,
            key: Date.now(),
            open: false,
            configDef: {
                ipcolumns: [
                    {
                        id: Date.now(),
                        columnName: "",
                        columnType: "",
                        controlType: "",
                        isMandatory: "",
                        masterDataCode: "",
                        statusFlag: 1,
                        status: Date.now(),
                    },
                ],
                opcolumns: [],
            },
        }));
    };

    // handel SaveCongig Values data
    const handelSaveCongigValues = () => {
        const { newConfigRes } = data;
        const isSaveAction = newConfigRes.button === "save";
        const configDataInfo = newConfigRes.configData.map((item: any) => {
            const { isNew, ...rest } = item;
            return { ...rest, statusFlag: 1 };
        });

        const postObj = {
            configId: isSaveAction ? null : newConfigRes.configId,
            statusFlag: 1,
            configName: newConfigRes.configName,
            configData: configDataInfo,
            configType: newConfigRes.configType,
            isDef: 0,
        };
        console.log(postObj)
        const message = isSaveAction
            ? "Successfully Created Configuration Master Information"
            : "Successfully Updated Configuration Master Information";

        services.create(saveConfigurationMaster, postObj, headers)
            .then(response => {
                toast.success(response?.data?.statusMessage || message);
                setPopup(false);
                getconfigData();
                handelReset();
            })
            .catch(() => {
                toast.error("Something went wrong, please try again");
            });
    };


    const getconfigData = async () => {
        try {
            let res = await services.get(getConfigurationMaster)
            setData({
                ...data,
                configData: res.data
            });
        } catch (error) {
        }
    }

    const closePopup = () => {
        // handelReset()
        setPopup(false)
    }

    const activeconfig = (row: any) => {
        setActivePopup(true)
        setActivePopupInfo(row)
    }
    const activePopupconfig = () => {
        const postObj = {
            statusFlag: activePopupInfo.statusFlag == 1 ? 0 : 1,
            isDef: 1,
            configName: activePopupInfo.configName,
        }
        const message = activePopupInfo.statusFlag == 1 ? "Successfully inactivated the record" : "Successfully activated the record"
        services
            .create(statusConfigurationMaster, postObj, headers)
            .then((response) => {
                toast.success(message);
                getconfigData()
                setActivePopup(false)
                setActivePopupInfo(null)
            })
            .catch((e) => {
                console.log(e.message);
            });
    }
    useEffect(() => {
        getconfigData()
    }, [])
    // console.log(data)
    return (
        <>
            <div className="w-full bg-white">
                <div className="w-full mb-4">
                    <LabPagetitle title="Configuration Master" />
                </div>
                <ConfigurationMasterForm data={data} setData={setData} />
                <ConfigurationMasterGrid
                    data={data}
                    setData={setData}
                    handelSave={handelSave}
                    handelReset={handelReset}
                    isSaveDisabled={isSaveDisabled}
                />
                <div className="w-full mt-4 pb-6">
                    <Divider />
                </div>
                <ConfigurationMasterTotalGrid data={data} setData={setData} activeconfig={activeconfig} setPopup={setPopup} />

                <ReactCommonDialog
                    dialogtitle={"Configuration Master Data"}
                    open={popup}
                    size={"xl"}
                    handler={() => { }}
                    popupClose={closePopup}
                    Content={<ConfigurationMasterValueForm data={data} setData={setData} handelSaveCongigValues={handelSaveCongigValues} setPopup={setPopup} />}
                />

                <ReactCommonDialog
                    dialogtitle={"Configuration Master Active/Inactive"}
                    open={activePopup}
                    size={"md"}
                    handler={() => { }}
                    popupClose={() => setActivePopup(false)}
                    Content={<>
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            You want to Active/Inactive this Item?
                        </div>
                        <div className="w-full mt-5 flex justify-end gap-4">
                            <ActionButton
                                buttonText="Submit"
                                width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                                handleSubmit={activePopupconfig}
                            />
                            <ActionButton
                                buttonText="Cancel"
                                width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                                handleSubmit={() => setActivePopup(false)}
                            />

                        </div>
                    </>}
                />

            </div>
        </>
    );
};

export default ConfigurationMaster;
