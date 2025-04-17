import { TrashIcon } from "@heroicons/react/24/solid";

export const initialFormData = {
  modeOfPayment: { value: "cash", label: "Cash" },
  cash: { amount: "" },
  cheque: { amount: "", referenceNumber: "" },
  creditCard: {
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: "",
    transactionNumber: "",
  },
  debitCard: {
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: "",
    transactionNumber: "",
  },
  upi:{
    amount: "",
    referenceNumber: "",
  },
  //add new payment method with above format(if needed)
  //with key matching the value of dropdown
  gridData: [],
};
export const getPaymentColumns=(onDelete:any,isDeleteEnabled:boolean) => {
  let arr1=[
    { field: "id", headerName: "S.no", width: 120 },
    { field: "modeOfPayment", headerName: "Payment Mode", width: 200 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params:any) => (
        <>
        
        <button
            className="text-center"
            onClick={
              () => {
                onDelete(params.row)
              }
              
            }
          >
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </>
      ),
    },
  ];
  let arr2=[{ field: "id", headerName: "S.no", width: 120 },
    { field: "modeOfPayment", headerName: "Payment Mode", width: 200 },
    { field: "amount", headerName: "Amount", width: 120 },]
  return isDeleteEnabled ?arr1:arr2
}
