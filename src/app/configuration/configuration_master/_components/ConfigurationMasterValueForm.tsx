import React from "react";
import { Input } from "@material-tailwind/react";
import { capitalize } from "@mui/material";
import { TrashIcon } from "@heroicons/react/24/solid";
import ActionButton from "@/app/_common/button";

// Define the structure of the configuration data


interface TableProps {
    data: any,
    setData: React.Dispatch<React.SetStateAction<any>>;
    handelSaveCongigValues: any,
    setPopup: any
}

const ConfigurationMasterValueForm: React.FC<TableProps> = ({ data, setData, handelSaveCongigValues, setPopup }) => {
    const readOnlyOptions = [
        { label: "True", value: true },
        { label: "False", value: false },
    ];

    // Extract headers dynamically from the first row of data, excluding "statusFlag"
    const headers = data.newConfigRes.configData.length
        ? Object.keys(data.newConfigRes.configData[0]).filter((key) => key !== "statusFlag")
        : [];

    // console.log(data)
    // Add a new row with empty fields
    const addNewRow = () => {
        const newRow = { ...data?.newConfigRes?.newRow };
        setData({
            ...data,
            newConfigRes: {
                ...data.newConfigRes,
                configData: [...data.newConfigRes.configData, newRow],
            },
        });
    };

    // console.log(data?.newConfigRes?.configData)

    return (
        <>
            <div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-xl mt-2">{data.newConfigRes.configName}</span>
                    <button
                        className="mb-2 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={addNewRow}
                    >
                        Add Row
                    </button>
                </div>
                <div className={data?.newConfigRes?.configData?.length > 4 ? "max-h-[350px] overflow-auto" : ""}>
                    <table className="w-full text-left border border-slate-400">
                        {/* Table Header */}
                        <thead className="!bg-blue-500 !text-white text-[14px]">
                            <tr>
                                <th className="border-2 text-sm p-2">S.No</th>
                                {headers.map((header, index) => (
                                    <th key={`header-${index}`} className="border-2 text-sm p-2">
                                        {capitalize(header.replace(/([A-Z])/g, " $1").trim())}
                                    </th>
                                ))}
                                <th className="border-2 text-sm p-2">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {data.newConfigRes.configData.map((row: any, rowIndex: any) => (
                                <tr key={`row-${rowIndex}`} className="border-2">
                                    <td className="border-2 p-2">{rowIndex + 1}</td>
                                    {headers.map((typedKey, colIndex) => (
                                        <td key={`cell-${rowIndex}-${colIndex}`} className="border-2 p-2">
                                            {typedKey === "readOnly" ? (
                                                <select
                                                    value={row[typedKey] ? "true" : "false"}
                                                    onChange={(e) => {
                                                        const updatedData = [...data.newConfigRes.configData];
                                                        updatedData[rowIndex][typedKey] = e.target.value === "true";
                                                        setData({
                                                            ...data,
                                                            newConfigRes: { ...data.newConfigRes, configData: updatedData },
                                                        });
                                                    }}
                                                    className="border rounded p-1"
                                                >
                                                    {readOnlyOptions.map((option) => (
                                                        <option key={option.value.toString()} value={option.value.toString()}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <Input
                                                    disabled={typedKey === "id" && row.isNew !== true}
                                                    crossOrigin
                                                    value={row[typedKey]}
                                                    onChange={(e) => {
                                                        const updatedData = [...data.newConfigRes.configData];
                                                        updatedData[rowIndex][typedKey] = e.target.value;
                                                        setData({
                                                            ...data,
                                                            newConfigRes: { ...data.newConfigRes, configData: updatedData },
                                                        });
                                                    }}
                                                />
                                            )}
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        <TrashIcon
                                            className="w-5 h-5 text-blue-500 cursor-pointer"
                                            onClick={() => {
                                                const updatedData = [...data.newConfigRes.configData];
                                                updatedData.splice(rowIndex, 1);
                                                setData({
                                                    ...data,
                                                    newConfigRes: { ...data.newConfigRes, configData: updatedData },
                                                });
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
            <div className="w-full my-3 flex justify-end gap-4">
                <ActionButton
                    buttonText={data.newConfigRes.button === "save" ? "Save" : "Update"}
                    // buttonText="Save"
                    width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                    handleSubmit={handelSaveCongigValues}
                />
                <ActionButton
                    buttonText="Cancel"
                    width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                    handleSubmit={() => setPopup(false)}
                />
            </div>
        </>
    );
};

export default ConfigurationMasterValueForm;
