"use client"
import React from 'react'

interface SampleOrdersData {
    label: string;
    data: { type: string; value: number; color: string; }[];
}

const OrdersData: React.FC<SampleOrdersData> = ({
    label,
    data
}) => {
    const getGridTemplateColumns = (itemCount: number) => {
        if (itemCount === 6) {
            return 'grid-cols-3';
        }
        if (itemCount === 4) {
            return 'grid-cols-3';
        }
        return 'grid-cols-auto-fit';
    };

    const isFullWidth = (index: number) => {
        return data.length === 4 && index === 3;
    };

    return (
        <div className='w-full flex flex-col justify-between flex-shrink -mt-12'>
            <div className='font-sans text-[#808181] text-xl p-2'>{label}</div>
            <div className={`grid gap-4 ${getGridTemplateColumns(data.length)}`}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={`min-h-full rounded-lg border border-stroke bg-white p-2 shadow-md mt-4 ${isFullWidth(index) ? 'col-span-3' : ''}`}
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
