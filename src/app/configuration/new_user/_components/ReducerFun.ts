import { getHeaderResponse } from "@/app/_commonfeatures/header";

export interface AppState {
    field: any,
    DefaultPwd: {
        action: boolean
    },
    getApi: any
    loader: boolean,
}

export type AppAction =
    | {
        type: 'getData',
        payload: Partial<AppState['getApi']>
    }
    | { type: 'fieldVal'; payload: Partial<AppState['field']> }
    | { type: 'defaultVal'; payload: Partial<AppState['DefaultPwd']> }
    | { type: 'loader'; payload: { loader: false } }


export const initialState: AppState = {
    field: {
        empInfo:{},
        userName: {
            label: "User Name",
        },
        orgNiz:getHeaderResponse().serviceEntityId? {
            label: getHeaderResponse().serviceEntityDesc,
            value: getHeaderResponse().serviceEntityId,
          }:"",
        facility: {
            label: "Facility"
        },
        userGroup: {
            label: "User Group"
        },
        hxPopup: false,
        loader: false,
        userId: null,
        isDefaultPassword: 0
    },
    DefaultPwd: { action: false },
    getApi: {
        empData: [],
        orgnizationData: [],
        facilityData: [],
        saveUserMasterresult: [],
        userGroupData: [],
        userGroupCopyData: [],
        orgFacilityStore: [],
        userModifyHistory: [],
        historyData: [],
        userGroupTable: []
    },

    loader: false,
}

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload }, }
        case 'defaultVal':
            return { ...state, DefaultPwd: { ...state.DefaultPwd, ...action.payload }, }
        case 'getData':
            return { ...state, getApi: { ...state.getApi, ...action.payload } }
        case 'loader':
            return { ...state, ...action.payload }

        default:
            return state
    }
}