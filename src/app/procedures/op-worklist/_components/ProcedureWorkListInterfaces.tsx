import moment from "moment";
import { Dispatch, SetStateAction } from "react";

export interface ProcedureFilters {
  text: string;
  isActive: boolean;
}
export interface ProcedureWorkListForm {
  orderId: string,
  patientMrn: string,
  department: null | [],//multi select DD
  fromDate: string,
  toDate: string,
  filter: string,
}
export const initialProcedureWorkList: ProcedureWorkListForm = {
  orderId: "",
  patientMrn: "",
  department: null,
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  filter: "",
};
export interface ProcedureFormFieldProps {
  formData: ProcedureWorkListForm;
  setFormData: React.Dispatch<ProcedureWorkListForm>;
  onSubmit: () => void | undefined;
}
export interface ProcedureGridProps {
  data: any; //declare interface after api response
}
export interface ProcedurePopUpProps {
  state: any; //declare interface after api response
  setState: Dispatch<SetStateAction<any>>;
  handleOpen: () => void | undefined;
  open: boolean;
}