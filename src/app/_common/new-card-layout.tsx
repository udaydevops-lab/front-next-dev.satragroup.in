"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function NewCardLayout(props: any) {
  return (
    <Card className="mt-6 w-96">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {props.label}
        </Typography>
        <Typography>{props.content}</Typography>
      </CardBody>
    </Card>
  );
}
