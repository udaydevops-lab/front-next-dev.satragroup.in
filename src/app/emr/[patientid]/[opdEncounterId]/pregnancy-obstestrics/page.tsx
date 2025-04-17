"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
    Autocomplete,
    Checkbox,
    Divider,
    RadioGroup,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Button,
    Paper,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import services from "@/app/utilities/services";
import {
    getConfigData,
    getPregnancyTrimester,
    savePregnancy,
    snomedSearchByTermAndSemanticTag,
} from "@/app/utilities/api-urls";
import { DialogueBox } from "@/app/_common/graph";
import PregnancyUpdatePop from "./_components/pregnancy-update-pop";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import FormPropsTextFields from "@/app/_common/input";
import ControllerSelect from "@/app/_common/select";
import CheckboxMui from "@/app/check-box";
import { Radio } from "@material-tailwind/react";
import Textarea from "@/app/_common/text-area";
import DeleteIcon from "../../../../../../public/icons/cpoe/delete-icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getLocalItem,
    jsonParse,
    removeLocalItem,
    setLocalItem,
} from "@/app/utilities/local";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { randomUUID } from "crypto";
import PatientHeader from "../_components/patient-header";
import Select from "react-tailwindcss-select";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import EditIcon from "../../../../../../public/icons/cpoe/edit-icon";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

