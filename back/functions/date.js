const moment = require("moment");

module.exports.format = (date, style) => {
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
};
