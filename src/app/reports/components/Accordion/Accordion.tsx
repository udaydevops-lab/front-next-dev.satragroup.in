
"use client"

import { useEffect, useState } from "react";
import AccordionInfo from "./AccordionInfo";
import SamplecollectionIcon from "../../../../../public/icons/lab/samplecollectionicon";
import { ChevronDownIcon, ChevronUpIcon, DocumentIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";

import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { reportupdateStatusFlag } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { toast } from "react-toastify";

type AccordionProps = {
    title: string;
    isOpen: boolean;
    onClick: () => void;
    fetchData: () => void;
    getGroupNameData: any
    groupNameTitle: any
    isReportScreen: any
};

const Accordion = ({ title, isOpen, onClick, fetchData, getGroupNameData, groupNameTitle, isReportScreen }: AccordionProps) => {
    const [inerList, setInerList] = useState<any>([])
    const getfetchData = async () => {
        const res = await fetchData();
        setInerList(res)
    }

    const handleUpdateStaues = async (reportNameinfo: any) => {
        const postobj = {
            reportName: reportNameinfo.reportName,
            statusFlag: reportNameinfo.statusFlag === 1 ? 0 : 1
        }
        const message = reportNameinfo.statusFlag === 1 ? "Successfully inactivated the record" : "Successfully Activated the record"
        console.log(postobj)
        await services
            .create(reportupdateStatusFlag, postobj)
            .then((response: any) => {
                getGroupNameData(reportNameinfo.fileName, reportNameinfo.reportName)
                toast.success(message);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    useEffect(() => {
        if (isOpen) {
            getfetchData();
        }
    }, [isOpen, fetchData]);

    return (
        <>
            <div className="w-full bg-gray-200 border-gray-300 border-solid border-b-[1px]">
                <div className="w-full">
                    <button
                        onClick={onClick}
                        className={`capitalize ps-2 w-full text-left py-3 text-mb font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none ${isOpen ? "bg-gray-100" : ""}`}
                    >
                        <div className="w-full flex justify-between pe-2">
                            <span>{title}</span>
                            <span>
                                {isOpen ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-700" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                                )}
                            </span>
                        </div>
                    </button>

                    {isOpen && (
                        <div className="w-full p-1 bg-gray-50">
                            <ul>
                                {inerList && inerList.map((item: any, inx: number) => {
                                    return (

                                        <li key={item.reportId} style={{ listStyleType: "revert-layer" }} className={`w-full flex gap-3 cursor-pointer capitalize p-1 ps-2 text-[14px]  ${item.reportName === groupNameTitle ? "bg-gray-300 rounded-sm" : ""}`}
                                        >
                                            <div className="w-full flex justify-between">
                                                <div className="flex w-auto gap-2" onClick={(e: any) => getGroupNameData(item.fileName, item.reportName)}>
                                                    <DocumentTextIcon className=" w-5 h-5 rounded-full justify-center flex items-center bg-blue-700 text-white p-[2px]" />
                                                    {item.reportName}
                                                </div>
                                                {!isReportScreen &&
                                                    <div onClick={(e) => {
                                                        {
                                                            e.stopPropagation();
                                                            handleUpdateStaues(item);
                                                        }
                                                    }
                                                    } className="w-auto flex justify-start align-top">
                                                        {item.statusFlag === 0 ? (
                                                            // <InactiveIcon />
                                                            <ToggleOffIcon color="disabled" />
                                                        ) : (
                                                            <ToggleOnIcon color="primary" />
                                                        )}
                                                    </div>
                                                }
                                            </div>
                                        </li>

                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default Accordion;
