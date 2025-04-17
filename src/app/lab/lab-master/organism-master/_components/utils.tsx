import services from "@/app/utilities/services";
import {
  InputDetails,
  LabData,
} from "../../_components/interfaces/lab-interfaces";
import { changeOrganismStatusFlag } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";

export const handleOrganismStatus = (data: any, getData: () => void) => {
  services
    .create(
      changeOrganismStatusFlag +
        data.organismId +
        `${data.statusFlag == "1" ? "/0" : "/1"}`,
      {}
    )
    .then((response) => {
      toast.success(
        `Successfully ${
          data.statusFlag == 0 ? "Activated" : "Inactivated"
        } Organism`
      );
      getData();
    })
    .catch((error) => {
      toast.error("Technical Error");
    });
};
export const initialOrganismData = {
  organismCode: "",
  organismDesc: "",
};
export const getOrganismInputdetails =(data:LabData)=>{
  return  {
    inputCodeName: "organismCode",
    inputDescName: "organismDesc",
    inputCodeValue: data.organismCode,
    inputDescValue: data.organismDesc,
    inputCodeLabel: "Organism Code",
    inputDescLabel: "Organism Description",
  } as InputDetails
}