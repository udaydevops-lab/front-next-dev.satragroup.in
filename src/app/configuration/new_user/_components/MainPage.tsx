"use client";
import React, { useEffect, useReducer } from "react";
import { saveUserMasterData, useGroup, userEmp } from "./userjson";
import { MasterHeading } from "../../_components";

import UserMasterForm from "./UserMasterForm";
import FacilityAssignment from "./FacilityAssignment";
import { appReducer, initialState } from "./ReducerFun";
import { ApiRequestMethod } from "@/app/_commonfeatures/ApiRequestFun";
import {
  FacilityAssignmentHistoryApi,
  GroupuserMasterData,
  GroupuserMasterDataDropDown,
  empDetailsById,
  empHistory,
  getAllUsers,
  getEmployeeNames,
  getLocation,
  getNewAllUsersMaster,
  getServiceEntity,
  getUserByIdapiData,
} from "@/app/utilities/api-urls";
import SavegetUsermastergrid from "./SavegetUsermastergrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import { getLocalItem } from "@/app/utilities/local";
import HistoryGrid from "./HistoryGrid";
import services from "@/app/utilities/services";

const MainPage = (props: any) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // from below function we have the set key [label,value] on selectbox
  const changeLabelVal = (list: any, key: string) => {
    const data: any = list.data ? list.data : list;
    const result = data
      .map((list: any) => ({
        ...list,
        label: list[key],
        value: list[key],
      }))
      .filter((list: any) => list[key]);
    return result;
  };

  // from below function we have the set api on selectbox
  const selectDataFun = async (key: string, apiUrl: any, labelKey: string) => {
    const response: any = await ApiRequestMethod({
      method: "GET",
      url: apiUrl,
    });
    const responseResult: any = changeLabelVal(response.data, labelKey);
    //   console.log(responseResult)
    dispatch({
      type: "getData",
      payload: {
        [`${key}`]: responseResult,
      },
    });
    if(key=="userGroupData"){
      dispatch({
        type: "getData",
        payload: {
          userGroupCopyData: responseResult,
        },
      });
    }
  };

  // get the saved usermaster grid from below function api
  const getFun = async () => {
 services
      .get(getNewAllUsersMaster)
      .then((response) => {
        dispatch({
            type: "getData",
            payload: {
              saveUserMasterresult: response.data
                ? response.data?.map((item: any) => {
                    return {
                      ...item,
                      status: item.statusFlag == 1 ? "Active" : "Inactive",
                    };
                  })
                : [],
            },
          });
      }); //await ApiRequestMethod({ method: "GET", url: getNewAllUsersMaster })
    
   
  };

  // from the below function we get the history details when edit button hits
  const GetHistoryDataListfun = async (userId: any) => {
    let mainUrl: any = FacilityAssignmentHistoryApi + `${userId}`;
    const getHistorList: any = await ApiRequestMethod({
      method: "GET",
      url: mainUrl,
    });
    dispatch({
      type: "fieldVal",
      payload: {
        hxPopup: true,
      },
    });
    dispatch({
      type: "getData",
      payload: {
        historyData: getHistorList?.data?.data
          ? [...getHistorList?.data?.data]
          : [],
      },
    });
  };
