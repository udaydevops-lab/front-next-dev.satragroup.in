import { deleteFavourite } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Button,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const DeleteFavourite = (props: any) => {
  const [modaloc, setModaloc] = useState<any>({
    openfav: false,
  });

  const onDeleteFavourite = (id: any) => {
    try {
      services
        .create(`${deleteFavourite}${id}`, {})
        .then((response) => {
          toast.success("Successfully Deleted the record");
          props.setPopupOpenFav(false);
          props.getFavouriteDiagnosisData();
        })
        .catch((e) => {
          console.log(e.message);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Dialog
        open={props.popupOpenFav}
        handler={() => props.setPopupOpenFav(false)}
        size={"sm"}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="py-5"
      >
        <DialogHeader className=" justify-center">
          <div className="w-100">
            <div className="text-center text-[20px] text-blue-500">
              Are you Sure
            </div>
            <div className="text-center text-[20px] text-blue-500">
              You want to Delete?
            </div>
          </div>
        </DialogHeader>
        <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
          <strong>Note:</strong>
          Once you Delete this record, it will be deleted entirely from my
          favourites.
        </DialogBody>
        <DialogFooter className="text-center justify-center">
          <Button
            variant="gradient"
            color="blue"
            value={"Yes"}
            className="mr-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              onDeleteFavourite(props.popupFavId); // Trigger the API call
            }}
          >
            <span>Yes</span>
          </Button>
          <Button
            variant="gradient"
            className="bg-red-500 hover:bg-red-600"
            color="red"
            onClick={() => props.setPopupOpenFav(false)}
          >
            <span>No</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
