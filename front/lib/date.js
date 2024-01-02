import moment from "moment";

export function format(date, style) {
  if (!date) return "NO DATE PROVIDED";
  switch (style) {
    case "fr":
      return moment(date).format("DD/MM/YYYY HH:mm");
    case "frAt":
      return moment(date).format("DD/MM/YYYY [à] HH:mm");
    case "us":
      return moment(date).format("MM/DD/YYYY HH:mm");
    case "usAt":
      return moment(date).format("MM/DD/YYYY [at] HH:mm");

    default:
      return moment(date).format("DD/MM/YYYY HH:mm");
  }
}

export function dateDiff(date1, date2) {
  const diffInMilliseconds = Math.abs(date2 - date1);

  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;
  const remainingDays = days % 30;
  const remainingMonths = months % 12;

  if (years !== 0) return `${years} année${years > 1 ? "s" : ""}`;
  if (remainingMonths !== 0) return `${remainingMonths} mois`;
  if (remainingDays !== 0)
    return `${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
  if (remainingHours !== 0)
    return `${remainingHours} heure${remainingHours > 1 ? "s" : ""}`;
  if (remainingMinutes !== 0)
    return `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
  if (remainingSeconds !== 0)
    return `${remainingSeconds} seconde${remainingSeconds > 1 ? "s" : ""}`;
  return `${diffInMilliseconds} milliseconde${
    diffInMilliseconds > 1 ? "s" : ""
  }`;
}
