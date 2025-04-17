import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { editConfigurationMaster } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { DocumentPlusIcon, PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';


interface ConfigurationMasterTotalGridProps {
    data: any;
    setData: (newData: any) => void;
    activeconfig: any,
    setPopup: any,
}

const ConfigurationMasterTotalGrid: React.FC<ConfigurationMasterTotalGridProps> = ({
    data,
    setData,
    activeconfig,
    setPopup,
}) => {
    const newRowFun = (res: any) => {
        let modifiedData: any = {};
        let originalData = res[0]
        for (let key in originalData) {
            modifiedData[key] = '';
        }
        const modifiedDataNew = { ...modifiedData, isNew: true }
        return modifiedDataNew
    }

    const editNewConfig = async (row: any) => {
        // console.log(row)
        try {
            const res = await services.get(`${editConfigurationMaster}${row.configName}/0`)
            setPopup(true)
            setData({
                ...data,
                open: true,
                newConfigRes: {
                    ...res.data,
                    newRow: newRowFun(res.data.configData),
                    button: "update",
                    configId: res.data.configId,
                    configName: row.configName,
                    configType: row.configType,
                }
            })
        } catch (error) {
            let res = await services.get(`${editConfigurationMaster}${row.configName}/1`)
            // console.log(res.data)
            const result = res.data.configDef.ipcolumns.reduce((acc: any, { columnName }: any) => {
                acc[columnName] = "";
                return acc;
            }, {});
            const resData = {
                configId: null,
                configName: res.data.configName,
                configType: res.data.configType,
                isDef: 0,
                button: "save",
                configData: [{
                    ...result,
                    id: "",
                    readOnly: "",
                    isNew: true,
                }],
                newRow: {
                    ...result,
                    id: "",
                    readOnly: "",
                    isNew: true,
                }
            }
            setPopup(true)
            setData({
                ...data,
                newConfigRes: resData
            })
        }
    }
    const editConfig = async (row: any) => {
        let res = await services.get(`${editConfigurationMaster}${row.configName}/1`)
        const ipcolumnsData = res?.data?.configDef?.ipcolumns?.map((list: any) => ({
            id: Date.now(),
            columnName: list.columnName,
            columnType: list.columnType != "" ? { label: list.columnType } : "",
            controlType: list.controlType != "" ? { label: list.controlType } : "",
            isMandatory: list.isMandatory != "" ? { label: list.isMandatory } : "",
            masterDataCode: list.masterDataCode != "" ? { label: list.masterDataCode } : "",
            statusFlag: 1,
        }))
        setData({
            ...data,
            configId: res.data.configId,
            configName: res.data.configName,
            configType: res.data.configType,
            configDef: { ipcolumns: ipcolumnsData },
        });
    }

    const columns: GridColDef[] = [
        { field: "id", headerName: "S.No", width: 100, },
        { field: "configName", headerName: "Configuration Name", width: 350 },
        { field: "configType", headerName: "Configuration Type", width: 300 },
        {
            field: "action", headerName: "Action", width: 150,
            renderCell: (params: any) => (
                <>
                    <div className='w-full flex items-center gap-4'>
                        <PencilIcon
                            onClick={params.row.statusFlag === 0 ? undefined : () => editConfig(params.row)}
                            className={`w-5 h-5 text-blue-500 ${params.row.statusFlag === 0 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                        />
                        <DocumentPlusIcon
                            onClick={params.row.statusFlag === 0 ? undefined : () => editNewConfig(params.row)}
                            className={`w-5 h-5 text-blue-500 ${params.row.statusFlag === 0 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                        />
                        <div className='cursor-pointer' onClick={() => activeconfig(params.row)}>
                            {params.row.statusFlag === 0 ? <InactiveIcon /> : <ActiveIcon />}
                        </div>
                    </div>
                </>
            ),
        },
    ]


    return (
        <>
            <div className="data-grid-newThem">
                <ReactDatagrid
                    rows={data?.configData}
                    toolsRequired
                    columns={columns} />
            </div>
        </>
    )
}

export default ConfigurationMasterTotalGrid