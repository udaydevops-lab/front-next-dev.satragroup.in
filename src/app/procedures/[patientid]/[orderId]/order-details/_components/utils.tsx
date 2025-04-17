import services from "@/app/utilities/services";

export const initialData={
    proceduresOrderDetailsId: null,
    orderId: "",
    departmentCode: "",
    departmentDesc: "",
    modality: "",
    serviceCode: "",
    serviceName: "",
    accessionNum: "",
    isPerformedTechDoctor: 0,
    technicianName: "",
    doctorName: "",
    isWalkinScheduled: 0,
    comments: " ",
    statusFlag: "1",
    generatedDate: null,
    updatedDate: null, 
    generatedBy: "",
    updatedBy: "",
    orderDetailsItemList: [
      {
        procedureOrderDetailsItemId: null,
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