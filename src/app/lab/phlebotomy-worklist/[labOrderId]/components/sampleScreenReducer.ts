import PatientDetails from "./PatientDetails"


interface AppState {
    field: any,
    patientDetailsData: any,
    patientOrderDetailsData: any
}

export const initialState: AppState = {
    field: {
        loader: false,
        pSiteField: {
            label: 'Site'
        },
        pRouteField: {
            label: 'Route'
        }
    },
    patientDetailsData: {},
    patientOrderDetailsData: {}
}

export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'patientDetails', payload: Partial<AppState['patientDetailsData']> }
    | { type: 'patientOrderDetails', payload: Partial<AppState['patientOrderDetailsData']> }


export const sampleScreenReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } }
        case 'patientDetails':
            return { ...state, PatientDetails: { ...state.patientDetailsData, ...action.payload } }
        case 'patientOrderDetails':
            return { ...state, patientOrderDetailsData: { ...state.patientOrderDetailsData, ...action.payload } }
        default:
            return state
    }
}