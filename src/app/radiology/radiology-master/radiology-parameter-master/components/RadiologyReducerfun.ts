interface AppState {
    field: any,
    getApi: any,
    popup: any,
    loader: any
}

export const radilogyInitialstate: AppState = {
    field: {
        units: {
            label: "Result Units"
        },
        result_type: {
            label: "Result Type *"
        },
        radiologyParameterId:null,
        terminologycodeDesc:[],
        addTerminologyDatagrid: [],
        terminology_type: {
            label: "Terminology Type *"
        },
        terminology_code_desc: {
            label: "Terminology code / Desc Search *"
        },
        resultTypeData: [],
        addListValues: [],
        updateRadiologyId: null
    },
    getApi: {
        radiologyParameterSavedData: [],
    },
    popup: {
        popupOpenclose: false,
        deletePopup: false
    },
    loader: {
        btnLoader: false
    }
}

export type AppAction =
    | { type: "fieldVal", payload: Partial<AppState['field']> }
    | { type: "getApies", payload: Partial<AppState['getApi']> }
    | { type: "popupSec", payload: Partial<AppState['popup']> }
    | { type: "loaderSec", payload: Partial<AppState['loader']> }

export const reducerRadiology = (state: AppState, action: AppAction) => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } }
        case 'getApies':
            return { ...state, getApi: { ...state.getApi, ...action.payload } }
        case 'popupSec':
            return { ...state, popup: { ...state.popup, ...action.payload } }
        case 'loaderSec':
            return { ...state, loader: { ...state.loader, ...action.payload } }
        default:
            return state
    }
}