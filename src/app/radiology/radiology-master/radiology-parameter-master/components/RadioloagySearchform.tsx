import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { TabPageTitle } from '@/app/lab/_component'
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'

interface RadioloagySearchformprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const RadioloagySearchform: FC<RadioloagySearchformprops> = ({
    state,
    dispatch
}) => {

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "fieldVal",
            payload: {
                [e.target.name]: e.target.value
            }
        })
    }

    const radiologySearchfun = () => {

    }

    const radiologyformPopupfun = () => {
        dispatch({
            type: "popupSec",
            payload: {
                popupOpenclose: true
            }
        })
        dispatch({
            type: "fieldVal",
            payload: {
                radiologyParameterId:null,
                parameterDescription: '',
                parameterCode: '',
                units: { label: "Result Units" },
                result_type: { label: "Result Type *" },
                terminology_type: { label: "Terminology Type *" },
                terminology_code_desc: { label: "Terminology code / Desc Search *" },
                addListValues: [],
                referenceComments: '',
                terminologycodeDesc: [],
                addTerminologyDatagrid: []
            }
        })
    }

    return (
        <>
            <div className='flex w-full gap-4 mt-3 justify-between items-center'>
                <TabPageTitle
                    title={"Parameter Master"}
                />
                <ActionButton
                    buttonText="New"
                    width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={radiologyformPopupfun}
                />

                {/* <div className='w-1/2 newInputField'>
                    
                    <FormPropsTextFields
                        label="Radiology Parameter Search"
                        handleChange={inputHandler}
                        name="radiologyprameterSrch"
                        value={state.field.radiologyprameterSrch}
                    />
                </div>
                <div className='w-1/2 flex gap-4 justify-center  newBtn-theme'>
                    <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

                        handleSubmit={radiologySearchfun}
                    />
                    <ActionButton
                        buttonText="New Radiology Parameter"
                        width="w-full text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={radiologyformPopupfun}
                    />

                </div> */}
            </div>
        </>
    )
}

export default RadioloagySearchform
