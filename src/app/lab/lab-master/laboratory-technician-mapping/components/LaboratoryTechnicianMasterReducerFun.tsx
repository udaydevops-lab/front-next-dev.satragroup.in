interface AppState {
    field: any,
    getAppApi: any,
    popup: any,
}
export const LabTechInitialState: AppState = {
    field: {
        labSpecialtySrch: '',
        labSpecialtySearch: {
            label: "Laboratory Specialty"
        },
        labTechnicianSearch: null,
        labTechMapId: null,
        addListValues: [],
        rowData: {}
    },
    getAppApi: {
        labTechGriddata: [],
        labSearchDropdown: [],
        labspecDd: [],
        labTechDd: [],
    },
    popup: {
        open: false
    }
}
export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'getApis', payload: Partial<AppState['getAppApi']> }
    | { type: 'dialogPop', payload: Partial<AppState['popup']> }

export const LaboratoryTechnicianMasterReducer = (state: AppState, action: AppAction) => {
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