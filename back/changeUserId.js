const fs = require("fs");

if (!process.argv[2] || !process.argv[3]) {
  console.log("Use node test.js [targetId] [newId]");
  return;
}

// Codes ANSI pour les couleurs
const reset = "\x1b[0m";
const red = "\x1b[31m";

// Imprimer en rouge
console.log(
  red + "⚠️  WARNING This script should be used with caution WARNING ⚠️" + reset
);
console.log("This script can be used to change user ids in the database.");
console.log(
  "If the database ids are not correct, data can be modified and alter MyFab's operation."
);
console.log(
  red + "⚠️  WARNING This script should be used with caution WARNING ⚠️" + reset
);

const swapUserId = "(SELECT i_id FROM `users` WHERE v_email = 'deleteme')";
//const swapUserId = "(SELECT i_id FROM `users` WHERE v_email = 'system@system.com')";
const targetId = process.argv[2];
const newId = process.argv[3];
let swapbuffer = true;

function swapUpdate(table, field) {
  if (swapbuffer)
    return `UPDATE ${table} SET ${field} = ${swapUserId} WHERE ${field} = ${targetId};`;
  return `UPDATE ${table} SET ${field} = ${newId} WHERE ${field} = ${swapUserId};`;
}

let text = "--⚠️ WARNING This code should be used with caution WARNING ⚠️";

text =
  text +
  "\n" +
  "INSERT INTO `users` (`i_id`, `v_firstName`, `v_lastName`, `v_email`, `v_password`, `dt_creationdate`, `i_idschool`, `i_schoolyear`, `v_discordid`, `v_language`, `dt_ruleSignature`, `b_deleted`, `b_visible`, `b_mailValidated`, `b_isMicrosoft`, `b_darkMode`, `v_title`, `dt_rickrolled`) VALUES (NULL, 'bufferUser', 'bufferUser', 'deleteme', 'password', current_timestamp(), NULL, NULL, NULL, 'fr', NULL, '0', '1', '0', '0', '0', NULL, NULL);";

//Set element to the new user
text = text + "\n" + swapUpdate("log_roleschange", "i_idUserAdmin");
text = text + "\n" + swapUpdate("log_roleschange", "i_idUserTarget");
text = text + "\n" + swapUpdate("log_ticketschange", "i_idUser");
text = text + "\n" + swapUpdate("log_ticketsfileschange", "i_idUser");
text = text + "\n" + swapUpdate("mailtocken", "i_idUser");
text = text + "\n" + swapUpdate("printstickets", "i_idUser");
text = text + "\n" + swapUpdate("rolescorrelation", "i_idUser");
text = text + "\n" + swapUpdate("ticketfiles", "i_idUser");
text = text + "\n" + swapUpdate("ticketmessages", "i_idUser");

text =
  text + "\n" + `UPDATE users SET i_id = ${newId} WHERE i_id = ${targetId};`;

//Set element to the user with id Changed
swapbuffer = false;
text = text + "\n" + swapUpdate("log_roleschange", "i_idUserAdmin");
text = text + "\n" + swapUpdate("log_roleschange", "i_idUserTarget");
text = text + "\n" + swapUpdate("log_ticketschange", "i_idUser");
text = text + "\n" + swapUpdate("log_ticketsfileschange", "i_idUser");
text = text + "\n" + swapUpdate("mailtocken", "i_idUser");
text = text + "\n" + swapUpdate("printstickets", "i_idUser");
text = text + "\n" + swapUpdate("rolescorrelation", "i_idUser");
text = text + "\n" + swapUpdate("ticketfiles", "i_idUser");
text = text + "\n" + swapUpdate("ticketmessages", "i_idUser");

text = text + "\n" + `DELETE FROM users WHERE i_id = ${swapUserId};`;
text = text + "\n--⚠️ WARNING This code should be used with caution WARNING ⚠️";
text = text + "\n" + `SELECT i_id, v_email FROM users ORDER BY i_id ASC;`;

try {
  text = text + "\n";
  fs.writeFileSync(__dirname + "/changeUserId.sql", text);
  console.log("Export success !");
} catch (error) {
  console.error("Export fail :", error);
}
