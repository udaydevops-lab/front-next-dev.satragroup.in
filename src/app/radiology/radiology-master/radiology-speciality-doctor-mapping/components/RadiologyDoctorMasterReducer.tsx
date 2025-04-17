interface AppState {
    field: any,
    getAppApi: any,
    popup: any,
}
export const RadiologyInitialState: AppState = {
    field: {
        radSpecialtySearch: {
            label: "Radiology Specialty"
        },
        radDeptDoctorsSearch: null,
        rowData: {},
        addListValues: [],
        radDocMapId: null
    },
    getAppApi: {
        radDoctorGriddata: [],
        radspecDd: [],
        radDeptDocDd: [],
    },
    popup: {
        open: false
    }
}
export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'getApis', payload: Partial<AppState['getAppApi']> }
    | { type: 'dialogPop', payload: Partial<AppState['popup']> }

export const RadiologyDoctorMasterReducer = (state: AppState, action: AppAction) => {
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