"use client";
import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Input } from "@material-tailwind/react";
import React, { FC, useEffect } from "react";
import { toast } from "react-toastify";

interface DiscountProps {
    discount: any;
    setDiscount: any;
    handelDiscount: any;
    servicetypeList: any; // This should be a list of objects with `label`, `value`, and `charge`
    totalAmount: any; // This is the total amount before discount
    discountType: any;
    setDiscountType: any;
    discountDetails: any;
    setDiscountDetails: any;
    deportment: any;
    setDeportment: any;
    selectedServices: any;
    setSelectedServices: any;
    setTotalDiscount: any;
    totalDiscount: any;
    serviceData: any;
    setSelectedItems:any;
    setIsAdded:any;
    isAdded:any
}

const DiscountPage: FC<DiscountProps> = ({
    discount,
    setDiscount,
    handelDiscount,
    servicetypeList,
    totalAmount,
    discountType,
    setDiscountType,
    discountDetails,
    setDiscountDetails,
    deportment,
    setDeportment,
    selectedServices,
    setSelectedServices,
    setTotalDiscount,
    totalDiscount,
    serviceData,
    setSelectedItems,
    setIsAdded,
    isAdded
}) => {
    const discountTypeList: any = [
        { label: "on Bill", value: "on Bill" },
        { label: "on Service Type", value: "on Service Type" }
    ];

    const totalServiceCharge = (name: any) => {
        const charge = serviceData
            .filter((list: any) => list.serviceTypeDesc === name)
            .reduce((total: number, item: any) => total + item.charge, 0);
        return charge;
    }

    // Handle discount percentage/amount calculations
    const handelDiscoutAmount = (type: string, value: any, index: number, service: any) => {
        const newDiscountDetails = [...discountDetails];
        const serviceName = discountDetails[index]?.serviceName;

        // Calculate the appropriate service charge (for 'total' or specific service)
        const serviceCharge = serviceName === 'total' ? totalAmount : totalServiceCharge(serviceName);

        let percentage = 0;
        let amount = 0;

        // Handle the discount based on type
        if (type === 'percentage') {
            percentage =Number(Number(value).toFixed(2));
            amount = Number((Number((percentage / 100) * serviceCharge)).toFixed(2))
        } else if (type === 'amount') {
            amount = Number(Number(value).toFixed(2));
            percentage = Number((Number(amount / serviceCharge) * 100).toFixed(2))
        }
        // Update the discount details
        newDiscountDetails[index] = {percentage, amount, serviceName };
        setDiscountDetails(newDiscountDetails);
    };

    // Handle adding services (departments)
    const handleServiceAdd = () => {
        if (!deportment) {
            toast.error("Please select a department!");
            return;
        }

        if (selectedServices.some((service: any) => service.value === deportment.value)) {
            toast.error("Service already added!");
            return;
        }

        const selectedService = servicetypeList.find((service: any) => service.value === deportment.value);
        if (!selectedService) {
            toast.error("Selected service not found!");
            return;
        }

        const serviceCharge = selectedService.charge || 0;
        const newDiscountDetails = [
            ...discountDetails,
            { percentage: "", amount: "", serviceName: deportment.label, charge: serviceCharge }
        ].filter((detail) => detail.serviceName);
        setSelectedServices([...selectedServices, selectedService]);
        setDiscountDetails(newDiscountDetails);
        setDeportment("");
    };

    // Handle removing services
    const handelDelete = (index: number) => {
        const updatedServices = selectedServices.filter((_: any, i: number) => i !== index);
        const updatedDiscountDetails = discountDetails.filter((_: any, i: number) => i !== index);

        setSelectedServices(updatedServices);
        setDiscountDetails(updatedDiscountDetails);

        const removedAmount = discountDetails[index]?.amount || 0;
        const newTotalDiscount = totalDiscount - removedAmount;

        setTotalDiscount(newTotalDiscount > 0 ? newTotalDiscount : 0);
    };

    // Handle deleting "on Bill" discount
    const handleDeleteOnBill = () => {
        setDiscountDetails([{ percentage: "", amount: "", serviceName: "" }]);
        setDiscount(0);
        setTotalDiscount(0);
    };

    // Handle applying discount
    const handleDiscountApply = (index:any) => {
        if (discountType?.label?.toLowerCase() === "on bill") {
            const { percentage, amount } = discountDetails[0];
            if(amount>totalAmount){
                toast.error("Discount amount exceeds total amount");
                return;
            }
            const totalDiscountAmount = amount || (percentage / 100) * totalAmount; // Calculate based on total amount
            setDiscount({ percentage, amount: totalDiscountAmount, type: "on Bill" });
            setTotalDiscount((prev:any)=>prev+totalDiscountAmount);
            setIsAdded(!isAdded)
            let arr=discountDetails
            arr[index].percentage=''
            arr[index].amount=''
            setDiscountDetails(arr)
        } else if (discountType?.label?.toLowerCase() === "on service type") {
            discountDetails.forEach((detail: any) => {
                const { percentage, amount } = detail;
               
                const serviceName = detail?.serviceName;
                if (serviceName) {
                    setDiscount((prev: any) => ({
                        ...prev,
                        [serviceName]: { percentage, amount, type: "on Service Type" }
                    }));
                }
            });
        }
        
    };

    const getSum = (index:any) => {
        let sum = totalDiscount||0;
        discountDetails.forEach((item: any) => {
            if (!isNaN(item.amount)) {
                sum += Number(item.amount);
            }
        });
        if(sum>totalAmount || totalDiscount>totalAmount){
            toast.error("Discount amount exceeds the total service charge!");
            return 
        }
        setIsAdded(!isAdded)
        // let arr=discountDetails
        // arr[index].percentage=''
        // arr[index].amount=''
        // setDiscountDetails(arr)
        setTotalDiscount(sum);
    };

    const handleDiscountType = (value: any) => {
        setDiscountType(value);

        if (value.label.toLowerCase() === "on bill") {
            // Initialize discountDetails with one object for 'on bill'
            setDiscountDetails([{ percentage: "", amount: "", serviceName: "total" }]);
        } else {
            // Reset for 'on service type'
            setDiscountDetails([]);
            setSelectedServices([]);
        }

        // setDiscount(0);
        // setTotalDiscount(0);
    };

    return (
      <div className="w-full mb-4 min-h-[200px]">
        <div className="w-full flex gap-4 mb-4">
          <div className="w-1/3">
            <ReactSelectBox
              value={discountType}
              options={discountTypeList}
              onChange={(selected) => handleDiscountType(selected)}
              label="Discount Type"
            />
          </div>
          {discountType?.label?.toLowerCase() === "on service type" && (
            <>
              <div className="w-1/3">
                <ReactSelectBox
                  value={deportment}
                  options={servicetypeList}
                  onChange={(selected) => setDeportment(selected)}
                  label="Department"
                />
              </div>
              <div className="w-1/3">
                <ActionButton
                  buttonText="Add"
                  width="w-[120px] py-3 bg-blue-500"
                  handleSubmit={handleServiceAdd}
                />
              </div>
            </>
          )}
        </div>

        <div className="w-full mb-4">
          {discountType?.label?.toLowerCase() === "on bill" && (
            <div className="w-full flex gap-4">
              <div>
                <Input
                  crossOrigin
                  value={
                    discountDetails[0]?.percentage == 0
                      ? ""
                      : discountDetails[0]?.percentage
                  }
                  onKeyPress={(e)=>{
                    if(e.key=='-'){
                       e.preventDefault()
                    }
                  }}
                  onChange={(e) =>
                    handelDiscoutAmount(
                      "percentage",
                      e.target.value,
                      0,
                      "total"
                    )
                  }
                  label="Discount Percentage"
                  type="number"
                />
              </div>
              <div>
                <Input
                  crossOrigin
                  value={
                    discountDetails[0]?.amount == 0
                      ? ""
                      : discountDetails[0]?.amount
                  }
                  onKeyPress={(e)=>{
                    if(e.key=='-'){
                       e.preventDefault()
                    }
                  }}
                  label="Discount Amount"
                  type="number"
                  onChange={(e) =>
                    handelDiscoutAmount("amount", e.target.value, 0, "total")
                  }
                />
              </div>
              <div className="w-full flex gap-2">
                <ActionButton
                  buttonText="Apply"
                  width="w-[auto] py-3 bg-blue-500"
                  handleSubmit={()=>handleDiscountApply(0)}
                />
                <ActionButton
                  buttonText="Clear"
                  width="w-[auto] py-3 bg-red-500"
                  handleSubmit={handleDeleteOnBill}
                />
              </div>
            </div>
          )}

          {discountType?.label?.toLowerCase() === "on service type" &&
            selectedServices.map((service: any, index: number) => (
              <div key={index} className="w-full">
                <div>{discountDetails[index]?.serviceName}</div>
                <div className="w-full flex gap-4 mb-4">
                  <div>
                    <Input
                      crossOrigin
                      value={
                        discountDetails[index]?.percentage == 0
                          ? ""
                          : discountDetails[index]?.percentage
                      }
                      onKeyPress={(e)=>{
                        if(e.key=='-'){
                           e.preventDefault()
                        }
                      }}
                      onChange={(e) => {
                        handelDiscoutAmount(
                          "percentage",
                          e.target.value,
                          index,
                          discountDetails[index]?.serviceName
                        );
                        handleDiscountApply(index);
                      }}
                      label="Discount Percentage"
                      type="number"
                    />
                  </div>
                  <div>
                    <Input
                      crossOrigin
                      value={
                        discountDetails[index]?.amount == 0
                          ? ""
                          : discountDetails[index]?.amount
                      }
                      onKeyPress={(e)=>{
                        if(e.key=='-'){
                           e.preventDefault()
                        }
                      }}
                      label="Discount Amount"
                      type="number"
                      onChange={(e) => {
                        handelDiscoutAmount(
                          "amount",
                          e.target.value,
                          index,
                          discountDetails[index]?.serviceName
                        );
                        handleDiscountApply(index);
                      }}
                    />
                  </div>
                  <div>
                    <ActionButton
                      buttonText="Clear"
                      width="w-[auto] py-3 bg-red-500"
                      handleSubmit={() => handelDelete(index)}
                    />
                  </div>
                </div>
                {discountType?.label?.toLowerCase() === "on service type" &&
                  selectedServices.length > 0 && (
                    <ActionButton
                      buttonText="Apply"
                      width="w-[120px] py-3 bg-blue-500"
                      handleSubmit={() => getSum(index)}
                    />
                  )}
              </div>
            ))}
        </div>
      </div>
    );
};

export default DiscountPage;
