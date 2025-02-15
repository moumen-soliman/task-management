const InfoLabel = ({ name }: { name: string }) => {
  return (
    <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize whitespace-nowrap">
      {name.replaceAll("_", " ")}
    </span>
  );
};

export default InfoLabel;

  