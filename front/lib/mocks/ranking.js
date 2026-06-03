// Mock du futur endpoint /ranking (mode test).
// Score = somme des actions PONDÉRÉES de l'agent (majoration par action) :
//   fermeture d'un ticket +3 · changement de statut +2 · message/note +1
// Celui qui a fait la majorité des actions ressort donc en tête.
// En réel : agrégé depuis log_ticketschange (+ messages), par mois / année / total.

export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      // poids indicatifs (le back fera foi) — affichés dans la légende
      weights: { close: 3, status: 2, message: 1 },
      agents: [
        { id: 8, name: "Thomas D.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 88, pointsYear: 232, pointsTotal: 388, closures: 96, actions: 300, avgDelayHours: 20, isMe: false }, // prettier-ignore
        { id: 5, name: "Marie L.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 67, pointsYear: 255, pointsTotal: 426, closures: 110, actions: 340, avgDelayHours: 16, isMe: false }, // prettier-ignore
        { id: 1, name: "Vous", role: "Administrateur", roleColor: "db1010", pointsMonth: 54, pointsYear: 182, pointsTotal: 291, closures: 74, actions: 210, avgDelayHours: 22, isMe: true }, // prettier-ignore
        { id: 7, name: "Léa B.", role: "Modérateur", roleColor: "eb9413", pointsMonth: 41, pointsYear: 90, pointsTotal: 123, closures: 30, actions: 95, avgDelayHours: 28, isMe: false }, // prettier-ignore
        { id: 4, name: "Lucas P.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 36, pointsYear: 150, pointsTotal: 255, closures: 64, actions: 190, avgDelayHours: 26, isMe: false }, // prettier-ignore
        { id: 6, name: "Emma R.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 28, pointsYear: 132, pointsTotal: 219, closures: 55, actions: 165, avgDelayHours: 19, isMe: false }, // prettier-ignore
        { id: 9, name: "Hugo M.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 21, pointsYear: 99, pointsTotal: 162, closures: 40, actions: 120, avgDelayHours: 31, isMe: false }, // prettier-ignore
        { id: 11, name: "Chloé V.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 15, pointsYear: 24, pointsTotal: 24, closures: 6, actions: 18, avgDelayHours: 40, isMe: false }, // prettier-ignore
        { id: 10, name: "Nathan G.", role: "Agent MyFab", roleColor: "e0dd22", pointsMonth: 9, pointsYear: 45, pointsTotal: 66, closures: 16, actions: 48, avgDelayHours: 35, isMe: false }, // prettier-ignore
        // Ancien agent : plus de rôle myFabAgent mais activité conservée.
        // pointsMonth/Year = 0 -> n'apparaît que dans "Tout le temps".
        { id: 12, name: "Antoine F.", role: "Ancien agent", roleColor: "9ca3af", former: true, pointsMonth: 0, pointsYear: 0, pointsTotal: 140, closures: 34, actions: 102, avgDelayHours: 24, isMe: false }, // prettier-ignore
      ],
    },
  };
}
