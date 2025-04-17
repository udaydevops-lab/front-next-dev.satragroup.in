
interface AppState {
    field: any,
    getApi: any
}

export const radiologyDashboardState: AppState = {
    field: {},
    getApi: {}
}

export type AppAction =
    | { type: "fieldVal", payload: Partial<AppState['field']> }
    | { type: "getApiAll", payload: Partial<AppState['getApi']> }

export const radiologyDashboardReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } }
        case "getApiAll":
            return { ...state, getApi: { ...state.getApi, ...action.payload } }
        default:
            return state
    }
}