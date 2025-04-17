"use client";
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from "react";

interface dataStr {
    patientData: any;
    setPatientData: Dispatch<SetStateAction<any>>;
    menuStatus: any;
    setMenuStatus: Dispatch<SetStateAction<any>>;
    rollDesc: any;
    setRollDesc: Dispatch<SetStateAction<any>>;
    billNoData: any;
    setBillNoData: Dispatch<SetStateAction<any>>;
    encounterpatientData: any;
    setEncounterpatientData: Dispatch<SetStateAction<any>>;
    getLanData: any,
    setGetLandData: Dispatch<SetStateAction<any>>;
    selectHeaderDate: any;
    setSelectHeaderDate: Dispatch<SetStateAction<any>>,
    selectHeaderCurrDate: {},
    setSelectHeaderCurrDate: Dispatch<SetStateAction<any>>
}

interface dataProps {
    children: ReactNode;
}

const DataStorecontext = createContext<dataStr>({
    patientData: {},
    setPatientData: () => { },
    menuStatus: {},
    setMenuStatus: () => { },
    rollDesc: {},
    setRollDesc: () => { },
    billNoData: {},
    setBillNoData: () => { },
    encounterpatientData: {},
    setEncounterpatientData: () => { },
    getLanData: {},
    setGetLandData: () => { },

    selectHeaderDate: {},
    setSelectHeaderDate: () => { },
    selectHeaderCurrDate: {},
    setSelectHeaderCurrDate: () => { }
});

const PatientDataStore = ({ children }: dataProps) => {
    const [rollDesc, setRollDesc] = useState<any>();
    const [patientData, setPatientData] = useState<any>();
    const [menuStatus, setMenuStatus] = useState<any>(false);
    const [billNoData, setBillNoData] = useState<any>();
    const [encounterpatientData, setEncounterpatientData] = useState<any>([]);
    const [selectHeaderDate, setSelectHeaderDate] = useState<any>()
    const [selectHeaderCurrDate, setSelectHeaderCurrDate] = useState<any>()

    // when we click on the language select box on the header section get the values here
    const [getLanData, setGetLandData] = useState(null);

    return (
        <>
            <DataStorecontext.Provider
                value={{
                    patientData,
                    setPatientData,
                    menuStatus,
                    setMenuStatus,
                    billNoData,
                    setBillNoData,
                    rollDesc,
                    setRollDesc,
                    encounterpatientData,
                    setEncounterpatientData,
                    getLanData,
                    setGetLandData,
                    selectHeaderDate,
                    setSelectHeaderDate,
                    selectHeaderCurrDate,
                    setSelectHeaderCurrDate
                }}
            >
                {children}
            </DataStorecontext.Provider>
        </>
    );
};

const PatientDatadataAuth = () => useContext(DataStorecontext);
export { PatientDataStore, PatientDatadataAuth };
