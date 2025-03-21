import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlignRight, CirclePlus, House } from "lucide-react";
import Link from "next/link";

export const HamburgerMenu = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="md:hidden p-[6px] rounded border border-transparent hover:border-secondary hover:rounded-lg transition-all duration-200">
          <AlignRight />
        </DialogTrigger>
        <DialogContent className="w-11/12 sm:max-w-md !bg-secondary pt-12 [&>button]:text-primary">
          <DialogClose asChild>
            <Link
              href={"/"}
              className="w-full flex items-center gap-3 bg-primary px-4 py-3 rounded-lg hover:bg-primary/90"
            >
              <House size={18} />
              Home
            </Link>
          </DialogClose>
          <DialogClose asChild>
            <Link
              href={"/configuration"}
              className="w-full flex items-center gap-3 bg-primary px-4 py-3 rounded-lg hover:bg-primary/90"
            >
              <CirclePlus size={18} />
              Add Configuration
            </Link>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
