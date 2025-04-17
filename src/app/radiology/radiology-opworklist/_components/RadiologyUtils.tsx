import { RadiologyFilters } from "./RadiologyInterfaces";

export const filters = () => {
  return [
    {
      text: "New Order",
      isActive: false,
    },
    {
      text: "Patient Arrived",
      isActive: false,
    },
    {
      text: "Exam Started",
      isActive: false,
    },
    {
      text: "Exam Completed",
      isActive: false,
    },
    {
      text: "Result Entered",
      isActive: false,
    },
    {
      text: "All Status",
      isActive: true,
    },
  ] as RadiologyFilters[];
};
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getContent = (params: any) => {
  return (
    <div>
      <table className="border-2">
        {Object.entries(params.row).map(([key, value]) => {
          return (
            <tr key={key} className="border-2 ">
              <th className="border-2 text-sm p-2 rounded-lg">
                {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
              </th>
              <th className="border-2 p-2">{value as string}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
export const getDDValue = (list: any, term: string) => {
  return term == "" ? "" : list.filter((item: any) => term == item.value)[0];
};
