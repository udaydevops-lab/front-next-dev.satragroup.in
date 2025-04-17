import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";

export interface LabData {
  [key: string]: string;
}
export interface InputDetails {
  [key: string]: string;
}
export interface LabMasterForm {
  handleOpen: () => void | undefined;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  onSubmit: () => void | undefined;
  handleClear: () => void | undefined;
  formData: LabData;
  setFormData: Dispatch<SetStateAction<LabData>>;
  open: boolean;
  api: string;
  title: string;
  inputDetails: InputDetails;
  inputLabel:string;
  getAll:() => void | undefined;
}
export interface LabMasterGridProps {
  data: any;//declare after api response
  columns: GridColDef[];
  handleClear: () => void | undefined;
  handleOpen: () => void | undefined;
  open: boolean;
  title: string;
  api: string;
  editData: LabData;
  setEditData: Dispatch<SetStateAction<LabData>>;
  inputDetails: InputDetails;
  getAll:() => void | undefined;
}
export interface LabMasterFormPopUpProps {
  data: LabData;
  handleOpen: () => void | undefined;
  open: boolean;
  type: string;
  api: string;
  title: string;
  setData: Dispatch<SetStateAction<LabData>>;
  handleClear: () => void | undefined;
  inputDetails: InputDetails;
  getAll:() => void | undefined;
}
