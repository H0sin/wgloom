export const InterfaceDetailHeaderCard = ({
  title,
  amount,
  amountColor,
  icon,
  showGb,
}) => {
  return (
    <div className="col-span-1 w-full p-4 flex justify-between border border-primaryLight rounded">
      <div>
        <p className="text-[#B8B8B8]">{title}</p>
        <p
          className={`text-[24px] font-bold ${
            amountColor && amountColor == "blue"
              ? "text-blue-600"
              : amountColor == "green"
              ? "text-green-600"
              : ""
          }`}
        >
          {amount}
          {showGb && <span className="ml-3">GB</span>}
        </p>
      </div>
      {icon}
    </div>
  );
};
