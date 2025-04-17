import { ReactSelectBox } from '@/app/_commonfeatures';
import { Input } from '@material-tailwind/react';
import React from 'react'

interface ConfigurationMasterFormProps {
    data: any;
    setData: any
}

const ConfigurationMasterForm: React.FC<ConfigurationMasterFormProps> = ({ data, setData }) => {


    return (
        <>
            <div className='w-full grid grid-cols-4 gap-4'>
                <Input crossOrigin
                    label='Configuration Name'
                    value={data.configName}
                    onChange={(e: any) => {
                        setData({
                            ...data,
                            configName: e.target.value,
                        });
                    }}
                />
                <Input crossOrigin
                    label='Configuration Type'
                    value={data.configType}
                    onChange={(e: any) => {
                        setData({
                            ...data,
                            configType: e.target.value,
                        });
                    }}
                />
                <Input crossOrigin
                    label='Remarks'
                    value={data.remorks}
                    onChange={(e: any) => {
                        setData({
                            ...data,
                            remorks: e.target.value,
                        });
                    }}
                />
                <ReactSelectBox
                    value={data.link}
                    options={data.linkData}
                    label="Link"

                    onChange={(e: any) => {
                        setData({
                            ...data,
                            link: e,
                        });
                    }}
                />
            </div>
        </>
    );
}

export default ConfigurationMasterForm;
