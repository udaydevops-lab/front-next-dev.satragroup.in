"use client"
import React from 'react'
import dynamic from 'next/dynamic';
const ResultTemplateMasterPageMainPage = dynamic(() => import('./ResultTemplateMasterPageMainPage'), { ssr: false });

const ProceduresResultTemplate = () => {
    return (
        <>
            <ResultTemplateMasterPageMainPage />
        </>
    )
}

export default ProceduresResultTemplate