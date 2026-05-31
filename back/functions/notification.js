// Crée une notification in-site pour un utilisateur et prévient son socket en temps réel.
// Volontairement "best-effort" : une notification qui échoue ne doit jamais casser
// l'action principale (changement de statut, message, etc.).
module.exports.createNotification = async function createNotification(
  app,
  idUser,
  message,
  link
) {
  try {
    if (!idUser || !message) return;
    const query = `INSERT INTO notifications (i_idUser, v_message, v_link) VALUES (?, ?, ?)`;
    const res = await app.executeQuery(app.db, query, [
      idUser,
      String(message).substring(0, 255),
      link ? String(link).substring(0, 100) : null,
    ]);
    if (res && res[0]) {
      console.log(res[0]);
      return;
    }
    // Prévient le client connecté (room user-<id>) pour rafraîchir la cloche.
    if (app.io && typeof app.io.to === "function") {
      app.io.to(`user-${idUser}`).emit("new-notification");
    }
  } catch (error) {
    /* c8 ignore next */
    console.log("createNotification error:", error && error.message);
  }
};
