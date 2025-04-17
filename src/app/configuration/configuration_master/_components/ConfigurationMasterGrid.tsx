import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import React from "react";

interface ConfigurationMasterGridProps {
    data: any;
    setData: (newData: any) => void;
    handelSave: any
    handelReset: any
    isSaveDisabled: any
}

const ConfigurationMasterGrid: React.FC<ConfigurationMasterGridProps> = ({
    data,
    setData,
    handelSave,
    handelReset,
    isSaveDisabled,
}) => {
    // Function to add a new row
    const addRow = () => {
        const newRow = {
            id: Date.now(),
            columnName: "",
            columnType: "",
            controlType: "",
            isMandatory: "",
            masterDataCode: "",
            statusFlag: 1,
            status: Date.now(),
        };

        setData({
            ...data,
            configDef: {
                ...data.configDef,
                ipcolumns: [...data.configDef.ipcolumns, newRow],
            },
        });
    };

    // Function to handle input changes for a specific row
    const handleInputChange = (
        index: number,
        key: string,
        value: string | number
    ) => {
        const updatedRows = data.configDef.ipcolumns.map((row: any, i: number) =>
            i === index ? { ...row, [key]: value } : row
        );

        setData({
            ...data,
            configDef: {
                ...data.configDef,
                ipcolumns: updatedRows,
            },
        });
    };

    // Function to delete a row by its unique id
    const deleteRow = (id: number) => {
        const updatedRows = data.configDef.ipcolumns.filter(
            (row: any) => row.id !== id
        );
        if (updatedRows.length > 0) {
            setData({
                ...data,
                configDef: {
                    ...data.configDef,
                    ipcolumns: updatedRows,
                },
            });
        } else {
            console.log("No rows remaining after deletion.");
        }
    };
    const controlTypeList: any = [
        { value: "Text", label: "Text" },
        { value: "DropDown", label: "DropDown" },
    ]

    const columnTypelist: any = [
        { value: "Int", label: "Int" },
        { value: "Byte", label: "Byte" },
        { value: "String", label: "String" },
    ]
    const isMandatoryList: any = [
        { value: "True", label: "True" },
        { value: "False", label: "False" },
    ]
    const masterDataCodeList: any = [
        { value: "Code SetName 1", label: "Code SetName 1" },
        { value: "Code SetName 2", label: "Code SetName 2" },
        { value: "Code SetName 3", label: "Code SetName 3" },
    ]
    // console.log(data?.configDef?.ipcolumns)
    return (
        <div className="w-full mb-2 mt-6  bg-white ">
            <div key={data?.key} className={data?.configDef?.ipcolumns?.length > 4 ? "max-h-[300px] overflow-auto" : ""}>
                <table className="w-full text-left border border-slate-400">
                    <thead className="bg-blue-500 text-white text-[14px]">
                        <tr>
                            <th className="border-collapse p-2 font-light rounded-tl-xl w-[5%]">S.No</th>
                            <th className="border-collapse p-2 font-light w-[20%]">Field Name</th>
                            <th className="border-collapse p-2 font-light  w-[17%]">Type</th>
                            <th className="border-collapse p-2 font-light  w-[17%] ">Control Type</th>
                            <th className="border-collapse p-2 font-light  w-[17%]">Mandatory Condition</th>
                            <th className="border-collapse p-2 font-light  w-[17%]">Master Data Codes</th>
                            <th className="border-collapse p-2 font-light w-[10%] rounded-tr-xl">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.configDef?.ipcolumns?.map((row: any, index: number) => (
                            <tr key={row.id} className="p-2">
                                <td className="text-center">{index + 1}</td>
                                <td className="p-2">
                                    <Input
                                        crossOrigin
                                        label="Column Name"
                                        value={row.columnName}
                                        onChange={(e) =>
                                            handleInputChange(index, "columnName", e.target.value)
                                        }
                                        disabled={!row.status ? true : false}
                                    />
                                </td>
                                <td className="p-2">
                                    <ReactSelectBox
                                        value={row.columnType}
                                        options={columnTypelist}
                                        label="Type"
                                        onChange={(e) =>
                                            handleInputChange(index, "columnType", e)
                                        }
                                        isDisabled={!row.status ? true : false}
                                    />
                                </td>
                                <td className="p-2">
                                    <ReactSelectBox
                                        value={row.controlType}
                                        options={controlTypeList}
                                        label="Control Type"
                                        onChange={(e) =>
                                            handleInputChange(index, "controlType", e)
                                        }
                                    />
                                </td>

                                <td className="p-2">
                                    <ReactSelectBox
                                        value={row.isMandatory}
                                        options={isMandatoryList}
                                        label="Is Mandatory"
                                        onChange={(e) =>
                                            handleInputChange(index, "isMandatory", e)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <ReactSelectBox
                                        value={row.masterDataCode}
                                        options={masterDataCodeList}
                                        label="Master Data Code"
                                        onChange={(e) =>
                                            handleInputChange(index, "masterDataCode", e)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <div className="flex w-full gap-2">
                                        {data.configDef.ipcolumns.length > 1 && (
                                            <>
                                                {row.status ?
                                                    <TrashIcon
                                                        className="w-6 h-6 text-blue-500 cursor-pointer"
                                                        onClick={() => deleteRow(row.id)}
                                                    />
                                                    : null}
                                            </>
                                        )}

                                        {index === data.configDef.ipcolumns.length - 1 && (
                                            <PlusCircleIcon
                                                className="w-6 h-6 text-blue-500 cursor-pointer"
                                                onClick={addRow}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full my-3 flex justify-end gap-4">
                <ActionButton
                    // buttonText="Save"
                    buttonText={data.configId ? "Update" : "Save"}
                    width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                    handleSubmit={handelSave}
                    disabled={isSaveDisabled}
                />
                <ActionButton
                    buttonText="Reset"
                    width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                    handleSubmit={handelReset}
                />
            </div>
        </div>
    );
};

export default ConfigurationMasterGrid;
