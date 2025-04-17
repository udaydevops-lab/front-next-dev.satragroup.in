"use client";
import ActionButton from "@/app/_common/button";
import Cross_Icon from "@/app/_common/common_icons/Cross_Icon";
import {
  enrollAbhaAddressSuggestions,
  enrollNewAbhaAddress,
} from "@/app/utilities/api-urls";
import { getLocalItem, removeLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Button, Input, Tooltip } from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ViewConsent from "./ViewConsent";
import Loader from "@/app/_common/loader";
import { useRouter } from "next/navigation";
import ValidationRules from "./ValidationRules";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";

export default function NewAbhaSuggestions({
  showConsent,
  setShowConsent,
  isConsentProvided,
  formData,
  setFormData,
  handleReset,
  isProcessDisabled,
  setIsProcessDisabled,
  handleDataClear,
}: any) {
  const [suggestions, setSuggestions] = useState<any>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const handleSuggestionClick = (value: string) => {
    setFormData({ ...formData, abhaAddress: value });
    setShowSuggestions(false);
  };
  const handleClear = () => {
    setFormData({ ...formData, abhaAddress: "" });
    setIsProcessDisabled(true);
    handleDataClear();
  };
  const onCrossClick = () => {
    setShowSuggestions(false);
  };
  const handleSuggestion = () => {
    setShowSuggestions(true);
    let postObj = {
      txId: getLocalItem("txnId"),
    };
    services
      .create(enrollAbhaAddressSuggestions, postObj)
      .then((response) => {
        setSuggestions(response.data.abhaAddressList);
        setShowSuggestions(true);
      })
      .catch((error) => {
        toast.error("Failed to get suggestions");
      });
  };
  const router = useRouter();
  const handleSubmit = () => {
    let postObj = {
      txId: getLocalItem("txnId"),
      abhaAddress: formData.abhaAddress,
      preferred: "1",
    };
    setLoading(true);
    services
      .create(enrollNewAbhaAddress, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          toast.success("ABHA address created successfully");
          removeLocalItem("txnId");
          setFormData({ ...formData, abhaAddress: "" });
          handleReset();
          setTimeout(() => {
            router.push("/1/new-abha-profile");
          }, 1000);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  const handleOpen = () => {
    setShowConsent(!showConsent);
  };
  return (
    <div>
      {loading ? <Loader /> : ""}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex gap-4 col-span-1">
          <>
            <Input
              color="blue"
              crossOrigin={undefined}
              label="ABHA Address"
              onChange={(e) =>
                setFormData({ ...formData, abhaAddress: e.target.value })
              }
              value={formData.abhaAddress}
              disabled={false}
            ></Input>
          </>
          <span className="font-bold -ms-3 mt-2">@{loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}</span>

          <ActionButton
            buttonText={"Suggest"}
            handleSubmit={handleSuggestion}
            disabled={isProcessDisabled}
            width="w-[120px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"

          />
        </div>
        <div className="col-span-2 ">
          <ValidationRules />
        </div>
        {/*  */}

        {showSuggestions ? (
          <>
            {suggestions.length > 0 ? (
              <div className="rounded-lg border-x-black z-10 mt-11 shadow-xl w-[600px]  h-[200px] absolute bg-white overflow-y-scroll ">
                <div className="w-[25px] h-[20px] absolute -right-0 cursor-pointer z-10">
                  <Cross_Icon
                    onClick={onCrossClick}
                    width={"18"}
                    height={"15"}
                  />
                </div>
                <div className="mt-2 font-semibold justify-center flex"></div>
                <div className="grid grid-cols-4 gap-4 p-5">
                  {suggestions.map((item: any) => {
                    return (
                      <div
                        className="border-solid border-2 p-2 text-xs cursor-pointer flex justify-center items-center"
                        key={item}
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {showConsent ? (
        <ReactCommonDialog
          open={open}
          handler={handleOpen}
          popupClose={handleOpen}
          Content={<ViewConsent isConsentProvided={isConsentProvided} setShowConsent={setShowConsent} showConsent={showConsent} />}
          size="xl"
          overflowY="hidden"
        />
      ) : null}
      <div>
        <div className="mt-4 flex justify-end gap-4">
          <ActionButton
            buttonText={"Submit"}
            disabled={!formData.abhaAddress || !formData.abhaAddress.match(/^(?=.*[A-Za-z0-9])[A-Za-z0-9](?!.*[_\.]{2,})([A-Za-z0-9]|(?<!^)[_\.](?!$)){6,16}[A-Za-z0-9]$/)}
            width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={handleSubmit}
          />
          <ActionButton
            buttonText={"Clear"}
            width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={() => handleClear()}
          />
        </div>
      </div>
    </div>
  );
}