const onselectPrority = async (editData: any) => {
        // let urlbyId: any = getUserById + `${editData.userId}`//orignial
        let urlByUserId: any = getUserByIdapiData + `${editData.userId}` // testing

        const getUserByIdData: any = await ApiRequestMethod({ method: 'GET', url: urlByUserId })
        const empDatabyEmpId: any = await ApiRequestMethod({ method: "GET", url: `${empDetailsById}${getUserByIdData.data.data[0].empId}` })

        const mergedArray: any = state.getApi.userGroupData.map((group: any) => {
            const userProfile = getUserByIdData?.data?.data[0]?.userProfileGroupList.find(
                (profile: any) => profile.groupId === group.groupId
            );
            return {
                ...group,
                userGroupId: userProfile ? userProfile.userGroupId : null,
                generatedBy: userProfile ? userProfile.generatedBy : null,
                serviceEntityDesc: userProfile ? userProfile.serviceEntityDesc : null,
                locationDesc: userProfile ? userProfile.locationDesc : null,
                generatedId: userProfile ? userProfile.generatedId : null,
                generatedDate: userProfile ? userProfile.generatedDate : null,
                isGroupPrimary: userProfile ? userProfile.isGroupPrimary : null
            };
        }).filter((list: any) => list.userGroupId);
         
        dispatch({
            type: 'fieldVal',
            payload: {
                employeeId: getUserByIdData.data.data[0].employeeId,
                empName: getUserByIdData.data.data[0].fullName,
                empCode: empDatabyEmpId.data.data[0].employeCode,
                empDepartment: empDatabyEmpId.data.data[0].departmentDescription,
                empOrg: empDatabyEmpId.data.data[0].serviceEntityDesc,
                empPrimaryLocation: empDatabyEmpId.data.data[0].locationDesc,
                empProfiletype: empDatabyEmpId.data.data[0].employeTypeDesc,
                userName: { label: getUserByIdData.data.data[0].userName },
                userId: editData.userId,
                serviceEntityId: editData.serviceEntityId,
                locationId: editData.locationId
            }
        })
        let index=[...getUserByIdData?.data?.data[0]?.userProfileLocationList].findIndex((item:any)=>item.isLocationPrimary==1)
        console.log(index)
        let data=getUserByIdData?.data?.data[0]?.userProfileLocationList[index].locationId
        console.log("Dataaaa",data)
        dispatch({
            type: 'getData',
            payload: {
                orgFacilityStore: [...getUserByIdData?.data?.data[0]?.userProfileLocationList],
                historyData: getUserByIdData?.data?.data,
                userGroupTable: mergedArray.filter((item:any)=>item.locationId==data),
                userGroupTableCopy: mergedArray
            }
        })

    }
  useEffect(() => {
    dispatch({
      type: "fieldVal",
      payload: {
        empInfo: props.empInfo,
      },
    });
    getFun();
    selectDataFun("empData", getAllUsers, "userName");
    // selectDataFun('empData', getEmployeeNames, 'desc')
    selectDataFun("orgnizationData", getServiceEntity, "desc");
    // selectDataFun('facilityData', getLocation, 'desc')
    selectDataFun("userGroupData", GroupuserMasterDataDropDown, "groupName");

    // geting employee name
    const storedLoginResponse = getLocalItem("loginResponse");
    try {
      let empname = storedLoginResponse
        ? JSON.parse(storedLoginResponse).employeename
        : "";
      dispatch({
        type: "fieldVal",
        payload: {
          loginUser: empname,
        },
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      dispatch({
        type: "fieldVal",
        payload: {
          loginUser: "",
        },
      });
    }

    return () => {
      getFun();
      selectDataFun("empData", getEmployeeNames, "userName");
      selectDataFun("orgnizationData", getServiceEntity, "desc");
      selectDataFun("facilityData", getLocation, "desc");
      selectDataFun("userGroupData", GroupuserMasterDataDropDown, "groupName");
    };
  }, []);

  // console.log(state)
  return (
    <>
      <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
        <MasterHeading heading={"User Master"} />

        <div className="w-full">
          <UserMasterForm state={state} dispatch={dispatch} onselectPrority={onselectPrority}/>

          <FacilityAssignment
            state={state}
            dispatch={dispatch}
            getFun={getFun}
            onselectPrority={onselectPrority}
            GetHistoryDataListfun={GetHistoryDataListfun}
          />
        </div>
      </div>

      <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke mt-4">
        <MasterHeading heading={"User Master Worklist"} />
        <SavegetUsermastergrid
          state={state}
          disptach={dispatch}
          getFun={getFun}
        />
      </div>
      {/* History Dailog box */}

      <ReactCommonDialog
        open={state.field.hxPopup}
        handler={() => {
          dispatch({
            type: "fieldVal",
            payload: {
              hxPopup: false,
            },
          });
          // dispatch({
          //     type: "getData",
          //     payload: {
          //         historyData: []
          //     }
          // })
        }}
        popupClose={() => {
          dispatch({
            type: "fieldVal",
            payload: {
              hxPopup: false,
            },
          });
          // dispatch({
          //     type: "getData",
          //     payload: {
          //         historyData: []
          //     }
          // })
        }}
        Content={<HistoryGrid state={state} dispatch={dispatch} />}
      />
    </>
  );
};

export default MainPage;
