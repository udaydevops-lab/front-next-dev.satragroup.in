import services from "@/app/utilities/services";
import { InputDetails, LabData } from "../../_components/interfaces/lab-interfaces";
import { changeAntibioticStatusFlag } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";


export const handleAntibioStatus = (data: any, getData: () => void) => {
  services
  .create(
    changeAntibioticStatusFlag +
      data.antibioticId +
      `${data.statusFlag == "1" ? "/0" : "/1"}`,
    {}
  )
  .then((response) => {
    toast.success(
      `Successfully ${
        data.statusFlag == 0 ? "Activated" : "Inactivated"
      } Antibiotic`
    );
    getData();
  })
  .catch((error) => {
    toast.error("Technical Error");
  });
};
export const initialAntibioticData = {
  antibioticDesc: "",
  antibioticCode: "",
};
export const getAntibioticInputdetails =(data:LabData)=>{
  return  {
    inputCodeName:"antibioticCode",
    inputDescName:"antibioticDesc",
    inputCodeValue:data.antibioticCode,
    inputDescValue:data.antibioticDesc,
    inputCodeLabel:"Antibiotic Code",
    inputDescLabel:"Antibiotic Description",
  } as InputDetails
}
