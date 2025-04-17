"use client";
import ActionButton from "@/app/_common/button";
import Textarea from "@/app/_common/text-area";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { deleteAddendam, getAllAddendam, saveAddendam } from "@/app/utilities/api-urls";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import React, {
    FC,
    useEffect,
    useState,
} from "react";
import { toast } from "react-toastify";

interface ResultEntryAddendumProps {
    orderId: any;
    empName: any;
    headers: any;
}

const ResultEntryAddendum: FC<ResultEntryAddendumProps> = ({
    orderId,
    empName,
    headers,
}) => {
    const [feildsAddendum, setFeildsAddendum] = useState<any>({
        rdAddendamId: "",
        addendamReport: "",
        addendamDoneBy: "",
        generatedId: "",
        generatedBy: "",
        orderId: "",
    });



    const [gridAddendum, setGridAddendum] = useState<any>([]);
    const [isEditedaddendum, setIsEditedaddendum] = useState<any>(false);

    // Addendum Grid columns Data
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 100,
            renderCell: (params) => {
                const rowNumber = gridAddendum.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        {
            field: "addendamDoneBy",
            headerName: "Addendum Done By",
            width: 350,
        },
        {
            field: "generatedDate",
            headerName: "Addendum Date & Time",
            width: 350,
            renderCell: (params: any) => (
                <>
                    {params.row.generatedDate &&
                        moment(params.row.generatedDate).format("DD-MM-YYYY HH:mm")}
                </>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params: any) => (
                <div className="flex gap-4 items-center w-[80px] justify-end">
                    <PencilIcon
                        onClick={() => onAddendamEdit(params.row)}
                        className="w-5 h-5 text-blue-500 cursor-pointer"
                    />
                    <TrashIcon
                        onClick={() => onDeleteAddendumRow(params.row)}
                        className="w-6 h-6 text-red-500 cursor-pointer"
                    />
                </div>
            ),
        },
    ];

    // Addendum Edit function
    const onAddendamEdit = (row: any) => {
        setIsEditedaddendum(true);
        setFeildsAddendum(row);
        // document.getElementById("addendum-textarea")?.scrollIntoView({
        //     behavior: "smooth",
        // });
    };

    // Addendum Report onchange function
    const handleAddendumReport = (e: any) => {
        setFeildsAddendum({
            ...feildsAddendum,
            addendamReport: sanitizeInput(e.target.value),
        });
    };

    // Save Radiology Addendum Function
    const onAddendumSave = () => {
        const message = isEditedaddendum
            ? "Successfully updated the Addendum Record"
            : "Successfully saved the Addendum Record";
        const postObj = [
            {
                rdAddendamId: isEditedaddendum ? feildsAddendum.rdAddendamId : "",
                addendamReport: feildsAddendum.addendamReport,
                addendamDoneBy: empName,
                generatedId: isEditedaddendum ? feildsAddendum.generatedId : "",
                generatedBy: empName,
                orderId: orderId,
            },
        ];
        services
            .create(saveAddendam, postObj, headers)
            .then((res) => {
                toast.success(message);
                setFeildsAddendum({
                    rdAddendamId: "",
                    addendamReport: "",
                    addendamDoneBy: "",
                    generatedId: "",
                    generatedBy: "",
                    orderId: "",
                });
                getAddendumGrid();
            })
            .catch((error) => {
                console.log(error);
                toast.error("Something went wrong, please try again");
            });
    };

    // Get Addendum Grid Data function
    const getAddendumGrid = async () => {
        try {
            const res = await services.get(`${getAllAddendam}?orderId=${orderId}`);
            setGridAddendum(res.data);
        } catch (error: any) {
            console.log(error);
            setGridAddendum([]);
        }
    };
    // delete row function
    const onDeleteAddendumRow = (row: any) => {
        //rdAddendamId=3       
        const obj = {}
        services.create(`${deleteAddendam}rdAddendamId=${row.rdAddendamId}`, obj, headers).then((res) => {
            toast.success("delete addendum rows successfully")
            getAddendumGrid()
        }).catch((err) => {
            toast.error("something went wrong please try again")
        })
    }

    // Grid get RowId data
    const getRowId = (row: any) => row.rdAddendamId;

    useEffect(() => {
        getAddendumGrid();
    }, []);

    return (
        <>
            <>
                <div className="w-full mt-6" id="addendum-textarea" >
                    <Textarea
                        label="Addendum Report"
                        onChange={handleAddendumReport}
                        value={feildsAddendum.addendamReport}
                        minRows="15"
                    />
                    <div className="flex justify-end w-full mt-4">
                        <ActionButton
                            buttonText="Save"
                            width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            handleSubmit={onAddendumSave}
                        />
                    </div>
                </div>
                <div className="w-full mt-8 data-grid-newThem">
                    <DataGrid
                        rows={gridAddendum}
                        columns={columns}
                        getRowId={getRowId}
                        pageSizeOptions={[10, 20]}
                        density="compact"
                    />
                </div>
            </>
        </>
    );
};

export default ResultEntryAddendum;