const initialTableData: TableData[] = [
    {
        sno: 1,
        dateOfDelivery: "",
        prematuredBaby: "",
        method: "",
        deliveryType: "",
        complicationsDuringPragnancy: "",
    },
];
type TableData = {
    [key: string]: any;
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function PregnancyObstestrics(props: any) {
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
    const searchParam = useParams();
    const patient_Id = searchParam.patientid;
    const encounterId = searchParam.opdEncounterId;
    const [values, setValues] = React.useState(0);
    const [maritalStatusList, setMaritalStatusList] = useState([]);
    const [deliveryTypeList, setDeliveryTypeList] = useState([]);
    const [sexuallyActiveList, setSexuallyActiveList] = useState([]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValues(newValue);
    };
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }
    const [methodData, setMethodData] = useState([]);
    const [trimesterList, setTrimesterList] = useState<any>([]);
    const [gridList, setGridList] = useState([]);
    const handleMarital = (e: any) => {
        setMaritalStatus(getValues().maritialStatus);
    };
    const [obsDetails, setObsDetails] = useState({});
    const [pregnancyId, setPregnancyId] = useState(0);
    const [pregnancyRespo, setPregnancyRespo] = useState({
        pregnancyId: null,
        pregnancyRecord: {
            pregnancyRecord: {
                obstetricHistoryDetails: {
                    ageOfMenarche: "",
                    lmp: "",
                    edd: "",
                    maritalStatus: "",
                    durationOfMarriage: "",
                    sexuallyActive: "",
                    anyHxOfArt: "",
                    anyHxOfArtComments: "",
                    G: "",
                    P: "",
                    A: "",
                    L: "",
                    comments: "",
                    historyOfProphyiaxisUsage: "",
                    historyOfProphyiaxisUsageComments: "",
                    misCarriage: "",
                },
                childHistory: [
                    {
                        dateOfDelivery: "",
                        prematuredBaby: "",
                        method: "",
                        deliveryType: "",
                        complicationsDuringPragnancy: "",
                    },
                ],
                currentPregnancy: {},
            },
            patientId: 0,
        },
        patientId: 0,
        isDelivered: 0,
    });
    const [proResponse, setProResponse] = useState("");
    const [artHxResponse, setArtHxResponse] = useState("");
    const onLoading = () => {
        removeLocalItem("pregnancyId");
        services.get(getPregnancyTrimester + patient_Id).then((response) => {
            if (response.data.statusMessage) {

            } else {
                setLocalItem("pregnancyId", response.data.pregnancyId);
                setPregnancyRespo(response.data);
                setObsDetails(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                );
                setAgeOfMenacrchy(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .ageOfMenarche
                );
                setDurationOfMarriage(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .durationOfMarriage
                );
                let active =
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .sexuallyActive;
                setSexuallyActive(active);
                setG(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails.G
                );
                setP(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails.P
                );
                setA(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails.A
                );
                setL(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails.L
                );
                setAnyHxOfArtComments(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .anyHxOfArtComments
                );
                setMiscarriage(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .misCarriage
                );
                setComments(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .comments
                );
                setLmpDate(
                    moment(
                        response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                            .lmp,
                        "DD/MM/YYYY"
                    )
                );
                setIsChecked(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .isPregnant
                );
                if (
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .anyHxOfArt == "yes"
                ) {
                    setArtComments(true);
                } else {
                    setArtComments(false);
                }
                if (
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .anyHxOfArt == "yes"
                ) {
                    setProComments(true);
                } else {
                    setProComments(false);
                }
                setKey1((k) => k + 1);
                setKey2((k) => k + 1);
                setEddDate(
                    moment(
                        response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                            .lmp,
                        "DD/MM/YYYY"
                    ).add(280, "days")
                );
                setArtHxResponse(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .anyHxOfArt
                );
                setProResponse(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .historyOfProphyiaxisUsage
                );
                setProphylaxisComments(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .historyOfProphyiaxisUsageComments
                );
                setMaritalStatus(
                    response.data.pregnancyRecord.pregnancyRecord.obstetricHistoryDetails
                        .maritalStatus
                );
                setMKey((k) => k + 1);
                let tabdata: any = [];
                response.data.pregnancyRecord.pregnancyRecord.childHistory.map(
                    (item: any, index: number) => {
                        let obj = {
                            sno: index + 1,
                            dateOfDelivery: moment(moment(item.dateOfDelivery, "DD/MM/YYYY")),
                            prematuredBaby: item.prematuredBaby,
                            method: item.method,
                            deliveryType: item.deliveryType,
                            complicationsDuringPragnancy: item.complicationsDuringPragnancy,
                        };
                        tabdata.push(obj);
                    }
                );
                setTableData(tabdata);
                let arr: any = [];
                if (
                    response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                        ?.trimester
                ) {
                    setTrimesterList(
                        response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                            ?.trimester
                    );
                }
                let arrayList =
                    response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                        ?.trimester;
                arrayList?.map((item: any, index: number) => {
                    if (item["trimester1"] != undefined) {
                        let obj = {
                            pregnancyId: response.data.pregnancyId,
                            id: index + 1,
                            trimester: `Trimester 1`,
                            date: item.trimester1.date,
                            findings: item.trimester1.findings!,
                            recordedBy: item.trimester1.recordedBy!,
                            maternalWeight: item.trimester1.maternalWeight,
                            gestationalDiabetes: item.trimester1.gestationalDiabetes,
                            thyroid: item.trimester1.thyroid,
                            thyroidValues: item.trimester1.thyroidValues,
                            hr: item.trimester1.fetus.hr,
                            wt: item.trimester1.fetus.wt,
                            hc: item.trimester1.fetus.hc,
                            limbs: item.trimester1.fetus.limbs,
                            length: item.trimester1.fetus.length,
                            comments: item.trimester1.fetus.comments,
                            plan: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.plan,
                            planComments:
                                response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                    ?.planComments,
                            risk: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.risk,
                        };
                        arr.push(obj);
                        setGridList(arr);
                    } else if (item["trimester2"] != undefined) {
                        let obj = {
                            pregnancyId: response.data.pregnancyId,
                            id: index + 1,
                            trimester: `Trimester 2`,
                            date: item.trimester2.date,
                            findings: item.trimester2.findings!,
                            recordedBy: item.trimester2.recordedBy!,
                            maternalWeight: item.trimester2.maternalWeight,
                            gestationalDiabetes: item.trimester2.gestationalDiabetes,
                            thyroid: item.trimester2.thyroid,
                            thyroidValues: item.trimester2.thyroidValues,
                            hr: item.trimester2.fetus.hr,
                            wt: item.trimester2.fetus.wt,
                            hc: item.trimester2.fetus.hc,
                            limbs: item.trimester2.fetus.limbs,
                            length: item.trimester2.fetus.length,
                            comments: item.trimester2.fetus.comments,
                            plan: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.plan,
                            planComments:
                                response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                    ?.planComments,
                            risk: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.risk,
                        };
                        arr.push(obj);
                        setGridList(arr);
                    } else if (item["trimester3"] != undefined) {
                        let obj = {
                            pregnancyId: response.data.pregnancyId,
                            id: index + 1,
                            trimester: `Trimester 3`,
                            date: item.trimester3.date,
                            findings: item.trimester3.findings!,
                            recordedBy: item.trimester3.recordedBy!,
                            maternalWeight: item.trimester3.maternalWeight,
                            gestationalDiabetes: item.trimester3.gestationalDiabetes,
                            thyroid: item.trimester3.thyroid,
                            thyroidValues: item.trimester3.thyroidValues,
                            hr: item.trimester3.fetus.hr,
                            wt: item.trimester3.fetus.wt,
                            hc: item.trimester3.fetus.hc,
                            limbs: item.trimester3.fetus.limbs,
                            length: item.trimester3.fetus.length,
                            comments: item.trimester3.fetus.comments,
                            plan: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.plan,
                            planComments:
                                response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                    ?.planComments,
                            risk: response.data.pregnancyRecord.pregnancyRecord.currentPregnancy
                                ?.risk,
                        };
                        arr.push(obj);
                        setGridList(arr);
                    }
                });
                setPregnancyId(response.data.pregnancyId);
                setKey3((k) => k + 1);
                setKey4((k) => k + 1);
            }

        });
        services
            .get(getConfigData + "DeliveryMethodUsed" + "/0")
            .then((response) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setMethodData(transformedData);
            })
            .catch((err) => {
                console.log(err.message);
            });
        services
            .get(getConfigData + "Maritalstatus" + "/0")
            .then((response) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setMaritalStatusList(transformedData);
            })
            .catch((err) => {
                console.log(err.message);
            });
        services
            .get(getConfigData + "SexuallyActive" + "/0")
            .then((response) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setSexuallyActiveList(transformedData);
            })
            .catch((err) => {
                console.log(err.message);
            });
        services
            .get(getConfigData + "DeliveryType" + "/0")
            .then((response) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    value: item.code,
                    label: item.desc,
                }));
                setDeliveryTypeList(transformedData);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    useEffect(() => {
        onLoading();
    }, []);

    const items = [
        {
            value: "trimester1",
            label: "Trimester 1",
        },
        {
            value: "trimester2",
            label: "Trimester 2",
        },
        {
            value: "trimester3",
            label: "Trimester 3",
        },
    ];
    const columns2: GridColDef[] = [
        { field: "id", headerName: "S.No.", width: 70 },
        { field: "trimester", headerName: "Trimester", width: 150 },
        {
            field: "date",
            headerName: "Record Date",
            width: 150,
        },
        { field: "recordedBy", headerName: "Recorded By", width: 150 },
        {
            field: "findings",
            headerName: "Findings",
            width: 150,
            renderCell: (params: any) => <>{params.row.findings[0]?.term}</>,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <>
                    <DialogueBox
                        className={"items-center font-semibold cursor-pointer'"}
                        icon={"Edit / View"}
                        size={"lg"}
                        btnsize="10px"
                        buttonColor="red"
                        header={"Trimester"}
                        classNameDialogue="h-[30rem] overflow-scroll"
                        content={
                            <PregnancyUpdatePop onLoading={onLoading} data={params.row} />
                        }
                    />
                </>
            ),
        },
    ];
    const [diaChecked, setDiaChecked] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const handleDiaChange = () => {
        setDiaChecked(!diaChecked);
    };
    const handleIsCheckedChange = () => {
        setIsChecked(!isChecked);
    };
    const [tableData, setTableData] = useState(initialTableData);

    const addRow = () => {
        const newSNO = tableData[tableData.length - 1].sno + 1;
        const newRow = {
            sno: newSNO,
            dateOfDelivery: "",
            prematuredBaby: "",
            method: "",
            deliveryType: "",
            complicationsDuringPragnancy: "",
        };
        setTableData([...tableData, newRow]);
    };
    const handleInputChange = (event: any, sno: any, columnName: any) => {
        const updatedTableData = [...tableData];
        const rowIndex = updatedTableData.findIndex((row) => row.sno === sno);
        updatedTableData[rowIndex][columnName] = event;
        setTableData(updatedTableData);
    };
    const handleCompliChange = (event: any, sno: any, columnName: any) => {
        const updatedTableData = [...tableData];
        const rowIndex = updatedTableData.findIndex((row) => row.sno === sno);
        updatedTableData[rowIndex][columnName] = sanitizeInput(event.target.value);
        setTableData(updatedTableData);
    };
    const handleDateChange = (event: any, sno: any, columnName: any) => {
        const updatedTableData = [...tableData];
        const rowIndex = updatedTableData.findIndex((row) => row.sno === sno);
        if (rowIndex !== -1) {
            updatedTableData[rowIndex][columnName] = event;
            setTableData(updatedTableData);
        }
    };

    const deleteRow = (sno: number) => {
        if (tableData.length > 1) {
            const updatedTableData = tableData.filter((row) => row.sno !== sno);
            setTableData(updatedTableData);
        }
    };

    const handleRadioChange = (event: any, sno: any, columnName: any) => {
        const updatedTableData = [...tableData];
        const rowIndex = updatedTableData.findIndex((row) => row.sno === sno);
        updatedTableData[rowIndex][columnName] = event.target.value;
        setTableData(updatedTableData);
    };

    const [artComments, setArtComments] = useState(false);
    const [proComments, setProComments] = useState(false);
    const [showThyroid, setShowThyroid] = useState(false);
    const [anyHxOfArt, setAnyHxOfArt] = useState("");
    const [prophylaxis, setProphylaxis] = useState(proResponse);
    const handleArtRadioChange = (e: any) => {
        setAnyHxOfArt(e.target.value);
        if (e.target.value === "yes") {
            setArtHxResponse("yes");
        } else {
            setArtHxResponse("no");
        }
    };
    const handleProRadioChange = (e: any) => {
        setProphylaxis(e.target.value);
        handleData(e, "historyOfProphyiaxisUsage");
        if (e.target.value === "yes") {
            setProResponse("yes");
        } else {
            setProResponse("no");
        }
    };
    const [planComments, setPlanComments] = useState(false);
    const handlePlanRadioChange = (e: any) => {
        setPlan(e.target.value);
        setPlanComments(true);
    };
    const handleThyroidChange = (e: any) => {
        setShowThyroid(true);
        setThyroid(e.target.value);
    };
    const [disable, setDisable] = useState(true);
    const [key1, setKey1] = useState(0);
    const [key2, setKey2] = useState(20);
    const [key3, setKey3] = useState(60);
    const [key4, setKey4] = useState(100);
    const [lmpDate, setLmpDate] = useState(moment());
    const [eddDate, setEddDate] = useState(moment(lmpDate).add(280, "days"));
    const [ageOfMenarche, setAgeOfMenacrchy] = useState("");
    const [sexuallyActive, setSexuallyActive] = useState<any>("");
    const [misCarriage, setMiscarriage] = useState("");
    const [g, setG] = useState("");
    const [p, setP] = useState("");
    const [a, setA] = useState("");
    const [l, setL] = useState("");
    const [comments, setComments] = useState("");
    const [anyHxArtComments, setAnyHxOfArtComments] = useState("");
    const [maritalStatus, setMaritalStatus] = useState<any>("");
    const [durationOfMarriage, setDurationOfMarriage] = useState("");
    const [prophylaxisComments, setProphylaxisComments] = useState("");
    const [mKey, setMKey] = useState(1000);
    const handleData = (e: any, key: string) => {
        let lmpd;
        if (key === "lmp" && moment(e).isValid()) {
            lmpd = moment(e).add(280, "days");
            setEddDate(lmpd);
            setLmpDate(e);
        }
    };
    const [id, setId] = useState(0);
    const onTab1Save = () => {
        let childData: any = [];
        tableData.map((item: any) => {
            let obj = {
                dateOfDelivery: moment(item.dateOfDelivery).format("DD/MM/YYYY"),
                prematuredBaby: item.prematuredBaby,
                method: item.method,
                deliveryType: item.deliveryType,
                complicationsDuringPragnancy: item.complicationsDuringPragnancy,
            };
            childData.push(obj);
        });
        let pregnancyId: null | string = getLocalItem("pregnancyId");
        let postObj = {};
        if (pregnancyId == null || pregnancyId == "") {
            postObj = {
                pregnancyId: null,
                pregnancyRecord: {
                    obstetricHistoryDetails: {
                        ageOfMenarche: ageOfMenarche,
                        isPregnant: isChecked,
                        lmp: moment(lmpDate).format("DD/MM/YYYY"),
                        edd: isChecked ? moment(eddDate).format("DD/MM/YYYY") : "",
                        maritalStatus: maritalStatus,
                        durationOfMarriage: durationOfMarriage,
                        sexuallyActive: sexuallyActive,
                        anyHxOfArt: anyHxOfArt,
                        anyHxOfArtComments: artHxResponse === "yes" ? anyHxArtComments : "",
                        G: g,
                        P: p,
                        A: a,
                        L: l,
                        comments: comments,
                        historyOfProphyiaxisUsage: prophylaxis,
                        historyOfProphyiaxisUsageComments:
                            proResponse === "yes" ? prophylaxisComments : "",
                        misCarriage: misCarriage,
                    },
                    childHistory: childData,
                },
                patientId: patient_Id,
                opdEncounterId: encounterId,
            };
        } else {
            postObj = {
                pregnancyId: getLocalItem("pregnancyId"),
                pregnancyRecord: {
                    obstetricHistoryDetails: {
                        ageOfMenarche: ageOfMenarche,
                        lmp: moment(lmpDate).format("DD/MM/YYYY"),
                        edd: isChecked ? moment(eddDate).format("DD/MM/YYYY") : "",
                        maritalStatus: maritalStatus.label,
                        isPregnant: isChecked,
                        durationOfMarriage: durationOfMarriage,
                        sexuallyActive: sexuallyActive.label,
                        anyHxOfArt: anyHxOfArt,
                        anyHxOfArtComments: anyHxArtComments,
                        G: g,
                        P: p,
                        A: a,
                        L: l,
                        comments: comments,
                        historyOfProphyiaxisUsage: prophylaxis,
                        historyOfProphyiaxisUsageComments: prophylaxisComments,
                        misCarriage: misCarriage,
                    },
                    childHistory: childData,
                    currentPregnancy:
                        pregnancyRespo.pregnancyRecord.pregnancyRecord.currentPregnancy,
                },
                patientId: patient_Id,
                opdEncounterId: encounterId,
            };
        }
        services
            .create(savePregnancy, postObj)
            .then((response) => {
                setId(response.data.id);
                toast.success("Saved Successfully");
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const columns: GridColDef[] = [
        {
            field: "sno",
            headerName: "S.No",
            width: 200,
        },
        {
            field: "term",
            headerName: "Display",
            width: 200,
        },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params: any) => (
                <>

                    <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer"
                        onClick={() => deleteFindingsRow(params.row)}
                    />
                </>
            ),
        },
    ];
    const deleteFindingsRow = (data: any) => {
        const filteredData = findingsGridData.filter((item: any) => {
            return item.sno != data.sno;
        });
        filteredData.forEach((item: any, index: number) => {
            item.sno = index + 1
        });
        setFindingGridData(filteredData);
    };
    const [findingsList, setfindingsList] = useState<any>([]);
    const [findingValue, setFindingValue] = useState<any>("");
    const [findingsGridData, setFindingGridData] = useState<any[]>([]);
    const [maternalWeight, setMaternalWeight] = useState("");
    const [hr, setHr] = useState("");
    const [wt, setWt] = useState("");
    const [limbs, setLimbs] = useState("");
    const [hc, setHc] = useState("");
    const [length, setLength] = useState("");
    const [trimesterComments, setTrimesterComments] = useState("");
    const [thyroid, setThyroid] = useState("");
    const [gestationalDiabetesValues, setGestationalDiabetesValues] =
        useState("");
    const [plan, setPlan] = useState("");
    const [planCommentValue, setPlanCommentValue] = useState("");
    const [trimester, setTrimester] = useState<any>("");
    const [date, setDate] = useState(moment());
    const [thyroidValues, setThyroidValues] = useState("");
    const [risk, setRisk] = useState("");
    const [key11, setKey11] = useState(900);
    const capitalize = (name: string) => {
        return name.charAt(0).toUpperCase() + name.substring(1, name.length);
    };
    const onTab2Save = () => {
        var arr: any = [];
        arr = trimesterList;
        let arrayFind: any = [];
        findingsGridData.map((item: any, index: number) => {
            let findinObj = {
                sno: index + 1,
                hierarchy: item.hierarchy,
                isPreferredTerm: item.isPreferredTerm,
                conceptState: item.conceptState,
                conceptFsn: item.conceptFsn,
                definitionStatus: item.definitionStatus,
                conceptId: item.conceptId,
                languageCode: item.languageCode,
                typeId: item.typeId,
                term: item.term,
                caseSignificanceId: item.caseSignificanceId,
                id: item.id,
                effectiveTime: item.effectiveTime,
                activeStatus: item.activeStatus,
                moduleId: item.moduleId,
            };
            arrayFind.push(findinObj);
        });

        let obj = {
            [trimester.value]: {
                maternalWeight: maternalWeight,
                date: moment(date).format("DD/MM/YYYY"),
                gestationalDiabetes: gestationalDiabetesValues,
                thyroid: thyroid,
                thyroidValues: thyroidValues,
                fetus: {
                    hr: hr,
                    wt: wt,
                    hc: hc,
                    limbs: limbs,
                    length: length,
                    comments: trimesterComments,
                },
                findings: arrayFind,
                recordedBy: capitalize(jsonParse("loginResponse").employeename),
            },
        };
        arr.push(obj);
        setTrimesterList(arr);
        let postObj = {
            pregnancyId: id > 0 ? id : pregnancyId,
            pregnancyRecord: {
                currentPregnancy: {
                    trimester: trimesterList,
                    plan: plan,
                    planComments: planCommentValue,
                    risk: risk,
                },
            },
            patientId: patient_Id,
            opdEncounterId: encounterId,
        };
        services
            .create(savePregnancy, postObj)
            .then((response) => {
                toast.success("Saved Successfully!");
                onLoading();
                handleClear();
            })
            .catch((error) => {
                console.log(error.message);
            });
    };
    const handleFindingsChange = async (e: any) => {
        if (e.target.value.length > 2) {
            axios
                .get(
                    snomedSearchByTermAndSemanticTag +
                    `term=${e.target.value}&state=both&semantictag=finding&acceptability=all&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
                )
                .then((response) => {
                    if (response.data.length > 0) {
                        let arr = response.data;
                        arr.forEach((item: any, index: number) => {
                            item.value = item.conceptId;
                            item.label = item.conceptFsn;
                        }
                        )
                        setfindingsList(arr);
                    }
                })
                .catch((error) => {
                    console.error("Error while fetching data:", error);
                    toast.error("Error while fetching data")
                });
        }
    };
    const handleAddObj = () => {
        if (findingsGridData.some((item: any) => item.conceptFsn == findingValue.label)) {
            toast.error("Duplicate entry");
        } else {
            let filteredData: any = findingsList.filter((item: any) => {
                return item.conceptFsn == findingValue.label;
            });
            if (filteredData.length > 0) {
                let object = { sno: findingsGridData.length + 1, ...filteredData[0] };
                setFindingGridData((prevData: any) => [...prevData, object]);
            }
        }
        setFindingValue("");
    };
    const router = useRouter();
    const { patientid, opdEncounterId } = useParams();
    const backToEMR = () => {
        router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
    };

    const handleClear = () => {
        setKey11((k) => k + 1);
        setMaternalWeight("");
        setDate(moment());
        setDiaChecked(false);
        setGestationalDiabetesValues("");
        setThyroid("");
        setThyroidValues("");
        setHr("");
        setLimbs("");
        setWt("");
        setLength("");
        setHc("");
        setTrimesterComments("");
        setPlanComments(false);
        setPlanCommentValue("");
        setRisk("");
        setFindingGridData([]);
        setTrimester(null);
    };

    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }

    return (
        <div className="block">
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <ToastContainer />
                <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
                    <h1 className="w-full">
                        <span className="w-3/4 float-left"></span>Pregnancy Record /
                        Obstestrics History
                        <span
                            className=" w-1/4 float-right text-right cursor-pointer text-blue-600"
                            onClick={backToEMR}
                        >
                            Back
                        </span>
                    </h1>
                </div>
                <PatientHeader setDisable={setDisable}
                />
                <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                    <Box sx={{ width: "100%", borderRadius: "5px" }}>
                        <Box>
                            <Tabs
                                value={values}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                                className="bg-white"
                            >
                                <Tab
                                    className="font-bold"
                                    label="OBSTETRICS HISTORY"
                                    {...a11yProps(0)}
                                />
                                {isChecked ? (
                                    <Tab
                                        className="font-bold"
                                        label="CURRENT PREGNANCY"
                                        {...a11yProps(1)}
                                    />
                                ) : null}
                            </Tabs>
                            <CustomTabPanel value={values} index={0}>
                                <div className="rounded-sm bg-white pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                                        <div className="">
                                            <DateInput
                                                label="LMP"
                                                value={lmpDate}
                                                onChange={(e: any) => handleData(e, "lmp")}
                                            />
                                        </div>
                                        <div className="">
                                            <FormPropsTextFields
                                                label="Age of Manarche(years)"
                                                value={ageOfMenarche}
                                                handleChange={(e: any) => {
                                                    setAgeOfMenacrchy(sanitizeInput(e.target.value));
                                                }}
                                            />
                                        </div>
                                        <div key={mKey}>
                                            <Select
                                                primaryColor="blue"
                                                options={maritalStatusList}
                                                value={maritalStatus}
                                                onChange={(e: any) => {
                                                    setMaritalStatus(e);
                                                }}
                                                placeholder="Marital Status"
                                            />
                                        </div>
                                        <div className="">
                                            <FormPropsTextFields
                                                label="Duration Of Marriage(years)"
                                                value={durationOfMarriage}
                                                handleChange={(e: any) => {
                                                    setDurationOfMarriage(sanitizeInput(e.target.value));
                                                }}
                                            />
                                        </div>
                                        <Select
                                            primaryColor="blue"
                                            options={sexuallyActiveList}
                                            value={sexuallyActive}
                                            onChange={(e: any) => {
                                                setSexuallyActive(e);
                                            }}
                                            placeholder="Sexually Active?"
                                        />
                                        <div className="flex justify-start items-center text-sm">
                                            <CheckboxMui
                                                label="is pregnant?"
                                                handleChange={handleIsCheckedChange}
                                                checked={isChecked}
                                            />
                                        </div>
                                        {isChecked ? (
                                            <div className="">
                                                <DateInput
                                                    label="EDD"
                                                    value={eddDate}
                                                    disbled={true}
                                                    onChange={(e: any) => handleData(e, "edd")}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                    <Divider className="mt-4" />
                                    <div className="grid lg:grid-cols-5 gap-4 mt-2 lg:flex lg:justify-start lg:items-center text-sm">
                                        <div className="">Any Hx of ART?</div>
                                        <div className="" key={key1}>
                                            <Radio
                                                crossOrigin={undefined}
                                                name="art"
                                                label="Yes"
                                                value={"yes"}
                                                defaultChecked={artHxResponse == "yes" ? true : false}
                                                onChange={(e: any) => handleArtRadioChange(e)}
                                            />
                                            <Radio
                                                crossOrigin={undefined}
                                                name="art"
                                                label="No"
                                                value={"no"}
                                                defaultChecked={artHxResponse == "no" ? true : false}
                                                onChange={(e: any) => handleArtRadioChange(e)}
                                            />
                                        </div>
                                        {artHxResponse === "yes" ? (
                                            <div className="flex justify-between">
                                                <FormPropsTextFields
                                                    label="Comments"
                                                    value={anyHxArtComments}
                                                    handleChange={(e: any) => {
                                                        setAnyHxOfArtComments(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                    <Divider className="mt-2" />
                                    <div className="grid lg:grid-cols-5 gap-4 mt-2 lg:flex lg:justify-start lg:items-center text-sm">
                                        <div className="text-sm">History Of Prophylaxis Usage</div>
                                        <div className="" key={key2}>
                                            <Radio
                                                crossOrigin={undefined}
                                                value={"yes"}
                                                defaultChecked={proResponse == "yes"}
                                                name="usage"
                                                label="Yes"
                                                onChange={handleProRadioChange}
                                            />
                                            <Radio
                                                crossOrigin={undefined}
                                                value={"no"}
                                                name="usage"
                                                label="No"
                                                defaultChecked={proResponse == "no"}
                                                onChange={handleProRadioChange}
                                            />
                                        </div>
                                        {proResponse == "yes" ? (
                                            <div className="flex justify-between">
                                                <FormPropsTextFields
                                                    label="Comments"
                                                    value={prophylaxisComments}
                                                    handleChange={(e: any) => {
                                                        setProphylaxisComments(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                    <Divider className="mt-2" />
                                    <div className="flex mt-2 gap-6">
                                        <div className="w-1/6">
                                            <div className="my-4">
                                                <FormPropsTextFields
                                                    label="G"
                                                    value={g}
                                                    handleChange={(e: any) => {
                                                        setG(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                            <div className="my-4">
                                                <FormPropsTextFields
                                                    label="P"
                                                    value={p}
                                                    handleChange={(e: any) => {
                                                        setP(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/6">
                                            <div className="my-4">
                                                <FormPropsTextFields
                                                    label="A"
                                                    value={a}
                                                    handleChange={(e: any) => {
                                                        setA(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                            <div className="my-4">
                                                <FormPropsTextFields
                                                    label="L"
                                                    value={l}
                                                    handleChange={(e: any) => {
                                                        setL(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-4/6 flex gap-4">
                                            <div className="my-4 w-1/2">
                                                <Textarea
                                                    resize={true}
                                                    label="Miscarriage / Abortion Details"
                                                    value={misCarriage}
                                                    multiline={true}
                                                    onChange={(e: any) => {
                                                        setMiscarriage(sanitizeInput(e.target.value));
                                                    }}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="my-4 w-1/2">
                                                <Textarea
                                                    label="Comments"
                                                    minRows={1}
                                                    value={comments}
                                                    onChange={(e: any) => {
                                                        setComments(sanitizeInput(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    {/* </div> */}
                                    <Divider className="mt-2" />
                                    <div className="mt-6 block">
                                        <ActionButton
                                            buttonText="ADD CHILD"
                                            handleSubmit={addRow}
                                            width="w-[120px] py-3"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <TableContainer component={Paper} className=" !overflow-visible">
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>S.No.</TableCell>
                                                    <TableCell>Date of Delivery</TableCell>
                                                    <TableCell>Premature Delivery (Y or N)</TableCell>
                                                    <TableCell>Method</TableCell>
                                                    <TableCell>Delivery Type(NVD/LSCS)</TableCell>
                                                    <TableCell>
                                                        Complications During Pregnancy/Delivery
                                                    </TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                                {tableData.map((row, rowIndex) => (
                                                    <TableRow key={row.sno}>
                                                        <TableCell>{row.sno}</TableCell>
                                                        <TableCell>
                                                            <DateInput
                                                                value={tableData[rowIndex].dateOfDelivery}
                                                                onChange={(e: any) =>
                                                                    handleDateChange(e, row.sno, "dateOfDelivery")
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex" key={key3}>
                                                                <div>
                                                                    <Radio
                                                                        crossOrigin={undefined}
                                                                        onChange={(e) =>
                                                                            handleRadioChange(
                                                                                e,
                                                                                row.sno,
                                                                                "prematuredBaby"
                                                                            )
                                                                        }
                                                                        defaultChecked={
                                                                            tableData[rowIndex].prematuredBaby === "yes"
                                                                        }
                                                                        name={`prematuredBaby${rowIndex}`}
                                                                        value={"yes"}
                                                                        label="Yes"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Radio
                                                                        crossOrigin={undefined}
                                                                        defaultChecked={
                                                                            tableData[rowIndex].prematuredBaby === "no"
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleRadioChange(
                                                                                e,
                                                                                row.sno,
                                                                                "prematuredBaby"
                                                                            )
                                                                        }
                                                                        name={`prematuredBaby${rowIndex}`}
                                                                        value={"no"}
                                                                        label="No"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="w-full">
                                                                <div className="relative my-select ">
                                                                    <Select
                                                                        primaryColor="blue"
                                                                        options={methodData}
                                                                        value={tableData[rowIndex].method}
                                                                        onChange={(e: any) => {
                                                                            handleInputChange(e, row.sno, "method");
                                                                        }}
                                                                        placeholder="Method"
                                                                        classNames={{
                                                                            menuButton: ({ isDisabled }: any) => (
                                                                                `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                            duration-300 focus:outline-none 
                                                            ${isDisabled
                                                                                    ? "bg-blue-gray-200"
                                                                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                                                }`
                                                                            ),
                                                                            menu: `absolute !text-start  z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700`,
                                                                            listItem: ({ isSelected }: any) => (
                                                                                `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                                                                    ? `!text-white bg-blue-500`
                                                                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                                                                }`
                                                                            )
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                primaryColor="blue"
                                                                options={deliveryTypeList}
                                                                value={tableData[rowIndex].deliveryType}
                                                                onChange={(e: any) => {
                                                                    handleInputChange(e, row.sno, "deliveryType");
                                                                }}
                                                                placeholder="Delivery Type"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormPropsTextFields
                                                                label="Complications"
                                                                value={
                                                                    tableData[rowIndex].complicationsDuringPragnancy
                                                                }
                                                                handleChange={(e: any) =>
                                                                    handleCompliChange(
                                                                        e,
                                                                        row.sno,
                                                                        "complicationsDuringPragnancy"
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center items-center">
                                                                <TrashIcon
                                                                    className="w-5 h-5 text-red-500 cursor-pointer"
                                                                    onClick={() => deleteRow(row.sno)}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                <div className="flex justify-end gap-x-6 mt-6">
                                    <div>
                                        {/* <ActionButton
                                                buttonText="Save"
                                                handleSubmit={onTab1Save}
                                                width="w-[120px] py-3"
                                            /> */}
                                        {props?.screenData?.Save === 1 && (
                                            <ActionButton
                                                buttonText="Save"
                                                handleSubmit={onTab1Save}
                                                width="w-[120px] py-3"
                                            // disabled={props?.screenData?.Update === 0 && getLocalItem("pregnancyId") !== ""}
                                            />
                                        )}
                                        {/* {getLocalItem("pregnancyId") !== "" && props?.screenData?.Update === 1 && (
                                            <ActionButton
                                                buttonText="Update"
                                                handleSubmit={onTab1Save}
                                                width="w-[120px] py-3"
                                            />
                                        )} */}


                                    </div>
                                    <div>
                                        <ActionButton
                                            buttonText="Cancel"
                                            width="w-[120px] py-3 bg-red-500 hover:bg-red-600 border-red-500"
                                        />
                                    </div>
                                </div>
                            </CustomTabPanel>
                            {isChecked ? (
                                <CustomTabPanel value={values} index={1}>
                                    <div className="rounded-sm mt-6 bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                                        <div>
                                            <DataGrid
                                                autoHeight
                                                rows={gridList}
                                                columns={columns2}
                                                pagination={true}
                                                getRowId={(row) => row.id}
                                                pageSizeOptions={[10, 30, 50, 100]}
                                                slots={{ toolbar: GridToolbar }}
                                            />
                                        </div>
                                        <div key={key11}>
                                            <div className="justify-start items-center mt-4 gap-x-10 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10">
                                                <div>
                                                    <Select
                                                        primaryColor="blue"
                                                        options={items}
                                                        value={trimester}
                                                        onChange={(e: any) => {
                                                            setTrimester(e);
                                                        }}
                                                        placeholder="Trimester"
                                                    />
                                                </div>
                                            </div>
                                            <Divider className="mt-4" />
                                            <div className="justify-start items-center grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-4 gap-x-10">
                                                <div>
                                                    <FormPropsTextFields
                                                        label="Maternal Weight "
                                                        width="100%"
                                                        value={maternalWeight}
                                                        handleChange={(e: any) => {
                                                            setMaternalWeight(sanitizeInput(e.target.value));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <DateInput
                                                        label="Recorded Date"
                                                        value={date}
                                                        onChange={(e: any) => setDate(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="justify-start grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center mt-4 gap-x-10">
                                                <div>
                                                    <CheckboxMui
                                                        label="Gestational Diabetes"
                                                        handleChange={handleDiaChange}
                                                        checked={diaChecked}
                                                    />
                                                </div>
                                                {diaChecked ? (
                                                    <div>
                                                        <FormPropsTextFields
                                                            label="Values"
                                                            value={gestationalDiabetesValues}
                                                            handleChange={(e: any) =>
                                                                setGestationalDiabetesValues(sanitizeInput(e.target.value))
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                            <Divider className="mt-4" />
                                            <div className="grid lg:grid-cols-5 xl:gap-6 lg:gap-4 mt-4 lg:flex lg:justify-start lg:items-center">
                                                <div className="">Thyroid</div>
                                                <div className="col-span-4">
                                                    <Radio
                                                        crossOrigin={undefined}
                                                        name="thyroid"
                                                        label="Hypothyrodism"
                                                        value={"hypothyrodism"}
                                                        onChange={handleThyroidChange}
                                                    />
                                                    <Radio
                                                        crossOrigin={undefined}
                                                        name="thyroid"
                                                        label="Hyperthyrodism"
                                                        value={"hyperthyrodism"}
                                                        onChange={handleThyroidChange}
                                                    />
                                                </div>
                                                {showThyroid ? (
                                                    <div className="flex justify-start items-start">
                                                        <FormPropsTextFields
                                                            label="Values"
                                                            value={thyroidValues}
                                                            handleChange={(e: any) =>
                                                                setThyroidValues(sanitizeInput(e.target.value))
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                            <Divider className="mt-4" />
                                            <div className="flex">
                                                <div className="mt-4 w-1/3 font-semibold">
                                                    U/S Details
                                                </div>
                                                <div className="mt-4 w-2/3 ps-28 float-left font-semibold">

                                                </div>
                                            </div>
                                            <div className="lg:flex xl:flex sm:block sm:gap-6 mt-4">
                                                <div className="w-2/3 flex gap-x-10">
                                                    <div className="w-1/6">Fetus</div>
                                                    <div className="flex-wrap gap-y-6">
                                                        <div className="grid grid-cols-2 gap-x-5 ">
                                                            <FormPropsTextFields
                                                                label="HR"
                                                                value={hr}
                                                                handleChange={(e: any) => setHr(sanitizeInput(e.target.value))}
                                                            />
                                                            <FormPropsTextFields
                                                                label="Limbs"
                                                                value={limbs}
                                                                handleChange={(e: any) =>
                                                                    setLimbs(sanitizeInput(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex gap-x-5 py-4">
                                                            <FormPropsTextFields
                                                                label="Wt"
                                                                value={wt}
                                                                handleChange={(e: any) => setWt(sanitizeInput(e.target.value))}
                                                            />
                                                            <FormPropsTextFields
                                                                label="Length"
                                                                value={length}
                                                                handleChange={(e: any) =>
                                                                    setLength(sanitizeInput(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex w-1/2 gap-x-5">
                                                            <FormPropsTextFields
                                                                label="HC"
                                                                value={hc}
                                                                handleChange={(e: any) => setHc(sanitizeInput(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="flex pt-4">
                                                            <Textarea
                                                                label="Comments"
                                                                minRows={5}
                                                                onChange={(e: any) =>
                                                                    setTrimesterComments(sanitizeInput(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:pl-0 sm:pt-4 xl:pt-0 xl:gap-6 lg:pt-0 lg:pl-0 xl:pl-0 justify-start ">
                                                    <div className="flex gap-4 justify-start items-center mb-4">
                                                        <div className="w-1/3">
                                                            <div className="my-select relative">
                                                                <Select
                                                                    primaryColor="blue"
                                                                    placeholder="Findings (Snomed Search)"
                                                                    onChange={(e: any) => {
                                                                        setFindingValue(e);
                                                                    }}
                                                                    onSearchInputChange={handleFindingsChange}
                                                                    isSearchable={true}
                                                                    value={findingValue}
                                                                    options={findingsList}
                                                                    classNames={{
                                                                        menuButton: ({ isDisabled }: any) =>
                                                                            `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                    duration-300 focus:outline-none 
                                   
                                    ${isDisabled
                                                                                ? "bg-blue-gray-200"
                                                                                : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                                                            }`,
                                                                        menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                                                                        listItem: ({ isSelected }: any) =>
                                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                                                                ? `text-white bg-blue-500`
                                                                                : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                                                            }`,
                                                                    }}
                                                                />
                                                            </div>


                                                        </div>
                                                        <ActionButton
                                                            buttonText="Add"
                                                            handleSubmit={handleAddObj}
                                                            width="w-[120px] py-3"
                                                        />
                                                    </div>
                                                    <DataGrid
                                                        autoHeight
                                                        rows={findingsGridData}
                                                        columns={columns}
                                                        getRowId={(row) => row.sno}
                                                        pageSizeOptions={[10, 25]}
                                                        checkboxSelection={false}
                                                        slots={{ toolbar: GridToolbar }}
                                                    />
                                                </div>
                                            </div>
                                            <Divider className="mt-4" />
                                            <div className="mt-4 grid lg:grid-cols-5 gap-4 lg:flex  lg:justify-start lg:items-center">
                                                <div className="">Plan</div>
                                                <div className="md:px-0 sm:px-0 lg:px-5 xl:px-6">
                                                    <Radio
                                                        crossOrigin={undefined}
                                                        name="plan"
                                                        value={"NVD"}
                                                        label="NVD"
                                                        onChange={handlePlanRadioChange}
                                                    />
                                                    <Radio
                                                        crossOrigin={undefined}
                                                        name="plan"
                                                        value={"LSCS"}
                                                        label="LSCS"
                                                        onChange={handlePlanRadioChange}
                                                    />
                                                </div>
                                                {planComments ? (
                                                    <div className="flex justify-start items-start">
                                                        <FormPropsTextFields
                                                            label="Comments"
                                                            value={planCommentValue}
                                                            handleChange={(e: any) =>
                                                                setPlanCommentValue(sanitizeInput(e.target.value))
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                                <div className="flex justify-start items-start">
                                                    <FormPropsTextFields
                                                        label="Risk"
                                                        value={risk}
                                                        handleChange={(e: any) => setRisk(sanitizeInput(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end items-center gap-x-6">
                                            {props?.screenData?.Save === 1 &&
                                                <ActionButton
                                                    buttonText="Save"
                                                    handleSubmit={onTab2Save}
                                                    width="w-[120px] py-3"
                                                />
                                            }
                                            <ActionButton
                                                buttonText="Clear"
                                                handleSubmit={handleClear}
                                                width="w-[120px] py-3"
                                            />
                                        </div>
                                    </div>
                                </CustomTabPanel>
                            ) : null}
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default roleInfoScreenData(PregnancyObstestrics, "PO")