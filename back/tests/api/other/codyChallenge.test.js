const fs = require("fs");
const filePath = __dirname + "/../../../data/codyChallengeScoreBoard.json";

describe("POST /api/codyChallenge/", () => {
  beforeEach(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  test("200_Valid", async () => {
    const data = {
      userId: 1,
      body: {
        score: 45,
        key: "25c8afeb73d5133afe3a5be83b8df7687b591d87f04d2c08ef09ec5db3db9796",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = JSON.parse(fileContent);
    expect(parsedContent.scoreboard.length).toBe(1);
    expect(parsedContent.cheaters.length).toBe(0);
  });

  test("200_2Valid", async () => {
    const data = {
      userId: 1,
      body: {
        score: 45,
        key: "25c8afeb73d5133afe3a5be83b8df7687b591d87f04d2c08ef09ec5db3db9796",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = JSON.parse(fileContent);
    expect(parsedContent.scoreboard.length).toBe(1);
    expect(parsedContent.cheaters.length).toBe(0);

    const response2 =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response2.code).toBe(200);
    expect(response2.type).toBe("code");
    const fileContent2 = fs.readFileSync(filePath, "utf8");
    const parsedContent2 = JSON.parse(fileContent2);
    expect(parsedContent2.scoreboard.length).toBe(2);
    expect(parsedContent2.cheaters.length).toBe(0);
  });

  test("200_Cheaters", async () => {
    const data = {
      userId: 1,
      body: {
        score: 45,
        key: "qsd",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = JSON.parse(fileContent);
    expect(parsedContent.scoreboard.length).toBe(0);
    expect(parsedContent.cheaters.length).toBe(1);
  });

  test("200_2Cheaters", async () => {
    const data = {
      userId: 1,
      body: {
        score: 45,
        key: "qsd",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedContent = JSON.parse(fileContent);
    expect(parsedContent.scoreboard.length).toBe(0);
    expect(parsedContent.cheaters.length).toBe(1);

    const response2 =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response2.code).toBe(200);
    expect(response2.type).toBe("code");
    const fileContent2 = fs.readFileSync(filePath, "utf8");
    const parsedContent2 = JSON.parse(fileContent2);
    expect(parsedContent2.scoreboard.length).toBe(0);
    expect(parsedContent2.cheaters.length).toBe(2);
  });

  test("200_noId", async () => {
    const data = {
      body: {
        score: 45,
        key: "qsd",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("200_nobody", async () => {
    const data = {
      userId: 1,
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("200_noscore", async () => {
    const data = {
      userId: 1,
      body: {
        key: "qsd",
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("200_nokey", async () => {
    const data = {
      userId: 1,
      body: {
        score: 45,
      },
      app: {
        executeQuery: async (db, query, options) => {
          return [null, [{ email: "test@example.com" }]];
        },
      },
    };

    const response =
      await require("../../../api/other/codyChallenge").codyChallengePost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
