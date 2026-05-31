function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonLayoutPanel({ item, specialFont }) {
  return (
    <div
      className={classNames(
        item.className.join(" "),
        "relative group flex items-center gap-3 px-3 py-2 text-sm rounded-md select-none",
        item.current
          ? "font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-night-800"
          : "font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-800",
      )}
      aria-current={item.current ? "page" : undefined}
    >
      {item.current ? (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand-magenta" />
      ) : null}
      <item.icon
        className={classNames(
          item.current
            ? "text-brand-magenta"
            : "text-gray-400 group-hover:text-gray-500",
          "flex-shrink-0 h-5 w-5",
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
