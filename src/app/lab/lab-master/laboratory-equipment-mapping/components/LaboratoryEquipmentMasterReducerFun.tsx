interface AppState {
    field: any,
    getAppApi: any,
    popup: any,
}
export const LaboratoryInitialState: AppState = {
    field: {
        // labSpecialtySrch: {
        //     label: "Laboratory Specialty"
        // },
        labSpecialtySearch: null,
        // labSpSearch: {
        //     label: "Laboratory Specialty"
        // },
        // labDocSearch: {
        //     label: "Laboratory Doctor"
        // },
        submitData: [],
        equipmentId: null,
        addListValues: [],
        loader: false
    },
    getAppApi: {
        labDoctorGriddata: [],
        labspecDd: [],
        labTechDd: [],
        labSpesSel: [],
        labEquipGriddata: []
    },
    popup: {
        open: false
    }
}
export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'getApis', payload: Partial<AppState['getAppApi']> }
    | { type: 'dialogPop', payload: Partial<AppState['popup']> }

export const LaboratoryEquipmentMasterReducer = (state: AppState, action: AppAction) => {
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