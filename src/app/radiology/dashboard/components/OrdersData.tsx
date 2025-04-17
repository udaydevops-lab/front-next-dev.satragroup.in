import React from 'react'

interface SampleOrdersData {
    data: { type: string; value: number; color: string; labelData: string }[];
}

const OrdersData: React.FC<SampleOrdersData> = ({
    data
}) => {
    return (
        // <div className='w-full flex flex-col justify-between flex-shrink -mt-12'>
        <div>
            <div className='grid grid-cols-4 gap-4'>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className='rounded-lg border border-stroke bg-white p-2 shadow-md mt-4'
                    >
                        <div className='font-semibold font-mono text-center' style={{ color: `${item.color}` }}>{item.type}</div>
                        <div className="font-extrabold text-2xl text-center" style={{ color: `${item.color}` }}>{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrdersData
