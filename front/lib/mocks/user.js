export function mock(path, jwt, options) {
  const inputValue = options?.data?.inputValue;
  const page = options?.data?.page;
  switch (jwt) {
    case "admin":
      if (page !== 0)
        return {
          status: 200,
          data: {
            maxPage: 2,
            values: [
              {
                id: 5,
                firstName: "Etudiant",
                lastName: "3",
                email: "etudiant3@test.com",
                title: null,
              },
            ],
          },
        };
      else if (inputValue === "Target user")
        return {
          status: 200,
          data: {
            maxPage: 0,
            values: [
              {
                id: 100,
                firstName: "User",
                lastName: "found",
                email: "admin@test.com",
                title: "ADMIN",
              },
            ],
          },
        };
      return {
        status: 200,
        data: {
          maxPage: 2,
          values: [
            {
              id: 1,
              firstName: "Admin",
              lastName: "root",
              email: "admin@test.com",
              title: "ADMIN",
            },
            {
              id: 2,
              firstName: "Modo",
              lastName: "Modo",
              email: "modo@test.com",
              title: "MODO",
            },
            {
              id: 3,
              firstName: "Etudiant",
              lastName: "1",
              email: "etudiant1@test.com",
              title: null,
            },
            {
              id: 4,
              firstName: "Etudiant",
              lastName: "2",
              email: "etudiant2@test.com",
              title: null,
            },
          ],
        },
      };

    case "modo":
      if (page !== 0) return { status: 200, data: { maxPage: 0, values: [] } };
      return {
        status: 200,
        data: {
          maxPage: 0,
          values: [
            {
              id: 1,
              firstName: "Admin",
              lastName: "root",
              email: "admin@test.com",
              title: "ADMIN",
            },
            {
              id: 2,
              firstName: "Modo",
              lastName: "Modo",
              email: "modo@test.com",
              title: "MODO",
            },
            {
              id: 3,
              firstName: "Etudiant",
              lastName: "1",
              email: "Etudiant1@test.com",
              title: null,
            },
            {
              id: 4,
              firstName: "Etudiant",
              lastName: "2",
              email: "Etudiant2@test.com",
              title: null,
            },
          ],
        },
      };

    default:
      return { error: true };
  }
}
