import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ActionButton from "./button";
import { v4 as uuidv4 } from 'uuid';
import services from "../utilities/services";
import { enctGenerateBill, getBillDetails } from "../utilities/api-urls";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import Printlayout from "./PrintLayout/printlayout";
import PrintGeneratedBills from "../cpoe/component/PrintGeneratedBills";
import { allowOnlyNumbers } from "../utilities/validations";
import { ReactSelectBox } from "../_commonfeatures";
import { Input } from "@material-tailwind/react";
export default function Invoice(props: any) {
  const { handleSubmit } = useForm();
  const [servicesData, setServicesData] = useState([]);
  const [totalCalAmount, setTotalCalAmount] = useState<any>();
  const [discountAmt, setDiscountAmt] = useState<number>(0);
  const [paymtGridData, setPaymtGridData] = useState<boolean>(false);
  const [selectedPayments, setSelectedPayments] = useState<any>([]);
  const [showAmtPaidVal, setShowAmtPaidVal] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number | string>(0);
  const [responseForPrintScreen, setResponseForPrintScreen] = useState<any>({});
  const [showPrint, setShowPrint] = useState(false);
  const [addBtnDisabled, setAddBtnDisabled] = useState<any>(true);
  const [amount, setAmount] = useState<any>("");
  const [disableDiscount, setDisableDiscount] = useState(false);
  const [isBillSaved, setIsBillSaved] = useState(false);


  const onDelete = (data: any): void => {
    let delSelectedRow = selectedPayments.filter(
      (items: any) => items.sno !== data.sno
    );
    setSelectedPayments(delSelectedRow);
  };

  const columns: GridColDef[] = [
    {
      field: "id", headerName: "S.no", width: 50,
    },
    { field: "servicename", headerName: "Service Name", width: 300 },
    { field: "charge", headerName: "Charge", width: 120 },
  ];
  const columns1: GridColDef[] = [
    {
      field: "sno", headerName: "S.no", width: 120,
      renderCell: (params) => {
        const rowNumber = selectedPayments.indexOf(params.row) + 1;
        return rowNumber;
      }
    },
    { field: "selectedPaymentMode", headerName: "Payment Mode", width: 120 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <>
          <button className="text-center" onClick={() => onDelete(params.row)}>
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </>
      ),
    },
  ];



  const [paymentModeData, setPaymentModeData] = useState<any>([{ label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },])


  const [paymentType, setPaymentType] = useState<any>({
    label: "Payment Mode"
  })

  const handlePaymentMode1 = (e: any) => {
    setPaymentType(e)
  }

  const showPaymentDataInGrid = () => {
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const newObj = {
      sno: uuidv4().toLowerCase(),
      selectedPaymentMode: paymentType.label,
      amount: parseFloat(amount),
    };
    setSelectedPayments((prevData: any) => [...prevData, newObj]);
    setPaymtGridData(true);
    setPaymentType({ label: "Payment Mode" });
    setAmount("");
  };
  const handleDiscountValue = (e: any) => {
    setDiscountAmt(parseFloat(e.target.value) || 0);
  };
  interface OpBillItem {
    serviceId: number;
    servicename: string;
    charge: number;
    servicePackRateId: number;
    servicecode: number;
    discountAmount: number;
    statusFlag: number;
    orderId: string;
  }
  interface billDetails {
    patientId: number;
    mrn: string;
    patientName: string;
    opdEncounterId: number;
    discountAmount: number;
    opBillItemTbl: OpBillItem[];
    department: string;
    specialty: string;
  }
  const generateBill = () => {
    if (finalAmount === "Invalid") {
      toast.error("Please select valid amounts");
      return;
    }

    if (finalAmount !== 0) {
      toast.error("Please select the payment mode and add the services");
      return;
    }

    let postObj: billDetails = {
      patientId: props.patientId,
      mrn: props.mrn,
      patientName: props.patientName,
      opdEncounterId: props.encounterId,
      discountAmount: discountAmt,
      department: props.department,
      specialty: props.specialty,
      opBillItemTbl: servicesData.map((item: OpBillItem) => ({
        ...item,
        serviceCode: item.servicecode,
        serviceName: item.servicename,
        serviceAmount: item.charge,
        orderId: item.orderId,
      })),
    };

    if (finalAmount === 0) {
      services
        .create(enctGenerateBill, postObj)
        .then((response) => {
          toast.success("Bill generated successfully");
          setResponseForPrintScreen(response.data);
          setShowPrint(true);
          setIsBillSaved(true);
          services
            .get(getBillDetails + props.patientId + "/" + props.encounterId)
            .then((response) => {
              let data = response.data.map((item: any, index: number) => ({
                id: index + 1,
                servicetype: item.servicetype,
                serviceTypeDesc: item.serviceTypeDesc,
                servicecode: item.serviceCode,
                servicename: item.serviceName,
                charge: item.serviceAmount,
                opdEncounterSerId: item.opdEncounterSerId,
                orderId: item.orderId,
                billNumber: item.billNumber,
                billId: item.billId,
              }));
              setSelectedPayments([])
              setAmount("")

              if (data.length > 0) {
                props.handleBillResponse();
              }
            }
            )

            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (finalAmount === "Invalid") {
      toast.error("Please select valid amounts");
    } else if (finalAmount !== 0) {
      toast.error("Please select the payment mode and add the services");
    }
  };

  const PrintRecord = () => {
    if (!showPrint) {
      toast.error("Please generate bill for the services");
      return;
    }

    const printContent = document.getElementById("divToPrint");

    if (printContent) {
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no"
      );

      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print</title></head><body>"
        );
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  useEffect(() => {
    const updatedServicesData = props.getSelectedItems.map(
      (item: any, index: number) => ({
        ...item,
        id: index + 1,
      })
    );
    setServicesData(updatedServicesData);
    let charges = 0;
    let totalBillAmount = props.getSelectedItems.reduce(
      (accumulator: number, item: any) => {
        return accumulator + parseInt(item.charge ? item.charge : 0, 10);
      },
      charges
    );
    setTotalCalAmount(totalBillAmount);
    if (showAmtPaidVal == totalCalAmount) {
      setAddBtnDisabled(true)
      setDisableDiscount(true)
    } else {
      setDisableDiscount(false)
    }
    if (showAmtPaidVal === 0) {
      setFinalAmount(totalBillAmount);
    }

    if (paymtGridData) {
      let amountPaid = 0;
      let amountToBePaid = selectedPayments.reduce(
        (accumlator: number, item: any) => {
          return accumlator + parseInt(item.amount, 10);
        },
        amountPaid
      );
      setShowAmtPaidVal(amountToBePaid);
      if (discountAmt > 0) {
        let outstandingAmount = totalCalAmount - amountToBePaid - discountAmt;
        if (outstandingAmount < 0) {
          toast.error("Please select valid amounts");
          setFinalAmount("Invalid");
        } else if (outstandingAmount >= 0) {
          setFinalAmount(outstandingAmount);
        }
      } else if (discountAmt === 0) {
        let outstandingAmount = totalCalAmount - amountToBePaid;
        if (outstandingAmount < 0) {
          toast.error("Please select valid amounts");
          setFinalAmount("Invalid");
        } else if (outstandingAmount >= 0) {
          setFinalAmount(outstandingAmount);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymtGridData, selectedPayments, discountAmt, totalCalAmount, props, showAmtPaidVal, disableDiscount]);
  console.log(selectedPayments);
  return (
    <div className="invoice-wrapper">
      <div id="divToPrint" className="hidden w-full">
        <Printlayout
          content={
            <PrintGeneratedBills
              getBillData={responseForPrintScreen}
              key={uuidv4()}
            />
          }
          patientid={props.patientId}
          opdEncounterId={props.encounterId}
        />
      </div>
      <div>
        <div className="flex gap-4 w-full">
          <div className="w-2/5 mt-2">
            <div>
              <DataGrid
                rows={servicesData}
                columns={columns}
                getRowId={(row) => row.id}
                hideFooter
                checkboxSelection={false}
              />
              <div className="flex gap-4 mt-4 mb-2">
                <Input
                  type="text"
                  label="Bill Number"
                  name="billNumber"
                  crossOrigin={undefined}
                  className="pointer-events-none !bg-[#eceff1]"
                />
                <Input
                  type="text"
                  label="Bill Date & Time"
                  name="billDateTime"
                  crossOrigin={undefined}
                  className="pointer-events-none !bg-[#eceff1]"
                />
              </div>
            </div>
          </div>
          <div className="w-3/5 mt-2 flex gap-4">
            <div className="w-3/4">
              <div className="flex gap-1 w-full">
                <div className="w-1/2">
                  <ReactSelectBox
                    label="Payment Mode"
                    onChange={handlePaymentMode1}
                    options={paymentModeData}
                    isSearchable={true}
                    value={paymentType}
                    isMultiple={false}
                  />
                </div>
                <div className="w-1/2 ml-2">
                  <Input
                    label="Amount"
                    value={amount}
                    crossOrigin={undefined}
                    name="amount"
                    onChange={(e: any) => {
                      if (e.target.value !== "") {
                        setAddBtnDisabled(false)
                      } else {
                        setAddBtnDisabled(true)
                      }
                      setAmount(e.target.value);
                    }}
                  />
                  {amount &&
                    typeof amount === "string" &&
                    !allowOnlyNumbers.test(amount) && (
                      <div className="absolute text-xs ml-1 text-red-500">
                        Please Enter only Numbers!
                      </div>
                    )}
                </div>
                <div className="ml-2">
                  <ActionButton
                    buttonText="ADD"
                    disabled={addBtnDisabled}
                    width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={showPaymentDataInGrid}
                  />
                </div>
              </div>
              {/* <div className="flex gap-1 mt-2 w-full">
                <Input
                  type="text"
                  label="Mode Ref Number"
                  name="modeRefNo"
                  crossOrigin={undefined}
                />
                
              </div> */}
              <div className="mt-2 w-full">
                {paymtGridData ? (
                  <DataGrid
                    rows={selectedPayments}
                    columns={columns1}
                    getRowId={(row) => row.sno}
                    hideFooter
                    checkboxSelection={false}
                  />
                ) : null}
              </div>
            </div>
            <div className="space-y-2 w-1/4">
              <Input
                type="text"
                label="Total Bill Amount"
                name="totalBillAmount"
                crossOrigin={undefined}
                className="pointer-events-none !bg-[#eceff1]"
                value={totalCalAmount}
                containerProps={{
                  className: "!min-w-0 rounded-lg",
                }}
              />
              <Input
                type="text"
                label="Discount"
                name="discount"
                crossOrigin={undefined}
                onChange={handleDiscountValue}
                containerProps={{
                  className: "!min-w-0 rounded-lg",
                }}
                disabled={disableDiscount}
              />
              <Input
                type="text"
                label="Amount Paid"
                name="amountPaid"
                crossOrigin={undefined}
                className="pointer-events-none !bg-[#eceff1]"
                value={showAmtPaidVal}
                containerProps={{
                  className: "!min-w-0 rounded-lg",
                }}
              />
              <Input
                type="text"
                label="Outstanding Amount"
                name="outstandingAmount"
                crossOrigin={undefined}
                className="pointer-events-none !bg-[#eceff1]"
                value={finalAmount}
                containerProps={{
                  className: "!min-w-0 rounded-lg",
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-2">
          <div className="flex gap-3 justify-end">
            <ActionButton
              buttonText="Save"
              handleSubmit={handleSubmit(generateBill)}
              width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={selectedPayments.length > 0 ? false : true}

            />
            <ActionButton
              buttonText="Print"
              handleSubmit={PrintRecord}
              width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={!isBillSaved}
            />
            <ActionButton
              buttonText="Back"
              handleSubmit={() => props.hideGenerateBill(true)}
              width="w-[120px] text-white text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
