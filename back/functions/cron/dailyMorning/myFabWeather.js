function getSpecialDay({ dateTag }) {
  switch (dateTag) {
    case "04/05":
      return { name: "Yodair", text: "", profilPicture: "" };
    case "06/05":
      return { name: "Darth Maul", text: "", profilPicture: "" };
    case "14/07":
      return {
        name: "Philippe",
        text: "https://www.youtube.com/watch?v=bIft0PeKoJw",
        profilPicture: "",
      };
    case "31/10":
      return { name: "Yodair", text: "", profilPicture: "" };
    case "25/12":
      return {
        name: "Père nono (pas le petit robot)",
        text: "",
        profilPicture: "",
      };
  }
}

module.exports.action = action;
async function action(app) {
  const date = new Date();
  const dateTag =
    ("0" + date.getDate()).slice(-2) +
    "/" +
    ("0" + (date.getMonth() + 1)).slice(-2);
  //console.log(dateTag);
}
