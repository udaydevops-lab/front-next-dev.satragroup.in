"use client";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import ActionButton from "../_common/button";
import { saveTriageCategory } from "../utilities/api-urls";
import services from "../utilities/services";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import roleInfoScreenData from "../_commonfeatures/ScreenDataHoc";
import NoScreenData from "../_common/NoScreenData";

function TraigeCategory(props: any) {
    const [triageCategory, setTriageCategory] = useState<any>("");
    const traigeCategoryList = [
        {
            value: "TC001",
            label: "Non-Urgent",
        },
        {
            value: "TC002",
            label: "Urgent",
        },
        {
            value: "TC003",
            label: "Immediate",
        },
    ];
    const { patientid, opdEncounterId } = useParams();
    const onSubmit = () => {
        services.create(
            saveTriageCategory +
            "?" +
            "patientId=" +
            patientid +
            "&opdEncounterId=" +
            opdEncounterId +
            "&triageCategory=" +
            triageCategory.label,
            {}
        ).then((response) => {
            toast.success("Triage Category Saved Successfully")
        }).catch((err) => {
            toast.error("Error Saving Triage Category")
        });
    };

    useEffect(() => {

    }, [props.tabVal])
    if (!props?.screenData || props?.screenData.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <div className="min-h-full ">
            <div className={props?.screenData.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <div className="font-bold w-full mx-auto max-w-7xl">
                    <h1>Triage Category</h1>
                </div>

                <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
                    <div className="w-1/4 relative mx-auto mt-3 float-left">
                        <Select
                            primaryColor="blue"
                            placeholder="Triage Category"
                            onChange={(e: any) => {
                                setTriageCategory(e);
                            }}
                            isDisabled={props.disable}
                            options={traigeCategoryList}
                            value={triageCategory}

                        />
                        <label
                            style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                            className={`${triageCategory?.label !== undefined
                                ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                                : "text-sm opacity-0 top-10"
                                } 
                                                                    truncate 
                                                                    cursor-default 
                                                                    select-none  
                                                                    absolute transition-all
                                                                   `}
                        >
                            Triage Category
                        </label>
                    </div>
                    <div className="w-1/4 mx-auto mt-3 float-left ps-3">
                        {props?.screenData.Save === 1 &&
                            <ActionButton
                                width="w-[120px] py-3 bg-blue-500"
                                disabled={props.disable}
                                buttonText="Save" handleSubmit={onSubmit} />
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default roleInfoScreenData(TraigeCategory, "Tcn")