import ActionButton from '@/app/_common/button'
import DateInput from '@/app/_common/date-input';
import { ReactSelectBox } from '@/app/_commonfeatures'
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { LabPagetitle } from '@/app/lab/_component';
import { generateReport } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import moment from 'moment';
import React, { FC } from 'react'
import { toast } from 'react-toastify';
interface AccordionInfoProps {
    lookUps: any,
    setLookUps: any,
    setReportResponse: any,
    reportResponse: any,
    pdfUrl: any,
    setPdfUrl: any,
    groupName: any,
    groupNameTitle: any,
}

const AccordionInfo: FC<AccordionInfoProps> = ({ lookUps, setLookUps, reportResponse, pdfUrl, setReportResponse, setPdfUrl, groupName, groupNameTitle }) => {

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

    const handelPreview = async () => {
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
        const postObj = { params: paramsData ? paramsData : null, jrxmlFilePath: groupName, reportFormat: "pdf", };
        const formData = new FormData();
        formData.append("file", "null");
        formData.append("map", JSON.stringify(postObj));

        const headers = { ...getHeaderResponse(), "ContentType": "multipart/form-data" };
        try {
            const response = await services.create(generateReport, formData, headers);
            setReportResponse(response.data)
            handleViewPDF(response.data)

        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.response?.data?.statusMessage || "something wrong, please try again.");
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
        const postObj = { params: paramsData ? paramsData : null, jrxmlFilePath: groupName, reportFormat: format };
        const formData = new FormData();
        formData.append("file", "null");
        formData.append("map", JSON.stringify(postObj));

        const headers = { ...getHeaderResponse(), "Content-Type": "multipart/form-data" };

        try {
            const response = await services.create(generateReport, formData, headers);
            setReportResponse(response.data);
            downloadFile(response.data, format);

        } catch (error: any) {
            console.error("Error generating report:", error);
            toast.error(error.response?.data?.statusMessage ? error.response?.data?.statusMessage : "Error generating report.");
        }
    };
    return (
        <>
            <div className=" w-full mt-3">
                <div className=" w-full pb-2 capitalize">
                    <LabPagetitle title={groupNameTitle}></LabPagetitle>
                </div>
                {lookUps && (
                    <>
                        <div className='w-full grid grid-cols-3 gap-4 mb-3'>
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
                                        />
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex gap-4 ">
                            <ActionButton
                                buttonText="Generate"
                                width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={handelPreview}
                            />
                            {lookUps.length > 0 ?
                                <ActionButton
                                    buttonText="Reset"
                                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handleReset}
                                />
                                : null}
                        </div>
                    </>
                )}
            </div>
            <div className='w-full py-3'>
                {reportResponse && (
                    <>
                        <div className="w-full py-2">
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
        </>

    )
}

export default AccordionInfo