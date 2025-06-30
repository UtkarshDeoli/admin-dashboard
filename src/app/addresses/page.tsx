"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddressesManager from "@/components/Addresses/AddressesManager";

export default function Addresses() {
  return (
    <DefaultLayout>
      <AddressesManager />
    </DefaultLayout>
  );
}
