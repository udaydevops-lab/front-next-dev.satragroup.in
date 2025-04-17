"use client";
import React, { useEffect, useState } from "react";
import { TabPageTitle } from "../../../lab/_component";
import { useParams } from "next/navigation";
import services from "../../../utilities/services";
import {
  getAppointmentDetailsByApptNo,
  getPatientDetailsById,
} from "../../../utilities/api-urls";
import ReactCommonDialog from "../../../_commonfeatures/ReactCommonDialog";
import SearchUpdatePatient from "../../../patient/search-update-patient/page";
import ActionButton from "@/app/_common/button";
import { initialFormData } from "./components/Utils";
import { CalculateAge } from "@/app/_common/date1";
import WithoutMrnForm from "./components/WithoutMrnForm";
import PhysicianDetails from "./components/PhysicianDetails";
import moment from "moment";

function Appointment(props: any) {
  const [searchpopup, setSearchPopup] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<any>();
  const [withMrn, setWithMrn] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const generateSearchP = () => {
    setSearchPopup(true);
  };
  const patSearchById = (data: any) => {
    services.get(getPatientDetailsById + data).then((response) => {
      let obj: any = {};
      let patData = response.data.patData;
      obj.firstName = patData.firstName;
      obj.middleName = patData.middleName;
      obj.lastName = patData.lastName;
      obj.dateOfBirth = patData.dateOfBirth;
      obj.ageOfPatient = patData.ageOfPatient;
      obj.gender = { value: patData.gender, label: patData.genderDesc };
      obj.mobile = patData.primaryContactNum;
      obj.mrn=response.data.mrn
      obj.patientId=response.data.patientId
      obj.mrnSelect={label:response.data.mrn}
      setFormData({ ...formData, patientData: {...formData.patientData, ...obj } });
      setIsOpen(true);
      setAgeValue(patData.ageOfPatient);
    });
  };
  const { patientId, appointmentNum } = useParams();
  const [ageValue, setAgeValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleRadioChange = (type: string) => {
    setFormData(initialFormData);
    setAgeValue("");
    if (type == "withoutMrn") {
      setWithMrn(false);
      setIsOpen(true);
    } else {
      setWithMrn(true);
      setIsOpen(false);
    }
  };
  const handleDateChange = (e: any) => {
    setSelectedDate(e);
   
    let calculateAge = CalculateAge(e);
    let ageVal =
      calculateAge.years +
      " Years," +
      calculateAge.months +
      " Months and " +
      calculateAge.days +
      " Days";
    setAgeValue(ageVal);
    setFormData({
      ...formData,
      patientData: {
        ...formData.patientData,
        dateOfBirth: moment(e).format("YYYY/MM/DD"),
        ageOfPatient:ageVal
      },
    });
  };
  useEffect(() => {
    if (patientId !== "0") {
      patSearchById(patientId);
    }
  }, []);

  return (
    <>
      <div className="mx-4 flex">
        <TabPageTitle title="Out Patient Appointment" />
        {/* {withMrn && (
          <div className="en-autocomplteGserch flex items-center justify-end ml-4 pl-4">
            <ActionButton
              buttonText="Advanced Search"
              handleSubmit={generateSearchP}
              width="w-[100px] text-white  text-[12px] h-[20px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        )} */}
        <ReactCommonDialog
          open={searchpopup}
          handler={() => setSearchPopup(false)}
          popupClose={() => setSearchPopup(false)}
          Content={
            <SearchUpdatePatient
              screen={"appointment"}
              patSearchById={patSearchById}
              popupclose={setSearchPopup}
            />
          }
          size={"xl"}
        />
      </div>
      <PhysicianDetails
        formData={formData}
        setIsOpen={setIsOpen}
        setFormData={setFormData}
        ageValue={ageValue}
      />
      <WithoutMrnForm
        ageValue={ageValue}
        handleDateChange={handleDateChange}
        isOpen={isOpen}
        handleRadioChange={handleRadioChange}
        withMrn={withMrn}
        formData={formData}
        setFormData={setFormData}
        generateSearchP={generateSearchP}
        patSearchById={patSearchById}
      />   
    </>
  );
}

export default Appointment;
