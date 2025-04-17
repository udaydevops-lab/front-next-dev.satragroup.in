"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
// import UserPop from './userPop';
import services from "@/app/utilities/services";
import {
  deleteUser,
  getAllUsers,
  getEmployeeNames,
  getLocation,
  getRoles,
  getUserById,
  updateUserStatusflag,
} from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { toast } from "react-toastify";
import moment from "moment";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ParameterHeading from "../component/ParameterHeading";
const UserPop = dynamic(() => import("./userPop"));

export default function UserMaster() {
  const myDiv: any = useRef();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [employeeNames, setEmployeeNames] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [locationData, setLocationData] = useState<any>([]);
  const [roleData, setRoleData] = useState<any>([]);
  const [modaloc, setModaloc] = useState<any>({
    active: false,
    delete: false,
  });
  const [fields, setFields] = useState<any>({
    employeeName: { label: "Employee Name" },
    role: null,
    location: null,
  });

  const loginData = JSON.parse(getLocalItem("loginResponse")!);
  const headers = getHeaderResponse()

  const selectInput = (e: any) => {
    setLoader(true);
    {
      e.target.value.length > 0
        ? services
          .get(`${getEmployeeNames}${e.target.value}`, headers)
          .then((response: any) => {
            setLoader(false);
            let data = response.data.map((item: any) => {
              return {
                ...item,
                label: item.name,
                value: item.id,
              };
            });
            setEmployeeNames(data);
          })
          .catch((err: any) => {
            setLoader(false);
            console.log(err.message);
          })
        : "";
    }
  };

  const onEmpChange = (e: any) => {
    setFields({ ...fields, employeeName: e });
  };

  const editUser = (rowData: any) => {
    const url = `${getUserById}${rowData?.userId}`;
    services
      .get(url)
      .then((res: any) => {
        setLoader(false);
        const data = res.data[0];
        const trimmedFullName = data?.fullName.replace(/\s+/g, " ").trim();
        selectInput({ target: { value: trimmedFullName } });
        let seletedLocation = locationData.filter(
          (item: any) => item?.value === data?.locationId
        )[0];
        setFields({
          employeeName: {
            value: data?.empId,
            label: data?.fullName,
          },
          role: {
            value: data?.roleId,
            label: data?.roleDes,
          },
          userId: data.userId,
          userName: data?.userName,
          location: seletedLocation,
        });
      })
      .catch((error: any) => {
        console.log(error.message);
      });
    myDiv.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
      renderCell: (params: any) => {
        const rowNumber = allUsers.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "userId", headerName: "User Id", width: 70 },
    { field: "userName", headerName: "User Name", width: 150 },
    {
      field: "createdDate",
      headerName: "Generated Date",
      width: 140,
      renderCell: (params: any) => {
        return moment(params?.row?.generatedBy).format("DD-MM-YYYY");
      },
    },
    {
      field: "updatedDate",
      headerName: "Updated Date",
      width: 120,
      renderCell: (params: any) => {
        return moment(params?.row?.updatedDate).format("DD-MM-YYYY");
      },
    },
    {
      field: "userLogedIn",
      headerName: "Login Status",
      width: 110,
      renderCell: (params: any) => {
        const loginStatus =
          params?.row?.userLogedIn === 0
            ? "Logged out"
            : params?.row?.userLogedIn === 1
              ? "Logged in"
              : "";
        return loginStatus;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: any) => (
        <div>
          {params.row.status === "Active" ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Inactive</div>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <div className="flex gap-2 ml-[-10px]">
          {params.row.status === "Active" ? (
            <PencilIcon
              className="text-blue-500 mt-4 w-5 h-5 cursor-pointer me-2"
              onClick={() => {
                editUser(params.row);
                const section = document.getElementById('sectionRef');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          ) : (
            <div className="ml-7"></div>
          )}
          {/* </button> */}
          <div
            onClick={(e: any) => {
              handelActive(params.row);
            }}
          >
            {params.row.statusFlag == 1 ? <ActiveIcon /> : <InactiveIcon />}
          </div>
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      renderCell: (params: any) => (
        <>
          <TrashIcon
            className="text-red-500 w-5 h-5 cursor-pointer ml-3"
            onClick={(e: any) => {
              setModaloc({ ...modaloc, delete: true, id: params.row.userId });
            }}
          />
        </>
      ),
    },
  ];

  const handelActive = (rowData: any) => {
    try {
      const id = rowData.userId;
      const statusFlag =
        rowData.statusFlag === 1 || rowData.statusFlag === null ? 0 : 1;
      const message =
        rowData.statusFlag === 0
          ? "Successfully activated the record"
          : "Successfully inactivated the record";
      setLoader(true);
      services
        .get(`${updateUserStatusflag}${id}/${statusFlag}`)
        .then((response: any) => {
          setLoader(false);
          toast.success(message);
          getAllUserslist();
          // setModaloc({ ...modaloc, delete: false })
        })
        .catch((e: any) => {
          console.log(e.message);
        });
    } catch (error: any) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const getAllUserslist = () => {
    setLoader(true);
    services
      .get(getAllUsers, headers)
      .then((response: any) => {
        setLoader(false);
        let data = response.data.map((item: any) => {
          return {
            ...item,
            status: item.statusFlag == 1 ? "Active" : "Inactive",
          };
        });
        setAllUsers(data);
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error.message);
        toast.error(error.message);
      });
  };

  const onDelete = () => {
    setLoader(true);
    const id = modaloc.id;
    try {
      services.create(`${deleteUser}/${id}`, {}).then((response: any) => {
        setTimeout(() => {
          setLoader(false);
          toast.success("Successfully deleted the record");
          getAllUserslist();
          setModaloc({ ...modaloc, delete: false });
        }, 2000);

      });
    } catch (err: any) {
      setTimeout(() => {
        setLoader(false);
        console.log(err.message);
        toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
      }, 2000);

    }
  };

  const MethodKeys = (data: any) => {
    return data.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.desc,
    }));
  };

  useEffect(() => {
    const fetchLocationData = services.get(getLocation);
    const fetchRoleData = services.get(getRoles);
    Promise.allSettled([fetchLocationData, fetchRoleData]).then(
      (results: any) => {
        results.forEach((result: any, index: number) => {
          if (result.status === "fulfilled") {
            switch (index) {
              case 0:
                const mappedLocationData = MethodKeys(result.value.data);
                setLocationData(mappedLocationData);
                break;
              case 1:
                const mappedRoleData = MethodKeys(result.value.data);
                setRoleData(mappedRoleData);
                break;
              default:
                break;
            }
          }
        });
      }
    );
    getAllUserslist();
  }, []);

  return (
    <div
      ref={myDiv}
      className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke"
    >
      <ParameterHeading
        title="User"
      />

      <UserPop
        employeeNames={employeeNames}
        selectInput={selectInput}
        onEmpChange={onEmpChange}
        fields={fields}
        setFields={setFields}
        headers={headers}
        getAllUserslist={getAllUserslist}
        loader={loader}
        setLoader={setLoader}
        locationData={locationData}
        roleData={roleData}
      />

      <div className="px-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <ReactDatagrid
          rows={allUsers}
          columns={columns}
        />
      </div>
      <ReactCommonDialog
        open={modaloc.delete}
        handler={() => setModaloc({ ...modaloc, delete: false })}
        popupClose={() => setModaloc({ ...modaloc, delete: false })}
        Content={<DeletePopupMsg
          btnYesFun={onDelete}
          btnNoFun={() => setModaloc({ ...modaloc, delete: false })}
          content={<>
            Do you want to Delete this record?
            <div className=" text-gray-500">
              <small>
                <strong>Note: </strong>
                Once you Delete this record, you cannot rollback
              </small>
            </div>
          </>}
          loader={loader}
        />}
      />
    </div>
  );
}
