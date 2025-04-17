import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import ActionButton from '@/app/_common/button';
import CheckboxMui from '@/app/_common/checkbox';
import { Checkbox } from '@material-tailwind/react';
import services from '@/app/utilities/services';
import { toast } from 'react-toastify';
import { deleteRoleScreen, getRoleDataById, saveRoleConfig } from '@/app/utilities/api-urls';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { getLocalItem, setLocalItem } from '@/app/utilities/local';
import popUp from '@/app/lab/laboratory-worklist/_components/popUp';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';

interface RoleConfigurationGridProps {
    gridData: any[];
    setGridData: React.Dispatch<React.SetStateAction<any[]>>;
    role: any;
    landingpage: any;
    handelReset: any;
    gridNewData: any[];
    module: any;
    roleAssignid: any;
    getAllRoleByIdFun: any;
    facility: any,
    organization: any,
}

const RoleConfigurationGrid: React.FC<RoleConfigurationGridProps> = ({ gridData, setGridData, role, gridNewData, landingpage, handelReset, module, roleAssignid, getAllRoleByIdFun, facility, organization }) => {
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [initialGridData, setInitialGridData] = useState<any>();
    const [showDeletePopupInfo, setShowDeletePopupInfo] = useState<any>({
        popup: false,
        row: null,
    });

    const handleCheckboxChange = (id: number, field: string, checked: boolean) => {
        const updatedData = gridData.map((item: any) => {
            if (item.id === id) {
                if (field === 'View' && !checked) {
                    // Uncheck all related fields when View is unchecked
                    return {
                        ...item,
                        View: 0,
                        ...(item.Save !== undefined && { Save: 0 }),
                        ...(item.Update !== undefined && { Update: 0 }),
                        ...(item.Delete !== undefined && { Delete: 0 }),
                        ...(item.Print !== undefined && { Print: 0 }),
                    };
                } else {
                    // Otherwise, just update the specified field
                    return {
                        ...item,
                        [field]: checked ? 1 : 0,
                    };
                }
            }
            return item;
        });
        setGridData(updatedData);
        const updatedDataJson = JSON.stringify(updatedData);
        setIsSaveEnabled(updatedDataJson !== initialGridData);
    };

    // console.log(facility, organization)
    // save button function
    const handleSave = () => {

        const loginResponse: any = JSON.parse(getLocalItem("loginResponse")!)
        const roleId = loginResponse?.roleId
        const rowId = { id: role.value }
        const postObj = {
            roleAssignId: roleAssignid ? roleAssignid : null,
            roleId: role.value,
            roleDes: role.label,
            defaultScreenName: landingpage.label,
            moduleName: module.label,
            serviceEntityDesc: organization.desc,
            serviceEntityId: organization.id,
            locationDesc: facility.desc,
            locationId: facility.id,
            //  rolePrivilege: gridNewData.map(item => {
            rolePrivilege: gridData.map(item => {
                const privileges = [
                    item.Save === 1 ? `${item.module}-${item.txScreen}-Sv` : null,
                    item.View === 1 ? `${item.module}-${item.txScreen}-Rd` : null,
                    item.Update === 1 ? `${item.module}-${item.txScreen}-Ud` : null,
                    item.Delete === 1 ? `${item.module}-${item.txScreen}-Dl` : null,
                    item.Print === 1 ? `${item.module}-${item.txScreen}-Pr` : null,
                ].filter(Boolean).join(',');

                let privilegeObject: any = {
                    module: item.module,
                    txScreen: item.txScreen,
                    routingPath: item.routingPath,
                    statusFlag: 1,
                    isDefault: 1,
                    screenName: item.screenName,
                    privileges: privileges.length > 0 ? privileges : '',
                };
                for (const key in item) {
                    if (item.hasOwnProperty(key) && !["routingPath", 'module', 'txScreen', 'screenName', 'privileges', 'id'].includes(key)) {
                        privilegeObject[key] = item[key] === 1 ? 1 : 0;
                    }
                }

                return privilegeObject;
            }).filter(Boolean)
        };
        const headers = getHeaderResponse();
        // console.log(postObj)
        // role config save api call 

        services.create(saveRoleConfig, postObj, headers)
            .then((response) => {
                toast.success("Success");
                setIsSaveEnabled(false)
                getroleDataByIdFun(roleId)
                getAllRoleByIdFun(rowId)
            })
            .catch((err) => {
                console.log(err.message);
            })
    };

    const getroleDataByIdFun = async (roleId: any) => {
        try {
            const response: any = await services.get(`${getRoleDataById}${roleId}`)
            setLocalItem("roleInfo", JSON.stringify(response.data))
        } catch (error) {
            console.log(error)
        }
    }
    //console.log(getLocalItem("roleInfo"))
    // grid columns info
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 50,
            renderCell: (params) => {
                const rowNumber = gridData.indexOf(params.row) + 1;
                return <span>{rowNumber}</span>;
            },
        },
        {
            field: "screenName",
            headerName: "Screen",
            width: 400,
        },
        {
            field: "View",
            headerName: "View",
            width: 90,
            renderCell: (params) => (
                params.row && params.row?.View !== undefined ? (
                    <Checkbox
                        crossOrigin
                        onClick={(e: any) => handleCheckboxChange(params.row.id, 'View', e.target.checked)}
                        checked={params.row.View === 1 ? true : false}
                        color="blue"
                    />
                ) : ""
            ),
        },
        {
            field: "Save",
            headerName: "Save",
            width: 90,
            renderCell: (params) => (
                params.row && params.row?.Save !== undefined ? (
                    params.row?.View === 1 ?
                        <Checkbox
                            crossOrigin
                            onClick={(e: any) => handleCheckboxChange(params.row.id, 'Save', e.target.checked)}
                            checked={params.row.Save === 1 ? true : false}
                            color="blue"
                        />
                        :
                        <Checkbox
                            crossOrigin
                            disabled={true}
                            checked={false}
                        />
                ) : ""
            ),
        },
        {
            field: "Update",
            headerName: "Update",
            width: 90,
            renderCell: (params) => (
                params.row && params.row?.Update !== undefined ? (
                    params.row?.View === 1 ?
                        <Checkbox
                            crossOrigin
                            onClick={(e: any) => handleCheckboxChange(params.row.id, 'Update', e.target.checked)}
                            checked={params.row.Update === 1 ? true : false}
                            color="blue"
                        />
                        :
                        <Checkbox
                            crossOrigin
                            disabled={true}
                            checked={false}
                        />
                ) : ""
            ),
        },
        {
            field: "Delete",
            headerName: "Delete",
            width: 80,
            renderCell: (params) => (
                params.row && params.row?.Delete !== undefined ? (
                    params.row?.View === 1 ?
                        <Checkbox
                            crossOrigin
                            onClick={(e: any) => handleCheckboxChange(params.row.id, 'Delete', e.target.checked)}
                            checked={params.row.Delete === 1 ? true : false}
                            color="blue"
                        />
                        :
                        <Checkbox
                            crossOrigin
                            disabled={true}
                            checked={false}
                        />
                ) : ""
            ),
        },
        {
            field: "Print",
            headerName: "Print",
            width: 80,
            renderCell: (params) => (
                params.row && params.row?.Print !== undefined ? (
                    params.row?.View === 1 ?
                        <Checkbox
                            crossOrigin
                            onClick={(e: any) => handleCheckboxChange(params.row.id, 'Print', e.target.checked)}
                            checked={params.row.Print === 1 ? true : false}
                            color="blue"
                        />
                        :
                        <Checkbox
                            crossOrigin
                            disabled={true}
                            checked={false}
                        />
                ) : ""
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 70,
            renderCell: (params) => (
                <>
                    {
                        params.row.roleAssignId && params.row.roleAssignId ?
                            <TrashIcon className="text-red-500 w-5 h-5 cursor-pointer" onClick={() => onDeleteShowPopup(params.row)} />
                            :
                            <TrashIcon className="text-red-500 w-5 h-5 cursor-pointer" onClick={() => onRemove(params.row.id)} />
                    }
                    {/* <button onClick={() => onRemove(params.row.roleAssignId)}>
                        <TrashIcon className="text-red-500 w-5 h-5" />
                    </button> */}
                </>
            ),
        },
    ];

    // before save delete funcanality
    const onRemove = useCallback((id: any) => {
        const updatedData = gridData.filter((item) => item.id !== id);
        setGridData(updatedData);
    }, [gridData, setGridData]);
    console.log(showDeletePopupInfo)
    // after save delete funcanality
    // const onDelete = useCallback(() => {
    const onDelete = () => {
        const postObj = {
            roleId: showDeletePopupInfo.row.roleId,
            roleAssignId: showDeletePopupInfo.row.roleAssignId,
            txScreen: showDeletePopupInfo.row.txScreen
        }
        services.create(deleteRoleScreen, postObj).then((res) => {
            toast.success("Deleted row successfully.")
            const updatedData = gridData.filter((item) => item.id !== showDeletePopupInfo.row.id);
            setGridData(updatedData);
            setShowDeletePopupInfo({ popup: false, row: null })
        }).catch((err) => {
            toast.error("Error, something went wrong please try again later.")
        })
    }

    const onDeleteShowPopup = (row: any) => {
        setShowDeletePopupInfo({
            popup: true,
            row: row,
        })
    }


    useEffect(() => {
        //console.log(getLocalItem("loginResponse"))
        setInitialGridData(JSON.stringify(gridData));
    }, []);
    return (
        <>
            <div className='w-full data-grid-newThem'>
                <DataGrid
                    autoHeight
                    rows={gridData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    density="compact"
                />
            </div>
            <div className='w-full py-5 flex gap-4 justify-end'>
                {/* {roleAssignid ?
                    <ActionButton
                        buttonText="UPDATE"
                        width="w-[120px] text-white h-[42px] text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        disabled={!isSaveEnabled}
                        handleSubmit={handleSave}
                    /> :
                    <ActionButton
                        buttonText="SAVE"
                        width="w-[120px] text-white h-[42px] text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        disabled={!isSaveEnabled}
                        handleSubmit={handleSave}
                    />
                } */}
                <ActionButton
                    buttonText={roleAssignid ? "UPDATE" : "SAVE"}
                    width="w-[120px] text-white h-[42px] text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    disabled={!isSaveEnabled}
                    handleSubmit={handleSave}
                />

                <ActionButton
                    buttonText="CLEAR"
                    width="w-[120px] text-white h-[42px] text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelReset}
                />
            </div>
            <ReactCommonDialog
                dialogtitle={"Delete Configuration"}
                open={showDeletePopupInfo.popup}
                size={'sm'}
                handler={() => { }}
                popupClose={() => { setShowDeletePopupInfo({ popup: false, row: null, }) }}
                Content={<>
                    <div className="text-center text-[20px] text-blue-500">
                        Are you sure,
                    </div>
                    <div className="text-center text-[20px] text-blue-500">
                        You want to Delete this Configuration?
                    </div>
                    <div className="w-full mt-5 flex justify-end gap-4">
                        <ActionButton
                            buttonText="Submit"
                            width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                            handleSubmit={onDelete}
                        />
                        <ActionButton
                            buttonText="Cancel"
                            width="bg-blue-500 hover:bg-blue-600 text-white w-[120px] py-3 text-center flex justify-center   "
                            handleSubmit={() => { setShowDeletePopupInfo({ popup: false, row: null, }) }}
                        />

                    </div>
                </>}
            />
        </>
    );
};

export default RoleConfigurationGrid;
