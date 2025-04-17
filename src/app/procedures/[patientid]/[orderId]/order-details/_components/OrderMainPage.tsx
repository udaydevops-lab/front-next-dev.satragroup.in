import React, { useEffect, useState } from "react";
import OrderGrid from "./OrderGrid";
import OrderForm from "./OrderForm";
import { useParams } from "next/navigation";
import services from "@/app/utilities/services";
import {
  getProceduresOrderIdDetailsBanner,
} from "@/app/utilities/api-urls";

export default function OrderMainPage() {
  const { patientid, orderId } = useParams();
  const [orderGrid, setOrderGrid] = useState<any>([]);
  const getOrderData = async () => {
    services.get(getProceduresOrderIdDetailsBanner + orderId).then((response) => {
      setOrderGrid(response.data);
    });
  };
  useEffect(() => {
    getOrderData();
  }, []);
  return (
    <div>
      <OrderGrid data={orderGrid} />
      <OrderForm />
    </div>
  );
}
