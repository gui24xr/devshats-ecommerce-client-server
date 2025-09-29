"use client";
import { useState } from "react";
import { LayoutModal, FloatingCartWidget, CartDetails } from "../index";
import { useCartStore, useStoreTemplateConfig } from "@/stores";
import { redirect } from "next/navigation";

export default function CartContainer() {
  const planSettings = useStoreTemplateConfig((state) => state.planSettings);
  const [cartModalIsOpen, setCartModalIsOpen] = useState(false);



  if (planSettings.type === "plan_small") {
    return null;
  }

  const handleShowCartModal = () => {
      cartModalIsOpen ? setCartModalIsOpen(false) : setCartModalIsOpen(true);
  }
  const handleCheckout = () => {
    setCartModalIsOpen(false);
    redirect("/checkout");
  };

  return (
    <>
      <FloatingCartWidget
        onClick={handleShowCartModal}
      />

      <LayoutModal
        isOpen={cartModalIsOpen}
        onClose={setCartModalIsOpen}
        title="Mi Carrito"
        description="Detalle de carrito."
        minWidth="w-full"
        maxWidth="max-w-full"
        content={<CartDetails onCheckout={handleCheckout} onClose={handleShowCartModal} />}
      />
    </>
  );
}
