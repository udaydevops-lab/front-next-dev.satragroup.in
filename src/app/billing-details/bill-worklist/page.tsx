"use client";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { getLoginResponse } from "@/app/_commonfeatures/header";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { LabPagetitle } from "@/app/lab/_component";
import { getBillData, getConfigData, getOpReceiptDetails, getReceptData, opBillMrnSearch, opBillWorkListSearch } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WorkList() {
  const router = useRouter();
    const [oPReceptData, setOPReceptData] = useState<any>([])
    const [billNoList, setBillNoList] = useState<any>([])
    const [mrnList, setMrnList] = useState<any>([])
    const [fields, setFields] = useState<any>({
        billNo: "",
        mrn: "",
        fromDate: moment(),
        toDate: moment(),
    })
    const [gstDetails, setGstDetails] = useState({
        cgst: 0,
        sgst: 0,
    });
    useEffect(() => {
        services
        .get(getConfigData + "GST" + "/0")
        .then((response) => {
            const data = response.data.configData;
            setGstDetails({
            ...gstDetails,
            sgst: Number(data[0].value),
            cgst: Number(data[1].value),
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);
    const columns: GridColDef[] = [
      { field: "id", headerName: "S No", width: 70 },
      { field: "patientName", headerName: "Patient Name", width: 170 },

      {
        field: "billNumber",
        headerName: "Bill Number",
        width: 150,
        renderCell: (params: any) => (
          <>
            <div
              onClick={() =>
                router.push(`/billing-details/${params.row.billNumber}`)
              }
              className="text-blue-500 underline cursor-pointer text-[15px]"
            >
              {params.row.billNumber}
            </div>
          </>
        ),
      },
      { field: "mrn", headerName: "MRN", width: 150 },
      { field: "revenueAmount", headerName: "Bill Amount", width: 130 },
      { field: "discountAmount", headerName: "Discount Amount", width: 130 },
      {
        field: "totalAmountIncludeGst",
        headerName: "Net Amount",
        width: 130,
        renderCell: (params: any) => (
          <>
            {getLoginResponse().billingGstIncluded == 1
              ? Number(params.row.revenueAmount) - Number(params.row.discountAmount)
              : Number(params.row.revenueAmount) -
                Number(params.row.discountAmount) +
                ((Number(params.row.revenueAmount) - Number(params.row.discountAmount)) *
                  (Number(gstDetails.cgst) + Number(gstDetails.sgst))) /
                  100}
          </>
        ),
      },
      { field: "generatedBy", headerName: "Generated By", width: 150 },
      {
        field: "generatedDate",
        headerName: "Generated Data",
        width: 150,
        renderCell: (params: any) => (
          <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
        ),
      },
    ];

    // serch button function
    const handelSearchRecept = async () => {
        const mrn = fields.mrn.label ? fields.mrn.label : "";
        const billNo = fields.billNo.label ? fields.billNo.label : "";
        let fromDate=moment(
          fields.fromDate
        ).format("YYYY-MM-DD 00:00:00")
        let toDate=moment(
          fields.toDate
        ).format("YYYY-MM-DD 23:59:59")
        if(billNo ||mrn){
          fromDate=''
          toDate=''
        }else{
          
        }
        const url = `${opBillWorkListSearch}billNumber=${billNo}&mrn=${mrn}&fromDate=${fromDate}&toDate=${toDate}`;
        try {
            const res = await services.get(url)
            // console.log(res.data)
            setOPReceptData(res.data)

        } catch (error: any) {
            // toast.error(error?.response?.data)
            setOPReceptData([])
        }
    }

    // Reset button function
    const handelReset = () => {
        setBillNoList([])
        setMrnList([])
        setFields({
            billNo: "",
            mrn: "",
            fromDate: moment(),
            toDate: moment(),
        })
    }

    // getting bill number function
    const getBillList = async (billNo: any) => {
        try {
            if (billNo.length > 2) {
                const url = `${getBillData}${billNo}`
                const res = await services.get(url)
                const result = res.data.map((b: any) => ({
                    ...b,
                    label: b.billNumber, value: b.billNumber,
                }))
                setBillNoList(result)
            }

        } catch (error) {
            // toast.error("No Data")
        }
    }
 // getting mrn function
 const getMrnList = async (mrn: any) => {
  try {
      if (mrn.length > 2) {
          const url = `${opBillMrnSearch}${mrn}`
          const res = await services.get(url)
          const result = res.data.map((r: any) => ({
              ...r,
              label: r.mrn, value: r.mrn,
          }))
          setMrnList(result)
      }
  } catch (error) {
      toast.error("No Data")
  }
}


    useEffect(() => {
        handelSearchRecept()
    }, [])
  return (
    <div className="top-0 w-full ">
                <div className="mx-auto mt-4  max-w-7xl pb-0 ">
                    <div className='bg-white p-2 px-4 rounded-md'>
                        <LabPagetitle title='OP Bill Details Worklist' />
                        <div className='w-full mt-4 grid grid-cols-5 gap-4'>
                            <ReactSelectBox
                                isSearchable={true}
                                value={fields.billNo}
                                options={billNoList}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    billNo: e,
                                }))}
                                label="Bill Number"
                                onSearchInputChange={(e) => getBillList(e.target.value)}

                            />
                            <ReactSelectBox
                                isSearchable={true}
                                value={fields.mrn}
                                options={mrnList}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    mrn: e,
                                }))}
                                label="Patient Mrn"
                                onSearchInputChange={(e) => getMrnList(e.target.value)}
                            />
                            <DateInput
                                disableFuture={true}
                                value={fields.fromDate}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    fromDate: e,
                                }))}
                                label="From Date"
                            />
                            <DateInput
                                disableFuture={true}
                                value={fields.toDate}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    toDate: e,
                                }))}
                                label="To Date"
                            />
                            <div className='w-full flex gap-3'>
                                <ActionButton
                                    buttonText="Search"
                                    width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handelSearchRecept}
                                />
                                <ActionButton
                                    buttonText="Reset"
                                    width="w-[100px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handelReset}
                                />
                            </div>
                        </div>
                        <div className='w-full mt-4'>
                            <div className="data-grid-newThem">
                                <ReactDatagrid rows={oPReceptData} columns={columns} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  );
}
