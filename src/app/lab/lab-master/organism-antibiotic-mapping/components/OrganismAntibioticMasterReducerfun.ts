import { getAllOrganismsData } from "@/app/utilities/api-urls"

interface AppState {
    field: any,
    getAppApi: any,
    popup: any,
}

export const OrganismInitilalState: AppState = {
    field: {
        organismSrch: '',
        organismDesc: {
            label: "Organism Description"
        },
        antibioticDesc: null,
        loader: false,
        newMappingGrid: [],
        organismSerchDesc: [],
        AntibioticSerchDesc: [],
        organismAssignId: null
    },
    getAppApi: {
        getAllOrganismsDatastore: []
    },
    popup: {
        open: false
    }
}

export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'getApis', payload: Partial<AppState['getAppApi']> }
    | { type: 'dialogPop', payload: Partial<AppState['popup']> }

export const OrgnismAntibioticMasterReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } }
        case 'getApis':
            return { ...state, getAppApi: { ...state.getAppApi, ...action.payload } }
        case 'dialogPop':
            return { ...state, popup: { ...state.popup, ...action.payload } }
        default:
            return state
    }
}