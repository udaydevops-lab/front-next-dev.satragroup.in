import React, { Dispatch, FC, SetStateAction } from 'react'
import ReferenceRangeForm from './ReferenceRangeForm'
import LabRefrencerangeconfigGrid from './LabRefrencerangeconfigGrid'

interface ReferenceRangeConfigprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const ReferenceRangeConfig: FC<ReferenceRangeConfigprops> = ({
    state,
    dispatch
}) => {

    return (
        <>
            {state.field.result_type.value === "number" &&
                <div className='w-full mt-2'>
                    <h2 className='text-slate-400 py-2 text-[14px] font-bold'>Reference Range Configuration</h2>
                    <ReferenceRangeForm
                        state={state}
                        dispatch={dispatch}
                    />
                    <LabRefrencerangeconfigGrid
                        state={state}
                        dispatch={dispatch}
                    />
                </div>
            }
        </>
    )
}

export default ReferenceRangeConfig
