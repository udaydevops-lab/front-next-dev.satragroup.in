import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { deleteLabEquipment, saveLabEquipmentMaster } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import { TrashIcon } from '@heroicons/react/24/solid'
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

interface LaboratoryEquipmentMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
    getApiesData: () => void
}

const LaboratoryEquipmentCreation: React.FC<LaboratoryEquipmentMasterFormprops> = ({
    state,
    dispatch,
    getApiesData
}) => {
    const srchSpecialty = (data: any) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                labSpecialtySearch: data
            }
        })
    }

    const onSubmit = async () => {
        services
            .create(saveLabEquipmentMaster, state.field.addListValues)
            .then((response: any) => {
                { state.field.equipmentId == null ? toast.success("Saved Successfully") : toast.success("Updated Successfully"); }
                dispatch({
                    type: 'dialogPop',
                    payload: {
                        open: false
                    }
                })
                getApiesData();
            })
            .catch((error: any) => {
                console.log(error.message);
            })
    }

    const HandleAdd = () => {
        if (
          !state.field.manufacturer ||
          !state.field.labEquiCode ||
          !state.field.labEquiDesc ||
          !state.field.bioMedicalAssetNo
        ) {
          toast.error("Please fill all the required fields");
          return;
        }
        if (state.field.labSpecialtySearch && state.field.labSpecialtySearch.length > 0) {
            let newArr: any[] = state.field.labSpecialtySearch.map((item: any) => {
                return {
                    sn: Math.random(),
                    equipmentCode: state.field.labEquiCode,
                    equipmentDesc: state.field.labEquiDesc,
                    bioMedicalAssetNo: state.field.bioMedicalAssetNo,
                    manufacturer: state.field.manufacturer,
                    equipmentId: item.equipmentId !== undefined ? item.equipmentId : "",
                    laboratorySpeciality: item.specialityCode || item.value,
                    laboratorySpecialityDesc: item.specialityDescription || item.label,
                    statusFlag: 1
                }
            })
            dispatch({
                type: 'fieldVal',
                payload: {
                    addListValues: newArr
                }
            })
        } else {
            toast.error("Please select the specialty")
        }
    }
    const columns = [
        {
            field: "id", headerName: "S. No", width: 80, renderCell: (params: any) => {
                return <>{params.row.id}</>
            }
        },
        { field: "equipmentCode", headerName: "Equipment Code", width: 120 },
        { field: "equipmentDesc", headerName: "Equipment Desc", width: 120 },
        { field: "bioMedicalAssetNo", headerName: "Bio Medical AssetNo", width: 120 },
        { field: "manufacturer", headerName: "Manufacturer", width: 120 },
        { field: "laboratorySpecialityDesc", headerName: "Laboratory Speciality", width: 120 },
        {
            field: "Delete",
            headerName: "Actions",
            width: 120,
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

    const deleteList = (data: any) => {
        if (data && data?.equipmentId) {
            services
                .create(`${deleteLabEquipment}${data?.equipmentId}`, {})
                .then((response: any) => {
                    toast.success(`Record deleted successfully`);
                    dispatch({
                        type: 'fieldVal',
                        payload: {
                            addListValues: state.field.addListValues.filter((item: any) => item.laboratorySpeciality !== data.laboratorySpeciality),
                            labSpecialtySearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                                ...item,
                                value: item.laboratorySpeciality,
                                label: item.laboratorySpecialityDesc
                            })).filter((item: any) => item.laboratorySpeciality !== data.laboratorySpeciality) : null,
                        }
                    })
                })
                .catch((err: any) => {
                    toast.error("Something went wrong..");
                })
        } else {
            dispatch({
                type: 'fieldVal',
                payload: {
                    addListValues: state.field.addListValues.filter((item: any) => item.laboratorySpeciality !== data.laboratorySpeciality),
                    labSpecialtySearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                        ...item,
                        value: item.laboratorySpeciality,
                        label: item.laboratorySpecialityDesc
                    })).filter((item: any) => item.laboratorySpeciality !== data.laboratorySpeciality) : null,
                }
            })
        }
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-2 newInputField">
          <FormPropsTextFields
            label="Laboratory Equipment Code *"
            width="100%"
            value={state.field.labEquiCode}
            handleChange={(e: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  labEquiCode: e.target.value,
                },
              });
            }}
          />
          <FormPropsTextFields
            label="Laboratory Equipment Description *"
            width="100%"
            value={state.field.labEquiDesc}
            handleChange={(e: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  labEquiDesc: e.target.value,
                },
              });
            }}
          />
          <FormPropsTextFields
            label="Biomedical Asset Number *"
            width="100%"
            value={state.field.bioMedicalAssetNo}
            handleChange={(e: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  bioMedicalAssetNo: e.target.value,
                },
              });
            }}
          />
          <FormPropsTextFields
            label="Manufacturer *"
            width="100%"
            value={state.field.manufacturer}
            handleChange={(e: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  manufacturer: e.target.value,
                },
              });
            }}
          />
        </div>
        <div className="flex gap-x-3">
          <div className="mt-4 newSelect w-[700px]">
            <ReactSelectBox
              value={state.field.labSpecialtySearch}
              options={state.getAppApi.labSpesSel}
              onChange={srchSpecialty}
              label={"Laboratory Specialty"}
              isSearchable={true}
              isMultiple={true}
            />
          </div>
          <div className="mt-5">
            <ActionButton
              buttonText={"Add"}
              handleSubmit={HandleAdd}
              width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
            />
          </div>
        </div>

        <div className="data-grid-newThem mt-4 ">
          <ReactDatagrid rows={state.field.addListValues} columns={columns} />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <ActionButton
            buttonText={
              state.field.loader ? (
                <div className="w-full flex justify-center items-center">
                  <div className="innerBtnloader"></div>
                </div>
              ) : Object.keys(state.field.rowData).length > 0 ? (
                "Update"
              ) : (
                "Save"
              )
            }
            width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={
              !state.field.labEquiCode &&
              !state.field.labEquiDesc &&
              !state.field.bioMedicalAssetNo &&
              !state.field.manufacturer
              // state.field.labSpecialtySearch.length > 0
            }
            handleSubmit={onSubmit}
          />
          {Object.keys(state.field.rowData).length > 0 ? null : (
            <ActionButton
              buttonText="Clear"
              handleSubmit={() => {
                dispatch({
                  type: "fieldVal",
                  payload: {
                    labEquiCode: "",
                    labEquiDesc: "",
                    bioMedicalAssetNo: "",
                    manufacturer: "",
                    labSpecialtySearch: null,
                    addListValues: [],
                  },
                });
              }}
              width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          )}
        </div>
      </>
    );
}

export default LaboratoryEquipmentCreation
