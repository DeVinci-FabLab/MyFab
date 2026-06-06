// Mock du endpoint /ranking (mode test) — modèle v2.
// Score par TICKET DISTINCT traité (anti-triche) :
//   participation +2 / ticket · bonus fermeture stable +3 (=> fermeture = 5).
// Crédit partagé : tous les contributeurs touchent leur +2, le finisseur +3.
// En réel : dérivé de log_ticketschange + ticketmessages + printstickets.
// Valeurs calées sur une échelle réaliste (année jusqu'à ~1250 pts) pour
// illustrer les rangs Valorant (Radiant à 1300 sur l'année / 200 sur le mois).

export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      weights: { participation: 2, close: 5 },
      agents: [
        { id: 5, name: "Marie L.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 140, pointsYear: 1250, pointsTotal: 2600, closures: 280, ticketsHandled: 540, sharedTickets: 160, avgDelayHours: 16, streak: 9, isMe: false }, // prettier-ignore
        { id: 8, name: "Thomas D.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 120, pointsYear: 1080, pointsTotal: 2100, closures: 240, ticketsHandled: 470, sharedTickets: 140, avgDelayHours: 20, streak: 5, isMe: false }, // prettier-ignore
        { id: 1, name: "Vous", role: "Administrateur", roleColor: "db1010", pointsMonth: 95, pointsYear: 760, pointsTotal: 1500, closures: 168, ticketsHandled: 330, sharedTickets: 100, avgDelayHours: 22, streak: 7, isMe: true }, // prettier-ignore
        { id: 4, name: "Lucas P.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 70, pointsYear: 540, pointsTotal: 1100, closures: 120, ticketsHandled: 240, sharedTickets: 72, avgDelayHours: 26, streak: 3, isMe: false }, // prettier-ignore
        { id: 6, name: "Emma R.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 55, pointsYear: 410, pointsTotal: 820, closures: 92, ticketsHandled: 180, sharedTickets: 54, avgDelayHours: 19, streak: 4, isMe: false }, // prettier-ignore
        { id: 7, name: "Léa B.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 40, pointsYear: 300, pointsTotal: 600, closures: 66, ticketsHandled: 132, sharedTickets: 36, avgDelayHours: 28, streak: 2, isMe: false }, // prettier-ignore
        { id: 9, name: "Hugo M.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 30, pointsYear: 230, pointsTotal: 460, closures: 50, ticketsHandled: 100, sharedTickets: 28, avgDelayHours: 31, streak: 1, isMe: false }, // prettier-ignore
        { id: 10, name: "Nathan G.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 18, pointsYear: 140, pointsTotal: 280, closures: 30, ticketsHandled: 62, sharedTickets: 16, avgDelayHours: 35, streak: 1, isMe: false }, // prettier-ignore
        { id: 11, name: "Chloé V.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 10, pointsYear: 60, pointsTotal: 120, closures: 12, ticketsHandled: 28, sharedTickets: 6, avgDelayHours: 40, streak: 1, isMe: false }, // prettier-ignore
        // Ancien agent : plus de rôle, activité conservée. Actif sur l'année
        // mais pas ce mois-ci -> visible dans "Cette année", absent de "Ce mois-ci".
        { id: 12, name: "Antoine F.", role: "Ancien agent", roleColor: "9ca3af", former: true, pointsMonth: 0, pointsYear: 180, pointsTotal: 900, closures: 40, ticketsHandled: 110, sharedTickets: 30, avgDelayHours: 24, streak: 0, isMe: false }, // prettier-ignore
      ],
    },
  };
}
