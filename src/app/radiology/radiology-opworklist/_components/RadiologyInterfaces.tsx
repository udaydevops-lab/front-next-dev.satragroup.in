import moment from "moment";
import { Dispatch, SetStateAction } from "react";

export interface RadiologyFilters {
  text: string;
  isActive: boolean;
}
export interface RadiologyWorkListForm {
  orderId: string,
  patientMrn: string,
  speciality: null | [],//multi select DD
  fromDate: string,
  toDate: string,
  filter: string,
}
export const initialRadiologyWorkList: RadiologyWorkListForm = {
  orderId: "",
  patientMrn: "",
  speciality: null,
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  filter: "",
};
export interface RadiologyFormFieldProps {
  formData: RadiologyWorkListForm;
  setFormData: React.Dispatch<RadiologyWorkListForm>;
  onSubmit: () => void | undefined;
}
export interface RadiologyGridProps {
  data: any; //declare interface after api response
}
export interface RadiologyPopUpProps {
  state: any; //declare interface after api response
  setState: Dispatch<SetStateAction<any>>;
  handleOpen: () => void | undefined;
  open: boolean;
}