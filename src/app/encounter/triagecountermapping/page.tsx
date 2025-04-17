"use client";

import ActionButton from "@/app/_common/button";
import Select from "../../_common/select";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getServicesEntityDropdown,
  getLocationsByServiceEntity,
} from "../../utilities/api-urls";
import services from "@/app/utilities/services";
import Loader from "@/app/_common/loader";

export default function TriageCounterMapping() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opdcounterlist, setOpdcounterlist] = useState([]);
  const [searchButton, setSearchButton] = useState(false);
  const [triagecounterlist, setTriagecounterlist] = useState([]);
  const [serviceEntityData, setServiceEntityData] = useState([]);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [alertMsg, setAlertMsg] = useState(false);
  const [locationData, setLocationData] = useState([]);
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

    setTimeout(() => {
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
    }, 2000);
  }, []);

  const handleopdcounter = (data: any) => {
    setOpdcounterlist(data);
  };

  const handletriagecounter = (data: any) => {
    setTriagecounterlist(data);
  };
  const onSubmit = () => {
  };

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full">
        <h1> Triage Counter Mapping </h1>
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
            <Select
              name="opdcounter"
              label="OPD Counter"
              control={control}
              required={false}
              listItems={opdcounterlist}
              keyValue="id"
              displayValue="desc"
              handleChange={handleopdcounter}
            />
          </div>
          <div className="md:w-1/2 px-3 my-2">
            <Select
              name="triagecounter"
              label="Triage Counter"
              control={control}
              required={false}
              listItems={triagecounterlist}
              keyValue="id"
              displayValue="desc"
              handleChange={handletriagecounter}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <ActionButton
            buttonText="Save"
            handleSubmit={handleSubmit(onSubmit)}
            disabled={searchButton}
            width="fit-content"
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
