"use client";

import { useState } from "react";
import Image from "next/image";
import countries from "i18n-iso-countries";
import { countryCodeToEmoji } from "@/lib/helpers";
import EditableTextWrapper from "@/components/editableText";
import { updateUser } from "@/lib/actions/actions";
import { toast } from "react-toastify";

export default function EditUesrDataComponent({ userData, noCountries }) {
  const [userdata, setUserdata] = useState(userData);
  // const emoji = countryCodeToEmoji("RO");
  const setName = async (val) => {
    const nameCopy = userdata.name;
    setUserdata((prev) => {
      return { ...prev, name: val };
    });
    try {
      await updateUser({ name: val });
    } catch (error) {
      setUserdata({ ...userdata, name: nameCopy });
      toast("Error changing name", { position: "bottom-right" });
      console.warn({ error });
    }
  };
  return (
    <div className="w-full p-12 bg-green-100/40">
      <Image
        src={userdata.avatar}
        alt={userdata.name}
        width={240}
        height={240}
        className="inline-block rounded-full align-middle"
      />
      <div className="ml-24 inline-block h-60 align-middle">
        <EditableTextWrapper
          className="my-10"
          label="Name"
          value={userdata.name}
          size="lg"
          onSave={setName}
        />

        <span className="inline">🌍🏞️</span>

        <h4 className="text-xl">You visited {noCountries} countries ✅</h4>
      </div>
    </div>
  );
}
