import ActionButton from "@/app/_common/button";
import { ApiRequestMethod } from "@/app/_commonfeatures/ApiRequestFun";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  userMastergroupAssignuserblockunblock,
  userMastergroupSaveapie,
} from "@/app/utilities/api-urls";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "react-toastify";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import CheckboxMui from "@/app/check-box";

interface AssignUserAddGridprops {
  state: any;
  dispatch: Dispatch<SetStateAction<any>>;
  getuserGroupData: () => void;
  editUserdata: any;
}

const AssignUserAddGrid: React.FC<AssignUserAddGridprops> = ({
  state,
  dispatch,
  getuserGroupData,
  editUserdata,
}) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
    },
    {
      field: "empName",
      headerName: "Emp Name",
      width: 150,
    },
    {
      field: "empCode",
      headerName: "Emp Code",
      width: 120,
    },
    {
      field: "empDepartment",
      headerName: "Emp Department",
      width: 150,
    },
    {
      field: "empProfiletype",
      headerName: "Profile Type",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params: any) => (
        <>
          <div className="flex justify-end cursor-pointer">
            {params.row.userGroupId ? (
              <div
                className="cursor-pointer w-[120px]"
                onClick={() => activeInactiveuser(params.row)}
              >
                {params.row.statusFlag === 1 ? (
                  <ActiveIcon className="cursor-pointer" />
                ) : (
                  <InactiveIcon className="cursor-pointer float-left w-5 h-4" />
                )}
              </div>
            ) : (
              <TrashIcon
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() => deleteDatagridData(params.row.empId)}
              />
            )}
          </div>
        </>
      ),
    },
    {
      field: "isPrimary",
      headerName: "Is Group Primary",
      width: 180,
      renderCell: (params: any) => (
        <>
          <CheckboxMui
            checked={params.row.isGroupPrimary == 1}
            handleChange={() => {
              console.log("paramsRow", params.row);
              if (params.row.isGroupPrimary == 1 && params.row.isNew == 0) {
                toast.error(
                  "Unable to remove the primary group. Please set another existing group as the primary group first."
                );
                return;
              }
              handleCheckBox(params.row);
            }}
          />
        </>
      ),
    },
  ];

  const handleCheckBox = (data: any) => {
    let tabData = state.addUserdatatable.map((list: any) => {
      if (list.empId === data.empId) {
        return { ...list, isGroupPrimary: list.isGroupPrimary == 0 ? 1 : 0 };
      }
      return list;
    });
    dispatch({
      type: "addUsers",
      payload: {
        addUserdatatable: tabData,
      },
    });
  };
  const activeInactiveuser = async (data: any) => {
    let statusflaguser: any = data.statusFlag === 1 ? 0 : 1;
    let obJ: any = {
      statusFlag: statusflaguser,
      userGroupId: data.userGroupId,
    };

    const response: any = await ApiRequestMethod({
      method: "POST",
      url: userMastergroupAssignuserblockunblock,
      postObj: obJ,
    });
    if (response.success) {
      toast.success(`${response?.data?.data?.statusMessage}`);
      editUserdata(data.groupId);
    } else {
      toast.error("Something went wrong..");
    }
  };

  const deleteDatagridData = useCallback(
    (dataId: any) => {
      dispatch({
        type: "addUsers",
        payload: {
          addUserdatatable: state.addUserdatatable.filter(
            (list: any) => list.empId !== dataId
          ),
        },
      });
    },
    [state.addUserdatatable]
  );

  const saveUserGroupfun = async () => {
    dispatch({
      type: "fieldVal",
      payload: {
        loader: true,
      },
    });
    let roleOgFacilityFinal: any = state.userGroupRoleAssignmentTable.map(
      (list: any) => ({
        roleId: list.roleId,
        roleDesc: list.roleDesc,
        serviceEntityId: list.serviceEntityId,
        locationId: list.locationId,
        serviceEntityDesc: list.serviceEntityDesc,
        locationDesc: list.locationDesc,
        activeFromDate: moment(list.activeFromDate).format("YYYY-MM-DD"),
        roleGroupId: list.sn ? null : list.roleGroupId ? list.roleGroupId : null,
        statusFlag: list.statusFlag,
        isRolePrimary: list.isRolePrimary,
      })
    );
    const primaryRecord =state.userGroupRoleAssignmentTable.filter((item:any)=>item.isRolePrimary)[0]
    let PostObj: any[];

    let Obj: any = {
      groupId: state.field.groupId ? state.field.groupId : null,
      groupName: state.field.usergroupName,
      groupCode: state.field.usergroupCode,
      serviceEntityId:primaryRecord.serviceEntityId,
      locationId:primaryRecord.locationId,
      locationDesc:primaryRecord.locationDesc,
      serviceEntityDesc:primaryRecord.serviceEntityDesc,
      roleIds: [...roleOgFacilityFinal],
      generatedDate: "",
      updatedDate: "",
      generatedId: null,
      generatedBy: "",
      updatedBy: "",
      ipAddress: "",
      statusFlag: 1,
      userGroupAssignSet:
        state?.addUserdatatable && state?.addUserdatatable.length > 0
          ? [
            ...state?.addUserdatatable?.map((list: any) => ({
              isGroupPrimary: list.isGroupPrimary,
              userId: list.userId,
              statusFlag: list.statusFlag,
              serviceEntityId:primaryRecord.serviceEntityId,
              locationId:primaryRecord.locationId,
              locationDesc:primaryRecord.locationDesc,
              serviceEntityDesc:primaryRecord.serviceEntityDesc,
              userGroupId: list.userGroupId ? list.userGroupId : null,
            })),
          ]
          : [],
    };
    PostObj = [{ ...Obj }];
    console.log(Obj)
    const response: any = await ApiRequestMethod({
      method: "POST",
      url: userMastergroupSaveapie,
      postObj: PostObj,
    });
    if (response.success) {
      setTimeout(() => {
        toast.success(
          state.field.groupId
            ? "Successfully updated the user group master data..."
            : "Successfully added the user group master data..."
        );

        if (state.field.groupId) {
          editUserdata(state.field.groupId);
          dispatch({
            type: "fieldVal",
            payload: {
              loader: false,
            },
          });
        } else {
          dispatch({
            type: "fieldVal",
            payload: {
              loader: false,
              usergroupCode: "",
              usergroupName: "",
              groupId: null,
            },
          });

          dispatch({
            type: "userGroupRoleAssignmentStore",
            payload: {
              userGroupRoleAssignmentTable: [],
            },
          });

          dispatch({
            type: "addUsers",
            payload: {
              addUserdatatable: [],
            },
          });
        }

        getuserGroupData();
      }, 2000);
    } else {
      if (response.error.response.data.statusMessage) {
        toast.error(response.error.response.data.statusMessage);
      } else {
        toast.error("Something went wrong");
      }
      dispatch({
        type: "fieldVal",
        payload: {
          loader: false,
          usergroupCode: "",
          usergroupName: "",
          groupId: null,
        },
      });
      getuserGroupData();
    }
  };

  const allClear = () => {
    dispatch({
      type: "userGroupRoleAssignmentStore",
      payload: {
        userGroupRoleAssignmentTable: [],
      },
    });
    dispatch({
      type: "fieldVal",
      payload: {
        usergroupCode: "",
        usergroupName: "",
        groupId: null,
      },
    });

    dispatch({
      type: "addUsers",
      payload: {
        addUserdatatable: [],
      },
    });
    dispatch({
      type: 'fieldVal',
      payload: {
        empRole: {
          label: "Role"
        },
        empUser: "",
        // userGroupRoleOrg: {
        //     label: "Organization"
        // },
        userGroupRoleFacility: {
          label: "Facility"
        }
      }
    })
  };

  return (
    <>
      <div className="data-grid-newThem w-full capi">
        <ReactDatagrid rows={state.addUserdatatable} columns={columns} />
      </div>

      <div className="w-full flex justify-end gap-4 mt-3">
        <ActionButton
          buttonText={
            state.field.loader ? (
              <div className="w-full flex justify-center items-center">
                <div className="innerBtnloader"></div>
              </div>
            ) : state.field.groupId ? (
              "Update"
            ) : (
              "Save"
            )
          }
          handleSubmit={saveUserGroupfun}
          width="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={
            state.userGroupRoleAssignmentTable.length > 0 &&
              state.field.usergroupName &&
              state.field.usergroupCode
              ? //  &&
              // state.addUserdatatable.length>0 ?
              false
              : true
          }
        />

        <ActionButton
          buttonText="Reset"
          handleSubmit={allClear}
          width="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
      </div>
    </>
  );
};

export default AssignUserAddGrid;
