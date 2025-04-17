import { getConfigData } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";

export interface Filters {
  text: string;
  isActive: boolean;
}
export interface WorkListForm {
  labOrderId: string,
  patientMrn: string,
  speciality: null | [],//multi select DD
  fromDate: string,
  toDate: string,
  filter: string,
}
export const initialStateWorkList: WorkListForm = {
  labOrderId: "",
  patientMrn: "",
  speciality: null,
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  filter: "All",
};


export interface FormFieldProps {
  formData: WorkListForm;
  setFormData: React.Dispatch<WorkListForm>;
  onSubmit: () => void | undefined;
}
export interface GridProps {
  data: any; //declare interface after api response
  getGridData: any
}
export interface PopUpProps {
  state: any; //declare interface after api response
  setState: Dispatch<SetStateAction<any>>;
  handleOpen: () => void | undefined;
  open: boolean;
  getGridData: any
  [key: string]: any;
}
export const filters = () => {
  return [
    {
      text: "Collected",
      isActive: false,
    },
    {
      text: "Received",
      isActive: false,
    },
    {
      text: "Result Entered",
      isActive: false,
    },
    {
      text: "Result Verified",
      isActive: false,
    },
    {
      text: "All Status",
      isActive: true,
    },
  ] as Filters[];
};
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getContent = (params: any) => {
  return (
    <div>
      <table className="border-2">
        {Object.entries(params).map(([key, value]) => {
          return (
            <tr key={key} className="border-2 ">
              <th className="border-2 text-sm p-2 rounded-lg">
                {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
              </th>
              <th className="border-2 p-2">{value as string ? value as string : "-"}</th>
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
export const addLabelAndValue = (data: Array<any>) => {
  data.map((item: any) => {
    item.label = item.specialityDescription || item.label;
    item.value = item.specialityCode || item.value;
  });
  return data;
};

//Get Drop down Data by Config (def) name
export const getList = (def: string, setState: any) => {
  services.get(getConfigData + `${def}/0`).then((response) => {
    setState(addLabelAndValue(response.data.configData));
  });
};