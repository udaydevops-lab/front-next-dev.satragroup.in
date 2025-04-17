import { Options } from "react-tailwindcss-select/dist/components/type";

export  interface SpecialtyDoctorMappingForm{
    popUp: boolean,
    action: string, // 'new' || 'update'
    doctorsList:Array<Options>,
    departmentList:Array<Options>,
    doctors:null | [],
    department:string
}