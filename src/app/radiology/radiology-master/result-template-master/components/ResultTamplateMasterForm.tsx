"use client"
import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface ResultTamplateMasterFormProps {
  resultTypeData: any,
  fields: any,
  setFields: Dispatch<SetStateAction<any>>
  handleSubmit: any,
}
const ResultTamplateMasterForm: FC<ResultTamplateMasterFormProps> = ({ resultTypeData, fields, setFields, handleSubmit }) => {

  return (
    <>
      <div className='flex w-full gap-4 mt-3'>
        <div className='w-1/2 newInputField'>
          {/* <ReactSelectBox
            value={fields.resultTypeValue}
            options={resultTypeData}
            label={"Result Type Search"}
            isSearchable={true}
            onChange={(e) => { setFields({ ...fields, "resultTypeValue": e }) }}
          /> */
            <FormPropsTextFields
              label="Sample Type Code"
              name="sampletypeDescsel"
            //  handleChange={setSelectchange}
            // value={feilds.sampletypeDescsel}
            // handleKeyPress={handelKeyDown}
            />}
        </div>
        <div className='w-1/2 flex gap-4 justify-center mt-1'>
          <ActionButton
            buttonText="Search"
            width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />

          <ActionButton
            buttonText="New Mapping"
            width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={handleSubmit}
          />
        </div>

      </div>
    </>
  )
}

export default ResultTamplateMasterForm