import { getHeaderResponse } from "@/app/_commonfeatures/header";
import moment from "moment";

export interface AppState {
    field: any,
    userGroupRoleAssignmentTable: any,
    addUserdatatable: any,
    getApi: {}
}

export const initialState: AppState = {
    field: {
        roleConfiguration: null,
        empRole: {
            label: 'Role'
        },
        userGroupRoleOrg: getHeaderResponse().serviceEntityId? {
            label: getHeaderResponse().serviceEntityDesc,
            value: getHeaderResponse().serviceEntityId,
          }:{label:"Organization"},
        userGroupRoleFacility: {
            label: 'Facility'
        },
        empUser: {
            label: "User Name"
        },
        activeFromDate: moment().format('YYYY-MM-DD'),
        loader: false,
        groupId: null,
        blockUnblock: {
            label: "Block / Unblock"
        },
        resonForBlock: {
            label: 'Reason'
        },
        statusList: [
            {
                value: 0,
                label: "Block",
            },
            {
                value: 1,
                label: "Unblock",
            },
        ],
        blockloader: false,
        editEmpDetails: []
    },
    userGroupRoleAssignmentTable: [],
    addUserdatatable: [],
    getApi: {
        userMastergroupData: [],
        reasonList: [],
        facilityselect: []
    }
}

export type AppAction =
    | { type: 'fieldVal', payload: Partial<AppState['field']> }
    | { type: 'userGroupRoleAssignmentStore', payload: Partial<AppState['userGroupRoleAssignmentTable']> }
    | { type: 'getAllApi', payload: Partial<AppState['getApi']> }
    | { type: "addUsers", payload: Partial<AppState['addUserdatatable']> }


export const AllValuesgive = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case 'fieldVal':
            return { ...state, field: { ...state.field, ...action.payload } };
        case 'userGroupRoleAssignmentStore':
            return { ...state, ...action.payload };
        case 'getAllApi':
            return { ...state, getApi: { ...state.getApi, ...action.payload } };
        case 'addUsers':
            return { ...state, ...action.payload }
        default:
            return state;
    }
};
