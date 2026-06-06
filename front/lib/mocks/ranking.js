// Mock du endpoint /ranking (mode test) — modèle v2.
// Score par TICKET DISTINCT traité (anti-triche) :
//   participation +2 / ticket · bonus fermeture stable +3 (=> fermeture = 5).
// Crédit partagé : tous les contributeurs touchent leur +2, le finisseur +3.
// En réel : dérivé de log_ticketschange + ticketmessages + printstickets.

export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      weights: { participation: 2, close: 5 },
      agents: [
        { id: 5, name: "Marie L.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 67, pointsYear: 255, pointsTotal: 426, closures: 78, ticketsHandled: 168, sharedTickets: 54, avgDelayHours: 16, streak: 9, isMe: false }, // prettier-ignore
        { id: 8, name: "Thomas D.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 54, pointsYear: 232, pointsTotal: 388, closures: 70, ticketsHandled: 150, sharedTickets: 48, avgDelayHours: 20, streak: 5, isMe: false }, // prettier-ignore
        { id: 1, name: "Vous", role: "Administrateur", roleColor: "db1010", pointsMonth: 41, pointsYear: 182, pointsTotal: 291, closures: 52, ticketsHandled: 118, sharedTickets: 37, avgDelayHours: 22, streak: 7, isMe: true }, // prettier-ignore
        { id: 4, name: "Lucas P.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 36, pointsYear: 150, pointsTotal: 255, closures: 44, ticketsHandled: 104, sharedTickets: 30, avgDelayHours: 26, streak: 3, isMe: false }, // prettier-ignore
        { id: 6, name: "Emma R.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 28, pointsYear: 132, pointsTotal: 219, closures: 38, ticketsHandled: 88, sharedTickets: 24, avgDelayHours: 19, streak: 4, isMe: false }, // prettier-ignore
        { id: 7, name: "Léa B.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 22, pointsYear: 90, pointsTotal: 123, closures: 18, ticketsHandled: 54, sharedTickets: 12, avgDelayHours: 28, streak: 2, isMe: false }, // prettier-ignore
        { id: 9, name: "Hugo M.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 14, pointsYear: 99, pointsTotal: 162, closures: 26, ticketsHandled: 70, sharedTickets: 16, avgDelayHours: 31, streak: 1, isMe: false }, // prettier-ignore
        { id: 10, name: "Nathan G.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 9, pointsYear: 45, pointsTotal: 66, closures: 10, ticketsHandled: 32, sharedTickets: 6, avgDelayHours: 35, streak: 1, isMe: false }, // prettier-ignore
        { id: 11, name: "Chloé V.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 6, pointsYear: 24, pointsTotal: 24, closures: 4, ticketsHandled: 11, sharedTickets: 2, avgDelayHours: 40, streak: 1, isMe: false }, // prettier-ignore
        // Ancien agent : plus de rôle, activité conservée. Actif l'an dernier
        // mais pas ce mois-ci -> visible dans "Cette année", absent de "Ce mois-ci".
        { id: 12, name: "Antoine F.", role: "Ancien agent", roleColor: "9ca3af", former: true, pointsMonth: 0, pointsYear: 60, pointsTotal: 140, closures: 22, ticketsHandled: 64, sharedTickets: 18, avgDelayHours: 24, streak: 0, isMe: false }, // prettier-ignore
      ],
    },
  };
}
