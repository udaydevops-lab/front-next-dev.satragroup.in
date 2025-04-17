import { getLocalItem } from "@/app/utilities/local";
import { capitalize } from "@mui/material";
import moment from "moment";

const allowedStatus = ["New Order", "Patient Arrived","Collected",null]; //status is null for doctor fee new visit

//User can only cancel items when they are in above metioned statuses
export const isCheckBoxEnabled = (data: any) => {
  let flag: boolean = false;
    if (allowedStatus.includes(data.status)) {
      flag = true;
    }
  return flag;
};
export const getContent = (params: any) => {
  return (
    <div>
      <table className="w-full  ">
        {Object.entries(params).map(([key, value]) => {
          if(key=="refundedAmount"||key=="outStandingRefund"){
             if(params[key]>0){
              return (
                <tr key={key} className="">
                  <th className=" text-start font-semibold text-sm p-1 rounded-lg">
                    {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
                  </th>
                  <th className="text-start ps-10 font-normal text-sm  p-1">
                    {<>{value as string}</>}
                  </th>
                </tr>
              );
             }else{
              return null
             }
          }else{
            return (
              <tr key={key} className="">
                <th className=" text-start font-semibold text-sm p-1 rounded-lg">
                  
                  {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
                </th>
                <th className="text-start ps-10 font-normal text-sm  p-1">
                  {<>{value as string}</>}
                </th>
              </tr>
            );
          }
         
        })}
      </table>
    </div>
  );
};
export const getOptions = () => {
  return [
    {
      label: "Cash",
      value: "cash",
    },
    {
      label: "Credit Card",
      value: "creditCard",
    },
    {
      label: "Debit Card",
      value: "debitCard",
    },
    {
      label: "Cheque",
      value: "cheque",
    },
  ] as any;
};
export const initialFormData = {
  modeOfRefund: { value: "cash", label: "Cash" },
  cash: {
    amount: "",
    referenceNo: "",
    approvalCode: "",
  },
  creditCard: {
    amount: "",
    cardNumber: "",
    referenceNo: "",
    approvalCode: "",
  },
  debitCard: {
    amount: "",
    cardNumber: "",
    referenceNo: "",
    approvalCode: "",
  },
  cheque: {
    amount: "",
    checkNumber: "",
    referenceNo: "",
    approvalCode: "",
  },
  upi: {
    amount: "",
    referenceNo: "",
    approvalCode: "",
  },
  //add new payment method with above format(if needed)
  //with key matching the value of dropdown
  gridData: [],
};
export const getFormColumns = () => {
  return [
    { field: "id", headerName: "S.No", width: 120 },
    {
      field: "modeOfRefund",
      headerName: "Mode of Refund",
      width: 220,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
    },
  ];
};
const loginResponse=JSON.parse(getLocalItem('loginResponse')!)
export const initialCancelData: any = {
  billHeaderId: null,
  patientId: null,
  opdEncounterId: null,
  billNumber: "",
  totalAmount: null,
  opBillingItemSet: [
    {
      billId: null,
      serviceName: "",
      serviceCode: "",
      serviceAmount: null,
      discountAmount: null,
      finalAmount: null,
      serviceType: "",
      departmenttDesc: "",
      departmentCode: "",
      specialityDesc: "",
      specialityCode: "",
      status: "",
      serviceTypeDesc: "",
      cancelOpBill: false,
      orderId: "",
      gstAmount:0,
      billingGstIncluded:loginResponse.billingGstIncluded,
    },
  ],
};

//getting extra fields when checkbox is selected so
//took only keys matching for cancel payload keys
export const assignValues = (object: any) => {
  let obj: any = {};
  Object.keys(initialCancelData.opBillingItemSet[0]).map((key: any) => {
    Object.keys(object).map((key2: any) => {
      if (key === key2) {
        obj[key] = object[key2];
      }
    });
  });
  return obj;
};

export const getRecieptColumns = () => {
  return [
    { field: "id", headerName: "S.No", width: 120 },
    {
      field: "mode",
      headerName: "Payment mode",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },
  ] as any;
};
export const getRefundDetailsColumns = () => {
  return [
    { field: "id", headerName: "S.No", width: 120 },
    {
      field: "patientName",
      headerName: "Patient Name",
      width: 150,
    },
    {
      field: "billNumber",
      headerName: "Bill Number",
      width: 150,
    },
    {
      field: "modeOfRefund",
      headerName: "Payment mode",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },

    {
      field: "generatedDate",
      headerName: "Refund Date Time",
      width: 150,
      renderCell: (params: any) =>
        params.row.generatedDate &&
        moment(params.row.generatedDate).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "generatedBy",
      headerName: "Refund Initiated By",
      width: 150,
    },
  ] as any;
};

export const getPrintContent = (params: any) => {
  return (
    <div>
      <table className="w-full  ">
        {Object.entries(params).map(([key, value]) => {
          if(key=="refundedAmount"||key=="outStandingRefund"){
             if(params[key]>0){
              return (
                <div key={key} style={{ width: "100%", marginTop: "1px" }}>
                <div>
                    <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <span>{capitalize(key.replace(/([A-Z])/g, " $1").trim())}</span>
                        <span>{value as string}</span>
                    </div>
                </div>
            </div>
              );
             }else{
              return null
             }
          }else{
            return (
              <div key={key} style={{ width: "100%", marginTop: "1px" }}>
                    <div>
                        <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>{capitalize(key.replace(/([A-Z])/g, " $1").trim())}</span>
                            <span>{value as string}</span>
                        </div>
                    </div>
                </div>
            );
          }
         
        })}
      </table>
    </div>
  );
};