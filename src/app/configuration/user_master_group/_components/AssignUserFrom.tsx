import React, { Dispatch, SetStateAction } from 'react'
import { MasterHeading } from '../../_components'
import ActionButton from '@/app/_common/button'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { toast } from 'react-toastify'
import services from '@/app/utilities/services'
import { checkIsRoleAssignedToLocation } from '@/app/utilities/api-urls'

interface AssignUserFromprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getuserDetailsbyId: any
}

const AssignUserFrom: React.FC<AssignUserFromprops> = ({
    state,
    dispatch,
    getuserDetailsbyId
}) => {

    const onselectUser = (data: any) => {
        // console.log(data)
        dispatch({
            type: "fieldVal",
            payload: {
                empUser: { ...data }
            }
        })
        getuserDetailsbyId(data.userId)
    }
const handleAdd=()=>{
    dispatch({
        type: "addUsers",
        payload: {
            addUserdatatable: [...state.addUserdatatable, state.field.empDetails[0]]
        }
    })

    dispatch({
        type: "fieldVal",
        payload: {
            empUser: {
                label: "User Name"
            }
        }
    })
}
    const AddMultiplerole = () => {
        const index=state.userGroupRoleAssignmentTable.findIndex((item:any)=>item.isRolePrimary==1)
        if(index<0){
            toast.error('Please select primary role')
            return
        }
        // Check if the user already exists in addUserdatatable
        console.log("state.addUserdatatable",state.addUserdatatable)
        const isDuplicateUser = state.addUserdatatable.some(
            (user: any) => user.userName === state.field.empUser.userName
        );

        if (isDuplicateUser) {
            // Handle duplicate user logic here, such as showing an error message or ignoring the duplicate
            console.log("Duplicate user found!");
            return toast.error("You have entered same user again"); // Exit the function without dispatching the action
        }
        services
          .get(
            `${checkIsRoleAssignedToLocation}?locationId=${state.userGroupRoleAssignmentTable[0].locationId}&groupId=&userId=${state.field.empUser.userId}`
          )
          .then((response) => {
            if (!response.data) {
              toast.error(
                "Selected role location is not assigned to this user. Please update the user's location accordingly."
              );
              return;
            }
            handleAdd()
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
            ``;
            return;
          });
       
    }

    return (
        <>
            <div className='w-full border-t border-gray-300 my-3'></div>
            <MasterHeading
                heading={'Assign User'}
            />

            <div className='w-full flex gap-4 mb-4'>
                <div className='w-1/2'>
                    <ReactSelectBox
                        value={state.field.empUser}
                        options={state.getApi.getAllsaveusers}
                        onChange={onselectUser}
                        label="User Name"
                        isSearchable={true}
                    />
                </div>
                <ActionButton
                    buttonText="Add User"
                    handleSubmit={AddMultiplerole}
                    width="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    disabled={
                        state.field.empUser?.label !== 'User Name' ?
                            false : true
                    }
                />
            </div>
        </>
    )
}

export default AssignUserFrom
