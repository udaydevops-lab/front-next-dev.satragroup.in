"use client"
import ActionButton from '@/app/_common/button'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { TabPageTitle } from '@/app/lab/_component'
import { getLocalItem } from '@/app/utilities/local'
import React, { useEffect, useState } from 'react'
import ProceduresEquipmentMasterPopup from './components/ProceduresEquipmentMasterPopup'
import ProceduresEquipmentMasterGrid from './components/ProceduresEquipmentMasterGrid'
import { deleteProceduresEquipment, getAllDepartments, getAllProceduresEquipment, getEditProceduresEquipment, saveProceduresEquipment } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import { toast } from 'react-toastify'
import { getHeaderResponse } from '@/app/_commonfeatures/header'

const ProceduresEquipmentMasterMain = () => {
    const [loder, setLoder] = useState<any>(false)
    const [btnStatus, setBtnStatus] = useState<any>("save")
    const [popup, setPopup] = useState<any>({
        open: false
    })
    const [gridData, setGridData] = useState<any>([])
    const [departmentsList, setDepartmentsList] = useState<any>([])
    const [equipmentgridData, setEquipmentGridData] = useState<any>([])
    const [fields, setFields] = useState<any>({
        equipmentId: null,
        equipmentCode: "",
        equipmentDesc: "",
        bioMedicalAssetNo: "",
        manufacturer: "",
        specialtySearch: null
    })

    //headers
    const headers = getHeaderResponse()
    // geting employee name
    const storedLoginResponse = getLocalItem("loginResponse");
    let empName: any;
    try {
        empName = storedLoginResponse
            ? JSON.parse(storedLoginResponse).employeename
            : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = "";
    }
    // new button function
    const handleNew = () => {
        handleClear()
        setPopup({
            open: true
        })
    }
    //clear the form function
    const handleClear = () => {
        setBtnStatus("save")
        setEquipmentGridData([])
        setFields({
            equipmentId: null,
            equipmentCode: "",
            equipmentDesc: "",
            bioMedicalAssetNo: "",
            manufacturer: "",
            specialtySearch: null
        })
    }

    // add equipment function 
    const addEquipment = () => {
        if (fields?.specialtySearch && Array.isArray(fields.specialtySearch)) {
            const newEquipment: any = fields?.specialtySearch?.map((item: any, index: number) => ({
                id: equipmentgridData.length + index + 1,
                equipmentId: fields.equipmentId || null,
                equipmentCode: fields.equipmentCode,
                equipmentDesc: fields.equipmentDesc,
                bioMedicalAssetNo: fields.bioMedicalAssetNo,
                manufacturer: fields.manufacturer,
                departmentCode: item.value,
                departmentDesc: item.label,
                generatedBy: empName,
                statusFlag: 1,
            }));

            setEquipmentGridData((prev: any) => [...prev, ...newEquipment]);
            setFields({
                equipmentId: null,
                equipmentCode: "",
                equipmentDesc: "",
                bioMedicalAssetNo: "",
                manufacturer: "",
                specialtySearch: null
            })
        } else {
            // Handle case where specialtySearch is null or not an array
            console.error('specialtySearch is null or not an array');
        }
    };

    // save equipment function
    const handleSave = () => {
        setLoder(true)
        let message = btnStatus === "save" ? "Successfully added Procedures Assign Parameter" : "Successfully Updated Procedures Assign Parameter";
        services
            .create(saveProceduresEquipment, equipmentgridData, headers)
            .then((res) => {
                setTimeout(() => {
                    toast.success(message);
                    getAllProceduresEquipmentData();
                    setPopup({ open: false });
                    setLoder(false)
                }, 1000);
            })
            .catch((err) => {
                setLoder(false)
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                } else {
                    toast.error("Something went wrong please try again");
                }
            });
    }

    // get equipment function
    const getAllProceduresEquipmentData = async () => {
        //getAllProceduresEquipment
        try {
            const res = await services.get(getAllProceduresEquipment)
            setGridData(res.data)
        } catch (error) {

        }
    }
    // get equipment function
    const getAllDepartmentsList = async () => {
        //getAllDepartments
        try {
            const res = await services.get(getAllDepartments)
            console.log(res.data)
            const result = res.data.map((list: any) => ({
                ...list,
                label: list.departmentDescription,
                value: list.departmentCode
            }))
            setDepartmentsList(result)
        } catch (error) {

        }
    }

    // Edit equipment function
    const handleEdit = (row: any) => {
        setEquipmentGridData(row.equipmentList)
        setPopup({ open: true });
        setBtnStatus("update")
    }

    //delete
    const deleteList = (row: any) => {
        //deleteProceduresEquipment
        if (row.equipmentId) {
            console.log(row.equipmentId)
            services
                .create(`${deleteProceduresEquipment}${row.equipmentId}`, [], headers)
                .then((res) => {
                    const updatedList = equipmentgridData.filter((list: any) => list.equipmentId !== row.equipmentId)
                    setEquipmentGridData(updatedList)
                    toast.success("Record deleted successfully");
                })
                .catch((err) => {
                    toast.error("Something went wrong please try again");
                });
        } else {
            console.log(row)
            //equipmentgridData, setEquipmentGridData
            const updatedList = equipmentgridData.filter((list: any) => list.id !== row.id)
            setEquipmentGridData(updatedList)
        }
    }
    useEffect(() => {
        getAllDepartmentsList()
        getAllProceduresEquipmentData()
    }, [])
    return (
        <>
            <div className='flex w-full justify-between gap-4 mt-3'>

                <div className=''>
                    <TabPageTitle
                        title='Procedures Equipment Master '
                    />
                </div>
                <ActionButton
                    buttonText="New"
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleNew}
                />
            </div>
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ProceduresEquipmentMasterGrid
                    gridData={gridData}
                    handleEdit={handleEdit}

                // getAllRadiologyAssignServicesData={getAllRadiologyAssignServicesData}
                // handleEdit={handleEdit}
                />

            </div>
            <div>
                <ReactCommonDialog
                    dialogtitle={"Procedures Equipment Asset"}
                    open={popup.open}
                    size={'xl'}
                    handler={() => {
                        // setPopup({
                        //     open: false
                        // })
                    }}
                    popupClose={() => {
                        getAllProceduresEquipmentData()
                        setPopup({
                            open: false
                        })
                    }}
                    Content={<ProceduresEquipmentMasterPopup
                        fields={fields}
                        setFields={setFields}
                        setEquipmentGridData={setEquipmentGridData}
                        equipmentgridData={equipmentgridData}
                        addEquipment={addEquipment}
                        handleSave={handleSave}
                        handleClear={handleClear}
                        btnStatus={btnStatus}
                        deleteList={deleteList}
                        loder={loder}
                        departmentsList={departmentsList}
                    />}
                />
            </div>

        </>
    )
}

export default ProceduresEquipmentMasterMain