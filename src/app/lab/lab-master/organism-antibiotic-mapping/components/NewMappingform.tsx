import ActionButton from '@/app/_common/button'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { onganismAntibioticdeleteapie, organismAntibioticMapingsaveapie } from '@/app/utilities/api-urls'
import { sanitizeObject } from '@/app/utilities/sanitizeObject'
import { TrashIcon } from '@heroicons/react/24/solid'
import { GridColDef } from '@mui/x-data-grid'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { toast } from 'react-toastify'

interface NewMappingformprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllorganismAntibioticDatafun: any
}

const NewMappingform: FC<NewMappingformprops> = ({
    state,
    dispatch,
    getAllorganismAntibioticDatafun
}) => {

    // search and select the data as respective of search
    const selectOrgnAntibioticsmdesc = (data: any, keyName: string) => {

        dispatch({
            type: "fieldVal",
            payload: {
                [`${keyName}`]: sanitizeObject(data)
            }
        })
    }

    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 90,
            // renderCell: (params: any) => {
            //     const number = state.field.newMappingGrid.indexOf(params.row) + 1
            //     return number
            // }
        },
        // { field: "organismDesc", headerName: "Organism Description", width: 265 },
        { field: "antibioticDesc", headerName: "Antibiotic Name", width: 630 },
        {
            field: "orderingDr", headerName: "Actions", width: 70,
            renderCell: (params: any) => (
                <>
                    <div className='cursor-pointer' onClick={() => delOrgm(params.row)}>
                        <TrashIcon className='w-5 h-5 text-red-500' />
                    </div>
                </>
            )
        },


    ];


    const AddOrganisAnitibiotic = () => {

        if (state.field.organismAssignId === null) {
            // Check if the user already exists in addUserdatatable
            const isDuplicateUser = state.getAppApi?.getAllOrganismsDatastore.some(
                (list: any) => list.organismDesc === state.field.organismDesc.label
            );

            if (isDuplicateUser) {
                return toast.error(`This ${state.field.organismDesc.label} Organism name already listed on the grid, please update Antiboitic name..`); // Exit the function without dispatching the action
            }
        }

        let filterData: any = state.field.antibioticDesc.map((list: any) => (
            {
                ...list,
                sn: Math.random(),
                organismDesc: state.field.organismDesc.label,
                organismCode: state.field.organismDesc.value,
                organismAssignId: list.organismAssignId ? list.organismAssignId : null
            }
        )).reduce((acc: any, ccmpl: any) => {
            let obj = acc.find(
                (c: any) =>
                    c.antibioticDesc === ccmpl.antibioticDesc
            );
            if (obj) {
                toast.error(`you have enter same antibiotic again, please be awair`);

                return acc;
            } else {
                return acc.concat([ccmpl]);
            }
        }, []);

        dispatch({
            type: "fieldVal",
            payload: {
                newMappingGrid: filterData,
                // organismDesc: {
                //     label: "Organism Description"
                // },
                // antibioticDesc: null
            }
        })
    }


    // delete Organism desc add data
    const delOrgm = async (data: any) => {
        //if data.organismAssignId value is avaible then if first condition works condition false 
        if (data.organismAssignId) {


            const response: any = await ApiRequestMethod({ method: "POST", url: onganismAntibioticdeleteapie, postObj: { organismAssignId: data.organismAssignId } })
            if (response.success) {
                toast.success(`Successfully ${data.antibioticDesc} deleted from ${data.organismDesc} Organism `)
                getAllorganismAntibioticDatafun()
                dispatch({
                    type: "fieldVal",
                    payload: {
                        newMappingGrid: state.field.newMappingGrid.length > 0 ? state.field.newMappingGrid.filter((list: any) => list.organismAssignId !== data.organismAssignId) : [],
                        antibioticDesc: state.field.newMappingGrid.length > 1 ? state.field.newMappingGrid.filter((list: any) => list.organismAssignId !== data.organismAssignId) : null
                    }
                })
            }
            else {
                toast.error('Something went wrong..')
            }

        }
        //if data.organismAssignId value is not avaible then else condition works condition false
        else {
            dispatch({
                type: "fieldVal",
                payload: {
                    newMappingGrid: state.field.newMappingGrid.length > 0 ? state.field.newMappingGrid.filter((list: any) => list.sn !== data.sn) : [],
                    antibioticDesc: state.field.newMappingGrid.length > 1 ? state.field.newMappingGrid.filter((list: any) => list.sn !== data.sn) : null
                }
            })
        }
    }

    interface DataItem {
        sn: number;
        organismDesc: string;
        organismCode: string;
        antibioticDesc: string;
        antibioticCode: string;
        statusFlag: number;
    }

    const removeIdKey = (data: DataItem[]): Omit<DataItem, 'sn'>[] => {
        return data.map(({ sn, ...rest }) => rest);
    };

    // save and Update newly add Organsism and Antibiotic name
    const SaveOrganisAnitibiotic = async () => {
        dispatch({
            type: "fieldVal",
            payload: {
                loader: true
            }
        })
        let updatedData: any;
        if (state.field.organismAssignId) {
            let postObj: DataItem[] = state.field.newMappingGrid.map((list: any) => {
                return {
                    ...list,
                    statusFlag: 1
                }
            })
            updatedData = removeIdKey(postObj);
        } else {
            let postObj: DataItem[] = state.field.newMappingGrid
            updatedData = removeIdKey(postObj);
        }

        const response: any = await ApiRequestMethod({ method: "POST", url: organismAntibioticMapingsaveapie, postObj: updatedData })
        if (response.success) {
            setTimeout(() => {
                if (state.field.organismAssignId) {
                    toast.success('Successfully Updated Organism and Antibiotic Name')
                }
                else {
                    toast.success('Successfully Added New Organism and Antibiotic Name')
                }

                dispatch({
                    type: "fieldVal",
                    payload: {
                        loader: false
                    }
                })
                dispatch({
                    type: 'dialogPop',
                    payload: {
                        open: false
                    }
                })
                getAllorganismAntibioticDatafun()
            }, 2000);
        } else {
            setTimeout(() => {
                toast.error('An Error')
                dispatch({
                    type: "fieldVal",
                    payload: {
                        loader: false
                    }
                })
                dispatch({
                    type: 'dialogPop',
                    payload: {
                        open: false
                    }
                })
                getAllorganismAntibioticDatafun()
            }, 2000);
        }
    }


    // clear the newly add Organsism and Antibiotic name table data
    const ClearOrganisAnitibiotic = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                newMappingGrid: [],
                organismAssignId: null,
                organismDesc: {
                    label: "Organism Description"
                },
                antibioticDesc: null
            }
        })
    }


    return (
        <>
            <div className='w-full flex gap-4'>
                <div className='w-2/5 newSelect'>
                    <ReactSelectBox
                        value={state.field.organismDesc}
                        options={state.field.organismSerchDesc}
                        onChange={(data: any) => selectOrgnAntibioticsmdesc(data, 'organismDesc')}
                        label={"Organism Description"}
                        isDisabled={state.field.organismAssignId ? true : false}
                    />
                </div>
            </div>
            <div className='w-full flex gap-4 mt-4'>
                <div className='w-full newSelect'>
                    <ReactSelectBox
                        value={state.field.antibioticDesc}
                        options={state.field.AntibioticSerchDesc}
                        onChange={(data: any) => {
                            console.log(data)
                            selectOrgnAntibioticsmdesc(data, 'antibioticDesc')
                        }}
                        label={"Antibiotic Name"}
                        isMultiple={true}
                        isDisabled={state.field.organismDesc.label !== "Organism Description" ? false : true}
                    // smallHeight={true}
                    />
                </div>
                <div className='w-[120px] '>
                    <ActionButton
                        buttonText="Add"
                        width="w-full text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={AddOrganisAnitibiotic}
                        disabled={state.field.organismDesc.label !== "Organism Description" ? false : true}
                    />
                </div>
            </div>

            <div className='w-full my-4 data-grid-newThem '>
                <ReactDatagrid
                    rows={state.field.newMappingGrid}
                    columns={columns1}
                />
            </div>

            <div className='w-full flex justify-end gap-4 newBtn-theme'>
                <ActionButton
                    buttonText={
                        state.field.loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            state.field.organismAssignId ? 'Update' : 'Save'
                    }
                    width="w-[120px] text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={SaveOrganisAnitibiotic}
                    disabled={
                        state.field.newMappingGrid.length > 0 ? false : true
                    }
                />
                {state.field.organismAssignId?null:
                <ActionButton
                    buttonText="Clear"
                    width="w-[120px] text-white h-[42px]  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={ClearOrganisAnitibiotic}
                />}
                
            </div>
        </>
    )
}

export default NewMappingform
