export const ConfigurationFormCard = ({ title, children }) => {
  return (
    <div className="w-full rounded border border-primaryLight overflow-hidden relative">
      <div className="bg-[#1F1F1F] px-5 py-2 font-bold border-b border-b-primaryLight">
        {title}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};
