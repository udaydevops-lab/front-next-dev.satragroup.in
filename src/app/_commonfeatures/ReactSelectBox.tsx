import React from 'react'
import Select from 'react-tailwindcss-select'

interface selectBoxReact {
    value: any,
    options: [],
    isDisabled?: boolean,
    isSearchable?: boolean,
    isMultiple?: boolean,
    onChange: (e: any) => void,
    label: string,
    optionListWidtsize?: boolean,
    onSearchInputChange?: (e: any) => void,
    smallHeight?: any
    height?: any //100,150,200,250....
    required?:any,
    optionPosition?:any
}

const ReactSelectBox: React.FC<selectBoxReact> = ({
    value,
    options,
    isDisabled,
    isSearchable,
    isMultiple,
    onChange,
    label,
    optionListWidtsize,
    onSearchInputChange,
    smallHeight,
    height,
    required,
    optionPosition
}) => {

    return (
        <>
            <div className='my-select relative max-w-7xl'>
                <Select
                    primaryColor={"indigo"}
                    value={isDisabled ? value : value}
                    isMultiple={isMultiple}
                    options={options}
                    isSearchable={isSearchable}
                    onChange={onChange}
                    isDisabled={isDisabled}
                    placeholder={`${label}`}
                    onSearchInputChange={onSearchInputChange}
                    classNames={{
                        menuButton: ({ isDisabled }: any) => (
                            `flex py-0.5 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none ${isDisabled
                                ? "bg-blue-gray-50 border-blue-gray-200"
                                : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                            }`
                        ),
                        menu: `absolute z-10 ${optionListWidtsize ? '!max-w-2xl' : 'w-full'} ${smallHeight ? 'h-[180px] overflow-y-auto' : ''} bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700 h-auto`,

                        list: `${height ? `max-h-[${height}px] overflow-y-auto` : ""}`,
                        listItem: ({ isSelected }: any) => (
                            `block transition duration-200 px-2 py-2 text-start capitalize cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                ? `!text-white bg-blue-500`
                                : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                            }`
                        )
                    }}

                    // ATTENTION
                    // menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                    // styles={{
                    //     menuPortal: (provided: React.CSSProperties) => ({
                    //         ...provided,
                    //         zIndex: 9999,
                    //     }),
                    //     menu: (provided: React.CSSProperties) => ({
                    //         ...provided,
                    //         zIndex: 9999,
                    //         top: 'auto',
                    //         bottom: '100%',
                    //     })
                    // }}
                />

                <label
                    style={{ fontSize: "11px", color: "rgba(0, 0, 0, 0.6)" }}

                    className={`${isMultiple ?
                        value?.length > 0 ? ` ${isDisabled ? 'bg-transparent' : 'bg-white'}  py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]` : 'text-sm opacity-0 top-10'
                        :
                        value?.label !== label && value !== "" ? `${isDisabled ? 'bg-transparent' : 'bg-white'} py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]` : 'text-sm opacity-0 top-10'} 
                        truncate 
                        cursor-default
                        select-none
                        absolute 
                        transition-all               
                `}>
                    {label} {required && <span className='text-red-500'>*</span>}
                </label>
            </div>
        </>
    )
}

export default ReactSelectBox
