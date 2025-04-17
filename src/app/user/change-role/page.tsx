"use client";

import React, { FC, useEffect, useState } from "react";
import { CapitalizeName, initialState } from "./utilities";
import { clearLocalItems, getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { getRoleDataById, getRolesBySerEntAndLoc, getServiceEntitysById, saveChangeRole } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import ActionButton from "@/app/_common/button";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import eventBus from "@/app/utilities/eventbus";

const ChangeRole: FC<any> = (props) => {

  const [formData, setFormData] = useState<any>(initialState);
  const loginResp: any = JSON.parse(getLocalItem("loginResponse") || "{}");
  const router = useRouter();

  // instantly get role information
  const getRoleInfo = async () => {
    try {
      const res = await services.get(`${getServiceEntitysById}${loginResp.userId}`);
      const active = res.data.filter((list: any) => list.locationDesc.toLowerCase() === loginResp?.locationDesc.toLowerCase())
      const facilitiesData = res.data.map((list: any) => list.locationDesc.toLowerCase() === loginResp?.locationDesc.toLowerCase()
        ? { ...list, isActive: 1 }
        : { ...list, isActive: 0 }
      )
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        facilities: facilitiesData,
        activeLocation: active[0] || {},
      }));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.statusMessage || "Something went wrong, please try again."
      );
    }
  };

  //Change Facilitie functiom
  const getChangeFacilitie = async (data: any) => {
    // const updatedFacilities = formData?.facilities.map((list: any) =>
    //   list.userLocAssignId === row.userLocAssignId
    //     ? { ...list, isActive: 1 }
    //     : { ...list, isActive: 0 }
    // );
    // setFormData((prevFormData: any) => ({
    //   ...prevFormData,
    //   facilities: updatedFacilities,
    //   activeLocation: row,
    // }));
    // getRolesList(row, "new");
    const res = await services.get(
      `${getRolesBySerEntAndLoc}${loginResp?.username}&serviceEntityId=${data?.serviceEntityId}&locationId=${data?.locationId}`
    );
    if (res.data.length > 0) {
      const updatedFacilities = formData?.facilities.map((list: any) =>
        list.userLocAssignId === data.userLocAssignId
          ? { ...list, isActive: 1 }
          : { ...list, isActive: 0 }
      );
      const updatedRoles = res?.data?.map((list: any) =>
        list.roleId === data.roleId ? { ...list, isActive: 1 } : { ...list, isActive: 0 }
      );

      setFormData((prevFormData: any) => ({
        ...prevFormData,
        facilities: updatedFacilities,
        activeLocation: data,
        roleList: updatedRoles,
      }));
    } else {
      toast.error("No Roles available")
    }
  };

  // set Facilitie primary
  const activeFacilitie = async (data: any) => {
    const res = await services.get(
      `${getRolesBySerEntAndLoc}${loginResp?.username}&serviceEntityId=${data?.serviceEntityId}&locationId=${data?.locationId}`
    );
    if (res.data.length > 0) {
      const updatedFacilities = formData?.facilities.map((list: any) =>
        list.userLocAssignId === data.userLocAssignId
          ? { ...list, isActive: 1, isLocationPrimary: 1 }
          : { ...list, isActive: 0, isLocationPrimary: 0 }
      );
      const activeLocationData = { ...data, isLocationPrimary: 1 }
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        facilities: updatedFacilities,
        activeLocation: activeLocationData,
      }));

    } else {
      toast.error("No Roles available")
    }
    console.log(res.data)
  }

  //get Roles List function
  const getRolesList = async (data: any, type: string) => {
    const res = await services.get(
      `${getRolesBySerEntAndLoc}${loginResp?.username}&serviceEntityId=${data?.serviceEntityId}&locationId=${data?.locationId}`
    );
    const updatedRoles = res.data.map((list: any) => ({ ...list, isActive: 0 }));
    const updatedOldRoles = res.data.map((list: any) =>
      list.roleDes.toLowerCase() === loginResp?.rollDesc.toLowerCase()
        ? { ...list, isActive: 1 }
        : { ...list, isActive: 0 }
    );
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      roleList: type === "old" ? updatedOldRoles : updatedRoles,
    }));
  };

  //Change Role function
  const getChangeRole = (row: any) => {
    const updatedRoles = formData?.roleList.map((list: any) =>
      list.roleId === row.roleId ? { ...list, isActive: 1 } : { ...list, isActive: 0 }
    );
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      roleList: updatedRoles,
      newRole: true
    }));
  };

  // Submit button function
  const onSubmit = () => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      buttonStatus: true,
    }));
    let roleidVal: any = formData?.roleList.filter((list: any) => list.isActive === 1)
    let userLocationAssignSetData = [{
      locationId: formData.activeLocation.locationId,
      locationPrimary: formData.activeLocation.isLocationPrimary,
      userId: formData.activeLocation.userId,
      userLocAssignId: formData.activeLocation.userLocAssignId
    }];
    let postObj = {
      username: loginResp?.username,
      password: formData?.password,
      roleId: roleidVal[0].roleId,
      serviceEntityId: formData?.activeLocation?.serviceEntityId,
      locationId: formData?.activeLocation?.locationId,
      userLocationAssignSet: userLocationAssignSetData
    }
    services
      .create(saveChangeRole, postObj)
      .then((response: any) => {
        setTimeout(() => {
          setLocalItem("loginResponse", JSON.stringify(response.data));
          if (response.data.rollDesc == "Front Office") {
            router.push("/frontdesk/dashboard");
            router.refresh()
          } else if (response.data.rollDesc == "DOCTOR") {
            router.push("/doctor/dashboard");
            router.refresh()
          } else if (response.data.rollDesc == "Nurse") {
            router.push("/nurse/dashboard");
            router.refresh()
          } else if (response.data.rollDesc == "laboratory") {
            router.push("/lab/dashboard");
            router.refresh()
          } else if (response.data.rollDesc == "Procedures") {
            router.push("/procedures/dashboard");
            router.refresh()
          } else if (response.data.rollDesc == "Radiology") {
            router.push("/radiology/dashboard");
            router.refresh()
          } else {
            router.replace("/login");
            router.refresh()
            clearLocalItems();
          }
          // console.log(response.data.roleId)
          getroleDataByIdFun(response.data)
          toast.success("Role changed successfully");
          setFormData((prevFormData: any) => ({
            ...prevFormData,
            buttonStatus: false,
            popup: false
          }));
          props.changeRolePopupValue()
          eventBus.dispatch("changeRole", response.data);
        }, 1000);
      })
      .catch((error: any) => {
        console.log(error.message)
        toast.error("Something went wrong");
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          buttonStatus: false,
        }));
        props.changeRolePopupValue()
      })
  }

  // getting data by using role id functionality
  const getroleDataByIdFun = async (roleData: any) => {
    try {
      // const response: any = await services.get(`${getRoleDataById}${roleId}`)
      const response: any = await services.get(`${getRoleDataById}?roleId=${roleData.roleId}&serviceEntityId=${roleData.serviceEntityId}&locationId=${roleData.locationId}`)
      setLocalItem("roleInfo", JSON.stringify(response.data))
      // console.log(response.data)
    } catch (error) {
      console.log(error)
      localStorage.removeItem("roleInfo");
    }
  }

  //Cancel button function
  const onCancel = () => {
    console.log("Cancel");
    props.changeRolePopupValue()
  };

  // open password function 
  const onSubmitchange = () => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      popup: true,
      password: ""
    }));
  };

  useEffect(() => {
    getRoleInfo();
    getRolesList(loginResp, "old")
  }, []);
  return (
    <>
      <div className="w-full">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-lg font-semibold text-black">
            {formData?.activeLocation?.serviceEntityDesc || "No Active Location"}
          </h2>
        </div>

        <div className="flex gap-6">
          {/* Facilities Section */}
          <div className="w-1/2">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Facilities</h3>
            <div
              className={`space-y-2 ${formData?.facilities?.length > 3 ? "h-[160px] overflow-y-auto" : ""}`}
            >
              {formData?.facilities && formData?.facilities?.length ? (
                formData.facilities.map((list: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition ${list.isActive === 1
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                  >
                    <div className="w-full flex justify-between">
                      <span className="w-[90%]" onClick={() => {
                        list.isActive !== 1 &&
                          getChangeFacilitie(list)
                      }
                      }>{CapitalizeName(list?.locationDesc)}</span>
                      <span className="w-auto" onClick={() => activeFacilitie(list)}> {list?.isLocationPrimary === 0 ?
                        <StarIcon className="w-5 h-5 text-gray-400" />
                        :
                        <StarIcon className="w-5 h-5 text-yellow-600" />
                      }
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No facilities available</p>
              )}
            </div>
          </div>

          {/* Role Section */}
          <div className="w-1/2">
            <h3 className="text-mg font-semibold text-gray-900 mb-4">User Role</h3>
            <div
              className={`space-y-2 ${formData?.roleList?.length > 3 ? "h-[160px] overflow-y-auto" : ""}`}
            >
              {formData?.roleList && formData?.roleList?.length ? (
                formData.roleList.map((list: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition ${list.isActive === 1
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                    onClick={() => {
                      list.isActive !== 1 && getChangeRole(list)
                    }
                    }
                  >
                    <span> {CapitalizeName(list?.roleDes)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No roles available</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <ActionButton
            buttonText="CHANGE ROLE"
            width="w-auto text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={onSubmitchange}
            disabled={!formData?.newRole}
          />
          <ActionButton
            buttonText="CANCEL"
            handleSubmit={onCancel}
            width="w-auto text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>
      <ReactCommonDialog
        dialogtitle={"Enter Password"}
        open={formData.popup}
        size={'sm'}
        handler={() => {
          // setPopup({
          //     open: false
          // })
        }}
        popupClose={() => {
          setFormData({
            ...formData,
            popup: false
          })
        }}
        Content={
          <>
            <Input
              crossOrigin
              label="Password"
              name="password"
              onChange={(e) => setFormData((prevFormData: any) => ({
                ...prevFormData,
                password: e.target.value,
              }))}
              type={formData.showPassword ? "password" : "text"}
              className="mb-6"
              value={formData.password}
            />
            <div
              className="absolute top-5 right-6"
              onClick={() => setFormData((prevFormData: any) => ({
                ...prevFormData,
                showPassword: !formData.showPassword,
              }))}
            >
              {formData.showPassword ? (
                <VisibilityOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                <VisibilityIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              )}
            </div>
            <div className="w-full flex justify-end mt-2">
              <ActionButton
                buttonText={
                  formData.buttonStatus ?
                    <div className='w-full flex justify-center items-center'>
                      <div className='innerBtnloader'></div>
                    </div> : "SUBMIT"
                }
                width="w-[100px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={onSubmit}
                disabled={formData.password.length >= 3 ? false : true}
              />
            </div>

          </>
        }
      />
    </>
  );
};

export default ChangeRole;
