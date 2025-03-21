import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const ConfigurationHeader = () => {
  return (
    <Link
      href={"/"}
      className="w-fit flex items-center gap-4 justify-start text-[28px] font-bold hover:text-secondary"
    >
      <ChevronLeft size={32} />
      New Interface
    </Link>
  );
};
