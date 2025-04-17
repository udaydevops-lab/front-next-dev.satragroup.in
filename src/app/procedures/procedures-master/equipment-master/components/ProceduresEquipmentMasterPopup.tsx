import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { TrashIcon } from '@heroicons/react/24/solid'
import React, { FC } from 'react'

interface ProceduresEquipmentMasterPopupProps {
    fields: any,
    setFields: any,
    equipmentgridData: any,
    setEquipmentGridData: any,
    addEquipment: any,
    handleSave: any,
    handleClear: any,
    btnStatus: any,
    deleteList: any,
    loder: any,
    departmentsList: any,
}

const ProceduresEquipmentMasterPopup: FC<ProceduresEquipmentMasterPopupProps> = ({ fields, setFields, equipmentgridData, setEquipmentGridData, addEquipment, handleSave, handleClear, btnStatus, deleteList, loder, departmentsList }) => {
    const specialtyList: any = [
        { label: "biopsy", value: "b001" },
        { label: "appendectomy", value: "a001" },
        { label: "colonoscopy", value: "c001" },
    ]
    const srchSpecialty = (e: any) => {
        setFields({
            ...fields,
            specialtySearch: e,
        })
    }

    const data: any = [
        { equipmentCode: "test1", equipmentDesc: "test1", bioMedicalAssetNo: 11, manufacturer: "uma" },
        { equipmentCode: "test2", equipmentDesc: "test2", bioMedicalAssetNo: 11, manufacturer: "uma" },
        { equipmentCode: "test3", equipmentDesc: "test3", bioMedicalAssetNo: 11, manufacturer: "uma" },
    ]
    const columns = [
        {
            field: "id", headerName: "S No", width: 70, renderCell: (params: any) => {
                return <>{params.row.id}</>
            }
        },
        { field: "equipmentCode", headerName: "Equipment Code", width: 150 },
        { field: "equipmentDesc", headerName: "Equipment Desc", width: 220 },
        { field: "bioMedicalAssetNo", headerName: "Bio Medical AssetNo", width: 150 },
        { field: "manufacturer", headerName: "Manufacturer", width: 120 },
        { field: "departmentDesc", headerName: "Department", width: 160 },
        {
            field: "Delete",
            headerName: "Actions",
            width: 80,
            renderCell: (params: any) => (
                <>
                    <div className="flex gap-2">
                        <TrashIcon
                            className="w-5 h-5 text-red-400 cursor-pointer"
                            onClick={() => deleteList(params.row)}
                        />
                    </div>
                </>
            ),
        },
    ]

    return (
        <>
            <div className='w-full grid grid-cols-2 gap-4'>
                <FormPropsTextFields
                    label="Procedures Equipment Code *"
                    width="100%"
                    value={fields.equipmentCode}
                    handleChange={(e: any) => setFields({
                        ...fields,
                        equipmentCode: e.target.value,
                    })}
                // handleChange={(e: any) => inputChange(e.target.value, "equiCode")}
                />
                <FormPropsTextFields
                    label="Procedures Equipment Description *"
                    width="100%"
                    value={fields.equipmentDesc}
                    handleChange={(e: any) => setFields({
                        ...fields,
                        equipmentDesc: e.target.value,
                    })}
                />
                <FormPropsTextFields
                    label="Biomedical Asset Number *"
                    width="100%"
                    value={fields.bioMedicalAssetNo}
                    handleChange={(e: any) => setFields({
                        ...fields,
                        bioMedicalAssetNo: e.target.value,
                    })}
                />
                <FormPropsTextFields
                    label="Procedures Manufacturer *"
                    width="100%"
                    value={fields.manufacturer}
                    handleChange={(e: any) => setFields({
                        ...fields,
                        manufacturer: e.target.value,
                    })}
                />
            </div>
            <div className='w-full flex gap-4 mt-4'>
                <div className='w-[80%]'>
                    <ReactSelectBox
                        value={fields.specialtySearch}
                        options={departmentsList}
                        onChange={srchSpecialty}
                        label={"Procedures Department"}
                        isSearchable={true}
                        isMultiple={true}
                        height="150"
                    />
                </div>
                <div className=''>
                    <ActionButton
                        buttonText="Add"
                        width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={addEquipment}
                    // disabled={
                    //     !fields.equipmentCode && !fields.equipmentDesc && !fields.bioMedicalAssetNo && !fields.manufacturer &&
                    //         fields.specialtySearch !== null
                    //         ? false
                    //         : true
                    // }

                    />
                </div>
            </div>
            <div className='w-full flex gap-4 mt-4 min-h-[50px] data-grid-newThem'>
                <ReactDatagrid rows={equipmentgridData} columns={columns} />
            </div>
            <div className='flex w-full justify-end gap-4 mt-3'>
                <ActionButton
                    buttonText={loder ? (
                        <div className='w-full flex justify-center items-center'>
                            <div className='innerBtnloader'></div>
                        </div>
                    ) : (
                        <>
                            {btnStatus === "save" ? "Save" : "Update"}
                        </>
                    )}
                    // buttonText={btnStatus === "save" ? "Save" : "Update"}
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleSave}
                />
                {btnStatus === "save" ?
                    <ActionButton
                        buttonText="Clear"
                        width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handleClear}
                    />
                    : null}
            </div>
        </>
    )
}

export default ProceduresEquipmentMasterPopup