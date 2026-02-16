"use client";

import { Avatar } from "@heroui/react";
import { useState } from "react";
import countries from "i18n-iso-countries";
import { countryCodeToEmoji } from "@/lib/helpers";
import EditableTextWrapper from "@/components/editableText";
import { updateUser } from "@/lib/actions/actions";
import { toast } from "react-toastify";

export default function EditUesrDataComponent({ userData, noCountries }) {
  const [userdata, setUserdata] = useState(userData);
  const emoji = countryCodeToEmoji("RO");
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
      <Avatar
        size="lg"
        src={userdata.avatar}
        // src="https://stagiipebune.ro/media/cache/c4/33/c43378787eaf940646f7be78c3dd3d8f.png"
        className="inline-block size-60 align-middle"
      />
      <div className="ml-24 inline-block h-60 align-middle">
        <EditableTextWrapper
          className="my-10"
          label="Name"
          value={userdata.name}
          size="lg"
          onSave={setName}
        />
        {/* <h4 className="text-xl mb-10">City, Country {emoji} </h4> */}

        <span className="inline">{emoji}</span>

        <h4 className="text-xl">You visited {noCountries} countries</h4>
      </div>
    </div>
  );
}
