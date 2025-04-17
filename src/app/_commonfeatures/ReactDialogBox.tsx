import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
} from "@material-tailwind/react";

type Size = "sm" | "md" | "lg";

interface dialogBoxReact {
    open: boolean,
    handler: () => void,
    size?: Size,
    btnText1: string,
    btnText2: string
    handleClick: () => void,
    handleCancel: () => void
}

const ReactDialogBox: React.FC<dialogBoxReact> = ({
    open,
    handler,
    size,
    btnText1,
    btnText2,
    handleClick,
    handleCancel
}) => {
    return (
        <div>
            <Dialog
                open={open}
                handler={handler}
                size={size || "sm"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5"
            >
                <DialogHeader className=" justify-center">
                    <div className="w-100">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            you want to Delete this record?
                        </div>
                    </div>
                </DialogHeader>
                <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                    <strong>Note:</strong>
                    Once you Delete this record, you cannot rollback
                </DialogBody>
                <DialogFooter className="text-center justify-center">
                    {/* {footer} */}
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                            handleClick();
                        }}
                    >
                        <span>{btnText1}</span>
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-red-500 hover:bg-red-600"
                        color="red"
                        onClick={() => {
                            handleCancel();
                        }}
                    >
                        <span>{btnText2}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default ReactDialogBox;