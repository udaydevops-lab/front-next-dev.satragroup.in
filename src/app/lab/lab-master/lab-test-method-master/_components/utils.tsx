import { changeLabTestStatusFlag } from "@/app/utilities/api-urls";
import { InputDetails, LabData } from "../../_components/interfaces/lab-interfaces";
import services from "@/app/utilities/services";
import { toast } from "react-toastify";

export const handleLabTestStatus = (data: any, getData: () => void) => {
  services
  .create(
    changeLabTestStatusFlag +
      data.labTestMethodId +
      `${data.statusFlag == "1" ? "/0" : "/1"}`,
    {}
  )
  .then((response) => {
    toast.success(
      `Successfully ${
        data.statusFlag == 0 ? "Activated" : "Inactivated"
      } Test Method`
    );
    getData();
  })
  .catch((error) => {
    toast.error("Technical Error");
  });
};
export const initialLabTestData = {
  labTestMethodCode: "",
  labTestMethodDesc: "",
};
export const getLabTestInputdetails =(data:LabData)=>{
  return  {
    inputCodeName:"labTestMethodCode",
    inputDescName:"labTestMethodDesc",
    inputCodeValue:data.labTestMethodCode,
    inputDescValue:data.labTestMethodDesc,
    inputCodeLabel:"Lab Test Method Code",
    inputDescLabel:"Lab Test Method Description",
  } as InputDetails
}