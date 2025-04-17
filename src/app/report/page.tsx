"use client";
import React, { useEffect, useRef, useState } from "react";
import { TabPageTitle } from "../lab/_component";
import ActionButton from "../_common/button";
import services from "../utilities/services";
import { getHeaderResponse } from "../_commonfeatures/header";
import { generateReport, getGroupInerList, getGroupMasterList, getReportFilePath, getReportParameters, getReportParametersValues, uploadReport } from "../utilities/api-urls";
import { toast } from "react-toastify";
import { ReactSelectBox } from "../_commonfeatures";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import ReactCommonDialog from "../_commonfeatures/ReactCommonDialog";
import { Input, Radio, Tooltip } from "@material-tailwind/react";
import CreateGroupForm from "./components/CreateGroupForm";
import moment from "moment";
import DateInput from "../_common/date-input";

const Report = () => {
    const [groupName, setGroupName] = useState<any>("");
    const [groupNameList, setGroupNameList] = useState<any>([]);
    const [report, setReport] = useState<any>("");
    const [reportResponse, setReportResponse] = useState<string>("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [lookUps, setLookUps] = useState<any>([])
    const [popup, setPopup] = useState<any>(false)
    const [uploadpopup, setUploadPopup] = useState<any>(false)
    const [showPreview, setShowPreview] = useState<any>(false)
    const [showGanarateBtn, setShowGanarateBtn] = useState<any>(false)
    const [isEditReportName, setIsEditReportName] = useState<any>(false)
    const [reportValue, setReportValue] = useState<any>("All")
    const [reportData, setReportData] = useState<any>("")
    const [reportlist, setReportList] = useState<any>([])


    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReportResponse("")
        setPdfUrl("")
        setShowPreview(false)
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.name.endsWith(".jrxml")) {
            setReport(selectedFile);
        } else {
            alert("Please select a .jrxml file");
            setReport(null);
        }
    };
    const handleUploadPopup = () => {
        const reportName = reportValue === "All" ? reportData.label : reportData
        let reportInfo;
        if (isEditReportName === true) {
            reportInfo = true
        }
        if (!reportInfo || !groupName || !reportName) {

            if (!groupName) {
                return toast.error("No Group Name provided");
            }
            else if (!reportName) {
                return toast.error("No Report Name provided");
            }
            else if (!report) {
                return toast.error("No file selected");
            }
        }
        setUploadPopup(true)
    }

    const handleClosePopup = () => {
        setUploadPopup(false)
    }


    // const getGroupNameData = async () => {

    //     try {
    //         const response: any = await services.get(`${getReportParametersValues}${reportData?.fileName}/${reportData?.reportName}`);
    //         setShowPreview(true)
    //         setShowGanarateBtn(true)

    //         // Iterate over the params array to get keys
    //         if (response?.data?.lookupKeyValues?.length > 0) {
    //             const lookupKey = response.data.params.map((key: any) => {
    //                 const uniqueOptions = Array.from(
    //                     new Set(
    //                         response?.data?.lookupKeyValues
    //                             .filter((item: any) => item[key] != null && item[key].toString().trim() !== "")
    //                             .map((item: any) => item[key].toString())
    //                     )
    //                 ).map((label: any) => ({
    //                     label: label,
    //                     value: label,
    //                 }));

    //                 return {
    //                     options: uniqueOptions,
    //                     name: formatKeyName(key),
    //                     key: key,
    //                     result: "",
    //                 };
    //             });

    //             const updatedLookUps = lookupKey.map((item: any) => {
    //                 if (item.key.toLowerCase().endsWith("date") && !item.result) {
    //                     return { ...item, result: moment() };
    //                 }
    //                 return item;
    //             });

    //             setLookUps(updatedLookUps);

    //         }
    //         // setLookUps(lookupKey);
    //     } catch (error: any) {
    //         console.error("Error fetching report parameters data", error);
    //         toast.error(error.response?.data?.statusMessage || "something wrong, please try again.")
    //     }
    // };

    const handleUpload = async () => {
        const reportName = reportValue === "All" ? reportData.label : reportData

        let reportInfo;
        if (isEditReportName === true) {
            reportInfo = true
        }
        if (!reportInfo || !groupName || !reportName) {

            if (!groupName) {
                return toast.error("No Group Name provided");
            }
            else if (!reportName) {
                return toast.error("No Report Name provided");
            }
            else if (!report) {
                return toast.error("No file selected");
            }
        }
        await generateReportFile("pdf");
        setReportResponse("")
        setPdfUrl("")
    };

    const generateReportFile = async (format: string) => {
        const reportNameData = reportValue === "All" ? reportData.label : reportData;
        const reportNameId = reportValue === "All" ? reportData.reportId : null;
        const paramsData = lookUps.reduce((acc: any, item: any) => {
            if (item.key) {
                if (item.key.toLowerCase().endsWith("date")) {
                    acc[item.key] = item.result ? moment(item.result).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                } else {
                    acc[item.key] = item.result?.value ? item.result.value : null;
                }
            }
            return acc;
        }, {});
        const postObj = {
            params: paramsData ? paramsData : null,
            jrxmlFilePath: null,
            reportFormat: format,
            reportCategory: groupName.label ? groupName.label : null,
            reportName: reportNameData,
            reportId: reportNameId
        };
        const formData = new FormData();
        formData.append("file", report);
        formData.append("map", JSON.stringify(postObj));

        const headers = { ...getHeaderResponse(), "ContentType": "multipart/form-data" };
        console.log(postObj)

        try {
            const response = await services.create(uploadReport, formData, headers);
            toast.success("Report Uploaded successfully!");
            setShowPreview(true)
            setUploadPopup(false)
            setPopup(false)
            getReportParametersData(response.data)

        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast.error(error.response.data.statusMessage ? error.response.data.statusMessage : "something wrong, please try again");
        }
    };

    const getReportParametersData = async (names: any) => {
        try {
            const response = await services.get(`${getReportParametersValues}${names.concatedFileName}/${names.reportName}`);
            // Iterate over the params array to get keys
            const lookupKey = response.data.params.map((key: any) => {
                const uniqueOptions = Array.from(
                    new Set(
                        response.data.lookupKeyValues
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
        } catch (error) {
            console.error("Error fetching report parameters data", error);
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


    // Handler to update result for the respective lookup
    const handleSelectChange = (selectedValue: any, index: number) => {
        const updatedLookUps = [...lookUps];
        updatedLookUps[index] = { ...updatedLookUps[index], result: selectedValue };
        setLookUps(updatedLookUps);
    };

    const handleDateChange = (e: any, index: number) => {
        const updatedLookUps = [...lookUps];
        updatedLookUps[index] = { ...updatedLookUps[index], result: e };
        setLookUps(updatedLookUps);
    }

    //New Group function
    const handelNewGroup = () => {
        setPopup(true)
    }

    //get Group Master List function
    const getGroupMasterData = async () => {
        try {
            const res = await services.get(getGroupMasterList)
            const result = res.data.map((list: any, inx: any) => ({
                ...list,
                label: list.reportGroupName,
                value: list.reportGroupId
            }))
            setGroupNameList(result)
        } catch (error) {

        }
    }

    // console.log(reportData.fileName)
    // handelPreview function
    const handelPreview = async () => {
        const jrxmlFileName = reportData.fileName ? reportData.fileName : null
        const paramsData = lookUps.reduce((acc: any, item: any) => {
            if (item.key) {
                if (item.key.toLowerCase().endsWith("date")) {
                    acc[item.key] = item.result ? moment(item.result).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                } else {
                    acc[item.key] = item.result?.value ? item.result.value : null;
                }
            }
            return acc;
        }, {});
        const postObj = { params: paramsData ? paramsData : null, jrxmlFilePath: jrxmlFileName, reportFormat: "pdf", };
        const formData = new FormData();
        formData.append("file", report);
        formData.append("map", JSON.stringify(postObj));

        const headers = { ...getHeaderResponse(), "ContentType": "multipart/form-data" };
        try {
            const response = await services.create(generateReport, formData, headers);
            setReportResponse(response.data)
            handleViewPDF(response.data)

        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.response.data.statusMessage);
        }
    }


    // Reset lookUps state to its initial form
    const handleReset = () => {
        const resetLookUps = lookUps.map((item: any) => ({
            ...item,
            result: ""
        }));
        setLookUps(resetLookUps);
        setReportResponse("")
        setPdfUrl("")
    };

    const handleViewPDF = (base64String: string) => {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        byteCharacters.split("").forEach((char, i) => byteNumbers[i] = char.charCodeAt(0));
        const blob = new Blob([byteNumbers], { type: 'application/pdf' });
        setPdfUrl(URL.createObjectURL(blob));
    };
    const handleGroupName = (e: any) => {

        setGroupName(e)
        setReportData("")
        setShowPreview(false)
        setReportResponse("")
        setPdfUrl("")
        setReport(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (e.label) {
            getGroupInerData(e.label)
        }
    }

    const handleChangeReportType = (name: any) => {
        setTimeout(() => {
            setReportValue(name)
            setReportData("")
            setLookUps([]);
            setReportResponse("")
            setPdfUrl("")
            setReportData("")
            setShowPreview(false)
            setIsEditReportName(false)
            setReportResponse("")
            setPdfUrl("")
            setReport(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (name === "All") {
                getGroupInerData(groupName.reportGroupName)
            }
            if (name === "New") {
                setReportList([])
            }
        }, 1);
    }

    // downlode button funcations
    const downloadFile = (base64String: string, format: string) => {
        // Decode the base64 string to binary data
        const decodedData = atob(base64String);
        const byteNumbers = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            byteNumbers[i] = decodedData.charCodeAt(i);
        }

        // Create a blob with the correct MIME type
        const blob = new Blob([byteNumbers], {
            type: format === "pdf"
                ? 'application/pdf'
                : format === "excel"
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    : 'text/csv;charset=utf-8;',
        });

        // Create a URL for the blob and download the file
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${format === "excel" ? "report.xlsx" : `report.${format}`}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    };

    const downloadReportFile = async (format: string) => {
        const reportNameData = reportValue === "All" ? reportData.label : reportData;
        const reportNameId = reportValue === "All" ? reportData.reportId : null;
        const paramsData = lookUps.reduce((acc: any, item: any) => {
            if (item.key) {
                if (item.key.toLowerCase().endsWith("date")) {
                    acc[item.key] = item.result ? moment(item.result).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                } else {
                    acc[item.key] = item.result?.value ? item.result.value : null;
                }
            }
            return acc;
        }, {});
        const postObj = {
            params: paramsData ? paramsData : null,
            jrxmlFilePath: null,
            reportFormat: format,
            reportCategory: groupName.label ? groupName.label : null,
            reportName: reportNameData,
            reportId: reportNameId
        };

        const formData = new FormData();
        formData.append("file", report);
        formData.append("map", JSON.stringify(postObj));

        const headers = { ...getHeaderResponse(), "Content-Type": "multipart/form-data" };

        try {
            const response = await services.create(generateReport, formData, headers);
            setReportResponse(response.data);

            // Handle file download based on format (pdf, csv, excel)
            downloadFile(response.data, format);

        } catch (error: any) {
            console.error("Error generating report:", error);
            toast.error(error.response?.data?.statusMessage || "Error generating report.");
        }
    };

    const handleResetForm = () => {
        setGroupName("")
        setIsEditReportName(false)
        setReportData("")
        handleChangeReportType("All")
        setLookUps([]);
        setReportResponse("")
        setPdfUrl("")
        setShowPreview(false)
        setReport(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setTimeout(() => {
            setReportList([])
            getGroupInerData("")
        }, 100);
    }
    const handelEditReportName = (name: any) => {
        // isEditReportName
        console.log(name)
        setReportData(name)
        setIsEditReportName(true)
    }
    const updateReportName = (e: any) => {
        const obj = {
            ...reportData,
            label: e
        }
        setReportData(obj)
    }
    const getGroupInerData = async (name: any) => {

        try {
            const res = await services.get(getGroupInerList + name)
            const result = res.data.map((list: any) => ({
                ...list,
                label: list.reportName,
                value: list.reportId,
            }))
            setReportList(result)

        } catch (error: any) {
            setReportList([])
        }
    }

    useEffect(() => {
        getGroupMasterData()
    }, [popup])
    return (
        <>
            <div className="mx-auto max-w-7xl pt-4">
                <div className="w-full p-3 bg-white rounded-[12px] mt-5 shadow-[0_3px_6px_#00000029] data-grid-newThem">
                    <TabPageTitle title="Report" />
                    <div className="w-full grid grid-cols-3 gap-4 justify-start my-4">
                        <div className="w-full ">
                            <div className="flex gap-2 w-full">
                                <div className="w-full">
                                    <ReactSelectBox
                                        value={groupName}
                                        options={groupNameList}
                                        onChange={(e) => handleGroupName(e)}
                                        label="Group Name"
                                        isSearchable={true}
                                        height="200"
                                    />
                                </div>
                                <div className="w-auto">
                                    <Tooltip content="Add New Group">
                                        <PlusCircleIcon className="w-9 h-9 cursor-pointer pt-1 text-[#006ac9]" onClick={handelNewGroup} />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="flex gap-6 w-full pt-2">
                                {/* Radio for All */}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="repors"
                                        value="All"
                                        className="form-radio h-5 w-5 text-blue-500"
                                        onClick={() => handleChangeReportType("All")}
                                        checked={reportValue === "All"}
                                    />
                                    <span className="ml-2">All</span>
                                </label>

                                {/* Radio for New */}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="repors"
                                        value="New"
                                        className="form-radio h-5 w-5 text-blue-500"
                                        onClick={() => handleChangeReportType("New")}
                                        checked={reportValue === "New"}
                                    />
                                    <span className="ml-2">New</span>
                                </label>
                            </div>
                        </div>
                        <div className="w-full">
                            {reportValue === "All" &&
                                <div className="w-full flex gap-2">

                                    {isEditReportName ?
                                        <Input
                                            crossOrigin
                                            label="Report Name"
                                            value={reportData.label}
                                            onChange={(e) => updateReportName(e.target.value)}
                                        /> :
                                        <div className="w-full flex gap-2 justify-between">
                                            <div className="w-[90%]">
                                                <ReactSelectBox
                                                    value={reportData}
                                                    options={reportlist}
                                                    onChange={(e) => setReportData(e)}
                                                    label="Report Name"
                                                    isSearchable={true}
                                                    height="200"
                                                />
                                            </div>
                                            {reportData && reportData.label !== "" ?
                                                <PencilIcon className="w-4 h-4 cursor-pointer text-blue-500 mt-2" onClick={() => handelEditReportName(reportData)} />
                                                : null}
                                        </div>
                                    }

                                </div>
                            }
                            {reportValue === "New" &&
                                <Input
                                    crossOrigin
                                    label="Report Name"
                                    value={reportData}
                                    onChange={(e) => setReportData(e.target.value)}
                                />}
                        </div>
                        <div className="w-full">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jrxml"
                                onChange={handleFileChange}
                                className="flex py-2 px-3 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none w-full"
                            />
                        </div>
                        <div className="w-full">
                            <div className="w-full flex gap-3">
                                <ActionButton
                                    buttonText={reportValue === "All" ? "Update" : "Upload"}
                                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={reportValue === "All" ? handleUploadPopup : handleUpload}
                                    disabled={showPreview}
                                // handleSubmit={handleUpload}
                                />
                                <ActionButton
                                    buttonText="Reset"
                                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handleResetForm}
                                />
                                {/* {reportValue === "All" && <ActionButton
                                    buttonText="Preview"
                                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={getGroupNameData}
                                    disabled={!reportData ? true : false}
                                />} */}
                            </div>
                        </div>
                    </div>
                    {showPreview ?
                        <div className="w-full" >
                            <div className='w-full grid grid-cols-3 gap-4'>
                                {lookUps.map((item: any, index: number) => (
                                    <div key={index} className="w-full">
                                        {item.key.toLowerCase().endsWith("date") ? (
                                            <DateInput
                                                onChange={(e: any) => handleDateChange(e, index)}
                                                value={item.result || moment()}
                                                label={item.name}
                                                disableFuture={true}
                                            />
                                        ) :
                                            <ReactSelectBox
                                                isSearchable={true}
                                                options={item.options || []}
                                                value={item.result}
                                                onChange={(selectedValue: any) => handleSelectChange(selectedValue, index)}
                                                label={item.name}
                                                height="200"
                                            />
                                        }
                                    </div>
                                ))}

                            </div>
                            <div className="w-full flex gap-4 mt-4">
                                <ActionButton
                                    buttonText="Preview"
                                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handelPreview}

                                />
                                {lookUps.length > 0 ?
                                    <ActionButton
                                        buttonText="Clear"
                                        width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                        handleSubmit={handleReset}
                                    />
                                    : null}
                            </div>

                        </div>
                        : null}
                    {reportResponse && (
                        <>
                            <div className="w-full py-2 mt-4">
                                <iframe src={`${pdfUrl}#toolbar=0`} width="100%" height="400px" />
                            </div>
                            <div className="w-full mt-2 flex gap-4 justify-end">
                                <ActionButton
                                    buttonText="Download PDF"
                                    width="w-[150px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={() => downloadReportFile("pdf")}
                                />
                                <ActionButton
                                    buttonText="Download CSV"
                                    width="w-[150px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={() => downloadReportFile("csv")}
                                />
                                <ActionButton
                                    buttonText="Download Excel"
                                    width="w-[150px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={() => downloadReportFile("excel")}
                                />

                            </div>
                        </>
                    )}

                </div>
            </div >
            <div>
                <ReactCommonDialog
                    dialogtitle={"Create New Group Master"}
                    open={popup}
                    size={'md'}
                    handler={() => {
                        // setPopup(false)
                    }}
                    popupClose={() => {
                        setPopup(false)
                    }}
                    Content={<CreateGroupForm setPopup={setPopup} />}
                />
            </div>
            <div>
                <ReactCommonDialog
                    dialogtitle={"Alert"}
                    open={uploadpopup}
                    size={'md'}
                    handler={() => {
                        // setPopup(false)
                    }}
                    popupClose={() => {
                        setUploadPopup(false)
                    }}
                    Content={
                        <>
                            <div className="w-full">
                                <p>Do you want to proceed with replacing the current file?</p>
                                <div className="w-full my-3 flex gap-4 justify-end">
                                    <ActionButton
                                        buttonText="Yes"
                                        width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                        handleSubmit={handleUpload}
                                    />
                                    <ActionButton
                                        buttonText="No"
                                        width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                        handleSubmit={handleClosePopup}
                                    />
                                </div>
                            </div>
                        </>
                    }
                />
            </div>
        </>
    );
};

export default Report;
