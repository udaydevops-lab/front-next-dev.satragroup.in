"use client";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { Input } from "@material-tailwind/react";
import moment from "moment";
import ActionButton from "@/app/_common/button";
import services from "@/app/utilities/services";
import {
  saveUser,
  serviceEntityById,
  updateUser,
} from "@/app/utilities/api-urls";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { getLocalItem } from "@/app/utilities/local";
import Header from "@/app/_components/header";
import {
  alphaNumWithHyphen,
  passwordPattern,
} from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";

interface userPopProps {
  fields: any;
  setFields: Dispatch<SetStateAction<any>>;
  employeeNames: any;
  onEmpChange: any;
  loader: boolean;
  locationData: [];
  roleData: [];
  setLoader: Dispatch<SetStateAction<boolean>>;
  headers: {
    [key: string]: any;
  };
  getAllUserslist: () => void;
  selectInput: (e?: any) => void;
}
const UserPop: React.FC<userPopProps> = ({
  fields,
  setFields,
  headers,
  getAllUserslist,
  employeeNames,
  selectInput,
  onEmpChange,
  loader,
  setLoader,
  roleData,
  locationData,
}) => {
  const [multipleRoles, setMultipleRoles] = useState<any>([]);

  let loginResp: any = JSON.parse(getLocalItem("loginResponse")!);
  const serviceEntityId = loginResp?.serviceEntityId;

  useEffect(() => {
    services
      .get(`${serviceEntityById}${headers?.serviceEntityId}`)
      .then((response: any) => {
        setFields({
          ...fields,
          validFrom: moment(response.data.effectiveStart).format("YYYY-MM-DD"),
          validTo: moment(response.data.effectiveEnd).format("YYYY-MM-DD"),
        });
      });
  }, []);

  const handelFields = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const cleanData = sanitizeInput(e.target.value)
    setFields({
      ...fields,
      [e.target.name]: cleanData,
    });
  };

  // let columns: GridColDef[] = [
  //     {
  //         field: "sno",
  //         headerName: "S.no",
  //         width: 100,
  //         renderCell: (params: any) => {
  //             const rowNumber = multipleRoles.indexOf(params.row) + 1;
  //             return rowNumber;
  //         },
  //     },
  //     {
  //         field: "employeeName",
  //         headerName: "Employee Name",
  //         width: 160,
  //     },
  //     {
  //         field: "role",
  //         headerName: "Role",
  //         width: 100,
  //     },
  //     {
  //         field: "location",
  //         headerName: "Location",
  //         width: 100,
  //     },
  //     {
  //         field: "validFrom",
  //         headerName: "Active From",
  //         width: 100,
  //     },
  //     {
  //         field: "validTo",
  //         headerName: "Active To",
  //         width: 100,
  //     },
  //     {
  //         field: "actions",
  //         headerName: "Actions",
  //         width: 100,
  //         renderCell: (params: any) => (
  //             <>
  //                 <button
  //                     onClick={(e) => {
  //                         e.preventDefault();
  //                         DeleteRow(params.row);
  //                     }}
  //                 >
  //                     <TrashIcon className="text-red-500 w-5 h-5" />
  //                 </button>
  //             </>
  //         ),
  //     },
  // ]

  // const DeleteRow = (row: any) => {
  //     const updatedRows = multipleRoles.filter(
  //         (dataRow: any) => dataRow.sno !== row.sno
  //     );
  //     setMultipleRoles(updatedRows);
  // };

  // const handleAdd = () => {
  //     const newObj = {
  //         sno: multipleRoles?.length + 1,
  //         employeeName: fields?.employeeName?.label,
  //         role: fields?.role?.value,
  //         serviceEntityId: serviceEntityId,
  //         validFrom: fields?.validFrom,
  //         validTo: fields?.validTo,
  //         location: fields?.location?.value,
  //         statusFlag: 1
  //     }
  //     setMultipleRoles((prevData: any) => [...prevData, newObj]);
  // }

  const handleSave = () => {
    setLoader(true);
    if (fields.password !== fields.confirmPassword) {
      toast.error("Passwords did not match");
    } else {
      const userProfileRoleListData = [
        {
          masterRoleSet: [fields?.role?.value],
          serviceEntityId: serviceEntityId,
          validFrom: fields?.validFrom,
          validTo: fields?.validTo,
          locationId: fields?.location?.value,
          statusFlag: 1,
        },
      ];

      let postObj = {
        employeeId: fields.employeeName.value,
        userId: fields.userId ? fields.userId : "",
        username: fields.userName,
        isEmpidAsUsername: 1,
        tempPwd: null,
        confirmPassword: fields.confirmPassword,
        serviceEntityId: serviceEntityId,
        locationId: fields?.location?.value,
        userProfileRoleList: userProfileRoleListData,
        statusFlag: 1,
        generatedBy: null,
      };

      setTimeout(() => {
        services
          .create(saveUser, postObj, headers)
          .then((response: any) => {
            toast.success("User created successfully");
            handleCancel();
            getAllUserslist();
          })
          .catch((err: any) => {
            toast.error("Something went wrong. Please try again");
          });
        setLoader(false);
      }, 2000);
    }
  };

  const handleUpdate = () => {
    setLoader(true);
    let postObj = {
      userId: fields.userId ? fields.userId : "",
      serviceEntityId: serviceEntityId,
      locationId: fields?.location?.value,
      username: fields.userName,
      userProfileRoleList: [
        {
          masterRoleSet: [fields?.role?.value],
          serviceEntityId: serviceEntityId,
          locationId: fields?.location?.value,
        },
      ],
    };
    setTimeout(() => {
      services
        .create(updateUser, postObj, headers)
        .then((response: any) => {
          toast.success("User updated successfully");
          handleCancel();
          getAllUserslist();
        })
        .catch((err: any) => {
          toast.error("Something went wrong. Please try again");
        });
      setLoader(false);
    }, 2000);
  };

  const handleCancel = () => {
    setFields({
      employeeName: { label: "Employee Name *" },
      userName: "",
      password: "",
      confirmPassword: "",
      location: { label: "Location" },
      role: { label: "Role" },
    });
  };

  return (
    <div>
      <div className="w-full mt-5 mb-4 grid grid-cols-4 gap-4">
        <div className="w-full relative">
          <ReactSelectBox
            value={fields.employeeName}
            options={employeeNames}
            isSearchable={true}
            isMultiple={false}
            onChange={onEmpChange}
            onSearchInputChange={selectInput}
            label="Employee Name *"
            optionListWidtsize={true}
            isDisabled={fields?.userId ? true : false}
          />
        </div>

        <div className="w-full">
          <Input
            crossOrigin
            value={fields.userName}
            type="text"
            label="User Name "
            name="userName"
            onChange={handelFields}
            required={true}
            color="blue"
            containerProps={{
              className: "!min-w-[0]",
            }}
          />
          {fields.userName &&
            typeof fields.userName === "string" &&
            !alphaNumWithHyphen.test(fields.userName) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please do not enter special characters!
              </div>
            )}
        </div>
        {fields.userId ? (
          ""
        ) : (
          <>
            <div className="w-full">
              <Input
                crossOrigin
                value={fields.password}
                type="password"
                label="Password "
                name="password"
                onChange={handelFields}
                required={true}
                color="blue"
                containerProps={{
                  className: "!min-w-[0]",
                }}
              />
              {fields.password &&
                typeof fields.password === "string" &&
                !passwordPattern.test(fields.password) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Password should be minimum 8 characters and atleast one
                    character should be capital letter
                  </div>
                )}
            </div>

            <div className="w-full">
              <Input
                crossOrigin
                value={fields.confirmPassword}
                type="text"
                label="Confirm Password "
                name="confirmPassword"
                onChange={handelFields}
                required={true}
                color="blue"
                containerProps={{
                  className: "!min-w-[0]",
                }}
              />
              {fields.confirmPassword &&
                typeof fields.confirmPassword === "string" &&
                !passwordPattern.test(fields.confirmPassword) && (
                  <div className="absolute text-xs ml-1 text-red-500">
                    Password should be minimum 8 characters and atleast one
                    character should be capital letter
                  </div>
                )}
            </div>
          </>
        )}
        <div className="w-full ">
          <Input
            crossOrigin
            value={serviceEntityId}
            type="text"
            label="Service Entity"
            className="pointer-events-none !bg-[#eceff1]"
            color="blue"
            containerProps={{ className: "!min-w-[0]" }}
          />
        </div>
        <div className="w- relative">
          <ReactSelectBox
            value={fields?.location}
            options={locationData}
            isSearchable={true}
            onChange={(e: any) => {
              setFields({
                ...fields,
                location: e,
              });
            }}
            label="Location"
            optionListWidtsize={true}
            isDisabled={fields?.userId ? true : false}
          />
        </div>
        <div className="w-full relative">
          <ReactSelectBox
            value={fields?.role}
            options={roleData}
            isSearchable={true}
            onChange={(e: any) => {
              setFields({
                ...fields,
                role: e,
              });
            }}
            label="Role"
            optionListWidtsize={true}
          />
        </div>
        {/* <DateInput
                        label="Active From"
                        value={fields.activeFrom}
                        onChange={handleActiveFrom}
                    /> */}

        {/* <div>
                    <ActionButton buttonText="Add" handleSubmit={handleAdd} width="w-[120px] py-3" />
                </div> */}
      </div>

      {/* <div>
                <DataGrid
                    autoHeight
                    rows={multipleRoles}
                    columns={columns}
                    getRowId={() => uuidv4()}
                    checkboxSelection={false}
                    initialState={{
                        ...multipleRoles.initialState,
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    density="compact"
                />
            </div> */}

      <div className='"w-full pb-4 text-right flex justify-end gap-4 mt-4'>
        <ActionButton
          buttonText={
            loader ? (
              <>
                <div className="innerBtnloader ml-8"></div>
              </>
            ) : fields?.userId ? (
              "Update"
            ) : (
              "Save"
            )
          }

          disabled={
            fields?.userId ?
              fields.userName &&
                alphaNumWithHyphen.test(fields.userName) &&
                fields.employeeName?.label !== "Employee Name" ? false : true :

              fields.userName &&
                alphaNumWithHyphen.test(fields.userName) &&
                fields.password &&
                passwordPattern.test(fields.password) &&
                fields.confirmPassword &&
                passwordPattern.test(fields.confirmPassword) &&
                fields.employeeName?.label !== "Employee Name"
                ? false
                : true
          } handleSubmit={fields?.userId ? handleUpdate : handleSave}
          width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
        <ActionButton
          buttonText="Reset"
          handleSubmit={handleCancel}
          width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
      </div>
    </div>
  );
};

export default UserPop;
