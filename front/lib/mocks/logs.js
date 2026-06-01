export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      maxPage: 1,
      total: 3,
      values: [
        {
          dt: "2026-05-31T12:04:00.000Z",
          category: "user",
          actorName: "Admin T.",
          action: "upd_note",
          targetType: "user",
          targetId: 3,
          detail: "A relancé 3x sans venir chercher ses pièces.",
        },
        {
          dt: "2026-05-31T11:58:00.000Z",
          category: "ticket",
          actorName: "Admin T.",
          action: "upd_status",
          targetType: "ticket",
          targetId: 9,
          detail: "2",
        },
        {
          dt: "2026-05-31T11:30:00.000Z",
          category: "role",
          actorName: "Admin T.",
          action: "add_role",
          targetType: "user",
          targetId: 12,
          detail: "Agent MyFab",
        },
      ],
    },
  };
}
