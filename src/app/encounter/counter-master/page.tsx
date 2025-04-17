"use client";

import Input from "../../_common/input";
import Select from "../../_common/select";
import React, { useState, useEffect } from "react";
import { Radio } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";

import {
  getServicesEntityDropdown,
  getLocationsByServiceEntity,
  savecountermaster,
} from "../../utilities/api-urls";
import services from "@/app/utilities/services";
import Loader from "@/app/_common/loader";

export default function CounterMaster() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [serviceEntityData, setServiceEntityData] = useState([]);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [alertMsg, setAlertMsg] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [counterData, setCounterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    services
      .get(getServicesEntityDropdown)
      .then((response) => {
        setServiceEntityData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setMessage("Technical error");
        setAlertColor("error");
        setAlertMsg(true);
        setLoading(false);
      });
    services
      .get(getLocationsByServiceEntity)
      .then((response) => {
        setLocationData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setMessage("Technical error");
        setAlertColor("error");
        setAlertMsg(true);
        setLoading(false);
      });
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    let postObj = {
      code: data.code,
      counterName: data.countername,
      counterType: "string",
      id: 0,
      locationId: 0,
      serviceEntityId: 0,
      statusFlag: 1,
    };
    services
      .create(savecountermaster, postObj)
      .then((response) => {
        setCounterData(response.data);
        setLoading(false);
        setMessage("Saved successfully!!");
        setAlertColor("success");
        setAlertMsg(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  const handleInput = () => {};

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full">
        <h1> Counter Master </h1>
      </div>
      <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
          <div className="-mx-3 md:flex py-2">
                <div className="md:w-1/2 px-3 my-2">
                <Select
            name="serviceentity"
            label="Service Entity"
            control={control}
            required={false}
            listItems={serviceEntityData}
            keyValue="id"
            displayValue="desc"
          />
                </div>
                <div className="md:w-1/2 px-3 my-2">
                <Select
            name="location"
            label="Location (Facility)"
            control={control}
            required={false}
            listItems={locationData}
            keyValue="id"
            displayValue="desc"
          />
                </div>
         </div>
         <div className="-mx-3 md:flex py-2">
                <div className="md:w-1/2 px-3 my-2">
                <Input
            type="text"
            label="Code"
            name="code"
            watch={watch}
            inputRef={register("code", {
              required: true,
            })}
            handleChange={handleInput}
          />
                </div>
                <div className="md:w-1/2 px-3 my-2">
                <Input
            type="text"
            label="Counter Name"
            name="countername"
            watch={watch}
            inputRef={register("countername", {
              required: true,
            })}
            handleChange={handleInput}
          />
                </div>
         </div>
         <div className="font-bold text-md px-4 md:pt-3 pb-3 mx-auto w-full ">
         <p>Counter Type: </p>
      </div>
         <div className="-mx-3 md:flex py-2">
               
                <div className="md:w-1/2 px-3 my-2 flex items-center  gap-x-6">
                <Radio crossOrigin={undefined} name="type" label="OPD" />
                <Radio crossOrigin={undefined} name="type" label="Triage" />
                </div>
                <div className="md:w-1/2 px-3 my-2">
               
                </div>
         </div>

         <div  className="mt-6 flex items-center justify-end gap-x-6">
         <ActionButton
          width="fit-content"
          buttonText="SAVE"
          handleSubmit={handleSubmit(onSubmit)}
        />

        <ActionButton
          width="fit-content"
          buttonText="CLEAR"
          backgroundColor="red"
          //   handleSubmit={handleSubmit(onSubmit)}
        />
        </div>
    </div>

    </div>
  );
}
