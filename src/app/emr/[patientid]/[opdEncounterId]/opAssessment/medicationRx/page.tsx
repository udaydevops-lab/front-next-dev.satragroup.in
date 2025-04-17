"use client"
import FormPropsTextFields from '@/app/_common/input';
import { getConfigData, getFrequency, getMedication, inActiveMedication, medicationSave, snowmedChiefcomplaint, snowmedData } from '@/app/utilities/api-urls';
import { Dialog, DialogBody, DialogFooter, DialogHeader, Input, Radio, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from '@material-tailwind/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select';
import { v4 as uuidv4 } from "uuid";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import DateInput from '@/app/_common/date-input';
import moment from 'moment';
import Textarea from '@/app/_common/text-area';
import ActionButton from '@/app/_common/button';
import { toast } from 'react-toastify';
import { getLocalItem } from '@/app/utilities/local';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Cross_Icon from '@/app/_common/common_icons/Cross_Icon';
import Check_Icon from '@/app/_common/common_icons/Check_Icon';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useParams, useRouter } from "next/navigation";
import services from '@/app/utilities/services';
import Add_medication_icon from '@/app/_common/common_icons/Add_medication_icon';
import PrintGrid from './PrintGrid';
import Printlayout from '@/app/_common/PrintLayout/printlayout';
import { ReactSelectBox } from '@/app/_commonfeatures';
import { sanitizeInput } from '@/app/utilities/sanitizeInput';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import NoScreenData from '@/app/_common/NoScreenData';

