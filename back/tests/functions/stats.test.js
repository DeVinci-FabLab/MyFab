const { increment } = require("../../functions/stats");

//Mock stats function
const executeQuery = require("../../functions/dataBase/executeQuery");
jest.mock("../../functions/dataBase/executeQuery");

describe("Stats increment", () => {
  const mockDb = "dataBase";
  let originalDate;

  beforeEach(() => {
    originalDate = global.Date;
    jest.clearAllMocks(); // Réinitialiser les appels de toutes les fonctions mocks avant chaque test
  });

  afterEach(() => {
    // Rétablir la fonction originale Date après chaque test
    global.Date = originalDate;
  });

  it("devrait incrémenter la valeur existante", async () => {
    // Configurer le mock de la date
    const mockDate = new Date(2023, 11, 12);
    global.Date = jest.fn(() => mockDate);

    executeQuery.run.mockResolvedValue([null, { affectedRows: 1 }]);

    const name = "testName";
    const incrementation = 5;

    await increment(mockDb, name, incrementation);

    // Vérifier que la requête de mise à jour a été appelée correctement
    expect(executeQuery.run).toHaveBeenCalledTimes(1);
    expect(executeQuery.run).toHaveBeenNthCalledWith(
      1,
      mockDb,
      expect.any(String),
      [incrementation, name, "2023"]
    );
  });

  it("devrait insérer une nouvelle valeur si elle n'existe pas", async () => {
    // Configurer le mock de la date
    const mockDate = new Date(2024, 4, 4);
    global.Date = jest.fn(() => mockDate);

    // Configurer le mock pour simuler une mise à jour avec aucune ligne affectée (valeur inexistante)
    executeQuery.run.mockResolvedValue([null, { affectedRows: 0 }]);

    const name = "testName";

    await increment(mockDb, name);

    // Vérifier que la requête d'insertion a été appelée correctement
    expect(executeQuery.run).toHaveBeenCalledTimes(2);
    expect(executeQuery.run).toHaveBeenNthCalledWith(
      1,
      mockDb,
      expect.any(String),
      [1, name, "2023"]
    );
    expect(executeQuery.run).toHaveBeenNthCalledWith(
      2,
      mockDb,
      expect.any(String),
      [name, 1, "2023"]
    );
  });
});

describe("Update ticket date", () => {
  it("Update valid", async () => {
    //Prepare
    const db = {};
    const executeQuery = jest.fn().mockResolvedValue(true);
    const idTicket = 1;

    //Execute
    await require("../../functions/stats").updateTicketDate(
      db,
      executeQuery,
      idTicket
    );

    //Tests
    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(executeQuery).toHaveBeenCalledWith(
      db,
      expect.any(String),
      expect.any(Array)
    );
  });
});
