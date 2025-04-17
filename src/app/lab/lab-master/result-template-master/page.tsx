import dynamic from 'next/dynamic';
import React from 'react'
const ResultTemplateMasterPageMainPage = dynamic(() => import('./ResultTemplateMasterPageMainPage'), { ssr: false });

const ResultTemplateMasterPage = () => {
    return (
        <>
            <ResultTemplateMasterPageMainPage />
        </>
    )
}

export default ResultTemplateMasterPage