function MedicationRxpage(props: any) {
    const [modaloc, setModaloc] = useState<any>({
        open: false,
    })
    const [dataa, setDataa] = useState<any>([]);
    const [sameData, setSameData] = useState<any>([]);
    const [prevData, setPrevData] = useState<any>([]);
    const [key, setKey] = useState("44")
    const [drugNameSearchdata, setDrugNameSearchdata] = useState<any>([]);
    const [semantic, setSemantic] = useState<string>("real clinical drug");
    const [drugTypeVal, setdrDgTypeVal] = useState<any>("B")
    const [drugNameSearch, setDrugNameSearch] = useState<any>("");
    const [selectedDrug, setSelectedDrug] = useState();
    const [snpmadId, setSnpmadId] = useState("");
    const [dosageQTY, setDosageQTY] = useState("");
    const [dosageFormData, setDosageFormData] = useState<any>([]);
    const [dosageForm, setDosageForm] = useState<any>("");
    const [frequency, setFrequency] = useState<any>("");
    const [frequencyData, setFrequencyData] = useState<any>([]);
    const [days, setDays] = useState("");
    const [duration, setDuration] = useState([]);
    const [durationVal, setDurationVal] = useState<any>("Period");
    const [routeOfAdministation, setRouteOfAdministation] = useState<any>([]);
    const [routeOfAdministationVal, setRouteOfAdministationVal] =
        useState<any>("");
    const [rxday, setRxDay] = useState<any>(moment());
    const [additionalInstructions, setAdditionalInstructions] = useState<any>([]);
    const [additionalInstructionsVal, setAdditionalInstructionsVal] =
        useState<any>("");
    const [instructions, setInstructions] = useState("");
    const [editId, setEditId] = useState("");
    const [editSnomed, setEditSnomed] = useState<any>("");
    const [editConcentId, setEditConcentId] = useState("");
    const [isEditId, setIsEditId] = useState(false);
    const router = useRouter();
    const { patientid, opdEncounterId } = useParams();
    // geting doctor name
    const storedLoginResponse = getLocalItem("loginResponse");
    let empName;
    try {
        empName = storedLoginResponse ? JSON.parse(storedLoginResponse).employeename : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = ""; // Set a default value or handle the error accordingly
    }
    const doctor = empName
    const headers: any = {
        serviceEntityId: getLocalItem("serviceEntityId"),
        locationId: getLocalItem("locationId"),
        "Access-Control-Allow-Origin": "*",
    };
    // get drug name
    const handleDrugNameSearch = async (e: any) => {
        const searchData = e.target.value;
        if (searchData.length >= 2) {
            const response = await services.get(
                snowmedChiefcomplaint +
                `term=${searchData}&state=active&semantictag=${semantic}&acceptability=synonyms&returnlimit=500&refsetid=null&parentid=null&fullconcept=false`, headers
            );
            const result = response.data.map((item: any) => ({
                value: item.id,
                label: item.conceptFsn,
                activeStatus: 1,
                caseSignificanceId: item.caseSignificanceId,
                conceptFsn: item.conceptFsn,
                conceptId: item.conceptId,
                conceptState: item.conceptState,
                definitionStatus: item.definitionStatus,
                effectiveTime: item.effectiveTime,
                hierarchy: item.hierarchy,
                id: item.id,
                isPreferredTerm: item.isPreferredTerm,
                languageCode: item.languageCode,
                moduleId: item.moduleId,
                term: item.term,
                typeId: item.typeId,
            }));
            setDrugNameSearchdata(result);
        }
    };


    //get doses form 
    const handleDosageForm = async (e: any) => {
        try {
            const semanticTag = "dose form";
            const search = e.target.value;
            if (search.length >= 1) {
                const response = await services.get(
                    snowmedChiefcomplaint +
                    `term=${search}&state=active&semantictag=${semanticTag}&acceptability=synonyms&returnlimit=500&refsetid=null&parentid=null&fullconcept=false`
                );

                const result = response.data.map((item: any) => ({
                    value: item.id,
                    label: item.conceptFsn,
                    activeStatus: 1,
                    caseSignificanceId: item.caseSignificanceId,
                    conceptFsn: item.conceptFsn,
                    conceptId: item.conceptId,
                    conceptState: item.conceptState,
                    definitionStatus: item.definitionStatus,
                    effectiveTime: item.effectiveTime,
                    hierarchy: item.hierarchy,
                    id: item.id,
                    isPreferredTerm: item.isPreferredTerm,
                    languageCode: item.languageCode,
                    moduleId: item.moduleId,
                    term: item.term,
                    typeId: item.typeId,
                }));
                setDosageFormData(result);
            }
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };
    const handelRxStartData = (e: any) => {
        setRxDay(e);
    };
    const handleDosageChange = (e: any) => {
        const inputValue = e.target.value;
        const numericValue: any = parseInt(inputValue.replace(/\D/g, ''), 10);
        if (!isNaN(numericValue)) {
            setDosageQTY(numericValue);
        } else {
            setDosageQTY("");
        }
        // setDosageQTY(e.target.value);
    };
    const handleDurationDays = (e: any) => {
        //setDays(e.target.value);
        const inputValue = e.target.value;
        const numericValue: any = parseInt(inputValue.replace(/\D/g, ''), 10);
        if (!isNaN(numericValue)) {
            setDays(numericValue);
        } else {
            setDays("");
        }
    };
    const handleInstructions = (e: any) => {
        setInstructions(sanitizeInput(e.target.value));
    };
    const getRowId = (row: any) => row.id;
    // get medication old data
    const getMedicationData = () => {
        services
            .get(`${getMedication}?patientId=${patientid}`)
            .then((response) => {
                const data = response.data;
                const dataWithSerialNumbers = data.map((item: any, index: number) => ({
                    ...item,
                    id: index + 1,
                }));
                setPrevData(dataWithSerialNumbers);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    // get medication new data
    const getMedicationPrevData = () => {

        services
            .get(`${getMedication}?patientId=${patientid}&opdEncounterId=${opdEncounterId}`)
            .then((response) => {
                const data = response.data;
                const dataWithSerialNumbers = data.map((item: any, index: number) => ({
                    ...item,
                    id: index + 1,
                }));
                setDataa(dataWithSerialNumbers);

            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    // Reseat functionality
    const handleReseat = () => {
        setdrDgTypeVal("B");
        setDays("");
        setRxDay(moment());
        setInstructions("");
        setDosageQTY("");
        setDrugNameSearch("");
        setDosageForm("");
        setFrequency("");
        setRouteOfAdministationVal("");
        setFrequency("");
        setKey(key + key);
        setAdditionalInstructionsVal("");
        setDurationVal("Period");
        setEditId("")
        setIsEditId(false)

    }
    // save functionality
    const handleSave = () => {
        const final = sameData.map((item: any) => ({
            type: item.type,
            dosageQnty: item.dosageQnty,
            duration: item.duration,
            doaseFoam: item.doaseFoam,
            conceptId: item.conceptId,
            routeOfAdministration: item.routeOfAdministration,
            frequance: item.frequance,
            frequencymap: item.frequencymap,
            rxStartDate: item.rxStartDate,
            mealtime: item.mealtime,
            instruction: item.instruction,
            statusFlag: 1,
            snomedData: item.snomedData,
            recordedBy: item.recordedBy,
        }));
        let postObj = {
            patientId: patientid,
            opdEncounterId: opdEncounterId,
            recordedBy: doctor,
            statusFlag: 1,
            opAssessmentMedicationRxSet: final,
        };
        services
            .create(medicationSave, postObj)
            .then((response) => {
                setSameData([]);
                getMedicationData()
                getMedicationPrevData()
                setKey(key + key)
                toast.success("Success")
            })
            .catch((e) => {
                console.log(e.message);
                toast.error("Getting error, Please try again!")
            });

    }
    // Update functionality
    const handleUpdate = () => {
        if (!drugNameSearch) {
            toast.error("Please Add Drug Name.");
        } else if (!dosageQTY) {
            toast.error("Please Add QTY.");
        } else if (!dosageForm) {
            toast.error("Please Add Dosage Form.");
        } else if (!frequency) {
            toast.error("Please Add frequency.");
        } else if (!days) {
            toast.error("Please Add days.");
        } else if (!durationVal) {
            toast.error("Please Add Duration.");
        } else if (!routeOfAdministationVal) {
            toast.error("Please Add Route Of Administation.");
        } else if (!rxday) {
            toast.error("Please Add rxday.");
        } else {
            // Create objData
            const objData = {
                id: editId,
                drugDesc: drugNameSearch.label,
                type: drugTypeVal,
                dosageQnty: dosageQTY,
                doaseFoam: dosageForm.label,
                conceptId: snpmadId,
                duration: days + durationVal,
                routeOfAdministration: routeOfAdministationVal.label,
                rxStartDate: moment(rxday).format("YYYY-MM-DD"),
                frequance: frequency.label,
                mealtime: additionalInstructionsVal.label,
                instruction: instructions,
                snomedData: selectedDrug,
                statusFlag: 1,
                isDiscontinue: false,
                recordedBy: doctor,
            };
            const indexToUpdate = dataa.findIndex((item: any) => item.id === editId);
            if (indexToUpdate !== -1) {
                // Update the specific item in the array
                setDataa((prevSavedData: any) => {
                    const updatedData = [...prevSavedData];
                    updatedData[indexToUpdate] = objData;;
                    return updatedData;
                });
                setSameData((prevSavedData: any) => {
                    const updatedData = [...prevSavedData];
                    updatedData[indexToUpdate] = objData;
                    return updatedData;
                });
            }

            // setdrDgTypeVal("B");
            // setDays("");
            // setRxDay(moment());
            // setInstructions("");
            // setDosageQTY("");
            // setDrugNameSearch("");
            // setDosageForm("");
            // setFrequency("");
            // setRouteOfAdministationVal("");
            // setFrequency("");
            // setKey(key + key);
            // setAdditionalInstructionsVal("");
            // setDurationVal("Period");
            // setEditId("")
            // setIsEditId(false)
            handleReseat()
        }
    }
    // add functionality
    const handleAdd = () => {
        if (!drugNameSearch) {
            toast.error("Please Add Drug Name.");
        } else if (!dosageQTY) {
            toast.error("Please Add QTY.");
        } else if (!dosageForm) {
            toast.error("Please Add Dosage Form.");
        } else if (!frequency) {
            toast.error("Please Add frequency.");
        } else if (!days) {
            toast.error("Please Add days.");
        } else if (!durationVal) {
            toast.error("Please Add Duration.");
        } else if (!routeOfAdministationVal) {
            toast.error("Please Add Route Of Administation.");
        } else if (!rxday) {
            toast.error("Please Add rxday.");
        } else {
            // Create objData
            const objData = {
                id: uuidv4(),
                drugDesc: drugNameSearch.conceptFsn,
                type: drugTypeVal,
                dosageQnty: dosageQTY,
                doaseFoam: dosageForm.label,
                conceptId: snpmadId,
                duration: days + durationVal,
                routeOfAdministration: routeOfAdministationVal.label,
                rxStartDate: moment(rxday).format("YYYY-MM-DD"),
                frequance: frequency.label,
                frequencymap: frequency,
                mealtime: additionalInstructionsVal.label,
                instruction: instructions,
                snomedData: selectedDrug,
                statusFlag: 1,
                isDiscontinue: false,
                recordedBy: doctor,
            };
            let newDataaaa = [...dataa, objData]
            setDataa(newDataaaa)

            let Dataaaa = [...sameData, objData]
            setSameData(Dataaaa)
            //finding Duplicate values


            const finalnewData = Dataaaa.reduce((acc: any, curr: any) => {
                let obj = acc.find((items: any) => (items.snomedData.conceptFsn === curr.snomedData.conceptFsn));

                if (obj) {
                    // toast.error("you enter same data please aware")
                    return acc
                }
                else {
                    return acc.concat([curr])
                }
            }, [])
            setSameData(finalnewData)

            const finalMergeTotalData = newDataaaa.reduce((acc: any, curr: any) => {
                let obj = acc.find((items: any) => (items.snomedData.conceptFsn === curr.snomedData.conceptFsn));

                if (obj) {
                    toast.error("you enter same data please aware")
                    return acc
                }
                else {
                    return acc.concat([curr])
                }
            }, [])
            setDataa(finalMergeTotalData)
            // setdrDgTypeVal("B");
            // setDays("");
            // setRxDay(moment());
            // setInstructions("");
            // setDosageQTY("");
            // setDrugNameSearch("");
            // setDosageForm("");
            // setFrequency("");
            // setRouteOfAdministationVal("");
            // setFrequency("");
            // setKey(key + key);
            // setAdditionalInstructionsVal("");
            // setDurationVal("Period");
            // setDrugNameSearchdata([])
            handleReseat()
        }
    };

    const onEdit = async (rowData: any) => {
        const durationMain = rowData.duration;
        const durationNo = durationMain.match(/\d+/g);
        const durationText = durationMain.match(/[a-zA-Z]+/g).join("");

        setDrugNameSearch({
            ...drugNameSearch,
            label: rowData.drugDesc,
            value: rowData.drugDesc
        })
        setDosageForm({
            ...dosageForm,
            label: rowData.doaseFoam,
            value: rowData.doaseFoam
        })

        setFrequency({
            ...frequency,
            label: rowData.frequance,
            value: rowData.frequance
        })
        setRouteOfAdministationVal({
            ...routeOfAdministationVal,
            label: rowData.routeOfAdministration,
            value: rowData.routeOfAdministration
        })
        setAdditionalInstructionsVal(
            {
                ...additionalInstructionsVal,
                label: rowData.mealtime,
                value: rowData.mealtime
            }
        )
        setdrDgTypeVal(rowData.type)
        setIsEditId(true)
        setEditId(rowData.id)
        setEditSnomed(rowData.snomedData)
        setEditConcentId(rowData.conceptId)
        setDosageQTY(rowData.dosageQnty)

        setRxDay(moment(rowData.rxStartDate))
        setInstructions(rowData.instruction)
        setDays(durationNo)
        setDurationVal(durationText)
    }


    const Additionalinstructions = async () => {
        try {
            const response = await services.get(snowmedData + "419492006 ");
            const result = response.data.map((item: any) => ({
                label: item.fullySpecifiedName,
                value: item.id,
                activeStatus: item.activeStatus,
                definitionStatusId: item.definitionStatusId,
                effectiveTime: item.effectiveTime,
                fullySpecifiedName: item.fullySpecifiedName,
                id: item.id,
                moduleId: item.moduleId,
            }));
            setAdditionalInstructions(result);
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };
    const getRouteData = async () => {
        try {
            const response = await services.get(snowmedData + "284009009");
            const result = response.data.map((item: any) => ({
                label: item.fullySpecifiedName,
                value: item.id,
                activeStatus: 1,
                definitionStatusId: item.definitionStatusId,
                effectiveTime: item.effectiveTime,
                fullySpecifiedName: item.fullySpecifiedName,
                id: item.id,
                moduleId: item.moduleId,
            }));
            setRouteOfAdministation(result);
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };
    const getDuriationData = async () => {
        await services
            .get(getConfigData + "Duration" + "/0")
            .then((response) => {
                const result = response.data.configData.map((item: any) => ({
                    label: item.desc,
                    value: item.code,
                }));
                setDuration(result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    const getFrequencyData = async () => {
        try {
            const response = await services.get(getFrequency);
            const result = response.data.map((item: any) => ({
                value: item.description,
                label: item.description,
                commets: item.commets,
                dayOfWeek: item.dayOfWeek,
                description: item.description,
                duration: item.duration,
                durationUnit: item.durationUnit,
                frequency: item.frequency,
                frequencyMax: item.frequencyMax,
                generatedBy: item.generatedBy,
                generatedDate: item.generatedDate,
                generatedId: item.generatedId,
                period: item.period,
                periodUnit: item.periodUnit,
                snomedId: item.snomedId,
                statusFlag: item.statusFlag,
                updatedBy: item.updatedBy,
                updatedDate: item.updatedDate,
            }));
            setFrequencyData(result);
        } catch (error) {
            console.error("Error while fetching data:", error);
        }
    };
    const onPrevToNew = async (rowData: any) => {
        toast.success("Successfully Added")
        rowData.id = uuidv4()
        delete rowData.medicationId
        setDataa((dataa: any) => [...dataa, { ...rowData, isActive: 1 }])
        setSameData((dataa: any) => [...dataa, { ...rowData, isActive: 1 }])
    }

    // delete the row
    const onDelete = (index: number) => {
        let delComplainfield: any = dataa.filter((items: any) => items.id !== index);
        setDataa(delComplainfield);

    };
    // grid data
    const columns: GridColDef[] = [
        {
            field: "id", headerName: "S No", width: 50,
            renderCell: (params) => {
                const rowNumber = dataa.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        { field: "type", headerName: "Type", width: 50 },
        { field: "drugDesc", headerName: "Drug Details", width: 300 },
        { field: "recordedBy", headerName: "Physician", width: 130 },
        {
            field: "actions",
            headerName: "Actions / Discontinue",
            width: 150,
            renderCell: (params: any) => (
                <>
                    {params.row.medicationId ?
                        <>
                            {params.row.isActive === 0 ? (
                                <button>
                                    <Check_Icon />
                                </button>
                            ) : (
                                <button onClick={(e: any) => setModaloc({ ...modaloc, open: true, row: params.row })
                                }>
                                    <Cross_Icon />
                                </button>
                            )}
                        </>

                        :
                        <>
                            <button onClick={() => onEdit(params.row)} className='me-3'>
                                <PencilIcon className="text-blue-500 w-5 h-5" />
                            </button>
                            <button onClick={() => onDelete(params.row.id)}>
                                <TrashIcon className="text-red-500 w-5 h-5" />
                            </button>
                        </>

                    }
                </>
            ),
        },
    ];
    //prev data
    const prevcolumns: GridColDef[] = [
        {
            field: "id", headerName: "S No", width: 50,
            renderCell: (params) => {
                const rowNumber = prevData.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        { field: "type", headerName: "Type", width: 100 },
        { field: "drugDesc", headerName: "Drug Details", width: 400 },
        { field: "recordedBy", headerName: "Physician", width: 170 },
        {
            field: "select",
            headerName: "Select",
            width: 100,
            renderCell: (params: any) => (
                <>
                    <Tooltip content="Add to New Medication List">
                        <div onClick={() => onPrevToNew(params.row)} data-tooltip-target="tooltip-default" className='cursor-pointer' >
                            <Add_medication_icon />
                        </div>
                    </Tooltip>


                </>
            ),
        },
        {
            field: "discontinue",
            headerName: "Discontinue",
            width: 120,
            renderCell: (params: any) => (
                <>
                    {params.row.isActive === 0 ? (
                        <Check_Icon />
                    ) : (
                        <Cross_Icon />
                    )}
                </>
            ),
        },


    ];
    // print grid
    const PrintRecord = () => {
        const printContent = document.getElementById('sectionToPrint');

        if (printContent) {
            const printWindow = window.open('', '_blank', 'width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no,scrollbars=yes');

            if (printWindow) {
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }

    }

    // inactive function
    const inActiveMark = () => {
        const id = modaloc.row.medicationId
        const inActiveMedicationRow = inActiveMedication + patientid + "/" + opdEncounterId + "/" + id + "/0";

        try {
            services
                .create(inActiveMedicationRow, modaloc.row)
                .then((response) => {
                    getMedicationData()
                    getMedicationPrevData()
                    toast.success("Successfully inactivated the record")
                    setModaloc({
                        ...modaloc, open: false
                    })
                })
                .catch((e) => {
                    console.log(e.message);
                });

        } catch (error) {
            console.error('Error:', error);
        }
    }
    // when click on check box for mark in Reason for visit class added
    const getRowClassName = (params: any) => {
        return params.row.isActive === 0 ? 'disabled-row' : '';
    };
    useEffect(() => {
        getMedicationData()
        getMedicationPrevData()
        getRouteData();
        getFrequencyData();
        Additionalinstructions();
        getDuriationData()
    }, [])

    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <>
            <div className={props?.screenData.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <div id="sectionToPrint" className='hidden w-full'>
                    <Printlayout content={
                        <PrintGrid
                            printData={dataa}

                        />
                    } />

                </div>
                <Tabs value="new" className="z-0 tab">
                    <TabsHeader>
                        <Tab value={"new"}>New Rx</Tab>
                        <Tab value={"Previous"}>Previous Rx</Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel value={"new"} className="!overflow-visible !p-3">
                            <div key={key}>
                                <div className="flex gap-4">
                                    <div className="w-1/4">
                                        <div className="w-full mb-2">
                                            <Radio
                                                crossOrigin={undefined}
                                                value="B"
                                                name="type"
                                                label="Brand"
                                                checked={`${drugTypeVal}` === "B"} // Set the checked state based on the current value
                                                onChange={(e: any) => setdrDgTypeVal(e.target.value)}

                                            />
                                            <Radio
                                                crossOrigin={undefined}
                                                value="G"
                                                name="type"
                                                label="Generic"
                                                checked={`${drugTypeVal}` === "G"} // Set the checked state based on the current value
                                                onChange={(e: any) => setdrDgTypeVal(e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full mb-4 ">
                                            <ReactSelectBox
                                                value={drugNameSearch}
                                                options={drugNameSearchdata}
                                                onSearchInputChange={(e: any) => {
                                                    handleDrugNameSearch(e);
                                                }}
                                                isSearchable={true}
                                                onChange={(e: any) => {
                                                    setDrugNameSearch(e);
                                                    setSelectedDrug(e);
                                                    setSnpmadId(e.conceptId);
                                                }}
                                                isMultiple={false}
                                                label="Drug Name Search"
                                                optionListWidtsize={true}
                                            />
                                        </div>
                                        <div className="w-full mb-4 relative">
                                            {/* <FormPropsTextFields
                                            label="Dosage QTY"
                                            handleChange={handleDosageChange}
                                            value={dosageQTY}
                                            type="number"
                                            className="!rounded-[8px] focus:border-t-0"
                                            containerProps={{
                                                className: "!rounded-[8px] border-t-0 focus:border-t-0"
                                            }}
                                        /> */}

                                            <Input
                                                // type='number'
                                                color="blue"
                                                crossOrigin={false}
                                                name="dosageQTY"
                                                label="Dosage QTY"
                                                value={dosageQTY}
                                                onChange={handleDosageChange}
                                                className=" !rounded-[8px] focus:border-t-0"
                                                containerProps={{
                                                    className: "!min-w-0 ",
                                                }}
                                            />

                                        </div>
                                        <div className="w-full mb-4  my-select relative">
                                            <ReactSelectBox
                                                label="Dosage Form"
                                                value={dosageForm}
                                                options={dosageFormData}
                                                onSearchInputChange={(e: any) => {
                                                    handleDosageForm(e);
                                                }}
                                                isSearchable={true}
                                                onChange={(e: any) => {
                                                    setDosageForm(e);
                                                }}
                                                isMultiple={false}
                                                optionListWidtsize={true}
                                            />

                                        </div>
                                        <div className="w-full mb-4  my-select relative">
                                            <ReactSelectBox
                                                label="Frequency"
                                                value={frequency}
                                                options={frequencyData}
                                                isSearchable={true}
                                                onChange={(e: any) => {
                                                    setFrequency(e);
                                                }}
                                                isMultiple={false}
                                                optionListWidtsize={true}
                                            />

                                        </div>
                                        <div className="relative flex w-full max-w-[24rem] mb-4">
                                            <Input
                                                color="blue"
                                                crossOrigin={false}
                                                name="days"
                                                label="days"
                                                value={days}
                                                onChange={handleDurationDays}
                                                className=" !rounded-[8px] !rounded-r-none border-top focus:border-t-0"
                                                containerProps={{
                                                    className: "!min-w-0 rounded-lg  rounded-r-none !border-r-0",
                                                }}
                                            />
                                            <Menu placement="bottom-start">
                                                <MenuHandler>
                                                    <Button
                                                        ripple={false}
                                                        variant="text"
                                                        color="blue-gray"
                                                        className="flex h-10 w-[80px] items-center gap-2 rounded-l-none 
border border-l-0 border-blue-gray-200
bg-blue-gray-500/10 pl-3 capitalize text-sm font-normal"
                                                    >

                                                        {/* {countryCallingCode} */}
                                                        {durationVal}
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList className="max-h-[20rem] max-w-[18rem]">
                                                    {duration.map((list: any, index: number) => {
                                                        return (
                                                            <MenuItem
                                                                key={index}
                                                                value={list.value}
                                                                className="flex items-center gap-2 capitalize"
                                                                onClick={() => {
                                                                    setDurationVal(list.label)
                                                                }
                                                                }
                                                            >

                                                                {list.label}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </MenuList>
                                            </Menu>
                                        </div>
                                        <div className='w-full mb-4  my-select relative'>
                                            <ReactSelectBox
                                                value={routeOfAdministationVal}
                                                options={routeOfAdministation}
                                                isSearchable={true}
                                                isMultiple={false}
                                                label="Route Of Administation"
                                                onChange={(e: any) => {
                                                    setRouteOfAdministationVal(e);
                                                }}
                                                optionListWidtsize={true}
                                            />

                                        </div>
                                        <div className='w-full mb-4'>
                                            <DateInput
                                                label="Rx Start Data"
                                                value={rxday}
                                                onChange={handelRxStartData}
                                                className={"h-[39px] !rounded-[8px]"}
                                                containerProps={{
                                                    className: "!rounded-[8px]"
                                                }}
                                            />
                                        </div>
                                        <div className='w-full mb-4 my-select relative'>
                                            <ReactSelectBox
                                                value={additionalInstructionsVal}
                                                options={additionalInstructions}
                                                isSearchable={true}
                                                isMultiple={false}
                                                label="Additional Instructions"
                                                onChange={(e: any) => {
                                                    setAdditionalInstructionsVal(e);
                                                }}
                                                optionListWidtsize={true}
                                            />

                                        </div>

                                        <div className="w-full mb-4" key={key}>
                                            <Textarea
                                                label="Instructions"
                                                onChange={handleInstructions}
                                                value={instructions}
                                            />
                                        </div>
                                        <div className='w-full mb-8 flex gap-4 justify-between'>
                                            {isEditId
                                                ?
                                                <ActionButton
                                                    buttonText="UPDATE"
                                                    handleSubmit={handleUpdate}
                                                    width="px-4 w-full"
                                                    height="py-3"
                                                />
                                                :

                                                <ActionButton
                                                    buttonText="ADD"
                                                    handleSubmit={handleAdd}
                                                    width="px-4 w-full"
                                                />
                                            }
                                            <ActionButton
                                                handleSubmit={handleReseat}
                                                buttonText="RESET"
                                                width="w-[120px] py-3 bg-red-500 hover:bg-red-600"
                                            />
                                        </div>
                                    </div>



                                    <div className="w-3/4 pb-3">
                                        <DataGrid
                                            rows={dataa}
                                            columns={columns}
                                            getRowId={getRowId}
                                            pageSizeOptions={[10, 20]}
                                            className='!h-auto'
                                            getRowClassName={getRowClassName}
                                        />
                                        <div className='w-full flex justify-end gap-4 mt-3'>
                                            <ActionButton
                                                buttonText="PUSH "
                                                // handleSubmit={handleAdd}
                                                width="px-4 w-[120PX]"
                                                height="py-3"
                                                disabled={true}
                                            />
                                            {props?.screenData?.Save === 1 &&
                                                <ActionButton
                                                    buttonText="SAVE "
                                                    handleSubmit={handleSave}
                                                    width="px-4 w-[120PX]"
                                                    height="py-3"
                                                    disabled={sameData.length > 0 ? false : true}
                                                />
                                            }
                                            {props?.screenData?.Print === 1 &&
                                                <ActionButton
                                                    buttonText="PRINT"
                                                    handleSubmit={PrintRecord}
                                                    width="px-4 w-[120PX]"
                                                    height="py-3"
                                                    disabled={dataa.length > 0 ? false : true}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </TabPanel>
                        <TabPanel value={"Previous"} className="!overflow-visible !p-3">

                            <div key={key}>
                                <DataGrid
                                    rows={prevData}
                                    columns={prevcolumns}
                                    getRowId={getRowId}
                                    pageSizeOptions={[10, 20]}
                                    className='!h-auto'
                                    getRowClassName={getRowClassName}
                                />
                            </div>
                        </TabPanel>
                    </TabsBody>
                </Tabs >
                {/* {/ Dailog box /} */}

                {/* popup  */}
                <Dialog
                    open={modaloc.open}
                    handler={() => setModaloc({ ...modaloc, open: false })}
                    size={"sm"}
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0.9, y: -100 },
                    }}
                    className="py-5"
                >
                    <DialogHeader className=" justify-center">
                        <div className="w-100">
                            <div className="text-center text-[20px] text-blue-500">
                                Are you sure,
                            </div>
                            <div className="text-center text-[20px] text-blue-500">
                                you want to Discontinue this record?
                            </div>
                        </div>

                    </DialogHeader>
                    <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                        <strong>Note:</strong>
                        Once you Inactive this record, you cannot rollback
                    </DialogBody>
                    <DialogFooter className="text-center justify-center">
                        <Button variant="gradient" color="blue"
                            className="mr-2 bg-blue-500 hover:bg-blue-600" onClick={inActiveMark}>
                            <span>Yes</span>
                        </Button>
                        <Button
                            variant="gradient"
                            className="bg-red-500 hover:bg-red-600"
                            color="red"
                            onClick={() => setModaloc({ ...modaloc, open: false })}
                        >
                            <span>No</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    )
}

export default roleInfoScreenData(MedicationRxpage, "MR")
