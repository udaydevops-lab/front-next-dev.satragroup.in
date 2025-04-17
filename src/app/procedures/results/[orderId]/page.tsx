import dynamic from 'next/dynamic';
import React from 'react'
const ResultEnteryMainPage = dynamic(() => import('./ResultEnteryMainPage'), { ssr: false });

const ResultEntery = () => {
    return (
        <>

            <div className='bg-white p-4'>
                <ResultEnteryMainPage />
            </div>
        </>
    )
}

export default ResultEntery