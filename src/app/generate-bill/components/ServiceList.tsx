'use client'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { getConfigData } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { getServiceColumns } from './utils';
import { getLoginResponse } from '@/app/_commonfeatures/header';


interface ServiceListProps {
    ServiceData: any;
    discount:any;
    discountDetails:any;
    setServiceData:any;
    isAdded:any;
    setDiscountDetails:any;
    setSummaryAmounts:any
}


const ServiceList: React.FC<ServiceListProps> = ({
  ServiceData,
  discount,
  discountDetails,
  setServiceData,
  isAdded,
  setDiscountDetails,
  setSummaryAmounts
}) => {
 
  const [gstDetails, setGstDetails] = useState({
    cgst: 0,
    sgst: 0,
  });
  const [key1, setKey1] = useState(0);
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
  useEffect(() => {
    let arr = ServiceData;
    let arr1: any = [];
    const loginResp = getLoginResponse();
    arr.map((item: any) => {
      if (discountDetails && discountDetails[0].serviceName == "total") {
        let discountAmt =
          (item.charge * Number(discount.percentage)) / 100 + item.discount;
        let gstAmt =
          loginResp.billingGstIncluded == 1
            ? 0
            : ((item.charge - discountAmt) *
                (gstDetails.cgst + gstDetails.sgst)) /
              100;
        let obj = {
          ...item,
          discountPercentage:discountAmt*100/item.charge,
          discount: discountAmt,
          gst: gstAmt,
          netAmount: item.charge - discountAmt + gstAmt,
        };
        arr1.push(obj);
      } else if (
        discountDetails &&
        discountDetails[0].serviceName == item.serviceTypeDesc
      ) {
        let discAmt =
          (item.charge * Number(discountDetails[0].percentage)) / 100 +
          item.discount;
        let gstAmt =
          loginResp.billingGstIncluded == 1
            ? 0
            : ((item.charge - discAmt) * (gstDetails.cgst + gstDetails.sgst)) /
              100;
        
        let obj = {
          ...item,
          discountPercentage:discAmt*100/item.charge,
          discount: discAmt,
          gst: gstAmt,
          netAmount: item.charge - discAmt + gstAmt,
        };
        arr1.push(obj);
      } else {
        arr1.push(item);
      }
    });
    setServiceData(arr1);
    setKey1((prev) => prev + 1);
    let arr2: any = discountDetails || [{ percentage: "", amount: "" }];
    arr2[0].percentage = "";
    arr2[0].amount = "";
    setDiscountDetails(arr2);
    const totalDiscount = arr1.reduce((sum:any, product:any) => sum + product.discount, 0);
    const billAmount = arr1.reduce((sum:any, product:any) => sum + product.charge, 0);
    const gstAmount = arr1.reduce((sum:any, product:any) => sum + product.gst, 0);
    const netAmount =arr1.reduce((sum:any, product:any) => sum + product.netAmount, 0);
    setSummaryAmounts({
        billAmount:billAmount,
        gstAmount:gstAmount,
        netAmount:netAmount,
        discountAmount:totalDiscount
    })
  }, [isAdded]);
  return (
    <div className="" key={key1}>
      <ReactDatagrid hideFooter={true} rows={ServiceData} columns={getServiceColumns()} />
    </div>
  );
};

export default ServiceList;
