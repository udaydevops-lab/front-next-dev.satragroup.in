"use client";
import { useEffect, useState } from "react";
import services from "../utilities/services";
import { generateReport, getActiveGroupInerList, getGroupInerList, getGroupMasterList, getReportParametersValues } from "../utilities/api-urls";
import Accordion from "./components/Accordion/Accordion";
import { toast } from "react-toastify";
import AccordionInfo from "./components/Accordion/AccordionInfo";
import { getHeaderResponse } from "../_commonfeatures/header";
import moment from "moment";
import { usePathname } from 'next/navigation'

const Reports = () => {
    const [groupNameList, setGroupNameList] = useState<any>([]);
    const [groupName, setGroupName] = useState<any>();
    const [groupNameTitle, setGroupNameTitle] = useState<any>();
    const [showAccordionInfo, setShowAccordionInfo] = useState<any>(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [lookUps, setLookUps] = useState<any>([]);
    const [reportResponse, setReportResponse] = useState<string>("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [isReportScreen, setIsReportScreen] = useState(false)
    const pathname = usePathname()
    var pathnameNew = pathname.replace('/', '');
    const checkScreenPath = async () => {
        if (pathnameNew === "reports") {
            setIsReportScreen(true);
        } else {
            setIsReportScreen(false);
        }
    };
    let groupInerListUrl = isReportScreen ? getActiveGroupInerList : getGroupInerList

    //fetch Data function
    const fetchData = async (name: any) => {
        try {
            const response = await services.get(groupInerListUrl + name);
            return response.data
        } catch (error: any) {
            toast.error(error.response.data.statusMessage)
        }
    };

    // getting group names function
    const getGroupNameList = async () => {
        try {
            const res = await services.get(getGroupMasterList);
            setGroupNameList(res.data);
        } catch (error) {
            console.error("Error fetching group names", error);
        }
    };

    //accordion function
    const handleAccordionClick = (index: number) => {
        // Toggle the clicked accordion and close any others
        setActiveIndex(activeIndex === index ? null : index);
        setLookUps([])
        setReportResponse("")
        setPdfUrl("")
        setShowAccordionInfo(false)
    };

    // geting Group Name List function
    const getGroupNameData = async (name: any, title: any) => {
        setGroupNameTitle(title)
        setGroupName(name)
        setShowAccordionInfo(true)
        setLookUps([])
        setReportResponse("")
        setPdfUrl("")
        try {
            const response = await services.get(`${getReportParametersValues}${name}/${title}`);
            // Iterate over the params array to get keys
            if (response?.data?.lookupKeyValues?.length > 0) {
                const lookupKey = response.data.params.map((key: any) => {
                    const uniqueOptions = Array.from(
                        new Set(
                            response?.data?.lookupKeyValues
                                .filter((item: any) => item[key] != null && item[key].toString().trim() !== "")
                                .map((item: any) => item[key].toString())
                        )
                    ).map((label: any) => ({
                        label: label,
                        value: label,
                    }));

                    return {
                        options: uniqueOptions,
                        name: formatKeyName(key),
                        key: key,
                        result: "",
                    };
                });

                const updatedLookUps = lookupKey.map((item: any) => {
                    if (item.key.toLowerCase().endsWith("date") && !item.result) {
                        return { ...item, result: moment() };
                    }
                    return item;
                });

                setLookUps(updatedLookUps);
            }

            // setLookUps(lookupKey);
        } catch (error: any) {
            console.error("Error fetching report parameters data", error);
            toast.error(error.response?.data?.statusMessage || "something wrong, please try again.")
        }
    };

    // Format the key name to make it readable
    const formatKeyName = (key: string) => {
        // Check if the key is in snake_case (patient_id) or camelCase (patientId)
        if (key.includes('_')) {
            // Convert snake_case to readable format
            return key.replace(/_/g, ' ').replace(/^./, (str: string) => str.toUpperCase());
        } else {
            // Convert camelCase to readable format
            return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
        }
    };


    useEffect(() => {
        getGroupNameList();
    }, []);

    useEffect(() => {
        checkScreenPath()
    }, [pathname])

    return (
        <div className="mx-auto max-w-7xl pt-2">
            <div className="w-full p-3 bg-white rounded-[12px] mt-5 shadow-[0_3px_6px_#00000029]">
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4">
                        {groupNameList && groupNameList.length > 0 ? (
                            groupNameList.map((list: any, index: number) => (
                                <div key={index} className="w-full border-b border-gray-200">
                                    <Accordion
                                        title={list.reportGroupName}
                                        isOpen={activeIndex === index}
                                        onClick={() => handleAccordionClick(index)}
                                        fetchData={() => fetchData(list.reportGroupName)}
                                        getGroupNameData={getGroupNameData}
                                        groupNameTitle={groupNameTitle}
                                        isReportScreen={isReportScreen}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No data available, Please contact Admin</p>
                        )}
                    </div>
                    <div className="w-full md:w-3/4">
                        {showAccordionInfo &&
                            <AccordionInfo
                                lookUps={lookUps}
                                setLookUps={setLookUps}
                                reportResponse={reportResponse}
                                setReportResponse={setReportResponse}
                                pdfUrl={pdfUrl}
                                setPdfUrl={setPdfUrl}
                                groupName={groupName}
                                groupNameTitle={groupNameTitle}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Reports;
