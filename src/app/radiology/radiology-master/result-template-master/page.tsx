import React from 'react'
import dynamic from 'next/dynamic';
const ResultTemplateMasterPageMainPage = dynamic(() => import('./ResultTemplateMasterPageMainPage'), { ssr: false });

const RadiologyResultTemplateMaster = () => {
    return (
        <>
            <ResultTemplateMasterPageMainPage />
        </>
    )
}

export default RadiologyResultTemplateMaster
