"use client";
import ActionButton from "@/app/_common/button";
import DocumentUpload from "@/app/_common/document-upload";
import Loader from "@/app/_common/loader";
import { updateEmailPhoto } from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { emailPattern } from "@/app/utilities/validations";
import { Input, Radio } from "@material-tailwind/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function UpdateEmailPopUp({
  handleMobileEdit,
  setTitle,
  reRender,
  setReRender,
  profileData,
  setPopSize,
}: any) {
  const [confirm, setConfirm] = useState(false);
  const [newEmail, setNewEmail] = useState(profileData.email);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const handleRadio = (e: any) => {
    setConfirm(e.target.value == "yes");
    if (e.target.value == "no") {
      handleMobileEdit("close");
    } else {
      setTitle("Update email / profile photo");
      setPopSize("md");
    }
  };
  const handleProfileUpload = async (e: any) => {
    let image: any = await toBase64(e.target.files[0]);
    setProfileImage(image);
  };
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    const headers={
      "X-Token": "Bearer "+getLocalItem("abhaLoginToken"),
      "Access-Control-Allow-Origin": "*",
  };
  const handleSubmit = () => {
    if (newEmail.match(emailPattern)) {
      let postObj = {
        address: profileData.address,
        dayOfBirth: profileData.dayOfBirth,
        districtCode: profileData.districtCode,
        email: newEmail || profileData.email,
        firstName: profileData.firstName,
        healthId: profileData.healthId,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        monthOfBirth: profileData.monthOfBirth,
        password: "Satra@2023", //Change accordingly
        pincode: profileData.pincode,
        profilePhoto: profileImage || profileData.profilePhoto,
        stateCode: profileData.stateCode,
        subdistrictCode: null,
        townCode: null,
        villageCode: null,
        wardCode: null,
        yearOfBirth: profileData.yearOfBirth,
      };
      setLoading(true);
      services
        .create(updateEmailPhoto, postObj,headers)
        .then((response) => {
          toast.success("Email/Photo updated successfully");
          setReRender(!reRender);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Technical Error");
        });
    } else {
      toast.error("Please enter valid email address");
    }
  };
  return (
    <div className="">
      {loading ? <Loader /> : ""}
      {!confirm ? (
        <div className="flex justify-center">
          <div>
            <div className="font-bold">
              Are you sure you want to update email/profile photo?
            </div>
            <div className=" ms-20 mt-5 flex gap-10">
              <div>
                <Radio
                  label="Yes"
                  value={"yes"}
                  onChange={handleRadio}
                  color="blue"
                  name="confirm"
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Radio
                  label="No"
                  value={"no"}
                  onChange={handleRadio}
                  color="blue"
                  name="confirm"
                  crossOrigin={undefined}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-6 ">
          <div className="flex gap-10 justify-start w-full">
            <div className="bg-white dark:bg-slate-850  rounded-lg">
              <Image
                className="abhaupdateImg  rounded-full border-8 bborder-gray-600"
                src={
                  profileImage ||
                  "data:image/png;base64," + profileData.profilePhoto
                }
                alt="photo"
                width={120}
                height={120}
              />
              <div className="ms-2 mt-2 ">
                <DocumentUpload
                  labelContent="Attach"
                  name="profilePhoto"
                  handleChange={handleProfileUpload}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
            </div>
            <div className="w-full mt-3 ">
              <Input
                color="blue"
                crossOrigin={undefined}
                label="Name"
                disabled={true}
                value={profileData.name}
                type="text"
              ></Input>
              <div className="mt-6">
                <Input
                  color="blue"
                  crossOrigin={undefined}
                  label="Email Address"
                  type="text"
                  onChange={(e) => setNewEmail(e.target.value)}
                  value={newEmail}
                ></Input>
              </div>
              <div className="flex mt-6 gap-4">
                <div>
                  <ActionButton
                    buttonText={"Submit"}
                    width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleSubmit}
                  />
                </div>
                <div>
                  <div>
                    <ActionButton
                      buttonText={"Cancel"}
                      width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                      handleSubmit={() => handleMobileEdit("close")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
