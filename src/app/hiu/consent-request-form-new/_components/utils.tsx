import { capitalize } from "@mui/material";

export const getContent = (params: any) => {
    return (
        <div>
            <table className="w-full border-2 ">
                {Object.entries(params).map(([key, value]) => {
                    return (
                        <tr key={key} className="">
                            <th className=" border-2 text-start  text-xs p-2 rounded-lg">
                                {key !== "abhaAddress"
                                    ? capitalize(key.replace(/([A-Z])/g, " $1").trim())
                                    : "ABHA Address"}
                            </th>
                            <th className="text-start text-xs border-2 text-blue-gray-700 p-2">
                                {Array.isArray(value) ? (
                                    <table className="w-full">
                                        {value.length > 0
                                            ? value.map((item: any) => {
                                                return <tr key={item}>{item as string}</tr>;
                                            })
                                            : "-"}
                                    </table>
                                ) : (
                                    <>
                                        {value as string && (value as string) != "Invalid date"
                                            ? (value as string)
                                            : "-"}
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

export const getContentWithoutBorders=(params:any) => {
    return (
        <div>
            <table className="w-full">
                {Object.entries(params).map(([key, value]) => {
                    return (
                        <tr key={key} className="">
                            <th className="text-start text-blue-gray-700  text-xs p-2 rounded-lg">
                                {key !== "abhaAddress"
                                    ? capitalize(key.replace(/([A-Z])/g, " $1").trim())
                                    : "ABHA Address"}
                            </th>
                            <th className="text-start text-xs  p-2">
                                {Array.isArray(value) ? (
                                    <table className="w-full">
                                        {value.length > 0
                                            ? value.map((item: any) => {
                                                return <tr key={item}>{item as string}</tr>;
                                            })
                                            : "-"}
                                    </table>
                                ) : (
                                    <>
                                        {value as string && (value as string) != "Invalid date"
                                            ? (value as string)
                                            : "-"}
                                    </>
                                )}
                            </th>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}
