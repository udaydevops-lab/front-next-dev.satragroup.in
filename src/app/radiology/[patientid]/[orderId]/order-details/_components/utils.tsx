import { getRadiologists } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";

export const initialData={
    orderDetailsId: null,
    orderId: "",
    departmentCode: "",
    departmentDesc: "",
    specialityCode: "",
    specialityDesc: "",
    modality: "",
    serviceCode: "",
    serviceName: "",
    accessionNum: "",
    isPerformedTechRadiologyst: 0,
    technicianName: "",
    radiologystName: "",
    isWalkinScheduled: 0,
    comments: " ",
    statusFlag: "1",
    generatedDate: null,
    updatedDate: null, 
    generatedBy: "",
    updatedBy: "",
    orderDetailsItemList: [
      {
        orderDetailsItemId: null,
        orderId: "",
        event: " ",
        eventTime: "",
        recordBy: "",
        recordedDateTime: "",
        statusFlag: 1,
        generatedDate: null,
        updatedDate: null,
        generatedBy: "",
        updatedBy: "",
      },
    ],
  }
  export const getList = (api:string,setState:any) => {
    services.get(api).then((response) => {
      response.data.map((item: any) => {
        item.label = item.firstName;
        item.value = item.employeeId;
      });
      setState(response.data);
    });
  };