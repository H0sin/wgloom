import { HamburgerMenu } from "@/components/Header/HamburgerMenu";

export const Header = () => {
  return (
    <div className="w-full  border-b border-b-secondary shadow">
      <div className="w-full h-[56px]  max-w-[1440px] mx-auto flex justify-between items-center px-4">
        <p className="text-[24px] font-bold tracking-wider">WGDashboard</p>
        <HamburgerMenu />
      </div>
    </div>
  );
};
