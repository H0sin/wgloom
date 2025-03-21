"use client";
import { UpdateConfigurationStatus } from "@/api/interface";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownToDot,
  ArrowUpDown,
  ArrowUpFromDot,
  ChevronRight,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";

export const InterfaceItem = ({ interfaceDetail, reFetch }) => {
  const { name, peers, privateKey, status } = interfaceDetail;

  const [ChangeStatusLoading, setChangeStatusLoading] = useState(false);

  const ChangeStatus = async () => {
    setChangeStatusLoading(true);
    const ChangeStatusValue = {
      status: status === "disabled" ? 0 : 1,
      name: interfaceDetail.name,
    };
    await UpdateConfigurationStatus(ChangeStatusValue)
      .then(async () => {
        await reFetch();
      })
      .finally(() => setChangeStatusLoading(false));
  };

  return (
    <div className="w-full my-4 border-2 border-primaryLight rounded hover:rounded-lg hover:border-blue-400 overflow-hidden transition-all duration-150">
      <Link
        href={`/configuration/${name}`}
        className="p-4 border-b-2 border-b-primaryLight flex justify-between items-center hover:bg-[#141414]"
      >
        <div className="">
          <span className="w-[6px] h-[6px] mr-2 bg-green-500 rounded-full animate-ping"></span>
          {name}
        </div>
        <ChevronRight size={18} />
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[14px] px-4 py-4">
        <div className="col-span-1 flex items-center gap-1">
          <ArrowUpDown size={16} />1<span>GB</span>
        </div>
        <div className="col-span-1 flex items-center gap-1 text-blue-600">
          <ArrowDownToDot size={16} />2<span>GB</span>
        </div>
        <div className="col-span-1 flex items-center gap-1 text-green-600">
          <ArrowUpFromDot size={16} />3<span>GB</span>
        </div>
        <div className="col-span-1 flex items-center gap-1">
          <span className="w-[6px] h-[6px] mr-2 bg-green-400 rounded-full animate-ping"></span>
          {peers?.length}
          <span>Peers</span>
        </div>
      </div>
      <div className="w-full px-4 pb-4 flex justify-between items-center">
        <div className="w-full md:flex pr-5">
          <span className="whitespace-nowrap">Public Key:</span>
          <span className="ml-2 dark:text-gray-400 break-all">
            {privateKey}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            disabled={ChangeStatusLoading}
            checked={status !== "disabled"}
            onCheckedChange={ChangeStatus}
            className={`${status !== "disabled" && "!bg-green-500"}`}
          />
          <span className="font-bold">
            {status === "disabled" ? "OFF" : "ON"}
          </span>
        </div>
      </div>
    </div>
  );
};
