describe("generateCode", () => {
  test("Test one code", async () => {
    const code =
      await require("../../functions/userAuthorization").generateCode(
        new Date()
      );

    expect(code != null).toBe(true);
  });

  test("Test multiples codes", async () => {
    const date = new Date();
    date.setFullYear(1977);
    date.setMonth(4);
    date.setDate(25);
    date.setHours(10);
    date.setMinutes(0);
    date.setSeconds(0);
    const firstCode =
      await require("../../functions/userAuthorization").generateCode(date);
    date.setSeconds(20);
    const secondCode =
      await require("../../functions/userAuthorization").generateCode(date);

    expect(firstCode != null).toBe(true);
    expect(secondCode != null).toBe(true);
    expect(firstCode != secondCode).toBe(true);
  });
});

describe("checkSpecialCode", () => {
  test("Check code now", async () => {
    const code =
      await require("../../functions/userAuthorization").generateCode(
        new Date()
      );

    const res =
      await require("../../functions/userAuthorization").checkSpecialCode(code);

    expect(res).toBe(true);
  });

  test("Check previous code", async () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() - 10);
    const code =
      await require("../../functions/userAuthorization").generateCode(date);

    const res =
      await require("../../functions/userAuthorization").checkSpecialCode(code);

    expect(res).toBe(true);
  });

  test("Check bad code", async () => {
    const res =
      await require("../../functions/userAuthorization").checkSpecialCode(
        "wrongCode"
      );

    expect(res).toBe(false);
  });

  test("Check no code", async () => {
    const res =
      await require("../../functions/userAuthorization").checkSpecialCode();

    expect(res).toBe(false);
  });
});
