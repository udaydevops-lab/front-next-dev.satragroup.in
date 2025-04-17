import React from "react";

function EditIcon(props:any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={props.onClick()}>
    <path
      id="SVGRepo_iconCarrier"
      fill="#080341"
      fillRule="evenodd"
      d="M8.56 20.25l12-12-4.81-4.81-12 12v4.81h4.81zm7.19-14.69l2.69 2.69-1.94 1.94-2.69-2.69 1.94-1.94zm-3 3l2.69 2.69-7.5 7.5H5.25v-2.69l7.5-7.5z"
      clipRule="evenodd"
    ></path>
  </svg>
  );
}

export default EditIcon;
