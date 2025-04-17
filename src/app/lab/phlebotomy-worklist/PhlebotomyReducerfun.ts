import moment from "moment";
import { Field } from "react-hook-form";

interface PhleboForm {
  speciality: any;
  patientMrn: any;
  labOrderId: "";
  fromDate: any;
  toDate: any;
  filter: string;
  loader: boolean;
}

export const initialState: PhleboForm = {
  labOrderId: "",
  speciality: null,
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  filter: "All",
  loader: false,
  patientMrn: {
    label: "Patient MRN"
  }
};

// export type AppAction =
//     | { type: 'fieldVal', payload: Partial<AppState['field']> }
//     | { type: 'getAllapi', payload: Partial<AppState['getAllapi']> }

// export const Phlebotomyreducer = (state: AppState, action: AppAction) => {
//     switch (action.type) {
//         case 'fieldVal':
//             return { ...state, field: { ...state.field, ...action.payload } }
//         case 'getAllapi':
//             return { ...state, getAllapi: { ...state.getAllapi, ...action.payload } }
//         default:
//             return state
//     }
// }
