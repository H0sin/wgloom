import Link from "next/link";
import { House } from "lucide-react";

export const Sidebar = ({ visible, closeModal }) => {
  return (
    <div
      className={` md:block md:w-1/4 lg:w-1/5 h-full px-4 py-6 ${
        visible ? "block !w-full !p-2" : "hidden"
      }`}
    >
      <div
        className={`w-full h-full rounded-lg border-2 border-primaryLight p-3 ${
          visible && "bg-primary"
        }`}
      >
        <Link
          href={"/"}
          onClick={closeModal}
          className="flex items-center gap-3 w-full px-4 py-2 border border-primaryLight hover:bg-[#292929] rounded transition-all duration-75"
        >
          <House size={18} />
          Home
        </Link>
      </div>
    </div>
  );
};
