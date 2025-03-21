"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export const CreatPeersHeader = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="w-fit flex items-center gap-4 justify-start text-[28px] font-bold cursor-pointer hover:text-secondary"
    >
      <ChevronLeft size={32} />
      Add Peers
    </div>
  );
};
