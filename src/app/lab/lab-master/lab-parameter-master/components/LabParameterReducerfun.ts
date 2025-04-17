interface AppState {
    field: any,
    getApi: any,
    dailoagPop: any
}

export const labParamertinitialState: AppState = {
    field: {
        parameterId: null,

        units: {
            label: "Result Units"
        },
        result_type: {
            label: "Result Type *",
        },
        terminology_type: {
            label: "Terminology Type *",
        },
        terminology_code_desc: {
            label: "Terminology code / Desc Search *",
        },
        criteriaVal: {
            label: 'Criteria Options'
        },
        rangeFromSymb: {
            label: "Select"
        },
        rangeToSymb: {
            label: "Select"
        },
        genderfield: {
            label: "Gender"
        },
        fromageUnits: {
            label: "Age Units"
        },
        toageUnits: {
            label: "Age Units"
        },
        eqpmntMaster: {
            label: "Equipment Master"
        },
        labprameterSrch: '',
        loader: false,
        list_value: '',
        addTerminologyDatagrid: [],
        addRefrenceranceconfigDatagrid: [],
        addListValues: [],
    },
    getApi: {
        resultType: [],
        unitsSelct: [],
        TerminologyOptions: [],
        terminologycodeDesc: [],
        criteiraOptionsel: [],
        LogicalValuesSel: [],
        GenderSel: [],
        equipmentMasterSel: [],
        saveLabparametersel: [],
        getsaveLabparameterDataresults: []
    },
    dailoagPop: {
        open: false,
        delMsg: false
    }
}

export type AppActions =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'getAllApies', payload: Partial<AppState['getApi']> }
    | { type: "dailogModal", payload: Partial<AppState['dailoagPop']> }

export const LabparameterReducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } }
        case 'getAllApies':
            return {
                ...state, getApi: { ...state.getApi, ...action.payload }
            }
        case 'dailogModal':
            return { ...state, dailoagPop: { ...state.dailoagPop, ...action.payload } }
        default:
            return state
    }
}

