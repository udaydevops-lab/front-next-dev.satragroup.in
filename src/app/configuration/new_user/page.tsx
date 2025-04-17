

import React from 'react'
import { MainPage } from './_components'

const NewUserCreationPage = (props: any) => {
    return (
        <>
            <MainPage empInfo={props.empData} />
        </>
    )
}

export default NewUserCreationPage
