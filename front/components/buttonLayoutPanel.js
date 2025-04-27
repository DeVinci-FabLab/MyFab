function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonLayoutPanel({ item, darkMode, specialFont }) {
  return (
    <div
      className={classNames(
        item.className.reduce(
          (accumulator, currentValue) => accumulator + " " + currentValue,
          "",
        ) +
          " " +
          (item.current
            ? `${
                darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-200 text-gray-900"
              }`
            : `${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-800 text-white hover:text-gray-100"
                  : "text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
              }`) +
          " group flex items-center px-2 py-2 text-sm font-medium rounded-md select-none",
      )}
      aria-current={item.current ? "page" : undefined}
    >
      <item.icon
        className={classNames(
          item.current
            ? "text-gray-500"
            : "text-gray-400 group-hover:text-gray-500",
          "mr-3 flex-shrink-0 h-6 w-6",
        )}
        aria-hidden="true"
      />
      <div>
        <p>{item.name}</p>
        {specialFont ? (
          <p className={`${specialFont} small text-gray-500`}>{item.name}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
