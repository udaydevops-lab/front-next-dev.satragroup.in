import { capitalize } from "@mui/material";

export const getContent = (params: any) => {
    return (
        <div className="w-1/2">
            <table className="w-full  !border-none ">
                {Object.entries(params).map(([key, value]) => {
                    return (
                        <tr key={key} className="!bg-white">
                            <th className=" !border-none text-start  text-sm !p-1 rounded-lg">
                                {key !== "abhaAddress"
                                    ? capitalize(key.replace(/([A-Z])/g, " $1").trim())
                                    : "ABHA Address"}
                            </th>
                            <th className="text-start text-sm !border-none text-blue-gray-700 !p-1">
                                {Array.isArray(value) ? (
                                    <table className="w-full">
                                        {value.length > 0
                                            ? value.map((item: any) => {
                                                return <tr key={item}>{capitalize(item.replace(/([A-Z])/g, " $1").trim()) as string}</tr>;
                                            })
                                            : "-"}
                                    </table>
                                ) : (
                                    <>
                                        {value as string && (value as string) != "Invalid date"
                                            ? key=='patientName'?(value as string):(capitalize((value as string).replace(/([A-Z])/g, " $1").trim()) )
                                            : ""}
                                    </>
                                )}
                            </th>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};
