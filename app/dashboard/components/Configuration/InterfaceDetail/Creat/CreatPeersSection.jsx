"use client";
import { useState } from "react";
import { CreatPeersSectionAddBulkForm } from "./CreatPeersSectionAddBulkForm";
import { CreatPeersSectionOptionalForm } from "./CreatPeersSectionOptionalForm";
import { Switch } from "@/components/ui/switch";

export const CreatPeersSection = () => {
  const [isCheckBulkAdd, setIsCheckBulkAdd] = useState(false);

  return (
    <>
      <label className="w-fit flex items-center cursor-pointer justify-normal gap-6 pt-6 pb-3">
        <Switch
          checked={isCheckBulkAdd}
          onCheckedChange={setIsCheckBulkAdd}
          className={`!bg-primaryLight ${isCheckBulkAdd && "!bg-[#E04000]"}`}
        />
        <span className="text-[16px] font-semibold text-white">Bulk Add</span>
      </label>
      <p className="text-sm text-secondary pb-6">
        By adding peers by bulk, each peer&apos;s name will be auto generated,
        and Allowed IP will be assign to the next available IP.
      </p>
      {isCheckBulkAdd ? (
        <>
          <CreatPeersSectionAddBulkForm />
        </>
      ) : (
        <>
          <CreatPeersSectionOptionalForm />
        </>
      )}
    </>
  );
};
